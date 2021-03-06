# 用户名密码登录

## postgres

用户数据存储到postgres数据库中，其json字段更便于存储可扩展的用户信息

## 用户表

### 表结构

#### 用户基础信息表

字段名|字段类型|字段描述
---|---|---
id|text|用户id
info|json|用户信息

#### 用户授权信息表

字段名|字段类型|字段描述
---|---|---
id|text|授权信息关键字
user_id|text|用户id
identity_type|text|登录类型（手机号 邮箱 用户名）或第三方应用名称（微信 微博等）
identifier|text|标识（手机号 邮箱 用户名或第三方应用的唯一标识）
credential|text|密码凭证（站内的保存密码，站外的不保存或保存token）

### 建表语句

```sql
DROP TABLE IF EXISTS mm_users;
CREATE TABLE mm_users (
	id text NOT NULL,
	info json,
	PRIMARY KEY (id)
) WITH (oids = false);

DROP INDEX IF EXISTS mm_users_id;
CREATE UNIQUE INDEX mm_users_id ON mm_users(id);

COMMENT ON TABLE mm_users IS '用户基础信息';
COMMENT ON COLUMN mm_users.id IS '用户id';
COMMENT ON COLUMN mm_users.info IS '用户信息';

DROP TABLE IF EXISTS mm_user_auths;
CREATE TABLE mm_user_auths (
	id text NOT NULL,
	user_id text,
	identity_type text,
	identifier text,
	credential text,
	last_active bigint,
	ip text,
	CONSTRAINT pk_mm_user_auths PRIMARY KEY (identifier, identity_type)
) WITH (oids = false);

DROP INDEX IF EXISTS mm_user_auths_id;
CREATE UNIQUE INDEX mm_user_auths_id ON mm_user_auths(id);
DROP INDEX IF EXISTS mm_user_auths_user_id;
CREATE INDEX mm_user_auths_user_id ON mm_user_auths(user_id);
DROP INDEX IF EXISTS mm_user_auths_identity_type;
CREATE INDEX mm_user_auths_identity_type ON mm_user_auths(identity_type);
DROP INDEX IF EXISTS mm_user_auths_identifier;
CREATE INDEX mm_user_auths_identifier ON mm_user_auths(identifier);

COMMENT ON TABLE mm_user_auths IS '用户授权信息';
COMMENT ON COLUMN mm_user_auths.user_id IS 'users.id';
COMMENT ON COLUMN mm_user_auths.identity_type IS '登录类型（手机号 邮箱 用户名）或第三方应用名称（微信 微博等）';
COMMENT ON COLUMN mm_user_auths.identifier IS '标识（手机号 邮箱 用户名或第三方应用的唯一标识）';
COMMENT ON COLUMN mm_user_auths.credential IS '密码凭证（站内的保存密码，站外的不保存或保存token）';
```

## 完整的配置文件

```json
{
	"session": {
		"secret": "Mmstudio123",
		"expiresIn": "30d"
	},
	"db": {
		"type": "postgres",
		"source": "postgres://mmstudio:Mmstudio123@127.0.0.1:5432/mmstudio"
	}
}
```

## docker-file

[docker-compose安置](https://download.daocloud.io/Docker_Mirror/Docker_Compose)

```yml
version: '3.7'

services:
  postgres:
    image: postgres
    container_name: postgres
    volumes:
      - /home/taoqf/data/postgre:/var/lib/postgresql/data
    restart: always
    environment:
      POSTGRES_DB: mmstudio
      POSTGRES_USER: mmstudio
      POSTGRES_PASSWORD: Mmstudio123
    ports:
      - 5432:5432
  adminer:
    container_name: adminer
    image: adminer
    restart: always
    ports:
      - 8080:8080
```
