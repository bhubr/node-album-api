import axios from 'axios';

async function getAccessToken(code: string): Promise<URLSearchParams> {

  // OAuth2 parameters
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.OAUTH_REDIRECT_URI;
  const tokenUrl = 'https://github.com/login/oauth/access_token';

  const searchParams = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  const payload = searchParams.toString();
  const { data } = await axios.post(tokenUrl, payload, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
  return new URLSearchParams(data);
};

export default getAccessToken;
