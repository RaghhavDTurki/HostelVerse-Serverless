import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as Sentry from "@sentry/node";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import { verifyToken } from "../src/utils/verifyToken";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    connect();
    sentryInit();
    try{
        
    }
    catch(err){
        Sentry.captureException(err);
        context.res = {
            status: 500,
            body: {
                message: err
            },
            headers: HEADERS
        };
        return;
    }
};

export default httpTrigger;