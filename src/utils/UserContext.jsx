import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('user_email');
    const name = localStorage.getItem('user_name');

    if (id && role && email) {
      setUser({
        id,
        role,
        email,
        name: name || '',
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user_email', user.email);
      if (user.name) {
        localStorage.setItem('user_name', user.name);
      }
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

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser, UserContext };
