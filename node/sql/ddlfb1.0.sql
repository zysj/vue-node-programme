DROP TABLE IF EXISTS pub_tag_r_food CASCADE;
CREATE TABLE `pub_tag_r_food` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`tag_id` varchar(50) DEFAULT NULL COMMENT '标签id',
	`food_id` varchar(50) DEFAULT NULL COMMENT '菜谱id',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_tag_r_food_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `pub_tag` (`id`),
	CONSTRAINT `pub_tag_r_food_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `pub_food` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜谱标签表';

DROP TABLE IF EXISTS pub_tag_r_article CASCADE;
CREATE TABLE `pub_tag_r_article` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`tag_id` varchar(50) DEFAULT NULL COMMENT '标签id',
	`article_id` varchar(50) DEFAULT NULL COMMENT '文章id',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_tag_r_article_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `pub_tag` (`id`),
	CONSTRAINT `pub_tag_r_article_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `pub_article` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章标签表';

DROP TABLE IF EXISTS pub_user_r_article_favour CASCADE;
CREATE TABLE `pub_user_r_article_favour` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`user_id` varchar(50) DEFAULT NULL COMMENT '用户id',
	`article_id` varchar(50) DEFAULT NULL COMMENT '文章id',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_user_r_article_favour_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `pub_user` (`id`),
	CONSTRAINT `pub_user_r_article_favour_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `pub_article` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章收藏表';

DROP TABLE IF EXISTS pub_user_r_food_favour CASCADE;
CREATE TABLE `pub_user_r_food_favour` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`user_id` varchar(50) DEFAULT NULL COMMENT '用户id',
	`food_id` varchar(50) DEFAULT NULL COMMENT '菜谱id',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_user_r_food_favour_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `pub_user` (`id`),
	CONSTRAINT `pub_user_r_food_favour_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `pub_food` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜谱收藏表';

DROP TABLE IF EXISTS pub_comment_r_food CASCADE;
CREATE TABLE `pub_comment_r_food` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`user_id` varchar(50) DEFAULT NULL COMMENT '用户id',
	`to_user_id` varchar(50) DEFAULT NULL COMMENT '回复用户id',
	`food_id` varchar(50) DEFAULT NULL COMMENT '菜谱id',
	`comment_con` varchar(140) DEFAULT NULL COMMENT '评论内容',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_user_r_food_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `pub_user` (`id`),
	CONSTRAINT `pub_user_r_food_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `pub_food` (`id`),
	CONSTRAINT `pub_user_r_food_ibfk_3` FOREIGN KEY (`to_user_id`) REFERENCES `pub_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜谱评论表';

DROP TABLE IF EXISTS pub_comment_r_article CASCADE;
CREATE TABLE `pub_comment_r_article` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`user_id` varchar(50) DEFAULT NULL COMMENT '用户id',
	`to_user_id` varchar(50) DEFAULT NULL COMMENT '回复用户id',
	`article_id` varchar(50) DEFAULT NULL COMMENT '文章id',
	`comment_con` varchar(140) DEFAULT NULL COMMENT '评论内容',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_comment_r_article_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `pub_user` (`id`),
	CONSTRAINT `pub_comment_r_article_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `pub_article` (`id`),
	CONSTRAINT `pub_comment_r_article_ibfk_3` FOREIGN KEY (`to_user_id`) REFERENCES `pub_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章评论表';

DROP TABLE IF EXISTS pub_file CASCADE;
CREATE TABLE `pub_file` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`file_name` varchar(50) DEFAULT NULL COMMENT '文件名',
	`file_path` varchar(50) DEFAULT NULL COMMENT '文件路径',
	`file_type` varchar(2) DEFAULT NULL COMMENT '文件类型',
	`relate_id` varchar(50) DEFAULT NULL COMMENT '关联id',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='上传文件表';

