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

export interface CourseSetup {
  id?: string;
  par1: number;
  par2: number;
  par3: number;
  par4: number;
  par5: number;
  par6: number;
  par7: number;
  par8: number;
  par9: number;
  createdAt?: Date;
  updatedAt?: Date;
}