import { atom } from 'recoil';

const userInputState = atom({
  key: 'userInput',
  default: {},
});

const currentLoginUserData = atom({
  key: 'currentLoginUser',
  default: null,
});

export { userInputState, currentLoginUserData };
