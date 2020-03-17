import { createHash } from 'crypto';
import an14 from '@mmstudio/an000014';
import an16 from '@mmstudio/an000016';
import { v4 } from 'uuid';

export interface IUserInfo {
	id: string;
	userid: string;
	info: { [key: string]: string };
	sessionid: string;
}

const db = 'sys';

/**
 * 用户登录
 * @param usr 用户名
 * @param psw 密码
 */
export default async function user_login(usr: string, psw: string, ip: string) {
	const sql = `select t1.id as id, t2.identifier as userid, t1.info as info from users as t1 join user_auths as t2 on t1.id=t2.user_id where t2.identity_type='usercode' and t2.identifier='${usr}' and t2.credential='${md5(psw)}'`;
	const [ran14] = await an14<IUserInfo>(db, [sql, []]);
	if (ran14.length === 0) {
		throw new Error(`Could not find user:[${usr}]`);
	}
	await an14<IUserInfo>(db, [`update user_auths set ip='${ip}',last_active=${new Date().getTime()} where identity_type='usercode' and identifier='${usr}'`, []]);
	const sessionid = v4();
	const userinfo = ran14[0];
	userinfo.sessionid = sessionid;
	await an16(sessionid, userinfo);
	return userinfo;
}

/**
 * md5加密
 * @param algorithm 算法 md5
 * @see 文档：<http://nodejs.cn/api/crypto.html#crypto_crypto_createhash_algorithm_options>
 * @param content 内容
 */
function md5(content: string) {
	return createHash('md5').update(content).digest('hex');
}
