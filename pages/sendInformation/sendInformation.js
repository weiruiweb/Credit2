//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()

Page({
  data: {

    artData:[],
    mainImg:[],
    submitData:{
      content:'',
      passage1:'',
      type:3,
      mainImg:[]
    }

  },



  
  onLoad(){
    const self = this;
    self.setData({
      fonts:getApp().globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getArtData();
    self.setData({
      web_imgData:self.data.submitData.mainImg
    });

  },





  messageAdd(){
    const self = this;
    if(!self.data.artData.small_title){
      api.showToast('积分奖励设置有误','fail');
      return ;
    };
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.saveAfter = [
      {
        tableName:'FlowLog',
        FuncName:'add',
        data:{
          count:self.data.artData.small_title,
          trade_info:'发布积分奖励',
          user_no:wx.getStorageSync('info').user_no,
          type:3,
          thirdapp_id:getApp().globalData.thirdapp_id
        }
      }
    ];
    const callback = (data)=>{
      wx.hideLoading();
      if(data.solely_code == 100000){
        api.showToast('发布成功','fail');
        api.pathTo('/pages/Send/send','rela');
      }else{
        api.showToast('发布失败','fail');
      };
       
    };
    api.messageAdd(postData,callback);
      
  },


  submit(num){
    const self = this;
    self.data.submitData.passage1 = num;
    console.log(self.data.submitData)
    const pass = api.checkComplete(self.data.submitData);
    if(pass){      
        wx.showLoading();
        if(!self.data.artData.small_tittle){
          self.getArtData(self.messageAdd());
        }else{      
          self.messageAdd(); 
        };
        
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

  getArtData(c_callback){
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
      c_callback&&c_callback();
    };
    api.articleGet(postData,callback);

  },



  upLoadImg: function (){
    var self = this;

    if(self.data.submitData.mainImg.length>2){
      api.showToast('仅限3张','fail');
      return;
    };
    wx.showLoading({
      mask: true,
      title: '图片上传中',
    });
    var mainImg = self.data.mainImg
    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        
        wx.uploadFile({
          url: 'https://dmgnm.com/scoreshop/public/index.php/api/v1/Base/FtpImage/upload ',
          filePath:tempFilePaths[0],
          name: 'file',
          formData: {
            token:wx.getStorageSync('token')
          },
          success: function(res){
            res = JSON.parse(res.data);
            self.data.submitData.mainImg.push({url:res.info.url})
            self.setData({
              web_imgData:self.data.submitData.mainImg
            });
            wx.hideLoading()

          },
          fail: function(err){
            wx.hideLoading();
            api.showToast('上传失败','fail')
          }
        })
      },
      fail: function(err){
        wx.hideLoading();
      }
    })
  },

})
