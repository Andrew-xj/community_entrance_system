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
    phone: '',
    neighbourhood: "",
    address: {
      block: '',
      unit: '',
      room: ''
    },
    tag: true,
    docID: "",
    fileID: '',
    qrcodeWidth: 0,
  },

  /**
   * 数据保存函数--保存并上传用户信息
   */
  save: function (e) {
    that = this;
    // 设置二维码预置参数
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
    // 保存上传部分
    if (this.data.tag) {  // 判断是否已经含有信息
      if (this.data.name != "" &&
        this.data.phone != null &&
        this.data.neighbourhood != "" &&
        this.data.address.block != null &&
        this.data.address.room != null) {   // 判断输入内容是否符合条件
        // 生成二维码
        var content = "姓名：" + that.data.name
          + "\n手机：" + that.data.phone
          + "\n小区：" + that.data.neighbourhood
          + "\n楼号：" + that.data.address.block 
          + "\n单元：" + that.data.address.unit 
          + "\n室号：" + that.data.address.room
        var fileName = that.data.name + '_' + that.data.phone + '.png'
        var ImagePath
        qrcode.makeCode(content)
        // 将二维码导出成图片
        qrcode.exportImage(function (path) {
          console.log('path : ' + path)
          ImagePath = path
          // 上传二维码图片到云存储器
          wx.cloud.uploadFile({
            cloudPath: fileName,
            filePath: ImagePath,
            success: res => {
              that.setData({
                fileID: res.fileID
              })
              // 上传所有用户信息到云数据库
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
      + "\n楼号：" + that.data.address.block 
      + "\n单元：" + that.data.address.unit 
      + "\n室号：" + that.data.address.room
      var fileName = that.data.name + '_' + that.data.phone + '.png'
      var ImagePath;
      qrcode.makeCode(content)
      // 二维码导出成图片
      qrcode.exportImage(function (path) {
        ImagePath = path
        // 删除云存储器中原有的二维码图片
        wx.cloud.deleteFile({
          fileList: [that.data.fileID],
          success: res => {
          },
          fail: console.error
        })
        // 上传新的二维码图片到云存储器
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
      // 更新数据库中用户信息
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
        }
      })
    }
  },

  /**
   * 页面跳转函数--跳转至二维码显示页面
   */
  qr: function (e) {
    wx.navigateTo({
      url: 'info/info?fileID=' + this.data.fileID,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查询数据库中的用户信息
    db.collection('resident').where({
      phone: _.neq("")
    }).get({
      success: function (res) {
        if (res.data.length != 0) {   // 若查到数据，则保存数据
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
      }
    })
  },

  /**
   * 获取姓名
   */
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  /**
   * 获取手机号
   */
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 获取小区名
   */
  neighbourhood: function (e) {
    this.setData({
      neighbourhood: e.detail.value
    })
  },

  /**
   * 获取楼号
   */
  block: function (e) {
    this.setData({
      address: {
        block: e.detail.value,
        unit: this.data.address.unit,
        room: this.data.address.room
      }
    })
  },

  /**
   * 获取单元号
   */
  unit: function (e) {
    this.setData({
      address: {
        block: this.data.address.block,
        unit: e.detail.value,
        room: this.data.address.room
      }
    })
  },

  /**
   * 获取室号
   */
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