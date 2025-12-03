import { Locator, expect } from "@playwright/test"
import { TEST_CONFIG } from "config/testConfig"

export default class Toast {
  //  Locators
  private readonly root: Locator

  constructor(root: Locator) {
    this.root = root
  }

  async expectMessage(text: string) {
    await expect(this.root).toBeVisible({
      timeout: TEST_CONFIG.timeouts.toast,
    })

    await expect(this.root).toContainText(text, {
      timeout: TEST_CONFIG.timeouts.toast,
    })
  }

  async waitForDisappear() {
    await expect(this.root).toBeHidden({
      timeout: TEST_CONFIG.timeouts.toastDisappear,
    })
  }
}
