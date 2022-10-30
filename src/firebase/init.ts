import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAjDrDDgnLR6P5c8SANZhfe1v_NS8w_L2w",
    authDomain: "geometrydash-place.firebaseapp.com",
    databaseURL: "https://geometrydash-place-default-rtdb.firebaseio.com/",
    projectId: "geometrydash-place",
    storageBucket: "geometrydash-place.appspot.com",
    messagingSenderId: "834241355775",
    appId: "1:834241355775:web:9fa08865bd618995b651ca",
    measurementId: "G-DREX7FG1NR",
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
