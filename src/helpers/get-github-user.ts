import axios from 'axios';

const githubApiUrl = 'https://api.github.com';

interface GitHubUser {
  githubId: number;
  login: string;
  name: string;
  avatarUrl: string;
}

export default async function getConnectedUser(accessToken: string): Promise<GitHubUser> {
  const { data } = await axios.get(
    `${githubApiUrl}/user`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    }
  )
  const {
    id: githubId,
    login,
    name,
    avatar_url: avatarUrl
  } = data;
  return {
    githubId,
    login,
    name,
    avatarUrl
  };
}
