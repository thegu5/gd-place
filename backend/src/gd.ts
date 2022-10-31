import fetch from "node-fetch";

const BOOMLINGS = "https://www.boomlings.com/";
const DATABASE = `${BOOMLINGS}/database`;

const GDSECRET = "Wmfd2893gb7";

const ERRORS = {
    NO_USER: "No user found with username",
    FAILED_USER: "Failed to get User ID",
};

type Result<T> = T | typeof ERRORS;

const ACCOUNT_ID = new RegExp(":2:(d+)");
const getAccountId = (username: string): Promise<Result<Number>> => {
    return new Promise((res, rej) => {
        fetch(`${DATABASE}/getGJUsers20.php`, {
            method: "POST",
            body: JSON.stringify({
                secret: GDSECRET,
                str: username,
            }),
        })
            .then(resp => {
                resp.text()
                    .then(user => {
                        console.log(user);
                        let matched = user.match(ACCOUNT_ID);

                        if (matched && matched.length == 1) {
                            res(parseInt(matched[0]));
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
