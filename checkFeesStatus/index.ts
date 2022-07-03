import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as Sentry from "@sentry/node"
import { sentryInit } from "../src/config/sentry.config";
import { connect } from "../src/config/db.config";
import { checkFeesStatus } from "../src/controller/Payment/checkFeesStatus";
import { verifyToken } from "../src/utils/verifyToken";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    connect();
    sentryInit();
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
        const unsealedToken = await verifyToken(authToken, "admin", "student");
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
        const body: string = req.body;
        const result = await checkFeesStatus(body);
        if (result.error) {
            context.res = {
                status: 400,
                body: {
                    message: result.message,
                    paid: result.paid
                },
                headers: HEADERS
            };
        }
        else {
            context.res = {
                status: 200,
                body: {
                    message: result.message,
                    paid: result.paid
                },
                headers: HEADERS
            };
        }
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            status: 400,
            body: {
                message: err.message
            },
            headers: HEADERS
        };
    }
};

export default httpTrigger;