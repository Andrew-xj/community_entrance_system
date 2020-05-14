// pages/qrcode/qrcode.js

const db = wx.cloud.database();
const _ = db.command;
var util = require('../../utils/util.js');
var QRCode = require('../../utils/qr-core.js');
var qrcode = null;
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: true,
    qrcodeWidth: 0,
    rest: 0,
    info: null,
    canOut:true,
    identifier: ''
  },

  exit: function () {
    this.setData({
      action: true
    })
  },

  enter: function () {
    this.setData({
      action: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    db.collection('resident').where({
      phone: _.neq("")
    }).get({
      success: function (res) {
        var identifier = that.createNonceStr();
        that.setData({
          info: res.data[0],
          identifier: identifier
        })
        var time = util.formatTime(new Date());
        var date = time.split(' ')[0];
        time = time.split(' ')[1];
        var info = that.data.info;
        var address = info.neighbourhood;
        if (info.address.block != null) {
          address += info.address.block + '栋';
        }
        if(info.address.unit != null) {
          address += info.address.unit + '单元'
        }
        if (info.address.room != null) {
          address += info.address.room + '室'
        }
        var content =
          '日期: ' + date + '\n时间: ' + time + '\n姓名: ' + info.name + 
          '\n手机: ' + info.phone + '\n住址: ' + address + 
          "\n能否出门: " + that.data.canOut + '\nidentifier: ' + identifier;
        that.createqrcode(content);
      }
    })
  },

  createqrcode: function (content) {
    that = this
    const ctx = wx.createCanvasContext('canvas')
    const rate = wx.getSystemInfoSync().windowWidth / 450
    var qrcodeWidth = rate * 400
    that.setData({
      qrcodeWidth: qrcodeWidth
    })
    qrcode = new QRCode('canvas', {
      usingIn: that,
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: '#000000',
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H
    })
    qrcode.makeCode(content);
  },

  //生成随机数
  createNonceStr: function () {
    var str = "",
      range = 20,   // 随机数长度
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (true) {
      range = Math.round(Math.random() * (36 - 20)) + 20;
    }
    for (var i = 0; i < range; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
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