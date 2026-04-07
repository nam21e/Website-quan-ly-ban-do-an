const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      image_url,
      region_name,
      author_name,
      is_highlighted,
      user_id,
      category_id,
      location_id
    } = req.body;

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title,
        content,
        image_url,
        region_name,
        author_name,
        is_highlighted,
        user_id,
        category_id,
        location_id
      }])
      .select();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      content,
      image_url,
      region_name,
      author_name,
      is_highlighted,
      user_id,
      category_id,
      location_id
    } = req.body;

    const { data, error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        image_url,
        region_name,
        author_name,
        is_highlighted,
        user_id,
        category_id,
        location_id
      })
      .eq('id', req.params.id)
      .select();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Xóa bài viết thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;