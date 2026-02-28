import { classifyCodeDiff } from "../ml/mlClient";

export const analyzeAILikelihood = async (commits: any[], prs: any[]) => {
    let flagged_commits: string[] = [];
    let modelConfidences: number[] = [];
    let totalEntropy = 0;
    let boilerplateMatches = 0;

    // Simple heuristic for boilerplate matching:
    const boilerplatePhrases = [
        "Here is the code",
        "Sure, here's",
        "Certainly",
        "I have implemented",
        "As an AI",
    ];

    for (const commit of commits.slice(0, 30)) {
        // Check commit messages for AI boilerplate
        const message = commit.commit.message || "";
        if (boilerplatePhrases.some((phrase) => message.includes(phrase))) {
            boilerplateMatches++;
            flagged_commits.push(commit.sha);
        }

        // In a real scenario, we would parse the diff from the commit.
        // For this mock, we pass the commit message or simulated diff to the ML model.
        const diffText = message;
        const classification = await classifyCodeDiff(diffText);
        modelConfidences.push(classification.confidence);

        // Simulate entropy (randomized for now between 2.0 and 4.5)
        totalEntropy += Math.random() * 2.5 + 2.0;
    }

    const avgConfidence =
        modelConfidences.length > 0
            ? modelConfidences.reduce((a, b) => a + b, 0) / modelConfidences.length
            : 0;

    const avgEntropy = commits.length > 0 ? totalEntropy / commits.length : 3.0;

    // Calculate final score based on ML confidence + heuristics
    let score = avgConfidence * 100;
    if (boilerplateMatches > 2) score += 20;

    score = Math.min(Math.round(score), 100);

    let label = "Low AI Influence";
    if (score > 80) label = "Highly Likely AI-Generated";
    else if (score > 50) label = "Moderate AI Influence";

    return {
        parameter: "AI Likelihood Score",
        score,
        label,
        signals: {
            avg_token_entropy: parseFloat(avgEntropy.toFixed(2)),
            comment_to_code_ratio: 0.35, // Simulated
            naming_uniformity: 0.88, // Simulated
            boilerplate_frequency: parseFloat((boilerplateMatches / Math.max(1, commits.length)).toFixed(2)),
            model_confidence_avg: parseFloat(avgConfidence.toFixed(2)),
        },
        flagged_commits: flagged_commits.length > 0 ? flagged_commits : undefined,
    };
};
