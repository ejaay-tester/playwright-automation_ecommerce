// This file keeps only the raw dataset

import { AuthUser } from "../../types/authTypes"

export const userLoginData: Readonly<AuthUser> = {
  // Login credentials with valid email and password
  validUserLogin: {
    email: "test@yopmail.com",
    password: "Ak0@ytester",
    meta: { id: 101, title: "Login with valid user credentials" },
  },

  // Login credentials with invalid email but valid password
  invalidEmail: {
    email: "test",
    password: "Ak0@ytester",
    meta: {
      id: 102,
      title: "Login with invalid email",
      errorMessage: "Your email is invalid",
    },
  },

  // Login credentials with valid email but invalid password
  invalidPassword: {
    email: "test@yopmail.com",
    password: "password",
    meta: {
      id: 103,
      title: "Login with invalid password",
      errorMessage: "Your password is invalid",
    },
  },

  // Login credentials with invalid email and password
  invalidEmailAndPassword: {
    email: "test",
    password: "password",
    meta: {
      id: 104,
      title: "Login with invalid email and password",
      errorMessage: "Your email and password is invalid",
    },
  },
}
