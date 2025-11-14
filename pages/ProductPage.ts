import { test, expect, Page, Locator } from "@playwright/test"
import { TEST_CONFIG } from "../config/testConfig"
import { log } from "../utils/logger"
import { getProductCardByName } from "../utils/helpers/elementHelper"

export default class ProductPage {
  private readonly page: Page
  private readonly productCards: Locator
  private readonly increaseQuantityButton: Locator
  private readonly decreaseQuantityButton: Locator
  private readonly quantityLabel: Locator
  private readonly addToCartButton: Locator
  private readonly addToFavouritesButton: Locator
  private readonly toastNotification: Locator
  private readonly cartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.productCards = page.locator('a[data-test^="product-"]')
    this.increaseQuantityButton = page.locator(
      'button[data-test="increase-quantity"]'
    )
    this.decreaseQuantityButton = page.locator(
      'button[data-test="decrease-quantity"]'
    )
    this.quantityLabel = page.locator('input[data-test="quantity"]')
    this.addToCartButton = page.getByRole("button", { name: /add to cart/i })
    this.addToFavouritesButton = page.locator("#btn-add-to-favorites")
    this.toastNotification = page.getByRole("alert")
    this.cartButton = page.locator('a[data-test="nav-cart"]')
  }

  //   ==========
  //   NAVIGATION
  //   ==========

  //   Navigate to the landing page first, then select product to add in the cart
  async navigateToProductListing() {
    await test.step("Navigate to Product Listing Page", async () => {
      //   Products page
      await this.page.goto(TEST_CONFIG.baseURL, {
        waitUntil: "domcontentloaded", // Loads faster, less prone to hang
        timeout: TEST_CONFIG.timeouts.long,
      })

      //   Ensure at least one product card is visible
      await expect(this.productCards.first()).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })
      log("Product listing page loaded successfully")
    })
  }

  async navigateToCartItems() {
    await test.step("Navigate to Cart Items Page", async () => {
      //   Cart items page
      await this.page.goto(`${TEST_CONFIG.baseURL}/checkout`, {
        waitUntil: "domcontentloaded",
        timeout: TEST_CONFIG.timeouts.long,
      })
    })
  }

  //   ==========
  //   ACTIONS
  //   ==========

  //   Select specific product from the product listing page
  async selectProductByName(productName: string) {
    await test.step(`Select product "${productName}" from product listing`, async () => {
      //   Target the product card containing <h5 data-test="product-name">
      //     const productCard = this.page.locator('a[data-test^="product-"]', {
      //       has: this.page.locator('h5[data-test="product-name"]', {
      //         hasText: new RegExp(`^\\s*${productName}\\s*$`, "i"),
      //       }),
      //     })
      //   OR

      //     const productCard = this.productCards.filter({
      //       has: this.productName.filter({
      //         hasText: new RegExp(`^\\s*${productName}\\s*$`, "i"),
      //       }),
      //     })

      const productCard = getProductCardByName(this.page, productName)

      //   For debugging purposes only...
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

      //   Wait for product details page to load
      await this.page.waitForLoadState("domcontentloaded")
      await expect(this.addToCartButton).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })

      log(`Successfully navigated to product detail page for "${productName}"`)
    })
  }

  //   Add the selected product to the cart
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

  //   Add the selected product to the favourites
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

  //   Helper to get current quantity value
  async getQuantity(): Promise<number> {
    return parseInt(await this.quantityLabel.inputValue(), 10)
  }

  //   Universal method to set the quantity (Increase and Decrease)
  async setQuantityTo(targetQuantity: number) {
    await test.step(`Set product quantity to ${targetQuantity}`, async () => {
      await this.quantityLabel.scrollIntoViewIfNeeded()

      const currentQuantity = await this.getQuantity()

      if (targetQuantity < 1)
        throw new Error(
          `Target quantity must be positive: received ${targetQuantity} `
        )

      // if (currentQuantity === targetQuantity)
      //   throw new Error(
      //     `Quantity already at ${targetQuantity}. No changes applied.`
      //   )

      if (currentQuantity === targetQuantity) {
        log(`Quantity already at ${targetQuantity}. Skipping update.`)
        return // Do NOT throw
      }

      const isIncrease = targetQuantity > currentQuantity
      const quantitySetterButton = isIncrease
        ? this.increaseQuantityButton
        : this.decreaseQuantityButton

      // Get the absolute value for the clicks needed to set the quantity
      // Math.abs() method only gets the absolute value, it disregards whether the value is positive or negative
      const clicksNeeded = Math.abs(targetQuantity - currentQuantity)

      for (let i = 0; i < clicksNeeded; i++) {
        await quantitySetterButton.click()

        const expectedValue = isIncrease
          ? currentQuantity + (i + 1)
          : currentQuantity - (i + 1)

        await expect(this.quantityLabel).toHaveValue(expectedValue.toString())
        console.log(`Quantity updated: ${expectedValue}`)
      }
    })
  }

  //   ==========
  //   ASSERTIONS
  //   ==========

  //   Assert quantity based on the number of clicks on increase quantity button
  async expectQuantityLabel(expectedQuantity: number) {
    await test.step(`Verify quantity equals ${expectedQuantity}`, async () => {
      await expect(this.quantityLabel).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })
      await expect(this.quantityLabel).toHaveValue(
        expectedQuantity.toString(),
        {
          timeout: TEST_CONFIG.timeouts.medium,
        }
      )
    })
  }

  //   Assert toast notification after adding the product in the cart
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
