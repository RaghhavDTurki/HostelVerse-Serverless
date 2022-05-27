import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";
import { GetStudents } from "../src/types/ValidationInput";
import { verifyToken } from "../src/utils/verifyToken";
import { getStudents } from "../src/controller/Warden/studentList";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = {'Content-Type': 'application/json'};
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
        if(unsealedToken.message.id != req.query["wardenid"]){
            context.res = {
                status: 401,
                body: {
                    message: "Unauthorized!"
                },
                headers: HEADERS
            };
            return;
        }
        if(!req.query["wardenid"]){
            context.res = {
                status: 400,
                body: {
                    message: "No warden id provided!"
                },
                headers: HEADERS
            };
            return;
        }
        const result = await getStudents(req.query["studentid"], unsealedToken.message.id);
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
                    message: "Students fetched successfully!",
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
            body: {message: err},
            headers: HEADERS
        };
    }

};

export default httpTrigger;