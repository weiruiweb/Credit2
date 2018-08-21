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
    },

  },



  onLoad(){
    const self = this;
    self.data.year = new Date().getFullYear();
    self.data.month = new Date().getMonth()+1;
    self.data.totalDay = new Date(self.data.year, self.data.month, 0).getDate();
    self.computeCalendar();
    self.setData({
      fonts:getApp().globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getTime();
    
    self.getArtData();
    self.userInfoGet()
  },
  changeMonth(e){
    const self = this;
    var type = api.getDataSet(e,'type');
    if(type=='mins'){
      self.data.month -= 1; 
    }else{
      self.data.month += 1; 
    };
    self.computeCalendar();
  },

  computeCalendar(){
    const self = this;
    var d = new Date();
    d.setYear(self.data.year);
    d.setMonth(self.data.month);
    d.setDate(1);
    self.data.diffrence =  d.getDay();
    self.data.calendar = [];
    for (var i = 0; i < self.data.diffrence+self.data.totalDay; i++) {
      if(i<self.data.diffrence-1){
        self.data.calendar.push(0)
      }else{
        self.data.calendar.push(i-self.data.diffrence+1)
      }
    };
    self.setData({
      web_calendar:self.data.calendar,
      web_month:self.data.month
    });
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
    postData.searchItem.create_time = ['between',[new Date(self.data.year, self.data.month - 1, 1).getTime()/1000,new Date(self.data.year, self.data.month, 0).getTime()/1000]];
    
    const callback = (res)=>{
      self.data.logData = res.info.data;
      self.data.signData = [];
      for (var i = 0; i < self.data.logData.length; i++) {
        self.data.signData.push(parseInt(self.data.logData[i]['create_time'].slice(8,10)));
      };
      console.log(self.data.signData);
      wx.hideLoading();
      self.setData({
        web_logData:self.data.logData,
        web_signData:self.data.signData
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

