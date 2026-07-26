import colorsys
import json
import re
import subprocess
import unicodedata
from collections import Counter
from pathlib import Path

from PIL import Image


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


def inspect_image(public_path: str) -> dict:
    disk_path = PUBLIC / public_path.removeprefix("/")
    with Image.open(disk_path) as source:
        width, height = source.size
        color_profile = detect_colors(source)

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
    format_tags = get_format_tags(
        artwork.get("dimensions", ""), artwork.get("diptyque", False)
    )
    search_tags = sorted(
        set(
            format_tags
            + subjects
            + people
            + actions
            + [
                color
                for image_item in image_analysis
                for color in image_item["colors"]
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
                "subjects_people_actions": "Curated from titles and collections; use as search aids, not as an art-historical attribution.",
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
