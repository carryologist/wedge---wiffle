export interface Player {
  id: string;
  name: string;
  color: string;
  scores: number[];
}

export interface GameState {
  currentHole: number;
}

export interface CourseSetup {
  par1: number;
  par2: number;
  par3: number;
  par4: number;
  par5: number;
  par6: number;
  par7: number;
  par8: number;
  par9: number;
}

export interface WaterfallPlayer {
  id: string;
  name: string;
  color: string;
  currentScore: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PlayerScore {
  playerId: string;
  hole: number;
  strokes: number;
}

export interface CourseHole {
  hole: number;
  par: number;
}
