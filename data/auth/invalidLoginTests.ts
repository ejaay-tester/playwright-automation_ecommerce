// =====================================
// MANUALLY IMPORTS EACH INVALID DATASET
// =====================================

// import { LoginTestCase } from "types/authTypes"
// import edgeCaseLoginData from "./invalidLogins/edgeCaseLoginData"
// import invalidEmailData from "./invalidLogins/invalidEmailData"
// import invalidPasswordData from "./invalidLogins/invalidPasswordData"
// import missingFieldsData from "./invalidLogins/missingFieldsData"
// import sqlInjectionData from "./invalidLogins/sqlInjectionData"
// import xssAttackData from "./invalidLogins/xssAttackData"

// Combine all invalid datasets in one entry point
// export const invalidLoginTests: Readonly<LoginTestCase[]> = [
//   ...invalidEmailData,
//   ...invalidPasswordData,
//   ...missingFieldsData,
//   ...sqlInjectionData,
//   ...xssAttackData,
//   ...edgeCaseLoginData,
// ]

// ====================================
// OR
// AUTO-LOAD ALL DATA FILES DYNAMICALLY
// ====================================

// Advantages of this approach
// You don't need to manually import each dataset.
// It automatically scales - just drop a new file and it's automatically included.
// Keeps your invalidLoginTests.ts file clean and future-proof.

import fs from "fs"
import path from "path"

const invalidTestDataDir = path.join(__dirname, "invalidLogins") // Added the path of the folder where the invalid login dataset takes places

const invalidLoginsFiles = fs
  .readdirSync(invalidTestDataDir) // automatically lists all files of invalid login dataset
  .filter((file) => file.endsWith("Data.ts")) // ensures only files that follow your naming convention are included (has Data.ts from the filename)

const invalidLoginTests = invalidLoginsFiles.flatMap(
  // loads and merges the exported invalid test data from each file
  (file) => require(path.join(invalidTestDataDir, file)).default
)

export default invalidLoginTests

// Optional, if you want to group or filter then dynamically
// export const emailValidationTests = invalidLoginTests.filter(
//   (test) => test.meta.emailError
// )

// export const passwordValidationTests = invalidLoginTests.filter(
//   (test) => test.meta.passwordError
// )

// export const loginValidationTests = invalidLoginTests.filter(
//   (test) => test.meta.loginError
// )
