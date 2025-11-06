import { test, expect, Page, Locator } from "@playwright/test"
import { TEST_CONFIG } from "../config/testConfig"
import { log } from "../utils/logger"

class ProductPage {
  private readonly page: Page
  private readonly productCards: Locator
  private readonly productName: Locator
  private readonly addToCartButton: Locator
  private readonly addToFavouritesButton: Locator
  private readonly toastNotification: Locator

  constructor(page: Page) {
    this.page = page
    this.productCards = page.locator('a[data-test^="product-"]')
    this.productName = page.locator('h5[data-test="product-name"]')
    this.addToCartButton = page.getByRole("button", { name: /add to cart/i })
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

      // Ensure at least one product card is visible
      await expect(this.productCards.first()).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })
      log("Product listing page loaded successfully")
    })
  }

  // ==========
  // ACTIONS
  // ==========

  // Select specific product from the product listing page
  async selectProductByName(productName: string) {
    await test.step(`Select product "${productName}" from product listing`, async () => {
      // Target the product card containing <h5 data-test="product-name">
      //   const productCard = this.page.locator('a[data-test^="product-"]', {
      //     has: this.page.locator('h5[data-test="product-name"]', {
      //       hasText: new RegExp(`^\\s*${productName}\\s*$`, "i"),
      //     }),
      //   })
      // OR

      const productCard = this.productCards.filter({
        has: this.productName.filter({
          hasText: new RegExp(`^\\s*${productName}\\s*$`, "i"),
        }),
      })

      // For debugging purposes only...
      const totalMatchedProduct = await productCard.count()
      log(`Found ${totalMatchedProduct} product(s) matching "${productName}"`)

      if (totalMatchedProduct === 0) {
        throw new Error(`No product found with name: "${productName}"`)
      }
      if (totalMatchedProduct > 1) {
        log(`Multiple matches for "${productName}". Using first match`)
      }

      const targetProductCard = productCard.first()
      await targetProductCard.scrollIntoViewIfNeeded()
      await expect(targetProductCard).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })
      await targetProductCard.click()

      // Wait for product details page to load
      await this.page.waitForLoadState("domcontentloaded")
      await expect(this.addToCartButton).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })

      log(`Successfully navigated to product detail page for "${productName}"`)
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
      log("Clicked on 'Add to Cart' button.")
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
      log("Clicked on 'Add to Favourites' button.")
    })
  }

  // ==========
  // ASSERTIONS
  // ==========

  // Assert toast notification after adding the product in the cart
  async expectToastMessage(expectedText: string) {
    await test.step(`Verify toast message contains: ${expectedText}`, async () => {
      await expect(this.toastNotification).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })
      await expect(this.toastNotification).toContainText(expectedText)
      log(`Toast message verified: "${expectedText}"`)
    })
  }
}

export default ProductPage
