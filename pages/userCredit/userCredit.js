//logs.js
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    date:2018-8-9,
    date1:2018-8-9,
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
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange1: function(e) {
    this.setData({
      date1: e.detail.value
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
  }
})
