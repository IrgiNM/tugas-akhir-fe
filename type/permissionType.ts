import { userGetType } from "./userGetType";

export type permissionType = {
    id?: number;
    name: string;
    user: number;
    user_detail?: userGetType
}