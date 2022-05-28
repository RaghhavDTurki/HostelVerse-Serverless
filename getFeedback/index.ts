import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as Sentry from "@sentry/node";
import { connect } from "../src/config/db.config";
import { verifyToken } from "../src/utils/verifyToken";
import { sentryInit } from "../src/config/sentry.config";
import { viewFeedback } from "../src/controller/Admin/viewFeedback";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    connect();
    sentryInit();
    try{
        // Check for Token in Headers
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
        const unsealedToken = await verifyToken(authToken, "admin");
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
        const feedbackid = req.query.feedbackid;
        const result = await viewFeedback(feedbackid);
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
            context.res = {
                status: 200,
                body: {
                    data: result.data
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
                error: true,
                message: err
            }
        }
    }
};

export default httpTrigger;