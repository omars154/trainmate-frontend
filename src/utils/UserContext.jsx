import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = {
      id: localStorage.getItem('user_id'),
      role: localStorage.getItem('role'),
      email: localStorage.getItem('user_email'),
      name: localStorage.getItem('user_name'),
    };

    if (storedUser.id && storedUser.role && storedUser.email) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_name', user.name || '');
    }
  }, [user]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
