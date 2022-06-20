import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as Sentry from "@sentry/node";
import { DeleteWardenInput } from "../src/types/ValidationInput";
import { deleteWarden } from "../src/controller/Admin/deleteWarden";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
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
                    message: "Unauthorised!"
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
        const body: DeleteWardenInput = req.body;
        const result = await deleteWarden(body);
        if (result.error) {
            context.res = {
                status: 400,
                body: {
                    message: result.message
                },
                headers: HEADERS
            };
        }
        else {
            context.res = {
                status: 200,
                body: {
                    message: "Warden deleted successfully!"
                },
                headers: HEADERS
            };
        }
    }
    catch (err) {
        Sentry.captureException(err);
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