// pages/record/record.js

const db = wx.cloud.database();
const _ = db.command;
let sysdate = require('../../utils/date.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    db.collection('ExitAndEnter').where({
      phone: _.neq('')
    }).get({
      success: (res) => {
        var records = that.rebuildData(res.data);
        that.setData({
          records: records
        })
      }
    })
  },

  rebuildData: function(data){
    var that = this;
    var new_data=[];
    for(var i=0;i<data.length;i++){
      var each = data[i];
      each = that.addWeek(each);    // 添加星期
      each = that.addAction(each);  // 添加行为
      each = that.deleteOther(each);     // 删除不必要的数据
      new_data.push(each);
    }
    new_data.sort((a,b) => {
      if(a.date != b.date){
        return b.date>a.date?1:-1;
      }else{
        return b.time>a.time?1:-1;
      }
    })
    return new_data;
  },

  deleteOther: function(each){
    delete each['address'];
    delete each['name'];
    delete each['phone'];
    delete each['identifier'];
    delete each['_openid'];
    return each;
  },

  addAction: function(each){
    if(each.Exit_or_Enter == 'Enter'){
      each['action'] = '出门且已返回';
    }else if(each.Exit_or_Enter == 'Exit'){
      each['action'] = '出门但仍未回';
    }
    return each;
  },

  addWeek: function(each){
    var date = each.date.replace('/','-');
    date = date.replace('/','-');
    var week = sysdate.getDates(1, date);
    each['week'] = week[0].week;
    return each;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})