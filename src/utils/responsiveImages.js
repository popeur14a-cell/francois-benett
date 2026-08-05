export function getResponsiveImage(path) {
  if (!path?.startsWith("/images/")) {
    return { src: path };
  }

  if (path.includes("/images/hero/benett-cover")) {
    return {
      src: "/images/hero/benett-cover-1280.webp",
      srcSet: "/images/hero/benett-cover-640.webp 640w, /images/hero/benett-cover-960.webp 960w, /images/hero/benett-cover-1280.webp 1280w",
    };
  }

  const extensionIndex = path.lastIndexOf(".");
  if (extensionIndex === -1) {
    return { src: path };
  }

  const basePath = path.slice("/images/".length, extensionIndex);
  const responsiveBase = `/images/responsive/${basePath}`;

  return {
    src: `${responsiveBase}-1280.webp`,
    srcSet: `${responsiveBase}-480.webp 480w, ${responsiveBase}-640.webp 640w, ${responsiveBase}-960.webp 960w, ${responsiveBase}-1280.webp 1280w`,
  };
}
