import iron from '@hapi/iron';
import * as Sentry from '@sentry/node';

const secretToken = process.env.SECRET_TOKEN;

export const verifyToken = async (token: string) => {
    try{
        const bearer = token.split(" ");
        if(bearer.length !== 2){
            return {
                error: true,
                message: "Invalid token!"
            }
        }

        const unsealed = await iron.unseal(bearer[1], secretToken, iron.defaults);
        return {
            error: false,
            message: unsealed
        }
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        }
    }
}