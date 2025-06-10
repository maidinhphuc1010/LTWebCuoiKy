import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Input, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import BorrowConfirmModal from './BorrowConfirmModal';
import BorrowReviewModal from './BorrowReviewModal';
import useBorrowDevice from '../../models/useBorrowDevice';

const DeviceUserView: React.FC = () => {
  const { data, getDataDevice } = useModel('deviceAdmin');
  const [descVisible, setDescVisible] = useState(false);
  const [descContent, setDescContent] = useState('');
  const [descTitle, setDescTitle] = useState<{ name: string; department: string } | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [borrowInfo, setBorrowInfo] = useState<{ returnDate: string; description?: string } | null>(null);

  const { handleQuickBorrow, loadingId } = useBorrowDevice(getDataDevice);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (storedUser?.role === 'student') {
      // có thể lưu để hiển thị nếu cần
    }
    getDataDevice();
  }, [getDataDevice]);

  const showDescription = (record: any) => {
    setDescContent(record.description);
    setDescTitle({ name: record.name, department: record.department });
    setDescVisible(true);
  };

  const onBorrowClick = (record: any) => {
    setSelectedDevice(record);
    setConfirmVisible(true);
  };

  const onConfirm = (info: { returnDate: string; description?: string }) => {
    setBorrowInfo(info);
    setConfirmVisible(false);
    setReviewVisible(true);
  };

  const onReviewConfirm = async () => {
    if (!selectedDevice || !borrowInfo) return;
    try {
      await handleQuickBorrow(selectedDevice.name, borrowInfo);
      setReviewVisible(false);
      setSelectedDevice(null);
      setBorrowInfo(null);
    } catch (error: any) {
      message.error(error.message || 'Lỗi mượn thiết bị');
    }
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<any> = [
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Đơn vị quản lý', dataIndex: 'department', key: 'department' },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record) => {
        const shortDesc = text.length > 50 ? text.slice(0, 40) + '...' : text;
        return (
          <>
            {shortDesc}{' '}
            {text.length > 30 && (
              <EyeOutlined
                style={{ cursor: 'pointer', color: '#1890ff' }}
                onClick={() => showDescription(record)}
              />
            )}
          </>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          loading={loadingId === record.name}
          onClick={() => onBorrowClick(record)}
        >
          Mượn ngay
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo tên thiết bị"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table rowKey="id" dataSource={filteredData} columns={columns} pagination={{ pageSize: 8 }} />

      <Modal visible={descVisible} title="Mô tả chi tiết" footer={null} onCancel={() => setDescVisible(false)}>
        {descTitle && (
          <p>
            <strong>Thiết bị {descTitle.name} do {descTitle.department} quản lý</strong>
          </p>
        )}
        <p style={{ whiteSpace: 'pre-wrap' }}>{descContent}</p>
      </Modal>

      <BorrowConfirmModal
        visible={confirmVisible}
        device={selectedDevice}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={onConfirm}
      />

      <BorrowReviewModal
        visible={reviewVisible}
        device={selectedDevice}
        returnDate={borrowInfo?.returnDate || ''}
        description={borrowInfo?.description}
        onCancel={() => setReviewVisible(false)}
        onConfirm={onReviewConfirm}
      />
    </div>
  );
};

export default DeviceUserView;
