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
    BOOMLINGS_ERROR: "Failed to post to boomlings.com",

    FAILED_USER: "Failed to get User ID",
    FAILED_MESSAGE: "Failed to message user",

    CODE_EXPIRED: "Verification code expired",
    INVALID_CODE: "Verification code is invalid",
}

interface Result<T, E> {
    data: T | null
    err: E | null
    isErr: boolean,
}

const Ok = <T>(data: T): Result<T, any> => {
    return { data, err: "", isErr: false }
}

const Err = <E>(err: E): Result<any, E> => {
    return { data: null, err, isErr: true }
}

class Code {
    code: number
    expirary: Date

    // expires after 5 minutes
    static readonly EXP = 300;

    private static getNewUnusedCode = (): number => {
        return crypto.randomInt(0, 999999);
    }

    hasExpired(): boolean {
        return Date.now() > this.expirary.getTime()
    }

    is(code: number): boolean {
        return this.code === code;
    }

    constructor() {
        this.code = Code.getNewUnusedCode()
        this.expirary = new Date(Date.now() + Code.EXP);
    }
}

class User {
    public uid: number
    public code: Code

    constructor(uid: number) {
        this.uid = uid;
        this.code = new Code();
    }
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
const getAccountId = (username: string): Promise<Result<number, string>> => {
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
                            res(Ok(parseInt(matched?.groups["uid"])))
                        } else {
                            rej(Err(ERRORS.FAILED_USER))
                        }
                    })
                    .catch((err) => {
                        functions.logger.error(err)

                        rej(Err(ERRORS.FAILED_USER))
                    })
            })
            .catch((err) => {
                functions.logger.error(err)

                rej(Err(ERRORS.BOOMLINGS_ERROR))
            })
    })
}

const currentUsers: Map<number, User> = new Map()

const sendMessageImpl = (uid: number): Promise<Result<null, string>> => {
    functions.logger.info(`Sending verification code to user: \`${uid}\`.`)
    let user = new User(uid);
    currentUsers.set(uid, user);

    return new Promise((res, rej) => {
        fetch(`${DATABASE}/uploadGJMessage20.php`, {
            method: "POST",
            body: fData({
                accountId: process.env.GD_ACC_ID,
                gjp: gjEncrypt(process.env.GD_ACC_PWD || "", ACC_PWD_XOR_KEY),
                toAccountId: uid,
                subject: urlSafeB64("GD Place Account Verification"),
                body: urlSafeB64(
                    `Enter this 6 digit code on GD Place to verify your account:\n ${user.code}\n Do not share this code with anyone.`
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
                        res(Ok(null))
                    }

                    functions.logger.error(`Failed to message user: \`${uid}\``)

                    rej(Err(ERRORS.FAILED_MESSAGE))
                })
            })
            .catch((err) => {
                functions.logger.error(err)

                rej(Err(ERRORS.BOOMLINGS_ERROR))
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

const verifyCodeImpl = (uid: number, code: number): Result<null, string> => {
    let user = currentUsers.get(uid);

    if (!user) {
        return Err(ERRORS.FAILED_USER);
    }

    if (user.code.hasExpired()) {
        return Err(ERRORS.CODE_EXPIRED);
    }

    if (!user.code.is(code)) {
        return Err(ERRORS.INVALID_CODE);
    }

    currentUsers.delete(uid);

    return Ok(null)
}

export const verifyCode = functions.https.onCall(async (data, request) => {
    return verifyCodeImpl(data.uid, data.code)
})