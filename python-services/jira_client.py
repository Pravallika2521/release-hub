import requests
from config import JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEYS

def fetch_jira_issues():
    if not JIRA_PROJECT_KEYS:
        return []

    project_list = ",".join(
        [key.strip() for key in JIRA_PROJECT_KEYS.split(",")]
    )

    jql = f"project IN ({project_list})"

    url = f"{JIRA_BASE_URL}/rest/api/3/search"
    auth = (JIRA_EMAIL, JIRA_API_TOKEN)

    params = {
        "jql": jql,
        "fields": "status"
    }

    response = requests.get(url, auth=auth, params=params)
    response.raise_for_status()

    return response.json().get("issues", [])
