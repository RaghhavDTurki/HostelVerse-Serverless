import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";
import { AdminSignupInput } from "../src/types/ValidationInput";
import { adminSignup } from "../src/controller/Admin/adminSignup";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = {"Content-Type": "application/json"};
    connect();
    sentryInit();
    try{    
        const body: AdminSignupInput = req.body;
        const result = await adminSignup(body);
        if(result){
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
                    message: "Admin created successfully!",
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