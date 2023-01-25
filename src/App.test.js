import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const setup = () => render(<App />);

beforeEach(() => {});

const typeIntoForm = ({ email, password, confirmPassword }) => {
  const emailInputElement = screen.getByRole("textbox", {
    name: /email/i,
  });
  const passwordInputElement = screen.getByLabelText("Password");
  const confirmPasswordInputElement =
    screen.getByLabelText(/confirm password/i);

  if (email) {
    userEvent.type(emailInputElement, email);
  }

  if (password) {
    userEvent.type(passwordInputElement, password);
  }

  if (confirmPassword) {
    userEvent.type(confirmPasswordInputElement, confirmPassword);
  }

  return {
    emailInputElement,
    passwordInputElement,
    confirmPasswordInputElement,
  };
};

const submitForm = () => {
  const submitBtnElement = screen.getByRole("button", { name: /submit/i });
  userEvent.click(submitBtnElement);
};

describe("App component", () => {
  test("inputs should be initially empty", () => {
    setup();
    expect(screen.getByRole("textbox").value).toBe("");
    expect(screen.getByLabelText("Password").value).toBe("");
    expect(screen.getByLabelText(/confirm password/i).value).toBe("");
  });

  test("should be able to type an email", () => {
    setup();
    const { emailInputElement } = typeIntoForm({ email: "selena@gmail.com" });
    expect(emailInputElement.value).toBe("selena@gmail.com");
  });

  test("should be able to type a password", () => {
    setup();
    const { passwordInputElement } = typeIntoForm({ password: "qwer1234" });
    expect(passwordInputElement.value).toBe("qwer1234");
  });

  test("should be able to confirm a password", () => {
    setup();
    const { confirmPasswordInputElement } = typeIntoForm({
      confirmPassword: "qwer1234",
    });
    expect(confirmPasswordInputElement.value).toBe("qwer1234");
  });

  describe("Error Handling", () => {
    test("should show email error message on invalid email", () => {
      setup();
      expect(
        screen.queryByText(/the email you input is invalid/)
      ).not.toBeInTheDocument();
      typeIntoForm({ email: "selenagmail.com" });
      submitForm();
      expect(
        screen.queryByText(/the email you input is invalid/i)
      ).toBeInTheDocument();
    });

    test("should show invalid password error message if password is less than 5 characters", () => {
      setup();
      expect(
        screen.queryByText(
          /The password you entered should contain 5 or more characters/i
        )
      ).not.toBeInTheDocument();
      typeIntoForm({ email: "selena@gmail.com" });
      typeIntoForm({ password: "123" });
      submitForm();
      expect(
        screen.queryByText(
          /The password you entered should contain 5 or more characters/i
        )
      ).toBeInTheDocument();
    });

    test("should show passwords don't match error message if passwords don't match", () => {
      setup();
      typeIntoForm({
        emial: "selena@gmail.com",
        password: "qwer12345",
        confirmPassword: "12345qwer",
      });

      expect(
        screen.queryByText(/The passwords don't match. Try again/i)
      ).not.toBeInTheDocument();
      setTimeout(() => {
        submitForm();
        expect(
          screen.queryByText(/The passwords don't match. Try again/i)
        ).toBeInTheDocument();
      }, 0.0005);
    });

    test("should show no error message if all inputs are valid", () => {
      setup();
      typeIntoForm({
        emial: "selena@gmail.com",
        password: "qwer12345",
        confirmPassword: "qwer12345",
      });
      setTimeout(() => {
        submitForm();
        expect(
          screen.queryByText(/the email you input is invalid/i)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(
            /The password you entered should contain 5 or more characters/i
          )
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/The passwords don't match. Try again/i)
        ).not.toBeInTheDocument();
      }, 0.0005);
    });
  });
});
