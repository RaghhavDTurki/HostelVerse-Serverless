import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import { verifyToken } from "../src/utils/verifyToken";
import { createAnnouncement } from "../src/controller/Warden/Announcements";
import { CreateAnnouncementInput } from "../src/types/ValidationInput";
import * as Sentry from "@sentry/node";

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
        const body: CreateAnnouncementInput = req.body;
        const result = await createAnnouncement(body);
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
                    message: "Announcement created successfully!"
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
                message: err
            },
            headers: HEADERS
        };
    }


};

export default httpTrigger;