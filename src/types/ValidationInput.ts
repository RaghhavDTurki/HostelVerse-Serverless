import { IsNumber, IsString, IsInt, IsDate } from "class-validator";

export class CreateHostelInput {
    @IsString()
    hostelid: string;
    @IsString()
    name: string;
    @IsString()
    location: string;
    @IsString()
    wardenid?: string | null;
    @IsString()
    description: string;
    @IsInt()
    totalCapacity: number;
    @IsInt()
    singleRooms?: number;
    @IsInt()
    doubleRooms?: number;
    @IsInt()
    tripleRooms?: number;
    @IsInt()
    singleRoomsLeft?: number;
    @IsInt()
    doubleRoomsLeft?: number;
    @IsInt()
    tripleRoomsLeft?: number;
    @IsInt()
    fees: number;
    @IsString()
    image?: string;
}

export class CreateStudentInput {
    @IsString()
    studentid: string;
    @IsString()
    email: string;
    @IsString()
    password: string;
    @IsString()
    name: string;
    @IsString()
    gender: string;
    @IsString()
    contactno: string;
    @IsString()
    location: string;
}

export class VerifyEmailInput {
    @IsString()
    email: string;
    @IsNumber()
    code: number;
}

export class AdminSignupInput {
    @IsString()
    email: string;
    @IsString()
    password: string;
    @IsString()
    name: string;
    @IsString()
    contactno: string;
    @IsString()
    adminid: string;
}

export class LoginInput {
    @IsString()
    email: string;
    @IsString()
    password: string;
    @IsString()
    role: string;
}

export class CreateWardenInput {
    @IsString()
    wardenid: string;
    @IsString()
    email: string;
    @IsString()
    password: string;
    @IsString()
    name: string;
    @IsString()
    contactno: string;
    @IsString()
    hostelid: string;
}

export class CreateRoomInput {
    @IsString()
    hostelid: string;
    @IsString()
    roomno: string;
    @IsString()
    type: string;
    @IsString()
    updateOrAdd: string;
}

export class CreateIronToken {
    @IsString()
    id: string
    @IsString()
    role: string
}

export class CreateRoomIssueInput {
    @IsString()
    hostelid: string;
    @IsString()
    roomno: string;
    @IsString()
    remarks: string;
}

export class CreateFeedbackInput {
    @IsString()
    hostelid: string;
    @IsString()
    studentid: string;
    @IsString()
    name: string;
    @IsInt()
    rating: number;
    @IsString()
    message: string;
}

export class CreateLeaveApplicationInput {
    @IsString()
    studentid: string;
    @IsString()
    message: string;
    @IsDate()
    date_from: Date;
    @IsDate()
    date_to: Date;
}

export class GetWardenInput {
    @IsString()
    wardenid?: string;
}

export class DeleteWardenInput {
    @IsString()
    wardenid: string;
}

export class ViewFeedbackInput {
    @IsString()
    hostelid?: string;
}

export class GetStudents {
    @IsString()
    wardenid: string;
    @IsString()
    studentid?: string;
}