import { test, expect } from "@applitools/eyes-playwright/fixture"

test("has title", async ({ page, eyes }) => {
  await page.goto("https://playwright.dev/")

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/)

  // Take a full-page visual checkpoint of the home page
  await eyes.check("Playwright Home Page", { fully: true })
})

test("get started link", async ({ page, eyes }) => {
  await page.goto("https://playwright.dev/")

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click()

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible()

  // Take a full-page visual checkpoint of the Get Started page
  await eyes.check("Get Started Page", { fully: true })
})
