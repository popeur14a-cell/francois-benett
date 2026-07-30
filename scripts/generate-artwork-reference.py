import colorsys
import json
import re
import subprocess
import unicodedata
from collections import Counter
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
REFERENCE_OUTPUT = ROOT / "docs" / "artwork-reference.json"
SEARCH_OUTPUT = ROOT / "src" / "data" / "artworkSearchMetadata.js"
COLOR_OUTPUT = ROOT / "src" / "data" / "artworkColorMetadata.js"


def normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value or "")
    return "".join(
        character for character in decomposed if unicodedata.category(character) != "Mn"
    ).lower()


def detect_colors(image: Image.Image) -> list[dict]:
    sample = image.convert("RGB")
    sample.thumbnail((96, 96), Image.Resampling.LANCZOS)
    counts = Counter()
    total = sample.width * sample.height

    for red, green, blue in sample.get_flattened_data():
        hue, saturation, value = colorsys.rgb_to_hsv(
            red / 255, green / 255, blue / 255
        )
        degrees = hue * 360

        if value < 0.2:
            counts["noir"] += 1
        elif value > 0.84 and saturation < 0.14:
            counts["blanc"] += 1
        elif saturation < 0.14:
            counts["gris"] += 1
        elif degrees < 15 or degrees >= 345:
            counts["rouge"] += 1
        elif degrees < 45:
            counts["orange"] += 1
        elif degrees < 70:
            counts["jaune"] += 1
        elif degrees < 170:
            counts["vert"] += 1
        elif degrees < 260:
            counts["bleu"] += 1
        elif degrees < 300:
            counts["violet"] += 1
        else:
            counts["rose"] += 1

    return [
        {"name": color, "share": round(count / total, 3)}
        for color, count in counts.most_common()
        if count / total >= 0.12
    ][:4]


def analyze_visual_character(image: Image.Image) -> dict:
    sample = image.convert("RGB")
    sample.thumbnail((160, 160), Image.Resampling.LANCZOS)
    pixels = list(sample.get_flattened_data())
    hsv_pixels = [
        colorsys.rgb_to_hsv(red / 255, green / 255, blue / 255)
        for red, green, blue in pixels
    ]
    grayscale = sample.convert("L")
    luminance = ImageStat.Stat(grayscale)
    edge_image = grayscale.filter(ImageFilter.FIND_EDGES)
    edge_pixels = list(edge_image.get_flattened_data())
    edge_density = sum(value >= 36 for value in edge_pixels) / len(edge_pixels)
    mean_saturation = sum(saturation for _, saturation, _ in hsv_pixels) / len(
        hsv_pixels
    )
    mean_warmth = sum((red - blue) / 255 for red, _, blue in pixels) / len(pixels)
    lightness = luminance.mean[0] / 255
    contrast_value = luminance.stddev[0] / 255

    temperature = (
        "palette chaude"
        if mean_warmth >= 0.055
        else "palette froide"
        if mean_warmth <= -0.055
        else "palette équilibrée"
    )
    contrast = (
        "contraste fort"
        if contrast_value >= 0.23
        else "contraste doux"
        if contrast_value <= 0.14
        else "contraste modéré"
    )
    saturation = (
        "couleurs vives"
        if mean_saturation >= 0.43
        else "couleurs douces"
        if mean_saturation <= 0.24
        else "couleurs nuancées"
    )
    luminosity = (
        "ambiance lumineuse"
        if lightness >= 0.68
        else "ambiance sombre"
        if lightness <= 0.38
        else "lumière intermédiaire"
    )
    visual_density = (
        "composition très détaillée"
        if edge_density >= 0.23
        else "composition épurée"
        if edge_density <= 0.12
        else "composition équilibrée"
    )

    return {
        "luminance": round(lightness, 3),
        "contrast": round(contrast_value, 3),
        "saturation": round(mean_saturation, 3),
        "warmth": round(mean_warmth, 3),
        "edge_density": round(edge_density, 3),
        "tags": [
            temperature,
            contrast,
            saturation,
            luminosity,
            visual_density,
        ],
    }


