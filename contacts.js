const fs = require('fs').promises;

const path = require('path');

const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, 'db/contacts.json');

async function readContacts() {
  const data = await fs.readFile(contactsPath, 'utf8');

  return JSON.parse(data);
}

function updateContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts), 'utf8');
}

const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) =>
    fs.writeFile(path, data, err => {
      if (err) {
        return reject(err.message);
      }
      resolve();
    })
  );
};

async function listContacts() {
  const contacts = await readContacts();
  console.log('Get contacts list: ');
  console.table(contacts);
}

async function getContactById(contactId) {
  const contacts = await readContacts();

  const contact = contacts.find(contact => contact.id === contactId);

  console.log(`Get contact by id : ${contactId}`);

  if (!contact) {
    console.log(`Contact with id ${contactId} not found`);
  } else {
    console.table(contact);
  }
}

async function removeContact(contactId) {
  const contacts = await readContacts();

  const contact = contacts.find(contact => contact.id === contactId);

  if (!contact) {
    console.log(`Contact with ID ${contactId} is not in the contacts list`);
  }

  const newContacts = contacts.filter(({ id }) => id !== contactId);

  await updateContacts(newContacts);

  const newData = await readContacts();

  console.log(`Contact with ID ${contactId} has been removed`);

  console.table(newData);
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();

  const newContact = { name, email, phone, id: nanoid(21) };

  contacts.push(newContact);

  await updateContacts(contacts);

  const newData = await readContacts();

  console.log(`Contact ${name} has been added to the contacts list`);
  console.table(newData);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
