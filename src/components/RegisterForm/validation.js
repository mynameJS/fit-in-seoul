import { fetchData } from '../../config/firebase.js';

const userIdValidation = userInput => {
  const minLength = 6;
  const maxLength = 10;
  if (userInput.length <= minLength || userInput.length > maxLength) {
    return false;
  }

  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(userInput)) {
    return false;
  }
  return true;
};

const userEmailValidation = userInput => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return re.test(String(userInput).toLowerCase());
};

const userPasswordValidation = userInput => {
  const minLength = 8;
  if (userInput.length < minLength) {
    return false;
  }

  const hasWhitespace = /\s/;
  if (hasWhitespace.test(userInput)) {
    return false;
  }

  return true;
};

const userPasswordConfirm = (password, passwordConfirm) => {
  if (password !== passwordConfirm) return false;
  return true;
};

const userInterestValidation = userInput => {
  if (userInput.length === 0) return false;
  return true;
};

const userNickNameValidation = userInput => {
  const maxLength = 8;
  if (userInput.length > maxLength) return false;

  const regex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/;
  if (!regex.test(userInput)) {
    return false;
  }
  return true;
};

const checkDuplicateIdValidation = async userInput => {
  const userData = await fetchData();
  return userData.some(({ userEmail }) => userInput === userEmail);
};

const loginConfirmValidation = async ({ userInputEmail, userInputPassword }) => {
  const userData = await fetchData();
  const targetData = userData.find(({ userEmail }) => userEmail === userInputEmail);

  if (!targetData) return false;
  if (targetData.userEmail === userInputEmail && targetData.userPassword === userInputPassword) return 2;

  return [null, 1];
};

export {
  userIdValidation,
  userPasswordValidation,
  userPasswordConfirm,
  userInterestValidation,
  userNickNameValidation,
  checkDuplicateIdValidation,
  loginConfirmValidation,
  userEmailValidation,
};
