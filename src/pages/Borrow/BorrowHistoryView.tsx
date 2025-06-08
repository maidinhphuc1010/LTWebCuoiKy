import React, { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BorrowRecord, BorrowStatus } from '../../services/Borrow/typings';
import { statusColors, statusLabels } from '../../services/Borrow/constants';
import dayjs from 'dayjs';

const BorrowHistoryView: React.FC = () => {
  const [data, setData] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('borrowData');
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

      if (!currentUser) {
        message.error('Bạn chưa đăng nhập.');
        return;
      }

      if (!raw) {
        message.warning('Chưa có dữ liệu mượn thiết bị.');
        return;
      }

      let allRecords: BorrowRecord[];

      try {
        allRecords = JSON.parse(raw);
      } catch (parseError) {
        console.error('❌ Lỗi khi parse borrowData:', parseError);
        message.error('Dữ liệu lịch sử bị lỗi. Vui lòng thử lại.');
        return;
      }

      const filteredRecords = allRecords.filter(
        (record) => record?.student?.id === currentUser.id
      );

      const sortedRecords = filteredRecords.sort(
        (a, b) => dayjs(b.borrowDate).valueOf() - dayjs(a.borrowDate).valueOf()
      );

      setData(sortedRecords);
    } catch (error) {
      console.error('❌ Lỗi tổng quát khi tải lịch sử mượn:', error);
      message.error('Đã xảy ra lỗi khi tải dữ liệu.');
    }
  }, []);

  const columns: ColumnsType<BorrowRecord> = [
    {
      title: 'STT',
      dataIndex: 'id',
      width: 60,
      align: 'center',
    },
    {
      title: 'Thiết bị',
      dataIndex: 'deviceName',
      align: 'center',
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      align: 'center',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Ngày trả dự kiến',
      dataIndex: 'returnDate',
      align: 'center',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày trả thực tế',
      dataIndex: 'actualReturnDate',
      align: 'center',
      render: (date?: string) => (date ? dayjs(date).format('DD/MM/YYYY') : '—'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: (status: BorrowStatus) => (
        <Tag color={statusColors[status] || 'default'}>
          {statusLabels[status] || status}
        </Tag>
      ),
    },
    {
      title: 'Lý do từ chối',
      dataIndex: 'rejectReason',
      align: 'center',
      render: (_: any, record) =>
        record.status === 'rejected' ? record.rejectReason || 'Không có lý do' : '—',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      render: (text?: string) => text || '—',
    },
    {
      title: 'File đính kèm',
      dataIndex: 'attachmentName',
      align: 'center',
      render: (_: any, record) =>
        record.attachmentUrl ? (
          <a href={record.attachmentUrl} target="_blank" rel="noopener noreferrer">
            {record.attachmentName || 'Tải xuống'}
          </a>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Lịch sử mượn thiết bị của bạn
      </h2>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BorrowHistoryView;
