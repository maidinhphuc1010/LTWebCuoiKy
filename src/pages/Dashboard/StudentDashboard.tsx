import React, { useEffect, useState } from 'react';
import { Button, Spin } from 'antd';
import { useHistory } from 'umi';
import { fetchUserProfile } from '@/services/User/userAPI'; // Đường dẫn có thể chỉnh lại nếu khác

const StudentDashboard: React.FC = () => {
  const history = useHistory();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    history.push('/auth/login');
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sinh viên:', error);
        handleLogout(); // Nếu lỗi thì đăng xuất
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <Spin size="large" style={{ marginTop: 100 }} />;

  return (
    <div style={{ padding: 20 }}>
      <h1>Student Dashboard</h1>
      <p>Chào mừng <strong>{profile.fullName || profile.name}</strong>!</p>
      <p>Email: {profile.email}</p>
      <p>SĐT: {profile.phoneNumber}</p>
      {profile.studentId && <p>Mã sinh viên: {profile.studentId}</p>}
      <Button type="primary" onClick={handleLogout}>Đăng xuất</Button>
    </div>
  );
};

export default StudentDashboard;
