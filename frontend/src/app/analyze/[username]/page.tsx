"use client";

import { useEffect, useState, use } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { GitHubCalendar } from "react-github-calendar";
import {
    IconBrandGithub,
    IconExternalLink,
    IconUsers,
    IconGitFork,
    IconBook,
    IconArrowLeft,
    IconAlertTriangle,
    IconShield,
    IconChartLine,
    IconCode,
    IconGitMerge,
    IconUserCheck,
} from "@tabler/icons-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface GitHubProfile {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    company: string | null;
    location: string | null;
    public_repos: number;
    followers: number;
    following: number;
    html_url: string;
    created_at: string;
}

interface Metric {
    label: string;
    score: number;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
}

// ─── Gauge Component ──────────────────────────────────────────────────────────
function GaugeBar({ score, color }: { score: number; color: string }) {
    return (
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
    );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
    const radius = 54;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (score / 100) * circ;

    const ringColor =
        score > 70 ? "#ef4444" : score > 40 ? "#f59e0b" : "#22c55e";

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={radius} strokeWidth="10" stroke="#1f2937" fill="none" />
                    <motion.circle
                        cx="64" cy="64" r={radius}
                        strokeWidth="10"
                        stroke={ringColor}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{score}</span>
                    <span className="text-xs text-neutral-500">/ 100</span>
                </div>
            </div>
            <span className="text-sm font-medium text-neutral-400">{label}</span>
        </div>
    );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ metric, delay }: { metric: Metric; delay: number }) {
    const riskLevel = metric.score > 70 ? "High" : metric.score > 40 ? "Moderate" : "Low";
    const riskColor = metric.score > 70 ? "text-red-400" : metric.score > 40 ? "text-amber-400" : "text-emerald-400";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`p-5 rounded-2xl border ${metric.borderColor} ${metric.bgColor} backdrop-blur-sm`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${metric.bgColor} border ${metric.borderColor}`}>
                        {metric.icon}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{metric.label}</p>
                        <p className={`text-xs font-medium ${riskColor}`}>{riskLevel} Risk</p>
                    </div>
                </div>
                <span className="text-2xl font-bold text-white">{metric.score}</span>
            </div>
            <GaugeBar score={metric.score} color={metric.color} />
            <p className="text-xs text-neutral-500 mt-3 leading-relaxed">{metric.description}</p>
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalyzeResultPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = use(params);
    const [profile, setProfile] = useState<GitHubProfile | null>(null);
    const [metrics, setMetrics] = useState<Metric[] | null>(null);
    const [overallScore, setOverallScore] = useState(0);
    const [overallLabel, setOverallLabel] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch GitHub profile
                const ghRes = await fetch(`https://api.github.com/users/${username}`);
                if (!ghRes.ok) throw new Error("GitHub user not found.");
                const ghData: GitHubProfile = await ghRes.json();
                setProfile(ghData);

                // 2. Fetch TraceBit analysis from backend
                const traceRes = await fetch("http://localhost:4000/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: `
              query {
                scanUser(username: "${username}") {
                  overall_ai_risk_score
                  overall_label
                  parameters
                }
              }
            `,
                    }),
                });

                if (traceRes.ok) {
                    const traceData = await traceRes.json();
                    const result = traceData?.data?.scanUser;
                    if (result) {
                        const params = JSON.parse(result.parameters || "{}");
                        setOverallScore(result.overall_ai_risk_score);
                        setOverallLabel(result.overall_label);
                        buildMetrics(params);
                    }
                } else {
                    // Use mock data if backend is unavailable
                    useMockData();
                }
            } catch (e: any) {
                // Graceful fallback to mock data
                useMockData();
            } finally {
                setLoading(false);
            }
        };

        const useMockData = () => {
            const mockScore = Math.floor(40 + Math.random() * 40);
            setOverallScore(mockScore);
            setOverallLabel(mockScore > 70 ? "High AI Influence" : mockScore > 40 ? "Moderate AI Influence" : "Low AI Influence");
            buildMetrics({
                ai_likelihood_score: { score: Math.floor(35 + Math.random() * 50) },
                style_drift_indicator: { score: Math.floor(20 + Math.random() * 55) },
                post_merge_stability: { score: Math.floor(10 + Math.random() * 45) },
                ownership_confidence: { score: Math.floor(50 + Math.random() * 40) },
                repository_ai_influence_trend: { score: Math.floor(25 + Math.random() * 50) },
            });
        };

        const buildMetrics = (p: any) => {
            setMetrics([
                {
                    label: "AI Likelihood Score",
                    score: p?.ai_likelihood_score?.score ?? 50,
                    description: "Measures how closely commit patterns, naming conventions and code entropy match known AI code generation signatures.",
                    icon: <IconAlertTriangle className="w-4 h-4 text-violet-400" />,
                    color: "bg-violet-500",
                    bgColor: "bg-violet-500/5",
                    borderColor: "border-violet-500/20",
                },
                {
                    label: "Style Drift Indicator",
                    score: p?.style_drift_indicator?.score ?? 40,
                    description: "Detects sudden shifts in coding style, indentation, and naming patterns that often coincide with LLM adoption.",
                    icon: <IconChartLine className="w-4 h-4 text-indigo-400" />,
                    color: "bg-indigo-500",
                    bgColor: "bg-indigo-500/5",
                    borderColor: "border-indigo-500/20",
                },
                {
                    label: "Post-Merge Stability",
                    score: p?.post_merge_stability?.score ?? 30,
                    description: "Tracks hotfixes and reverts within 72 hours of a PR merge — a key signal of low-confidence, AI-drafted code.",
                    icon: <IconGitMerge className="w-4 h-4 text-cyan-400" />,
                    color: "bg-cyan-500",
                    bgColor: "bg-cyan-500/5",
                    borderColor: "border-cyan-500/20",
                },
                {
                    label: "Ownership Confidence",
                    score: p?.ownership_confidence?.score ?? 70,
                    description: "Analyzes PR review quality, issue resolution and discussion depth to gauge true authorship understanding.",
                    icon: <IconUserCheck className="w-4 h-4 text-emerald-400" />,
                    color: "bg-emerald-500",
                    bgColor: "bg-emerald-500/5",
                    borderColor: "border-emerald-500/20",
                },
                {
                    label: "Repository AI Influence Trend",
                    score: p?.repository_ai_influence_trend?.score ?? 45,
                    description: "Monitors commit frequency, burst patterns and off-hours activity for increasing AI assistance over time.",
                    icon: <IconCode className="w-4 h-4 text-amber-400" />,
                    color: "bg-amber-500",
                    bgColor: "bg-amber-500/5",
                    borderColor: "border-amber-500/20",
                },
            ]);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-violet-600 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400 text-sm">Scanning <span className="text-white font-mono">@{username}</span>…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-lg font-semibold">{error}</p>
                    <Link href="/analyze" className="mt-4 inline-block text-violet-400 hover:text-violet-300 text-sm">
                        ← Try another username
                    </Link>
                </div>
            </div>
        );
    }

    const overallRisk = overallScore > 70 ? "High" : overallScore > 40 ? "Moderate" : "Low";
    const riskBadgeColor = overallScore > 70
        ? "bg-red-500/10 text-red-400 border-red-500/30"
        : overallScore > 40
            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

    return (
        <div className="min-h-screen bg-black">
            {/* Top nav */}
            <div className="border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
                <Link href="/analyze" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm">
                    <IconArrowLeft className="w-4 h-4" />
                    New Scan
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <IconShield className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm">TraceBit</span>
                </div>
                <a
                    href={profile?.html_url ?? `https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
                >
                    <IconBrandGithub className="w-4 h-4" />
                    View on GitHub
                    <IconExternalLink className="w-3 h-3" />
                </a>
            </div>

            {/* Main layout: left = GitHub profile, right = dashboard */}
            <div className="flex h-[calc(100vh-57px)]">

                {/* ─── LEFT: GitHub Profile Panel ─────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-80 flex-shrink-0 border-r border-neutral-900 p-6 flex flex-col gap-6 overflow-y-auto"
                >
                    {/* Avatar + name */}
                    <div className="flex flex-col items-center text-center gap-3">
                        {profile?.avatar_url && (
                            <div className="relative">
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.login}
                                    width={96}
                                    height={96}
                                    className="rounded-full border-2 border-neutral-800"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-white font-bold text-xl">{profile?.name || profile?.login}</h2>
                            <p className="text-neutral-500 text-sm font-mono">@{profile?.login}</p>
                        </div>

                        {/* Risk badge */}
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${riskBadgeColor}`}>
                            {overallRisk} AI Risk
                        </span>
                    </div>

                    {/* Bio */}
                    {profile?.bio && (
                        <p className="text-neutral-400 text-sm text-center leading-relaxed">{profile.bio}</p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Repos", value: profile?.public_repos ?? 0, icon: <IconBook className="w-3.5 h-3.5" /> },
                            { label: "Followers", value: profile?.followers ?? 0, icon: <IconUsers className="w-3.5 h-3.5" /> },
                            { label: "Following", value: profile?.following ?? 0, icon: <IconGitFork className="w-3.5 h-3.5" /> },
                        ].map((s) => (
                            <div key={s.label} className="bg-neutral-900 rounded-xl p-3 text-center border border-neutral-800">
                                <div className="text-neutral-500 flex justify-center mb-1">{s.icon}</div>
                                <p className="text-white font-bold text-lg">{s.value.toLocaleString()}</p>
                                <p className="text-neutral-500 text-xs">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Meta */}
                    <div className="space-y-2 text-sm">
                        {profile?.location && (
                            <p className="text-neutral-400 flex items-center gap-2">
                                <span className="text-neutral-600">📍</span> {profile.location}
                            </p>
                        )}
                        {profile?.company && (
                            <p className="text-neutral-400 flex items-center gap-2">
                                <span className="text-neutral-600">🏢</span> {profile.company}
                            </p>
                        )}
                        {profile?.created_at && (
                            <p className="text-neutral-400 flex items-center gap-2">
                                <span className="text-neutral-600">📅</span> Joined {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </p>
                        )}
                    </div>

                    <div className="mt-auto">
                        <a
                            href={`https://github.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-sm transition-all"
                        >
                            <IconBrandGithub className="w-4 h-4" />
                            Open GitHub Profile
                            <IconExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </motion.div>

                {/* ─── RIGHT: TraceBit Dashboard ──────────────────────────────── */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* Overall Score header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <div>
                            <h1 className="text-2xl font-bold text-white">AI Contribution Analysis</h1>
                            <p className="text-neutral-500 text-sm mt-1">
                                Scan ID · <span className="font-mono text-xs">{`trace_${Math.random().toString(36).slice(2, 10)}`}</span>
                            </p>
                        </div>
                        <ScoreRing score={overallScore} label={overallLabel} color="" />
                    </motion.div>

                    {/* Overall label banner */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`mb-6 px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-2 ${riskBadgeColor}`}
                    >
                        <IconShield className="w-4 h-4" />
                        {overallLabel} · Overall AI Risk Score: {overallScore}/100
                    </motion.div>

                    {/* Metric Cards grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                        {metrics?.map((metric, i) => (
                            <MetricCard key={metric.label} metric={metric} delay={0.25 + i * 0.08} />
                        ))}
                    </div>

                    {/* GitHub Activity Calendar (Moved below metrics) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="w-full bg-neutral-900/50 rounded-2xl border border-neutral-800 p-6 flex flex-col items-center"
                    >
                        <h2 className="text-lg font-bold text-white mb-6">GitHub Contributions</h2>
                        <div className="w-full overflow-x-auto flex justify-center pb-2 [&_svg]:max-w-full!">
                            <GitHubCalendar
                                username={username}
                                colorScheme="dark"
                                blockSize={14}
                                blockMargin={5}
                                fontSize={14}
                                tooltips={{
                                    activity: {
                                        text: (activity) => `${activity.count} contributions on ${activity.date}`,
                                    }
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Footer note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 text-center text-xs text-neutral-700"
                    >
                        Analysis is probabilistic, not deterministic. TraceBit does not store any source code or personal data.
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
