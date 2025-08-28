import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all players
export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

// POST - Create a new player
export async function POST(request: NextRequest) {
  try {
    const { name, color } = await request.json();
    
    if (!name || !color) {
      return NextResponse.json({ error: 'Name and color are required' }, { status: 400 });
    }
    
    // Check if player name already exists
    const existingPlayer = await prisma.player.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });
    
    if (existingPlayer) {
      return NextResponse.json({ error: 'Player name already exists' }, { status: 400 });
    }
    
    const player = await prisma.player.create({
      data: { name, color }
    });
    
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}

// DELETE - Clear all players
export async function DELETE() {
  try {
    await prisma.player.deleteMany();
    return NextResponse.json({ message: 'All players deleted' });
  } catch (error) {
    console.error('Error deleting players:', error);
    return NextResponse.json({ error: 'Failed to delete players' }, { status: 500 });
  }
}