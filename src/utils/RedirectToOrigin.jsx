import { useEffect } from "react";

const RedirectToOrigin = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const origin = "";

    if (window.location.origin === origin) return;

    // Add meta refresh fallback
    const metaTag = document.createElement("meta");
    metaTag.httpEquiv = "refresh";
    metaTag.content = `0;url=${origin}/`;
    document.head.appendChild(metaTag);

    // Add script redirect fallback
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.innerHTML = `window.location.href = "${origin}/"`;
    document.head.appendChild(scriptTag);

    // Clean up on unmount
    return () => {
      document.head.removeChild(metaTag);
      document.head.removeChild(scriptTag);
    };
  }, []);

  return null;
};

export default RedirectToOrigin;

