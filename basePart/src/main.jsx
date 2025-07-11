import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  getData,
  addData,
  cleanAll,
  updateDataCall,
} from "./testingDatabase.js";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
