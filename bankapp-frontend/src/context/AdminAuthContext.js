import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem("adminEmail"));

  useEffect(() => {
    const stored = localStorage.getItem("adminEmail");
    if (stored) setAdminEmail(stored);
  }, []);

  const adminLogin = (email) => {
    localStorage.setItem("adminEmail", email);
    setAdminEmail(email);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminEmail");
    setAdminEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminEmail, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
