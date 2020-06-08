Page({
  /**
   * 初始化数据
   */
  data: {
    building: '',
    room: '',
    unit: '',
    name:'',
    address:'',
    records: []
  },


  building: function (e) {
    this.data.building = e.detail.value;

  },

  
  room: function (e) {
    this.data.room = e.detail.value;
  },

  unit: function (e) {
    this.data.unit = e.detail.value;
  },

  name: function(e) {
    this.data.name = e.detail.value;
  },
  
  
  searchname: function(){
    var that =this
    var record = []
    const db = wx.cloud.database()
    db.collection('records').where({
      name:this.data.name
    })
    .get()
    .then(res=> {
      if (res.data.length == 0) {
        console.log('no ralated records')
      }
      else {
        console.log(res)
        for (var j = 0; j < res.data.length; j++) {
          record.push(res.data[j].name + '  ' + res.data[j].date + '  ' + res.data[j].time)
        }
        that.setData({
          records: record
        })
      }
    })
  },

  chaxun: function () {
    var that = this

    if(that.data.unit==''){
      that.setData({
        address: '明丰公寓' +that.data.building+'栋'+that.data.room+"室"
      })
      console.log(that.data.address)
    }
    else{
      that.setData({
        address: '明丰公寓'+that.data.building + '栋' + that.data.unit + '单元' + that.data.room + "室"
      })
      console.log(that.data.address)
    }
    var record=[]
    const db = wx.cloud.database()
    const _=db.command
    db.collection('records').where({
      address:that.data.address
    })
    .get()
    .then(res => {
      if (res.data.length == 0) {
        console.log('no ralated records')
      }
      else {
        console.log(res)
        for(var j=0;j<res.data.length;j++){
          record.push(res.data[j].name+'  '+res.data[j].date+'  '+res.data[j].time)
        }
        that.setData({
          records:record
        })
      }
    })

    // const db=wx.cloud.database()
    // db.collection('person').where({
    //   building:this.data.build,
    // })
    // .get()
    // .then(res=>{
    //   if(res.data.length==0){
    //     console.log('no related data')
    //   }
    //   else{
    //     console.log('success to query')
    //     console.log(res.data)
    //   }

    // })



    // ({
    //   success:res=>{
    //     this.setData({
    //       queryResult:JSON.stringify(res.data,null,2)
    //     })
    //     console.log('successquery',res)
    //   },
    //   fail:err=>{
    //     console.log('failed')
    //   }
    // })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})