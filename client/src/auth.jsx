import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@heroui/react";
import { api } from "./api.js";

const AuthContext = createContext(null);

// Guarda quién tiene la sesión. La cookie httpOnly la maneja el navegador:
// el front solo pregunta a /api/auth/perfil quién es.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    try {
      const data = await api("/auth/perfil");
      setUsuario(data.usuario ?? null);
    } catch {
      setUsuario(null); // 401 = sin sesión; 0 = API caída
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { refrescar(); }, [refrescar]);

  const login = async (email, password) => {
    const data = await api("/auth/login", { method: "POST", body: { email, password } });
    if (!data.usuario) console.warn('[contrato] POST /api/auth/login debería devolver { "usuario": {...} }');
    setUsuario(data.usuario ?? null);
    return data.usuario;
  };

  const logout = async () => {
    try { await api("/auth/logout", { method: "POST" }); } finally { setUsuario(null); }
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout, refrescar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Cierra la sesión, vuelve al login y lo avisa con un toast.
// (Un mensaje en el `state` de la navegación no sirve: si estás en una página protegida,
// RutaProtegida redirige al login a la vez y su state pisa el mensaje.)
export function useCerrarSesion() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return async () => {
    await logout();
    navigate("/login");
    toast.success("Sesión cerrada.");
  };
}
