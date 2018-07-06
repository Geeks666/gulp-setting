require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
define(['jquery' , 'template' , 'layer' , '../../home/js/tab' , 'service' , 'tools' , 'banner' , 'ajaxBanner' , 'secondNav' , 'appDetail' , 'footer' , 'header'],
  function ($ , template , layer , tab , service , tools , banner , ajaxBanner , secondNav , appDetail , footer , header) {
  var app  = [
    {
      name:'教学大师',
      praiseNum:45612,
      url:'http://zl.feitianedu.com:8088/?uid=0C9081C49AE6CBA90AD307E32F14EBDE',
      picurl:'../images/app/jxds.png'
    },
    {
      name:'飞天优课',
      isBlack:true,
      praiseNum:45612,
      url:'./feitian.html',
      picurl:'../images/app/ftyk.png'
    },
    {
      name:'互动教研',
      praiseNum:7715,
      url:'http://jy.feitianedu.com/jy/ws/sso?uid=D2152220D06F403E6D3DEBA42289FB31C8A84FAD212F5A915E549175775F4953928DA73B8C94266EAACFFCDF8C9D00AE&appid=8f8da512ae3d43b39bbce4ac104fa0e0&appkey=559a3447a425474bb07c77d5800da06c',
      picurl:'../images/app/hdjy.png'
    },
    {
      name:'资源管理',
      praiseNum:3652,
      url:'http://zy.feitianedu.com/winLogin.anys?uid=D2152220D06F403E6D3DEBA42289FB31C8A84FAD212F5A915E549175775F4953928DA73B8C94266EAACFFCDF8C9D00AE&appid=1c196e7b-00da-11e4-b418-af0a269fad83&appkey=23f68e4f-00da-11e4-b418-af0a269fad83',
      picurl:'../images/app/zygl.png'
    },
    {
      name:'数字图书馆',
      praiseNum:5284,
      url:'http://9yue.mainbo.com/winshare/mianbologin?uid=7C164BD5F5A44D28D6132EC085337242',
      picurl:'../images/app/sztsg.png'
    },
    {
      name:'公文流转',
      praiseNum:4258,
      picurl:'../images/app/gwlz.png'
    },
    {
      name:'行政办公',
      praiseNum:2510,
      picurl:'../images/app/xzbg.png'
    },
    {
      name:'系统管理',
      praiseNum:6520,
      picurl:'../images/app/xtgl.png'
    },
    {
      name:'消息中心',
      praiseNum:2358,
      picurl:'../images/app/xxzx.png'
    },
    {
      name:'人事管理',
      praiseNum:7425,
      picurl:'../images/app/rsgl.png'
    },
    {
      name:'学籍管理',
      praiseNum:4102,
      picurl:'../images/app/xjgl.png'
    },
    {
      name:'校产管理',
      praiseNum:850,
      picurl:'../images/app/xcgl.png'
    },
    {
      name:'教务成绩',
      praiseNum:1470,
      picurl:'../images/app/jwcj.png'
    },
    {
      name:'综合素质',
      praiseNum:2035,
      picurl:'../images/app/zhsz.png'
    },
    {
      name:'成长档案',
      praiseNum:3520,
      picurl:'../images/app/czda.png'
    },
    {
      name:'党建管理',
      praiseNum:2015,
      picurl:'../images/app/djgl.png'
    },
    {
      name:'问卷调查',
      praiseNum:842,
      picurl:'../images/app/wjdc.png'
    },
    {
      name:'课题管理',
      praiseNum:1200,
      picurl:'../images/app/ktgl.png'
    },
    {
      name:'档案管理',
      praiseNum:620,
      picurl:'../images/app/dagl.png'
    },
    {
      name:'社团管理',
      praiseNum:3052,
      picurl:'../images/app/stgl.png'
    },
    {
      name:'学分管理',
      praiseNum:620,
      picurl:'../images/app/xfgl.png'
    }
  ];
  /*var appStr = '';
  for (var i = 0; i < app.length; i++) {
    appStr += '<li class="list">' +
        '<img class="appPic" src="' + app[i].picurl + '" >' +
        '<p><a target="' + (app[i].isBlack ? '_blank':'') +  '" href="' + (app[i].url || 'javascript:;') + '">' + app[i].name + '</a></p>' +
        '<p class="praise clearFix"><span class="zan"></span>' + app[i].praiseNum + '人赞</p>' +
        '<span class="type">资源</span>' +
        '</li>';
  }*/
  //$('.appList').html(appStr);
  //$('.appList').html( template( 'appList_' , { 'data' : app} ) );
  var typeList = null;
  //getCategory();
  /**
   * 获取app所有类别
   */
  function getCategory() {
    $.ajax({
      url : service.htmlHost + '/pf/api/app/types',
      type :'GET',
      success : function(data){
        console.log( data )
        if( data && data.code == "success" ){
          if( data.data.length > 0) {
            typeList = data.data;
            loadAppData( $("#appList") , 'appList_');
          }
        }else{
          alert("获取应用分类异常")
        }
      }
    });
  };
  /**
   *
   * @param $obj
   * @param temId 模板id
   */
  function loadAppData( $obj , temId) {
    $.ajax({
      url : service.htmlHost + '/pf/api/app/list',
      type :'GET',
      success : function(data){
        console.log( data )
        if( data && data.code == "success" ){
          var html = "";
          if( data.data.length > 0) {
            $.each( data.data , function (index) {
              data.data[index].logo = getPicPath( data.data[index].logo );
              data.data[index].category = getType( data.data[index].category );
            });

            html = template( temId , data );
          }else{
            html = showprompt();
          }
          $obj.html(html);
        }else{
          alert("获取应用异常")
        }
      }
    });
  };

  function getType( category ){
    for( var i = 0 ; i < typeList.length ; i++ ){
      if( category == typeList[i].value ){
        return typeList[i].name;
      }
    }
  };
  function getPicPath( id ){
    return service.prefix + '/pf/res/download/'+id;
  };
});