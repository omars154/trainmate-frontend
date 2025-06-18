import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import AuthProviderWrapper from './AuthProviderWrapper.jsx';
import { UserProvider } from './utils/UserContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProviderWrapper>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProviderWrapper>
  </BrowserRouter>
);

