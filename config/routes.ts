export default [
	{
		path: '/auth',
		layout: false,
		routes: [
			{
				path: '/auth/login',
				layout: false,
				name: 'Đăng nhập',
				component: './Auth/Login',
			},
			{
				path: '/auth',
				redirect: '/auth/login',
			},
		],
	},
	// Đưa dashboard admin và dashboard user lên đầu menu
	{
		path: '/admin/dashboard',
		name: 'Dashboard Admin',
		icon: 'DashboardOutlined',
		component: './Dashboard/AdminDashboard',
		access: 'admin',
	},
	{
		path: '/user-menu/dashboard',
		name: 'Dashboard Sinh viên',
		icon: 'DashboardOutlined',
		component: './Dashboard/StudentDashboard',
		access: 'user',
	},
	///////////////////////////////////
	// DEFAULT MENU
	// {
	// 	path: '/dashboard',
	// 	name: 'Dashboard',
	// 	component: './TrangChu',
	// 	icon: 'HomeOutlined',
	// 	access: 'admin||user',
	// },
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
		access: 'admin||user',
	},
	// {
	// 	path: '/random-user',
	// 	name: 'RandomUser',
	// 	component: './RandomUser',
	// 	icon: 'ArrowsAltOutlined',
	// 	access: 'admin||user',
	// }
	{
		path: '/borrow-history',
		name: 'Lịch sử mượn thiết bị',
		icon: 'HistoryOutlined',
		component: './Borrow/BorrowHistoryView',
		access: 'user',
	},
	{
		path: '/sinh-vien',
		name: 'Quản lý sinh viên',
		icon: 'TeamOutlined',
		component: './StudentAdmin/StudentAdmin',
		access: 'admin',
	},
	{
		path: '/quan-ly-thiet-bi',
		name: 'Quản lý thiết bị',
		icon: 'DatabaseOutlined',
		component: './DeviceAdmin/DeviceAdmin',
		access: 'admin',
	},
	{
		path: '/quan-ly-muon-tra',
		name: 'Quản lý mượn trả',
		icon: 'SolutionOutlined',
		component: './BorrowManager/BorrowManagerTabs',
		access: 'admin',
	},
	{
		path: '/muon-thiet-bi',
		name: 'Mượn thiết bị',
		icon: 'TabletOutlined',
		component: './Borrow/DeviceUserView',
		access: 'user',
	},
	{
		path: '/admin',
		name: 'Quản lý admin',
		icon: 'UserOutlined',
		component: './admin/AdminManagement',
		access: 'admin',
	},
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
		access: 'admin||user',
	},
	{
		path: '/',
		redirect: '/auth/login',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
