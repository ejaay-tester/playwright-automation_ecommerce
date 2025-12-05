import { Page, Locator, expect } from "@playwright/test"
import { log } from "../utils/logger"
import { getProductCardByName } from "../utils/helpers/elementHelper"
import BasePage from "../pages/BasePage"
import Toast from "../components/Toast"
import QuantitySetter from "../components/QuantitySetter"

export default class ProductPage extends BasePage {
  // Page Locators
  private readonly productCards: Locator
  private readonly addToCartButton: Locator
  private readonly addToFavouritesButton: Locator
  private readonly cartButton: Locator

  // Components
  readonly quantity: QuantitySetter
  readonly toast: Toast

  constructor(page: Page) {
    super(page)

    // Initialize Page Locators
    this.productCards = page.locator('a[data-test^="product-"]')
    this.addToCartButton = page.getByRole("button", { name: /add to cart/i })
    this.addToFavouritesButton = page.locator("#btn-add-to-favorites")
    this.cartButton = page.locator('a[data-test="nav-cart"]')

    // Initialize Components
    this.quantity = new QuantitySetter(
      this.page.locator(".input-group.quantity")
    )
    this.toast = new Toast(this.page.getByRole("alert"))
  }

  //   ==========
  //   NAVIGATION
  //   ==========

  //   Navigate to the landing page first, then select product to add in the cart

  async navigateToProductListingPage() {
    await this.visit("/")
    await expect(this.productCards.first()).toBeVisible() //  Ensure at least one product card is visible
  }

  async navigateToCartItemsPage() {
    await this.visit("/checkout")
  }

  //   ==========
  //   ACTIONS
  //   ==========

  //   Select specific product from the product listing page
  async selectProductByName(productName: string) {
    const product = getProductCardByName(this.page, productName)
    const totalMatchedProduct = await product.count()

    // For debugging purposes only...
    log(`Found ${totalMatchedProduct} products(s) matching ${productName}`)

    if (totalMatchedProduct === 0)
      throw new Error(`Product not found: ${productName}`)

    await product.first().click()

    //  Wait until product detail page loads enough to interact with "Add to Cart"
    await expect(this.addToCartButton).toBeVisible()
  }

  //   Add the selected product to the cart
  async addProductToCart() {
    await this.addToCartButton.click()
  }

  //   Add the selected product to the favourites
  async addProductToFavorites() {
    await this.addToFavouritesButton.click()
  }

  //   ==========
  //   ASSERTIONS
  //   ==========

  //   Assert toast notification after adding the product in the cart
  async expectToastMessage(text: string) {
    await this.toast.expectMessage(text)
  }
}
