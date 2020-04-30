// pages/userinfo/userinfo.js

const db = wx.cloud.database()
const _ = db.command
var QRCode = require('../../utils/qr-core.js')
var qrcode = null;
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: null,
    neighbourhood: "",
    address: {
      block: null,
      unit: null,
      room: null
    },
    tag: true,
    docID: "",
    fileID: '',
    qrcodeWidth: 0,
  },

  save: function (e) {
    that = this
    const ctx = wx.createCanvasContext('canvas')
    const rate = wx.getSystemInfoSync().windowWidth / 750
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
    if (this.data.tag) {
      if (this.data.name != "" &&
        this.data.phone != null &&
        this.data.neighbourhood != "" &&
        this.data.address.block != null &&
        this.data.address.room != null) {
        // 生成二维码
        var content = "姓名：" + that.data.name
          + "\n手机：" + that.data.phone
          + "\n小区：" + that.data.neighbourhood
          + "\n详细住址：" + that.data.address.block + " 栋 " + that.data.address.unit + " 单元 " + that.data.address.room + " 室"
        var fileName = that.data.name + '_' + that.data.phone + '.png'
        var ImagePath
        qrcode.makeCode(content)
        qrcode.exportImage(function (path) {
          console.log('path : ' + path)
          ImagePath = path
          // 上传存储器
          wx.cloud.uploadFile({
            cloudPath: fileName,
            filePath: ImagePath,
            success: res => {
              that.setData({
                fileID: res.fileID
              })
              // 上传数据库
              db.collection('resident').add({
                data: {
                  "name": that.data.name,
                  "phone": that.data.phone,
                  "neighbourhood": that.data.neighbourhood,
                  "address": {
                    "block": that.data.address.block,
                    "unit": that.data.address.unit,
                    "room": that.data.address.room
                  },
                  "tag": false,
                  "fileID": that.data.fileID
                },
                success: function (res) {
                  wx.showToast({
                    title: '信息保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../userinfo/userinfo',
                    })
                  }, 1000)
                }
              })
            }
          })
        })
      }
    }
    else {
      // 生成二维码
      var content = "姓名：" + that.data.name
        + "\n手机：" + that.data.phone
        + "\n小区：" + that.data.neighbourhood
        + "\n详细住址：" + that.data.address.block + " 栋 " + that.data.address.unit + " 单元 " + that.data.address.room + " 室"
      var fileName = that.data.name + '_' + that.data.phone + '.png'
      var ImagePath;
      qrcode.makeCode(content)
      qrcode.exportImage(function (path) {
        ImagePath = path
        wx.cloud.deleteFile({
          fileList: [that.data.fileID],
          success: res => {
          },
          fail: console.error
        })
        wx.cloud.uploadFile({
          cloudPath: fileName,
          filePath: ImagePath,
          success: res => {
            that.setData({
              fileID: res.fileID
            })
          }
        })
      })
      // 更新二维码图片
      db.collection('resident').doc(this.data.docID).set({
        data: {
          "name": this.data.name,
          "phone": this.data.phone,
          "neighbourhood": this.data.neighbourhood,
          "address": {
            "block": this.data.address.block,
            "unit": this.data.address.unit,
            "room": this.data.address.room
          },
          "tag": false,
          "fileID": this.data.fileID
        },
        success: function (res) {
          wx.showToast({
            title: '信息更新成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../userinfo/userinfo',
            })
          }, 1000)
        }
      })
    }
  },

  qr: function (e) {
    wx.navigateTo({
      url: 'info/info?fileID=' + this.data.fileID,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const rate = wx.getSystemInfoSync().windowWidth / 750
    var qrcodeWidth = rate * 400
    this.setData({
      qrcodeWidth: qrcodeWidth
    })
    var that = this
    db.collection('resident').where({
      phone: _.neq("")
    }).get({
      success: function (res) {
        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone,
          neighbourhood: res.data[0].neighbourhood,
          tag: res.data[0].tag,
          docID: res.data[0]._id,
          address: {
            block: res.data[0].address.block,
            unit: res.data[0].address.unit,
            room: res.data[0].address.room
          },
          fileID: res.data[0].fileID
        })
      }
    })
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

  },

  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  neighbourhood: function (e) {
    this.setData({
      neighbourhood: e.detail.value
    })
  },

  block: function (e) {
    this.setData({
      address: {
        block: e.detail.value,
        unit: this.data.address.unit,
        room: this.data.address.room
      }
    })
  },

  unit: function (e) {
    this.setData({
      address: {
        block: this.data.address.block,
        unit: e.detail.value,
        room: this.data.address.room
      }
    })
  },

  room: function (e) {
    this.setData({
      address: {
        block: this.data.address.block,
        unit: this.data.address.unit,
        room: e.detail.value
      }
    })
  }
})