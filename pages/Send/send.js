
import {Api} from '../../utils/api.js';
const api = new Api();
var app = getApp()



Page({

  data: {
    artData:[],
    mainData:[],
    logData:[],
    searchItem :{
      thirdapp_id:'59',
      type:4
    },
    id:''
  },


  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.getArtData();
    this.setData({
     fonts:app.globalData.font
    })
  },
  

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:'59',
      passage1:1,
      user_type:0
    };
    postData.order = {
      create_time:'desc'
    };
    postData.getAfter = {
      userInfo:{
        tableName:'user',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'=',
        info:['nickname','headImgUrl']
      },
      praiseCount:{
        tableName:'log',
        middleKey:'id',
        key:'result',
        searchItem:{
          status:1,
        },
        condition:'=',
        compute:{
          pCount:[
            'count',
            'any',
            {
              status:1,
            }
          ]
        },
      },
      isPraise:{
        tableName:'log',
        middleKey:'id',
        key:'result',
        searchItem:{
          status:1,
          user_no:wx.getStorageSync('info').user_no
        },
        condition:'=',
        info:['id']
      }
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
    api.messageGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


  intoPath(e){
    const self = this;
    wx.showLoading();
    const callback = (user,res) =>{
      api.pathTo(api.getDataSet(e,'path'),'nav');
    };
    api.getAuthSetting(callback);  
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

    
  getArtData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      menu_id:'383',
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


  addLog(message_id){
    const self = this;
    const postData ={};
    postData.data= {
      type:4,
      title:'点赞成功',
      result:message_id,
    };
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      self.data.clickData = res;
      self.setData({
        web_clickData:self.data.clickData,
      });  
      wx.hideLoading();
      if(res.solely_code==100000){
        self.data.mainData[index].isPraise.id = res.info.id;
        self.setData({
          web_mainData:self.data.mainData
        }); 
      }else{
        api.showToast('点赞失败','fail');
      };
    };
    api.logAdd(postData,callback);
  },

  updateLog(log_id,index,type){
    const self = this;
    const postData ={
      searchItem:{
        id:log_id
      },
      data:{
        status:type
      }
    };
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      self.data.clickData = res;
      self.setData({
        web_clickData:self.data.clickData,
      });  
      wx.hideLoading();
      if(res.solely_code==100000){
        if(type==1){
          self.data.mainData[index].isPraise['id'] = log_id;
        }else{
          self.data.mainData[index].isPraise = {}
        };
        self.setData({
          web_mainData:self.data.mainData
        });

      }else{
        api.showToast('点赞失败','fail');
      };

    };
    api.logUpdate(postData,callback);
  },


  getLogData(message_id,index){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      result:message_id,
      type:4,
      status:['in',[1,-1]]
    };
    const callback = (res)=>{
      if(res.info.data.length>0&&res.info.data[0].status==1){
        wx.hideLoading();
        api.showToast('请勿重复点赞','fail');
      }else if(res.info.data.length>0&&res.info.data[0].status==-1){
        self.updateLog(res.info.data[0].id,index,1);
      }else{
        self.addLog(message_id,index);
      };
      self.setData({
        web_mainData:self.data.mainData
      });
    };
    api.logGet(postData,callback);

  },
  

  submit(e){
    const self = this;
    var praiseId = api.getDataSet(e,'log_id');
    var index = api.getDataSet(e,'index');
    
    if(praiseId){
      self.updateLog(praiseId,index,-1)
    }else{
      var message_id = api.getDataSet(e,'id');
      const callback = (user,res) =>{
        wx.showLoading();
        self.getLogData(message_id,index);
      };
      api.getAuthSetting(callback);
    }
  },





  
})


