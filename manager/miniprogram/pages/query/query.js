Page({
  /**
   * 初始化数据
   */
  data: {
    building: '',
    room: '',
    unit: '',
    name:'',
    queryResult:'',
  },


  searchbuilding: function (e) {
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
    console.log('姓名：',this.data.name);
    const db = wx.cloud.database()
    db.collection('person').where({
      name:this.data.name
    })
    .get()
    .then(res=> {
      if(res.data.length==0){
        console.log('no ralated records')
      }
      else{
        this.setData({
          queryResult: JSON.stringify(res.data)
        })
        console.log('success to query')
        console.log(res.data)
      }
    })
  },

  chaxun: function () {
    console.log('楼号: ', this.data.building);
    console.log('单元', this.data.unit);
    console.log('室: ', this.data.room);

    const db = wx.cloud.database()
    db.collection('person').where({
      building:parseInt(this.data.building),
      unit:parseInt(this.data.unit),
      room:parseInt(this.data.room)
    })
      .get()
      .then(res => {
        if (res.data.length == 0) {
          console.log('no ralated records')
        }
        else {
          this.setData({
            queryResult: JSON.stringify(res.data)
          })
          console.log('success to query')
          console.log(res.data)
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