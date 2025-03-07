import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ISession } from './Session';

export interface IMessage extends Document {
    session_id: ISession['_id'];
    sender_id: IUser['_id'];
    message: string;
    is_internal: boolean;
    sent_at: Date;
}

const MessageSchema: Schema = new Schema({
    session_id: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true,
    },
    sender_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    is_internal: {
        type: Boolean,
        default: false,
    },
    message_status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
    }, // Trạng thái tin nhắn
    sent_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IMessage>('Message', MessageSchema);
