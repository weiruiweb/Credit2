import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainData:[],
    labelData:[],
    searchItem:{
      thirdapp_id:59
    },
    num:'',
    buttonClicked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const self = this;
     this.setData({
          fonts:app.globalData.font
        });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.getLabelData()
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
      self.setData({
        web_mainData:self.data.mainData
      });   
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem)
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      console.log(self.data.mainData)
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.productGet(postData,callback);
  },
  

  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:['=','59'],
      type:['in',['3']]
    };
    const callback = (res)=>{
      self.data.labelData = res.info.data;    
      wx.hideLoading();
      self.setData({
        web_labelData:self.data.labelData,

      });
    };
    api.labelGet(postData,callback)  
  },

  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    self.setData({
      buttonClicked:true
    })
    if(num!=''){
      self.setData({
        num: num
      });
      self.data.searchItem.category_id = num;  
    }else{
      self.setData({
        num: num
      });
      self.data.searchItem = {
          thirdapp_id:59
      }
    }
    setTimeout(function(){
      self.setData({
        buttonClicked:false
      })
    }, 1000); 
    self.getMainData(true);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


})