def inspect_image(public_path: str) -> dict:
    disk_path = PUBLIC / public_path.removeprefix("/")
    with Image.open(disk_path) as source:
        width, height = source.size
        color_profile = detect_colors(source)
        visual_character = analyze_visual_character(source)

    ratio = width / height
    orientation = (
        "carré"
        if 0.92 <= ratio <= 1.08
        else "paysage"
        if ratio > 1
        else "portrait"
    )
    return {
        "file": public_path,
        "pixels": {"width": width, "height": height},
        "orientation": orientation,
        "colors": [entry["name"] for entry in color_profile],
        "color_profile": color_profile,
        "visual_character": visual_character,
    }


def get_format_tags(dimensions: str, diptych: bool) -> list[str]:
    if diptych:
        return ["diptyque", "deux panneaux", "grand format"]

    figure_match = re.search(r"(25|40|50)\s*f", dimensions, re.IGNORECASE)
    values = [int(value) for value in re.findall(r"\d+", dimensions)]
    largest = (
        {"25": 81, "40": 100, "50": 116}[figure_match.group(1)]
        if figure_match
        else max(values, default=0)
    )
    tags = []
    if largest >= 100:
        tags.append("grand format")
    elif largest and largest <= 60:
        tags.append("petit format")
    elif largest:
        tags.append("format moyen")

    if len(values) >= 2:
        ratio = values[0] / values[1]
        tags.append(
            "carré"
            if 0.92 <= ratio <= 1.08
            else "paysage"
            if ratio > 1
            else "portrait"
        )
    return tags


