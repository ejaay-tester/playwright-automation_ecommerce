import { AuthUser, LoginKey, LoginTestCase } from "../types/authTypes"

export const userLoginData: Readonly<AuthUser> = {
  validUserLogin: {
    email: "test@yopmail.com",
    password: "Ak0@ytester",
    meta: { id: 101, title: "Login with valid user credentials" },
  },
  invalidEmail: {
    email: "test",
    password: "Ak0@ytester",
    meta: {
      id: 102,
      title: "Login with invalid email",
      errorMessage: "Your email is invalid",
    },
  },
  invalidPassword: {
    email: "test@yopmail.com",
    password: "password",
    meta: {
      id: 103,
      title: "Login with invalid password",
      errorMessage: "Your password is invalid",
    },
  },
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

export const invalidLoginTests: LoginTestCase[] = Object.entries(userLoginData)
  .filter(([loginKey]) => loginKey !== "validUserLogin") // exclude the valid user login
  .map(([loginKey, userCredentials]) => ({
    loginKey: loginKey as Exclude<LoginKey, "validUserLogin">,
    ...userCredentials,
  }))
