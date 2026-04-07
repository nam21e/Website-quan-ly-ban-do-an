const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('comment_reactions').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comment_reactions')
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
    const { type, user_id, comment_id } = req.body;

    const { data, error } = await supabase
      .from('comment_reactions')
      .insert([{ type, user_id, comment_id }])
      .select();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { type, user_id, comment_id } = req.body;

    const { data, error } = await supabase
      .from('comment_reactions')
      .update({ type, user_id, comment_id })
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
      .from('comment_reactions')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Xóa reaction thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;