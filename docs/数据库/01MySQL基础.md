先把 mysql 添加到环境变量

```shell
mysql -u root -p
```

```shell
# 查看数据库
show databases;
# 创建数据库
create database game;
# 使用数据库
use game;
# 创建表
create table player (id INT, name VARCHAR(100), level INT, exp INT, gold DECIMAL(10,2))
# 查看表结构
DESC player;
# 修改表结构
alter table player modify column level int default 1;
# 修改表名
alter table player rename column name to nick_name;
# 添加列
alter table player add column last_login DATETIME;
# 删除列
alter table player drop column last_login;
# 删除表
drop table player;
# 插入数据
insert into player (id, name, level, exp, gold) values (1, 'zhangsan', 1, 1, 1);
# 插入多条数据
insert into player (id, name) values (1, 'zhangsan'),(2, 'zhangsan'),(3, 'zhangsan'),(4, 'zhangsan');
# 更新数据
update palyer set level=1 where name='zhangsan';
update palyer set exp=0, gold=0;
delete from player where gold=0;
# 查询数据
select * from player;
# 数据导入导出
# 导出
mysqldump -u root -p game > game.sql;
# 导入
mysql -u root -p game < game.sql;
# where 子句 逻辑 not > and > or
select * from player where level > 1 and level < 5;
# IN 在数组中匹配
select * from player where level in (1,2,3);
# between...and... 范围查找
select * from player where level between 1 and 3;
# not 取反
# like 模糊查询 % 匹配任意字符 _ 匹配任意一个字符
select * from player where name like '王%';
# regexp 正则匹配
select * from player where name regexp '王.';
# null 判断
select * from player where email is null;
select * from player where email is NOT null;
# order by 排序 desc 降序 默认升序
select * from player order by level desc;
# 聚合函数 COUNT计数 AVG平均数 round四舍五入取整 exists存在判断
select COUNT(*) from player;
select AVG(level) from player;
# group by 分组
select sex, count(*) from player group by sex;
# having 筛选分组的数据
select sex, count(level) from player group by level having count(level) > 4;
# LIMIT 限制条数
select sex, count(level) from player group by level having count(level) > 4 limit 3;
# distinct 去重
select distinct sex from player;
# union 并集
select * from player where level between 1 and 3
union
select * from player where exp between 1 and 3;
# union all并集不去重
select * from player where level between 1 and 3
union all
select * from player where exp between 1 and 3;
# intersect 交集
select * from player where level between 1 and 3
intersect
select * from player where exp between 1 and 3;
# except 差集
select * from player where level between 1 and 3
except
select * from player where exp between 1 and 3;
# 子查询
select * from player where level > (select avg(level) from player)
# 表关联，内连接：只返回两个表都有的数据；左连接：左表所有数据和右表匹配数据；右连接：右表所有数据和左表匹配数据；表连接本质：笛卡尔积加上条件过滤；
# 内连接 不会有null项
select * from player
inner join equip
on player.id = equip.player_id;
# 内连接等效
select * from player, equip where player.id = equip.player_id;
select * from player p, equip e where p.id = e.player_id;
# 左连接 右表中没有的数据 填NUll
select * from player
left join equip
on player.id = equip.player_id;
# 右连接 左表中没有的数据 填NUll
select * from player
right join equip
on player.id = equip.player_id;

# 索引
create [unique|fulltext|spatial] index index_name on tbl_name(index_col);


#视图 数据是随着表数据的变化而变化，存一个select语句
# 创建视图
create view top10
as
select * from player order by level desc limit 10;
# 查询视图
select * from top10;
# 删除视图
drop view top10;

select sentence from table_c where sentence NOT IN (
select sentence from table_a;
union 
select sentence from table_b;
)
```





















































