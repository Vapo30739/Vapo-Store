import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  process.env.NODE_ENV === "development" ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )
);
