import axios from "axios";

export async function getGitHubCommits() {
  const response = await axios.get(
    `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/commits`,
    {
      headers: {
        "User-Agent": "release-hub-app"
      }
    }
  );

  return response.data.slice(0, 10).map((c: any) => ({
    message: c.commit.message,
    author: c.commit.author.name
  }));
}
