// API Route cho Authentication  
// URL: /api/auth/login

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  handleLogin(req, res);
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Fake user database
    const users = [
      { id: 1, email: 'admin@gmail.com', password: '123456', role: 'admin', name: 'Admin' },
      { id: 2, email: 'user@gmail.com', password: '123456', role: 'user', name: 'User Test' }
    ];

    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email không tồn tại'
      });
    }

    // Check password (trong thực tế nên hash password)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // Generate fake JWT token
    const token = `fake_jwt_token_${user.id}_${Date.now()}`;

    // Return user info (không trả về password)
    const { password: pwd, ...userInfo } = user;

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: userInfo,
        token,
        expiresIn: '24h'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}
