import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { connect } from "../src/config/db.config";
import { createHostel } from "../src/controller/Hostel/createHostel";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";
import { HostelInput } from "../src/types/ValidationInput"; 

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = {'Content-Type': 'application/json'};
    if(Object.keys(req.body).length === 0)
    {
        context.res = {
            Headers: HEADERS,
            status: 400,
            body: {message: "The body cannot be empty!"}
        };
        return;
    }

    sentryInit();
    connect();
    try{
        const body: HostelInput = req.body;
        let result: boolean | any;
        result = await createHostel(body);
        if(result){
            context.res = {
                Headers: HEADERS,
                status: 500,
                body: { message: result.message }
            };
        }
        else{
            context.res = {
                Headers: HEADERS,
                status: 200,
                body: {message: "Hostel created successfully!"}
            };
        }
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            Headers: HEADERS,
            status: 500,
            body: {message: "Something went wrong!"}
        };
    }
};

export default httpTrigger;