import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("releasehub");

  const jiraIssues = await db.collection("jira_issues").find().toArray();
  const github = await db.collection("github_data").find().toArray();

  const totalTickets = jiraIssues.length;

  const doneTickets = jiraIssues.filter(
    (i: any) => i.status === "Done"
  ).length;

  const blockedTickets = jiraIssues.filter(
    (i: any) =>
      i.status.toLowerCase().includes("block")
  ).length;

  const openTickets = totalTickets - doneTickets;

  return Response.json({
    jiraMetrics: {
      totalTickets,
      doneTickets,
      openTickets,
      blockedTickets
    },
    githubMetrics: {
      total: github.length
    }
  });
}
