// API Route cho Users
// URL: /api/users

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      handleGetUsers(req, res);
      break;
      
    case 'POST':
      handleCreateUser(req, res);
      break;
      
    case 'PUT':
      handleUpdateUser(req, res);
      break;
      
    case 'DELETE':
      handleDeleteUser(req, res);
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// GET /api/users - Lấy danh sách users
async function handleGetUsers(req, res) {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Fake data
    let users = [
      { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'admin' },
      { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', role: 'user' },
      { id: 3, name: 'Lê Văn C', email: 'c@gmail.com', role: 'user' }
    ];

    // Search filter
    if (search) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: paginatedUsers,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(users.length / limit),
        count: users.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}

// POST /api/users - Tạo user mới
async function handleCreateUser(req, res) {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Simulate creating user
    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: newUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}

// PUT /api/users - Cập nhật user
async function handleUpdateUser(req, res) {
  try {
    const { id, name, email, role } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID user là bắt buộc'
      });
    }

    // Simulate update
    const updatedUser = {
      id: parseInt(id),
      name,
      email,
      role,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công',
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}

// DELETE /api/users - Xóa user
async function handleDeleteUser(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID user là bắt buộc'
      });
    }

    // Simulate delete
    res.status(200).json({
      success: true,
      message: `Đã xóa user ID: ${id}`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}
