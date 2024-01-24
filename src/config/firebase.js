import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';

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

// 현재 시간을 Firestore Timestamp로 변환
const getCurrentTimestamp = () => {
  return Timestamp.now();
};

// users 정보 업데이트
const updateData = async (docId, newData) => {
  try {
    const userRef = doc(db, 'users', docId);
    await updateDoc(userRef, newData);
    console.log('Document updated successfully!');
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

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
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  }
};

// 회원 로그아웃
const logOutUser = async () => {
  await auth.signOut();
};

// 회원 계정탈퇴
const userAccountDelete = async () => {
  const user = auth.currentUser;
  try {
    await deleteUser(user);
    console.log('계정이 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error('Error delete account: ', error);
  }
};

// 회원정보 삭제
const deleteUserData = async userId => {
  try {
    const userDocRef = doc(db, 'users', userId);
    console.log(userDocRef);
    await deleteDoc(userDocRef);
    console.log(`문서 ${userId}가 성공적으로 삭제되었습니다.`);
  } catch (error) {
    console.error(`문서 삭제 중 오류 발생: ${error}`);
  }
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

// getLoginUser 함수를 이용하여 로그인 유저의 이메일로 유저정보 받기
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

// posting 데이터 추가 함수
const addPostingData = async ({ writer, writerNickName, title, category, date, count, location, content }) => {
  try {
    await addDoc(collection(db, 'post'), {
      writer,
      writerNickName,
      title,
      category,
      date,
      count,
      location,
      content,
    });
  } catch (e) {
    console.error('Error adding posting: ', e);
  }
};

// posting 데이터 반환함수
const fetchPostingData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'post'));
    const data = [];

    querySnapshot.forEach(doc => {
      data.push({
        id: doc.id,
        createTime: doc._document.createTime.timestamp.seconds,
        ...doc.data(),
      });
    });

    return data;
  } catch (error) {
    console.error('Error fetching posting data: ', error);
    return [];
  }
};

// posting 정보 업데이트
const updatePostingData = async (docId, newData) => {
  try {
    const userRef = doc(db, 'post', docId);
    await updateDoc(userRef, newData);
    console.log('Document updated successfully!');
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

// posting 데이터 삭제
const deletePostingData = async docId => {
  try {
    const postRef = doc(db, 'post', docId);
    await deleteDoc(postRef);
    console.log('Document deleted successfully!');
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
};

export {
  addData,
  fetchData,
  addNewUser,
  loginExistUser,
  fetchLoginUserData,
  logOutUser,
  googleLoginUser,
  updateData,
  addPostingData,
  fetchPostingData,
  updatePostingData,
  deletePostingData,
  getCurrentTimestamp,
  userAccountDelete,
  deleteUserData,
  auth,
};
