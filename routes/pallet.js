const express = require('express');
const router = express.Router();
const Item = require('../model/Item');
const Pallet = require('../model/Pallets');
const Location = require('../model/Location');

router.get('/', async (req, res) => {
  try {
    const allPallet = await Pallet.find();
    res.json({ data: allPallet });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      err: err
    });
  }
});

router.post('/create', async (req, res) => {
  newPallet = new Pallet({ ...req.body });
  const { skuNumber } = newPallet;
  try {
    const itemFond = await Item.findOne({
      skuNumber: skuNumber
    });
    if (!itemFond) {
      res.json({
        success: false,
        message: `item not fond (${skuNumber})`
      });
    } else {
      const locations = await Location.find({
        skuNumber: skuNumber
      });
      newPallet.item = itemFond._id;
      newPallet.size = itemFond.size * newPallet.cont;
      newPallet.ounce = itemFond.ounce * newPallet.cont;
      newPallet.status = 'receiving';
      await newPallet.save();
      res.json({
        success: true,
        message: 'pallet create',
        item: newPallet,
        locations
      });
    }
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      err: err
    });
  }
});

router.get('/:skuNumber', async (req, res) => {
  const { skuNumber } = req.params;
  try {
    const palletsFond = await Pallet.find({
      skuNumber: skuNumber
    });

    if (palletsFond <= 0) {
      res.json({
        success: false,
        message: `items not fond (${skuNumber})`
      });
    } else {
      res.json({
        success: true,
        message: `items fond `,
        pallets: palletsFond
      });
    }
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      err: err
    });
  }
});

router.post('/update', async (req, res) => {
  const { id, status, location } = req.body;
  try {
    const pallet = await Pallet.findOne({
      _id: id
    });
    if (!pallet) {
      res.json({
        success: false,
        message: `pallet not fond (${pallet})`
      });
    } else {
      if (status) pallet.status = status;
      if (location) {
        pallet.location = location;
        const locationFond = await Location.findOne({
          fullName: location
        });
        if (!locationFond) {
          return res.json({
            success: false,
            message: `location nat valid ${location}`
          });
        }
        if (
          locationFond.skuNumber === pallet.skuNumber ||
          locationFond.skuNumber === null
        ) {
          await pallet.save();
          res.json({
            success: true,
            message: `pallet Updated `,
            data: pallet
          });
        } else {
          res.json({
            success: false,
            message: `mix sku not permeated (${pallet.skuNumber} - ${
              locationFond.skuNumber
            })`
          });
        }
      } else {
        await pallet.save();
        res.json({
          success: true,
          message: `pallet Updated `,
          data: pallet
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      err: err
    });
  }
});

router.delete('/delete', async (req, res) => {
  const { skuNumber } = req.body;
  try {
    const resolve = await Item.deleteOne({ skuNumber: skuNumber });
    if (resolve.deletedCount === 1) {
      res.json({
        success: true,
        message: 'done',
        data: resolve
      });
    } else {
      res.json({
        success: false,
        message: 'not fond',
        data: resolve
      });
    }
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      err: err
    });
  }
});

module.exports = router;
