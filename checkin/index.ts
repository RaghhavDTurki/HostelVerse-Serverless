import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as Sentry from "@sentry/node";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import { checkIn } from "../src/controller/Student/CheckIn_CheckOut";
import { CheckInInput } from "../src/types/ValidationInput";
import { verifyToken } from "../src/utils/verifyToken";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    connect();
    sentryInit();
    try{
        // Check for token
        const authToken = req.headers.authorization;
        if(!authToken){
            context.res = {
                status: 401,
                body: {
                    message: "No authorization token provided!"
                },
                headers: HEADERS
            };
            return;
        }
        const unsealedToken = await verifyToken(authToken, "student");
        if(unsealedToken.error){
            context.res = {
                status: 401,
                body: {
                    message: "Unauthorized!"
                },
                headers: HEADERS
            };
            return;
        }
        const body: CheckInInput = req.body;
        const result = await checkIn(body);
        if(result.error){
            context.res = {
                status: 400,
                body: result
            };
            return;
        }
        else{
            context.res = {
                status: 200,
                body: {
                    message: "Checked in successfully!"
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
                error: true,
                message: "Something went wrong!"
            }
        };
    }

};

export default httpTrigger;