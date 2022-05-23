import { IsNumber, IsString, IsInt } from "class-validator";

class LoginInput {
    @IsString()
    email: string;
    @IsString()
    password: string;
}

export class HostelInput {
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

export class StudentInput {
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

export class AdminLoginInput extends LoginInput{};

export class StudentLoginInput extends LoginInput {};

export class WardenLoginInput extends LoginInput {};

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
}

