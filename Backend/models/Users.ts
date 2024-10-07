import mongoose, {Model} from 'mongoose';
import {UserFields} from "../types.Db";
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;
interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
}
type UserModel = Model<UserFields,UserMethods>;



const UserSchema = new Schema<UserFields,UserModel, UserMethods>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type:String,
        default: null,
        unique:false,
    },

});


const SALT_WORK_FACTOR = 10;
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model<UserFields, UserModel>('User', UserSchema);

export default User;