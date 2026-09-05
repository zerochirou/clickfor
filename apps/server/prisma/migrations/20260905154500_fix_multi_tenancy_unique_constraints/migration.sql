-- DropIndex
DROP INDEX IF EXISTS "Page_title_key";

-- DropIndex
DROP INDEX IF EXISTS "PageTheme_name_key";

-- DropIndex
DROP INDEX IF EXISTS "product_categories_name_key";

-- DropIndex
DROP INDEX IF EXISTS "products_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Page_workspaceId_title_key" ON "Page"("workspaceId", "title");

-- CreateIndex
CREATE INDEX "Page_workspaceId_idx" ON "Page"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "PageTheme_workspaceId_name_key" ON "PageTheme"("workspaceId", "name");

-- CreateIndex
CREATE INDEX "PageTheme_workspaceId_idx" ON "PageTheme"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_workspace_id_name_key" ON "product_categories"("workspace_id", "name");

-- CreateIndex
CREATE INDEX "product_categories_workspace_id_idx" ON "product_categories"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_workspace_id_name_key" ON "products"("workspace_id", "name");

-- CreateIndex
CREATE INDEX "products_workspace_id_idx" ON "products"("workspace_id");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");
