import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
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
const analytics = getAnalytics(app);
const db = getFirestore(app);

// users 데이터 추가 함수
async function addData({ id, pw, name, gender, residence, interest, nickname, aboutme }) {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      id,
      pw,
      name,
      gender,
      residence,
      interest,
      nickname,
      aboutme,
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

export { addData, fetchData };
