import { test, expect, Page, Locator } from "@playwright/test"
import { TEST_CONFIG } from "../config/testConfig"
import { log } from "../utils/logger"

class ProductPage {
  private readonly page: Page
  private readonly productCards: Locator
  private readonly addToCartButton: Locator
  private readonly addToFavouritesButton: Locator
  private readonly toastNotification: Locator

  constructor(page: Page) {
    this.page = page
    this.productCards = page.locator('a[data-test^="product-"]')
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" })
    this.addToFavouritesButton = page.locator("#btn-add-to-favorites")
    this.toastNotification = page.locator("#toast-container")
  }

  // ==========
  // NAVIGATION
  // ==========

  // Navigate to the landing page first, then select product to add in the cart
  async navigateToProductListing() {
    await test.step("Navigate to Product Listing Page", async () => {
      // Products page
      await this.page.goto(TEST_CONFIG.baseURL, {
        waitUntil: "domcontentloaded", // Loads faster, less prone to hang
        timeout: TEST_CONFIG.timeouts.long,
      })

      // Wait for products to render
      await expect(this.productCards.first()).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })
    })
  }

  // ==========
  // ACTIONS
  // ==========

  // Select specific product from the product listing page
  async selectProductByName(productName: string) {
    await test.step(`Select product "${productName}" from product listing`, async () => {
      const productCard = this.productCards.filter({
        hasText: new RegExp(`\\b${productName}\\b`, "i"),
      })

      // For debugging purposes only...
      const totalMatchedProducts = await productCard.count()
      log(`Found ${totalMatchedProducts} product(s) matching "${productName}"`)
      if (TEST_CONFIG.debug) {
        for (let i = 0; i < totalMatchedProducts; i++) {
          log(await productCard.nth(i).innerText())
        }
      }

      await productCard.scrollIntoViewIfNeeded()
      await expect(productCard).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })
      await productCard.click()
      await this.page.waitForLoadState("networkidle") // Wait for product details page to load
      await expect(this.addToCartButton).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })
    })
  }

  // Add the selected product to the cart
  async addProductToCart() {
    await test.step("Add the selected product to the cart", async () => {
      await this.addToCartButton.scrollIntoViewIfNeeded()
      await expect(this.addToCartButton).toBeVisible({
        timeout: TEST_CONFIG.timeouts.short,
      })
      await this.addToCartButton.click()
    })
  }

  // Add the selected product to the favourites
  async addProductToFavorites() {
    await test.step("Add the selected product to favourites", async () => {
      await this.addToFavouritesButton.scrollIntoViewIfNeeded()
      await expect(this.addToFavouritesButton).toBeVisible({
        timeout: TEST_CONFIG.timeouts.short,
      })
      await this.addToFavouritesButton.click()
    })
  }

  // ==========
  // ASSERTIONS
  // ==========

  // Assert toast notification after adding the product in the cart
  async expectToastMessage(expectedText: string) {
    await test.step(`Verify toast message contains: ${expectedText}`, async () => {
      await expect(this.toastNotification).toBeVisible({
        timeout: TEST_CONFIG.timeouts.short,
      })
      await expect(this.toastNotification).toContainText(expectedText)
    })
  }
}

export default ProductPage
