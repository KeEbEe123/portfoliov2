import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

export async function GET() {
  const username = process.env.GITHUB_USERNAME!;
  const token = process.env.GITHUB_TOKEN!;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  /* -------------------------------
     1. Fetch repos (REST)
  -------------------------------- */
  const reposRes = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100`,
    { headers }
  );

  const repos = await reposRes.json();

  let stars = 0;
  const languageCount: Record<string, number> = {};

  for (const repo of repos) {
    stars += repo.stargazers_count || 0;

    if (!repo.languages_url) continue;

    const langRes = await fetch(repo.languages_url, { headers });
    const langs = await langRes.json();

    for (const lang in langs) {
      languageCount[lang] = (languageCount[lang] || 0) + langs[lang];
    }
  }

  const topLanguages = Object.entries(languageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => ({ name }));

  /* -------------------------------
     2. Fetch contributions (GraphQL)
  -------------------------------- */
  const query = `
    query ($login: String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const graphRes = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  const graphData = await graphRes.json();
  const c = graphData.data.user.contributionsCollection;

  /* -------------------------------
     3. Calculate streak
  -------------------------------- */
  const days = c.contributionCalendar.weeks
    .flatMap((w: any) => w.contributionDays)
    .reverse();

  let streak = 0;
  for (const day of days) {
    if (day.contributionCount > 0) streak++;
    else break;
  }

  /* -------------------------------
     4. Response
  -------------------------------- */
  return NextResponse.json({
    totalContributions: c.contributionCalendar.totalContributions,
    streak,
    topLanguages,
    radar: {
      commits: c.totalCommitContributions,
      prs: c.totalPullRequestContributions,
      issues: c.totalIssueContributions,
      reviews: c.totalPullRequestReviewContributions,
      repos: repos.length,
      stars,
    },
  });
}
