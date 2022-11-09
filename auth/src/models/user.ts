import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties
// that a User Model has
// returns a UserDoc
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  // transform the output of the document so we're not returning the password
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

// hashes the password before it is saved to the database
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    // gets the password from the UserDoc
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
})

// the purpose of this is to help typescript understand
// the attributes that are required to create a new User
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };