import { razorpayInstance } from "../../config/razorpay.config";
import * as Sentry from "@sentry/node";
import { CreateOrder } from "../../types/ValidationInput";
import { genUUID } from "../../utils/createOTP";
import { createCustomer } from "./createCustomer";
import { Payment } from "../../models/Payment.model";

export const createOrder = async (body: CreateOrder) => {
    try {
        if (!body) {
            return {
                error: true,
                message: "No body provided"
            }
        }
        const customer = await createCustomer({
            name: body.name,
            email: body.email,
            contactno: body.contactno,
            studentid: body.studentid
        });
        if (customer.error) {
            return {
                error: true,
                message: customer.message
            }
        }

        const data = await razorpayInstance.orders.create({
            amount: parseInt(body.amount),
            currency: "INR",
            receipt: "rcpt" + genUUID(),
            notes: {
                studentid: body.studentid,
                hostelid: body.hostelid,
            }
        });

        const payment = new Payment({
            orderid: data.id,
            receiptid: data.receipt,
            amount: data.amount,
            studentid: body.studentid,
            hostelid: body.hostelid,
            email: body.email,
            status: data.status
        });
        await payment.save();

        return {
            error: false,
            data: {
                orderid: data.id,
                receiptid: data.receipt
            }
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        }
    }
}