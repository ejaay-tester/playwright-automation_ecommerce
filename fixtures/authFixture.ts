import { test as base, Page } from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import { UserCredentials } from "../types/authTypes"
import validLoginData from "data/auth/validLoginData"
import invalidLoginTests from "data/auth/invalidLoginTests"

type AuthFixtures = {
  startOnLoginPage: boolean
  loginPage: LoginPage
  validUser: Readonly<UserCredentials>
  invalidUsers: Readonly<UserCredentials[]>
}

export const test = base.extend<AuthFixtures>({
  startOnLoginPage: [true, { option: true }],

  loginPage: async ({ page, startOnLoginPage }, use) => {
    const login = new LoginPage(page as Page)
    if (startOnLoginPage) {
      await login.gotoLoginPage()
      await login.expectOnLoginPage()
    }
    await use(login)
  },

  validUser: async ({}, use) => {
    await use(validLoginData)
  },

  invalidUsers: async ({}, use) => {
    await use(invalidLoginTests)
  },
})

export { expect } from "@playwright/test"
