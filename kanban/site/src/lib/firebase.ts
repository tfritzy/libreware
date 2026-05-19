import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAriPiI4mP523wWvyVFwtzjlSw9NhvmeAE",
  authDomain: "kanban-libreware.firebaseapp.com",
  projectId: "kanban-libreware",
  storageBucket: "kanban-libreware.firebasestorage.app",
  messagingSenderId: "991685812434",
  appId: "1:991685812434:web:439ffc548d4d33fc314d0b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { auth, db };
