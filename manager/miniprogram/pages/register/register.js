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
    name:'',
    building:'',
    unit:'',
    room:'',
    xiaoqu:'',
    phonenumber:''
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
        var scanresult = JSON.stringify(res.result).split("\\n")
        that.setData({
          name: scanresult[0].replace(/\"/g, "").slice(4),
          phonenumber: scanresult[1].replace(/\"/g, "").slice(3),
          xiaoqu:scanresult[2].replace(/\"/g, "").slice(3),
          building: scanresult[3].replace(/\"/g, "").slice(3),
          unit:scanresult[4].replace(/\"/g, "").slice(3),
          room:scanresult[5].replace(/\"/g, "").slice(3),
        })
        console.log(this.data)
        wx.showToast({
          title: 'success',
          icon: 'sc',
          duration: 2000
        })
        // var i = 0;
        // while (1) {
        //   i++;
        //   if (i == 1500000000) break;
        // }
        //this.saoma()
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
        name:this.data.name,
        building:this.data.building,
        unit:this.data.unit,
        room:this.data.room,
        phonenumber:this.data.phonenumber,
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