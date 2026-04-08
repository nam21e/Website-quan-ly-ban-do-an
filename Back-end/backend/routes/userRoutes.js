const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Lấy tất cả users
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy user theo id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${email}`);

    if (checkError) {
      return res.status(500).json({ message: checkError.message });
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password,
          role: 'user'
        }
      ])
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.json({
      message: 'Đăng ký thành công',
      user: data,
      token: 'fake-token',
      username: data.username,
      email: data.email,
      roles: [data.role || 'user']
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập username/email và mật khẩu' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`)
      .eq('password', password)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    res.json({
      message: 'Đăng nhập thành công',
      token: 'fake-token',
      username: data.username,
      email: data.email,
      roles: [data.role || 'user'],
      user: data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm user thủ công
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password, role }])
      .select();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sửa user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ username, email, password, role })
      .eq('id', req.params.id)
      .select();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa user
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: 'Xóa user thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;