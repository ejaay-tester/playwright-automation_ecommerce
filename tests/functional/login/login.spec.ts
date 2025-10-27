import { test } from "../../../fixtures/authFixture"
import validLoginData from "data/auth/validLoginData"
import invalidLoginTests from "data/auth/invalidLoginTests"

test.describe("Login Feature Test | Valid Login Credentials @regression @smoke", () => {
  const { id, title } = validLoginData.meta

  test(`JIRA-${id}: ${title}`, async ({ loginPage, validUser }) => {
    const { email, password } = validUser
    await loginPage.userLogin(email, password)
    await loginPage.expectOnUserDashboard()
  })
})

// Negative Login Tests (loop-driver)
test.describe("Login Feature Test | Invalid Login Credentials @regression @smoke", () => {
  for (const { email, password, meta } of invalidLoginTests) {
    test(`JIRA-${meta.id}: ${meta.title}`, async ({ loginPage }) => {
      await loginPage.userLogin(email, password)

      // Wait for error alert to appear if applicable
      if (meta.emailError) await loginPage.expectEmailError(meta.emailError)
      if (meta.passwordError)
        await loginPage.expectPasswordError(meta.passwordError)
      if (meta.loginError) await loginPage.expectLoginError(meta.loginError)
    })
  }
})
