import mongoose from "mongoose";

export type PaymentDocument = mongoose.Document & {
    orderid: string;
    receiptid: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    studentid: string;
    hostelid: string;
    email: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
};

const PaymentSchema = new mongoose.Schema<PaymentDocument>(
    {
        orderid: { type: String, required: true },
        receiptid: { type: String, required: true },
        razorpay_payment_id: { type: String, default: null },
        razorpay_order_id: { type: String, default: null },
        razorpay_signature: { type: String, default: null },
        studentid: { type: String, $ref: "Student" },
        hostelid: { type: String, $ref: "Hostel" },
        email: String,
        amount: Number,
        status: { type: String, default: "Created" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        description: String
    }
);

export const Payment = mongoose.model<PaymentDocument>("Payment", PaymentSchema);