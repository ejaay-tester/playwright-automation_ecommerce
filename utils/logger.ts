import { TEST_CONFIG } from "config/testConfig"

export const log = (message: string) => {
  if (TEST_CONFIG.debug) {
    console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`)
  }
}
