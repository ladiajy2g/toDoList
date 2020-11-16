const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

// const date = require(__dirname +'/date.js');

const app = express();

// const items = [];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

// mongoose.connect('mongodb://localhost:27017/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://dipo:lU67eiSUH7IhIXVY@cluster0.ymekl.mongodb.net/todoListDB', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb+srv://dipo:lU67eiSUH7IhIXVY@cluster0.ymekl.mongodb.net/todoListDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});


const itemsSchema = new mongoose.Schema(
    {
        name: String, 
    }
)

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item(
    {
        name: 'Welcome to your To Do List'
    }
);

const item2 = new Item(
    {
        name: 'Hit the + button to Add New'
    }
);

const item3 = new Item(
    {
        name: '<-- Hist this to delete and item'
    }
);

const defaultItems =[item1, item2, item3];

const listSchema = new mongoose.Schema(
    {
        name: String,
        items: [itemsSchema]
    }
);

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {
    // const day = date.getDay();
    // res.render('list', {listTitle: 'day', newListItems: items});

// check if there are items in the Item array, if not, insert default items otherwise show existing items

    Item.find({}, (err, foundItems)=>{
        if (foundItems.length === 0 ) {
            Item.insertMany(defaultItems, (err)=>{
                if (err){
                    console.log(err);
                } else {
                    console.log('Todo List has been updated')
                }
            });
            res.redirect('/');

        } else {
            res.render('list', {listTitle: 'Today', newListItems: foundItems});
        }
        
    });

});

// saven entries in today lists and also other category lists
app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    
    const item = new Item(
        {
            name: itemName
        }
    );

    if (listName === 'Today'){
        item.save();
        res.redirect('/');
    } else{
        List.findOne({name: listName}, (err, foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
    }

    // commented out because we will now use mongoose
    // if (req.body.list ==='Work'){
    //     workItems.push(item);
    //     res.redirect('/work');
    // }else {
    //     items.push(item);
    //     res.redirect('/');
    // }
})

app.post('/delete', (req, res) => {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === 'Today') {
        Item.findByIdAndRemove({_id: checkedItem}, (err)=>{
            if (err) {
                console.log(err);
            } else{
                console.log('item deleted');
            }
        });
        res.redirect('/')
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, (err, foundList)=>{
            if (!err) {
                res.redirect('/' + listName);
            }
        });
    }

    
});


// create custom lists with default entries
app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, (err, foundList)=>{
        if(!err){
            if(!foundList) {
                // create a new list
                const list = new List(
                    {
                        name: customListName,
                        items: defaultItems
                    }
                );
                list.save();
                res.redirect('/' + customListName);
            } else{
                // show an existing list
                res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    })

});
    

// routes will now be generated automatically

// app.get('/work', (req, res)=>{
//     res.render('list', {listTitle: 'Work List', newListItems: workItems});
// });

// app.get('/about', (req, res)=>{
//     res.render('about');
// })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, ()=>{
    console.log('Server has started on port 3000')
});

// app.listen(3000, ()=>{
//     console.log('Server is running on port 3000.');
// })