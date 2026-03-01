import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { IconBrandGithub, IconActivity, IconCode, IconChartLine, IconUserCheck, IconBrain } from "@tabler/icons-react";

interface Repo {
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    language: string;
    updated_at: string;
}

interface RepoMetrics {
    repo: Repo;
    aiLikelihood: number;
    styleDrift: number;
    stability: number;
    ownership: number;
    trend: number;
}

async function getUserRepos(accessToken: string): Promise<Repo[]> {
    const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=10", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        return [];
    }
    return res.json();
}

// Generate deterministic mock metrics based on repo ID
function generateMetrics(repo: Repo): RepoMetrics {
    const seed = repo.id;
    const aiLikelihood = (seed % 60) + 10; // 10% to 69%
    const styleDrift = (seed % 40) + 5; // 5% to 44%
    const stability = 100 - (seed % 30); // 71% to 100%
    const ownership = 100 - (seed % 50); // 51% to 100%
    const trend = (seed % 20) - 10; // -10% to +9%

    return {
        repo,
        aiLikelihood,
        styleDrift,
        stability,
        ownership,
        trend
    };
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/signup");
    }

    // @ts-ignore
    const accessToken = session.accessToken as string;
    // @ts-ignore
    const username = session.username as string | undefined;

    const repos = accessToken ? await getUserRepos(accessToken) : [];
    const reposWithMetrics = repos.map(generateMetrics);

    const averageAI = reposWithMetrics.length ?
        Math.round(reposWithMetrics.reduce((acc, m) => acc + m.aiLikelihood, 0) / reposWithMetrics.length) : 0;

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <IconBrandGithub className="w-10 h-10 text-violet-500" />
                            {session.user.name}&apos;s Dashboard
                        </h1>
                        <p className="text-neutral-400 text-lg">
                            {username ? `@${username}` : session.user.email} • Comprehensive AI Contribution Analysis
                        </p>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-center gap-6">
                        <div>
                            <p className="text-neutral-500 text-sm font-medium mb-1">Global AI Likelihood</p>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold text-white">{averageAI}%</span>
                                <span className="text-violet-500 text-sm font-medium mb-1">Avg Score</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                            <IconBrain className="w-6 h-6 text-violet-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {reposWithMetrics.map((data) => (
                        <div key={data.repo.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-xl font-semibold text-white">{data.repo.name}</h2>
                                        <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-700">
                                            {data.repo.language || "Mixed"}
                                        </span>
                                    </div>
                                    <p className="text-neutral-400 text-sm max-w-2xl line-clamp-1">
                                        {data.repo.description || "No description provided."}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                    <span>Updated {new Date(data.repo.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <MetricCard
                                    title="AI Likelihood"
                                    value={`${data.aiLikelihood}%`}
                                    icon={<IconBrain className="w-5 h-5" />}
                                    color={data.aiLikelihood > 50 ? "text-rose-500" : "text-violet-500"}
                                />
                                <MetricCard
                                    title="Style Drift"
                                    value={`${data.styleDrift}%`}
                                    icon={<IconCode className="w-5 h-5" />}
                                    color={data.styleDrift > 30 ? "text-amber-500" : "text-emerald-500"}
                                />
                                <MetricCard
                                    title="Post-Merge Stability"
                                    value={`${data.stability}%`}
                                    icon={<IconActivity className="w-5 h-5" />}
                                    color={data.stability < 80 ? "text-amber-500" : "text-emerald-500"}
                                />
                                <MetricCard
                                    title="Ownership Confidence"
                                    value={`${data.ownership}%`}
                                    icon={<IconUserCheck className="w-5 h-5" />}
                                    color={data.ownership < 70 ? "text-rose-500" : "text-emerald-500"}
                                />
                                <MetricCard
                                    title="AI Influence Trend"
                                    value={`${data.trend > 0 ? '+' : ''}${data.trend}%`}
                                    icon={<IconChartLine className="w-5 h-5" />}
                                    color={data.trend > 0 ? "text-rose-500" : "text-emerald-500"}
                                />
                            </div>
                        </div>
                    ))}

                    {reposWithMetrics.length === 0 && (
                        <div className="text-center py-20 bg-neutral-900/30 border border-neutral-800 rounded-2xl dash-border">
                            <IconBrandGithub className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-2">No Repositories Found</h3>
                            <p className="text-neutral-500">We couldn&apos;t find any repositories in your GitHub account to analyze.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-black/40 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between group hover:border-neutral-600 transition-colors">
            <div className="flex items-center gap-2 mb-3 text-neutral-400">
                <div className={`${color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    {icon}
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
            </div>
            <div className={`text-2xl font-bold ${color}`}>
                {value}
            </div>
        </div>
    );
}
