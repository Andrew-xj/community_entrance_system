// pages/qrcode/qrcode.js

const db = wx.cloud.database();
const _ = db.command;
var util = require('../../utils/util.js');
var QRCode = require('../../utils/qr-core.js');
var qrcode = null;
var that;
var upload = false;
var threshold = 3;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    action: true,
    qrcodeWidth: 0,
    rest: 0,
    info: null,
    canOut: '',
    identifier: '',
    access_token: '',
    rest:''
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
        that.setData({
          info: res.data[0],
        })
        var days = that.getDays();
        db.collection('ExitAndEnter').where({
          Exit_or_Enter: 'Enter',
          phone: res.data[0].phone,
          date: _.in(days)
        }).get({
          success:(res)=>{
            if(threshold-res.data.length > 0){
              that.setData({
                canOut: true,
                // rest: threshold-res.data.length
                rest:res.data.length
              })
            }else{
              that.setData({
                canOut: false,
                // rest: threshold-res.data.length
                rest: res.data.length
              })
            }
            db.collection('ExitAndEnter').where({
              Exit_or_Enter: "Exit"
            }).get({
              success: (res) => {
                if (res.data.length != 0) {
                  that.setData({
                    action: false
                  })
                  var identifier = res.data[0].identifier;
                  var time = res.data[0].time;
                  var date = res.data[0].date;
                  var info = that.data.info;
                  var address = res.data[0].address;
                  var content =
                    '日期: ' + date + '\n时间: ' + time + '\n姓名: ' + info.name +
                    '\n手机: ' + info.phone + '\n住址: ' + address +
                    "\n能否出门: " + that.data.canOut + '\nidentifier: ' + identifier + 
                    "\ninorout: in";
                  that.createqrcode(content);
                  setInterval(() => {
                    setTimeout(() => {
                      that.lookup(identifier, info, date, time, address);
                    }, 5000);
                  }, 20000);
                } else {
                  that.setData({
                    action: true
                  })
                  var identifier = that.createNonceStr();
                  var time = util.formatTime(new Date());
                  var date = time.split(' ')[0];
                  time = time.split(' ')[1];
                  var info = that.data.info;
                  var address = info.neighbourhood;
                  if (info.address.block != null) {
                    address += info.address.block + '栋';
                  }
                  if (info.address.unit != null) {
                    address += info.address.unit + '单元'
                  }
                  if (info.address.room != null) {
                    address += info.address.room + '室'
                  }
                  var content =
                    '日期: ' + date + '\n时间: ' + time + '\n姓名: ' + info.name +
                    '\n手机: ' + info.phone + '\n住址: ' + address +
                    "\n能否出门: " + that.data.canOut + '\nidentifier: ' + identifier + 
                    '\ninorout: out';
                  that.createqrcode(content);
                  setTimeout(() => {
                    that.lookup(identifier, info, date, time, address);
                  }, 5000);
                  setInterval(() => {
                    identifier = that.createNonceStr();
                    time = util.formatTime(new Date());
                    date = time.split(' ')[0];
                    time = time.split(' ')[1];
                    content =
                      '日期: ' + date + '\n时间: ' + time + '\n姓名: ' + info.name +
                      '\n手机: ' + info.phone + '\n住址: ' + address +
                      "\n能否出门: " + that.data.canOut + '\nidentifier: ' + identifier +
                      '\ninorout: out';
                    that.createqrcode(content);
                    setInterval(() => {
                      that.lookup(identifier, info, date, time, address)
                    }, 5000);
                  }, 20000);
                }
              },
            })
          }
        })
        
      }
    })
  },

  getDays: function() {
    var days = [];
    var day1 = util.formatTime(new Date()).split(' ')[0];
    days.push(day1);
    var ri = day1.substr(-2);
    var yue = day1.substr(-5,2);
    var nian = Number(day1.substr(1,4));
    if (Number(ri) == 1) {
      if(Number(yue) in [1,2,4,6,8,9,11]){
        ri = '31';
        days.push(day1.substr(0,8)+ri);
        ri = '30';
        days.push(day1.substr(0,8)+ri);
      }else if(Number(yue) in [5,7,10,12]){
        ri = '30';
        days.push(day1.substr(0,8)+ri);
        ri = '29';
        days.push(day1.substr(0,8)+ri);
      }else{
        if((nian%4 != 0)||((nian%100 == 0) && (nian&400 != 0))){
          ri = '28';
          days.push(day1.substr(0,8)+ri);
          ri = '27';
          days.push(day1.substr(0,8)+ri);
        }else{
          ri = '29';
          days.push(day1.substr(0,8)+ri);
          ri = '28';
          days.push(day1.substr(0,8)+ri);
        }
      }
    }else if(Number(ri) == 2){
      if(Number(yue) in [1,2,4,6,8,9,11]){
        ri = '1';
        days.push(day1.substr(0,8)+ri);
        ri = '31';
        days.push(day1.substr(0,8)+ri);
      }else if(Number(yue) in [5,7,10,12]){
        ri = '1';
        days.push(day1.substr(0,8)+ri);
        ri = '30';
        days.push(day1.substr(0,8)+ri);
      }else{
        if((nian%4 != 0)||((nian%100 == 0) && (nian&400 != 0))){
          ri = '1';
          days.push(day1.substr(0,8)+ri);
          ri = '28';
          days.push(day1.substr(0,8)+ri);
        }else{
          ri = '1';
          days.push(day1.substr(0,8)+ri);
          ri = '29';
          days.push(day1.substr(0,8)+ri);
        }
      }
    }else{
      ri = Number(ri)-1;
      days.push(day1.substr(0,8)+ri.toString());
      ri = ri - 1;
      days.push(day1.substr(0,8)+ri.toString());
    }
    return days;
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

  lookup: function (identifier, info, date, time, address) {
    // identifier = 'CXQC5S8IVaLt5l9K9cxjhwrhgoMMqH';
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx59704a2a311ececb&secret=df9799a2d147f3a9278896cc39607eab',
      header: {},
      success: (res) => {
        that.setData({
          access_token: res.data.access_token
        })
        wx.request({
          url: 'https://api.weixin.qq.com/tcb/databasequery?access_token=' + that.data.access_token,
          data: {
            env: 'scanner-8e7535',
            query: 'db.collection(\"records\").where({identifier:\"' + identifier + '\"}).limit(1).get()'
          },
          method: "POST",
          success: (res) => {
            var jsdata = JSON.parse(res.data.data[0]);
            if (res.data.data.length == 1 &&
              upload == false &&
              jsdata.inandout == 'out') {
              db.collection('ExitAndEnter').add({
                data: {
                  address: address,
                  name: info.name,
                  phone: info.phone,
                  date: date,
                  time: time,
                  Exit_or_Enter: 'Exit',
                  identifier: identifier
                },
                success: (res) => {
                  wx.showToast({
                    title: '扫码成功',
                    icon: 'success',
                    duration: 2000
                  })
                  upload = true;
                }
              })
            }else if(res.data.data.length == 1 &&
              upload == false &&
              jsdata.inandout == 'in'){
                db.collection('ExitAndEnter').where({
                  identifier: identifier
                }).get({
                  success: (res) => {
                    db.collection("ExitAndEnter").doc(res.data[0]._id).update({
                      data:{
                        Exit_or_Enter: 'Enter'
                      },
                      success: (res) => {
                        wx.showToast({
                          title: '扫码成功',
                          icon: 'success',
                          duration: 2000
                        })
                        upload = true;
                        that.onLoad();
                      }
                    })
                  }
                })
              }
          }
        })
      }
    })
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