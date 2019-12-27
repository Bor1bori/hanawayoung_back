import mongoose from 'mongoose';
import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';
import logger from '../utils/logger';
import { getValue } from '../config';
import {RestroomModel} from '../model/restroom';

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const mongoinit = async () => {
  const db = getValue('dbURL');
  logger.info('DB', db);
  let connection;
  try {
    connection = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    logger.error(err, 'app');
    setTimeout(mongoinit, 3000);
  }
  logger.info('Connected to MONGODB', 'app');
  return connection;
};
const seoulRestroomsMigrate = async () => {
  const STORE_PATH = path.join(__dirname, 'seoul.json');
  try {
    const exists = await fs.existsSync(STORE_PATH);
    if (!exists) {
      console.log(`No file named 'seoul.json'`);
      return -1;
    }
    try {
      await RestroomModel.collection.drop();
    } catch (err) {
    }
    const seoulRestrooms = await jsonfile.readFile(STORE_PATH);
    const length = seoulRestrooms.DATA.length;
    for (let i = 0 ; i < length ; i++) {
      const restroom = seoulRestrooms.DATA[i];
      await RestroomModel.create({
        name: restroom.fname,
        description: restroom.aname,
        location: [parseFloat(restroom.x_wgs84), parseFloat(restroom.y_wgs84)],
        insertdate: restroom.insertdate,
        updatedate: restroom.updatedate,
      });
    }
  } catch (err) {
    throw err;
  }
  
};

const main = async () => {
  const connection = await mongoinit();
  await seoulRestroomsMigrate();
  await connection?.disconnect();
};

main();
