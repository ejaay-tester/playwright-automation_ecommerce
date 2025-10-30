import { test } from "@playwright/test"
import ProductPage from "../../../pages/ProductPage"

test.describe("Add to Cart Feature Test - Core Functionality", () => {
  test("JIRA-201: Add a single product to cart", async ({ page }) => {
    const productPage = new ProductPage(page)

    // Step 1: Navigate to the product listing page
    await productPage.navigateToProductListing()

    // Step 2: Select the product by visible name (more reliable than ID)
    await productPage.selectProductByName("Thor Hammer")

    // Step 3: Add it to the cart
    await productPage.addProductToCart()

    // Step 4: Verify success message
    await productPage.expectToastMessage("Product added to shopping cart")

    // Step 5: Add the same product in the cart
    await productPage.addProductToCart()

    // Step 6: Verify error message
    await productPage.expectToastMessage(
      "You can only have one Thor Hammer in the cart"
    )
  })
})
