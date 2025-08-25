import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProduction = process.env.NODE_ENV === "production";

// https://vite.dev/config/
export default defineConfig({
  base: isProduction ? "/fancy-toDoListForpersonaluse/docs/" : "/",
  plugins: [react()],
});
