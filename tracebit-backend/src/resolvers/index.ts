import { getBasicProfile, getPublicRepos, getRepoCommits, getPullRequests } from "../github/restClient";
import { fetchUserContributions } from "../github/graphqlClient";
import { analyzeAILikelihood } from "../analyzers/aiLikelihood";
import { analyzeStyleDrift } from "../analyzers/styleDrift";
import { analyzePostMergeStability } from "../analyzers/postMergeStability";
import { analyzeOwnershipConfidence } from "../analyzers/ownershipConfidence";
import { analyzeAiInfluenceTrend } from "../analyzers/aiInfluenceTrend";
import { generatePrivacyLog } from "../analyzers/privacyLog";
import { randomUUID } from "crypto";

export const typeDefs = `#graphql
  type Query {
    scanUser(username: String!): ScanResult
  }

  type ScanResult {
    username: String!
    scan_id: String!
    scanned_at: String!
    overall_ai_risk_score: Int!
    overall_label: String!
    parameters: JSON
    recommendations: [String]
  }

  scalar JSON
`;

export const resolvers = {
    Query: {
        scanUser: async (_: any, { username }: { username: string }) => {
            console.log(`[TraceBit] Scanning user: ${username}`);
            const scanId = \`trace_\${randomUUID()}\`;
      
      try {
        // Fetch raw data in parallel
        const [profile, repos, graphqlStats] = await Promise.all([
          getBasicProfile(username),
          getPublicRepos(username),
          fetchUserContributions(username).catch(() => null)
        ]);

        const recentRepos = repos.slice(0, 5); // Limit for mock performance
        let allCommits: any[] = [];
        let allPRs: any[] = [];
        let reposAccessed: string[] = [];

        for (const repo of recentRepos) {
          reposAccessed.push(repo.full_name);
          try {
            const commits = await getRepoCommits(repo.owner.login, repo.name, username);
            const prs = await getPullRequests(repo.owner.login, repo.name);
            allCommits.push(...commits.slice(0, 20)); // Limit payload sizes
            allPRs.push(...prs);
          } catch (e) {
            console.error(\`Skip repo \${repo.name}\`);
          }
        }

        // Run ML constraints and modules in parallel
        const [
          aiLikelihood,
          styleDrift,
          postMergeStability,
          ownershipConfidence,
          aiInfluenceTrend
        ] = await Promise.all([
          analyzeAILikelihood(allCommits, allPRs),
          analyzeStyleDrift(allCommits),
          analyzePostMergeStability(allPRs),
          analyzeOwnershipConfidence(graphqlStats?.user?.contributionsCollection),
          analyzeAiInfluenceTrend(graphqlStats?.user?.contributionsCollection?.contributionCalendar, allCommits)
        ]);

        const privacyLog = generatePrivacyLog(username, scanId, reposAccessed);

        // Calculate overall score (weighted average)
        const totalScore = Math.round(
          (aiLikelihood.score * 0.35) + 
          (styleDrift.score * 0.2) + 
          (postMergeStability.score * 0.2) + 
          ((100 - ownershipConfidence.score) * 0.15) + 
          (aiInfluenceTrend.score * 0.1)
        );

        let overallLabel = "Low AI Influence Detected";
        if (totalScore > 50) overallLabel = "Moderate AI Influence Detected";
        if (totalScore > 75) overallLabel = "High AI Influence Detected";
        
        const recommendations = [];
        if (aiLikelihood.score > 70) recommendations.push("High commit similarity detected — review PR diffs manually.");
        if (postMergeStability.score > 60) recommendations.push("High post-merge instability — enforce strict CI/CD test coverage checks.");
        if (styleDrift.score > 70) recommendations.push("Significant stylistic drift observed. Possible Copilot or generic LLM copy-pasting.");

        return {
          username,
          scan_id: scanId,
          scanned_at: privacyLog.scanned_at,
          overall_ai_risk_score: totalScore,
          overall_label: overallLabel,
          parameters: {
            ai_likelihood_score: aiLikelihood,
            style_drift_indicator: styleDrift,
            post_merge_stability: postMergeStability,
            ownership_confidence: ownershipConfidence,
            repository_ai_influence_trend: aiInfluenceTrend,
            privacy_log: privacyLog
          },
          recommendations
        };

      } catch (error: any) {
        console.error("Scan Failed:", error.message);
        throw new Error("Failed to run tracebit scan on user.");
      }
    },
  }
};
