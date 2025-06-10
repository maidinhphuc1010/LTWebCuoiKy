import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { forgotPassword } from '../../services/Auth/authService';

interface ForgotPasswordPageProps {
  onClose: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (email: string) => {
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      message.success(response.data.message);
      onClose(); // Close the modal on success
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Quên mật khẩu"
      visible={true}
      onCancel={onClose}
      footer={null}
      destroyOnClose={true}
    >
      <Form onFinish={(values) => handleForgotPassword(values.email)} layout="vertical">
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForgotPasswordPage;
