import * as Yup from "yup";

// ── Shared field rules ──────────────────────────────────────────────
const emailRule = Yup.string()
  .trim()
  .email("Please enter a valid email address")
  .required("Email address is required");

const nameRule = (label: string) =>
  Yup.string()
    .trim()
    .min(2, `${label} must be at least 2 characters`)
    .required(`${label} is required`);

// ── Login ───────────────────────────────────────────────────────────
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const loginInitialValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export const loginSchema = Yup.object().shape({
  email: emailRule,
  password: Yup.string().required("Password is required"),
});

// ── Signup ──────────────────────────────────────────────────────────
export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export const signupInitialValues: SignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: true,
};

export const signupSchema = Yup.object().shape({
  firstName: nameRule("First name"),
  lastName: nameRule("Last name"),
  email: emailRule,
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null as any], "Passwords do not match")
    .required("Please confirm your password"),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms & conditions"
  ),
});
