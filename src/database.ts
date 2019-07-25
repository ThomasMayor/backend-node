import * as mongoose from 'mongoose';
import { Mongoose } from 'mongoose';

// remove deprecated warning
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export class Database {
  private db: Mongoose = mongoose; // mongoose is an instance of class Mongoose

  constructor(
    private uri: string,
    private user?: string,
    private pass?: string,
  ) { }

  connect() {
    console.log('Connecting database to ' + this.uri);
    return this.db
               .connect(this.uri, { useNewUrlParser: true, user: this.user, pass: this.pass })
               .then(mongooseConnected => {
                 console.log('Database connected to ' + this.uri);
                 return mongooseConnected;
               });
  }

  disconnect() {
    return this.db.disconnect();
  }
}
