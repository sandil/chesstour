"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    className:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10",
  },
  upcoming: {
    label: "Upcoming",
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10",
  },
  full: {
    label: "Full",
    className:
      "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/10",
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
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="bg-[#0F172A] ring-0 border-[#334155] gap-0 py-0 hover:border-[#4ae176]/30 transition-colors">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-[#a7b6cc] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              {label}
            </p>
            <span className={cn("text-4xl font-bold tabular-nums", valueClass)}>
              {value}
            </span>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#1E293B] flex items-center justify-center text-[#a7b6cc]">
            {icon}
          </div>
        </CardContent>
      </Card>
    </motion.div>
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

function RollingNumber({ value }: { value: number }) {
  const digits = String(value).split("");
  return (
    <span className="inline-flex overflow-hidden" style={{ lineHeight: 1 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {digits.map((digit, i) => (
          <motion.span
            key={`${digits.length - i}-${digit}`}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="inline-block"
          >
            {digit}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

type EnrichedTournament = Tournament & {
  currentCount: number;
  isJoined: boolean;
};

function TournamentCard({
  tournament,
  onJoin,
}: {
  tournament: EnrichedTournament;
  onJoin: (id: string) => void;
}) {
  const {
    id,
    name,
    timeControl,
    startTime,
    maxPlayers,
    currentCount,
    isJoined,
    status,
  } = tournament;

  const isFull = currentCount >= maxPlayers;
  const fillPct = Math.min(100, (currentCount / maxPlayers) * 100);
  const displayStatus = isFull ? "full" : status;
  const statusCfg = STATUS_CONFIG[displayStatus];
  const TimeIcon = TIME_CONTROL_ICON[timeControl];
  const gradient = CARD_GRADIENT[timeControl];
  const barColor =
    fillPct >= 100
      ? "bg-red-500"
      : fillPct >= 80
        ? "bg-amber-400"
        : "bg-[#4ae176]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
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
              <RollingNumber value={currentCount} /> / {maxPlayers} Players
            </span>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 border-0 bg-transparent flex-col items-stretch gap-3">
          {/* Progress bar */}
          <div className="w-full h-1 bg-[#1E293B] rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                barColor,
              )}
              style={{ width: `${fillPct}%` }}
            />
          </div>

          {isFull ? (
            // <Button
            //   disabled
            //   variant="secondary"
            //   className="w-full bg-[#1E293B] text-[#a7b6cc] hover:bg-[#1E293B] cursor-not-allowed"
            // >
            //   Registration Closed
            // </Button>
            <Button
              onClick={() => onJoin(id)}
              className="bg-[#1E293B] text-[#a7b6cc] hover:bg-[#1E293B] rounded-full font-bold text-sm h-12 relative group overflow-hidden cursor-not-allowed"
            >
              <div className="relative h-5 overflow-hidden">
                <span className="block transition-transform duration-300">
                  Registration Closed
                </span>
                <span className="block absolute inset-0">
                  Registration Closed
                </span>
              </div>
              {/* <span className="w-10 h-10 bg-[#1E293B] text-[#a7b6cc] hover:bg-[#1E293B] flex items-center justify-center rounded-full absolute right-1 z-10 transition-all">
                <b className="relative h-5 overflow-hidden">
                  <ArrowUpRight className="block transition-transform duration-300" />
                  <ArrowUpRight className="block absolute inset-0 translate-full transition-transform duration-300 ease-out" />
                </b>
              </span> */}
            </Button>
          ) : isJoined ? (
            // <Button
            //   disabled
            //   variant="outline"
            //   className="w-full border-[#4ae176]/20 bg-[#4ae176]/10 text-[#4ae176] hover:bg-[#4ae176]/10 cursor-not-allowed"
            // >
            //   <CheckCircle2 size={14} />
            //   Joined
            // </Button>

            <Button className="border-[#4ae176]/20 bg-[#4ae176]/10 text-[#4ae176] hover:bg-[#4ae176]/10 rounded-full font-bold text-sm h-12 pl-6 relative group pr-15 overflow-hidden cursor-not-allowed">
              <div className="relative h-5 overflow-hidden">
                <span className="block ">Joined</span>
                <span className="block absolute inset-0 ">Joined</span>
              </div>
              <span className="w-10 h-10  bg-[#4ae176]/10 text-[#4ae176] hover:bg-[#4ae176]/10 flex items-center justify-center rounded-full absolute right-1 z-10 transition-all">
                <b className="relative h-5 overflow-hidden">
                  <CheckCircle2 className="block " />
                  {/* <CheckCircle2 className="block" /> */}
                </b>
              </span>
            </Button>
          ) : (
            // <Button
            //   onClick={() => onJoin(id)}
            //   className="w-full bg-[#4ae176] text-[#003915] hover:bg-[#3dd470] font-bold"
            // >
            //   {status === "live" ? "Join Now" : "Register"}
            // </Button>
            <Button
              onClick={() => onJoin(id)}
              className="bg-[#4ae176] text-[#003915] hover:bg-[#3dd470] rounded-full font-bold text-sm h-12 pl-6 relative group pr-15 overflow-hidden cursor-pointer"
            >
              <div className="relative h-5 overflow-hidden">
                <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                  {status === "live" ? "Join Now" : "Register"}
                </span>
                <span className="block absolute inset-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
                  {status === "live" ? "Join Now" : "Register"}
                </span>
              </div>
              <span className="w-10 h-10 bg-[#16c347] text-[#003915] hover:bg-[#26bb58] flex items-center justify-center rounded-full absolute right-1 z-10 transition-all">
                <b className="relative h-5 overflow-hidden">
                  <ArrowUpRight className="block transition-transform duration-300 ease-out group-hover:-translate-y-full group-hover:translate-x-full" />
                  <ArrowUpRight className="block absolute inset-0 translate-full transition-transform duration-300 ease-out group-hover:translate-y-0 -translate-x-full translate-y-full group-hover:translate-x-0" />
                </b>
              </span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function Home() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [timeControlFilter, setTimeControlFilter] =
    useState<TimeControlFilter>("all");
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
    const matchesTime =
      timeControlFilter === "all" || t.timeControl === timeControlFilter;
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

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <div className="text-[#dae2fd] font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-1.5">
            <Trophy className="text-[#4ae176]" size={26} />
            <h1 className="text-3xl font-bold tracking-tight">
              Chess Tournaments
            </h1>
          </div>
          <p className="text-[#a7b6cc] text-sm">
            Join high-stakes competitive events and rise through the ranks.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              label: "Total Active",
              value: totalActive,
              icon: <BarChart3 size={18} />,
              valueClass: "text-[#dae2fd]",
            },
            {
              label: "Ongoing",
              value: ongoing,
              icon: <PlayCircle size={18} />,
              valueClass: "text-emerald-400",
            },
            {
              label: "Upcoming",
              value: upcoming,
              icon: <Calendar size={18} />,
              valueClass: "text-amber-400",
            },
          ].map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
        >
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
        </motion.div>

        {/* Results count */}
        <motion.p
          className="text-[#a7b6cc] text-[11px] uppercase tracking-widest font-bold mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
        >
          {filtered.length} Tournament{filtered.length !== 1 ? "s" : ""}
        </motion.p>

        {/* Tournament grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-[#0F172A] ring-0 border-[#334155] gap-0 py-0">
                <CardContent className="flex flex-col items-center justify-center py-20 text-[#a7b6cc] gap-3">
                  <Trophy size={40} className="opacity-20" />
                  <p className="text-sm">No tournaments match your filters.</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((t) => (
                <TournamentCard key={t.id} tournament={t} onJoin={handleJoin} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
