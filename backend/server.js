const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Đổi thành mật khẩu của bạn
  database: 'qly' // Đổi thành tên database của bạn
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Cấu hình lưu file với multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// API - Lấy danh sách sản phẩm
app.get('/product/gets', (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Database error');
    } else {
      res.json(result);
    }
  });
});

// API - Thêm sản phẩm
app.post('/product/add', upload.single('image'), (req, res) => {
  const { name, email } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = 'INSERT INTO products (name, email, image) VALUES (?, ?, ?)';
  db.query(sql, [name, email, image], (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      res.status(500).send('Database error');
    } else {
      res.send('Product added successfully');
    }
  });
});

// API - Xóa sản phẩm
app.delete('/product/delete/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Database error');
    } else {
      res.send('Product deleted successfully');
    }
  });
});

// API - Cập nhật sản phẩm
app.put('/product/update/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = image 
    ? 'UPDATE products SET name = ?, email = ?, image = ? WHERE id = ?'
    : 'UPDATE products SET name = ?, email = ? WHERE id = ?';

  const params = image ? [name, email, image, id] : [name, email, id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Database error');
    } else {
      res.send('Product updated successfully');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
