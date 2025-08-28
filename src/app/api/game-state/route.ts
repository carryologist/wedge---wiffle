import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch current game state
export async function GET() {
  try {
    const gameState = await prisma.gameState.findUnique({
      where: { id: 'current' }
    });
    
    if (!gameState) {
      // Create default game state if it doesn't exist
      const newGameState = await prisma.gameState.create({
        data: { id: 'current', currentHole: 1 }
      });
      return NextResponse.json(newGameState);
    }
    
    return NextResponse.json(gameState);
  } catch (error) {
    console.error('Error fetching game state:', error);
    return NextResponse.json({ error: 'Failed to fetch game state' }, { status: 500 });
  }
}

// PATCH - Update current hole
export async function PATCH(request: NextRequest) {
  try {
    const { currentHole } = await request.json();
    
    if (currentHole < 1 || currentHole > 9) {
      return NextResponse.json({ error: 'Current hole must be between 1 and 9' }, { status: 400 });
    }
    
    const gameState = await prisma.gameState.upsert({
      where: { id: 'current' },
      update: { currentHole },
      create: { id: 'current', currentHole }
    });
    
    return NextResponse.json(gameState);
  } catch (error) {
    console.error('Error updating game state:', error);
    return NextResponse.json({ error: 'Failed to update game state' }, { status: 500 });
  }
}