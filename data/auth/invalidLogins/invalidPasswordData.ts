import { LoginTestCase } from "../../../types/authTypes"

export const invalidPasswordData: Readonly<LoginTestCase[]> = [
  // Login credentials with invalid password
  {
    email: "test@yopmail.com",
    password: "wrongpassword",
    meta: {
      id: 105,
      title: "Login with invalid password",
      loginError: "Invalid email or password",
    },
  },
]
