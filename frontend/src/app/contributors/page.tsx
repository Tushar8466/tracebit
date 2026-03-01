"use client";

import { useState } from "react";
import { IconSearch, IconBrandGithub, IconUsers, IconActivity } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { BackgroundLines } from "@/components/ui/background-lines";

interface Contributor {
    id: number;
    login: string;
    avatar_url: string;
    profile_url: string;
    contributions: number;
    percentage: string;
}

interface RepoData {
    owner: string;
    name: string;
    totalCommits: number;
}

export default function ContributorsPage() {
    const { data: session } = useSession();
    const [repoInput, setRepoInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [contributors, setContributors] = useState<Contributor[] | null>(null);
    const [repoData, setRepoData] = useState<RepoData | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!repoInput.trim() || !repoInput.includes("/")) {
            setError("Please enter a valid format: owner/repo");
            return;
        }

        setLoading(true);
        setError("");
        setContributors(null);
        setRepoData(null);

        try {
            const headers: Record<string, string> = {};
            // @ts-ignore
            if (session?.accessToken) {
                // @ts-ignore
                headers["Authorization"] = `Bearer ${session.accessToken}`;
            }

            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4001";
            const res = await fetch(`${backendUrl}/api/contributors?repo=${repoInput.trim()}`, {
                headers
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch data");
            }

            setContributors(data.contributors);
            setRepoData(data.repo);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BackgroundLines className="min-h-screen bg-black flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative w-full h-auto">
            <div className="w-full max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
                            <IconUsers className="w-10 h-10 text-emerald-500" />
                            Repository Contributors
                        </h1>
                        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                            Lookup any GitHub repository to analyze contributors. Data is combined from GitHub REST API and GraphQL API for deep dive metrics.
                        </p>
                    </motion.div>
                </div>

                <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-16 relative">
                    <IconBrandGithub className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                        type="text"
                        value={repoInput}
                        onChange={(e) => setRepoInput(e.target.value)}
                        placeholder="owner/repo (e.g. facebook/react)"
                        className="w-full pl-12 pr-32 py-4 bg-neutral-900 border border-neutral-700 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading || !repoInput.trim()}
                        className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                    >
                        {loading ? "Searching..." : (
                            <>
                                <IconSearch className="w-4 h-4" />
                                Search
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <div className="max-w-xl mx-auto p-4 mb-8 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-center">
                        {error}
                    </div>
                )}

                {repoData && contributors && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <IconBrandGithub className="w-6 h-6 text-neutral-400" />
                                    {repoData.owner} / <span className="text-emerald-400">{repoData.name}</span>
                                </h2>
                                <p className="text-neutral-500 mt-1">Fetched {contributors.length} top contributors via REST API</p>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-black rounded-lg border border-neutral-800">
                                <IconActivity className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <div className="text-xs text-neutral-500 uppercase font-bold">Total Commits (GraphQL)</div>
                                    <div className="text-xl font-mono text-white">{repoData.totalCommits.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contributors.map((c, i) => (
                                <a
                                    key={c.id}
                                    href={c.profile_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all flex items-start gap-4"
                                >
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700 group-hover:border-emerald-500/50 transition-colors">
                                        <img src={c.avatar_url} alt={c.login} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                                            {c.login}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-neutral-400">
                                            <span>{c.contributions} commits</span>
                                            <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                                            <span className="font-mono text-emerald-500">{c.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-3 overflow-hidden">
                                            <div
                                                className="bg-emerald-500 h-1.5 rounded-full"
                                                style={{ width: `${Math.min(100, Math.max(1, parseFloat(c.percentage)))}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </BackgroundLines>
    );
}
