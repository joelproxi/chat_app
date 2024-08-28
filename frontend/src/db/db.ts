import { openDB, DBSchema } from 'idb';
import { IMessage } from '../models/MessageModel';


interface MyDB extends DBSchema {
    messages: {
        key: number,
        value: IMessage
    }
}

const dbPromise = openDB<MyDB>('chat_app_db', 1, {
    upgrade(db)  {
        db.createObjectStore('messages', { keyPath: 'id'});
    }
});

export const saveMessage = async (message: IMessage) => {
    const db = await dbPromise;
    await db.put('messages', message)
};

export const getMessages = async(): Promise<IMessage[]> => {
    const db = await dbPromise;
    return await db.getAll('messages');
}
