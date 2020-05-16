var app = getApp()
var scanresult

Page({
  data: {
    date:'',
    time:'',
    name:'',
    phonenumber:'',
    address:'',
    access:'',
    identifier:'',
    inandout:'',
    counter:null,
  },



  saoma: function () {
    var that = this;
    var show;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        scanresult = JSON.stringify(res.result).split("\\n")
        that.setData({
          show:this.show,
          
          date: scanresult[0].replace(/\"/g, ""),
          time: scanresult[1],
          name: scanresult[2],
          phonenumber: scanresult[3],
          address: scanresult[4],
          access: scanresult[5],
          identifier: scanresult[6],
          inandout: scanresult[7].replace(/\"/g, ""),
          //name: JSON.stringify(res.result).split('\n'),//res.result.split(//\r),
          //[data,time,name,phonenumber,address,access,identifier]:JSON.stringify(res.result).split("\n"),
        })
        if(that.data.inandout.slice(9)=='out'){
          that.addrecord()
        }
        else if(that.data.inandout.slice(9)=='in'){
          console.log('jud')
          that.updaterecord()
        }
        this.querytoday()
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
  querytoday:function(){
    const db=wx.cloud.database()
    db.collection('date').where({
      date: scanresult[0].slice(6)
    }).get({
      success:function(res){
        console.log(res)
        console.log(scanresult[0].slice(6))
      }
    })
  },
  adddays:function(){
    var curdate = new Date().toLocaleDateString();
    const db=wx.cloud.database()
    const _=db.command
    db.collection('date').doc(scanresult[0].slice(6)).update({
      data:{
        count:5
      },
      success:function(res){
        console.log('success to update')
      }
    })
  },
  updaterecord:function(){
    const db=wx.cloud.database()
    db.collection('records').where({
      identifier: this.data.identifier.slice(12)
    }).get({
      success:(res)=>{
        db.collection('records').doc(res.data[0]._id).update({
          data:{
            inandout:'in'
          },
          success:(res)=>{
            console.log('suc to update a in-code')
          }
        })
      }
    })
  },
  addrecord:function(){
    const db=wx.cloud.database()
    db.collection('records').add({
      data:{
        date: scanresult[0].slice(6),
        time: scanresult[1].slice(4),
        name: scanresult[2].slice(4),
        phonenumber: scanresult[3].slice(4),
        address: scanresult[4].slice(4),
        access: scanresult[5].slice(6),
        identifier: this.data.identifier.slice(12),
        inandout:this.data.inandout.slice(9)
      },
      success:function(res){
        console.log('success to upload a record')
      },
      fail: function (res) {
        console.log('fail to upload a record')
      }
    })
  }
})
