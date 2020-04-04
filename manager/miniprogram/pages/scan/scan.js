var app = getApp()
var hellodata = {
  name: '',
  address: '',
  time_left: ''
}

Page({
  data: {
    show: "",
    hellodata
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
  }
})

// let app = getApp();
// Page({
//   data: {
//     show:"",
//   },
//   onLoad() {
//   },
//   scan() {
//     var that = this;
//     var show;
//     wx.scanCode({
//       success: (res) => {
//         console.log("扫码结果");
//         console.log(res);
//         this.show = "result:" + res.result + " type" + res.scanType;
//         that.setData({
//           show: this.show
//         })
//       },
//       fail: (res) => {
//         console.log(res);
//       }
//     })
//   }
// })
