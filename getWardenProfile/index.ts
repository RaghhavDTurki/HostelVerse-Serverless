import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as Sentry from "@sentry/node"
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import { getWardenProfile } from "../src/controller/Warden/wardenProfile";
import { verifyToken } from "../src/utils/verifyToken";

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
        const unsealedToken = await verifyToken(authToken, "warden");
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
        const wardenid = req.query.wardenid;
        if(wardenid != unsealedToken.message.id){
            context.res = {
                status: 401,
                body: {
                    message: "Unauthorized!"
                },
                headers: HEADERS
            };
            return;
        }
        const result = await getWardenProfile(wardenid);
        if(result.error){
            context.res = {
                status: 400,
                body: {
                    message: result.message
                },
                headers: HEADERS
            };
            return;
        }
        else{
            context.res = {
                status: 200,
                body: {
                    message: result.data
                },
                headers: HEADERS
            };
            return;
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