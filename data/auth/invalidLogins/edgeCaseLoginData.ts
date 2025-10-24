import { LoginTestCase } from "../../../types/authTypes"

// Goal: Check how the app handles weird but valid inputs (whitespace, casing, unicode, etc.).
// Expected: App should trims and validates properly - or shows a clear error without crashing
export const edgeCaseLoginData: Readonly<LoginTestCase[]> = [
  // Login credentials with extra spaces in email and password
  {
    email: " test@yopmail.com ",
    password: " Ak0@ytester ",
    meta: {
      id: 114,
      title: "Login with extra spaces in email and password",
      loginError: "Invalid email or password",
    },
  },

  // Login credentials with uppercase email
  {
    email: "TEST@YOPMAIL.COM",
    password: "Ak0@ytester",
    meta: {
      id: 115,
      title: "Login with uppercase email",
      loginError: "Invalid email or password",
    },
  },

  // Login credentials with unicode characters in email
  {
    email: "テスト@yopmail.com",
    password: "Ak0@ytester",
    meta: {
      id: 116,
      title: "Login with unicode characters in email",
      emailError: "Email format is invalid",
    },
  },

  // Login credentials with non-breaking space in password
  {
    email: "test@yopmail.com",
    password: " Ak0@ytester",
    meta: {
      id: 117,
      title: "Login with non-breaking space in password",
      loginError: "Invalid email or password",
    },
  },

  // Login credentials with valid email and password but multiple login attempts
  {
    email: "test@yopmail.com",
    password: "Ak0@ytester",
    meta: {
      id: 118,
      title: "Login with locked account",
      loginError: "Account locked! Please contact the system administrator.",
    },
  },
]
