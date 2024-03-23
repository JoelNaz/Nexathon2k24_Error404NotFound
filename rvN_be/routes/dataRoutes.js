const express = require('express');
const router = express.Router();
const {YearlyData,endangeredSpecies,Visitor} = require('../models/periodic');
const {Message} = require('../models/User');

// GET route to fetch yearly data details
router.get('/getyearlydata/:parkName', async (req, res) => {
    try {
      const parkName = req.params.parkName;
      const yearlyData = await YearlyData.find({ parkName: parkName });
      res.json(yearlyData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  
router.post('/postyearlydata', async (req, res) => {
    try {
      const { parkName, year, flora, fauna } = req.body;
  
      // Create a new YearlyData instance
      const newYearlyData = new YearlyData({
        parkName,
        year,
        flora,
        fauna,
      });
  
      // Save the new yearly data to the database
      await newYearlyData.save();
  
      res.status(201).json({ message: 'Yearly data added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/postEndangeredSpecies', async (req, res) => {
    try {
        const { parkName, year, rhino, tiger, asianElephant, wildWaterBuffalo, gaur, easternSwampDeer, sambarDeer } = req.body;

        const newEndangeredSpecies = new endangeredSpecies({
            parkName,
            year,
            rhino,
            tiger,
            asianElephant,
            wildWaterBuffalo,
            gaur,
            easternSwampDeer,
            sambarDeer,
        });

        await newEndangeredSpecies.save();

        res.status(201).json({ message: 'Endangered species data created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/getEndangeredSpecies/:parkName/:year', async (req, res) => {
  try {
    const { parkName, year } = req.params;
    const endangeredSpeciesData = await endangeredSpecies.findOne({ parkName });
    
    if (!endangeredSpeciesData) {
      return res.status(404).json({ message: 'Data not found for the specified park and year' });
    }

    res.json(endangeredSpeciesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/add-visitor', async (req, res) => {
  try {
    const { name, id, rfid, nationality, intime, outtime } = req.body;

    console.log('Received values:', { name, id, rfid, nationality, intime, outtime });

    // Parse intime and outtime from JSON format to Date objects
    const parsedIntime = intime ? new Date(intime) : null;
const parsedOuttime = outtime ? new Date(outtime) : null;

if (!parsedIntime || isNaN(parsedIntime.valueOf()) || !parsedOuttime || isNaN(parsedOuttime.valueOf())) {
  return res.status(400).json({ message: 'Invalid date format in request' });
}

const visitor = new Visitor({
  name,
  id,
  rfid,
  nationality,
  inTime: parsedIntime,
  outTime: parsedOuttime,
});
    await visitor.save();

    res.status(201).json({ message: 'Visitor added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.get('/get-all-visitors', async (req, res) => {
  try {
    const allVisitors = await Visitor.find();
    res.status(200).json(allVisitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/sendmessages', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const newMessage = new Message({ sender, receiver, content });
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get messages between two users
router.get('/messages/:sender/:receiver', async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    const messages = await Message.find({ $or: [{ sender, receiver }, { sender: receiver, receiver: sender }] });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;