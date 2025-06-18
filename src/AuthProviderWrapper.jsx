import { Auth0Provider } from '@auth0/auth0-react';

const AuthProviderWrapper = ({ children }) => {
  return (
    <Auth0Provider
      domain="dev-uzb48ysvbz1fnqri.us.auth0.com"
      clientId="IwFmxOT9BHG4eCh0cNidGpX9vgyNci7c"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProviderWrapper;
