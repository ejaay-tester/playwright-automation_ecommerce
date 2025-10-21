// This file handles data transformation logic.
// For invalidLoginTests only

import { LoginKey, LoginTestCase } from "../../types/authTypes"
import { userLoginData } from "./loginData"

export const invalidLoginTests: LoginTestCase[] = Object.entries(userLoginData)
  .filter(([loginKey]) => loginKey !== "validUserLogin") // filter out the loginKey "validUserLogin"
  .map(([loginKey, userCredentials]) => ({
    loginKey: loginKey as Exclude<LoginKey, "validUserLogin">,
    ...userCredentials,
  }))
