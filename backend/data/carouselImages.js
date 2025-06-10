const baseCarouselPath = '/images/carousel'; // Đường dẫn cơ bản tới thư mục ảnh

const carouselImages = [
	{
		id: 1,
		image: `${baseCarouselPath}/device1.jpg`, // Ảnh cho slider 1
		title: 'Quản lý thiết bị dễ dàng', // Tiêu đề của slider
		description: 'Theo dõi, đặt mượn và trả thiết bị chỉ với vài thao tác.', // Mô tả ngắn
		
	},
	{
		id: 2,
		image: `${baseCarouselPath}/device2.jpg`, // Ảnh cho slider 2
		title: 'Thiết bị hiện đại, đa dạng', // Tiêu đề của slider
		description: 'Kho thiết bị phong phú, đáp ứng mọi nhu cầu học tập và sự kiện.', // Mô tả ngắn
		
	},
	{
		id: 3,
		image: `${baseCarouselPath}/device3.jpg`, // Ảnh cho slider 3
		title: 'Đặt mượn nhanh chóng', // Tiêu đề của slider
		description: 'Đăng nhập và gửi yêu cầu mượn thiết bị mọi lúc, mọi nơi.', // Mô tả ngắn
		
	},
];

export default carouselImages;
