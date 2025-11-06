// Single product definition
export type ProductMeta = {
  id: string
  name: string
  description: string
  price: string
  category: string[] // An array of strings
}

// A collection of products (dictionary)
export type Products = Record<string, ProductMeta>

// A single product used in Add to Cart tests
export type AddToCartTestProduct = ProductMeta & {
  addToCartMessage: string
  invalidMessage: string
}
