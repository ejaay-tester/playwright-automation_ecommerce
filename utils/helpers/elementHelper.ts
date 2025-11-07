import { Page, Locator } from "@playwright/test"

/**
 * Filter product cards by matching product name text
 * This helper is scoped to ProductPage
 */
export const getProductCardByName = (
  page: Page,
  productName: string
): Locator => {
  const productCards = page.locator('a[data-test^="product-"]')
  const productNameLocator = page.locator('h5[data-test="product-name"]')

  return productCards.filter({
    has: productNameLocator.filter({
      hasText: new RegExp(`^\\s*${productName}\\s*$`),
    }),
  })
}
