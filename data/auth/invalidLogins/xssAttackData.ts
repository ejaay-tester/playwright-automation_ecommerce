import { LoginTestCase } from "../../../types/authTypes"

// Goal: Prevent malicious script injection in login forms or error messages.
// Expected: System treats input as plain text; no JavaScript execution occurs

const xssAttackData: Readonly<LoginTestCase[]> = [
  // Login credentials using script tag in email field
  {
    email: `<script>alert('XSS')</script>`,
    password: "Ak0@ytester",
    meta: {
      id: 112,
      title: "Login with script tag in email field",
      emailError: "Email format is invalid",
    },
  },

  // Login credentials using image tag injection in email field
  {
    email: `"><img src=x onerror=alert('hack')>`,
    password: "Ak0@ytester",
    meta: {
      id: 113,
      title: "Login with image tag injection in email field",
      emailError: "Email format is invalid",
    },
  },
]

export default xssAttackData
