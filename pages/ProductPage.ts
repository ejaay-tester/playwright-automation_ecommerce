import { test, expect, Page, Locator } from "@playwright/test"
import { TEST_CONFIG } from "../config/testConfig"
import { log } from "../utils/logger"
import { getProductCardByName } from "../utils/helpers/elementHelper"
import Toast from "../components/Toast"
import QuantitySetter from "../components/QuantitySetter"

export default class ProductPage {
  private readonly page: Page

  // Locators
  private readonly productCards: Locator
  private readonly addToCartButton: Locator
  private readonly addToFavouritesButton: Locator
  private readonly cartButton: Locator

  // Components Reference
  readonly quantity: QuantitySetter
  readonly toast: Toast

  constructor(page: Page) {
    this.page = page

    // Initialize locators
    this.productCards = page.locator('a[data-test^="product-"]')
    this.addToCartButton = page.getByRole("button", { name: /add to cart/i })
    this.addToFavouritesButton = page.locator("#btn-add-to-favorites")
    this.cartButton = page.locator('a[data-test="nav-cart"]')

    // Initialize components
    this.quantity = new QuantitySetter(
      this.page.locator(".input-group.quantity")
    )
    this.toast = new Toast(this.page.getByRole("alert"))
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

  //   ==========
  //   ASSERTIONS
  //   ==========

  //   Assert toast notification after adding the product in the cart
  async expectToastMessage(text: string) {
    await this.toast.expectMessage(text)
  }
}
