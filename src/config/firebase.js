import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// 구글 로그인
const provider = new GoogleAuthProvider();

// users 데이터 반환함수
const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const data = [];

    querySnapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
};

// users 데이터 추가 함수
const addData = async ({
  userEmail,
  userPassword,
  userName,
  gender,
  residence,
  interest,
  userNickName,
  userIntroduce,
}) => {
  try {
    await addDoc(collection(db, 'users'), {
      userEmail,
      userPassword,
      userName,
      gender,
      residence,
      interest,
      userNickName,
      userIntroduce,
    });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// 신규가입
const addNewUser = async (userEmail, userPassword) => {
  try {
    await createUserWithEmailAndPassword(auth, userEmail, userPassword);
  } catch (error) {
    const errorMessage = error.message;
    console.log({ errorMessage });
  }
};

// 기존 사용자 로그인
const loginExistUser = async (userEmail, userPassword) => {
  try {
    const loginUser = await signInWithEmailAndPassword(auth, userEmail, userPassword);
  } catch (error) {
    const errorMessage = error.message;
    console.error(errorMessage);
  }
};

// 구글 소셜 로그인
const googleLoginUser = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  }
};

// 회원 로그아웃
const logOutUser = async () => {
  await auth.signOut();
};

// 로그인 유저 이메일 받기
const getLoginUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      user => {
        if (user) {
          const { email } = user;
          resolve(email);
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};

// getLoginUser 함수를 이용하여 로그인 유저의 이메일로 유저정보 받기 (비로그인 시 null)
const fetchLoginUserData = async () => {
  try {
    const currentLoginUserEmail = await getLoginUser();
    if (currentLoginUserEmail) {
      console.log('로그인된 사용자의 이메일:', currentLoginUserEmail);
      const userData = await fetchData();
      const targetData = userData.find(({ userEmail }) => userEmail === currentLoginUserEmail);
      return targetData;
    } else {
      console.log('사용자가 로그아웃 상태입니다.');
      return null;
    }
  } catch (error) {
    console.error('에러 발생:', error);
    return null;
  }
};

export { addData, fetchData, addNewUser, loginExistUser, fetchLoginUserData, logOutUser, googleLoginUser, auth };
