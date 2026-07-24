import { getResponsiveImage } from "../utils/responsiveImages";

export default function ResponsiveImage({ src, sizes = "(max-width: 760px) 92vw, 33vw", ...props }) {
  const responsive = getResponsiveImage(src);

  return (
    <img
      {...props}
      src={responsive.src}
      srcSet={responsive.srcSet}
      sizes={responsive.srcSet ? sizes : undefined}
    />
  );
}
