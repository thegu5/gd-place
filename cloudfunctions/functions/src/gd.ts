import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

import fetch from "node-fetch"
import * as crypto from "crypto"
import { cycle, zip } from "iter-tools"

const BOOMLINGS = "https://www.boomlings.com/"
const DATABASE = `${BOOMLINGS}/database`

const GDSECRET = "Wmfd2893gb7"
const ACC_PWD_XOR_KEY = "37526"
const MESSAGE_XOR_KEY = "14251"

const ERRORS = {
    BOOMLINGS_ERROR: "Failed to post to boomlings.com",

    FAILED_USER: "Failed to get User ID",
    FAILED_MESSAGE: "Failed to message user",

    CODE_EXPIRED: "Verification code expired",
    INVALID_CODE: "Verification code is invalid",
}

class Code {
    public code: number
    expirary: Date

    // expires after 5 minutes
    static readonly EXP = 300

    private static getNewUnusedCode = (): number => {
        return crypto.randomInt(100000, 999999)
    }

    hasExpired(): boolean {
        return Date.now() > this.expirary.getTime()
    }

    is(code: number): boolean {
        return this.code === code
    }

    expires(): number {
        return this.expirary.getMilliseconds()
    }

    constructor() {
        this.code = Code.getNewUnusedCode()
        this.expirary = new Date(Date.now() + Code.EXP)
    }
}

class User {
    public uid: number
    public code: Code

    constructor(uid: number) {
        this.uid = uid
        this.code = new Code()
    }
}

const b64 = (data: any): string => {
    return Buffer.from(data).toString("base64")
}

const xor = (data: string, key: string): string => {
    let out = ""

    for (let [x, y] of zip(data, cycle(key))) {
        out += String.fromCharCode(x.charCodeAt(0) ^ y.charCodeAt(0))
    }

    return out
}

const ACCOUNT_ID = new RegExp(/:16:(?<uid>\d+)/)
const getAccountId = (username: string): Promise<number> => {
    functions.logger.info(`User \`${username}\` requested user id.`)

    return new Promise((res) => {
        fetch(`${DATABASE}/getGJUsers20.php`, {
            method: "POST",
            body: new URLSearchParams({
                secret: GDSECRET,
                str: username,
            }),
            headers: {
                "User-Agent": "",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((resp) => {
                resp.text()
                    .then((user) => {
                        let matched = user.match(ACCOUNT_ID)

                        if (matched?.groups) {
                            res(parseInt(matched?.groups["uid"]))
                        } else {
                            throw new functions.https.HttpsError(
                                "unknown",
                                "User ID regex failed - this is a bug"
                            )
                        }
                    })
                    .catch((err) => {
                        functions.logger.error(err)

                        throw new functions.https.HttpsError(
                            "not-found",
                            ERRORS.FAILED_USER
                        )
                    })
            })
            .catch((err) => {
                functions.logger.error(err)

                throw new functions.https.HttpsError(
                    "unavailable",
                    ERRORS.BOOMLINGS_ERROR
                )
            })
    })
}

const sendMessageImpl = (user: User): Promise<void> => {
    functions.logger.info(`Sending verification code to user: \`${user.uid}\`.`)

    return new Promise(() => {
        fetch(`${DATABASE}/uploadGJMessage20.php`, {
            method: "POST",
            body: new URLSearchParams({
                accountID: "22426057",
                gjp: b64(xor(process.env.GD_ACC_PWD || "", ACC_PWD_XOR_KEY)),
                toAccountID: user.uid.toString(),
                subject: b64("Verify Account"),
                body: b64(
                    xor(
                        `Enter this 6 digit code on GD Place to verify your account:\n${user.code.code}\nDo not share this code with anyone.`,
                        MESSAGE_XOR_KEY
                    )
                ),
                secret: GDSECRET,
            }),
            headers: {
                "User-Agent": "",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then((resp) => {
                resp.text().then((ok) => {
                    if (ok === "-1") {
                        functions.logger.error(
                            `Failed to message user: \`${user.uid}\``
                        )

                        throw new functions.https.HttpsError(
                            "not-found",
                            ERRORS.FAILED_MESSAGE
                        )
                    }
                })
            })
            .catch((err) => {
                functions.logger.error(err)

                throw new functions.https.HttpsError(
                    "unavailable",
                    ERRORS.BOOMLINGS_ERROR
                )
            })
    })
}

export const sendMessage = functions.https.onCall(async (data, request) => {
    if (request.auth) {
        throw new functions.https.HttpsError(
            "already-exists",
            "User is already authenticated"
        )
    }

    const db = admin.database()

    let id: number = await getAccountId(data.username)

    let user = new User(id)

    db.ref(`/loginCodes/${user.uid}`).set({
        code: user.code.code,
        expires: user.code.expires(),
    })

    return await sendMessageImpl(user)
})

export const verifyCode = functions.https.onCall(async (data, request) => {
    if (request.auth) {
        throw new functions.https.HttpsError(
            "already-exists",
            "User is already authenticated"
        )
    }

    const db = admin.database()

    let user_ref = db.ref(`/loginCodes/${data.uid}`)
    let user = await (await user_ref.get()).val()

    if (!user) {
        throw new functions.https.HttpsError("not-found", ERRORS.FAILED_USER)
    }

    if (Date.now() > user.code) {
        throw new functions.https.HttpsError(
            "deadline-exceeded",
            ERRORS.CODE_EXPIRED
        )
    }

    if (user.code != data.code) {
        throw new functions.https.HttpsError(
            "permission-denied",
            ERRORS.INVALID_CODE
        )
    }

    user_ref.remove()
})
