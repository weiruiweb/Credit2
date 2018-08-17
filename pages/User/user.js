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
    })
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData()
  },
 

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:'59'
    }
    postData.order = {
      create_time:'desc'
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
  }
})
