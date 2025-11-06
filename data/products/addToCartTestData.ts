// Extended test data (Add to Cart tests)

import products from "./productData"
import { AddToCartTestProduct } from "../../types/productTypes"

const addToCartTestData: Readonly<AddToCartTestProduct[]> = [
  {
    ...products.hammer,
    addToCartMessage: "Product added to shopping cart",
    invalidMessage: "You can only have one Hammer in the cart",
  },
  {
    ...products.thorHammer,
    addToCartMessage: "Product added to shopping cart",
    invalidMessage: "You can only have one Thor Hammer in the cart",
  },
  {
    ...products.pliers,
    addToCartMessage: "Product added to shopping cart",
    invalidMessage: "You can only have one Pliers in the cart",
  },
]

export default addToCartTestData
