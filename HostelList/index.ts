import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connect } from "../src/config/db.config";
import { getHostelList } from "../src/controller/Hostel/getHostelList";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let result: any;
    const HEADERS = {'Content-Type': 'application/json'};
    connect();
    sentryInit();
    try{
        result = await getHostelList();
        result.statusCode = 200;

        context.res = {
            body: result,
            headers: HEADERS
        };
    }
    catch(err) {
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