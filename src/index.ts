import { createHash } from 'crypto';
import an36 from '@mmstudio/an000036';
import config from '@mmstudio/config';
import { sign } from 'jsonwebtoken';
import anylogger from 'anylogger';

const logger = anylogger('@mmstudio/an000029');

const session = config.session as {
	secret: string;
	expiresIn: string | number;
};

export interface IUserInfo {
	id: string;
	userid: string;
	info: { [key: string]: string; };
}

/**
 * 用户登录
 */
export default async function user_login(type: 'user' | 'phone', usr: string, psw: string, ip: string) {
	logger.debug('userlogin', usr);
	const sql = 'select t1.id as id, t2.identifier as userid, t1.info as info from mm_users as t1 join mm_user_auths as t2 on t1.id=t2.user_id where t2.identity_type=$1 and t2.identifier=$2 and t2.credential=$3';
	const [ran36] = await an36<IUserInfo>([sql, [type, usr, md5(psw)]]);
	if (ran36.length === 0) {
		throw new Error(`Could not find user:[${usr}]`);
	}
	await an36<IUserInfo>(['update mm_user_auths set ip=$1,last_active=$2 where identity_type=$3 and identifier=$4', [ip, new Date().getTime(), type, usr]]);
	const userinfo = ran36[0];
	const token = sign(userinfo, session.secret, { expiresIn: session.expiresIn, algorithm: 'HS256' });
	logger.debug('userlogin success', usr, 'token', token);
	return { userinfo, token };
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
