import type { IInitialState } from './services/base/typing';
// import { currentRole } from './utils/ip';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: IInitialState) {
	const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
	const role = currentUser?.role;

	return {
		admin: role === 'admin',
		user: role === 'student',
	};
}
