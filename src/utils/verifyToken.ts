import iron from "@hapi/iron";
import * as Sentry from "@sentry/node";

const secretToken = process.env.SECRET_TOKEN;

export const verifyToken = async (token: string, role1?: string, role2?: string, role3?: string) => {
    try {
        const bearer = token.split(" ");
        if (bearer.length !== 2) {
            return {
                error: true,
                message: "Invalid token!"
            };
        }

        const unsealed = await iron.unseal(bearer[1], secretToken, iron.defaults);
        role1 = role1 ? role1 : "";
        role2 = role2 ? role2 : "";
        role3 = role3 ? role3 : "";
        if (unsealed.role != role1 && unsealed.role != role2 && unsealed.role != role3) {
            return {
                error: true,
                message: "Unauthorised Access!"
            };
        }
        return {
            error: false,
            message: unsealed
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: JSON.stringify({
                error: err.message
            })
        };
    }
};