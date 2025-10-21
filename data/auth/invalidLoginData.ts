// This file only keeps the raw dataset of invalid login data

import { UserCredentials } from "../../types/authTypes"

export const invalidLoginData: Readonly<UserCredentials[]> = [
  // Login credentials with invalid email but valid password
  {
    email: "test",
    password: "Ak0@ytester",
    meta: {
      id: 102,
      title: "Login with invalid email format",
      emailError: "Email format is invalid",
    },
  },

  // Login credentials with valid email but invalid password
  {
    email: "test@yopmail.com",
    password: "password",
    meta: {
      id: 103,
      title: "Login with invalid password",
      loginError: "Invalid email or password",
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

  // Login without inputting email and password
  {
    email: "",
    password: "",
    meta: {
      id: 105,
      title: "Login without email and password",
      emailError: "Email is required",
      passwordError: "Password is required",
    },
  },
]
