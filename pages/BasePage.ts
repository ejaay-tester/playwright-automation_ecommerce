import { Page } from "@playwright/test"

export default class BasePage {
  protected readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navigates using the baseURL set in playwright.config.ts
   * Example: visit("/checkout") -> https://your-base-url.com/checkout
   */
  async visit(path: string = "/") {
    await this.page.goto(path, {
      waitUntil: "domcontentloaded",
    })
  }
}
