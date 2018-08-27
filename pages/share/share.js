//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()


Page({
  data: {
    computeData:[],
    artData:[],
    shareBtn:'',
    isshare:''
  },


  onLoad(){
    const self = this;
    self.setData({
      fonts:getApp().globalData.font
    });
    wx.showShareMenu({
      withShareTicket: true
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getArtData();
    self.getComputeData()
  },

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      menu_id:'388',
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

  onShareAppMessage(res){
    const self = this;
     console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      }
      return {
        title: '积分商城',
        path: 'pages/index/index?parentNo='+wx.getStorageSync('info').user_no,
        success: function (res){
          console.log(res);
          console.log(parentNo)
          if(res.errMsg == 'shareAppMessage:ok'){
            console.log('分享成功')
            if (self.data.shareBtn){
              if(res.hasOwnProperty('shareTickets')){
              console.log(res.shareTickets[0]);
                self.data.isshare = 1;
              }else{
                self.data.isshare = 0;
              }
            }
          }else{
            wx.showToast({
              title: '分享失败',
            })
            self.data.isshare = 0;
          }
        },
        fail: function(res) {
          console.log(res)
        }
      }
  }

})
