import React from 'react';
import { Modal, Form, DatePicker, Input, message } from 'antd';

interface Props {
  visible: boolean;
  device: any;
  onCancel: () => void;
  onConfirm: (values: { returnDate: string; description?: string }) => void;
}

const BorrowConfirmModal: React.FC<Props> = ({ visible, device, onCancel, onConfirm }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      onConfirm({
        returnDate: vals.returnDate.format('YYYY-MM-DD'),
        description: vals.description,
      });
      form.resetFields();
    } catch {
      message.error('Vui lòng nhập đầy đủ thông tin hợp lệ');
    }
  };

  return (
    <Modal
      visible={visible}
      title={`Mượn thiết bị: ${device?.name}`}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Tiếp tục"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Ngày trả"
          name="returnDate"
          rules={[{ required: true, message: 'Chọn ngày trả' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Lý do mượn" name="description">
          <Input.TextArea rows={3} placeholder="Nhập lý do (không bắt buộc)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BorrowConfirmModal;
