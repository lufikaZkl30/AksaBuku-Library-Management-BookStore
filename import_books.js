require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Books = require('./models/books');

let uri = process.env.MONGO_URI;
if (uri && uri.startsWith('mongodb+srv://')) {
  uri = uri.replace('mongodb+srv://', 'mongodb://');
  uri = uri.replace('cluster0.57gmqud.mongodb.net', 'ac-twqhkfi-shard-00-00.57gmqud.mongodb.net:27017,ac-twqhkfi-shard-00-01.57gmqud.mongodb.net:27017,ac-twqhkfi-shard-00-02.57gmqud.mongodb.net:27017');
  const separator = uri.includes('?') ? '&' : '?';
  uri += `${separator}ssl=true&replicaSet=atlas-170z4v-shard-0&authSource=admin&retryWrites=true&w=majority`;
}

mongoose.connect(uri)
  .then(() => console.log('Connected to DB'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const results = [];

fs.createReadStream('public/DatabaseBuku.csv')
  .pipe(csv())
  .on('data', (data) => {
    const book = {
      judul: data.judul ? data.judul.trim() : undefined,
      author: data.author ? data.author.trim() : undefined,
      penerbit: data.penerbit ? data.penerbit.trim() : undefined,
      imageUrl: data.imageUrl ? data.imageUrl.trim() : undefined,
      sinopsis: data.sinopsis ? data.sinopsis.trim() : undefined,
      tanggal: data.tanggal ? Number(data.tanggal) : undefined,
      bulan: data.bulan ? data.bulan.trim() : '',
      tahun: Number(data.tahun),
      halaman: Number(data.halaman),
      harga: Number(data.harga),
      kategori: data.kategori ? data.kategori.trim() : undefined,
      isbn: data.isbn ? data.isbn.trim() : undefined,
      promo: data.promo ? data.promo.trim() : 'Disable',
      rentbook: data.rentbook ? data.rentbook.trim() : 'Disable',
      pdfPath: data.pdfPath ? data.pdfPath.trim() : undefined
    };

    if (data._id) {
        book._id = new mongoose.Types.ObjectId(data._id);
    }
    
    if (data.diskon) {
        book.diskon = Number(data.diskon);
    }

    results.push(book);
  })
  .on('end', async () => {
    try {
      console.log('Clearing existing books...');
      await Books.deleteMany({});
      console.log('Inserting new books...');
      await Books.insertMany(results);
      console.log(`Successfully imported ${results.length} books.`);
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
