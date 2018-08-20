import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()


Page({
  data: {
    num:1,
   orderData:[],
   searchItem:{
      thirdapp_id:'59',
    },
  },


  onLoad() {
    const self = this;
    this.setData({
   	  fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData()
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem)
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
      });  
    };
    api.orderGet(postData,callback);
  },


  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },

  changeSearch(num){
    const self = this;
    this.setData({
      num: num
    });
    self.data.searchItem = {};
    if(num=='1'){

    }else if(num=='2'){
      self.data.searchItem.pay_status = '0';
      self.data.searchItem.order_step = '0';
    }else if(num=='3'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.transport_status = '1';
      self.data.searchItem.order_step = '0';
      
    }else if(num=='4'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.transport_status = '2';
      self.data.searchItem.order_step = '0';
      self.data.searchItem.remark_status = 'false';
    }else if(num=='5'){
      self.data.searchItem.order_step = '1';
    };

    self.setData({
      web_mainData:[],
    });
    self.getMainData(true);

  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


})
