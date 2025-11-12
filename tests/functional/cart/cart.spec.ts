import { test } from "@playwright/test"
import ProductPage from "pages/ProductPage"
import CartPage from "pages/CartPage"
import addToCartTestData from "data/products/addToCartTestData"

test.describe("Validate Cart Items Test", () => {
  test("JIRA-301: Check the added products in the cart", async ({ page }) => {
    const productPage = new ProductPage(page)
    const cartPage = new CartPage(page)

    const testProducts = addToCartTestData

    for (const product of testProducts) {
      await productPage.navigateToProductListing()
      await productPage.selectProductByName(product.name)
      await productPage.addProductToCart()
      await productPage.expectToastMessage(product.addToCartMessage)
    }
    await productPage.navigateToCartItems()

    await cartPage.getCartItems()
    await cartPage.validateLinePriceCalculation()
    await cartPage.validateCartTotal()
  })
})
