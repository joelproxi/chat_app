import { IMessage } from "./MessageModel";
import { IUserModel } from "./UserModel";

export  interface IConversation {
    id: number;
    name: string;
    slug: string;
    other_user: IUserModel;
    last_message: IMessage;
}


