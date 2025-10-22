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
  emailError?: string
  passwordError?: string
  loginError?: string
}

// Type representing a single test case
export type LoginTestCase = UserCredentials
