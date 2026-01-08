export interface PlayerStatistics {
  [division: string]: DivisionStatistics;
}

export interface DivisionStatistics {
  tournaments: PlacementCategoryDetails;
  wins: PlacementCategoryDetails;
  podiumFinishes: PlacementCategoryDetails;
  top5Finishes: PlacementCategoryDetails;
  top10Finishes: PlacementCategoryDetails;
}

export interface PlacementCategoryDetails {
  count: number;
  events: EventDetails[];
}

export interface EventDetails {
  name: string;
  place: number;
  year: number;
}
