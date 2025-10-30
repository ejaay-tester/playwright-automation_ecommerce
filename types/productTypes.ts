type ProductName = string

type ProductMeta = {
  id: string
  name: string
  description: string
  price: string
  category: string[] // An array of strings
}

export type Products = Record<ProductName, ProductMeta>
