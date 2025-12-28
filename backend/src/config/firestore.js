// src/config/firestore.js - Configuração do Firestore (APENAS FIRESTORE)
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Inicializa Firebase Admin se não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
  console.log('✅ Firebase Admin inicializado (Firestore)');
}

// Exporta serviços - APENAS FIRESTORE (sem Realtime Database)
export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;

// Coleções
export const collections = {
  clientes: firestore.collection('clientes'),
  veiculos: firestore.collection('veiculos'),
  pagamentos: firestore.collection('pagamentos'),
  usuarios: firestore.collection('usuarios'),
  configuracoes: firestore.collection('configuracoes')
};

export default { firestore, auth, storage, collections, FieldValue, Timestamp };
