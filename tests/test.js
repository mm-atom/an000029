const test = require('ava');

const { default: a } = require('../dist/index');

/**
INSERT INTO "user_auths" ("id", "user_id", "identity_type", "identifier", "credential", "last_active", "ip") VALUES
('14d075a2-ebfc-473a-8ebf-3d8cd81e53eb',	'da6e8226-2356-4b61-ae8c-0455430def0b',	'usercode',	'taoqiufeng',	'0da381d779a7507eae3e9bd2a02b675a', 1580443997832, '127.0.0.1');

INSERT INTO "users" ("id", "info") VALUES
('da6e8226-2356-4b61-ae8c-0455430def0b',	'{"nickname":"taoqf","email":"taoqiufeng@ifeidao.com","phone":"18937139411"}');
 */
test('用户登陆', async (t) => {
	const r = await a('taoqiufeng', 'taoqf001', '127.0.0.1');
	t.is(r.userid, 'taoqiufeng');
});
