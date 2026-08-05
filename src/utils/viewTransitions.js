export const SHARED_ARTWORK_TRANSITION = "artwork-shared";

export function prepareArtworkTransition(event) {
  if (typeof document === "undefined" || !("startViewTransition" in document)) {
    return;
  }

  const visual = event.currentTarget.querySelector(".artwork-diptych, .artwork-image");
  if (!visual) return;

  const image = visual.matches("img") ? visual : visual.querySelector("img");
  if (image && Math.max(image.naturalWidth, image.naturalHeight) < 720) {
    return;
  }

  visual.style.viewTransitionName = SHARED_ARTWORK_TRANSITION;
  visual.style.contain = "paint";
}

export function getArtworkTransitionState(path) {
  return { sharedArtwork: path };
}
