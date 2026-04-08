const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { post_id } = req.query;

    let query = supabase
      .from('comments')
      .select(`
        *,
        users (
          id,
          username,
          avatar
        )
      `)
      .order('created_at', { ascending: false });

    if (post_id) {
      query = query.eq('post_id', post_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('GET COMMENTS ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    console.error('GET COMMENTS SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users (
          id,
          username,
          avatar
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) {
      console.error('GET COMMENT BY ID ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('GET COMMENT BY ID SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { content, user_id, post_id } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
    }

    if (!user_id) {
      return res.status(400).json({ message: 'Thiếu user_id' });
    }

    if (!post_id) {
      return res.status(400).json({ message: 'Thiếu post_id' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          content: content.trim(),
          user_id,
          post_id,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('POST COMMENT ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('POST COMMENT SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ content: content.trim() })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      console.error('UPDATE COMMENT ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('UPDATE COMMENT SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      console.error('DELETE COMMENT ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json({ message: 'Xóa comment thành công' });
  } catch (err) {
    console.error('DELETE COMMENT SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;