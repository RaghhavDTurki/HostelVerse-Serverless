import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";
import { LoginInput } from "../src/types/ValidationInput";
import { Login } from "../src/controller/Login/Login";
import { createToken } from "../src/utils/createToken";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = {'Content-Type': 'application/json'};
    connect();
    sentryInit();

    try{
        const body: LoginInput = req.body;
        const result = await Login(body);
        if(result.error){
            context.res = {
                status: 400,
                body: {
                    message: result.message
                },
                headers: HEADERS
            };
        }
        else{
            const token = await createToken({
                id: body.email,
                role: body.role
            });
            context.res = {
                status: 200,
                body: {
                    message: result.message,
                    profile: result.profile,
                    token: token.message
                },
                headers: HEADERS
            };
        }
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            status: 500,
            body: {
                message: err.message
            },
            headers: HEADERS
        };
    }

};

export default httpTrigger;