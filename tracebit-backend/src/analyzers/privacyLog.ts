export const generatePrivacyLog = (username: string, scanId: string, reposAccessed: string[]) => {
    const scannedAt = new Date();
    const expiresAt = new Date(scannedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    return {
        parameter: "Privacy First",
        scan_id: scanId,
        scanned_at: scannedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        data_accessed: ["commits", "pull_requests", "contribution_calendar", "basic_profile"],
        repos_scanned: reposAccessed,
        data_not_stored: ["raw_code", "diffs", "email", "private_repos"],
        compliance: "GDPR-friendly | Ephemeral Processing",
    };
};
