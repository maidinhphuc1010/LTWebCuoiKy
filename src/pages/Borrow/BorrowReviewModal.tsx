import React from 'react';
import { Modal, Descriptions } from 'antd';

interface Props {
  visible: boolean;
  device: any;
  returnDate: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const BorrowReviewModal: React.FC<Props> = ({
  visible, device, returnDate, description, onConfirm, onCancel,
}) => {
  if (!device) return null;

  return (
    <Modal
      visible={visible}
      title="Xác nhận thông tin mượn"
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Descriptions bordered>
        <Descriptions.Item label="Thiết bị">{device.name}</Descriptions.Item>
        <Descriptions.Item label="Ngày trả">{returnDate}</Descriptions.Item>
        <Descriptions.Item label="Lý do">{description || '(Không có)'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BorrowReviewModal;
