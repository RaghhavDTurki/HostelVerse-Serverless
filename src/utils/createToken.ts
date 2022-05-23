import iron from '@hapi/iron';
import * as Sentry from '@sentry/node';
import { CreateIronToken } from '../types/ValidationInput';
const secretToken = process.env.SECRET_TOKEN;

export const createToken = async (payload: CreateIronToken) => {
    try{
        const sealed = await iron.seal(payload, secretToken, iron.defaults);
        return {
            error: false,
            message: sealed
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