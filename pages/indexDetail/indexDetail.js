import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()

Page({
  data: {
   
    mainData:[],

    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    id:'',
    isShow:true,
    
  },
  //事件处理函数
 
  onLoad: function (options) {
    const self = this;
     this.setData({
        fonts:app.globalData.font
      });
    self.data.id = options.id;
    self.getMainData();
    self.getLabelData()
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
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
    if(wx.getStorageSync('info').info.length==0){
      api.showToast('请完善信息');
      setTimeout(function(){
           api.pathTo('/pages/userComplete/userComplete','nav');
        },800)
    }else if(!self.data.order_id){
      self.setData({
        buttonClicked: true
      });
      const postData = {
        token:wx.getStorageSync('token'),
        product:[
          {id:self.data.id,count:1}
        ],
        pay:{score:self.data.mainData.price},
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          setTimeout(function(){
            self.setData({
              buttonClicked: false
            })
          }, 1000)         
        }; 
        self.data.order_id = res.info
        self.pay(self.data.order_id);     
      };
      api.addOrder(postData,callback);
    }else{
      self.pay(self.data.order_id)
    }   
  },



 



  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = {
      token:wx.getStorageSync('token'),
      searchItem:{
        id:order_id
      },
      score:self.data.mainData.price
    };
    const callback = (res)=>{
      wx.hideLoading();
      api.dealRes(res);
      self.show()
    };
    api.pay(postData,callback);
  },

  show(){
    const self = this;
    if(self.data.isShow == false){
      self.setData({
        isShow:true
      })
    }else{
      self.setData({
        isShow:false
      })
    }
  },

  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:['=','59'],
      id:389
    };
    const callback = (res)=>{
      self.data.labelData = res.info.data[0];    
      wx.hideLoading();
      self.setData({
        web_labelData:self.data.labelData,

      });
    };
    api.labelGet(postData,callback);  
  },


 
})

  