
import {Api} from '../../utils/api.js';
const api = new Api();
var app = getApp()



Page({

  data: {
    artData:[],
    mainData:[],
    logData:[],
    searchItem :{
      thirdapp_id:'59',
      type:4
    },
    id:''
  },


  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.getArtData();
    this.setData({
     fonts:app.globalData.font
    })
  },
  

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:'59',
      passage1:1,
      user_type:0
    };
    postData.order = {
      create_time:'desc'
    };
    postData.getAfter = {
      userInfo:{
        tableName:'user',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'=',
        info:['nickname','headImgUrl']
      }
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.messageGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


  intoPath(e){
    const self = this;
    wx.showLoading();
    const callback = (user,res) =>{
      api.pathTo(api.getDataSet(e,'path'),'nav');
    };
    api.getAuthSetting(callback);  
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
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


  click(e){
      const self = this;
      
      const postData ={};
      postData.data= {
        type:4,
        title:'点赞成功',
        result:self.data.id
      };
      postData.token = wx.getStorageSync('token');
      const callback = (res)=>{
        self.data.clickData = res;
        wx.hideLoading();
        self.setData({
          web_clickData:self.data.clickData,
        });  
      };
      api.logAdd(postData,callback);
    },


  getLogData(){
    const self = this;
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem)
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
      console.log(self.data.logData)
    };
    api.logGet(postData,callback);
  },
  

  submit(e){
    const self = this;
    self.data.id = api.getDataSet(e,'id');
    self.data.searchItem.result = self.data.id;
    self.getLogData();
    console.log(self.data.logData.length)
    if(self.data.logData.length>0){
      
      console.log(api.getDataSet(e,'id'))
      api.showToast('已点赞','fail');
    }else{
      wx.showLoading();
      const callback = (user,res) =>{
        self.click(user);
      };
      api.getAuthSetting(callback);
    };
  },





  
})


