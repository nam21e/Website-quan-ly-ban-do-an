const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

// USER POSTS
router.get('/my-posts', PostController.getMyPosts);

// ADMIN POSTS
router.get('/admin/all', PostController.getAllPosts);

// SEARCH POSTS
router.get('/search', PostController.searchPosts);

// REGION POSTS
router.get('/region/:region', PostController.getPostsByRegion);

// APPROVE POST
router.put('/:id/approve', async (req, res) => {
  try {
    const supabase = require('../config/supabase');

    const { data, error } = await supabase
      .from('posts')
      .update({ status: 'Được Duyệt' })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({
      message: 'Đã duyệt bài viết',
      post: data,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// CRUD POSTS
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.post('/', PostController.createPost);
router.put('/:id', PostController.updatePost);
router.delete('/:id/user-delete', PostController.deleteMyPost);
router.delete('/:id', PostController.deletePost);

module.exports = router;