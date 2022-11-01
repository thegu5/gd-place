import fetch from "node-fetch"
import FormData from "form-data";

const BOOMLINGS = "https://www.boomlings.com/";
const DATABASE = `${BOOMLINGS}/database`;

const GDSECRET = "Wmfd2893gb7";

const ERRORS = {
    NO_USER: "No user found with username",
    FAILED_USER: "Failed to get User ID",
};


const fData = (data: { [key: string]: any }): FormData => {
    let fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
        fd.append(k, v);
    });
    return fd;
}


const ACCOUNT_ID = new RegExp(/:2:(?<uid>\d+)/);
const getAccountId = (username: string): Promise<number> => {
    console.info(`User \`${username}\` requested user id.`);

    return new Promise((res, rej) => {
        fetch(`${DATABASE}/getGJUsers20.php`, {
            method: "POST",
            body: fData({
                secret: GDSECRET,
                str: username,
            }),
            headers: {
                "User-Agent": ""
            }
        })
            .then(resp => {
                resp.text()
                    .then(user => {
                        let matched = user.match(ACCOUNT_ID);

                        if (matched?.groups) {
                            res(parseInt(matched?.groups["uid"]));
                        } else {
                            rej(ERRORS.FAILED_USER);
                        }
                    })
                    .catch(err => {
                        console.error(err);

                        rej(ERRORS.FAILED_USER);
                    });
            })
            .catch(err => {
                console.error(err);

                rej(ERRORS.NO_USER);
            });
    });
};

export { getAccountId };
