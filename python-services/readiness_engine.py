from jira_client import fetch_jira_issues
from github_client import fetch_commits

def calculate_readiness():
    jira_issues = fetch_jira_issues()
    commits = fetch_commits()

    total_tickets = len(jira_issues)
    done_tickets = 0
    blocked_tickets = 0

    for issue in jira_issues:
        status = issue["fields"]["status"]["name"]
        if status == "Done":
            done_tickets += 1
        if status.lower() == "blocked":
            blocked_tickets += 1

    open_tickets = total_tickets - done_tickets
    completion_percent = (
        round((done_tickets / total_tickets) * 100)
        if total_tickets > 0 else 0
    )

    commit_count = len(commits)

    # Readiness score logic
    jira_score = round((done_tickets / max(total_tickets, 1)) * 60)
    github_score = 20 if commit_count > 0 else 0
    penalty = min(open_tickets * 5, 20)

    readiness_score = jira_score + github_score - penalty

    status = "AT_RISK"
    reasons = []

    if blocked_tickets > 0:
        status = "NOT_READY"
        readiness_score = min(readiness_score, 30)
        reasons.append(f"{blocked_tickets} blocker ticket(s) present")

    if commit_count == 0:
        status = "NOT_READY"
        reasons.append("No GitHub commits found")

    if not reasons:
        reasons.append(f"{open_tickets} tickets still open")
        reasons.append("Code changes validated")

    return {
        "jiraMetrics": {
            "totalTickets": total_tickets,
            "doneTickets": done_tickets,
            "openTickets": open_tickets,
            "blockedTickets": blocked_tickets,
            "completionPercent": completion_percent
        },
        "githubMetrics": {
            "commitCount": commit_count
        },
        "readiness": {
            "score": readiness_score,
            "status": status,
            "reasons": reasons
        }
    }
