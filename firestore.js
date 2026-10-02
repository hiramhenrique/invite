import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBfCrlujg1GophK2YtRCubcQulXbDwp1NA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "convite-de-aniversario-1af15.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "convite-de-aniversario-1af15",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "convite-de-aniversario-1af15.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "237323819382",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:237323819382:web:cb1b15b0aba06fe7680257",
};

function isFirebaseConfigValid(config) {
  return Object.values(config).every((value) => typeof value === "string" && value.trim() !== "");
}

const firebaseReady = isFirebaseConfigValid(firebaseConfig);
const app = firebaseReady ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;
const confirmationsCollectionName = "confirmations";

export function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function ensureFirebaseReady() {
  if (!firebaseReady || !db) {
    throw new Error("Firebase não configurado. Preencha as variáveis VITE_FIREBASE_* no arquivo .env.");
  }
}

export async function isPhoneAlreadyUsed(phone) {
  ensureFirebaseReady();

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return false;
  }

  const q = query(
    collection(db, confirmationsCollectionName),
    where("normalizedPhone", "==", normalizedPhone)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function addGuestConfirmation(confirmation) {
  ensureFirebaseReady();

  const payload = {
    ...confirmation,
    normalizedPhone: normalizePhone(confirmation.phone),
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, confirmationsCollectionName), payload);
}

export function subscribeGuestConfirmations(onChange, onError) {
  ensureFirebaseReady();

  const q = query(collection(db, confirmationsCollectionName), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      onChange(list);
    },
    (error) => {
      if (typeof onError === "function") {
        onError(error);
      }
    }
  );
}

export async function deleteGuestConfirmation(id) {
  ensureFirebaseReady();
  await deleteDoc(doc(db, confirmationsCollectionName, id));
}

export function isFirestoreConfigured() {
  return firebaseReady;
}
