"use server";

export async function getGitHubContributions() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username || token === "your_github_personal_access_token") {
    console.warn("GitHub token or username is missing. Please update .env.local");
    return null;
  }

  const headers = {
    Authorization: `bearer ${token}`,
  };

  const body = {
    query: `query {
      user(login: "${username}") {
        repositories {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }`
  };

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    const data = await response.json();
    if (data?.data?.user) {
      return {
        calendar: data.data.user.contributionsCollection.contributionCalendar,
        repoCount: data.data.user.repositories.totalCount,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return null;
  }
}
