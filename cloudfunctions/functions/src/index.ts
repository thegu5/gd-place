import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
//import { DataSnapshot } from "@firebase/database-types"

export * from "./gd"

// import { CHUNK_SIZE } from "../../../src/firebase/database"

// import { GDObject } from "../../../src/editor/object"

const CHUNK_SIZE = { x: 20 * 30, y: 20 * 30 }

admin.initializeApp()

export const placeObject = functions.https.onCall(async (data, request) => {
    // check that user is authenticated
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "User is not authenticated"
        )
    }

    const db = admin.database()

    // get user last timestamp /userData/$uid/lastPlaced
    const uid = request.auth.uid
    const lastPlacedRef = db.ref(`/userData/${uid}/lastPlaced`)
    const lastPlaced = (await lastPlacedRef.once("value")).val()
    const now = Date.now()
    if (lastPlaced && now - lastPlaced < 295000) {
        throw new functions.https.HttpsError(
            "resource-exhausted",
            "Object placed before cooldown"
        )
    }

    functions.logger.log(`placeObject ${data}`)

    const object = data.text

    let props = object.toString().split(";")

    let chunkX = Math.floor(parseFloat(props[1]) / CHUNK_SIZE.x)
    let chunkY = Math.floor(parseFloat(props[2]) / CHUNK_SIZE.y)

    const ref = db.ref(`/chunks/${chunkX},${chunkY}/`)
    let key = await ref.push(object)

    // reset timer
    if (
        uid != "fSAr1IIsQ6Ndjcn1wzLUanlqbxJ3" &&
        uid != "R2C8U5ct2rZNif2iaa2CFwhIptA3" &&
        uid != "bihWD9f3LpWj9Nkf4plcsCEDymZ2"
    )
        // :mabbog:
        await lastPlacedRef.set(now)

    db.ref(`/userData/${uid}/username`)
        .get()
        .then((username) => {
            db.ref(`/userPlaced/${key.key}`).set(username.val())
        })
})

export const deleteObject = functions.https.onCall(async (data, request) => {
    // check that user is authenticated
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "User is not authenticated"
        )
    }

    const db = admin.database()

    // get user last timestamp /userData/$uid/lastDeleted
    const uid = request.auth.uid
    const lastDeletedRef = db.ref(`/userData/${uid}/lastDeleted`)
    const lastDeleted = (await lastDeletedRef.once("value")).val()
    const now = Date.now()
    if (lastDeleted && now - lastDeleted < 295000) {
        throw new functions.https.HttpsError(
            "resource-exhausted",
            "Object deleted before cooldown"
        )
    }

    functions.logger.log(`deleteobject ${data.chunkId} ${data.objId}`)

    const ref = db.ref(`/chunks/${data.chunkId}/${data.objId}`)
    ref.remove()

    // reset timer
    if (
        uid != "fSAr1IIsQ6Ndjcn1wzLUanlqbxJ3" &&
        uid != "R2C8U5ct2rZNif2iaa2CFwhIptA3" &&
        uid != "bihWD9f3LpWj9Nkf4plcsCEDymZ2"
    )
        // :mabbog:
        await lastDeletedRef.set(now)

    db.ref(`/userPlaced/${data.objId}`).remove()
})

export const initUserWithUsername = functions.https.onCall(
    async (data, request) => {
        if (!request.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "User is not authenticated"
            )
        }

        if (!data.username.match(/^[A-Za-z0-9_-]{3,16}$/)) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "Username is invalid"
            )
        }

        const db = admin.database()

        // check if /userName/$username exists

        const usernameRef = db.ref(`/userName/${data.username.toLowerCase()}`)
        const username = (await usernameRef.once("value")).val()
        functions.logger.log(`user ${username}`)
        if (username != null) {
            throw new functions.https.HttpsError(
                "already-exists",
                "Username already exists"
            )
        }

        // make new user
        db.ref(`/userData/${data.uid}`).set({
            username: data.username.toLowerCase(),
            lastPlaced: 0,
            lastDeleted: 0,
        })

        db.ref(`/userName/${data.username.toLowerCase()}`).set({
            uid: data.uid,
        })
    }
)
