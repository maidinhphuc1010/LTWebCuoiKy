import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { changePassword } from '../../services/Auth/authService'; // Đảm bảo đường dẫn đúng

const ChangePasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleChangePassword = async (values: { currentPassword: string; newPassword: string }) => {
    setLoading(true);

    try {
      const response = await changePassword(values);
      message.success(response.data.message);
      setVisible(false); // Close the modal on success
    } catch (error) {
      message.error('Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Đổi mật khẩu
      </Button>

      <Modal
        title="Đổi mật khẩu"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose={true}
      >
        <Form onFinish={handleChangePassword} layout="vertical">
          <Form.Item label="Mật khẩu hiện tại" name="currentPassword" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordPage;
