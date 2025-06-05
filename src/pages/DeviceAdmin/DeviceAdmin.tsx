import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, message, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';
import DeviceAdminForm from './DeviceAdminForm';

const { confirm } = Modal;

const DeviceAdmin: React.FC = () => {
	const {
		data,
		getDataDevice,
		setRow,
		isEdit,
		setVisible,
		setIsEdit,
		visible,
		deleteDevice,
	} = useModel('deviceAdmin');

	const [descVisible, setDescVisible] = useState(false);
	const [descContent, setDescContent] = useState<string>('');
	const [descTitle, setDescTitle] = useState<{ name: string; department: string } | null>(null);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		getDataDevice();
	}, []);

	const showDeleteConfirm = (record: Device.Info) => {
		confirm({
			title: 'Xác nhận',
			content: 'Bạn có chắc chắn muốn xóa thiết bị này không?',
			okText: 'Có',
			okType: 'danger',
			cancelText: 'Không',
			onOk() {
				deleteDevice(record.id);
				message.success('Xóa thiết bị thành công');
			},
		});
	};

	const showDescription = (record: Device.Info) => {
		setDescContent(record.description);
		setDescTitle({ name: record.name, department: record.department });
		setDescVisible(true);
	};

	const columns: ColumnsType<Device.Info> = [
		{
			title: 'Tên thiết bị',
			dataIndex: 'name',
			key: 'name',
			width: 180,
			filteredValue: searchText ? [searchText] : null,
			onFilter: (value, record) =>
				record.name.toLowerCase().includes((value as string).toLowerCase()),
		},
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
			{/* Nút và ô tìm kiếm nằm trên cùng 1 hàng */}
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
				<Button
					type='primary'
					onClick={() => {
						setVisible(true);
						setIsEdit(false);
						setRow(null);
					}}
				>
					Thêm thiết bị
				</Button>

				<Input
					placeholder='Tìm theo tên thiết bị'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
				/>
			</div>

			<Table
				rowKey='id'
				dataSource={data}
				columns={columns}
				pagination={{ pageSize: 8 }}
				scroll={{ x: 1000 }}
			/>

			<Modal
				title={isEdit ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị'}
				visible={visible}
				footer={null}
				onCancel={() => setVisible(false)}
				destroyOnClose
				width={600}
			>
				<DeviceAdminForm
					onFinish={() => {
						setVisible(false);
						getDataDevice();
					}}
				/>
			</Modal>

			<Modal
				visible={descVisible}
				footer={null}
				onCancel={() => setDescVisible(false)}
				title='Mô tả chi tiết'
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
		</div>
	);
};

export default DeviceAdmin;
