import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import BorrowConfirmModal from './BorrowConfirmModal';
import BorrowReviewModal from './BorrowReviewModal';

const DeviceUserView: React.FC = () => {
  const { data, getDataDevice, sendBorrowRequest } = useModel('deviceAdmin');

  const [descVisible, setDescVisible] = useState(false);
  const [descContent, setDescContent] = useState('');
  const [descTitle, setDescTitle] = useState<{ name: string; department: string } | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device.Info | null>(null);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [borrowInfo, setBorrowInfo] = useState<{
    returnDate: string;
    description?: string;
  } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    fullName: string;
    code: string;
    email?: string;
    phoneNumber?: string;
  } | null>(null);

  useEffect(() => {
    // Lấy thông tin sinh viên từ localStorage sau khi đăng nhập
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (storedUser && storedUser.role === 'student') {
      setCurrentUser({
        id: storedUser.id,
        fullName: storedUser.fullName,
        code: storedUser.code,
        email: storedUser.email,
        phoneNumber: storedUser.phoneNumber,
      });
    }

    // Lấy dữ liệu thiết bị
    getDataDevice();
  }, []);

  const showDescription = (record: Device.Info) => {
    setDescContent(record.description);
    setDescTitle({ name: record.name, department: record.department });
    setDescVisible(true);
  };

  const handleConfirmBorrow = (formValues: { returnDate: string; description?: string }) => {
    setBorrowInfo(formValues);
    setReviewVisible(true);
  };

  const handleFinalConfirm = async () => {
    if (!selectedDevice || !borrowInfo) {
      Modal.error({
        title: 'Lỗi',
        content: 'Chưa chọn thiết bị hoặc thiếu thông tin mượn.',
      });
      return;
    }

    setLoadingId(selectedDevice.id);

    try {
      await sendBorrowRequest({
        deviceId: selectedDevice.id,
        deviceName: selectedDevice.name,
        status: 'waiting',
        returnDate: borrowInfo.returnDate,
        description: borrowInfo.description,
      });

      Modal.success({
        title: 'Gửi yêu cầu thành công',
        content: `Yêu cầu mượn thiết bị "${selectedDevice.name}" đã được gửi.`,
      });

      getDataDevice(); // Cập nhật lại dữ liệu thiết bị sau khi yêu cầu mượn
    } catch (error) {
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể gửi yêu cầu. Vui lòng thử lại.',
      });
    } finally {
      setConfirmVisible(false);
      setReviewVisible(false);
      setLoadingId(null);
    }
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Device.Info> = [
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name', width: 180 },
    { title: 'Loại thiết bị', dataIndex: 'type', key: 'type', width: 140 },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: 'Đơn vị quản lý', dataIndex: 'department', key: 'department', width: 160 },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (text: string, record) => {
        const shortDesc = text.length > 50 ? text.slice(0, 40) + '...' : text;
        return (
          <>
            <span>{shortDesc} </span>
            {text.length > 30 && (
              <EyeOutlined
                style={{ color: '#1890ff', cursor: 'pointer' }}
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
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          loading={loadingId === record.id}
          onClick={() => {
            if (record.quantity === 0) {
              Modal.warning({
                title: 'Không thể mượn thiết bị',
                content: `Thiết bị "${record.name}" hiện không còn số lượng để cho mượn.`,
              });
              return;
            }
            setSelectedDevice(record);
            setConfirmVisible(true);
          }}
        >
          Mượn ngay
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Ô tìm kiếm nằm phía trên bên phải */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo tên thiết bị"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        rowKey="id"
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        visible={descVisible}
        footer={null}
        onCancel={() => setDescVisible(false)}
        title="Mô tả chi tiết"
        destroyOnClose
        width={500}
      >
        {descTitle && (
          <p>
            <strong>
              Thiết bị {descTitle.name} do {descTitle.department} quản lý
            </strong>
          </p>
        )}
        <p style={{ whiteSpace: 'pre-wrap' }}>{descContent}</p>
      </Modal>

      <BorrowConfirmModal
        visible={confirmVisible}
        device={selectedDevice}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmBorrow}
      />

      {/* Chỉ hiển thị BorrowReviewModal khi currentUser có giá trị */}
      {selectedDevice && borrowInfo && currentUser && (
        <BorrowReviewModal
          visible={reviewVisible}
          device={selectedDevice}
          student={currentUser} // Truyền thông tin sinh viên từ localStorage
          returnDate={borrowInfo.returnDate}
          description={borrowInfo.description}
          onCancel={() => setReviewVisible(false)}
          onConfirm={handleFinalConfirm}
        />
      )}
    </div>
  );
};

export default DeviceUserView;
