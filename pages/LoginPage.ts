import { test, expect, Page, Locator } from "@playwright/test"

export class LoginPage {
  // Page object reference
  private readonly page: Page
  // Login page locators (hidden from tests, immutable or not changeable)
  private readonly signInNavLink: Locator
  private readonly loginPageHeading: Locator
  private readonly emailInput: Locator
  private readonly passwordInput: Locator
  private readonly loginButton: Locator
  private readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.signInNavLink = page.locator("Sign in")
    this.loginPageHeading = page.locator("h3")
    this.emailInput = page.locator("#email")
    this.passwordInput = page.locator("#password")
    this.loginButton = page.locator("button[type='submit']")
    this.errorMessage = page.locator(".help-block")
  }

  // ==========
  // ACTIONS
  // ==========

  // Navigate to the landing page first, then proceed to the login page
  async gotoLoginPage() {
    await test.step("Navigate to landing page", async () => {
      // For debugging purposes, PAUSE only if DEBUG is true
      if (process.env.DEBUG === "true") {
        await this.page.pause()
      }

      // Landing page
      await this.page.goto("https://practicesoftwaretesting.com/", {
        waitUntil: "networkidle",
      })

      // Redirected to the login page
      await this.signInNavLink.click()
    })
  }

  // Navigate to the user dashboard without logging in
  async gotoUserDashboardDirectly() {
    await test.step("Navigate to user dashboard without logging in", async () => {
      await this.page.goto("https://practicesoftwaretesting.com/account")
    })
  }

  // Perform login with given user credentials
  async userLogin() {
    await test.step("Fill the email and password input, then click the Login button", async () => {
      await this.emailInput.fill("test@yopmail.com")
      await this.passwordInput.fill("Ak0@ytester")
      await this.loginButton.click()
    })
  }

  // ==========
  // ASSERTIONS
  // ==========

  // Verify that the landing page is displayed
  async expectOnLoginPage() {
    await test.step("Verify user is on login page", async () => {
      await expect(this.loginPageHeading).toHaveText("Login")
    })
  }

  // Verify that user landed on account dashboard after logging in
  async expectOnUserDashboard() {
    await test.step("Verify user is on the user dashboard ", async () => {
      await expect(this.page).toHaveURL(/.*account/) // Regex to match URL containing 'account'
    })
  }
}
