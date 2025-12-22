import { TournamentStats } from "./player-stats";

export interface DivisionStats {
  [division: string]: TournamentStats;
}
