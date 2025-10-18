// Type definition for valid & invalid user logins (combined)
export type AuthUser = {
  validUserLogin: UserCredentials
  invalidUserLogin: Record<InvalidLoginKeys, UserCredentials>
}

// Type definition for login credentials + metadata
export type UserCredentials = {
  email: string
  password: string
  meta: UserLoginMeta
}

// Type definition for metadata of user login
export type UserLoginMeta = {
  loginKey: LoginKey
  loginErrorMessage: string
}

// Type definition for login key
export type LoginKey = ValidLoginKeys | InvalidLoginKeys

// Type definition for valid login key
export type ValidLoginKeys = "validUserLogin"

// Type definition for invalid login key
type InvalidLoginKeys =
  | "invalidEmail"
  | "invalidPassword"
  | "invalidEmailAndPassword"
