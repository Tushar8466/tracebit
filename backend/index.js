const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Helper function to fetch using GraphQL
async function fetchGraphQL(query, variables, token) {
    if (!token) {
        throw new Error("GITHUB_TOKEN is missing");
    }
    const response = await axios.post(
        'https://api.github.com/graphql',
        { query, variables },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (response.data.errors) {
        console.error("GraphQL Errors:", response.data.errors);
        throw new Error(response.data.errors[0].message);
    }
    return response.data.data;
}

app.get('/api/contributors', async (req, res) => {
    const { repo } = req.query; // Expecting format "owner/repo"

    // Check if the frontend passed a token
    let token = GITHUB_TOKEN;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split("Bearer ")[1];
    }

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing GitHub Token" });
    }

    if (!repo || !repo.includes('/')) {
        return res.status(400).json({ error: "Please provide a valid repo parameter in the format 'owner/repo'" });
    }

    const [owner, name] = repo.split('/');

    try {
        // 1. Fetch contributors via REST API
        // REST is often simpler to get a flat list of direct contributors
        const restResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/contributors?per_page=100`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        const restContributors = restResponse.data;

        // 2. Fetch specific repository stats via GraphQL (e.g. total commit count from default branch)
        // This is where GraphQL shines - grabbing deeply nested associated data
        const graphqlQuery = `
            query ($owner: String!, $name: String!) {
              repository(owner: $owner, name: $name) {
                defaultBranchRef {
                  target {
                    ... on Commit {
                      history(first: 1) {
                        totalCount
                      }
                    }
                  }
                }
              }
            }
        `;

        const graphqlData = await fetchGraphQL(graphqlQuery, { owner, name }, token);
        const totalCommits = graphqlData.repository?.defaultBranchRef?.target?.history?.totalCount || 0;

        // Combine the detailed contributor data from REST with the high-level repository stats from GraphQL
        const contributors = restContributors.map(c => ({
            id: c.id,
            login: c.login,
            avatar_url: c.avatar_url,
            profile_url: c.html_url,
            contributions: c.contributions,
            percentage: totalCommits > 0 ? ((c.contributions / totalCommits) * 100).toFixed(2) : "0.00"
        }));

        res.json({
            repo: {
                owner,
                name,
                totalCommits
            },
            contributors
        });

    } catch (error) {
        console.error("Error fetching contributors:", error.message);
        res.status(500).json({ error: "Failed to fetch contributors. " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/contributors?repo=torvalds/linux`);
});
