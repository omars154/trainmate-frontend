import axios from 'axios';

export async function loginWithCredentials(email, password) {
  try {
    const response = await axios.post('https://dev-uzb48ysvbz1fnqri.us.auth0.com/oauth/token', {
      grant_type: 'password',
      username: email,
      password: password,
      audience: 'train-mate-api',
      scope: 'openid profile email',
      client_id: 'IwFmxOT9BHG4eCh0cNidGpX9vgyNci7c',
      client_secret: '7uFQCsjavGn-UjA6eNKr8ojiaXxjCc-bIYi_UAX8R0OPh3-qkWLfrw71qLmrxN82',
      connection: 'Username-Password-Authentication'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data; // { access_token, id_token, etc. }
  } catch (error) {
    console.error('Auth0 login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error_description || 'Login failed');
  }
}
