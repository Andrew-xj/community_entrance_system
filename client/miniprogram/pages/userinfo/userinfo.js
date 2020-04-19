// pages/userinfo/userinfo.js

const db = wx.cloud.database()
const _ = db.command

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
    docID: ""
  },

  save: function (e) {
    if (this.data.tag) {
      if (this.data.name != "" &&
        this.data.phone != null &&
        this.data.neighbourhood != "" &&
        this.data.address.block != null &&
        this.data.address.room != null) {
        db.collection('resident').add({
          data: {
            "name": this.data.name,
            "phone": this.data.phone,
            "neighbourhood": this.data.neighbourhood,
            "address": {
              "block": this.data.address.block,
              "unit": this.data.address.unit,
              "room": this.data.address.room
            },
            "tag": false
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
    }
    else {
      db.collection('resident').doc(this.data.phone).set({
        data: {
          "name": this.data.name,
          "phone": this.data.phone,
          "neighbourhood": this.data.neighbourhood,
          "address": {
            "block": this.data.address.block,
            "unit": this.data.address.unit,
            "room": this.data.address.room
          },
          "tag": false
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

  qr: function (e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    db.collection('resident').where({
      phone: _.neq("")
    }).get({
      success: function(res){
        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone,
          neighbourhood: res.data[0].neighbourhood,
          tag: res.data[0].tag,
          docID: res.data[0]._id,
          address:{
            block: res.data[0].address.block,
            unit: res.data[0].address.unit,
            room: res.data[0].address.room
          }
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
      address:{
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