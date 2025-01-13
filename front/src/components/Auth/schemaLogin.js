import * as yup from "yup";
import yupPassword from 'yup-password';
yupPassword(yup);

export const schemaEmail = yup.object().shape({
  email: yup
    .string()
    .email("Email should have correct format")
    .trim()
    .required("Required field"),
});

export const schemaPassword = yup.object().shape({
  password: yup
    .string()
    .password()
    .min(8, 'Password must be at least 8 characters')
    .minUppercase(1, 'The password must contain at least one capital letter')
    .minLowercase(1, 'Password must include at least one lowercase letter')
    .minNumbers(1, 'The password must contain at least one digit')
    .minSymbols(1, 'Password must include at least one special character')
    .required('Required field')
});