def semantic_tags(artwork: dict) -> tuple[list[str], list[str], list[str]]:
    title = normalize(artwork["titre"])
    collection_id = artwork["collectionId"]
    subjects = []
    people = []
    actions = []

    if re.search(
        r"oiseau|colombe|mesange|roitelet|chat|siamois|poisson|billy|oeuf",
        title,
    ):
        subjects.extend(["animal", "faune"])
    if re.search(r"cavaliere|amazone|etendard", title):
        subjects.extend(["animal", "cheval", "équestre"])
        actions.append("monter à cheval")
    if re.search(r"violon|violoncelle|trompette|tambour|cornemuse|concerto", title):
        subjects.extend(["musique", "instrument"])
        actions.append("jouer de la musique")
    if re.search(r"bouquet|fleur|nature morte|grenadine", title):
        subjects.extend(["fleurs", "nature morte"])
    if collection_id == "tango":
        subjects.append("danse")
        people.extend(["femme", "homme", "couple"])
        actions.append("danser")
    if collection_id == "clowns":
        subjects.extend(["clown", "spectacle", "personnage"])
    if collection_id in {"messagers", "scene-d-intimite", "clowns"}:
        subjects.extend(["figure", "personnage"])
    if collection_id in {"amsterdam", "espagne", "maroc", "paris", "venise"}:
        subjects.extend(["lieu", "voyage"])
    if collection_id in {"amsterdam", "paris", "venise"}:
        subjects.append("ville")
    if re.search(
        r"andalouse|amazone|cavaliere|odalisque|diva|violoniste|modele|marionnettiste|bretonne",
        title,
    ):
        people.extend(["femme", "personnage"])
    if re.search(r"joueur|parieur|messager|tambour|trio|dresseur", title):
        people.extend(["homme", "personnage"])
    if re.search(r"attente|repos", title):
        actions.append("attendre")
    if re.search(r"the|cafe|flore|procope", title):
        actions.extend(["boire", "échanger"])
    if re.search(r"joueur|parieur|cartes", title):
        actions.append("jouer")
    if "marionnettiste" in title:
        actions.append("manipuler une marionnette")
    if "modele" in title:
        actions.append("poser")

    # Visual review of the ten collection contact sheets.
    if collection_id == "amsterdam":
        subjects.extend(["canal", "architecture", "parapluie", "pluie"])
        people.extend(["femme", "homme", "couple"])
        actions.append("marcher")
    elif collection_id == "bretonnes":
        subjects.extend(["coiffe bretonne", "costume traditionnel"])
        people.extend(["femme", "groupe"])
        if "billy" in title:
            subjects.extend(["chien", "livre"])
            actions.append("lire")
    elif collection_id == "espagne":
        subjects.extend(["coiffe", "costume espagnol"])
        people.extend(["femme", "groupe"])
        if "cafe" in title:
            subjects.extend(["café", "table", "tasse"])
            actions.extend(["boire", "échanger"])
        if "flamenco" in title:
            actions.append("danser")
    elif collection_id == "maroc":
        subjects.extend(["coiffe", "costume oriental"])
        people.extend(["femme", "groupe"])
        if "tri des fleurs" in title:
            subjects.extend(["fleurs", "table"])
            actions.append("trier des fleurs")
        if "colombes" in title:
            subjects.extend(["oiseau", "colombe"])
        if "siamois" in title:
            subjects.extend(["chat", "siamois"])
    elif collection_id == "messagers":
        subjects.extend(["cheval", "cavalier", "drapeau", "étendard", "chapeau"])
        people.extend(["personnage", "groupe"])
        actions.append("monter à cheval")
        if "mesange" in title:
            subjects.extend(["oiseau", "mésange"])
    elif collection_id == "clowns":
        subjects.extend(["chapeau pointu", "costume de scène"])
        people.extend(["personnage", "groupe"])
        if "bas de laine" in title:
            subjects.extend(["singe", "violon"])
            actions.append("jouer du violon")
        if "trio" in title:
            subjects.extend(["accordéon", "triangle", "orchestre"])
            actions.append("jouer de la musique")
        if "bulles" in title:
            subjects.append("bulles")
            actions.append("jongler")
        if "inseparables" in title:
            subjects.append("oiseau")
        if "dresseurs" in title:
            subjects.extend(["poisson", "animal", "triangle"])
    elif collection_id == "tango":
        subjects.extend(["bal", "danse de couple"])
        people.extend(["danseur", "danseuse"])
        if any(
            fragment in title
            for fragment in [
                "tango dream",
                "tango in the night",
                "tango love 2",
            ]
        ):
            subjects.append("chapeau")
    elif collection_id == "paris":
        subjects.extend(["café parisien", "scène urbaine"])
        people.append("personnage")
        if any(
            fragment in title
            for fragment in [
                "attente",
                "cafe de flore",
                "confidence",
                "heure du the",
                "rotonde",
                "modeles",
                "montmartre",
                "moulin rouge",
                "nuit parisienne",
                "rencontre",
                "repos",
            ]
        ):
            people.append("femme")
        if any(
            fragment in title
            for fragment in [
                "jeu de cartes",
                "dernieres nouvelles",
                "parieurs",
            ]
        ):
            people.append("homme")
        if any(
            fragment in title
            for fragment in [
                "attente en jaune",
                "jeu de cartes",
                "dernieres nouvelles",
                "parieurs",
            ]
        ):
            subjects.append("chapeau")
        if "dernieres nouvelles" in title or "parieurs" in title:
            subjects.append("journal")
            actions.append("lire")
        if "jeu de cartes" in title:
            subjects.extend(["cartes", "table"])
            actions.append("jouer aux cartes")
    elif collection_id == "venise":
        subjects.extend(["costume vénitien", "personnage"])
        people.extend(["femme", "groupe"])
        if "miroir" in title:
            subjects.extend(
                ["miroir", "masque", "masque vénitien", "flacon", "portrait", "visage"]
            )
            actions.extend(["poser", "se regarder"])
            people.remove("groupe")
        if any(
            fragment in title
            for fragment in [
                "bal des oiseaux",
                "diva",
                "marionnettiste",
                "oeuf bleu",
                "palais des doges",
                "plenitude",
            ]
        ):
            subjects.append("chapeau")
        if "bal des oiseaux" in title:
            subjects.extend(["oiseau", "orchestre", "instrument"])
            actions.append("jouer de la musique")
        if "belle violoniste" in title:
            subjects.extend(["violon", "orchestre"])
            actions.append("jouer du violon")
        if "escale" in title:
            subjects.extend(["architecture", "Venise"])
        if "marionnettiste" in title:
            subjects.append("marionnette")
    elif collection_id == "scene-d-intimite":
        if "nature morte" not in title:
            people.append("personnage")
        if "joueurs" in title:
            people.append("homme")
            subjects.append("chapeau")
        else:
            people.append("femme")
        if any(
            fragment in title
            for fragment in [
                "harmonie jaune",
                "heure du the",
                "tea time",
            ]
        ):
            subjects.append("chapeau")
        if "violoncelliste" in title:
            subjects.extend(["violoncelle", "instrument"])
            actions.append("jouer du violoncelle")
        if "roitelet" in title:
            subjects.extend(["oiseau", "roitelet"])
        if "chat" in title:
            subjects.append("chat")
        if "the" in title or "tea time" in title:
            subjects.extend(["thé", "tasse", "table"])
            actions.extend(["boire", "échanger"])

    return (
        sorted(set(subjects)),
        sorted(set(people)),
        sorted(set(actions)),
    )


