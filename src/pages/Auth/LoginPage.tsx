import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { login } from '../../services/Auth/authService';
import { useHistory } from 'umi'; // Correct import for umi routing
import ForgotPasswordPage from './ForgotPasswordPage'; // Import Forgot Password Modal

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Automatically redirect if the user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (user) {
      history.push(user.role === 'admin' ? '/admin/dashboard' : '/user-menu/dashboard');
    }
  }, [history]);

  const handleLogin = async (values: { identifier: string; cccd: string }) => {
    setLoading(true);

    try {
      const response = await login(values.identifier, values.cccd);
      const { _id, fullName, email, role, token } = response.data;

      // Store user data in localStorage and redirect to the appropriate dashboard
      localStorage.setItem('currentUser', JSON.stringify({
        _id,
        fullName,
        email,
        role,
        token,
      }));

      message.success(`Đăng nhập thành công với tư cách ${role === 'admin' ? 'Admin' : 'Sinh viên'}`);
      history.push(role === 'admin' ? '/admin/dashboard' : '/user-menu/dashboard');
    } catch (error) {
      message.error('Sai tài khoản hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Form onFinish={handleLogin} layout="vertical">
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
        <Form.Item>
          <Button type="link" onClick={() => setShowForgotPassword(true)} block>
            Quên mật khẩu?
          </Button>
        </Form.Item>
      </Form>

      {/* Show ForgotPasswordModal when clicked */}
      {showForgotPassword && (
        <ForgotPasswordPage onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default LoginPage;
