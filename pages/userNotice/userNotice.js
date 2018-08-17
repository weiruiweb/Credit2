//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()


Page({


  data: {

    artData:[]

  },


  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    this.setData({
      fonts:app.globalData.font
    });
    self.getArtData()
  },

  getArtData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      menu_id:'380',
      thirdapp_id:'59'
    };
    const callback = (res)=>{
      self.data.artData = res;
      wx.hideLoading();
      self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },


})
