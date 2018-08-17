//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()

Page({
  data: {
    files:[],
    articleData:[],
    submitData:{
      content:'',
      passage1:''
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

  getArtData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
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
    wx.chooseImage({
      count: 1,
      success: function (res) {
      console.log(res);
/*      self.setData({
       zhengmian:res.tempFilePathsaths[0]
      });*/
        wx.uploadFile({
          url:"https://solelynet.com/public/index.php/api/v1/upload",
          filePath:'11',
          name:'file',
          header: { "Content-Type": "multipart/form-data" },
          formData: {
            token:wx.getStorageSync('token')
          },
          success: function (res) {
               wx.hideLoadingng();
            if(res.solely_code){
              api.showToast('上传失败','fail')
            }else{
              self.data.placeOrder.passage1 = {
                url:res.data
              };
            }     
          }
        })
      }
    })
  },

})
