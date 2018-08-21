import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';

Page({
  data: {

    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    num:'',
    
    searchItem:{
      thirdapp_id:59
    },
    mainData:[],
    buttonClicked: false
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.getSliderData();
    self.getLabelData();
    var scene = decodeURIComponent(options.scene)
    if(scene){
      var token = new Token({parent_no:scene});
      token.getUserInfo();
    }
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
    api.labelGet(postData,callback);   
  },



  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      menu_id:'381',
      thirdapp_id:'59'
    };
    const callback = (res)=>{ 
     self.data.sliderData = res.info.data[0];
      self.setData({
        web_sliderData:self.data.sliderData,
      });
    };
    api.articleGet(postData,callback);
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
        if(res.info.data.length>4){
          self.data.mainData = self.data.mainData.slice(0,4) 
        }
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.productGet(postData,callback);
  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
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
    console.log(num)
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

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

 
})

  