import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, message, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';
import AdminForm from './AdminForm';

const { confirm } = Modal;

const AdminManagement: React.FC = () => {
  const {
    data,
    getAdminData,
    setRow,
    isEdit,
    setVisible,
    setIsEdit,
    visible,
    deleteAdmin,
  } = useModel('adminManagement');

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAdminData();
  }, []);

  // Hàm xác nhận xóa
  const showDeleteConfirm = (record: Admin.Info) => {
    confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn xóa admin này không?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        deleteAdmin(record.adminId);
        message.success('Xóa admin thành công');
      },
    });
  };

  // Lọc dữ liệu admin theo tên, email hoặc số điện thoại
  const filteredData = data.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.phoneNumber.toLowerCase().includes(search)
    );
  });

  const columns: ColumnsType<Admin.Info> = [
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName', width: 180 },
    { title: 'Mã admin', dataIndex: 'adminId', key: 'adminId', width: 140 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 220 },
    { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 140 },
    { title: 'Số căn cước', dataIndex: 'idCardNumber', key: 'idCardNumber', width: 160 },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', width: 200 },
    { title: 'Mã nhân viên', dataIndex: 'employeeId', key: 'employeeId', width: 160 },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              setVisible(true);
              setRow(record);
              setIsEdit(true);
            }}
          >
            Sửa
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            danger
            onClick={() => showDeleteConfirm(record)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      {/* Nút thêm admin và ô tìm kiếm */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
            setIsEdit(false);
            setRow(null);
          }}
        >
          Thêm admin
        </Button>

        <Input
          placeholder="Tìm theo tên, email hoặc số điện thoại"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        rowKey="adminId"
        dataSource={filteredData} // Dữ liệu được lọc từ danh sách dữ liệu
        columns={columns} // Cột đã được định nghĩa ở trên
        pagination={{ pageSize: 8 }} // Chia trang mỗi 8 dòng
        scroll={{ x: 1000 }} // Kích thước bảng có thể cuộn ngang nếu cần
      />

      <Modal
        title={isEdit ? 'Chỉnh sửa admin' : 'Thêm admin'}
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        destroyOnClose
        width={600}
      >
        <AdminForm
          onFinish={() => {
            setVisible(false);
            getAdminData();
          }}
        />
      </Modal>
    </div>
  );
};

export default AdminManagement;
