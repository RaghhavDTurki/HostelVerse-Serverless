import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as Sentry from "@sentry/node";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import { verifyToken } from "../src/utils/verifyToken";
import { getRoomIssues } from "../src/controller/Warden/roomIssue";

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
        const roomIssueId = req.query.roomIssueId;
        const result = await getRoomIssues(wardenid, roomIssueId);
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
                body: result.data,
                headers: HEADERS
            };
            return;
        }
    }
    catch(err){
        Sentry.captureException(err);
        Sentry.flush(2000);
        context.res = {
            status: 400,
            body: {
                message: err
            },
            headers: HEADERS
        };
        return;
    }
};

export default httpTrigger;