import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface ISession extends Document {
    user_id: IUser['_id'];
    is_active: boolean;
    status: string;
    created_at: Date;
}

const SessionSchema: Schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },

    created_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<ISession>('Session', SessionSchema);