def narrative_profile(
    artwork: dict,
    subjects: list[str],
    people: list[str],
    actions: list[str],
) -> tuple[list[str], list[str], list[str]]:
    title = normalize(artwork["titre"])
    collection_id = artwork["collectionId"]
    movement = []
    atmosphere = []
    composition = []

    if any("danser" in action for action in actions) or collection_id == "tango":
        movement.extend(["mouvement dansé", "mouvement dynamique", "rythme"])
    if any("cheval" in action for action in actions):
        movement.extend(["mouvement équestre", "mouvement directionnel", "élan"])
    if any("musique" in action or "violon" in action or "violoncelle" in action for action in actions):
        movement.extend(["mouvement musical", "mouvement gestuel", "rythme"])
    if "marcher" in actions:
        movement.extend(["marche", "mouvement directionnel"])
    if any(
        fragment in " ".join(actions)
        for fragment in ["jongler", "manipuler", "trier", "jouer aux cartes"]
    ):
        movement.append("mouvement gestuel")
    if any(
        fragment in " ".join(actions)
        for fragment in ["attendre", "poser", "lire", "boire", "échanger"]
    ):
        movement.extend(["mouvement calme", "scène contemplative"])
    if not movement:
        movement.append(
            "mouvement calme"
            if collection_id in {"scene-d-intimite", "paris", "venise", "maroc"}
            else "mouvement suggéré"
        )

    if collection_id == "tango":
        atmosphere.extend(["passion", "théâtral", "intensité"])
    elif collection_id == "clowns":
        atmosphere.extend(["théâtral", "poétique", "spectacle"])
    elif collection_id == "messagers":
        atmosphere.extend(["symbolique", "épique", "poétique"])
    elif collection_id == "scene-d-intimite":
        atmosphere.extend(["intimiste", "silencieux", "contemplatif"])
    elif collection_id == "paris":
        atmosphere.extend(["urbain", "narratif", "vie quotidienne"])
    elif collection_id in {"amsterdam", "venise"}:
        atmosphere.extend(["urbain", "voyage", "atmosphérique"])
    elif collection_id in {"espagne", "maroc", "bretonnes"}:
        atmosphere.extend(["tradition", "voyage", "narratif"])

    if "night" in title or "nuit" in title:
        atmosphere.append("nocturne")
    if "attente" in title or "repos" in title or "plenitude" in title:
        atmosphere.extend(["calme", "suspendu"])
    if "passion" in title or "love" in title:
        atmosphere.append("romantique")

    if re.search(r"\b(deux|couple|confidence|rencontre)\b", title):
        composition.append("duo")
    elif re.search(r"\b(trois|trio)\b", title):
        composition.append("trio")
    elif "groupe" in people or re.search(
        r"\b(les|modeles|joueurs|parieurs|messagers|cavalieres|amazones)\b",
        title,
    ):
        composition.append("scène de groupe")
    elif people:
        composition.append("figure solitaire")
    else:
        composition.append("sans personnage")

    if "architecture" in subjects or "ville" in subjects:
        composition.append("composition urbaine")
    if "nature morte" in subjects:
        composition.append("composition d’objets")

    return (
        sorted(set(movement)),
        sorted(set(atmosphere)),
        sorted(set(composition)),
    )


node_script = """
import { getAllArtworks } from "./src/utils/artworks.js";
console.log(JSON.stringify(getAllArtworks()));
"""
node_result = subprocess.run(
    ["node", "--input-type=module", "-e", node_script],
    cwd=ROOT,
    check=True,
    capture_output=True,
    text=True,
    encoding="utf-8",
)
artworks = json.loads(node_result.stdout)
catalog = []
artwork_search_metadata = {}
artwork_color_metadata = {}

