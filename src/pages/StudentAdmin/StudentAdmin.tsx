import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, message, Input } from 'antd';
import { useModel } from 'umi';
import StudentAdminForm from './StudentAdminForm';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { confirm } = Modal;

const StudentAdmin: React.FC = () => {
  const {
    data,
    getStudentData,
    setRow,
    isEdit,
    setVisible,
    setIsEdit,
    visible,
    deleteStudent,
  } = useModel('studentAdmin');

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getStudentData();
  }, []);

  const showDeleteConfirm = (record: Student.Info) => {
    confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn xóa sinh viên này không?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        deleteStudent(record.studentId);
        message.success('Xóa sinh viên thành công');
      },
    });
  };

  // ✅ Lọc theo họ tên, email, sđt
  const filteredData = data.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.phoneNumber.toLowerCase().includes(search)
    );
  });

  const columns: ColumnsType<Student.Info> = [
    { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName', width: 180 },
    { title: 'Mã sinh viên', dataIndex: 'studentId', key: 'studentId', width: 140 },
    { title: 'Lớp', dataIndex: 'className', key: 'className', width: 120 },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 220 },
    { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber', width: 140 },
    { title: 'Số CCCD', dataIndex: 'cccd', key: 'cccd', width: 180 },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 120,
      render: (_, record) => (
        <span>{dayjs(record.dateOfBirth).format('YYYY-MM-DD')}</span> // Hiển thị ngày sinh ở định dạng YYYY-MM-DD
      ),
    },
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
      {/* Nút + ô tìm kiếm cùng hàng */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
            setIsEdit(false);
            setRow(null);
          }}
        >
          Thêm sinh viên
        </Button>

        <Input
          placeholder="Tìm theo tên, email hoặc số điện thoại"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        rowKey="studentId"
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={isEdit ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên'}
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        destroyOnClose
        width={600}
      >
        <StudentAdminForm
          onFinish={() => {
            setVisible(false);
            getStudentData();
          }}
        />
      </Modal>
    </div>
  );
};

export default StudentAdmin;
