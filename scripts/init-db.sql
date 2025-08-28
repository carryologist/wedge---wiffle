-- Initialize Wedge & Wiffle Database
-- Run this on your Vercel Postgres database

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hole1" INTEGER NOT NULL DEFAULT 0,
    "hole2" INTEGER NOT NULL DEFAULT 0,
    "hole3" INTEGER NOT NULL DEFAULT 0,
    "hole4" INTEGER NOT NULL DEFAULT 0,
    "hole5" INTEGER NOT NULL DEFAULT 0,
    "hole6" INTEGER NOT NULL DEFAULT 0,
    "hole7" INTEGER NOT NULL DEFAULT 0,
    "hole8" INTEGER NOT NULL DEFAULT 0,
    "hole9" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_state" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "currentHole" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."course_setup" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "par1" INTEGER NOT NULL DEFAULT 4,
    "par2" INTEGER NOT NULL DEFAULT 4,
    "par3" INTEGER NOT NULL DEFAULT 4,
    "par4" INTEGER NOT NULL DEFAULT 4,
    "par5" INTEGER NOT NULL DEFAULT 4,
    "par6" INTEGER NOT NULL DEFAULT 4,
    "par7" INTEGER NOT NULL DEFAULT 4,
    "par8" INTEGER NOT NULL DEFAULT 4,
    "par9" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_setup_pkey" PRIMARY KEY ("id")
);

-- Insert initial game state
INSERT INTO "public"."game_state" ("id", "currentHole", "updatedAt") 
VALUES ('current', 1, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Insert initial course setup (all par 4s)
INSERT INTO "public"."course_setup" (
    "id", "par1", "par2", "par3", "par4", "par5", 
    "par6", "par7", "par8", "par9", "updatedAt"
) 
VALUES (
    'current', 4, 4, 4, 4, 4, 4, 4, 4, 4, CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;
