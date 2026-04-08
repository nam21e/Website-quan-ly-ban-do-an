const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === '123') {
    return res.json({
      token: 'fake-admin-token',
      roles: ['Admin'],
      fullName: 'Admin',
      email: 'admin@gmail.com'
    });
  }

  return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
});

module.exports = router;
