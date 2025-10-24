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
  private readonly emailError: Locator
  private readonly passwordError: Locator
  private readonly loginError: Locator

  constructor(page: Page) {
    this.page = page
    this.signInNavLink = page.getByRole("link", { name: "Sign in" })
    this.loginPageHeading = page.locator("h3")
    this.emailInput = page.locator("#email")
    this.passwordInput = page.locator("#password")
    this.loginButton = page.getByRole("button", { name: "Login" })
    this.emailError = page.locator("#email-error")
    this.passwordError = page.locator("#password-error")
    this.loginError = page.locator('[data-test="login-error"]')
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
        waitUntil: "domcontentloaded",
        timeout: 60000,
      })

      // Redirected to the login page
      await this.signInNavLink.click()
    })
  }

  // Navigate to the user dashboard without logging in
  async gotoUserDashboardDirectly() {
    await test.step("Navigate to user dashboard without logging in", async () => {
      await this.page.goto("https://practicesoftwaretesting.com/account", {
        waitUntil: "domcontentloaded",
      })
    })
  }

  // Perform login with given user credentials
  async userLogin(email: string, password: string) {
    await test.step("Fill the email and password input, then click the Login button", async () => {
      await this.emailInput.fill(email)
      await this.passwordInput.fill(password)
      await this.loginButton.click()
    })
  }

  // ==========
  // ASSERTIONS
  // ==========

  // Verify that the landing page is displayed
  async expectOnLoginPage() {
    await test.step("Verify user is on login page", async () => {
      await this.loginPageHeading.waitFor({ state: "visible", timeout: 10000 })
      await expect(this.loginPageHeading).toHaveText("Login")
    })
  }

  // Verify that user landed on account dashboard after logging in
  async expectOnUserDashboard() {
    await test.step("Verify user is on the user dashboard ", async () => {
      await expect(this.page).toHaveURL(/.*account/) // Regex to match URL containing 'account'
    })
  }

  // Verify email error message
  async expectEmailError(emailErrorMessage: string) {
    await test.step(`Verify error message contains: "${emailErrorMessage}"`, async () => {
      await expect(this.emailError).toBeVisible()
      await expect(this.emailError).toContainText(emailErrorMessage)
    })
  }

  // Verify password error message
  async expectPasswordError(passwordErrorMessage: string) {
    await test.step(`Verify error message contains: "${passwordErrorMessage}"`, async () => {
      await expect(this.passwordError).toBeVisible()
      await expect(this.passwordError).toContainText(passwordErrorMessage)
    })
  }

  // Verify login error message
  async expectLoginError(loginErrorMessage: string) {
    await test.step(`Verify error message contains: "${loginErrorMessage}"`, async () => {
      await expect(this.loginError).toBeVisible()
      await expect(this.loginError).toContainText(loginErrorMessage)
    })
  }
}
