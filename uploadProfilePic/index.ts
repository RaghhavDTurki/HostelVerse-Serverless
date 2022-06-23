import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as Sentry from "@sentry/node";
import { sentryInit } from "../src/config/sentry.config";
import { connect } from "../src/config/db.config";
import { verifyToken } from "../src/utils/verifyToken";
import * as multipart from "parse-multipart";
import { updateProfilePic } from "../src/controller/updateProfilePic/updateProfilePic";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
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
        const unsealedToken = await verifyToken(authToken, "student", "admin", "warden");
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
        if (!req.headers["content-type"] && !req.headers["content-type"].includes("multipart/form-data")) {
            context.log(req.headers["content-type"]);
            context.res = {
                status: 400,
                body: {
                    message: "Content type must be multipart/form-data"
                },
                headers: HEADERS
            };
            return;
        }
        if (!req.query?.filename || !req.query?.id) {
            context.res = {
                status: 400,
                body: {
                    message: "filename and id is required!"
                },
                headers: HEADERS
            };
            return;
        }
        if (!req.body || !req.body.length) {
            context.res = {
                status: 400,
                body: {
                    message: "File should be present in the request body"
                },
                headers: HEADERS
            };
            return;
        }
        // Each chunk of the file is delimited by a special string
        const bodyBuffer = Buffer.from(req.body);
        const boundary = multipart.getBoundary(req.headers["content-type"]);
        const parts = multipart.Parse(bodyBuffer, boundary);
        // The file buffer is corrupted or incomplete ?
        if (!parts?.length) {
            context.res = {
                status: 400,
                body: {
                    message: "File buffer is incorrect"
                },
                headers: HEADERS
            };
            return;
        }
        // Passed to Storage
        context.bindings.storage = parts[0]?.data;
        const url = `${process.env.StorageUrl}/profilepics/${req.query.filename}`;
        const result = await updateProfilePic(unsealedToken.message.role, req.query.id, url);
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
        else {
            context.res = {
                status: 200,
                body: {
                    message: result.message,
                    data: result.data
                },
                headers: HEADERS
            };
            return;
        }
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            error: true,
            message: JSON.stringify({
                error: err.message
            })
        };
    }
};

export default httpTrigger;