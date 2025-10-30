import { test, expect, Page, Locator } from "@playwright/test"

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
      await this.page.goto("https://practicesoftwaretesting.com/", {
        waitUntil: "domcontentloaded", // Loads faster, less prone to hang
        timeout: 45000, // Optional: increase to 45s for reliability
      })

      // Wait for products to render
      await expect(this.productCards.first()).toBeVisible({ timeout: 10000 })
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
      //   if (process.env.DEBUG === "true") {
      //     const totalMatchedProducts = await productCard.count()
      //     console.log(
      //       `Found ${totalMatchedProducts} product/s for "${productName}".`
      //     )
      //     for (let i = 0; i < totalMatchedProducts; i++) {
      //       console.log(await productCard.nth(i).innerText())
      //     }
      //   }

      // For debugging purposes only
      const totalMatchedProducts = await productCard.count()
      console.log(
        `[DEBUG] ${totalMatchedProducts} product(s) matched: ${productName}`
      )

      //
      await productCard.scrollIntoViewIfNeeded()
      await expect(productCard).toBeVisible({ timeout: 10000 })
      await productCard.click()

      // Wait for product details page to load
      await this.page.waitForLoadState("networkidle")
      await expect(this.addToCartButton).toBeVisible({ timeout: 10000 })
    })
  }

  // Add the selected product to the cart
  async addProductToCart() {
    await test.step("Add the selected product to the cart", async () => {
      await this.addToCartButton.scrollIntoViewIfNeeded()
      await expect(this.addToCartButton).toBeVisible({ timeout: 5000 })
      await this.addToCartButton.click()
    })
  }

  // Add the selected product to the favourites
  async addProductToFavorites() {
    await test.step("Add the selected product to favourites", async () => {
      await this.addToFavouritesButton.scrollIntoViewIfNeeded()
      await expect(this.addToFavouritesButton).toBeVisible({ timeout: 5000 })
      await this.addToFavouritesButton.click()
    })
  }

  // ==========
  // ASSERTIONS
  // ==========

  // Assert toast notification after adding the product in the cart
  async expectToastMessage(expectedText: string) {
    await test.step(`Verify toast message contains: ${expectedText}`, async () => {
      await expect(this.toastNotification).toBeVisible({ timeout: 7000 })
      await expect(this.toastNotification).toContainText(expectedText)
    })
  }
}

export default ProductPage