for artwork in artworks:
    image_paths = artwork.get("images") or [artwork["image"]]
    image_analysis = [inspect_image(image_path) for image_path in image_paths]
    subjects, people, actions = semantic_tags(artwork)
    movement, atmosphere, composition = narrative_profile(
        artwork, subjects, people, actions
    )
    format_tags = get_format_tags(
        artwork.get("dimensions", ""), artwork.get("diptyque", False)
    )
    declared_orientation = artwork.get("orientation")
    if declared_orientation:
        format_tags = [
            tag for tag in format_tags if tag not in {"carré", "paysage", "portrait"}
        ]
        format_tags.append(declared_orientation)
    search_tags = sorted(
        set(
            format_tags
            + subjects
            + people
            + actions
            + movement
            + atmosphere
            + composition
            + [
                color
                for image_item in image_analysis
                for color in image_item["colors"]
            ]
            + [
                tag
                for image_item in image_analysis
                for tag in image_item["visual_character"]["tags"]
            ]
        )
    )
    artwork_search_metadata[artwork["path"]] = search_tags
    combined_colors = Counter()
    for image_item in image_analysis:
        for color in image_item["color_profile"]:
            combined_colors[color["name"]] += color["share"] / len(image_analysis)
    artwork_color_metadata[artwork["path"]] = [
        [name, round(share, 3)]
        for name, share in combined_colors.most_common()
    ]
    catalog.append(
        {
            "collection": artwork["collectionName"],
            "collection_id": artwork["collectionId"],
            "title": artwork["titre"],
            "url": artwork["path"],
            "declared_dimensions": artwork.get("dimensions", ""),
            "format_tags": format_tags,
            "availability": (
                "collection particulière"
                if artwork.get("collectionParticuliere")
                else "disponible sur demande"
            ),
            "images": image_analysis,
            "subjects": subjects,
            "people": people,
            "actions": actions,
            "movement": movement,
            "atmosphere": atmosphere,
            "composition": composition,
            "search_tags": search_tags,
        }
    )

REFERENCE_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
REFERENCE_OUTPUT.write_text(
    json.dumps(
        {
            "generated_from": [
                "src/data/collectionsData.js",
                "public/images",
            ],
            "artwork_count": len(catalog),
            "analysis_notes": {
                "colors_and_orientation": "Calculated from the image pixels.",
                "visual_character": "Luminance, contrast, saturation, warmth and edge density are measured from every artwork image.",
                "subjects_people_actions": "Curated from titles and collections; use as search aids, not as an art-historical attribution.",
                "movement_atmosphere_composition": "Structured visual reading based on the reviewed images, titles and series; intended for discovery and search.",
            },
            "artworks": catalog,
        },
        ensure_ascii=False,
        indent=2,
    )
    + "\n",
    encoding="utf-8",
)

search_lines = [
    "// Generated by scripts/generate-artwork-reference.py.",
    "export const artworkSearchMetadata = {",
]
for artwork_path, tags in sorted(artwork_search_metadata.items()):
    values = ", ".join(json.dumps(tag, ensure_ascii=False) for tag in tags)
    search_lines.append(f'  "{artwork_path}": [{values}],')
search_lines.extend(["};", ""])
SEARCH_OUTPUT.write_text("\n".join(search_lines), encoding="utf-8")

color_lines = [
    "// Generated by scripts/generate-artwork-reference.py.",
    "export const artworkColorMetadata = {",
]
for artwork_path, colors in sorted(artwork_color_metadata.items()):
    values = ", ".join(
        f"[{json.dumps(name, ensure_ascii=False)}, {share}]"
        for name, share in colors
    )
    color_lines.append(f'  "{artwork_path}": [{values}],')
color_lines.extend(["};", ""])
COLOR_OUTPUT.write_text("\n".join(color_lines), encoding="utf-8")

print(
    f"Generated a reference catalog for {len(catalog)} artworks and "
    f"{len(artwork_search_metadata)} search records."
)
