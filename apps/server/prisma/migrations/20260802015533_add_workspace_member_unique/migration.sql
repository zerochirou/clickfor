/*
  Warnings:

  - A unique constraint covering the columns `[workspace_id,user_id]` on the table `workspace_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_workspace_id_user_id_key" ON "workspace_members"("workspace_id", "user_id");
