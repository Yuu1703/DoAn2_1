// API Route cho Contact Form
// URL: /api/contact

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Lấy danh sách tin nhắn
      handleGetMessages(req, res);
      break;
      
    case 'POST':
      // Gửi tin nhắn mới
      handlePostMessage(req, res);
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// GET /api/contact - Lấy danh sách tin nhắn
async function handleGetMessages(req, res) {
  try {
    // Fake data - thay bằng database thực
    const messages = [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        message: 'Tôi muốn tư vấn về dịch vụ',
        createdAt: '2024-01-01'
      },
      {
        id: 2,
        name: 'Trần Thị B', 
        email: 'tranthib@gmail.com',
        message: 'Báo giá thiết kế website',
        createdAt: '2024-01-02'
      }
    ];

    res.status(200).json({
      success: true,
      data: messages,
      total: messages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}

// POST /api/contact - Gửi tin nhắn mới
async function handlePostMessage(req, res) {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc',
        errors: {
          name: !name ? 'Tên là bắt buộc' : null,
          email: !email ? 'Email là bắt buộc' : null,
          message: !message ? 'Tin nhắn là bắt buộc' : null
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Simulate saving to database
    const newMessage = {
      id: Date.now(), // Fake ID
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // TODO: Save to database
    console.log('Tin nhắn mới:', newMessage);

    res.status(201).json({
      success: true,
      message: 'Gửi tin nhắn thành công!',
      data: newMessage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}
