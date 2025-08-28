import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE - Remove a specific player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.player.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Player deleted' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 });
  }
}

// PATCH - Update player score
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { hole, score } = await request.json();
    
    if (hole < 1 || hole > 9) {
      return NextResponse.json({ error: 'Hole must be between 1 and 9' }, { status: 400 });
    }
    
    const holeField = `hole${hole}` as 'hole1' | 'hole2' | 'hole3' | 'hole4' | 'hole5' | 'hole6' | 'hole7' | 'hole8' | 'hole9';
    const updateData = { [holeField]: score };
    
    const player = await prisma.player.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json(player);
  } catch (error) {
    console.error('Error updating player score:', error);
    return NextResponse.json({ error: 'Failed to update player score' }, { status: 500 });
  }
}