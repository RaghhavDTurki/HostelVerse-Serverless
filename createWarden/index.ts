import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";
import { CreateWardenInput } from "../src/types/ValidationInput";
import { createWarden } from "../src/controller/Admin/createWarden";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = {'Content-Type': 'application/json'};
    connect();
    sentryInit();

    try{
        const body: CreateWardenInput = req.body;
        const result = await createWarden(body);
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
                    message: "Warden created successfully!",
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
                message: err.message
            }
        };
    }
};

export default httpTrigger;