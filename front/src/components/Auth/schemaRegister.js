import * as yup from "yup";
import yupPassword from 'yup-password';
yupPassword(yup);

export const schema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .matches(/^([^0-9]*)$/, "Name should not contain numbers")
    .test('len', "The name is too short.", val => val ? val.length >= 4 : true)
    .max(32, "The name is too long")
    .required("Required field"),
  email: yup
    .string()
    .email("Email should have correct format")
    .trim()
    .required("Required field"),
  password: yup
    .string()
    .password()
    .required('Required field')
    .min(8, 'Password must be at least 8 characters')
    .minUppercase(1, 'The password must contain at least one capital letter')
    .minLowercase(1, 'Password must include at least one lowercase letter')
    .minNumbers(1, 'The password must contain at least one digit')
    .minSymbols(1, 'Password must include at least one special character'),
  confirmPassword: yup
    .string()
    .required('Required field')
    .test('match', 'The passwords must match', function (value) {
      return value === this.parent.password;
    })
});