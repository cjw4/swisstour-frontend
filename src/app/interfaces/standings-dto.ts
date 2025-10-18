import { EventPointsDTO } from "./event-points-dto";

export interface StandingsDTO {
  playerId: number;
  eventPoints: EventPointsDTO[];
  totalPoints: number;
  rank: number;
}
