//logs.js
import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp()


Page({
  data: {
    mainData:[],
    addressData:[],
    searchItem:{
      isdefault:1
    },
    buttonClicked: false
  },

  onLoad: function (options) {
    const self = this;
     this.setData({
        fonts:app.globalData.font
      });
    self.data.id = options.id;
    self.getMainData();
    
    getApp().globalData.address_id = '';
  },

  onShow(){
    const self = this;
    self.data.searchItem = {};
    if(getApp().globalData.address_id){
      self.data.searchItem.id = getApp().globalData.address_id;
    }else{
      self.data.searchItem.isdefault = 1;
    };
    self.getAddressData();
  },

  getAddressData(){
    const self = this;
    const postData = {}
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      self.data.addressData = res;
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },


  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:59,
      id:self.data.id
    }
    const callback = (res)=>{
      self.data.mainData = res.info.data[0]
      wx.hideLoading();
      self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.productGet(postData,callback);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  addOrder(){
    const self = this;
    self.setData({
      buttonClicked: true
    });
    const postData = {
      token:wx.getStorageSync('token'),
      product:[
        {id:self.data.id,count:1}
      ],
      pay:{score:self.data.mainData.price}
    };
    const callback = (res)=>{
      if(res&&res.solely_code==100000){
        setTimeout(function(){
          self.setData({
            buttonClicked: false
          })
        }, 1000)         
      }; 
        var id = res.info;
        self.pay(id);     
    };
    api.addOrder(postData,callback);
  },



  pay(id){
    const self = this;
    const postData = {
      token:wx.getStorageSync('token'),
      searchItem:{
        id:id
      },
      score:self.data.mainData.price
    };
    const callback = (res)=>{
      wx.hideLoading();
      api.dealRes(res);    
    };
    api.pay(postData,callback);
  },




})
