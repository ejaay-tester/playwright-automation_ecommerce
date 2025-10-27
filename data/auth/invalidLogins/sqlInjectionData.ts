import { LoginTestCase } from "../../../types/authTypes"

// Goal: Ensure the system doesn't crash, leaks data, or bypass auth when SQL payloads are entered.
// Expected: Application safely rejects input (generic error message, no crash, no leakage).

const sqlInjectionData: Readonly<LoginTestCase[]> = [
  // Login credentials using SQL injection payload
  {
    email: "' OR '1'='1",
    password: "' OR '1'='1",
    meta: {
      id: 109,
      title: "Login with SQL injection payload (' OR '1'='1)",
      emailError: "Email format is invalid",
    },
  },

  // Login credentials using SQL comment injection
  {
    email: "test@yopmail.com'--",
    password: "Ak0@ytester",
    meta: {
      id: 110,
      title: "Login with SQL comment injection",
      emailError: "Email format is invalid",
    },
  },

  // Login credentials using destructive SQL command attempt
  {
    email: "admin'; DROP TABLE users;--",
    password: "Ak0@ytester",
    meta: {
      id: 111,
      title: "Login with destructive SQL command attempt",
      emailError: "Email format is invalid",
    },
  },
]

export default sqlInjectionData
