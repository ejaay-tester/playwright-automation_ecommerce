import { test, expect, Page, Locator } from "@playwright/test"
import { TEST_CONFIG } from "../config/testConfig"
import { log } from "../utils/logger"

export default class CartPage {
  private readonly page: Page
  private readonly productTitle: Locator
  private readonly productQuantity: Locator
  private readonly productPrice: Locator
  private readonly productLinePrice: Locator
  private readonly cartTotal: Locator
  private readonly proceedToCheckoutButton: Locator

  constructor(page: Page) {
    this.page = page
    this.productTitle = page.locator('[data-test="product-title"]')
    this.productQuantity = page.locator('[data-test="product-quantity"]')
    this.productPrice = page.locator('[data-test="product-price"]')
    this.productLinePrice = page.locator('[data-test="line-price"]')
    this.cartTotal = page.locator('[data-test="cart-total"]')
    this.proceedToCheckoutButton = page.locator('[data-test="proceed-1"]')
  }

  //   async verifyCartPageLoaded() {
  //     await test.step("Verify cart page loaded", async () => {
  //       await expect(this.cartTable).toBeVisible({
  //         timeout: TEST_CONFIG.timeouts.medium,
  //       })
  //       log("Cart page is visible and ready for assertions")
  //     })
  //   }

  // This method is to fetch and parse cart items
  async getCartItems() {
    // Wait until at least one product is visible before fetching data
    await this.productTitle
      .first()
      .waitFor({ state: "visible", timeout: TEST_CONFIG.timeouts.medium })

    const itemsCount = await this.productTitle.count()
    const cartItems = []

    for (let i = 0; i < itemsCount; i++) {
      const title = await this.productTitle.nth(i).innerText()
      const quantity = Number(await this.productQuantity.nth(i).inputValue())
      const price = Number(
        (await this.productPrice.nth(i).innerText()).replace("$", "")
      )
      const linePrice = Number(
        (await this.productLinePrice.nth(i).innerText()).replace("$", "")
      )

      cartItems.push({ title, quantity, price, linePrice })
    }
    console.log("Cart items fetched:", cartItems)
    return cartItems
  }

  // This method is to verify each line total
  async validateLinePriceCalculation() {
    const cartItems = await this.getCartItems() // Get all cart items
    for (const item of cartItems) {
      const expectedItemPriceTotal = Number(
        (item.quantity * item.price).toFixed(2) // Multiple each product's price by its quantity, rounds to 2 decimal places
      )
      console.log(
        `Item: ${item.title} | Price: $${item.price} | Quantity: ${item.quantity} | Expected Line Total: $${expectedItemPriceTotal} `
      )
      expect(item.linePrice).toBe(expectedItemPriceTotal) // Asserts that the computed total matches the displayed total (linePrice)
    }
  }

  // This method is to compute the total price of all items in the cart
  async validateCartTotal() {
    await test.step("Validate overall cart total", async () => {
      await expect(this.cartTotal).toBeVisible({
        timeout: TEST_CONFIG.timeouts.medium,
      })

      const cartItems = await this.getCartItems()
      expect(cartItems.length).toBeGreaterThan(0)

      // Array.reduce()
      const expectedCartTotal = cartItems.reduce(
        (sum, item) => sum + item.linePrice,
        0
      )

      console.log("Computed cart total:", expectedCartTotal)

      // For Loop
      //   let expectedCartTotal = 0
      //   for (const item of cartItems) {
      //     expectedCartTotal += item.linePrice
      //   }

      const actualCartTotal = Number(
        (await this.cartTotal.innerText()).replace("$", "")
      )

      console.log("UI cart total:", actualCartTotal)
      expect(actualCartTotal).toBeCloseTo(expectedCartTotal, 2)
      log(
        `Cart total verified: expected=${expectedCartTotal}, actual=${actualCartTotal}`
      )
      console.log(
        `Cart total verified: expected${expectedCartTotal}, actual=${actualCartTotal}`
      )
    })
  }
}
