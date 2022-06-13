export const validateEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};
export const validatePhone = (phone) => {
  var re = /^\d{10}$/;
  return re.test(phone);
};
export const validateName = (name) => {
  var re = /^[a-zA-Z]+$/;
  return re.test(name);
};
