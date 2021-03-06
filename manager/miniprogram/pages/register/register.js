// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    name: '',
    building: '',
    unit: '',
    room: '',
    xiaoqu: '',
    phonenumber: ''
  },

  name: function (e) {
    this.data.name = e.detail.value;
  },
  building: function (e) {
    this.data.building = e.detail.value;
  },
  unit: function (e) {
    this.data.unit = e.detail.value;
  },
  room: function (e) {
    this.data.room = e.detail.value;
  },
  phonenumber: function (e) {
    this.data.phonenumber = e.detail.value;
  },



  saoma: function () {
    var that = this;
    var show;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        if (res.result[1] == '姓' && res.result[2] == '名') {
          var scanresult = JSON.stringify(res.result).split("\\n")
          that.setData({
            name: scanresult[0].replace(/\"/g, "").slice(4),
            phonenumber: scanresult[1].replace(/\"/g, "").slice(3),
            xiaoqu: scanresult[2].replace(/\"/g, "").slice(3),
            building: scanresult[3].replace(/\"/g, "").slice(3),
            unit: scanresult[4].replace(/\"/g, "").slice(3),
            room: scanresult[5].replace(/\"/g, "").slice(3),
          })
          console.log(this.data)
          wx.showToast({
            title: 'success',
            icon: 'sc',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '扫码失败！\r\n请使用正确的二维码',
            icon: 'none'
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码失败！\r\n请使用正确的二维码',
          icon: 'none'
        })
      },
    })
  },

  addinfo: function () {
    wx.showToast({
      title:'添加成功',
      icon:'success',
      duration:2000
    })
    const db = wx.cloud.database()
    db.collection('person').add({
      data: {
        name: this.data.name,
        building: this.data.building,
        unit: this.data.unit,
        room: this.data.room,
        phonenumber: this.data.phonenumber,
        done: false
      },
      success: function (res) {
        console.log(res)
      }
    })
  }
})