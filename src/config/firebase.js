import {initializeApp}  from 'firebase/app';
import {initializeAuth,getReactNativePersistence} from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

import{API_KEY,    AUTH_DOMAIN,    PROJECT_ID,    STORAGE_BUCKET,    MESSAGING_SENDER_ID,
    APP_ID, MEASUREMENTID} from '@env';

    const firebaseConfig = {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        measurementId: MEASUREMENTID
    };

    const app = initializeApp(firebaseConfig);

    const db = initializeFirestore(app, {
        experimentalForceLongPolling: true
        });

    const storage = getStorage(app);   
    
    const auth = initializeAuth(app,{
        persistence: getReactNativePersistence(AsyncStorage)
    })

    export {auth,db,storage};