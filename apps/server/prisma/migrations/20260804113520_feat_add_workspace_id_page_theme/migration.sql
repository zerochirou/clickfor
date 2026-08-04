/*
  Warnings:

  - Added the required column `workspaceId` to the `PageTheme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageTheme" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PageTheme" ADD CONSTRAINT "PageTheme_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
