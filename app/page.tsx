"use client";

import { useState } from "react";
import {
  Trophy,
  BarChart3,
  PlayCircle,
  Calendar,
  Timer,
  Gauge,
  AlarmClock,
  Users,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  tournaments as initialTournaments,
  type Tournament,
  type TimeControl,
} from "@/app/data/tournaments";

// ── Types & config ─────────────────────────────────────────────────────────────

type StatusFilter = "all" | "upcoming" | "live" | "full";
type TimeControlFilter = "all" | TimeControl;

const STATUS_CONFIG = {
  live: {
    label: "Ongoing",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10",
  },
  full: {
    label: "Full",
    className: "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/10",
  },
} as const;

const TIME_CONTROL_ICON = {
  Blitz: Timer,
  Rapid: Gauge,
  Classical: AlarmClock,
};

const CARD_GRADIENT = {
  Blitz: "from-emerald-950 to-slate-950",
  Rapid: "from-teal-950 to-slate-950",
  Classical: "from-blue-950 to-slate-950",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  valueClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  valueClass: string;
}) {
  return (
    <Card className="bg-[#0F172A] ring-0 border-[#334155] gap-0 py-0 hover:border-[#4ae176]/30 transition-colors">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-[#a7b6cc] text-[10px] font-bold uppercase tracking-widest mb-1.5">
            {label}
          </p>
          <span className={cn("text-4xl font-bold tabular-nums", valueClass)}>{value}</span>
        </div>
        <div className="w-11 h-11 rounded-full bg-[#1E293B] flex items-center justify-center text-[#a7b6cc]">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-[#a7b6cc] text-[10px] font-bold uppercase tracking-widest mb-2.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant={value === opt.value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full border text-[13px]",
              value === opt.value
                ? "bg-[#334155] text-[#dae2fd] border-[#334155] hover:bg-[#334155]"
                : "text-[#a7b6cc] border-[#334155] hover:bg-[#1E293B] hover:text-[#dae2fd]",
            )}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

type EnrichedTournament = Tournament & { currentCount: number; isJoined: boolean };

function TournamentCard({
  tournament,
  onJoin,
}: {
  tournament: EnrichedTournament;
  onJoin: (id: string) => void;
}) {
  const { id, name, timeControl, startTime, maxPlayers, currentCount, isJoined, status } =
    tournament;

  const isFull = currentCount >= maxPlayers;
  const fillPct = Math.min(100, (currentCount / maxPlayers) * 100);
  const displayStatus = isFull ? "full" : status;
  const statusCfg = STATUS_CONFIG[displayStatus];
  const TimeIcon = TIME_CONTROL_ICON[timeControl];
  const gradient = CARD_GRADIENT[timeControl];
  const barColor =
    fillPct >= 100 ? "bg-red-500" : fillPct >= 80 ? "bg-amber-400" : "bg-[#4ae176]";

  return (
    <Card className="bg-[#0F172A] ring-0 border-[#334155] gap-0 py-0 group hover:border-[#4ae176]/30 transition-all duration-300 hover:-translate-y-1">
      {/* Banner */}
      <div
        className={cn(
          "h-24 relative bg-linear-to-br flex items-center justify-center",
          gradient,
        )}
      >
        <TimeIcon size={40} className="text-white/10" />
        <div className="absolute top-2.5 left-2.5">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] rounded uppercase tracking-wider h-auto py-0.5",
              statusCfg.className,
            )}
          >
            {statusCfg.label}
          </Badge>
        </div>
      </div>

      <CardHeader className="px-4 pt-4 pb-0 gap-0">
        <CardTitle className="text-[15px] font-semibold text-[#dae2fd] group-hover:text-[#4ae176] transition-colors leading-snug">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 py-3 flex-1">
        <div className="space-y-2 text-[13px] text-[#a7b6cc]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <TimeIcon size={13} />
              {timeControl}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDate(startTime)}
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Users size={13} />
            {currentCount} / {maxPlayers} Players
          </span>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 border-0 bg-transparent flex-col items-stretch gap-3">
        {/* Progress bar */}
        <div className="w-full h-1 bg-[#1E293B] rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", barColor)}
            style={{ width: `${fillPct}%` }}
          />
        </div>

        {isFull ? (
          <Button
            disabled
            variant="secondary"
            className="w-full bg-[#1E293B] text-[#a7b6cc] hover:bg-[#1E293B] cursor-not-allowed"
          >
            Registration Closed
          </Button>
        ) : isJoined ? (
          <Button
            disabled
            variant="outline"
            className="w-full border-[#4ae176]/20 bg-[#4ae176]/10 text-[#4ae176] hover:bg-[#4ae176]/10 cursor-not-allowed"
          >
            <CheckCircle2 size={14} />
            Joined
          </Button>
        ) : (
          <Button
            onClick={() => onJoin(id)}
            className="w-full bg-[#4ae176] text-[#003915] hover:bg-[#3dd470] font-bold"
          >
            {status === "live" ? "Join Now" : "Register"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [timeControlFilter, setTimeControlFilter] = useState<TimeControlFilter>("all");
  const [joinCounts, setJoinCounts] = useState<Record<string, number>>({});
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const handleJoin = (id: string) => {
    setJoinCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setJoinedIds((prev) => new Set([...prev, id]));
  };

  const enriched: EnrichedTournament[] = initialTournaments.map((t) => ({
    ...t,
    currentCount: t.playersJoined + (joinCounts[t.id] ?? 0),
    isJoined: joinedIds.has(t.id),
  }));

  const filtered = enriched.filter((t) => {
    const isFull = t.currentCount >= t.maxPlayers;
    const matchesTime = timeControlFilter === "all" || t.timeControl === timeControlFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "full" && isFull) ||
      (statusFilter === "upcoming" && t.status === "upcoming" && !isFull) ||
      (statusFilter === "live" && t.status === "live" && !isFull);
    return matchesTime && matchesStatus;
  });

  const totalActive = enriched.length;
  const ongoing = enriched.filter((t) => t.status === "live").length;
  const upcoming = enriched.filter((t) => t.status === "upcoming").length;

  return (
    <div className="min-h-screen bg-[#020617] text-[#dae2fd] font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1.5">
            <Trophy className="text-[#4ae176]" size={26} />
            <h1 className="text-3xl font-bold tracking-tight">Chess Tournaments</h1>
          </div>
          <p className="text-[#a7b6cc] text-sm">
            Join high-stakes competitive events and rise through the ranks.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Active"
            value={totalActive}
            icon={<BarChart3 size={18} />}
            valueClass="text-[#dae2fd]"
          />
          <StatCard
            label="Ongoing"
            value={ongoing}
            icon={<PlayCircle size={18} />}
            valueClass="text-emerald-400"
          />
          <StatCard
            label="Upcoming"
            value={upcoming}
            icon={<Calendar size={18} />}
            valueClass="text-amber-400"
          />
        </div>

        {/* Filters */}
        <Card className="bg-[#0F172A] ring-0 border-[#334155] gap-0 py-0 mb-8">
          <CardContent className="p-5 space-y-4">
            <FilterRow<StatusFilter>
              label="Filter by Status"
              options={[
                { value: "all", label: "All" },
                { value: "upcoming", label: "Upcoming" },
                { value: "live", label: "Ongoing" },
                { value: "full", label: "Full" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <Separator className="bg-[#334155]" />
            <FilterRow<TimeControlFilter>
              label="Time Control"
              options={[
                { value: "all", label: "All" },
                { value: "Blitz", label: "Blitz" },
                { value: "Rapid", label: "Rapid" },
                { value: "Classical", label: "Classical" },
              ]}
              value={timeControlFilter}
              onChange={setTimeControlFilter}
            />
          </CardContent>
        </Card>

        {/* Results count */}
        <p className="text-[#a7b6cc] text-[11px] uppercase tracking-widest font-bold mb-5">
          {filtered.length} Tournament{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Tournament grid */}
        {filtered.length === 0 ? (
          <Card className="bg-[#0F172A] ring-0 border-[#334155] gap-0 py-0">
            <CardContent className="flex flex-col items-center justify-center py-20 text-[#a7b6cc] gap-3">
              <Trophy size={40} className="opacity-20" />
              <p className="text-sm">No tournaments match your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((t) => (
              <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
