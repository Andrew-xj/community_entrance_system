// pages/userinfo/userinfo.js

const db = wx.cloud.database()

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
            "姓名": this.data.name,
            "手机": this.data.phone,
            "小区": this.data.neighbourhood,
            "住址": {
              "栋": this.data.address.block,
              "单元": this.data.address.unit,
              "室": this.data.address.room
            },
            tag: false
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
          "姓名": this.data.name,
          "手机": this.data.phone,
          "小区": this.data.neighbourhood,
          "住址": {
            "栋": this.data.address.block,
            "单元": this.data.address.unit,
            "室": this.data.address.room
          },
          tag: false
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
    db.collection('resident').where({
      phone: _.neq(null)
    }).get({
      success: function(res){
        this.setData({
          name: res.data.name,
          phone: res.data.phone,
          neighbourhood: res.data.neighbourhood,
          tag: res.data.tag,
          docID: res.data._id
        })
        this.address.setData({
          block: res.data.address.block,
          unit: res.data.address.unit,
          room: res.data.address.room
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
    this.address.setData({
      block: e.detail.value
    })
  },

  unit: function (e) {
    this.address.setData({
      unit: e.detail.value
    })
  },

  room: function (e) {
    this.address.setData({
      room: e.detail.value
    })
  }
})