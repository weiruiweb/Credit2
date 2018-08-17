# 积分商城项目开发文档

### 目录

- 功能概述
- 数据对照表
- 特殊设计思路说明
- 备注

---

**1\. 功能概述**

&emsp;&emsp;项目主要是以对教师的排课，对学员的课时，以及明确两者之间费用的往来。达到对培训机构对所属教师和学员的动态管理，以及自身收入盈利情况的分析的目的。

---
**2\. 数据对照表**

product表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：排课ID|
| product_no | string| 课程编号|
| title| varchar(255)| 课程名称|
| description| varchar(255)| 课程课次|
| content | text| 预留 |
| mainImg | text|  课程主图 |
| bannerImg | text|  预留 |
| price| decimal(10,2)| 课程总价 |
| discount| int(11)| 预留 |
| type| int(11)| 商品种类 |
| category_id| int(11)| 关联label |
| sku_array| varchar(255)| 预留 |
| sku_item| varchar(255)| 预留 |
| spu_array| varchar(255)|关联label（科目和校区） |
| spu_item| varchar(255)| 关联label（科目和校区） |
| passage1| varchar(255)| 商品分类：1实物;2兑换;3线下|
| passage2| varchar(255)|是否专车接送 |
| passage3| varchar(255)|课程状态 |
| passage4| varchar(255)|是否住宿 |
| passage_array| string|预留 |
| view_count| int(11)|预留 |
| listorder| int(11)|自定义排序 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| bigint(13)|删除时间 |
| deadline| int(11)|上课时间 |
| thirdapp_id| int(11)|关联thirdapp |
| user_no| varchar(255)|创建人user_no|
| onShelf | int(2)|1上架；-1下架 |
| status| tinyint(2) |1正常；2删除 |



flow_log表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(2)| 主键：排课ID|
| type | string| 2系统；6上课消耗 |
| count| decimal(10,2)| 平均课时费|
| price| decimal(10,2) | 总课时费|
| relation_id | int(11) | 预留 |
| trade_info| varchar(255) |  备注内容 |
| relation_table| varchar(255) |  预留 |
| order_no| varchar(255) | 预留 |
| trade_type| tinyint(2) | 1增加；2减少 |
| product_no| varchar(255) | 关联product_no |
| passage| varchar(255)| 预留|
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| bigint(13)|删除时间 |
| thirdapp_id| int(11) |关联thirdapp |
| user_no| varchar(255)|关联user_no|
| status| tinyint(2) |1正常；2删除 |
| user_type| varchar(2)|预留|



label表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：排课ID|
| title| varchar(40) | 菜单名称|
| description| text  | 描述 预留|
| parentid| int(11) | 父级菜单ID |
| mainImg | text|  预留 |
| bannerImg | text|  预留 |
| type | tinyint(2) |  1,menu;2,menu_item;3,category;5,sku;6,sku_item;7spu;8spu_item |
| listorder| int(11)|自定义排序 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| int(11) |删除时间 |
| thirdapp_id| int(11)|关联thirdapp |
| user_no| varchar(255)|创建人user_no|



user表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：排课ID|
| login_no | varchar(50) | 用户名|
| password| varchar(255)| 密码MD5|
| mainImg | varchar(9999) |  预留 |
| primary_scope| int(255) | 权限级别：90平台管理员；60超级管理员；30管理员；10用户 |
| scope| varchar(255) | cms端权限，string记录不可操作的模块id，空为无限制 |
| user_type| itinyint(10) | 0,学员;1,教师,2,cms用户; |
| behavior| tinyint(10) | 预留 |
| openid| varchar(225) | 预留 |
| child_array| varchar(255)| 预留 |
| lostlogintime| int(11)|最后登录时间 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| int(11) |删除时间 |
| thirdapp_id| int(11)|关联thirdapp |
| user_no| varchar(255)|用户编号|
| parent_no| varchar(255) |父级用户编号|



user_info表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：排课ID|
| name | 	varchar(255) | 用户名|
| phone| varchar(255)| 用户手机|
| mainImg | varchar(9999) |  用户头像 |
| gender| tinyint(2) | 性别：0女；1男 |
| idCard| 	varchar(255)| 身份证号 |
| email | varchar(255) | 学员原学校 |
| address |  varchar(500)| 地址 |
| city| varchar(255)| 预留 |
| level| varchar(30) | 预留 |
| qrImg| varchar(999) |二维码 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| int(11) |删除时间 |
| deadline | int(11)| 有效期 |
| passage_array | bigint(13)|预留 |
| thirdapp_id| int(11)|关联thirdapp |
| passage1| varchar(255)|校区|
| passage2| text |教师科目|
| sign_time| int(11)|签到时间 |
| status| tinyint(2) |1正常；2删除 |

---
**3\. 特殊设计思路说明**
- 利用wx.scanCode得到二维码中学员user_no信息，将他作为flowlogAdd参数增加一条课程流水，减少学员相应的课时，其中price为平均课时费，将总费用除以总课时得到。
``` javascript
{
  scan(){
    const self = this;
    wx.scanCode({
      success: (res) => {
        const callback = (child_res)=>{
        var price = child_res.info.FlowLog.pricesum/child_res.info.FlowLog.countsum;
        const postData = {
            token:wx.getStorageSync('token'),
            data:{
              user_no:res.result,
              type:6,
              price:price,
              count:-1,
              trade_info:'已上课',
              product_no:self.data.mainData.info.data[0].product_no
            }
         };
          const callback = (res)=>{
            api.dealRes(res);
          };
          api.flowLogAdd(postData,callback)
        };
        self.getComputeData(res.result,callback);     
      }
    })  
  },
}
```
**4\. 备注**
