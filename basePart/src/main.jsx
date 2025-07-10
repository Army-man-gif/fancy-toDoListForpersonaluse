import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Database from "./testingDatabse.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Database />
  </StrictMode>,
);
