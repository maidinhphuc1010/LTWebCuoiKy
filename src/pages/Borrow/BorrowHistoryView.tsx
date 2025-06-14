import React, { useEffect, useState } from 'react';
import { Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { BorrowRecord, BorrowStatus } from '../../services/Borrow/typings';
import { statusColors, statusLabels } from '../../services/Borrow/constants';
import { fetchMyBorrowHistory } from '../../services/Borrow/borrowAPI'; // ⬅️ Gọi API ở đây
import dayjs from 'dayjs';

const BorrowHistoryView: React.FC = () => {
  const [data, setData] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const history = await fetchMyBorrowHistory();
        const sorted = history.sort(
          (a, b) => dayjs(b.borrowDate).valueOf() - dayjs(a.borrowDate).valueOf()
        );
        setData(sorted);
      } catch (error) {
        message.error('Không thể tải lịch sử mượn thiết bị.');
        console.error('Lỗi khi gọi API lịch sử mượn:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: ColumnsType<BorrowRecord> = [
    { title: 'ID', dataIndex: 'id', width: 60, align: 'center' },
    { title: 'Sinh viên', dataIndex: ['student', 'fullName'], align: 'center' },
    { title: 'Mã SV', dataIndex: ['student', 'code'], align: 'center' },
    { title: 'Thiết bị', dataIndex: 'deviceName', align: 'center' },
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
  ];

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Lịch sử mượn thiết bị</h2>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </div>
  );
};

export default BorrowHistoryView;
