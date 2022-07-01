import { razorpayInstance } from "../../config/razorpay.config";
import * as Sentry from "@sentry/node";
import { CreateCustomer } from "../../types/ValidationInput";

export const createCustomer = async (body: CreateCustomer) => {
    try {
        const data = await razorpayInstance.customers.create({
            name: body.name,
            email: body.email,
            contact: body.contactno,
            notes: {
                studentid: body.studentid
            }
        });
        return {
            error: false,
            message: "Customer created successfully",
            data: data.id
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }
};