DROP TABLE IF EXISTS pub_user CASCADE;
CREATE TABLE `pub_user` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`user_name` varchar(50) DEFAULT NULL COMMENT '用户姓名',
	`login_name` varchar(50) DEFAULT NULL COMMENT '登录名称',
	`password` varchar(50) DEFAULT NULL COMMENT '登录密码',
	`email` varchar(30) DEFAULT NULL COMMENT '电子邮箱',
	`cellphone` varchar(12) DEFAULT NULL COMMENT '手机号码',
	`user_pic_id` varchar(100) DEFAULT NULL COMMENT '用户头像',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	`update_time` varchar(30) DEFAULT NULL COMMENT '更新时间',
	`country` varchar(50) DEFAULT NULL COMMENT '国家',
	`province` varchar(15) DEFAULT NULL COMMENT '省',
	`city` varchar(15) DEFAULT NULL COMMENT '城市',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_user_ibfk_1` FOREIGN KEY (`user_pic_id`) REFERENCES `pub_file` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';

DROP TABLE IF EXISTS pub_food CASCADE;
CREATE TABLE `pub_food` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`food_name` varchar(50) DEFAULT NULL COMMENT '用户姓名',
	`author_id` varchar(50) DEFAULT NULL COMMENT '创建用户',
	`simple_info` varchar(50) DEFAULT NULL COMMENT '概述',
	`pre_time` varchar(30) DEFAULT NULL COMMENT '准备时间',
	`cook_time` varchar(30) DEFAULT NULL COMMENT '烹饪时间',
	`wait_time` varchar(100) DEFAULT NULL COMMENT '等待时间',
	`food_pic_id` varchar(50) DEFAULT NULL COMMENT '成品图片id',
	`ingredients` varchar(50) DEFAULT NULL COMMENT '材料',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	`update_time` varchar(30) DEFAULT NULL COMMENT '更新时间',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_food_ibfk_1` FOREIGN KEY (`food_pic_id`) REFERENCES `pub_file` (`id`),
	CONSTRAINT `pub_food_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `pub_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜谱信息表';

DROP TABLE IF EXISTS pub_food_steps CASCADE;
CREATE TABLE `pub_food_steps` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`food_id` varchar(50) DEFAULT NULL COMMENT '关联菜谱id',
	`step_sort` varchar(50) DEFAULT NULL COMMENT '步骤排序',
	`step_pic_id` varchar(50) DEFAULT NULL COMMENT '步骤图片id',
	`step_info` varchar(30) DEFAULT NULL COMMENT '步骤描述',
	`cook_time` varchar(30) DEFAULT NULL COMMENT '烹饪时间',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	`update_time` varchar(30) DEFAULT NULL COMMENT '更新时间',
	`favour_count` decimal(18) DEFAULT NULL COMMENT '收藏数量',
	`view_count` decimal(18) DEFAULT NULL COMMENT '浏览数量',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_food_steps_ibfk_1` FOREIGN KEY (`food_id`) REFERENCES `pub_food` (`id`),
	CONSTRAINT `pub_food_steps_ibfk_2` FOREIGN KEY (`step_pic_id`) REFERENCES `pub_file` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜谱步骤表';

DROP TABLE IF EXISTS pub_article CASCADE;
CREATE TABLE `pub_article` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`article_name` varchar(50) DEFAULT NULL COMMENT '文章名称',
	`article_content` LONGTEXT DEFAULT NULL COMMENT '文章内容',
	`author_id` varchar(50) DEFAULT NULL COMMENT '文章作者id',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	`update_time` varchar(30) DEFAULT NULL COMMENT '更新时间',
	`favour_count` decimal(18) DEFAULT NULL COMMENT '收藏数量',
	`comment_count` decimal(18) DEFAULT NULL COMMENT '评论数量',
	PRIMARY KEY (`id`),
	CONSTRAINT `pub_article_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `pub_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='文章表';

DROP TABLE IF EXISTS pub_tag CASCADE;
CREATE TABLE `pub_tag` (
	`id` char(50) NOT NULL COMMENT '主键id',
	`tag_name` varchar(20) DEFAULT NULL COMMENT '标签名称',
	`create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
	`update_time` varchar(30) DEFAULT NULL COMMENT '更新时间',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签表';
