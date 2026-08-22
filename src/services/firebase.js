import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDhDJNjA23Q7GDCzL2MrAcR63E4uhCV75Y',
  authDomain: 'aqua-trace-tn.firebaseapp.com',
  projectId: 'aqua-trace-tn',
  storageBucket: 'aqua-trace-tn.firebasestorage.app',
  messagingSenderId: '180150415998',
  appId: '1:180150415998:web:5dec6f7a2a253827ffde2f',
  measurementId: 'G-9D39MX621C',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
