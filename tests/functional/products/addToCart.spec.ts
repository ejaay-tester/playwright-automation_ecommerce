import { test } from "@playwright/test"
import ProductPage from "../../../pages/ProductPage"
import addToCartTestData from "../../../data/products/addToCartTestData"
import products from "data/products/productData"

test.describe("Add to Cart Feature Test - Core Functionality", () => {
  test("JIRA-201: Add a single product to cart", async ({ page }) => {
    const productPage = new ProductPage(page)

    await productPage.navigateToProductListing() // Step 1: Navigate to the product listing page
    await productPage.selectProductByName(products.thorHammer.name) // Step 2: Select product by visible name (more reliable than product ID)
    await productPage.addProductToCart() // Step 3: Add it to the cart
    await productPage.expectToastMessage("Product added to shopping cart") // Step 4: Verify success message
  })

  test("JIRA-202: Prevent adding another Thor Hammer in the cart", async ({
    page,
  }) => {
    const productPage = new ProductPage(page)

    await productPage.navigateToProductListing()
    await productPage.selectProductByName(products.thorHammer.name)
    await productPage.addProductToCart()
    await productPage.expectToastMessage("Product added to shopping cart")

    // Add the product again in the cart
    await productPage.addProductToCart()
    await productPage.expectToastMessage(
      "You can only have one Thor Hammer in the cart"
    )
  })

  test("JIRA-203: Add different products to the cart", async ({ page }) => {
    const productPage = new ProductPage(page)
    const testProducts = addToCartTestData

    for (const product of testProducts) {
      await productPage.navigateToProductListing()
      await productPage.selectProductByName(product.name)
      await productPage.addProductToCart()
      await productPage.expectToastMessage(product.addToCartMessage)
    }
  })

  test("JIRA-204: Increase the quantity of the selected product to 5", async ({
    page,
  }) => {
    const productPage = new ProductPage(page)

    await productPage.navigateToProductListing()
    await productPage.selectProductByName(products.hammer.name)
    await productPage.setQuantityTo(5)
    await productPage.expectQuantityLabel(5)
    await productPage.addProductToCart()
    await productPage.expectToastMessage("Product added to shopping cart")
  })

  test.only("JIRA-205: Decrease the quantity of the selected product to 5", async ({
    page,
  }) => {
    const productPage = new ProductPage(page)

    // Step 1: Navigate the product listing page
    await productPage.navigateToProductListing()

    // Step 2: Select the product you want to add in the cart
    await productPage.selectProductByName(products.hammer.name)

    // Step 3: Set the desired quantity (increase) of the product
    await productPage.setQuantityTo(5)
    await productPage.expectQuantityLabel(5)

    // Step 4: Set the desired quantity (decrease) of the product
    await productPage.setQuantityTo(2)
    await productPage.expectQuantityLabel(2)

    // Step 5: Add the product in the cart after setting the desired quantity
    await productPage.addProductToCart()
    await productPage.expectToastMessage("Product added to shopping cart")
  })
})
