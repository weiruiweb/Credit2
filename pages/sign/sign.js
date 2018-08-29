//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()


Page({
  data: {
    isShow:false,
    logData:[],
    todayData:[],
    seriesRewardData:[],
    computeData:[],
    rewardScore:'',
    searchItem :{
      thirdapp_id:'59',
      type:3
    },
  },


  onLoad(){
    const self = this;
    self.setData({
      fonts:getApp().globalData.font
    });   
    self.data.year = new Date().getFullYear();
    self.data.month = new Date().getMonth()+1;
    self.computeCalendar();
    self.distributionGet();
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.setData({
      web_rewardScore:self.data.rewardScore,
      web_rewardDay:self.data.constantSignDaysExcludeToday+1
    }),
    self.getComputeData();
    self.checkToday();  
  },


  changeMonth(e){
    const self = this;
    var type = api.getDataSet(e,'type');

    if(type=='mins'){
      if(self.data.month==1){
        self.data.year--;
        self.data.month = 12;
      }else{
        self.data.month -= 1; 
      };
    }else{
      if(self.data.month==12){
        self.data.year++;
        self.data.month = 1;
      }else{
        self.data.month += 1;  
      };
      
    };
    self.computeCalendar();
  },

  computeCalendar(){
    const self = this;
    self.data.totalDay = new Date(self.data.year, self.data.month, 0).getDate();
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
      web_month:self.data.month,
      web_year:self.data.year
    });
    console.log(self.data.calendar)
    self.getMainData();
  },



  signIn(){
    const self = this;
    var firstDayReward = 0;
    if(self.data.seriesRewardData[1]){
      firstDayReward = self.data.seriesRewardData[1]
    };
    if(self.data.seriesRewardData[self.data.constantSignDaysExcludeToday+1]){
      self.data.rewardScore = self.data.seriesRewardData[self.data.constantSignDaysExcludeToday+1]
    };
    if(!self.data.rewardScore){
      self.data.rewardScore = firstDayReward;
    };
    const postData = {
      reward:{
        score:self.data.rewardScore
      },
      type:3,
      title:'签到成功'
    };
    postData.token = wx.getStorageSync('token'); 
    postData.saveAfter = [];
    const callback = (res)=>{
      if(self.data.distributionData.info.data.length>0){
        var transitionArray = self.data.distributionData.info.data;
        for (var i = 0; i < transitionArray.length; i++) {
          if(transitionArray[i].level==1){
            postData.saveAfter.push(postData.saveAfter,[
              {
                tableName:'FlowLog',
                FuncName:'add',
                data:{
                  count:10,
                  trade_info:'下级签到积分奖励',
                  user_no:transitionArray[i].parent_no,
                  type:3,
                  thirdapp_id:getApp().globalData.thirdapp_id
                }
              }
            ]);
          }else if(transitionArray[i].level==2){
            postData.saveAfter.push(postData.saveAfter,[
              {
                tableName:'FlowLog',
                FuncName:'add',
                data:{
                  count:20,
                  trade_info:'下级签到积分奖励',
                  user_no:transitionArray[i].parent_no,
                  type:3,
                  thirdapp_id:getApp().globalData.thirdapp_id
                }
              }
            ]);
          }
        }
        
      };
      wx.hideLoading();
      self.sucssess();
      self.checkToday()
      self.setData({
        web_rewardScore:self.data.rewardScore,
        web_rewardDay:self.data.constantSignDays+1
      })
      self.getMainData();
    };
    api.signIn(postData,callback);
  },


  sucssess:function(){
    var isShow = !this.data.isShow
    this.setData({
      isShow:isShow
    })
  },



  distributionGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      child_no:wx.getStorageSync('info').user_no
    }
    const callback = (res)=>{
      self.data.distributionData = res;
      self.setData({
        web_distributionData:self.data.distributionData,
      });
      wx.hideLoading();
    };
    api.distributionGet(postData,callback);
  },

  submit(){
    const self = this;
    self.checkToday();
    if(self.data.todayData.length>0){
      api.showToast('今日已签到','fail');
    }else{
      wx.showLoading();
      const callback = (user,res) =>{
        self.signIn(user);
      };
      api.getAuthSetting(callback);
    };
  },


  getMainData(){
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
      
      self.getArtData();
    };
    api.logGet(postData,callback);
  },

  checkConstantSignDays(){
    const self = this;
    var yesterday = new Date().getDate()-1;
    var num = 0;
    var constantSignDays = 0;
    var maxNum = 0;
    for (var item  in self.data.seriesRewardData) {
      if(item > maxNum){
        maxNum = item 
      };
    };
    for (var i = 0; i < maxNum-1; i++) {
      if(self.data.signData.indexOf((yesterday-i))>=0){
        num++
      }else{
        break;
      }
    };
    for (var i = 0; i < maxNum-1; i++) {
      if(self.data.signData.indexOf((yesterday-i+1))>=0){
        constantSignDays++
      }else{
        break;
      }
    };
    if(num>=maxNum){
      num = num - maxNum;
      constantSignDays = constantSignDays - maxNum;
    };
    self.data.constantSignDays = constantSignDays;
    console.log(self.data.constantSignDays)
    self.setData({
        web_rewardDay:self.data.constantSignDays
    });
    return num;
  },

  checkToday(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.create_time = ['between',[new Date(new Date().setHours(0, 0, 0, 0)) / 1000,new Date(new Date().setHours(0, 0, 0, 0)) / 1000 + 24 * 60 * 60-1]]
    const callback = (res)=>{
      self.data.todayData = res.info.data;
      wx.hideLoading();
      self.setData({
        web_todayData:self.data.todayData,
      })
    };
    api.logGet(postData,callback);
  },





  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      menu_id:'390',
      thirdapp_id:'59'
    };
    const callback = (res)=>{
      self.data.levelOne = res.info.data[0].description;
      self.data.levelOne = res.info.data[0].small_title;
      self.data.artData = res.info.data[0];
      self.data.seriesRewardData = {};
      for (var i = 0; i < res.info.data[0].keywords.split(',').length; i++) {
        var c_num = res.info.data[0].keywords.split(',')[i].split(':')[0];
        self.data.seriesRewardData[c_num] = res.info.data[0].keywords.split(',')[i].split(':')[1]
      };
      wx.hideLoading();
      self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_artData:self.data.artData,
        web_seriesRewardData:self.data.seriesRewardData,
      }); 
      self.checkConstantSignDays(); 
    };
    api.articleGet(postData,callback);
  },

  getComputeData(){
    const self = this;
    const postData = {};
    postData.data = {
      FlowLog:{
        compute:{
          count:'sum',
        },
        
        searchItem:{
          user_no:wx.getStorageSync('info').user_no,
          type:3,
        }
      }
    };
    const callback = (res)=>{
      self.data.computeData = res;
      self.setData({
        web_computeData:self.data.computeData,
      });
      wx.hideLoading();
    };
    api.flowLogCompute(postData,callback);
  },

})

