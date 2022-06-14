export const validatePhoneNumber = (input_str) => {
  var re = /^[0-9]{8}$/;
  return re.test(input_str);
};
export const validateEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const validValues = (values) => {
  let isValid = validatePhoneNumber(values.phoneNumber);
  if (!isValid) {
    return "Invalid phone number";
  }
  isValid = validateEmail(values.email);
  if (!isValid) {
    return "Invalid email";
  }
  return null;
};
export default validValues;
