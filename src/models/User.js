/**
 * Model User - Định nghĩa cấu trúc dữ liệu User
 */

export class User {
  constructor({ id, name, email, avatar, role = 'user', createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.role = role;
    this.createdAt = createdAt || new Date();
  }

  /**
   * Kiểm tra user có phải admin không
   * @returns {boolean}
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Lấy tên viết tắt
   * @returns {string}
   */
  getInitials() {
    return this.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  /**
   * Chuyển đổi thành object thuần
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
