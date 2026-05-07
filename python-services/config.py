import os
from dotenv import load_dotenv

load_dotenv()

# Jira configuration
JIRA_BASE_URL = os.getenv("JIRA_BASE_URL")
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")
JIRA_PROJECT_KEYS = os.getenv("JIRA_PROJECT_KEYS", "")

# GitHub configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_OWNER = os.getenv("GITHUB_OWNER")
GITHUB_REPO = os.getenv("GITHUB_REPO")
GITHUB_RELEASE_BRANCH = os.getenv("GITHUB_RELEASE_BRANCH", "main")
