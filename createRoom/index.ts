import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as Sentry from "@sentry/node";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import { CreateRoomInput } from "../src/types/ValidationInput";
import { addRoom } from "../src/controller/Admin/addRoom";
import { verifyToken } from "../src/utils/verifyToken";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = {"Content-Type": "application/json"};
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
        const body: CreateRoomInput = req.body;
        const result = await addRoom(body);
        if(result){
            context.res = {
                status: 400,
                body: {
                    message: result.message
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
            }
        };
    }

};

export default httpTrigger;