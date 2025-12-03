import { expect, Locator } from "@playwright/test"
import { TEST_CONFIG } from "config/testConfig"

export default class QuantitySetter {
  //  Locators
  private readonly root: Locator
  private readonly quantityInputLabel: Locator
  private readonly increaseQuantityButton: Locator
  private readonly decreaseQuantityButton: Locator

  constructor(root: Locator) {
    this.root = root
    this.quantityInputLabel = root.locator('input[data-test="quantity"]')
    this.increaseQuantityButton = root.locator(
      'button[data-test="increase-quantity"]'
    )
    this.decreaseQuantityButton = root.locator(
      'button[data-test="decrease-quantity"]'
    )
  }

  //    Helper to get the current quantity value
  async getQuantityValue(): Promise<number> {
    return parseInt(await this.quantityInputLabel.inputValue(), 10)
  }

  //    Universal method to set the quantity (Increase and Decrease)
  //    Automatically decides whether to increase or decrease the quantity value
  //    Accepts any target quantity
  async setQuantityTo(targetQuantity: number): Promise<void> {
    //  Locate the quantity label locator
    await this.quantityInputLabel.scrollIntoViewIfNeeded()

    //  Fetch the current quantity value of the selected product
    const currentQuantity = await this.getQuantityValue()

    //  IF condition to throw an ERROR if the inputted TARGET QUANTITY is less than 1
    if (targetQuantity < 1)
      throw new Error(
        `Error: Target quantity must be positive number/integer | Received input: ${targetQuantity}`
      )

    //  IF condition to log if the CURRENT QUANTITY is equals to the inputted TARGET QUANTITY
    if (currentQuantity === targetQuantity) {
      console.log(
        `Info: Quantity already at ${targetQuantity}. Skipping update.`
      )
      return // Do not throw an error
    }

    //  Declares an immutable variable for increase (+)
    //  Target quantity should be greater than the current quantity
    const isIncreasing = targetQuantity > currentQuantity

    //  Ternary operator for which button to trigger for setting the quantity
    //  Linked to the increasing variable
    const quantitySetterButton = isIncreasing
      ? this.increaseQuantityButton
      : this.decreaseQuantityButton

    //  Calculates exactly how many clicks are needed
    //  Get the absolute value for the clicks needed to set the quantity
    //  Math.abs() method only gets the absolute value, it is always non-negative
    const totalClicksToUpdateQuantity = Math.abs(
      targetQuantity - currentQuantity
    )

    for (let i = 0; i < totalClicksToUpdateQuantity; i++) {
      await quantitySetterButton.click()

      const expectedValue = isIncreasing
        ? currentQuantity + (i + 1)
        : currentQuantity - (i + 1)

      await expect(this.quantityInputLabel).toHaveValue(
        expectedValue.toString()
      )
      console.log(`Quantity updated: ${expectedValue}`)
    }
  }

  //    Assert the quantity label based on the target quantity value
  async expectedValue(value: number) {
    await expect(this.quantityInputLabel).toBeVisible({
      timeout: TEST_CONFIG.timeouts.medium,
    })

    await expect(this.quantityInputLabel).toHaveValue(value.toString(), {
      timeout: TEST_CONFIG.timeouts.medium,
    })
  }
}
