//logs.js
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    date:2018-9-9,
  },
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userInfo/userInfo'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/discount/discount'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/manageAddress/manageAddress'
    })
  },
  order:function(){
    wx.navigateTo({
      url:'/pages/userOrder/userOrder'
    })
  },
 shopping:function(){
     wx.redirectTo({
      url:'/pages/Shopping/shopping'
    })
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/Sort/sort'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/User/user'
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
})
