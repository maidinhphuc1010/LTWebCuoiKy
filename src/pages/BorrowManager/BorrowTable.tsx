import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BorrowRecord, BorrowStatus } from '../../services/Borrow/typings';
import { statusColors, statusLabels } from '../../services/Borrow/constants';
import dayjs from 'dayjs';

interface BorrowTableProps {
  data: BorrowRecord[];
  status: BorrowStatus | 'all';
  onUpdateStatus: (id: number, status: BorrowStatus, reason?: string) => void;
}

const BorrowTable: React.FC<BorrowTableProps> = ({ data, status, onUpdateStatus }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectingRecord, setRejectingRecord] = useState<BorrowRecord | null>(null);

  const handleApprove = (record: BorrowRecord) => {
    Modal.confirm({
      title: `Duyệt yêu cầu mượn "${record.deviceName}"?`,
      onOk: () => onUpdateStatus(record.id, 'borrowing'),
    });
  };

  const openRejectModal = (record: BorrowRecord) => {
    setRejectingRecord(record);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối');
      return;
    }

    if (rejectingRecord) {
      onUpdateStatus(rejectingRecord.id, 'rejected', rejectReason);
    }

    setRejectReason('');
    setRejectingRecord(null);
    setRejectModalVisible(false);
  };

  const handleReturn = (record: BorrowRecord) => {
    Modal.confirm({
      title: `Đánh dấu thiết bị "${record.deviceName}" đã trả?`,
      onOk: () => onUpdateStatus(record.id, 'returned'),
    });
  };

  const handleSendMail = (record: BorrowRecord) => {
    message.info(`Đã gửi email nhắc nhở cho ${record.student.fullName}`);
  };

  const columns: ColumnsType<BorrowRecord> = [
    { title: 'Họ tên', dataIndex: ['student', 'fullName'], align: 'center' },
    { title: 'Mã SV', dataIndex: ['student', 'code'], align: 'center' },
    { title: 'SĐT', dataIndex: ['student', 'phoneNumber'], align: 'center' },
    { title: 'Thiết bị', dataIndex: 'deviceName', align: 'center' },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      align: 'center',
      render: (date: string) =>
        dayjs(date).isValid() ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Không hợp lệ',
    },
    {
      title: 'Ngày trả',
      dataIndex: 'returnDate',
      align: 'center',
      render: (date: string) =>
        dayjs(date).isValid() ? dayjs(date).format('DD/MM/YYYY') : 'Không hợp lệ',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: (_, record: BorrowRecord) => (
        <Tag color={statusColors[record.status]}>
          {statusLabels[record.status]}
        </Tag>
      ),
    },
  ];

  if (status === 'rejected') {
    columns.push({
      title: 'Lý do từ chối',
      dataIndex: 'rejectReason',
      align: 'center',
      render: (text: string) => text || 'Không có',
    });
  }

  if (status !== 'returned' && status !== 'rejected') {
    columns.push({
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => {
        if (record.status === 'waiting') {
          return (
            <>
              <Button type="link" onClick={() => handleApprove(record)}>Duyệt</Button>
              <Button type="link" danger onClick={() => openRejectModal(record)}>Từ chối</Button>
            </>
          );
        }
        if (record.status === 'borrowing') {
          return <Button type="link" onClick={() => handleReturn(record)}>Đã trả</Button>;
        }
        if (record.status === 'overdue') {
          return <Button type="link" onClick={() => handleSendMail(record)}>Gửi mail</Button>;
        }
        return null;
      },
    });
  }

  return (
    <>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        visible={rejectModalVisible}
        title={`Từ chối yêu cầu mượn "${rejectingRecord?.deviceName}"`}
        onOk={handleRejectConfirm}
        onCancel={() => setRejectModalVisible(false)}
        okText="Từ chối"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={3}
          placeholder="Nhập lý do từ chối"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default BorrowTable;
