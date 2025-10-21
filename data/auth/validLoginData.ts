// This file only keeps the raw dataset of valid login data

import { UserCredentials } from "../../types/authTypes"

export const validLoginData: Readonly<UserCredentials> = {
  email: "test@yopmail.com",
  password: "Ak0@ytester",
  meta: { id: 101, title: "Login with valid user credentials" },
}
