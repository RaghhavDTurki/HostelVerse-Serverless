import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from  "@sentry/node";
import { connect } from "../src/config/db.config";
import { verifyEmail } from "../src/controller/Student/verifyEmail";
import { VerifyEmailInput } from "../src/types/ValidationInput";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = {"Content-Type": "application/json"};
    sentryInit();
    connect();

    try{
        const body: VerifyEmailInput = req.body;
        const result = await verifyEmail(body);
        if(result){
            context.res = {
                Headers: HEADERS,
                status: 500,
                body: {
                    message: result.message
                }
            };
        }
        else{
            context.res = {
                Headers: HEADERS,
                status: 200,
                body: {
                    message: "Student verified successfully! Your account is now activated."
                }
            };
        }
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            status: 500,
            body: {
                message: err
            },
            headers: HEADERS
        };
    }
};

export default httpTrigger;