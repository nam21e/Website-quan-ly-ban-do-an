const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Lấy danh sách bài đã lưu theo user
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'Thiếu user_id' });
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        posts (
          id,
          title,
          image_url,
          author_name,
          created_at
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET BOOKMARKS ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    console.error('GET BOOKMARKS SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Kiểm tra đã lưu bài chưa
router.get('/check', async (req, res) => {
  try {
    const { user_id, post_id } = req.query;

    if (!user_id || !post_id) {
      return res.status(400).json({ message: 'Thiếu user_id hoặc post_id' });
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user_id)
      .eq('post_id', post_id)
      .maybeSingle();

    if (error) {
      console.error('CHECK BOOKMARK ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json({ bookmarked: !!data, bookmark: data || null });
  } catch (err) {
    console.error('CHECK BOOKMARK SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Thêm bookmark
router.post('/', async (req, res) => {
  try {
    const { user_id, post_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'Thiếu user_id' });
    }

    if (!post_id) {
      return res.status(400).json({ message: 'Thiếu post_id' });
    }

    const { data: existing, error: checkError } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user_id)
      .eq('post_id', post_id)
      .maybeSingle();

    if (checkError) {
      console.error('CHECK EXIST BOOKMARK ERROR:', checkError);
      return res.status(500).json({ message: checkError.message });
    }

    if (existing) {
      return res.status(200).json({ message: 'Bài viết đã được lưu', bookmark: existing });
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id, post_id }])
      .select('*')
      .single();

    if (error) {
      console.error('POST BOOKMARK ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('POST BOOKMARK SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Bỏ bookmark
router.delete('/', async (req, res) => {
  try {
    const { user_id, post_id } = req.body;

    if (!user_id || !post_id) {
      return res.status(400).json({ message: 'Thiếu user_id hoặc post_id' });
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user_id)
      .eq('post_id', post_id);

    if (error) {
      console.error('DELETE BOOKMARK ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json({ message: 'Bỏ lưu bài thành công' });
  } catch (err) {
    console.error('DELETE BOOKMARK SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;