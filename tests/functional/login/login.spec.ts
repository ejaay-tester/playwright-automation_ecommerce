import { test, expect } from "@playwright/test"

test.describe("Login Features Test | Valid Login Credentials @smoke", () => {
  test("JIRA-101: Login with valid user credentials", async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/", {
      waitUntil: "networkidle",
    })

    // Verify if the Sign In link is visible
    await expect(page.getByText("Sign in")).toBeVisible()
    await page.getByText("Sign in").click()

    // Verify the Login page
    const h3Locator = page.locator("h3")
    await expect(h3Locator).toHaveText("Login")

    // Fill login credentials and submit
    await page.locator("#email").fill("test@yopmail.com")
    await page.locator("#password").fill("Ak0@ytester")
    await page.getByRole("button", { name: "Login" }).click()

    // Assert successful login
    await expect(page).toHaveURL("https://practicesoftwaretesting.com/account")
  })
})
