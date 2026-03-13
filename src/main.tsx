import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import App from "./app/App.tsx";
import { ThemeProvider } from "./ThemeContext.tsx"; // Adjust path if needed
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {/* Redirect base URL to the default model */}
        <Route path="/" element={<Navigate to="/model/oil-sales" replace />} />
        {/* Dynamic route for the models */}
        <Route path="/model/:modelId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);