import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useHref, useNavigate } from "react-router-dom";
import { RouterProvider } from "@heroui/react";
import { AuthProvider } from "./auth.jsx";
import { TemaProvider } from "./tema.jsx";
import App from "./App.jsx";
import "./styles.css";

// - RouterProvider: los enlaces de HeroUI (Link, elementos de menú con href) navegan con
//   React Router en lugar de recargar la página.
// - TemaProvider: tema claro/oscuro (sigue al sistema salvo que el usuario lo cambie).
function Proveedores({ children }) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <TemaProvider>{children}</TemaProvider>
    </RouterProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Proveedores>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Proveedores>
    </BrowserRouter>
  </StrictMode>,
);
