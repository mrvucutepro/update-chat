import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IMessage } from './Message';

export interface IMessageStatus extends Document {
    message_id: IMessage['_id'];
    user_id: IUser['_id'];
    is_read: boolean;
    read_at: Date | null;
}

const MessageStatusSchema: Schema = new Schema({
    message_id: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    is_read: {
        type: Boolean,
        default: false,
    },
    read_at: {
        type: Date,
        default: null,
    },
});

export default mongoose.model<IMessageStatus>(
    'MessageStatus',
    MessageStatusSchema
);
