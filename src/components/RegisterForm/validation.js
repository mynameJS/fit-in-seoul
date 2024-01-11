import { fetchData } from '../../config/firebase.js';

// 아이디 유효성 검사
const userIdValidation = userInput => {
  // 아이디 6 ~ 10자 사이
  const minLength = 6;
  const maxLength = 10;
  if (userInput.length <= minLength || userInput.length > maxLength) {
    return false;
  }

  // 특수문자나 공백을 포함하지 않아야 함
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(userInput)) {
    return false;
  }
  return true;
};

// 이메일 유효성검사
const userEmailValidation = userInput => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식을 정의한 정규표현식

  return re.test(String(userInput).toLowerCase()); // 정규표현식과 매칭되는지 확인하여 유효성 검사
};

const userPasswordValidation = userInput => {
  // 비밀번호 8자리 이상
  const minLength = 8;
  if (userInput.length < minLength) {
    return false;
  }

  // 공백 포함 여부 검사
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

  // 일치하는 data 없음
  if (!targetData) return [targetData, false];
  if (targetData.userEmail === userInputEmail && targetData.userPassword === userInputPassword) return [targetData, 2];

  // 아이디만 일치
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
