import { LoginTestCase } from "../../../types/authTypes"

const invalidEmailData: Readonly<LoginTestCase[]> = [
  // Login credentials with invalid email
  {
    email: "test",
    password: "Ak0@ytester",
    meta: {
      id: 102,
      title: "Login with invalid email format",
      emailError: "Email format is invalid",
    },
  },

  // Login credentials with incomplete email
  {
    email: "test@.com",
    password: "Ak0@ytester",
    meta: {
      id: 103,
      title: "Login with incomplete email",
      emailError: "Email format is invalid ",
    },
  },

  // Login credentials with invalid email and password
  {
    email: "test",
    password: "password",
    meta: {
      id: 104,
      title: "Login with invalid email and password",
      emailError: "Email format is invalid",
    },
  },
]

export default invalidEmailData
