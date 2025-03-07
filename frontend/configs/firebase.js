//初始化firebase
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBBLclSk6cqk34dhMW4waktZBvi7JFIOnQ',
  authDomain: 'gohealthier-b8b8c.firebaseapp.com',
  projectId: 'gohealthier-b8b8c',
  storageBucket: 'gohealthier-b8b8c.appspot.com',
  messagingSenderId: '775322994222',
  appId: '1:775322994222:web:544790544f52cb5eb201bf',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
