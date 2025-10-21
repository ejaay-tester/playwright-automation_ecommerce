// Enumerate login keys
export type LoginKey =
  | "validUserLogin"
  | "invalidEmail"
  | "invalidPassword"
  | "invalidEmailAndPassword"

// Basic user credentials
export type UserCredentials = {
  email: string
  password: string
  meta: UserLoginMeta
}

// Common metadata for any login test case
export type UserLoginMeta = {
  id: number
  title: string
  errorMessage?: string
}

// Single container for all login cases
export type AuthUser = Record<LoginKey, UserCredentials>

// Type representing a single test case (with key + credentials)
export type LoginTestCase = UserCredentials & { loginKey: LoginKey }
