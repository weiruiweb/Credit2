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
    };
    api.signIn(postData,callback);
  },


  sucssess:function(){
    var isShow = !this.data.isShow
    this.setData({
      isShow:isShow
    })
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


  getLogData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.order = {
      create_time:'desc'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.logData.push.apply(self.data.logData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_logData:self.data.logData,
      });  
    };
    api.logGet(postData,callback);
  },


  getTime(){
    const self = this;
    var timeStampStart = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    var timeStampEnd = 
      new Date(new Date().setHours(0, 0, 0, 0)) / 1000 + 24 * 60 * 60-1;
    self.data.searchItem.create_time = ['between',[timeStampStart,timeStampEnd]];
  }

})

