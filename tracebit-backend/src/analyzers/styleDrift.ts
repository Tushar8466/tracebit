export const analyzeStyleDrift = (commits: any[]) => {
    // Simulates a sliding window analysis over a user's commits
    // High variance in these metrics indicates AI adoption/style drift

    const mockIndentationConsistency = 0.65;
    const mockLineLengthVariance = 15.2;
    const mockFunctionLengthAvg = 38;
    const mockNamingShiftScore = 0.42;
    const mockWindowSimilarityAvg = 0.61;

    // Let's create a simulated timeline based on the commit dates
    let drift_timeline = [];
    if (commits.length > 0) {
        const start_date = new Date(commits[commits.length - 1].commit.author.date);
        const end_date = new Date(commits[0].commit.author.date);

        // Simulate some window entries
        drift_timeline.push({
            window: start_date.toLocaleString("default", { month: "short", year: "numeric" }),
            similarity: 0.88,
        });
        drift_timeline.push({
            window: end_date.toLocaleString("default", { month: "short", year: "numeric" }),
            similarity: mockWindowSimilarityAvg,
        });
    } else {
        drift_timeline.push({ window: "Now", similarity: 0.99 });
    }

    // Calculate score based on similarity drop
    const drop = drift_timeline[0].similarity - drift_timeline[drift_timeline.length - 1].similarity;
    let score = Math.round(Math.max(0, drop * 150));
    score = Math.min(score, 100);

    let label = "Low Style Drift";
    if (score > 60) label = "Moderate Style Drift Detected";
    if (score > 85) label = "High Style Drift Detected";

    return {
        parameter: "Style Drift Indicator",
        score,
        label,
        signals: {
            indentation_consistency: mockIndentationConsistency,
            avg_line_length_variance: mockLineLengthVariance,
            function_length_avg: mockFunctionLengthAvg,
            naming_shift_score: mockNamingShiftScore,
            window_similarity_avg: mockWindowSimilarityAvg,
        },
        drift_timeline,
    };
};
