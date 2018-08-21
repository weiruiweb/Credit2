//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()

Page({
  data: {

    articleData:[],
    mainImg:[],
    submitData:{
      content:'',
      passage1:'',
      type:3
      
    }

  },



  
  onLoad(){
    const self = this;
    self.setData({
      fonts:getApp().globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getArtData()
  },



  messageAdd(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.data.mainImg = self.data.mainImg
    const callback = (data)=>{
      wx.hideLoading();
      api.dealRes(data);
    };
    api.messageAdd(postData,callback);
  },


  submit(num){
    const self = this;
    self.data.submitData.passage1 = num;
    const pass = api.checkComplete(self.data.submitData);
    if(pass){      
        wx.showLoading();
        self.messageAdd(); 
    }else{
      api.showToast('请补全信息','fail');
    };
  },

  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.submit(num);
  },


  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    self.setData({
      web_submitData:self.data.submitData,
    });  
    console.log(self.data.submitData)
  },

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      menu_id:'383',
      thirdapp_id:'59'
    };
    const callback = (res)=>{
      self.data.artData = res.info.data[0];
      wx.hideLoading();
      self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },



  upLoadImg: function (){
    var self = this
    wx.showLoading({
      mask: true,
      title: '图片上传中',
    });
    var mainImg = self.data.mainImg
    wx.chooseImage({
      count:3,
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length  > 3) {
          api.showToast('最多上传3张','fail')
        }else{
          for (var i = 0; i < tempFilePaths.length; i++) {
            mainImg.push(tempFilePaths[i])
          }
          self.setData({
            mainImg: mainImg
          })
          console.log(mainImg);
        }
        wx.uploadFile({
          url: 'https://jzyz.sc2yun.com/public/index.php/api/v1/Base/FtpImage/upload ',
          filePath:mainImg[i],
          name: 'file',
          formData: {
            token:'d43b83de830986b7900ca86520dd3df3'
          },
          success: function(res){
            var obj = JSON.parse(res.data);
            self.data.mainImg = obj
            console.log(self.data.mainImg)
            wx.hideLoading();
            self.setData({
              web_imgData:self.data.mainImg
            })
          }
        })
      }
    })
  },

})
