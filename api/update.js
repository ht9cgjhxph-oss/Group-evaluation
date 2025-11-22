export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { group } = JSON.parse(req.body);

  const token = process.env.GITHUB_TOKEN;
  const username = "ht9cgjhxph-oss";
  const repo = "Group-evaluation";
  const filePath = "votes.json";

  const fileRes = await fetch(
    `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const fileData = await fileRes.json();
  const content = JSON.parse(atob(fileData.content));

  content[group]++;

  const updatedContent = btoa(JSON.stringify(content));

  await fetch(
    `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update votes",
        content: updatedContent,
        sha: fileData.sha
      })
    }
  );

  res.status(200).json({ message: "Vote saved successfully" });
}
