import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ISession } from './Session';

export interface ISessionCounselor extends Document {
    session_id: ISession['_id'];
    counselor_id: IUser['_id'];
    joined_at: Date;
}

const SessionCounselorSchema: Schema = new Schema({
    session_id: {
        type: Schema.Types.ObjectId,
        ref: 'Session',
        required: true,
    },
    counselor_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    joined_at: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<ISessionCounselor>(
    'SessionCounselor',
    SessionCounselorSchema
);
