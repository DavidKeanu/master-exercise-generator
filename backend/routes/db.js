const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const Sitzung = require('../models/Sitzung')
const Fehlerklasse = require('../models/Fehlerklasse');
const Fehlerdetail = require('../models/Fehlerdetail');
const Fehler = require('../models/Fehler');
const Hilfsmaterial = require('../models/Hilfsmaterial');

/**
 * Endpoint to create a session.
 * If matrikelnummer exists in database: just create new session
 * If matrikelnummer does not exist in database: create a new student entry in student table
 * ---
 * Required: matrikelnummer
 */
router.post('/create-session', async (req, res) => {
  try {
    const { matrikelnummer } = req.body;

    let student = await Student.findOne({ where: { matrikelnummer: matrikelnummer } });

    if (!student) {
      student = await Student.create({ matrikelnummer: matrikelnummer });
    }

    const sitzung = await Sitzung.create({
      student_id: student.student_id,
      session_start: new Date()
    });

    res.status(201).json({ sitzung_id: sitzung.sitzung_id });
  } catch (error) {
    console.error('Error while creating session:', error);
    res.status(500).json({error: 'Error while creating session.'});
  }
});

/**
 * Endpoint to add mistakes to the database.
 * ---
 * Required: sitzung, fehlerdetail_id
 */
router.post('/add-mistake', async function(req, res) {
  const {sitzung_id, fehlerdetail_id} = req.body;

  try {
    const currentTime = new Date();

    await Fehler.create({
      fehlerdetail_id: fehlerdetail_id,
      zeitpunkt: currentTime,
      sitzung_id: sitzung_id
    });

    res.status(201).json({message: 'Mistake added successfully.'});
  } catch (error) {
    console.error('Error while adding the mistake:', error);
    res.status(500).json({message: 'Error while adding the mistake.'});
  }
});

module.exports = router;
