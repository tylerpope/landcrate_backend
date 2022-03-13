const StreamArray = require('stream-json/streamers/StreamArray');
const { Writable } = require('stream');
const fs = require('fs');
const axios = require('axios');
const request = require('request');
const progress = require('request-progress');

const db = require('../db/models');

const filePath = './cards.json';
const scryfallBulkEndpoint = 'https://api.scryfall.com/bulk-data';

const createCards = async (model, value) => {
  try {
    await model.upsert({
      id: value.id,
      arenaId: value.arena_id,
      lang: value.lang,
      mtgoId: value.mtgo_id,
      mtgoFoilId: value.mtgo_foil_id,
      tcgPlayerId: value.tcgplayer_id,
      tcgPlayerEtchedId: value.tcgplayer_etched_id,
      cardmarketId: value.cardmarket_id,
      oracleUUID: value.oracle_id,
      printsSearchUri: value.prints_search_uri,
      rulingsUri: value.rulings_uri,
      srcyfallUri: value.scryfall_uri,
      cardFaces: value.card_faces ? JSON.stringify(value.card_faces) : null,
      convertedManaCost: value.cmc,
      edhrecRank: value.edhrec_rank,
      handModifier: value.hand_modifier,
      layout: value.layout,
      lifeModifier: value.life_modifier,
      loyalty: value.loyalty,
      manaCost: value.mana_cost,
      name: value.name,
      oracleText: value.oracle_text,
      power: value.power,
      toughness: value.toughness,
      typeLine: value.type_line,
      artist: value.artist,
      imageUris: value.image_uris ? JSON.stringify(value.image_uris) : null,
      borderColor: value.border_color,
      cardBackId: value.card_back_id,
      collectorNumber: value.collector_number,
      flavorName: value.flavor_name,
      flavorText: value.flavor_text,
      frame: value.frame,
      illustrationId: value.illustration_id,
      imageStatus: value.image_status,
      printedName: value.printed_name,
      printedTypeLine: value.printed_type_line,
      purchaseUris: value.purchase_uris
        ? JSON.stringify(value.purchase_uris)
        : null,
      rarity: value.rarity,
      releasedAt: value.released_at,
      setCode: value.set,
      setId: value.set_id,
      setName: value.set_name,
    });
  } catch (err) {
    console.error(err);
  }
};

const createCardColor = async (model, value) => {
  try {
    await new Promise((resolve, reject) => {
      if (value.colors && value.colors.length) {
        value.colors.forEach((color, index) => {
          model.upsert({
            cardId: value.id,
            color,
          });
          if (index === value.colors.length - 1) {
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

const createCardColorIdentity = async (model, value = {}) => {
  try {
    await new Promise((resolve, reject) => {
      if (value.color_identity && value.color_identity.length) {
        value.color_identity.forEach((color, index) => {
          model.upsert({
            cardId: value.id,
            color,
          });
          if (index === value.color_identity.length - 1) {
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

const createCardFinishes = async (model, value) => {
  try {
    await new Promise((resolve, reject) => {
      if (value.finishes.length) {
        value.finishes.forEach((finish, index) => {
          let standardFinish = '';
          switch (finish) {
            case 'foil':
              standardFinish = 'FOIL';
              break;
            case 'nonfoil':
              standardFinish = 'NON-FOIL';
              break;
            case 'glossy':
              standardFinish = 'FOIL';
              break;
            case 'etched':
              standardFinish = 'ETCHED';
              break;
            default:
              break;
          }
          model.upsert({
            cardId: value.id,
            finish: standardFinish,
          });
          if (index === value.finishes.length - 1) {
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

const syncAll = () => {
  const fileStream = fs.createReadStream(filePath);
  const jsonStream = StreamArray.withParser();

  console.log('Writing Data..');
  const startTime = new Date();

  const processingStream = new Writable({
    write({ key, value }, encoding, callback) {
      const syncData = async () => {
        if (!value.games.includes('paper')) return callback();
        await createCards(db.Card, value);
        if (value.colors) {
          await createCardColor(db.CardColor, value);
        }
        if (value.prices) {
          await createPrices(db.CardPrice, value);
        }
        if (value.color_identity) {
          await createCardColorIdentity(db.CardColorIdentity, value);
        }
        if (value.finishes) {
          await createCardFinishes(db.CardFinish, value);
        }
        // setTimeout(() => {
        //   callback();
        // }, 10);
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
  processingStream.on('finish', () => {
    const endTime = new Date();
    let timeDiff = endTime - startTime;

    timeDiff /= 1000;

    console.log(
      `Done! Total time elapsed ${Math.round(timeDiff / 60)} mintues`,
    );
  });
};

// Download JSON and update SQL database
const getBulkData = () => axios.get(scryfallBulkEndpoint).then((res = {}) => {
  const defaultCards = res.data.data.find(
    (item) => item.type === 'default_cards',
  );

  if (!defaultCards) {
    console.error('Could not find all cards object.');
    return;
  }

  progress(request(defaultCards.download_uri), {})
    .on('progress', (state) => {
      console.log('progress', state);
    })
    .on('error', (err) => {
      console.error(err);
    })
    .on('end', () => {
      // Downloaded file, update database
      console.log('Finished downloading file.');
      syncAll();
    })
    .pipe(fs.createWriteStream(filePath));
});

// getBulkData();
syncAll();
