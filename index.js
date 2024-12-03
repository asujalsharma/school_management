require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', schoolRoutes);

const PORT = process.env.PORT || 3000;



app.use("/",(req,res)=>{
    res.send("HElLO");})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
