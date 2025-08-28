export interface Player {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  hole1: number;
  hole2: number;
  hole3: number;
  hole4: number;
  hole5: number;
  hole6: number;
  hole7: number;
  hole8: number;
  hole9: number;
}

export interface GameState {
  id?: string;
  currentHole: number;
  createdAt?: Date;
  updatedAt?: Date;
}