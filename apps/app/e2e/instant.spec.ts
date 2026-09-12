import { test, expect } from "@playwright/test";
import { instant } from "@next/playwright";

test.describe("Workspace Dashboard optimization", () => {
  // Baseline test to ensure the page can be rendered normally (requires a logged-in user in real scenario)
  test("baseline: the shell marker renders for the test user", async ({
    page,
  }) => {
    // You'd typically use a fixture or login step before this
    await page.goto("/workspace/1"); // Using a dummy workspace ID for the test

    // Assert that the static shell (sidebar layout) is present
    // .bg-sidebar is part of the SidebarLayout we hoisted above the boundary
    await expect(page.locator(".bg-sidebar").first()).toBeVisible();
  });

  // Locked test that ensures the shell commits instantly without blocking
  test("instant(): the shell commits instantly under the lock", async ({
    page,
  }) => {
    await instant(page, async () => {
      await page.goto("/workspace/1");
    });

    // The shell we hoisted (sidebar, header) should be visible instantly!
    await expect(page.locator(".bg-sidebar").first()).toBeVisible();
  });
});
