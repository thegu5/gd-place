import * as functions from "firebase-functions"
//import * as admin from "firebase-admin"

import fetch from "node-fetch"
import FormData from "form-data"
import * as crypto from "crypto"
import { cycle, zip } from "iter-tools"

const BOOMLINGS = "https://www.boomlings.com/"
const DATABASE = `${BOOMLINGS}/database`

const GDSECRET = "Wmfd2893gb7"
const ACC_PWD_XOR_KEY = "37526"

const ERRORS = {
    FAILED_USER: "Failed to get User ID",
    FAILED_MESSAGE: "Failed to message user",
}

interface Result<T, E = null> {
    data: T | null
    err: E | null
}

const result = <T, E>(data: T | null = null, err: E | null = null): Result<T, E> => {
    return { data, err }
}

let currentCodes: Map<number, number> = new Map()
const getNewUnusedCode = (): number => {
    return crypto.randomInt(0, 999999)

    // if (currentCodes.indexOf(n) !== -1) {
    //     return getNewUnusedCode();
    // }

    // return n;
}

const urlSafeB64 = (data: any): string => {
    return Buffer.from(data).toString("base64url")
}

const xor = (data: string, key: string): string => {
    let out = ""

    for (let [x, y] of zip(data, cycle(key))) {
        out += String.fromCharCode(x.charCodeAt(0) ^ y.charCodeAt(0))
    }

    return out
}

const gjEncrypt = (pwd: string, key: string): string => {
    return urlSafeB64(xor(pwd, key))
}

const fData = (data: { [key: string]: any }): FormData => {
    let fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
        fd.append(k, v)
    })
    return fd
}

const ACCOUNT_ID = new RegExp(/:2:(?<uid>\d+)/)
const getAccountId = (username: string): Promise<Result<number>> => {
    functions.logger.info(`User \`${username}\` requested user id.`)

    return new Promise((res, rej) => {
        fetch(`${DATABASE}/getGJUsers20.php`, {
            method: "POST",
            body: fData({
                secret: GDSECRET,
                str: username,
            }),
            headers: {
                "User-Agent": "",
            },
        })
            .then((resp) => {
                resp.text()
                    .then((user) => {
                        let matched = user.match(ACCOUNT_ID)

                        if (matched?.groups) {
                            res(result(parseInt(matched?.groups["uid"])))
                        } else {
                            rej(result(ERRORS.FAILED_USER))
                        }
                    })
                    .catch((err) => {
                        functions.logger.error(err)

                        rej(result(ERRORS.FAILED_USER))
                    })
            })
            .catch((err) => {
                functions.logger.error(err)

                rej(result(ERRORS.FAILED_USER))
            })
    })
}

const sendMessageImpl = (uid: number): Promise<Result<null>> => {
    functions.logger.info(`Sending verification code to user: \`${uid}\`.`)

    let code = getNewUnusedCode()

    // TODO: expiration date etc
    currentCodes.set(uid, code)

    return new Promise((res, rej) => {
        fetch(`${DATABASE}/uploadGJMessage20.php`, {
            method: "POST",
            body: fData({
                accountId: process.env.GD_ACC_ID,
                gjp: gjEncrypt(process.env.GD_PWD || "", ACC_PWD_XOR_KEY),
                toAccountId: uid,
                subject: urlSafeB64("GD Place Account Verification"),
                body: urlSafeB64(
                    `Enter this 6 digit code on GD Place to verify your account:\n ${code}\n Do not share this code with anyone.`
                ),
                secret: GDSECRET,
            }),
            headers: {
                "User-Agent": "",
            },
        })
            .then((resp) => {
                resp.text().then((ok) => {
                    if (ok !== "-1") {
                        res(result(null))
                    }

                    functions.logger.error(`Failed to message user: \`${uid}\``)

                    rej(result(ERRORS.FAILED_MESSAGE))
                })
            })
            .catch((err) => {
                functions.logger.error(err)

                rej(result(ERRORS.FAILED_MESSAGE))
            })
    })
}

export const sendMessage = functions.https.onCall(async (data, request) => {
    let id = await getAccountId(data.username)

    if (id.err) {
        return id.err
    }

    return await sendMessageImpl(id.data || 0)
})
