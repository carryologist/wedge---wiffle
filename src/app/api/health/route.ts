import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Health check and database initialization
export async function GET() {
  try {
    // Test database connection and initialize if needed
    await prisma.gameState.upsert({
      where: { id: 'current' },
      update: {},
      create: { id: 'current', currentHole: 1 }
    });
    
    await prisma.courseSetup.upsert({
      where: { id: 'current' },
      update: {},
      create: { id: 'current' }
    });
    
    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected',
      tables: 'initialized',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}