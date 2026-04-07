const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('locations').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('locations')
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
    const { name, address, region_name } = req.body;

    const { data, error } = await supabase
      .from('locations')
      .insert([{ name, address, region_name }])
      .select();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, address, region_name } = req.body;

    const { data, error } = await supabase
      .from('locations')
      .update({ name, address, region_name })
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
      .from('locations')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Xóa location thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;