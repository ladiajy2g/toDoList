const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    
    var today = new Date();
    var currentDay = today.getDay();
    var day ='';

    switch (currentDay) {
        case 0:
            day ='Sunday';
            break;
        case 1:
            day = 'Monday';
            break;
        case 2:
            day = 'Tuesday';
            break;
        case 3:
            day = 'Wednesday';
            break;
        
    }
   
    res.render('list', {dayOfWeek: day});
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000.');
})
