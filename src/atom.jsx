import { atom } from 'recoil';

const userInputState = atom({
  key: 'userInput',
  default: {},
});

const userInputLoginData = atom({
  key: 'userInputLogin',
  default: {
    userInputId: '',
    userInputPassword: '',
  },
});

export { userInputState, userInputLoginData };
