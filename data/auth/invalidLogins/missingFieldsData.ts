import { LoginTestCase } from "../../../types/authTypes"

const missingFieldsData: Readonly<LoginTestCase[]> = [
  // Missing email and password on login
  {
    email: "",
    password: "",
    meta: {
      id: 106,
      title: "Login with empty credentials",
      emailError: "Email is required",
      passwordError: "Password is required",
    },
  },

  // Missing email on login
  {
    email: "",
    password: "Ak0@ytester",
    meta: {
      id: 107,
      title: "Login with missing email",
      emailError: "Email is required",
    },
  },

  // Missing password on login
  {
    email: "test@yopmail.com",
    password: "",
    meta: {
      id: 108,
      title: "Login with missing password",
      passwordError: "Password is required",
    },
  },
]

export default missingFieldsData
