// Web Server dengan ExpressJS
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('./utils/db');
const Contact = require('./model/contact');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookie = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();

const port = 3000;

// Set untuk penggunaan View Engine EJS
app.set('view engine', 'ejs');

// Menggunakan Express Layouts
app.use(expressLayouts);

// Menggunakan File Statis
app.use(express.static('public'));

// Parse URL Encoded
app.use(express.urlencoded({ extended: true }));

app.use(cookie('secret'));
app.use(session({ cookie: { maxAge: 6000 }, secret: 'secret', resave: true, saveUninitialized: true }));
app.use(flash());
app.use(methodOverride('_method'));

// Data
const mhs = [
  {
    nama: 'Rendy DharmaPutra',
    nim: 'xxxxxx',
    email: 'rendydharmaputra424@gmail.com',
    prodi: 'Teknik Informatika',
    noHP: '08980426333',
  },
  {
    nama: 'Tri Novita Rahmawati Sidi Prasetya',
    nim: 'xxxxxx',
    email: 'ntetbau@gmail.com',
    prodi: 'Teknologi Hasil Pertanian',
    noHP: '089893884234',
  },
];

// Home Page Route
app.get('/', (req, res) => {
  res.render('index', {
    layout: 'layouts/main-layouts',
    nama: 'Ntet Bau',
    title: 'Home',
    mhs,
  });
});

// About Page Route
app.get('/about', (req, res) => {
  res.render('about', { layout: 'layouts/main-layouts', title: 'About' });
});

// Contact Page Route
app.get('/contact', async (req, res) => {
  // Contact.find().then((contact) => {
  //   res.send(contact);
  // });
  const contacts = await Contact.find();
  res.render('contact', {
    layout: 'layouts/main-layouts',
    title: 'Contact',
    contacts,
    msg: req.flash('msg'),
  });
});

// Add Data Page Route
app.get('/contact/add', (req, res) => {
  res.render('add', { layout: 'layouts/main-layouts', title: 'Add Contact', action: '/contact', edit: false });
});

// // Proses Tambah Data
app.post(
  '/contact',
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      // console.log(duplikat);
      if (duplikat) {
        throw new Error('Nama sudah digunakan!');
      }
      // else {
      //   return true;
      // }
      return true;
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('noHP', 'Nomor HP tidak valid').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.status(400).json({ errors: errors.array() });
      res.render('add', { layout: 'layouts/main-layouts', title: 'Add Contact', errors: errors.array(), action: '/contact', contact: req.body, edit: true });
    } else {
      // console.log(req.body);
      // res.send(req.body);
      Contact.insertMany(req.body, (error, result) => {
        // Kirimkan Flash Message
        req.flash('msg', 'Data berhasil ditambahkan!');
        res.redirect('/contact');
      });
    }
  }
);

// Proses Hapus Data
// app.get('/contact/delete/:nama', async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });

//   if (!contact) {
//     res.status(404);
//     res.send('<h1>404</h1>');
//   } else {
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       req.flash('msg', 'Data berhasil dihapus');
//       res.redirect('/contact');
//     });
//   }
// });

app.delete('/contact', (req, res) => {
  // res.send(req.body);
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash('msg', 'Data berhasil dihapus');
    res.redirect('/contact');
  });
});

// Halaman Edit Data
// app.get('/contact/edit/:nama', async (req, res) => {
//   contact = await Contact.findOne({ nama: req.params.nama });
//   res.render('edit', { layout: 'layouts/main-layouts', title: 'Edit Contact', contact });
// });

app.get('/contact/edit/:nama', async (req, res) => {
  contact = await Contact.findOne({ nama: req.params.nama });
  res.render('add', { layout: 'layouts/main-layouts', title: 'Edit Contact', contact, action: '/contact?_method=PUT', edit: true });
});

// Proses Ubah Data
app.put(
  '/contact',
  [
    body('nama').custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      // console.log(duplikat);
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama sudah digunakan!');
      }
      // else {
      //   return true;
      // }
      return true;
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('noHP', 'Nomor HP tidak valid').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // res.status(400).json({ errors: errors.array() });
      res.render('edit', { layout: 'layouts/main-layouts', title: 'Edit Contact', errors: errors.array(), contact: req.body, action: '/contact?_method=PUT', edit: true });
    } else {
      // console.log(req.body);
      // res.send(req.body);
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            nim: req.body.nim,
            email: req.body.email,
            prodi: req.body.prodi,
            noHP: req.body.noHP,
          },
        }
      ).then((result) => {
        req.flash('msg', 'Data berhasil diubah!');
        res.redirect('/contact');
      });
    }
  }
);

// Detail Page Route
app.get('/contact/:nama', async (req, res) => {
  // const contact = find(req.params.nama);
  const contact = await Contact.findOne({ nama: req.params.nama });
  // console.log(contacts);
  res.render('detail', {
    layout: 'layouts/main-layouts',
    title: 'Detail Contact',
    contact,
  });
});

// Respon untuk route selain root & selain route yang mendahului
app.use('/', (req, res) => {
  res.status(404);
  // res.send(`404 Page Not Found`);
  res.send(`<h1>404 Page Not Found</h1>`);
});

// Menjalankan server pada port yang dituju
app.listen(port, () => {
  console.log(`Listening on localhost:${port}`);
});
