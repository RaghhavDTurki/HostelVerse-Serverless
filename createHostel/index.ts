import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connect } from "../src/config/db.config";
import { createHostel } from "../src/controller/Admin/createHostel";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";
import { CreateHostelInput } from "../src/types/ValidationInput";
import { verifyToken } from "../src/utils/verifyToken";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    if (Object.keys(req.body).length === 0) {
        context.res = {
            Headers: HEADERS,
            status: 400,
            body: { message: "The body cannot be empty!" }
        };
        return;
    }

    sentryInit();
    connect();
    try {
        // Check for Token in Headers
        const authToken = req.headers.authorization;
        if (!authToken) {
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
        if (unsealedToken.error) {
            context.res = {
                status: 401,
                body: {
                    message: "Unauthorized!"
                },
                headers: HEADERS
            };
            return;
        }
        const body: CreateHostelInput = req.body;
        let result: boolean | any = true;
        result = await createHostel(body);
        if (result) {
            context.res = {
                Headers: HEADERS,
                status: 500,
                body: { message: result.message }
            };
        }
        else {
            context.res = {
                Headers: HEADERS,
                status: 200,
                body: { message: "Hostel created successfully!" }
            };
        }
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            Headers: HEADERS,
            status: 500,
            body: { message: "Something went wrong!" }
        };
    }
};

export default httpTrigger;