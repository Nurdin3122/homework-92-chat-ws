export interface UserMutation {
    username:string;
    password:string;
}

export interface User {
    _id:string
    username:string;
    token: string;
}