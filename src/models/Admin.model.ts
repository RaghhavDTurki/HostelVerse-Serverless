import mongoose from "mongoose";
import bcrypt from "bcryptjs";


export type AdminDocument = mongoose.Document & {
    adminid: string;
    name: string;
    email: string;
    password: string;
    resetPasswordToken: string | null,
    resetPasswordExpires: Date | null,
    role: string;
    profile: {
        name: string;
        email: string;
        contactno: string;
    };
    comparePassword: comparePasswordFunction;

};

type comparePasswordFunction = (candidatePassword: string) => Promise<boolean>;

const AdminSchema = new mongoose.Schema<AdminDocument>(
    {
        adminid: { type: String, unique: true },
        name: String,
        email: { type: String, unique: true },
        password: String,
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
        role: {type: String, default: "admin"},
        profile: {
            name: String,
            email: String,
            picture: String,
            contactno: String
        }
    }
);

/**
 * Password hash middleware.
 */
AdminSchema.pre("save", function save(next) {
    const user = this as AdminDocument;
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

const comparePassword: comparePasswordFunction = async function (candidatePassword) {
    try{
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch(err){
        throw new Error(err);   
    }
};


AdminSchema.methods.comparePassword = comparePassword;


export const Admin = mongoose.model<AdminDocument>("Admin", AdminSchema);