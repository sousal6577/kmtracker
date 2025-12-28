// src/config/firebase.js - Configuração do Firebase Admin SDK (APENAS FIRESTORE)
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Inicializar Firebase Admin
const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    console.log('✅ Firebase Admin inicializado (Firestore Only)');
  }
  return admin;
};

initializeFirebase();

// Exportar instâncias - APENAS FIRESTORE (sem Realtime Database)
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin;
