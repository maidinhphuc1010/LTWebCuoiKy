import type { ColumnsType } from 'antd/es/table';
import { Button, Modal, Table } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormAdmin from './FormAdmin';

const AdminManagement = () => {
  const {
    data,
    getDataAdmin,
    setVisible,
    visible,
    setCurrent,
    setIsEdit,
    isEdit,
    handleDelete,
  } = useModel('admin');

  useEffect(() => {
    getDataAdmin();
  }, []);

  const columns: ColumnsType<Admin.Info> = [
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Mã Admin', dataIndex: 'adminId', key: 'adminId' },
    { title: 'Mã nhân viên', dataIndex: 'employeeId', key: 'employeeId' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              setIsEdit(true);
              setCurrent(record);
              setVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record.adminId)}
            style={{ marginLeft: 8 }}
          >
            Xoá
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Admin</h2>
      <Button
        type="primary"
        onClick={() => {
          setIsEdit(false);
          setCurrent({});
          setVisible(true);
        }}
      >
        Thêm Admin
      </Button>
      <Table
        rowKey="_id"
        dataSource={data}
        columns={columns}
        pagination={false}
        style={{ marginTop: 20 }}
      />
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
        title={isEdit ? 'Sửa Admin' : 'Thêm Admin'}
      >
        <FormAdmin />
      </Modal>
    </div>
  );
};

export default AdminManagement;
