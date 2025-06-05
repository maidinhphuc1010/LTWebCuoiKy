import { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useModel } from 'umi';

const AdminForm = ({ onFinish }: { onFinish: () => void }) => {
  const { row, isEdit, addAdmin, updateAdmin, setVisible, getAdminData, data } = useModel('adminManagement');
  const [form] = Form.useForm();

  useEffect(() => {
    if (row) {
      form.setFieldsValue(row);
    } else {
      form.resetFields();
    }
  }, [row, form]);

  const onSubmit = (values: any) => {
    // Kiểm tra trùng số căn cước
    const isIdCardExist = data.some((item) => item.idCardNumber === values.idCardNumber && (!row || item.adminId !== row.adminId));
    if (isIdCardExist) {
      message.error('Số căn cước đã tồn tại!');
      return;
    }

    // Tạo mã nhân viên (employeeId) từ 4 chữ số cuối của số căn cước công dân
    const employeeId = `AD${values.idCardNumber.slice(-4)}`;

    // Tạo mã admin từ "ADMIN" cộng với số điện thoại
    const adminId = isEdit && row ? row.adminId : `ADMIN${values.phoneNumber}`;

    const formattedValues = {
      ...values,
      employeeId, // Gán mã nhân viên
      adminId, // Gán mã admin
    };

    if (isEdit && row) {
      updateAdmin({ ...formattedValues, adminId: row.adminId });
      message.success('Cập nhật admin thành công');
    } else {
      addAdmin(formattedValues);
      message.success('Thêm admin thành công');
    }

    setVisible(false);
    getAdminData();
    onFinish();
  };

  // Cập nhật lại validateIdCardNumber để phù hợp với Ant Design
  const validateIdCardNumber = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập số căn cước'));
    }
    const regex = /^\d{12}$/;  // Kiểm tra có đúng 12 chữ số không
    if (!regex.test(value)) {
      return Promise.reject(new Error('Số căn cước phải có 12 chữ số'));
    }
    return Promise.resolve();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {/* Bỏ trường mã admin */}
      {/* <Form.Item label="Mã admin" name="adminId" rules={[{ required: true }]} >
        <Input readOnly={isEdit} />
      </Form.Item> */}

      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Số căn cước" name="idCardNumber" rules={[{ required: true }, { validator: validateIdCardNumber }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Địa chỉ" name="address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {/* Bỏ trường mã nhân viên */}
      {/* <Form.Item label="Mã nhân viên" name="employeeId" rules={[{ required: true }]}>
        <Input readOnly />
      </Form.Item> */}

      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Lưu' : 'Thêm'}
        </Button>
        <Button onClick={() => setVisible(false)} style={{ marginLeft: 8 }}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminForm;
