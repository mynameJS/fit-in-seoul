import { atom } from 'recoil';

const userInputState = atom({
  key: 'userInput',
  default: {},
});

export { userInputState };
