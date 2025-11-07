export const TEST_CONFIG = {
  baseURL: process.env.BASE_URL || "https://practicesoftwaretesting.com/",
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
  },
  debug: process.env.DEBUG === "true",
}
