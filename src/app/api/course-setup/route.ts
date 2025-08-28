import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch course setup (par values)
export async function GET() {
  try {
    let courseSetup = await prisma.courseSetup.findUnique({
      where: { id: 'current' }
    });
    
    if (!courseSetup) {
      // Create default course setup if it doesn't exist
      courseSetup = await prisma.courseSetup.create({
        data: { id: 'current' }
      });
    }
    
    return NextResponse.json(courseSetup);
  } catch (error) {
    console.error('Error fetching course setup:', error);
    return NextResponse.json({ error: 'Failed to fetch course setup' }, { status: 500 });
  }
}

// PATCH - Update par values
export async function PATCH(request: NextRequest) {
  try {
    const parData = await request.json();
    
    // Validate par values (should be between 1 and 10)
    const validPars: Record<string, number> = {};
    for (let i = 1; i <= 9; i++) {
      const parKey = `par${i}`;
      const parValue = parData[parKey];
      
      if (parValue !== undefined) {
        if (typeof parValue !== 'number' || parValue < 1 || parValue > 10) {
          return NextResponse.json(
            { error: `Par for hole ${i} must be between 1 and 10` }, 
            { status: 400 }
          );
        }
        validPars[parKey] = parValue;
      }
    }
    
    if (Object.keys(validPars).length === 0) {
      return NextResponse.json({ error: 'No valid par values provided' }, { status: 400 });
    }
    
    const courseSetup = await prisma.courseSetup.upsert({
      where: { id: 'current' },
      update: validPars,
      create: { id: 'current', ...validPars }
    });
    
    return NextResponse.json(courseSetup);
  } catch (error) {
    console.error('Error updating course setup:', error);
    return NextResponse.json({ error: 'Failed to update course setup' }, { status: 500 });
  }
}

// POST - Reset to default par values (all 4s)
export async function POST() {
  try {
    const courseSetup = await prisma.courseSetup.upsert({
      where: { id: 'current' },
      update: {
        par1: 4, par2: 4, par3: 4, par4: 4, par5: 4,
        par6: 4, par7: 4, par8: 4, par9: 4
      },
      create: { id: 'current' }
    });
    
    return NextResponse.json(courseSetup);
  } catch (error) {
    console.error('Error resetting course setup:', error);
    return NextResponse.json({ error: 'Failed to reset course setup' }, { status: 500 });
  }
}