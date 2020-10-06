// import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
// import mongoose, { ConnectionOptions } from 'mongoose';
import { ConnectionOptions } from 'mongoose';

config();

export const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zzgku.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
// const env = process.env.NODE_ENV || 'development';
// const uri =
//   env !== 'development'
//     ? `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zzgku.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
//     : `mongodb://localhost:27017/${process.env.MONGO_DB}`;

export const options: ConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

// export default mongoose.connect(uri, options);

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// client.connect((err) => {
//   const collection = client.db('test').collection('devices');
//   // perform actions on the collection object
//   client.close();
// });
