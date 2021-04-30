const express = require('express');
const Datastore = require('nedb');

const app = express();

app.listen(3000, ()=>console.log('listening at 3000'));

app.use(express.json({limit:'1mb'}));

//serve web pages...(index.html)
app.use(express.static('comet-destroyer'));

const database = new Datastore('database.db');
database.loadDatabase();

app.post('/api', (request, response )=> {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json({
        status:'Success',
        sent:request.body,
        timestamp: timestamp,
    });
});