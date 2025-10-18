export const userLoginData = {
  validUserLogin: {
    email: "test@yopmail.com",
    password: "Ak0@ytester",
    meta: {
      id: "101",
      title: "Login with valid user credentials",
      loginKey: "validUserLogin",
      loginErrorMessage: "",
    },
  },
  invalidUserLogin: {
    invalidEmail: {
      email: "test",
      password: "Ak0@ytester",
      meta: {
        id: "102",
        title: "Login with invalid email",
        loginKey: "invalidEmail",
        loginErrorMessage: "Your email is invalid",
      },
    },
    invalidPassword: {
      email: "test@yopmail.com",
      password: "akoaytester",
      meta: {
        id: "103",
        title: "Login with invalid password",
        loginKey: "invalidPassword",
        loginErrorMessage: "Your password is invalid",
      },
    },
    invalidEmailAndPassword: {
      email: "test",
      password: "akoaytester",
      meta: {
        id: "104",
        title: "Login with invalid email and password",
        loginKey: "invalidEmailAndPassword",
        loginErrorMessage: "Your email and password is invalid",
      },
    },
  },
}
