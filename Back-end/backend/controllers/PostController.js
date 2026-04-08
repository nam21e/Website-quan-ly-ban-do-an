const supabase = require('../config/supabase');

// Lấy tất cả bài viết
exports.getAllPosts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết 1 bài viết
exports.getPostById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Tạo bài viết mới
exports.createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      image_url,
      author_name,
      user_id,
      region_name,
      status,
      reject_reason,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Thiếu title hoặc content' });
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          image_url: image_url || null,
          author_name: author_name || 'Ẩn danh',
          user_id: user_id || null,
          region_name: region_name || null,
          status: status || 'Chờ Duyệt',
          reject_reason: reject_reason || null,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('CREATE POST ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('CREATE POST SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Cập nhật bài viết
exports.updatePost = async (req, res) => {
  try {
    const {
      title,
      content,
      image_url,
      author_name,
      region_name,
      status,
      reject_reason,
    } = req.body;

    const updateData = {
      title,
      content,
      image_url,
      author_name,
      region_name,
      status,
      reject_reason,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      console.error('UPDATE POST ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error('UPDATE POST SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// Xóa bài viết
exports.deletePost = async (req, res) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      console.error('DELETE POST ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json({ message: 'Xóa bài viết thành công' });
  } catch (err) {
    console.error('DELETE POST SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ======================
// BÀI VIẾT CỦA USER
// ======================

// Lấy bài viết của user
exports.getMyPosts = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'Thiếu user_id' });
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET MY POSTS ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    console.error('GET MY POSTS SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// User tự xóa bài của mình
exports.deleteMyPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'Thiếu user_id' });
    }

    const { data: post, error: findError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    if (String(post.user_id) !== String(user_id)) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('DELETE MY POST ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json({ message: 'Xóa bài viết thành công' });
  } catch (err) {
    console.error('DELETE MY POST SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ======================
// LỌC BÀI VIẾT THEO MIỀN
// ======================

exports.getPostsByRegion = async (req, res) => {
  try {
    const { region } = req.params;

    if (!region) {
      return res.status(400).json({ message: 'Thiếu tên miền' });
    }

    const regionMap = {
      'mien-bac': 'Miền Bắc',
      'mien-trung': 'Miền Trung',
      'mien-nam': 'Miền Nam',
    };

    const regionName = regionMap[region];

    if (!regionName) {
      return res.status(400).json({ message: 'Miền không hợp lệ' });
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('region_name', regionName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET POSTS BY REGION ERROR:', error);
      return res.status(500).json({ message: error.message });
    }

    return res.json(data || []);
  } catch (err) {
    console.error('GET POSTS BY REGION SERVER ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ======================
// SEARCH BÀI VIẾT
// ======================

exports.searchPosts = async (req, res) => {
  try {
    const { keyword = '', page = 1, pageSize = 5 } = req.query;

    const currentPage = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10) || 5;

    const from = (currentPage - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' });

    if (keyword.trim()) {
      const safeKeyword = keyword.trim().replace(/,/g, ' ');
      query = query.or(`title.ilike.%${safeKeyword}%,content.ilike.%${safeKeyword}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({
      items: data || [],
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};