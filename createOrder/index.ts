import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as Sentry from "@sentry/node";
import { sentryInit } from "../src/config/sentry.config";
import { createOrder } from "../src/controller/Payment/createOrder";
import { CreateOrder } from "../src/types/ValidationInput";
import { verifyToken } from "../src/utils/verifyToken";
import { connect } from "../src/config/db.config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    sentryInit();
    connect();
    try {
        // Check for token in header
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
        const unsealedToken = await verifyToken(authToken, "student");
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
        const body: CreateOrder = req.body;
        const result = await createOrder(body);
        if (result.error) {
            context.res = {
                status: 400,
                body: {
                    message: result.message
                },
                headers: HEADERS
            };
            return;
        }
        context.res = {
            status: 200,
            body: {
                data: result.data
            },
            headers: HEADERS
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            HEADERS,
            body: {
                message: err
            },
            status: 500
        };
    }
};

export default httpTrigger;