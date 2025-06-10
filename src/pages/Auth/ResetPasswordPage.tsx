// src/pages/Auth/ResetPasswordPage.tsx

import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { resetPassword } from '../../services/Auth/authService';

const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleResetPassword = async (values: { token: string; newPassword: string }) => {
    setLoading(true);

    try {
      const response = await resetPassword(values);
      message.success(response.data.message);
      setVisible(false); // Close the modal on success
    } catch (error) {
      message.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Đặt lại mật khẩu
      </Button>

      <Modal
        title="Đặt lại mật khẩu"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose={true}
      >
        <Form onFinish={handleResetPassword} layout="vertical">
          <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ResetPasswordPage;
