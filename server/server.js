const express = require("express");
const mongoose = require("mongoose");
const path = require("path")

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mevn_mem';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo error', err));

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    note: String
}, { timestamps: true});

const Item = mongoose.model('Item', itemSchema);

app.get('/items', async (req, res) => {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
});

app.get('/items/:id', async (req, res) =>{
    const it = await Item.findById(req.params.id);
    if (!it) return res.status(404).json({ error: 'Not found' });
    res.json(it);
});

app.post('/items', async (req, res) => {
    const created = await Item.create({ name: req.body.name, note: req.body.note });
    res.json(created);  
});

app.put('/items/:id', async (req, res) => {
    const updated = await Item.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name, note: req.body.note },
        { new: true }
    );
    if(!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated); 
});



app.delete('/items/:id', async (req, res) =>{
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found'});
    res.json({ success: true })
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get(/.*/, (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server on', PORT));
