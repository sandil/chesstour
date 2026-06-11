export type TimeControl = "Blitz" | "Rapid" | "Classical";
export type TournamentStatus = "upcoming" | "live";

export interface Tournament {
  id: string;
  name: string;
  timeControl: TimeControl;
  startTime: string;
  playersJoined: number;
  maxPlayers: number;
  status: TournamentStatus;
}

export const tournaments: Tournament[] = [
  {
    id: "t1",
    name: "Weekend Blitz Arena",
    timeControl: "Blitz",
    startTime: "2026-02-10T15:00:00Z",
    playersJoined: 24,
    maxPlayers: 100,
    status: "upcoming",
  },
  {
    id: "t2",
    name: "Rapid Morning Cup",
    timeControl: "Rapid",
    startTime: "2026-02-11T06:30:00Z",
    playersJoined: 48,
    maxPlayers: 50,
    status: "live",
  },
  {
    id: "t3",
    name: "Classical Masters Open",
    timeControl: "Classical",
    startTime: "2026-02-12T09:00:00Z",
    playersJoined: 12,
    maxPlayers: 30,
    status: "upcoming",
  },
  {
    id: "t4",
    name: "Evening Blitz Bash",
    timeControl: "Blitz",
    startTime: "2026-02-10T18:00:00Z",
    playersJoined: 96,
    maxPlayers: 100,
    status: "live",
  },
  {
    id: "t5",
    name: "Rapid Weekend Swiss",
    timeControl: "Rapid",
    startTime: "2026-02-13T10:00:00Z",
    playersJoined: 18,
    maxPlayers: 40,
    status: "upcoming",
  },
  {
    id: "t6",
    name: "Classical Night League",
    timeControl: "Classical",
    startTime: "2026-02-14T17:00:00Z",
    playersJoined: 20,
    maxPlayers: 20,
    status: "upcoming",
  },
  {
    id: "t7",
    name: "Blitz Lightning Hour",
    timeControl: "Blitz",
    startTime: "2026-02-10T20:00:00Z",
    playersJoined: 64,
    maxPlayers: 64,
    status: "live",
  },
  {
    id: "t8",
    name: "Rapid Learners Cup",
    timeControl: "Rapid",
    startTime: "2026-02-15T08:00:00Z",
    playersJoined: 5,
    maxPlayers: 25,
    status: "upcoming",
  },
];
