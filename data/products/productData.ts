// Base product info (reusable everywhere)

import { Products } from "../../types/productTypes"

const products: Readonly<Products> = {
  hammer: {
    id: "01K8NNAY31K4NW3AGEHDRZNCJ7",
    name: "Hammer",
    description: "This is the description for the hammer",
    price: "$12.58",
    category: ["Hammer", "ForgeFlex Tools"],
  },
  thorHammer: {
    id: "01K8NNAY3453PK5FG5NAHC034Q",
    name: "Thor Hammer",
    description: "This is the description for the thor hammer",
    price: "$11.14",
    category: ["Hammer", "ForgeFlex Tools"],
  },
  pliers: {
    id: "01K8WMG3YWQD6T8ABW3YNMMV9M",
    name: "Pliers",
    description: "This is the description for the pliers",
    price: "$12.01",
    category: ["Pliers", "ForgeFlex Tools"],
  },
}

export default products
