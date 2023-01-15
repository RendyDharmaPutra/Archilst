const mongoose = require('mongoose');

// Membuat Schema
const Contact = mongoose.model('Contact', {
  nama: {
    type: String,
    required: true,
  },
  nim: {
    type: String,
  },
  prodi: {
    type: String,
  },
  kampus: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  noHP: {
    type: String,
    required: true,
  },
});

module.exports = Contact;
