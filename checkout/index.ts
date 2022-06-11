import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import { checkOut } from "../src/controller/Student/CheckIn_CheckOut";
import { CheckOutInput } from "../src/types/ValidationInput";
import { verifyToken } from "../src/utils/verifyToken";
import * as Sentry from "@sentry/node";

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
        const body: CheckOutInput = req.body;
        const result = await checkOut(body);
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
                    message: "Checked out successfully!"
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