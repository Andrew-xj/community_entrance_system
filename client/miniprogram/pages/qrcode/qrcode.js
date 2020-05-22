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
    rest: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 查询用户信息
    db.collection('resident').where({
      phone: _.neq("")
    }).get({
      success: function (res) {
        that.setData({
          info: res.data[0],
        })
        var days = that.getDays();    // 获取近三日日期列表
        // 查询近三日出行记录
        db.collection('ExitAndEnter').where({
          Exit_or_Enter: 'Enter',
          phone: res.data[0].phone,
          date: _.in(days)
        }).get({
          success: (res) => {
            // 更新能否出行标签
            if (threshold - res.data.length > 0) {
              that.setData({
                canOut: true,
                // rest: threshold-res.data.length
                rest: res.data.length
              })
            } else {
              that.setData({
                canOut: false,
                // rest: threshold-res.data.length
                rest: res.data.length
              })
            }
            // 查询出门记录
            db.collection('ExitAndEnter').where({
              Exit_or_Enter: "Exit"
            }).get({
              success: (res) => {
                if (res.data.length != 0) {   // 有已出行的记录
                  that.setData({
                    action: false
                  })
                  // 根据记录生成进门码
                  var identifier = res.data[0].identifier;    // 出行记录唯一标识符
                  var time = res.data[0].time;    // 时间
                  var date = res.data[0].date;    // 日期
                  var info = that.data.info;      // 用户信息
                  var address = res.data[0].address;    // 住址
                  // 拼接信息并生成进门码
                  var content =
                    '日期: ' + date + '\n时间: ' + time + '\n姓名: ' + info.name +
                    '\n手机: ' + info.phone + '\n住址: ' + address +
                    "\n能否出门: " + that.data.canOut + '\nidentifier: ' + identifier +
                    "\ninorout: in";
                  that.createqrcode(content);
                  // 隔5s轮询一次数据，判断扫码是否成功；隔20s更新一次二维码
                  setInterval(() => {
                    setTimeout(() => {
                      that.lookup(identifier, info, date, time, address);
                    }, 5000);
                  }, 20000);
                } else {
                  that.setData({
                    action: true
                  })
                  // 生成出行信息
                  var identifier = that.createNonceStr();   // 出行记录唯一标识符
                  var time = util.formatTime(new Date());   // 日期+时间
                  var date = time.split(' ')[0];            // 日期
                  time = time.split(' ')[1];                // 时间
                  var info = that.data.info;                // 用户信息
                  var address = info.neighbourhood;         // 住址
                  // 拼接信息并生成二维码
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
                  // 每隔5s轮询一次数据是否上传成功
                  setTimeout(() => {
                    that.lookup(identifier, info, date, time, address);
                  }, 5000);
                  // 隔20s动态更新出门码
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

  /**
   * 日期获取函数--获取近三日的日期，并存入一个数组内返回
   */
  getDays: function () {
    var days = [];
    var day1 = util.formatTime(new Date()).split(' ')[0];   // 获取当天日期
    days.push(day1);
    var ri = day1.substr(-2);           // 当日的日
    var yue = day1.substr(-5, 2);        // 当日的月
    var nian = Number(day1.substr(1, 4));// 当日的年
    // 当日为1日和2日时须考虑上月总天数
    if (Number(ri) == 1) {
      if (Number(yue) in [1, 2, 4, 6, 8, 9, 11]) {
        ri = '31';
        days.push(day1.substr(0, 8) + ri);
        ri = '30';
        days.push(day1.substr(0, 8) + ri);
      } else if (Number(yue) in [5, 7, 10, 12]) {
        ri = '30';
        days.push(day1.substr(0, 8) + ri);
        ri = '29';
        days.push(day1.substr(0, 8) + ri);
      } else {
        if ((nian % 4 != 0) || ((nian % 100 == 0) && (nian & 400 != 0))) {
          ri = '28';
          days.push(day1.substr(0, 8) + ri);
          ri = '27';
          days.push(day1.substr(0, 8) + ri);
        } else {
          ri = '29';
          days.push(day1.substr(0, 8) + ri);
          ri = '28';
          days.push(day1.substr(0, 8) + ri);
        }
      }
    } else if (Number(ri) == 2) {
      if (Number(yue) in [1, 2, 4, 6, 8, 9, 11]) {
        ri = '1';
        days.push(day1.substr(0, 8) + ri);
        ri = '31';
        days.push(day1.substr(0, 8) + ri);
      } else if (Number(yue) in [5, 7, 10, 12]) {
        ri = '1';
        days.push(day1.substr(0, 8) + ri);
        ri = '30';
        days.push(day1.substr(0, 8) + ri);
      } else {
        if ((nian % 4 != 0) || ((nian % 100 == 0) && (nian & 400 != 0))) {
          ri = '1';
          days.push(day1.substr(0, 8) + ri);
          ri = '28';
          days.push(day1.substr(0, 8) + ri);
        } else {
          ri = '1';
          days.push(day1.substr(0, 8) + ri);
          ri = '29';
          days.push(day1.substr(0, 8) + ri);
        }
      }
    } else {
      ri = Number(ri) - 1;
      days.push(day1.substr(0, 8) + ri.toString());
      ri = ri - 1;
      days.push(day1.substr(0, 8) + ri.toString());
    }
    return days;
  },

  /**
   * 二维码生成函数--生成二维码
   */
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

  /**
   * 随机数生成函数--生成20位随机数
   */
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
   * 查询函数--查询管理端数据库中是否含有当前出行记录
   */
  lookup: function (identifier, info, date, time, address) {
    // identifier = 'CXQC5S8IVaLt5l9K9cxjhwrhgoMMqH';   // 测试用
    // 获取 access_token 以得到访问管理端数据库权限
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx59704a2a311ececb&secret=df9799a2d147f3a9278896cc39607eab',
      header: {},
      success: (res) => {
        that.setData({
          access_token: res.data.access_token
        })
        // 查询管理端数据库中的出行记录
        wx.request({
          url: 'https://api.weixin.qq.com/tcb/databasequery?access_token=' + that.data.access_token,
          data: {
            env: 'scanner-8e7535',
            query: 'db.collection(\"records\").where({identifier:\"' + identifier + '\"}).limit(1).get()'
          },
          method: "POST",
          success: (res) => {
            var jsdata = JSON.parse(res.data.data[0]);  // 将数据转为json格式
            if (res.data.data.length == 1 &&
              upload == false &&
              jsdata.inandout == 'out') {   // 若存在记录，未上传该记录至本地，且为出门行为
              // 向云数据库添加当前出行记录
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
            } else if (res.data.data.length == 1 &&
              upload == false &&
              jsdata.inandout == 'in') {   // 若存在记录，未上传该记录至本地，且为进门行为
              // 在云数据库中查找出门记录
              db.collection('ExitAndEnter').where({
                identifier: identifier
              }).get({
                success: (res) => {
                  // 更新该条记录出行状态
                  db.collection("ExitAndEnter").doc(res.data[0]._id).update({
                    data: {
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
  }
})