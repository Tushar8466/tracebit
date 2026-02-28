import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const githubGraphQLAPI = axios.create({
    baseURL: "https://api.github.com/graphql",
    headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
});

export const GET_USER_CONTRIBUTIONS = `
  query GetUserContributions($username: String!) {
    user(login: $username) {
      contributionsCollection {
        totalCommitContributions
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
      pullRequests(first: 100, states: [MERGED, OPEN, CLOSED]) {
        nodes {
          title
          createdAt
          mergedAt
          additions
          deletions
          changedFiles
          commits(first: 50) {
            nodes {
              commit {
                message
                committedDate
                additions
                deletions
              }
            }
          }
        }
      }
    }
  }
`;

export const fetchUserContributions = async (username: string) => {
    const { data } = await githubGraphQLAPI.post("", {
        query: GET_USER_CONTRIBUTIONS,
        variables: { username },
    });
    return data.data;
};
