import {initializeApp} from 'firebase/app'
import{
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp, 
  getDoc, updateDoc
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAwdf96AdvcLAPjA9QC1Iv4v9RCnvJxIJ4",
    authDomain: "fir-9-risnaamanda.firebaseapp.com",
    projectId: "fir-9-risnaamanda",
    storageBucket: "fir-9-risnaamanda.appspot.com",
    messagingSenderId: "466507021656",
    appId: "1:466507021656:web:c919c28410ec0a4062392d",
    measurementId: "G-NR5XZ6DMMH"
  }

  //init firebase app
  initializeApp(firebaseConfig)

  //init service
  const db = getFirestore()
  const auth = getAuth()


  //collection ref
  const colRef = collection(db, 'books')

  //queries 
  const q = query(colRef,  orderBy('createdAt'))

  //real  collection data
  const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
      books.push({...doc.data( ), id: doc.id })
   })
    console.log(books)
})

//add document
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value ,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})


//delete document
const deleteBookForm = document.querySelector('.delete')
deleteBookForm .addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
  .then(() => {
    deleteBookForm.reset()
  })
})


//get a single document
const docRef = doc(db, 'books', 'B3FjlATT87sstK9DgmEG')

  const unsubDoc  = onSnapshot(docRef,  (doc) => {
    console.log(doc.data(), doc.id)
  })

  //updating a document
const updateForm = document.querySelector('.update')
updateForm .addEventListener('submit', (e) => {
  e.preventDefault()


  const docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'update title'
  })
  .then(() => {
    updateForm.reset()
  })
})


//signup users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
     // console.log('user created:', cred.user)
      signupForm.reset()
   })
    .catch((err) => {
      console.log(err.message)
    })
})


//logging in & out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
     // console.log('the user signed out')
    })
    .catch((err) => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
   .then((cred) => {
      // console.log('user logged in:', cred.user)
      signupForm.reset()
   })
   .catch((err) => {
      console.log(err.message)
    })
})

//SUBSCRIBING TO AUTH CHANGES
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log( 'user status change:', user)
})

//unsubscribing from.....
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubcribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
})