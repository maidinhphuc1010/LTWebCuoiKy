import { useEffect } from 'react';
import { Form, Input, Button, message, DatePicker } from 'antd';
import { useModel } from 'umi';
import dayjs from 'dayjs';

const StudentAdminForm = ({ onFinish }: { onFinish: () => void }) => {
  const { row, isEdit, addStudent, updateStudent, setVisible, getStudentData } = useModel('studentAdmin');
  const [form] = Form.useForm();

  useEffect(() => {
    if (row) {
      form.setFieldsValue({ ...row, dateOfBirth: dayjs(row.dateOfBirth) });
    } else {
      form.resetFields();
    }
  }, [row, form]);

  const onSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
    };

    if (isEdit && row) {
      updateStudent({ ...formattedValues, studentId: row.studentId });
      message.success('Cập nhật sinh viên thành công');
    } else {
      addStudent(formattedValues);
      message.success('Thêm sinh viên thành công');
    }

    setVisible(false);
    getStudentData();
    onFinish();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} preserve={false}>
      <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Mã sinh viên" name="studentId" rules={[{ required: true }]}>
        <Input readOnly={isEdit} />
      </Form.Item>

      <Form.Item label="Lớp" name="className" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Ngày sinh"
        name="dateOfBirth"
        rules={[
          { required: true, message: 'Vui lòng chọn ngày sinh' },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              const age = dayjs().year() - value.year();
              return age >= 18
                ? Promise.resolve()
                : Promise.reject(new Error('Sinh viên phải đủ 18 tuổi (chỉ tính theo năm)'));
            },
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item
        label="Số CCCD"
        name="cccd"
        rules={[
          { required: true, message: 'Vui lòng nhập số CCCD' },
          {
            pattern: /^\d{12}$/, // Kiểm tra chỉ có 12 chữ số
            message: 'Số CCCD phải có 12 chữ số và không chứa ký tự đặc biệt',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          {isEdit ? 'Lưu' : 'Thêm'}
        </Button>
        <Button onClick={() => setVisible(false)}>Hủy</Button>
      </Form.Item>
    </Form>
  );
};

export default StudentAdminForm;
