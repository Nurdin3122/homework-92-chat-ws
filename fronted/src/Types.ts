export interface UserMutation {
    username:string;
    password:string;
}

export interface User {
    _id:string
    username:string;
    token: string;
}

export interface ChatMessage {
    username: string;
    text: string;
}

export interface WsMessage {
    type: string;
    payload: ChatMessage;
}