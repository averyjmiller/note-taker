const notes = require('express').Router();

const uuid = require('../helpers/uuid');

const { readFromFile, writeToFile , readAndAppend } = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for submitting a note
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to submit a note`);

  const { title, text } = req.body;

  if(title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.status(200).json(response);
  } else {
    res.status(400).json('Error: title and text are not present, could not post new note.');
  }
});

// DELETE Route for deleting a note
notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to ${req.method} note id ${req.params.id}`);

  const { id } = req.params;

  readFromFile('./db/db.json')
  .then((data) => JSON.parse(data))
  .then((data) => {
    const match = data.filter(item => item.id === id);
    if(match.length > 0) {
      const filteredArr = data.filter(item => item.id !== id);
      writeToFile('./db/db.json', filteredArr);
      res.status(200).json(`Successfully deleted note`);
      console.info(`Note with id ${id} has been deleted`);  
    } else {
      res.status(400).json(`Error: could not find note with id ${id}`);
      console.info(`No match found with the id ${id}`);
    }});
});

module.exports = notes;