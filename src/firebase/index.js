const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, setDoc, doc, Timestamp } = require('firebase/firestore');

const app =
  getApps().length === 0
    ? initializeApp({
        apiKey: 'AIzaSyBui_TwrD-19UI7jeyqiTLXBGqsXDfh7Cg',
        authDomain: 'mhwlib.firebaseapp.com',
        projectId: 'mhwlib',
        storageBucket: 'mhwlib.appspot.com',
        messagingSenderId: '160014247151',
        appId: '1:160014247151:web:1c20d3b5569b2ca29da71a',
        measurementId: 'G-QXXJLMDSMM',
      })
    : getApps()[0];

const db = getFirestore(app);

const dataConverter = {
  toFirestore: (data) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });
    return data;
  },
};

const progress = async ({ uuid, percentage, payload }, callback) => {
  console.log('uuid', uuid);
  //update doc with uid with percentage and payload fields
  const docRef = doc(db, 'geneated-schedules', uuid).withConverter(
    dataConverter
  );
  const dataUpdate = {
    ...payload,
    uuid,
    percentage,
    createdAt: Timestamp.now(),
  };
  setDoc(docRef, dataUpdate, { merge: true })
    .catch((error) => console.log('Error writing document: ', error))
    .finally(() => callback());
};

module.exports = {
  progress,
  app,
  db,
};
//const analytics = getAnalytics(app);
