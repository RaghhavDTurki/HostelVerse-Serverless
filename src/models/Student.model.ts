import mongoose, { MongooseError } from "mongoose";
import bcrypt from "bcryptjs";

export type StudentDocument = mongoose.Document & {
    studentid: string;
    email: string;
    password: string;
    roomid: string | null;
    hostelid: string | null;
    emailToken: number | null;
    emailTokenExpires: Date | null;
    resetPasswordToken: string | null,
    resetPasswordExpires: Date | null,
    role: string;
    active: boolean;
    distance: number;
    profile: {
        name: string;
        gender: string;
        email: string;
        contactno: string;
        location: string;
    };
    comparePassword: comparePasswordFunction;
};

type comparePasswordFunction = (candidatePassword: string) => Promise<boolean>;


const StudentSchema = new mongoose.Schema<StudentDocument>(
    {
        email: { type: String, unique: true },
        password: String,
        roomid: String,
        hostelid: String,
        studentid : { type: String, unique: true },
        distance: Number,
        emailToken: { type: Number, default: null },
        emailTokenExpires: { type: Date, default: null },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
        role : {type: String, default: "student"},
        active: { type: Boolean, default: false },
        profile: {
            name: String,
            gender: String,
            email: String,
            contactno: String,
            location: String,
        }
    }
);

/**
 * Password hash middleware.
 */
 StudentSchema.pre("save", function save(next) {
    const user = this as StudentDocument;
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


StudentSchema.methods.comparePassword = comparePassword;

export const Student = mongoose.model<StudentDocument>("Student", StudentSchema);