import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Clear all scores but keep players
export async function POST() {
  try {
    await prisma.player.updateMany({
      data: {
        hole1: 0,
        hole2: 0,
        hole3: 0,
        hole4: 0,
        hole5: 0,
        hole6: 0,
        hole7: 0,
        hole8: 0,
        hole9: 0
      }
    });
    
    // Reset game state to hole 1
    await prisma.gameState.upsert({
      where: { id: 'current' },
      update: { currentHole: 1 },
      create: { id: 'current', currentHole: 1 }
    });
    
    return NextResponse.json({ message: 'All scores cleared' });
  } catch (error) {
    console.error('Error clearing scores:', error);
    return NextResponse.json({ error: 'Failed to clear scores' }, { status: 500 });
  }
}