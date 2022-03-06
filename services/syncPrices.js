const StreamArray = require('stream-json/streamers/StreamArray');
const { Writable } = require('stream');
const fs = require('fs');

const db = require('../db/models');

const filePath = './cards.json';

const createPrices = async (model, value = {}) => {
  try {
    await new Promise((resolve, reject) => {
      if (value.prices && Object.entries(value.prices).length) {
        Object.entries(value.prices).forEach(([type, price], index) => {
          if (type === 'usd' || type === 'usd_foil' || type === 'usd_etched') {
            let typeval;
            switch (type) {
              case 'usd_foil':
                typeval = 'FOIL';
                break;
              case 'usd_etched':
                typeval = 'ETCHED';
                break;
              default:
                typeval = 'NON-FOIL';
                break;
            }
            if (price) {
              model.upsert({
                cardId: value.id,
                type: typeval,
                price,
              });
            }
          }
          if (index === Object.entries(value.prices).length - 1) {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  } catch (err) {
    console.error(err);
  }
};

const syncPrices = () => {
  const fileStream = fs.createReadStream(filePath);
  const jsonStream = StreamArray.withParser();

  const processingStream = new Writable({
    write({ key, value }, encoding, callback) {
      const syncData = async () => {
        await createPrices(db.CardPrice, value);
        callback();
      };
      syncData();
    },
    // Don't skip this, as we need to operate with objects, not buffers
    objectMode: true,
  });

  // Pipe the streams as follows
  fileStream.pipe(jsonStream.input);
  jsonStream.pipe(processingStream);

  // So we're waiting for the 'finish' event when everything is done.
  processingStream.on('finish', () => console.log('All done'));
};

syncPrices();
