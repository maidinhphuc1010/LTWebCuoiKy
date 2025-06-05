import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useHistory } from 'umi';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user) {
      history.push(user.role === 'admin' ? '/admin/dashboard' : '/user-menu/dashboard');
    }
  }, [history]);

  const handleLogin = (values: { identifier: string; cccd: string }) => {
    setLoading(true);

    // Lấy dữ liệu người dùng từ localStorage
    const adminData = JSON.parse(localStorage.getItem('adminData') || '[]');
    const studentData = JSON.parse(localStorage.getItem('studentData') || '[]');

    // Kiểm tra dữ liệu adminData và studentData có hợp lệ không
    console.log('Admin Data:', adminData);
    console.log('Student Data:', studentData);

    // Kiểm tra xem dữ liệu có tồn tại không
    if (!Array.isArray(adminData) || !Array.isArray(studentData)) {
      message.error('Dữ liệu không hợp lệ.');
      setLoading(false);
      return;
    }

    // Tìm người dùng admin
    const adminUser = adminData.find((u) => {
      return (
        (u.email === values.identifier ||
          u.phoneNumber === values.identifier ||
          u.employeeId === values.identifier) &&
        u.idCardNumber === values.cccd
      );
    });

    // Tìm người dùng student
    const studentUser = studentData.find((u) => {
      return (
        (u.email === values.identifier ||
          u.phoneNumber === values.identifier ||
          u.studentId === values.identifier) &&
        u.cccd === values.cccd
      );
    });

    // Xử lý nếu tìm thấy người dùng
    if (adminUser) {
      message.success('Đăng nhập thành công với tư cách Admin');
      localStorage.setItem('currentUser', JSON.stringify({ ...adminUser, role: 'admin' }));
      history.push('/admin/dashboard');
    } else if (studentUser) {
      message.success('Đăng nhập thành công với tư cách Sinh viên');
      localStorage.setItem('currentUser', JSON.stringify({
        id: studentUser.studentId,
        fullName: studentUser.fullName,
        email: studentUser.email,
        phoneNumber: studentUser.phoneNumber,
        cccd: studentUser.cccd,
        code: studentUser.studentId,  // Mã sinh viên
        role: 'student',
      }));
      history.push('/user-menu/dashboard');
    } else {
      message.error('Sai tài khoản hoặc mật khẩu');
    }
    setLoading(false);
  };

  return (
    <Form onFinish={handleLogin} layout="vertical" style={{ maxWidth: 400, margin: '100px auto' }}>
      <Form.Item label="Nhập thông tin (Email, Số điện thoại, Mã nhân viên, Mã sinh viên)" name="identifier" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Căn cước công dân (Mật khẩu)" name="cccd" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
