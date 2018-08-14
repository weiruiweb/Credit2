//logs.js
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    
  },
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userPoster/userPoster'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/userTeam/userTeam'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/userAddress/userAddress'
    })
  }, 
  notice:function(){
    wx.navigateTo({
      url:'/pages/userNotice/userNotice'
    })
  }, 
  userCredit:function(){
    wx.navigateTo({
      url:'/pages/userCredit/userCredit'
    })
  },
  userComment:function(){
    wx.navigateTo({
      url:'/pages/userComment/userComment'
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
      url:'/pages/Send/send'
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
