require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});