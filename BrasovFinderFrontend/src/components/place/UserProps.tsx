import {Role} from "./Role";

export interface UserProps{
    id?: number;
    username: string;
    password?: string;
    email?: string;
    personal_score?:number;
    position?: number;
    role?: Role;
}