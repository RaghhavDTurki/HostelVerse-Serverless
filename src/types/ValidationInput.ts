import { IsNumber, IsString, IsInt, IsDate, IsArray } from "class-validator";

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
    hostelid: string;
    @IsString()
    message: string;
    @IsDate()
    date_from: Date;
    @IsDate()
    date_to: Date;
}
export class CreateAnnouncementInput {
    @IsString()
    wardenid: string;
    @IsString()
    heading: string
    @IsString()
    message: string
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

export class UpdateLeaveApplication {
    @IsString()
    studentid: string;
    @IsString()
    wardenid: string;
    @IsString()
    name: string;
    @IsString()
    status: string;
    @IsString()
    remarks: string;
}

export class UpdateStudentProfile {
    @IsString()
    studentid: string;
    @IsString()
    name?: string;

}

export class UpdateRoomIssue {
    @IsString()
    hostelid: string;
    @IsString()
    roomno: string;
    @IsString()
    status: string;
}

export class UpdateWardenProfile {
    @IsString()
    wardenid: string;
    @IsString()
    name?: string;
    @IsString()
    email?: string;
    @IsString()
    contactno?: string;
}

export class AllotHostel {
    @IsArray()
    hostelid: string[];
    @IsArray()
    batch: string[];
}

export class CheckInInput {
    @IsString()
    studentid: string;
    @IsString()
    hostelid: string;
    @IsString()
    location: string;
}
export class CheckOutInput extends CheckInInput {};