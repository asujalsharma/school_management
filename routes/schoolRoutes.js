const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Add School
router.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, parseFloat(latitude), parseFloat(longitude)], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error.' });
        }
        res.status(201).json({ message: 'School added successfully!', schoolId: result.insertId });
    });
});

module.exports = router;


const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

router.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'User location is required.' });
    }

    db.query('SELECT * FROM schools', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error.' });
        }

        const userLocation = [parseFloat(latitude), parseFloat(longitude)];
        const sortedSchools = results.map((school) => {
            const distance = haversineDistance(userLocation, [school.latitude, school.longitude]);
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        console.log(sortedSchools);
        res.json(sortedSchools);
    });
});

module.exports = router;
