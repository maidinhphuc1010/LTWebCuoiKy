import { Form, Input, Button, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormAdmin = () => {
  const [form] = Form.useForm();
  const {
    current,
    isEdit,
    setVisible,
    handleCreate,
    handleUpdate,
  } = useModel('admin');

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue(current);
    } else {
      form.resetFields();
    }
  }, [current, isEdit]);

  const onFinish = async (values: any) => {
    console.log('🚀 Sending values:', values); // giúp bạn kiểm tra dữ liệu thật sự
    try {
      if (isEdit) {
        await handleUpdate(values);
      } else {
        await handleCreate(values);
      }
      message.success(isEdit ? 'Cập nhật thành công' : 'Tạo mới thành công');
      setVisible(false);
    } catch (err: any) {
      console.error('❌ Lỗi khi xử lý:', err);
      message.error(err?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="adminId"
        label="Mã Admin"
        rules={[{ required: true, message: 'Phải điền mã Admin' }]}
      >
        <Input disabled={isEdit} />
      </Form.Item>

      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[{ required: true, message: 'Phải điền tên đầy đủ' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Phải điền email' },
          { type: 'email', message: 'Email không đúng định dạng' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Số điện thoại"
        rules={[{ required: true, message: 'Phải điền số điện thoại' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="idCardNumber"
        label="CCCD (sử dụng làm mật khẩu)"
        rules={[{ required: true, message: 'Phải điền CCCD' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="address" label="Địa chỉ">
        <Input />
      </Form.Item>

      {/* backend tự sinh employeeId, không cần nhập */}
      <Form.Item name="employeeId" hidden>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEdit ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAdmin;
