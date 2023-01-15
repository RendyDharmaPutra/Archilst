// Import Modules
const mongoose = require('mongoose');

// Koneksi Database
mongoose.connect('mongodb://127.0.0.1:27017/archi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Menambah Data
// const contact1 = new Contact({
//   nama: 'Tri Novita Rahmawati',
//   nim: 'xxxx',
//   email: 'trinovita@gmail.com',
//   prodi: 'Teknologi Hasil Pertanian',
//   noHP: '085735720306',
// });

// Menyimpan Data ke dalam Collection
// contact1.save().then((contact) => console.log(contact));
