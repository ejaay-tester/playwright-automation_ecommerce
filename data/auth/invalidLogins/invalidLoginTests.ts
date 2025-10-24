import { LoginTestCase } from "../../../types/authTypes"
import { edgeCaseLoginData } from "./edgeCaseLoginData"
import { invalidEmailData } from "./invalidEmailData"
import { invalidPasswordData } from "./invalidPasswordData"
import { missingFieldsData } from "./missingFieldsData"
import { sqlInjectionData } from "./sqlInjectionData"
import { xssAttackData } from "./xssAttackData"

// Combine multiple invalid login datasets
export const invalidLoginTests: Readonly<LoginTestCase[]> = [
  ...invalidEmailData,
  ...invalidPasswordData,
  ...missingFieldsData,
  ...sqlInjectionData,
  ...xssAttackData,
  ...edgeCaseLoginData,
]
