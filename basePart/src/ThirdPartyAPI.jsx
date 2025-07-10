import { useEffect } from "react";
function APIs() {
  useEffect(() => {
    // Create script element dynamically
    const script = document.createElement("script");
    script.src = "https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.js";
    script.async = true;

    script.onload = () => {
      // This runs after the script has loaded
      const map = L.mapquest.map("map", {
        center: [53.480759, -2.242631],
        layers: L.mapquest.tileLayer("map"),
        zoom: 12,
      });
    };

    document.body.appendChild(script);

    // Add the CSS link tag
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest.css";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);
  return <></>;
}

export default APIs;
