import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { notification } from 'antd';
import 'moment/locale/vi';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { getIntl, getLocale, history } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import ErrorBoundary from './components/ErrorBoundary';
// import LoadingPage from './components/Loading';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';

/**  loading */
export const initialStateConfig = {
	loading: <></>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * // Tobe removed
 * */
export async function getInitialState(): Promise<IInitialState> {
	return {
		permissionLoading: true,
	};
}

// Tobe removed
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => ({});

/**
 * @see https://beta-pro.ant.design/docs/request-cn
 */
export const request: RequestConfig = {
	errorHandler: (error: ResponseError) => {
		const { messages } = getIntl(getLocale());
		const { response } = error;

		if (response && response.status) {
			const { status, statusText, url } = response;
			const requestErrorMessage = messages['app.request.error'];
			const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
			const errorDescription = messages[`app.request.${status}`] || statusText;
			notification.error({
				message: errorMessage,
				description: errorDescription,
			});
		}

		if (!response) {
			notification.error({
				description: 'Yêu cầu gặp lỗi',
				message: 'Bạn hãy thử lại sau',
			});
		}
		throw error;
	},
	requestInterceptors: [authHeaderInterceptor],
};

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	return {
		unAccessible: (
			<OIDCBounder>
				<TechnicalSupportBounder>
					<NotAccessible />
				</TechnicalSupportBounder>
			</OIDCBounder>
		),
		noFound: <NotFoundContent />,
		rightContentRender: () => <RightContent />,
		disableContentMargin: false,

		footerRender: () => <Footer />,

		onPageChange: () => {
			const location = window.location;
			const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
			const isLoginPage = location.pathname.startsWith('/auth/login');
			if (!currentUser && !isLoginPage) {
				history.replace('/auth/login');
				return;
			}
			// Nếu đã đăng nhập và vào trang gốc thì chuyển hướng theo quyền
			if (currentUser && location.pathname === '/') {
				if (currentUser.role === 'admin') {
					history.replace('/admin/dashboard');
				} else if (currentUser.role === 'user') {
					history.replace('/user-menu/dashboard');
				}
			}
		},

		menuItemRender: (item: any, dom: any) => {
			if (typeof item.onMenuClick === 'function') {
				return (
					<a
						className='not-underline'
						key={item?.path}
						href='#'
						onClick={(e) => {
							e.preventDefault();
							item.onMenuClick();
						}}
						style={{ display: 'block' }}
					>
						{dom}
					</a>
				);
			}
			return (
				<a
					className='not-underline'
					key={item?.path}
					href={item?.path}
					onClick={(e) => {
						e.preventDefault();
						history.push(item?.path ?? '/');
					}}
					style={{ display: 'block' }}
				>
					{dom}
				</a>
			);
		},

		childrenRender: (dom) => (
			<OIDCBounder>
				<ErrorBoundary>
					{/* <TechnicalSupportBounder> */}
					<OneSignalBounder>{dom}</OneSignalBounder>
					{/* </TechnicalSupportBounder> */}
				</ErrorBoundary>
			</OIDCBounder>
		),
		menuHeaderRender: undefined,
		...initialState?.settings,
	};
};
