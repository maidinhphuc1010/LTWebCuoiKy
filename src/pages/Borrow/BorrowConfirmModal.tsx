import React from 'react';
import { Modal, Input, DatePicker, Form, message } from 'antd';

interface BorrowConfirmModalProps {
  visible: boolean;
  device: Device.Info | null;
  onCancel: () => void;
  onConfirm: (values: {
    returnDate: string;
    description?: string;
  }) => void;
}

const BorrowConfirmModal: React.FC<BorrowConfirmModalProps> = ({
  visible,
  device,
  onCancel,
  onConfirm,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm({
        ...values,
        returnDate: values.returnDate.format('YYYY-MM-DD'),
      });
      form.resetFields();
    } catch {
      message.error('Vui lòng điền đầy đủ thông tin hợp lệ');
    }
  };

  return (
    <Modal
      visible={visible}
      title={`Xác nhận mượn: ${device?.name}`}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Xác nhận mượn"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Ngày hẹn trả"
          name="returnDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày trả' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Lý do mượn" name="description">
          <Input.TextArea rows={3} placeholder="Nhập lý do mượn thiết bị..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BorrowConfirmModal;
