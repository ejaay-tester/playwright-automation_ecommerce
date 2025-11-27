export const TEST_CONFIG = {
  //  URLs
  baseURL: process.env.BASE_URL || "https://practicesoftwaretesting.com/",

  //  TIMEOUTS
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,

    // Toast-specific timeouts
    toast: 5000, // time allowed for toast to appear
    toastDisappear: 7000, // time allowed for toast to auto-dismiss
  },

  //  DEBUG
  debug: process.env.DEBUG === "true",
}
