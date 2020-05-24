import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import {db} from './firestore';
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const app = express();
app.use(cors());

interface FirestoreUser {
  id: string,
  name: string,
  uid: string,
}

app.get('/users', async(req, res) => {
  let users: FirestoreUser[] = []

  const querySnapshot = await db.collection('users').get()
  querySnapshot.forEach(doc => {
    const user: FirestoreUser = {
      id: doc.id,
      name: doc.data().name,
      uid: doc.data().uid,
    }
    users.push(user)
  })

  res.send(JSON.stringify(users))
});

app.post('/users/signup', async(req, res) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);
    if (decodedToken.uid) {
      await db.collection('users').add({
        name: req.body.name,
        email: req.body.email,
        uid: decodedToken.uid,
      })
      const data = {
        status: "success",
      
      };
      res.send(JSON.stringify(data));
    }
  } catch {
    const data = {
      status: 'fail',
    };
    res.send(JSON.stringify(data));
  }
});

const usersApi = functions.https.onRequest(app);
module.exports = {usersApi}
