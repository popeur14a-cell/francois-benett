import { Fragment } from "react";
import { Link } from "react-router-dom";

export function ArtistLink({ className = "", children = "François Benett" }) {
  return (
    <Link to="/parcours" className={`artist-name-link ${className}`.trim()}>
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
