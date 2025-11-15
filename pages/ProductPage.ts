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
      const productCard = getProductCardByName(this.page, productName)

      //   For debugging purposes only...
      const totalMatchedProduct = await productCard.count()
      log(`Found ${totalMatchedProduct} product(s) matching "${productName}"`)

      if (totalMatchedProduct === 0)
        throw new Error(`No product found with name: "${productName}"`)

      if (totalMatchedProduct > 1)
        log(`Multiple matches for "${productName}". Using first match`)

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

  // Helper to get current quantity value
  async getQuantity(): Promise<number> {
    return parseInt(await this.quantityLabel.inputValue(), 10)
  }

  // Universal method to set the quantity (Increase and Decrease)
  // Automatically decides whether to increase or decrease
  // Accepts any target quantity
  async setQuantityTo(targetQuantity: number) {
    await test.step(`Set product quantity to ${targetQuantity}`, async () => {
      // Locate the quantityLabel locator
      await this.quantityLabel.scrollIntoViewIfNeeded()

      // Fetch the current quantity value of the selected product
      const currentQuantity = await this.getQuantity()

      // IF condition to throw an ERROR if the inputted TARGET QUANTITY is less than 1
      if (targetQuantity < 1)
        throw new Error(
          `Error: Target quantity must be positive number/integer | Received input: ${targetQuantity} `
        )

      // IF condition to log if the CURRENT QUANTITY is equals to the inputted TARGET QUANTITY
      if (currentQuantity === targetQuantity) {
        console.log(
          `Info: Quantity already at ${targetQuantity}. Skipping update.`
        )
        return // Do not throw an error
      }

      // Declares a immutable variable for increase (+)
      // Target quantity should be greater than the current quantity
      const increasing = targetQuantity > currentQuantity

      // Ternary operator for which button to trigger or click for setting the quantity
      // Linked to the increasing variable
      const quantitySetterButton = increasing
        ? this.increaseQuantityButton
        : this.decreaseQuantityButton

      // Calculates exactly how many clicks are needed
      // Get the absolute value for the clicks needed to set the quantity
      // Math.abs() method only gets the absolute value, it disregards whether the value is positive or negative
      const clicksNeededToUpdateQuantity = Math.abs(
        targetQuantity - currentQuantity
      )

      for (let i = 0; i < clicksNeededToUpdateQuantity; i++) {
        await quantitySetterButton.click()

        const expectedValue = increasing
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
