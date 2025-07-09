import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/Courses/WebDevNothingToPro/React_app/Build_files",
  plugins: [react()],
  server: {
    open: true,
  },
});
