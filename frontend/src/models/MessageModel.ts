import { IUserModel } from "./UserModel";


export interface IBaseMessage {
    id: number;
    conversation: number;
    receiver: IUserModel;
    sender: IUserModel;
    status: string;
    is_edited: string;
    created_at: string;
    updated_at: string;
}

export interface ITextMessage extends IBaseMessage{
    text_content: string;
}

export interface IFileMessage{
    total_chunks: number;
    file_name: string;
    upload_id: string
}

export interface IFile extends IBaseMessage{
    file: IFileMessage
}


export interface IMessage extends ITextMessage, IFile {
    
}