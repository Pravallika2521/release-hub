import clientPromise from "../../lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("releasehub");

  const jiraData = [
    { key: "DEV-101", status: "Done" },
    { key: "DEV-102", status: "In Progress" },
    { key: "DEV-103", status: "Blocked" }
  ];

  const githubData = [
    { type: "commit", message: "DEV-101 completed" },
    { type: "merged_pr", pr: "DEV-102" },
    { type: "open_pr", pr: "DEV-103" }
  ];

  await db.collection("jira_issues").deleteMany({});
  await db.collection("github_data").deleteMany({});

  await db.collection("jira_issues").insertMany(jiraData);
  await db.collection("github_data").insertMany(githubData);

  return Response.json({
    message: "✅ Sample data inserted"
  });
}
