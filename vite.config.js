import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: "0.0.0.0", // Set to your NodeMCU's IP address
  //   port: 3001, // You can use a different port if needed
  // },
});
