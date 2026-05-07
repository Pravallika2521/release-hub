import requests
from config import GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}"
}

def fetch_commits():
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/commits"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()
``
