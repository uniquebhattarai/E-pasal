import * as Yup from "yup";

// ── Shared field rules ──────────────────────────────────────────────
const emailRule = Yup.string()
  .trim()
  .email("Please enter a valid email address")
  .required("Email address is required");

const nameRule = (label) =>
  Yup.string()
    .trim()
    .min(2, `${label} must be at least 2 characters`)
    .required(`${label} is required`);

// ── Login ───────────────────────────────────────────────────────────
export const loginInitialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

export const loginSchema = Yup.object().shape({
  email: emailRule,
  password: Yup.string().required("Password is required"),
});

// ── Signup ──────────────────────────────────────────────────────────
export const signupInitialValues = {
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
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms & conditions"
  ),
});
