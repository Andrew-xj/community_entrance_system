var app = getApp()
var scanresult
Page({
  data: {
    date: '',
    time: '',
    name: '',
    phonenumber: '',
    address: '',
    access: '',
    identifier: '',
    inandout: '',
    counter: null,
  },



  saoma: function () {
    var that = this;
    var show;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        if (res.result[1] == '日' && res.result[2] == '期') {
          var access = '';
          scanresult = JSON.stringify(res.result).split("\\n")
          if (scanresult[5]) {
            access = '门已开'
          } else {
            access = '限制出入'
          }
          that.setData({
            show: this.show,
            date: scanresult[0].replace(/\"/g, ""),
            time: scanresult[1],
            name: scanresult[2],
            phonenumber: scanresult[3],
            address: scanresult[4],
            access: scanresult[5],
            door: access,
            identifier: scanresult[6],
            inandout: scanresult[7].replace(/\"/g, ""),
          })
          if (that.data.inandout.slice(9) == 'out') {
            that.addrecord()
            that.adddays()
          }
          else if (that.data.inandout.slice(9) == 'in') {
            that.updaterecord()
            that.adddaysofin()
          }
          wx.showToast({
            title: 'success',
            icon: 'sc',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '扫码失败！\r\n请使用正确的二维码',
            icon: 'none'
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码失败！\r\n请重试',
          icon: 'none'
        })
      },
    })
  },
  // querytoday:function(){
  //   const db=wx.cloud.database()
  //   db.collection('date').where({
  //     date: scanresult[0].slice(6)
  //   }).get({
  //     success:function(res){
  //       console.log(res)
  //       console.log(scanresult[0].slice(6))
  //     }
  //   })
  // },
  adddaysofin: function () {
    var curdate = scanresult[0].slice(6)
    console.log('curdate' + curdate)
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('date').where({
      date: scanresult[0].slice(6)
    }).get().then(res => {
      if (res.data.length == 0) {


      }
      else {
        console.log('suc to find the curday')
        db.collection('date').doc(res.data[0]._id).update({
          data: {
            incount: _.inc(1)
          },
          success: (res) => {
            console.log('suc to add a day-count')
          }
        })
      }
    })
  },
  adddays: function () {
    var curdate = scanresult[0].slice(6)
    console.log('curdate' + curdate)
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('date').where({
      date: scanresult[0].slice(6)
    }).get().then(res => {
      if (res.data.length == 0) {
        console.log('didnt find the curday, try to add')
        db.collection('date').add({
          data: {
            date: scanresult[0].slice(6),
            count: 1,
            
          }

        })
        console.log('suc to add a new-day')
      }
      else {
        console.log('suc to find the curday')
        db.collection('date').doc(res.data[0]._id).update({
          data: {
            outcount: _.inc(1)
          },
          success: (res) => {
            console.log('suc to add a day-count')
          }
        })
      }
    })
    //({
    // success:function(res){
    //   console.log('suc to find the curday')
    //   db.collection('date').doc(res.data[0]._id).update({
    //     data:{
    //       count:10
    //     },
    //     success:(res)=>{
    //       console.log('suc to add a day-count')
    //     }
    //   })
    // },
    // fail:function(){
    //   console.log('didnt find the curday,try to add')
    //   db.collection('date').add({
    //     data:{
    //       date: scanresult[0].slice(6),
    //       count:1
    //     }
    //   }),
    //   console.log('suc to add')
    // }
    //})
  },
  updaterecord: function () {
    const db = wx.cloud.database()
    db.collection('records').where({
      identifier: this.data.identifier.slice(12)
    }).get({
      success: (res) => {
        db.collection('records').doc(res.data[0]._id).update({
          data: {
            inandout: 'in'
          },
          success: (res) => {
            console.log('suc to update a in-code')
          }
        })
      }
    })
  },
  addrecord: function () {
    const db = wx.cloud.database()
    db.collection('records').add({
      data: {
        date: scanresult[0].slice(6),
        time: scanresult[1].slice(4),
        name: scanresult[2].slice(4),
        phonenumber: scanresult[3].slice(4),
        address: scanresult[4].slice(4),
        access: scanresult[5].slice(6),
        identifier: this.data.identifier.slice(12),
        inandout: this.data.inandout.slice(9)
      },
      success: function (res) {
        console.log('success to upload a record')
      },
      fail: function (res) {
        console.log('fail to upload a record')
      }
    })
  }
})
