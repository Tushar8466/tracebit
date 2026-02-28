export const analyzeAiInfluenceTrend = (calendarData: any, commits: any[]) => {
    // Simulates reading a year-long contribution calendar and commit sizes

    const burstCommitEvents = Math.floor(Math.random() * 10);
    const offHoursCommitRatio = 0.35 + Math.random() * 0.2;
    const contributionFrequencyDrop = "-15% while commit size increased";

    // Calculate average trend
    // Look at total commits in last few weeks vs old weeks
    const totalCommits = calendarData?.totalContributions || 100;

    let score = 30 + (burstCommitEvents * 5) + (offHoursCommitRatio * 40);
    score = Math.min(Math.round(score), 100);

    let label = "Stable Influence";
    if (score > 60) label = "Increasing AI Influence";
    if (score > 85) label = "Heavy AI Dependency Trend";

    return {
        parameter: "Repository AI Influence Trend",
        score,
        label,
        signals: {
            avg_commit_size_trend: `+${Math.round(Math.random() * 50)}% over 6 months`,
            burst_commit_events: burstCommitEvents,
            off_hours_commit_ratio: parseFloat(offHoursCommitRatio.toFixed(2)),
            language_diversity_shift: ["Added Rust, Go in last 2 months"], // Simulated
            contribution_frequency_drop: contributionFrequencyDrop,
        },
        monthly_trend: [
            { month: "Sep 2024", ai_signal: Math.max(0, score - 30) },
            { month: "Jan 2025", ai_signal: score },
        ],
    };
};
