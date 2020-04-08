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
    requestResult: ''
  },
  saoma: function () {
    var that = this;
    var show;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        this.show = "result:" + res.result + " type" + res.scanType;
        that.setData({
          show: this.show,
          name: res.result,
          address: res.charSet
        })
        wx.showToast({
          title: 'success',
          icon: 'sc',
          duration: 2000
        })
        var i = 0;
        while (1) {
          i++;
          if (i == 1500000000) break;
        }
        this.saoma()
      },
      fail: (res) => {
        console.log(res)
      },
    })
  },

  addinfo:function(){
    const db = wx.cloud.database()
    db.collection('person').add({
      data:{
        name:"周子杰",
        building:2,
        unit:3,
        room:201,
        done:false
      },
      success:function(res){
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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