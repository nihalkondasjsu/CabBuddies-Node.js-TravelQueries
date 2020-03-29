const app = require('express')();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

app.listen(3001,()=>{
    console.log('listening on 3001')
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://ikmv:ikmv@localhost:27017/TravelQueries',{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(()=>console.log('db connected'))
.catch((err)=>console.log(err));

app.get('/',(req,res)=>{
    res.send('happy')
})

app.get('/decode', require('./utils/auth-token').authenticateToken,(req,res)=>{
    res.send(req.val)
})

app.use('/query',require('./api/routes/query'))

app.use('/response',require('./api/routes/response'))

console.log(app._router.stack)
