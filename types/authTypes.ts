// Single container for all login cases
export type AuthUser = Record<LoginKey, UserCredentials>

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

// Enumerate login keys
export type LoginKey =
  | "validUserLogin"
  | "invalidEmail"
  | "invalidPassword"
  | "invalidEmailAndPassword"

// Type representing a single test case (with key + credentials)
export type LoginTestCase = UserCredentials & { loginKey: LoginKey }
