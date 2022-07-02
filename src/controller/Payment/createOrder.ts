import { razorpayInstance } from "../../config/razorpay.config";
import * as Sentry from "@sentry/node";
import { CreateOrder } from "../../types/ValidationInput";
import { genUUID } from "../../utils/createOTP";
import { Payment } from "../../models/Payment.model";
import { Student } from "../../models/Student.model";

export const createOrder = async (body: CreateOrder) => {
    try {
        if (!body) {
            return {
                error: true,
                message: "No body provided"
            };
        }

        // Checks required
        // 1. If student with that studentid exists
        // 2. If the student has paid the amount already for this semester(for production) -> Doing this to decrease the number of entries in the newOrderbase created by the same student -> If still some created entries exist at the end of the month, then delete them using a CRON job
        // 3. If the student has created an order during this month -> If he/she has then fetch that 
        // entry from newOrderbse and pass on the orderid and receiptid in response
        // 4. Else create a new order and pass on the orderid and receiptid in response

        // Check 1
        const student = await Student.findOne({ studentid: body.studentid }).lean();
        if (!student) {
            return {
                error: true,
                message: "Student does not exist!"
            };
        }

        // Check 2
        const allOrders = await Payment.find({ studentid: body.studentid }).select("-_id -__v");
        // const pastPayments = allOrders.filter(order => order.status === "Paid");
        // if (pastPayments.length > 0) {
        //     const lastUpdated = new Date(pastPayments[pastPayments.length - 1].updatedAt);
        //     const currentDate = new Date();
        //     const month = currentDate.getMonth();
        //     const year = currentDate.getFullYear();
        //     const lastUpdatedMonth = lastUpdated.getMonth();
        //     const lastUpdatedYear = lastUpdated.getFullYear();
        //     if (month === lastUpdatedMonth && year === lastUpdatedYear) {
        //         return {
        //             error: true,
        //             message: "You have already paid for this semester!"
        //         };
        //     }
        // }

        // Check 3
        const ordersCreated = allOrders.filter(order => order.status === "created");
        if (ordersCreated.length > 0) {
            const lastUpdated = new Date(ordersCreated[ordersCreated.length - 1].updatedAt);
            const currentDate = new Date();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            const lastUpdatedMonth = lastUpdated.getMonth();
            const lastUpdatedYear = lastUpdated.getFullYear();
            if (month === lastUpdatedMonth && year === lastUpdatedYear) {
                const order = ordersCreated[ordersCreated.length - 1];
                return {
                    error: false,
                    message: "Order created successfully!",
                    data: {
                        orderid: order.orderid,
                        receiptid: order.receiptid
                    }
                };
            }
        }

        const newOrder = await razorpayInstance.orders.create({
            amount: parseInt(body.amount),
            currency: "INR",
            receipt: "rcpt" + genUUID(),
            notes: {
                studentid: body.studentid,
                hostelid: body.hostelid
            }
        });

        const payment = new Payment({
            orderid: newOrder.id,
            receiptid: newOrder.receipt,
            amount: newOrder.amount,
            studentid: body.studentid,
            hostelid: body.hostelid,
            email: body.email,
            status: newOrder.status
        });
        await payment.save();

        return {
            error: false,
            data: {
                orderid: newOrder.id,
                receiptid: newOrder.receipt
            }
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