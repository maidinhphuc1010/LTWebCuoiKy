import React from 'react';
import { Button } from 'antd';
import { useHistory } from 'umi';

const AdminDashboard: React.FC = () => {
  const history = useHistory();

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Xóa thông tin người dùng
    history.push('/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Chào mừng Admin!</p>
      <Button type="primary" onClick={handleLogout}>Đăng xuất</Button>
    </div>
  );
};

export default AdminDashboard;
