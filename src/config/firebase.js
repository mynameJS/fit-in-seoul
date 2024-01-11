import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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

// 신규가입
const addNewUser = async (userEmail, userPassword) => {
  try {
    const createUser = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log({ errorMessage });
  }
};

// 기존 사용자 로그인
const loginExistUser = async (userEmail, userPassword) => {
  try {
    const loginUser = await signInWithEmailAndPassword(auth, userEmail, userPassword);
    console.log(loginUser);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log({ errorMessage });
  }
};

// users 데이터 추가 함수
async function addData({
  userEmail,
  userPassword,
  userName,
  gender,
  residence,
  interest,
  userNickName,
  userIntroduce,
}) {
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
}

// users 데이터 반환함수
async function fetchData() {
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
}

export { addData, fetchData, addNewUser, loginExistUser };
