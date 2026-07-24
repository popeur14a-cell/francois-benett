import { Children, isValidElement, useEffect } from "react";

function textContent(children) {
  return Children.toArray(children)
    .map((child) => (typeof child === "string" || typeof child === "number" ? child : ""))
    .join("");
}

export function Helmet({ children }) {
  useEffect(() => {
    const restorations = [];
    const created = [];

    const rememberAttribute = (element, attribute, value) => {
      const previous = element.getAttribute(attribute);
      restorations.push(() => {
        if (previous === null) element.removeAttribute(attribute);
        else element.setAttribute(attribute, previous);
      });
      element.setAttribute(attribute, value);
    };

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === "title") {
        const previous = document.title;
        document.title = textContent(child.props.children);
        restorations.push(() => {
          document.title = previous;
        });
        return;
      }

      if (child.type === "html" && child.props.lang) {
        rememberAttribute(document.documentElement, "lang", child.props.lang);
        return;
      }

      if (child.type === "meta") {
        const selector = child.props.name
          ? `meta[name="${CSS.escape(child.props.name)}"]`
          : child.props.property
            ? `meta[property="${CSS.escape(child.props.property)}"]`
            : null;
        let element = selector ? document.head.querySelector(selector) : null;
        if (!element) {
          element = document.createElement("meta");
          document.head.appendChild(element);
          created.push(element);
        }
        for (const attribute of ["name", "property", "content"]) {
          if (child.props[attribute] !== undefined) {
            rememberAttribute(element, attribute, String(child.props[attribute]));
          }
        }
        return;
      }

      if (child.type === "link") {
        const selector = child.props.rel === "canonical"
          ? 'link[rel="canonical"]'
          : `link[rel="${CSS.escape(child.props.rel || "")}"][href="${CSS.escape(child.props.href || "")}"]`;
        let element = document.head.querySelector(selector);
        if (!element) {
          element = document.createElement("link");
          document.head.appendChild(element);
          created.push(element);
        }
        for (const [property, attribute] of [["rel", "rel"], ["href", "href"], ["hrefLang", "hreflang"]]) {
          if (child.props[property] !== undefined) {
            rememberAttribute(element, attribute, String(child.props[property]));
          }
        }
        return;
      }

      if (child.type === "script" && child.props.type === "application/ld+json") {
        const element = document.createElement("script");
        element.type = "application/ld+json";
        element.dataset.runtimeMeta = "true";
        element.textContent = textContent(child.props.children);
        document.head.appendChild(element);
        created.push(element);
      }
    });

    return () => {
      created.forEach((element) => element.remove());
      restorations.reverse().forEach((restore) => restore());
    };
  }, [children]);

  return null;
}
