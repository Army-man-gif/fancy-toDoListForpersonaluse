import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Three from "./three.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Three />
  </StrictMode>,
);
