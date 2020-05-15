import * as firebaseAdmin from "firebase-admin";

if (!firebaseAdmin.apps.length) {
  const firebasePrivateKey = process.env.FB_ADMIN_PRIVATE_KEY

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL,
      privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FB_DATABASE_URL,
  });
}

export default firebaseAdmin;