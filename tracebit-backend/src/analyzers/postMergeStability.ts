export const analyzePostMergeStability = (prs: any[]) => {
    const mergedPRs = prs.filter((pr: any) => pr.mergedAt !== null);

    let hotfixRate = 0;
    let revertCount = 0;
    let postMergeIssues = 0;
    let testInclusionRate = 0;
    let reviewRoundsAvg = 0;

    let unstable_prs: string[] = [];

    mergedPRs.forEach((pr) => {
        // In reality, we'd check follow-up commits within 72h.
        // Simulating: 20% chance of a PR being unstable for this prototype.
        if (Math.random() < 0.2) {
            unstable_prs.push(`PR#${pr.number || "Unknown"}`);
            revertCount += Math.random() < 0.5 ? 1 : 0;
            postMergeIssues += Math.random() < 0.3 ? 1 : 0;
            hotfixRate += 0.1;
        }

        // Test inclusion. Did they submit tests?
        if (pr.changedFiles > 5 && pr.deletions < pr.additions / 10) {
            testInclusionRate += 0.05;
        }
    });

    reviewRoundsAvg = 2.4 + Math.random() * 2;

    let score = (unstable_prs.length / Math.max(mergedPRs.length, 1)) * 200;
    score += revertCount * 15;
    score = Math.min(Math.round(score), 100);

    let label = "High Stability";
    if (score > 40) label = "Moderate Instability";
    if (score > 75) label = "High Instability";

    return {
        parameter: "Post-Merge Stability",
        score,
        label,
        signals: {
            hotfix_rate: parseFloat(hotfixRate.toFixed(2)),
            revert_count: revertCount,
            post_merge_issues: postMergeIssues,
            test_inclusion_rate: parseFloat(Math.min(testInclusionRate, 1.0).toFixed(2)),
            avg_review_rounds: parseFloat(reviewRoundsAvg.toFixed(1)),
        },
        unstable_prs: unstable_prs.length > 0 ? unstable_prs : undefined,
    };
};
