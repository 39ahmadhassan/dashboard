import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Ensure environment variables are defined
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error(
    "Firebase service account environment variables are missing! Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
  );
}

// Initialize Firebase Admin app only once
let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
} else {
  adminApp = getApps()[0];
}

// Firestore instance (PRIMARY)
export const adminDb: Firestore = getFirestore(adminApp);

// ✅ Alias export for Server Actions (NON-BREAKING)
export const db = adminDb;















// import { getApps, initializeApp, cert, App } from "firebase-admin/app";
// import { getFirestore, Firestore } from "firebase-admin/firestore";

// // Ensure environment variables are defined
// if (
//   !process.env.FIREBASE_PROJECT_ID ||
//   !process.env.FIREBASE_CLIENT_EMAIL ||
//   !process.env.FIREBASE_PRIVATE_KEY
// ) {
//   throw new Error(
//     "Firebase service account environment variables are missing! Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
//   );
// }

// // Initialize Firebase Admin app only once
// let adminApp: App;

// if (!getApps().length) {
//   adminApp = initializeApp({
//     credential: cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     }),
//   });
// } else {
//   adminApp = getApps()[0];
// }

// // Get Firestore instance
// export const adminDb: Firestore = getFirestore(adminApp);