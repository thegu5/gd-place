import { toast } from "@zerodevx/svelte-toast"
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
    GithubAuthProvider,
    signInWithEmailAndPassword,
    signInWithCredential,
    AuthCredential,
    signInWithCustomToken,
} from "firebase/auth"
import { get, getDatabase, onValue, ref, set } from "firebase/database"
import { getFirestore, doc } from "firebase/firestore"

import { toastErrorTheme } from "../const"
import { derived, writable, type Writable } from "svelte/store"
import { auth, database, initUserWithUsername } from "./init"

let googleProvider = new GoogleAuthProvider()
let githubProvider = new GithubAuthProvider()

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

export const currentUserData: Writable<UserData | null | string> =
    writable("loading")

export const signInGoogle = () => signInWithPopup(auth, googleProvider)
export const signInGithub = () => signInWithPopup(auth, githubProvider)

export const signOut = () => logOut(auth)

export const initUserData = (uid: string, username: string) => {
    initUserWithUsername({ uid, username })
        .then(() => {
            set(ref(database, `userData/${uid}`), {
                username,
                lastPlaced: 0,
                lastDeleted: 0,
            })
        })
        .catch((err) => {
            console.log(err)
            toast.push("Username already taken!", toastErrorTheme)
        })
}

export const canEdit = derived(
    currentUserData,
    (value) =>
        value != null &&
        typeof value != "string" &&
        value.data != null &&
        typeof value.data != "string"
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
        userDataListener = onValue(
            ref(database, `userData/${user.uid}`),
            (snapshot) => {
                userDataValue.data = snapshot.val()
                currentUserData.set(userDataValue)
            }
        )
    } else {
        console.log("signed out")
        if (userDataListener != null) {
            userDataListener()
        }
        currentUserData.set(null)
    }
})
