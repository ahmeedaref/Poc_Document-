-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_investorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groups" TEXT[];
