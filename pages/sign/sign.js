//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()


Page({
  data: {
    isShow:false,
    logData:[],
    searchItem :{
      thirdapp_id:'59',
      type:3
    }
  },



  onLoad(){
    const self = this;
    self.setData({
      fonts:getApp().globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getTime();
    self.getLogData();
    self.getArtData();
    self.userInfoGet()
  },



  signIn(){
    const self = this;
    const postData = {
      reward:{
        score:30
      },
      type:3,
      title:'签到成功'
    };
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      wx.hideLoading();
      self.sucssess();
      self.getLogData()
    };
    api.signIn(postData,callback);
  },


  sucssess:function(){
    var isShow = !this.data.isShow
    this.setData({
      isShow:isShow
    })
  },

  userInfoGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      self.data.userInfoData = res;
      self.setData({
        web_userInfoData:self.data.userInfoData,
      });
      wx.hideLoading();
    };
    api.userInfoGet(postData,callback);
  },

  submit(){
    const self = this;
    self.getLogData();
    if(self.data.logData.length>0){
      api.showToast('今日已签到','fail');
    }else{
      wx.showLoading();
      const callback = (user,res) =>{
        self.signIn(user);
      };
      api.getAuthSetting(callback);
    };
  },


  getLogData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      self.data.logData = res.info.data
      wx.hideLoading();
      self.setData({
        web_logData:self.data.logData
      })
      console.log(self.data.logData)
    };
    api.logGet(postData,callback);
  },


  getTime(){
    const self = this;
    var timeStampStart = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    var timeStampEnd = 
      new Date(new Date().setHours(0, 0, 0, 0)) / 1000 + 24 * 60 * 60-1;
    self.data.searchItem.create_time = ['between',[timeStampStart,timeStampEnd]];
  },


  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      menu_id:'390',
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

})

