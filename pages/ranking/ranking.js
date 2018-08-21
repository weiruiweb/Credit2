//logs.js
import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp()


Page({
  data: {
    mainData:[],
    mainDataTwo:[]
  },


  onLoad() {
    const self = this;
    this.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getRank();
  },


  getRank(isNew){
    const self = this;
    const postData = {
      order:{
        'score':'desc'
      },
      limit:30,
      thirdapp_id:'59',
      tableName:'score'
    };
    postData.paginate = self.data.paginate;
    const callback = (res)=>{
     if(res.info.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info); 
        self.data.mainDataTwo.push.apply(self.data.mainDataTwo,res.info);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.setData({
        web_mainData:self.data.mainData,
        web_mainDataTwo:self.data.mainDataTwo.splice(0,1)
      });
     
      console.log(self.data.mainData) 
      console.log(self.data.mainDataTwo.splice(0,1))
      wx.hideLoading();
    };
    api.getRank(postData,callback);
  },

/*  getRankTwo(isNew){
    const self = this;
    const postData = {
      order:{
        'score':'desc'
      },
      limit:30,
      thirdapp_id:'59',
      tableName:'score'
    };
    postData.paginate = self.data.paginate;
    const callback = (res)=>{
     if(res.info.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.setData({
        web_mainData:self.data.mainData,
        web_mainDataTwo:self.data.mainData.splice(0,1)
      });
     
      console.log(self.data.mainData.splice(0,1))
  
      wx.hideLoading();
    };
    api.getRank(postData,callback);
  },*/


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


})
