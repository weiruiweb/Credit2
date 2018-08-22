import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()


Page({
  data: {
    mainData:[]
  },

  
  onLoad() {
    const self = this;
    this.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate)
    
  },

  onShow(){
    const self = this;
    self.getMainData();
    self.getComputeData()
  },
 

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },


  getMainData(isNew){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:'59',
      user_no:wx.getStorageSync('info').user_no
    }
    const callback = (res)=>{
      wx.hideLoading();
      self.setData({
        web_totol:res.info.data.length
      });  
    };
    api.messageGet(postData,callback);
  },

  calling() {
    const self = this;
    var phone = '18064655944';
    wx.makePhoneCall({
        phoneNumber: phone,
        success: function () {
            console.log("拨打电话成功！")
        },
        fail: function () {
            console.log("拨打电话失败！")
        }
    })
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
