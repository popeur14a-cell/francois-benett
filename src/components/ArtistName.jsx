import { Fragment } from "react";
import { Link } from "react-router-dom";
import useLanguage from "../context/useLanguage";
import { getLocalizedPath } from "../utils/localizedPath";

export function ArtistLink({ className = "", children = "François Benett" }) {
  const { language } = useLanguage();

  return (
    <Link to={getLocalizedPath("/parcours", language === "en")} className={`artist-name-link ${className}`.trim()}>
      {children}
    </Link>
  );
}

export function ArtistLinkedText({ children }) {
  if (typeof children !== "string") return children;

  return children.split(/(François Benett|BENETT|Benett)/g).map((part, index) =>
    ["François Benett", "BENETT", "Benett"].includes(part) ? (
      <ArtistLink key={`${part}-${index}`}>{part}</ArtistLink>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    )
  );
}
