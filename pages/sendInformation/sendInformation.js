//logs.js
const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
   isTrue:true,
   files: []
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
  backSend:function(){
    wx.navigateTo({
      url:'/pages/Send/send'
    })
  },
  chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
})
