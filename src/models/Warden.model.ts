import mongoose, { MongooseError } from "mongoose";
import bcrypt from "bcryptjs";

export type WardenDocument = mongoose.Document & {
    wardenid: string;
    name: string;
    email: string;
    password: string;
    resetPasswordToken: string | null,
    resetPasswordExpires: Date | null,
    role: string;
    hostelid: string;
    profile: {
        name: string;
        email: string;
        contactno: string;
    };
    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

const WardenSchema = new mongoose.Schema<WardenDocument>(
    {
        wardenid: { type: String, unique: true },
        name: String,
        email: { type: String, unique: true },
        password: String,
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
        role: {type: String, default: "warden"},
        hostelid: String,
        profile: {
            name: String,
            email: String,
            contactno: String
        }
    }
);

/**
 * Password hash middleware.
 */
 WardenSchema.pre("save", function save(next) {
    const user = this as WardenDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt).then((hashedPasswd: string ) => {
            user.password = hashedPasswd;
            next();
        })
        .catch(err => console.log(err));
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: MongooseError, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

WardenSchema.methods.comparePassword = comparePassword;

export const Warden = mongoose.model<WardenDocument>("Warden", WardenSchema);