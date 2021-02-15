import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

const devConfig = {
    apiKey: 'AIzaSyA8gs45cLUFDL0bK0De7WVVZ-JxhTaL0x8',
    authDomain: 'kosku-dev-07022021.firebaseapp.com',
    projectId: 'kosku-dev-07022021',
    storageBucket: 'kosku-dev-07022021.appspot.com',
    messagingSenderId: '962363671156',
    appId: '1:962363671156:web:e67143d55a7e16c4fc0721',
    measurementId: 'G-HN2RPB2YC3'
}

const prodConfig = {
    apiKey: 'AIzaSyC4BJqiqQO4jRHyXbCTs1aOx-D6h0JyyGY',
    authDomain: 'kosku-prod-07022021.firebaseapp.com',
    projectId: 'kosku-prod-07022021',
    storageBucket: 'kosku-prod-07022021.appspot.com',
    messagingSenderId: '908083899864',
    appId: '1:908083899864:web:11a236ac1e6724ae2996ad',
    measurementId: 'G-QNKJN3SFK6'
}

if (process.env.NODE_ENV === 'development') {
    firebase.initializeApp(devConfig)
} else {
    firebase.initializeApp(prodConfig)
}

firebase.analytics()

export const useAuth = firebase.auth()
export const useDb = firebase.firestore()