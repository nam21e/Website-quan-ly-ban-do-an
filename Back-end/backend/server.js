require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Cấu hình multer để lưu ảnh vào thư mục uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// API upload ảnh
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    res.json({
      message: 'Upload ảnh thành công',
      filename: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use('/posts', require('./routes/postRoutes'));
app.use('/categories', require('./routes/categoryRoutes'));
app.use('/regions', require('./routes/regionRoutes'));
app.use('/locations', require('./routes/locationRoutes'));
app.use('/comments', require('./routes/commentRoutes'));
app.use('/comment-reactions', require('./routes/commentReactionRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/post-tags', require('./routes/postTagRoutes'));
app.use('/tags', require('./routes/tagRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/admin', adminRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});