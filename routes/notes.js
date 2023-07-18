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

notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to ${req.method} note id ${req.params.id}`);

  const { id } = req.params;

  readFromFile('./db/db.json')
  .then((data) => JSON.parse(data))
  .then((data) => {
    const filteredArr = data.filter(item => item.id !== id);
    writeToFile('./db/db.json', filteredArr);
  })
  .then(() => {
    res.status(200).json(`Successfully deleted note`);
    console.info(`Note with id ${id} has been deleted`);
  });
});

module.exports = notes;