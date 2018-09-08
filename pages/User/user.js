import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()

import {Token} from '../../utils/token.js';

Page({
  data: {
    mainData:[]
  },

  
  onLoad() {
    const self = this;
    if(!wx.getStorageSync('token')){
      var token = new Token();
      token.getUserInfo();
    };
    this.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate)
    
  },

  onShow(){
    const self = this;
    self.getMainData();
    self.getComputeData();
  },
 


  getMainData(){
    const self = this;
    console.log()
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:'59',
      user_no:wx.getStorageSync('info').user_no
    }
    const callback = (res)=>{  
      self.setData({
         web_totol:res.info.data.length
      });  
       wx.hideLoading(); 
    }
    api.messageGet(postData,callback);
  },



  getComputeData(){
    const self = this;
    if(!wx.getStorageSync('token')){
      return;
    };
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

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },
  
})
