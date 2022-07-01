import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { sentryInit } from "../src/config/sentry.config";
import { connect } from "../src/config/db.config";
import * as Sentry from "@sentry/node";
import { verifyToken } from "../src/utils/verifyToken";
import { verifyPayment } from "../src/controller/Payment/verifyPayment";
import { VerifyPaymentInput } from "../src/types/ValidationInput";

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
        const body: VerifyPaymentInput = req.body;
        const result = await verifyPayment(body);
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
                message: "Payment verified successfully!"
            },
            headers: HEADERS
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            status: 400,
            body: {
                message: err
            },
            headers: HEADERS
        };
    }
};

export default httpTrigger;