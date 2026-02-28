import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Create an axios instance for the GitHub REST API
export const githubRestAPI = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Accept: "application/vnd.github.v3+json",
        ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
    },
});

export const getBasicProfile = async (username: string) => {
    const { data } = await githubRestAPI.get(`/users/${username}`);
    return data;
};

export const getPublicRepos = async (username: string) => {
    const { data } = await githubRestAPI.get(`/users/${username}/repos?per_page=100`);
    return data;
};

export const getRepoCommits = async (owner: string, repo: string, username: string) => {
    const { data } = await githubRestAPI.get(`/repos/${owner}/${repo}/commits`, {
        params: { author: username, per_page: 100 },
    });
    return data;
};

export const getPullRequests = async (owner: string, repo: string, state: string = "all") => {
    const { data } = await githubRestAPI.get(`/repos/${owner}/${repo}/pulls`, {
        params: { state, per_page: 100 },
    });
    return data;
};

export const getCommitDetails = async (owner: string, repo: string, sha: string) => {
    const { data } = await githubRestAPI.get(`/repos/${owner}/${repo}/commits/${sha}`);
    return data;
};
