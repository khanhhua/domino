import mongoose from 'mongoose';
import app from './app';

mongoose.connect('mongodb://root:root@localhost:27017/domino', {
  useNewUrlParser: true,
  autoReconnect: true,
})
    .then(app.bind(null, 9000))
    .catch((e) => {
      console.log('Could not connect to MongoDB!', e);
    });
