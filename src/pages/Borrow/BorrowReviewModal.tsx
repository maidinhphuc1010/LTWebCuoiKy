import React, { useEffect, useState } from 'react';
import { Modal, Descriptions } from 'antd';

interface BorrowReviewModalProps {
  visible: boolean;
  device: Device.Info;
  returnDate: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const BorrowReviewModal: React.FC<BorrowReviewModalProps> = ({
  visible,
  device,
  returnDate,
  description,
  onConfirm,
  onCancel,
}) => {
  const [student, setStudent] = useState<{
    id: number;
    fullName: string;
    code: string;
    email?: string;
    phoneNumber?: string;
  } | null>(null);

  useEffect(() => {
    // Lấy thông tin sinh viên từ localStorage khi component được render
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.role === 'student') {
      setStudent({
        id: currentUser.id,
        fullName: currentUser.fullName,
        code: currentUser.code,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
      });
    }
  }, []);

  if (!student) {
    return null; // Chưa có thông tin sinh viên, không render modal
  }

  return (
    <Modal
      visible={visible}
      title="Xác nhận thông tin mượn thiết bị"
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Gửi yêu cầu"
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Tên sinh viên">{student.fullName}</Descriptions.Item>
        <Descriptions.Item label="Mã sinh viên">{student.code}</Descriptions.Item>
        {student.email && (
          <Descriptions.Item label="Email">{student.email}</Descriptions.Item>
        )}
        {student.phoneNumber && (
          <Descriptions.Item label="Số điện thoại">{student.phoneNumber}</Descriptions.Item>
        )}
        <Descriptions.Item label="Thiết bị">{device.name}</Descriptions.Item>
        <Descriptions.Item label="Đơn vị quản lý">{device.department}</Descriptions.Item>
        <Descriptions.Item label="Ngày trả dự kiến">{returnDate}</Descriptions.Item>
        <Descriptions.Item label="Lý do mượn">{description || '(Không có)'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BorrowReviewModal;
