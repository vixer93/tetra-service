import * as functions from 'firebase-functions';
import * as express from 'express';
import {db} from './firestore';

const app = express();

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

const usersApi = functions.https.onRequest(app);
module.exports = {usersApi}
