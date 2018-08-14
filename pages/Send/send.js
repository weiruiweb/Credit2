//logs.js
const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
   isTrue:true,
  },
  onLoad: function () {
   this.setData({
   	 fonts:app.globalData.font
   })
  },
  great:function(){
  	var isTrue = !this.data.isTrue
  	console.log(isTrue)
  	this.setData({
  		isTrue:isTrue
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
  },
  sendInformation:function(){
  	wx.navigateTo({
  		url:'/pages/sendInformation/sendInformation'
  	})
  }
})
