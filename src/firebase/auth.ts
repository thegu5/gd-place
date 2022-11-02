import type { FirebaseApp } from "firebase/app"
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    type User,
    signOut as logOut,
    type UserCredential,
} from "firebase/auth"
import { get, getDatabase, onValue, ref, set } from "firebase/database"
import { getFirestore, doc } from "firebase/firestore"
import { derived, writable, type Writable } from "svelte/store"
import { auth, database } from "./init"

let googleProvider = new GoogleAuthProvider()
googleProvider.addScope("https://www.googleapis.com/auth/userinfo.profile")

export type UserData = {
    user: User
    data:
        | {
              username: string
              lastPlaced: number
              lastDeleted: number
          }
        | null // no user data
        | string // user data loading
}

export const currentUserData: Writable<UserData | null | string> = writable("loading")

export const signInGoogle = () => signInWithPopup(auth, googleProvider)
export const signOut = () => logOut(auth)

export const initUserData = (uid: string, username: string) => {
    set(ref(database, `userData/${uid}`), {
        username,
        lastPlaced: 0,
        lastDeleted: 0,
    })
}

// export const setUserData = (uid: string, field: string, data) => {
//     return set(ref(database, `userData/${uid}/${field}`), data);
// };

export const canEdit = derived(
    currentUserData,
    (value) => value != null && typeof value != "string" && value.data != null && typeof value.data != "string"
)

let userDataListener = null

onAuthStateChanged(auth, (user) => {
    if (user != null) {
        console.log("signed in")
        let userDataValue = {
            user,
            data: "loading",
        }

        currentUserData.set(userDataValue)
        if (userDataListener != null) {
            userDataListener()
        }
        userDataListener = onValue(ref(database, `userData/${user.uid}`), (snapshot) => {
            userDataValue.data = snapshot.val()
            currentUserData.set(userDataValue)
        })
    } else {
        console.log("signed out")
        if (userDataListener != null) {
            userDataListener()
        }
        currentUserData.set(null)
    }
})

// onAuthStateChanged(auth, user => {
//     if (user) {
//         currentUser.set(user);

//         if (userDataListener != null) {
//             userDataListener();
//         }
//         userDataListener = onValue(
//             ref(database, `userData/${user.uid}`),
//             snapshot => {
//                 if (snapshot.val() == null) {
//                     set(ref(database, `userData/${user.uid}`), {
//                         username: null,
//                         lastPlaced: Date.now(),
//                     });
//                 }
//                 userExtraData.set(snapshot.val());
//             }
//         );
//     } else {
//         currentUser.set(null);
//     }
// });
