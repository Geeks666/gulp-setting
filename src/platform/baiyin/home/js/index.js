require.config({
  paths: {
    'jquery': '../../../../lib/jquery/jquery-1.9.1.js',
    'fullPage': '../../../../lib/jquery/jquery.fullPage.min.js',
    'template': '../../../../lib/arTtemplate/template.js',
    'layer': '../../../../lib/layer/layer.js',
    'textScroll': 'textScroll.js',
    'tab': 'tab.js',
    'service': '../../../../base/js/service.js',
    'orgConfig': '../../../../config/orgConfig.js',
    'tools': '../../../../base/js/requiretools.js',
    'banner': 'banner.js',
    'ajaxBanner': 'ajaxBanner.js',
    'secondNav': 'secondNav.js',
    'footer': '../../../../public/footer/js/logout.js',
    'header': '../../../../public/header/js/header.js',
    'appVerify': '../../../../public/header/js/appVerify.js',
  },
  shim: {
    'layer': {
      deps: ['jquery']
    }
  }
});
define(['jquery' , 'fullPage' , 'template' , 'layer' , 'textScroll' , 'tab' , 'service' , 'orgConfig' , 'tools' , 'banner' , 'ajaxBanner' , 'secondNav' , 'footer' , 'header' , 'appVerify' ],
  function ($ , fullPage , template , layer , textScroll , tab , service , orgConfig , tools , banner , ajaxBanner , secondNav , footer , header , appVerify ) {
    var appId = orgConfig.orgIds.baiyinAreaId;
    var allData = {
      'loginedTeaNums' : {},
      'schools' : {},
      'dynamics' : {},
      'teaSorts' : {},
      'hotspaces' : {}
    };
    /*getAppId('byqjyjID');*/
    //获取公告
    getNotice( $(".notice_list") , 'noticeList' );
    //获取新闻
    getNews( "1" , "newscontent_box" );
    //获取学科资源
    getSubjectInfo( $("#subject_section") , "subjectSection" );
    getVideoList( $("#videoList") , "videoList_");
    getloginedTeaNums( orgConfig.orgIds.baiyinAreaId );

    //热门空间
    hotspace( $("#goodspace_content") , 'goodspaceContent' , '2' , 30 , orgConfig.orgIds.baiyinAreaId );
    //个人空间动态
    getDynamic( $("#dynamic_list") , 'dynamicList' , orgConfig.orgIds.baiyinAreaId , null , 'first');
    getTeaSort( $("#teaSort>div"), 'teaSort_' , 1 , 30 , orgConfig.orgIds.baiyinAreaId );
    getSchoolOrTeacher( $(".schoolShow .schoolList") , "schoolList_" , orgConfig.orgIds.baiyinAreaId );

    //获取数字图书馆
    getEbookResource( $("#library ul") , "library_" );
    //活动展示
    getADList( $("#thematic_pavilion") , 'thematicPavilion');
    //友情链接
    getFriendList( $("#link_content") , 'linkContent' , 0 );
    initLink();
    //初始化更多
    initMoreLink();


    /**
     * 填充公告
     * @param $obj
     * @param temId 模板ID
     */
    function getNotice( $obj , temId ){
      $.ajax({
        url : service.htmlHost + '/pf/api/notice/getLimit?limit=10',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            var html = template( temId , data );
            $obj.html(html);
          }else{
            layer.alert("获取公告异常", {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取公告异常。", {icon: 0});
        }
      });
    };
    /**
     * 教育新闻/成果展示
     * @param category 类别 1：教育新闻 2：成果展示
     * @param id 教育新闻和成果展示模块ID
     */
    function getNews( category , id ){
      $.ajax({
        url : service.htmlHost + '/pf/api/news/getLimit?limit=20&isComm=1&category='+category,
        type : 'GET',
        success : function(data) {
          if( data && data.code == "success" ){
            var html = '';
            if( data.data && data.data.length >0){
              data.category = category ;
              $.each( data.data , function ( index ) {
                data.data[index].showTitle = tools.hideTextByLen( data.data[index].title , 30 );
                data.data[index].showBrief = tools.hideTextByLen( data.data[index].brief , 124 );
                data.data[index].img = data.data[index].img ? getPicPath(data.data[index].img) : '';
              });
              html = template(id + "_", data );
            }else{
              html = showprompt();
            }
            $("#"+id).html( html );//填充新闻

            if( data.data && data.data.length >0){
              var newData = data.data;
              for (var i = 0; i < newData.length; i++) {
                if (!data.data[i].img || data.data[i].img == "") {
                  newData.splice(i, 1);
                  i--;
                }
              }
              if( newData.length >0) {
                html = template("newsPic_", {'data': newData});//填充新闻图片
              }else{
                html = showprompt();
              }
            }else{
              html = showprompt();
            }
            $("#newsPic").html(html);


          }else{
            layer.alert("获取新闻异常", {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取新闻异常。", {icon: 0});
        }
      });
    };
    /**
     * 获取学科资源
     * @param $obj
     * @param temId 模板ID
     */
    function getSubjectInfo( $obj , temId ){
      $.ajax({
        url : service.htmlHost + '/pf/api/meta/homeSubject',
        type:"GET",
        dataType:'JSON',
        success:function(data){
          if( data && data.code == "success" ){
            var gradeClass = {
              '小学' : 'primarySchool',
              '初中' : 'middleSchool',
              '高中' : 'highSchool',
            };
            data.gradeClass = gradeClass;
            $obj.html( template( temId , data ) );
          }else{
            layer.alert("获取学科信息异常", {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取学科信息异常。", {icon: 0});
        }
      });
    }
    function getVideoList( $obj , temId ){

      $.ajax({
        url : service.htmlHost + '/pf/api/qtapp/ktsl_recList',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            var html;
            if( data.data && data.data.result && data.data.result.data && data.data.result.data.length>0 ){
              html = template( temId , data );
            }else{
              html = showprompt();
            }
            $obj.html( html );
          }else{
            layer.alert("获取课堂实录异常", {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取课堂实录异常。", {icon: 0});
        }
      });


    }
    /**
     * 广告位
     * @param $obj : 内容容器
     * @param temId : 模板ID
     */
    function getADList( $obj , temId ){
      $.ajax({
        url : service.htmlHost + '/pf/api/friend/advent?limit=3',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                data.data[i].pic = getPicPath(data.data[i].pic);
              }
              html = template( temId , data );
            }else{
              html = showprompt();
            }
            $obj.html(html);
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取活动异常。", {icon: 0});
        }
      });
    };
    /**
     * 热门空间
     * @param $obj
     * @param temId 模板ID
     * @param type 用户类型 2：教师 3：学生 5：家长 6：教研员; class：班级 school：学校 subject：学科 area：区域
     * @param orgId
     */
    function hotspace( $obj , temId , type , pageSize , areaId , orgId ){
      var key = areaId ? areaId : orgId;
      if( allData.hotspaces[key] == null ){
        allData.hotspaces[key] = {};
      }
      if( allData.hotspaces[key][type] == null ) {
        var $data = {
          'type': type,
          'pageSize': pageSize,
          'currentPage': 1
        };
        if (areaId) $data['areaId'] = areaId;
        if (orgId) $data['orgId'] = orgId;
        $.ajax({
          url: service.htmlHost + '/pf/api/qtapp/rrt_hotspace',
          type: 'GET',
          data: $data,
          success: function (data) {
            if (data && data.code == "success") {
              var html = "";
              if (data.data && data.data.data && data.data.data.length > 0) {
                handleData(type);
                function handleData(type) {
                  if (type == '2' || type == '3' || type == '5' || type == '6') {
                    $.each(data.data.data, function (index) {
                      data.data.data[index].spaceUrl = data.msg + data.data.data[index].spaceUrl + '&requireLogin=false';
                      data.data.data[index].icon = data.data.data[index].icon ? data.data.data[index].icon : getDefaultAvatar(type);
                    });
                  } else if (type == 'subject') {
                    var ids = [100, 103, 104, 106, 107, 165, 265, 166, 172, 173, 174, 933, 171, 170, 167];
                    var subjects = [];
                    var j = 0;
                    $.each(data.data.data, function (i, n) {
                      var subjectid = n.spaceUrl.split("&")[2].split("=")[1];
                      for (var i = 0; i < ids.length; i++) {
                        if (parseInt(subjectid) == ids[i]) {
                          n.icon = getpicture(parseInt(subjectid));
                          subjects[j] = n;
                          j++;
                          break;
                        }
                      }
                    });
                    $.each(subjects, function (index) {
                      subjects[index].spaceUrl = data.msg + subjects[index].spaceUrl;
                    });
                  } else if (type == 'school') {
                    $.each(data.data.data, function (index) {
                      data.data.data[index].spaceUrl = data.msg + data.data.data[index].spaceUrl;
                      data.data.data[index].icon = (data.data.data[index].icon ? data.data.data[index].icon : getDefaultAvatar('subject') );
                    });
                  }
                }
                allData.hotspaces[key][type] = data.data;
                html = template(temId, data.data);
              } else {
                html = showprompt();
              }

              $obj.html(html);
              $obj.css('margin-left', '0px');
              hotSpaceNum=0;
              if ($obj.find('.spaceList').length > 0) {
                $obj.width($obj.find('.spaceList').length * (parseInt($obj.find('.spaceList').width()) + 3));
              } else {
                $obj.width($obj.parent().width());
              }
              $obj.parent().find('a.prev').hide();
              if ($obj.find('.spaceList').length <= 1) {
                $obj.parent().find('a.next').hide();
              } else {
                $obj.parent().find('a.next').show();
              }
            } else {
              layer.alert(data.msg, {icon: 0});
            }
          },
          error: function (data) {
            var errorInfo = {
              'other': '热门空间',
              'subject': '热门学科空间',
              'school': '热门学校空间'
            }
            layer.alert("获取" + (errorInfo[type] ? errorInfo[type] : errorInfo['other']) + "异常", {icon: 0});
          }
        });
      }else{
        $obj.html(template( temId , allData.hotspaces[key][type] ));
        $obj.css('margin-left', '0px');
        hotSpaceNum=0;
        if ($obj.find('.spaceList').length > 0) {
          $obj.width($obj.find('.spaceList').length * (parseInt($obj.find('.spaceList').width()) + 3));
        } else {
          $obj.width($obj.parent().width());
        }
        $obj.parent().find('a.prev').hide();
        if ($obj.find('.spaceList').length <= 1) {
          $obj.parent().find('a.next').hide();
        } else {
          $obj.parent().find('a.next').show();
        }
      }
    };
    /**
     * 获取个人空间动态
     * @param $obj
     * @param temId 模板ID
     */
    function getDynamic( $obj , temId , areaId , orgId , firstLoad ){
      var key = areaId ? areaId : orgId;
      if( allData.dynamics[key] == null ) {
        var url = service.htmlHost + '/pf/api/qtapp/rrt_dynamicInfo?count=' + 100;
        if (areaId) url += '&areaId=' + areaId;
        if (orgId) url += '&orgId=' + orgId;
        $.ajax({
          url: url,
          type: 'GET',
          success: function (data) {
            if (data && data.code == "success") {
              var html = "";
              if (data.data && data.data.length > 0) {
                $.each(data.data, function (index) {
                  var dynamic = data.data[index];
                  data.data[index].memberInfo.spaceUrl = data.msg + dynamic.memberInfo.spaceUrl + '&requireLogin=false';
                  data.data[index].memberInfo.picurl = (dynamic.memberInfo.picurl ? dynamic.memberInfo.picurl : ( getDefaultAvatar(dynamic.memberInfo.usertype)) );
                  data.data[index].memberInfo.action = action(dynamic.action);
                  data.data[index].memberInfo.resourceType = resourcetype(dynamic.resourceType);
                  data.data[index].memberInfo.createTime = dynamic.createTime.split(" ")[0];
                });
                allData.dynamics[key] = data;
                html = template(temId, data);

              } else {
                html = showprompt();
              }
              $obj.html(html);
              //if (firstLoad)
                new DoMove($obj.find("ul"), 81, 0);
            } else {
              layer.alert("获取个人空间动态异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取个人空间动态异常。", {icon: 0});
          }
        });
      }else{
        $obj.html(template( temId , allData.dynamics[key] ));
        new DoMove($obj.find("ul"), 81, 0);
      }
    };
    function getloginedTeaNums( areaId , orgId ){
      var key = areaId ? areaId : orgId;
      if( allData.loginedTeaNums[key] == null ) {
        var url = service.htmlHost + '/pf/api/schshow/loginedTeaNums';
        if (areaId) url += '?areaId=' + areaId;
        if (orgId) url += '?orgId=' + orgId;
        $.ajax({
          url: url,
          type: 'GET',
          success: function (data) {
            if (data && data.code == "success") {
              allData.loginedTeaNums[key] = data.data;
              $(".teacher_rank .teacherNum .num").text(data.data);
            } else {
              layer.alert(data.msg, {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取在线用户数异常。", {icon: 0});
          }
        });
      }else{
        $(".teacher_rank .teacherNum .num").text(allData.loginedTeaNums[key]);
      }
    };
    function getTeaSort( $obj , temId , pageNum , pageSize , areaId , orgId ){
      var key = areaId ? areaId : orgId;
      if( allData.teaSorts[key] == null ) {
        var $data = {
          'pageNum' : pageNum,
          'pageSize' : pageSize
        };
        if( areaId ) $data['areaId'] = areaId;
        if( orgId ) $data['orgId'] = orgId;
        $.ajax({
        url : service.htmlHost + '/pf/api/by/teaSort',
        type :'GET',
        data : $data,
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.length > 0) {
              allData.teaSorts[key] = data;
              html = template( temId , data );
            }else{
              html = showprompt();
            }
            $obj.html(html);


            $obj.css('margin-left','0px');
            teaSortNum=0;
            if( $obj.find('ul.listPage').length > 0 ){
              $obj.width( $obj.find('ul.listPage').length * (parseInt($obj.find('ul.listPage').width() )) );
            }else{
              $obj.width( $obj.parent().width() );
            }
            $obj.parents('.box').find('a.prev').hide();
            if( $obj.find('ul.listPage').length <= 1 ){
              $obj.parents('.box').find('a.next').hide();
            }else{
              $obj.parents('.box').find('a.next').show();
            }

          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取老师排行异常。", {icon: 0});
        }
      });
      }else{
        $obj.html(template( temId , allData.teaSorts[key] ));
        $obj.css('margin-left','0px');
        teaSortNum=0;
        if( $obj.find('ul.listPage').length > 0 ){
          $obj.width( $obj.find('ul.listPage').length * (parseInt($obj.find('ul.listPage').width() )) );
        }else{
          $obj.width( $obj.parent().width() );
        }
        $obj.parents('.box').find('a.prev').hide();
        if( $obj.find('ul.listPage').length <= 1 ){
          $obj.parents('.box').find('a.next').hide();
        }else{
          $obj.parents('.box').find('a.next').show();
        }
      }
    };


    function getSchoolOrTeacher( $obj , temId , areaId , orgId ){
      var key = areaId ? areaId : orgId;
      if( allData.schools[key] == null ){
        var url = service.htmlHost + '/pf/api/schshow/list?limit=6';
        if( areaId ) url += '&areaId='+areaId;
        if( orgId ) url += '&orgId='+orgId;
        $.ajax({
          url : url,
          type :'GET',
          success : function(data){
            if( data && data.code == "success" ){
              var html = "";
              if( data.data && data.data.length > 0) {
                $.each( data.data , function ( i ) {
                  if( areaId ){
                    data.data[i].image = data.data[i].image ? getPicPath(data.data[i].image) : getDefaultAvatar('school');
                    data.data[i].url = service.newSpaceBase + 'home?ownerId='+data.data[i].id+'&ownerType=school&requireLogin=false';
                  }else if( orgId ){
                    data.data[i].url = service.newSpaceBase + 'home?ownerId='+data.data[i].id+'&ownerType=2&requireLogin=false';
                    data.data[i].photo = data.data[i].photo ? getPicPath(data.data[i].photo) : getDefaultAvatar('2');
                  }
                });
                areaId ? data.msg='school' : data.msg='teacher' ;
                allData.schools[key]=data;
                html = template( temId , data );
              }else{
                html = showprompt();
              }
              $obj.html(html);
            }else{
              layer.alert( "获取学校展示数据异常" , {icon: 0});
            }
          },
          error : function (data) {
            layer.alert("获取学校展示数据异常。", {icon: 0});
          }
        });
      }else{
        $obj.html(template( temId , allData.schools[key] ));
      }
    }
    /**
     * 获取数字图书馆
     * @param $obj
     * @param temId 模板ID
     */
    function getEbookResource( $obj , temId ){
      $.ajax({
        url : service.htmlHost + '/pf/api/tbook/books',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.length > 0) {
              $.each( data.data , function (i) {
                data.data[i].showBookname = tools.hideTextByLen( data.data[i].bookname , 20);
              });
              data.host = service.ebookResourceHost;
              html = template( temId , data );
            }else{
              html = showprompt();
            }
            $obj.html(html);
          }else{
            layer.alert("获取数字图书馆异常", {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取数字图书馆异常。", {icon: 0});
        }
      });
    };
    /**
     * 友情链接
     * @param $obj : 内容容器
     * @param temId : 模板ID
     * @param type : 0：图片链接、1：和文字链接
     */
    function getFriendList( $obj , temId , type ){
      $.ajax({
        url : service.htmlHost + '/pf/api/friend/list?type='+ type +'&limit=12',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                data.data[i].pic = getPicPath(data.data[i].pic);
              }
              html = template( temId , data );
            }else{
              html = showprompt();
            }
            $obj.html(html);
          }else{
            layer.alert("获取友情链接异常", {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取友情链接异常。", {icon: 0});
        }
      });
    };
    //初始化页面部分按钮链接
    function initLink(){
      $("#findResource").attr( 'href' , service.sourcePlatformBase + '/syncTeaching/index' );//找资源
      $("#teachingSystem").attr("href",service.htmlHost + "/dist/platform/www/home/feitianUclass.html");//应用快捷入口
      $("#ftyk>a").attr("data-href",service.htmlHost + "/dist/platform/www/home/feitianUclass.html");//应用快捷入口
      $("#applistMore>a").attr("href",service.htmlHost + "/dist/platform/www/app/app.html");//应用快捷入口
      $("#hotSpace a.more").attr("href",service.newSpaceBase + "/JCenterHome/www/interspace/interspace.html");//热门空间更多
    }
    /**
     * 第三方 更多 入口地址
     */
    function initMoreLink(){
      $.ajax({
        url : service.htmlHost + '/pf/api/header/more',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            $("#teacherStudio").attr("href",data.data.msgzs_more);
          }else{
            alert("初始化数据异常")
          }
        }
      });
    };

    /**
     * 根据图片ID返回图片路径
     * @param id 图片ID
     * @returns {string} 图片路径
     */
    function getPicPath( id ){
      return service.prefix + '/pf/res/download/'+id;
    };
    /**
     * 公用没有内容方法
     * @returns {string}
     */
    function showprompt(){
      return "<p id='no-content'>没有您查看的内容</p>";
    };
    /**
     * 根据用户类型获取头像
     * @param spaceType 用户类型
     * @returns {*} 头像路径
     */
    function getDefaultAvatar(spaceType) {
      var spaceTypeList = {
        '3':"./images/studentPic.png",
        '2':"./images/teacherPic.png",
        '6':"./images/teacherPic.png",
        '5':"./images/teacherPic.png",
        'subject':"./images/orgPic.png",
        'school':"./images/orgPic.png",
        'class':"./images/classPic.png",
        'area':"./images/orgPic.png",
        'other':"./images/orgPic.png"
      };
      if( spaceType ){
        return spaceTypeList[spaceType] ? spaceTypeList[spaceType] : spaceTypeList['other'] ;
      }else{
        return spaceTypeList['other'];
      }
    };
    function action (action){
      switch(action){
        case 1:
          return "新建了  ";
        case 2:
          return "分享了  ";
        case 3:
          return "修改了  ";
      }
    };
    //0--我的成果、1--话题研讨、2--个人相片、21--班级相片、22--学校相片、23--区域相片、3--随笔、4--群组空间公告、5--群组空间共享、6--作业
    function resourcetype (resourcetype){
      switch(resourcetype){
        case 0:
          return "我的成果";
        case 1:
          return "话题研讨";
        case 2:
          return "个人相片";
        case 3:
          return "随笔";
        case 4:
          return "群组空间公告";
        case 5:
          return "群组空间共享";
        case 6:
          return "作业";
        case 21:
          return "班级相片";
        case 22:
          return "学校相片";
        case 23:
          return "区域相片";
      }
    };

    //列表循环
    function DoMove(e,height,t){
      this.target = e;
      this.target.css({'position':'relative'});
      this.$li = e.children();
      this.length = this.$li.length;
      this.height = height || 50;
      this.speed = 1000;
      this.starNum = 0;
      var _this = this;
      if( this.length >= 4 ){
        this.target.html(this.target.html()+this.target.html());
        setTimeout(function(){
          _this.move();
        },t);
      }
    }
    DoMove.prototype.move = function(){
      var _this = this;
      this.starNum ++;
      if( this.starNum > this.length ){
        this.starNum = 1;
        this.target.css('top',0);
      }
      this.target.animate({
            top: '-' + this.starNum * this.height + 'px'
          },
          this.speed,
          function() {
            setTimeout(function(){
              _this.move(_this.starNum)
            },1000);
          });
    };

    //新闻缩略图
    $('body').delegate('.listPic' , 'click' , function (e) {
      e.stopPropagation();
      $('.listPic').removeClass('active');
      $(this).addClass('active');
      $('.showPic','.showBox').find('img').attr('src' , $(this).find('img').attr('src') );
    });
    var newsSlideTimer = setInterval( function(){
      var index = 0;
      if( $(".listPic.active").index() < $(".listPic").length-1 ){
        index = parseInt($(".listPic.active").index())+1;
      }
      $(".listPic").eq( index ).click();
    }, 5000);
    $("body").delegate(".searchBtn_wrap" , "click" , function (e) {
      e.stopPropagation();
      if( $.trim( $(this).siblings(".searchText").val())  == ""  ){
        layer.alert("请输入搜索内容", {icon: 0});
        return false;
      }
      window.location.href = service.sourcePlatformBase + '/syncTeaching/index?title='+encodeURIComponent($.trim($(this).siblings(".searchText").val()))+"&requireLogin=false"
    });
    $("body").delegate(".schoolChoose ul li.list>span" , "click" , function (e) {
      e.stopPropagation();
      var This = this;
      appId = $(This).attr('data-id');
      $(This).parents(".chooseArea").find(".scholl_name").text( $(This).find('a').text() ).attr("title",$(This).find('a').attr('title')).attr("data-id",$(This).attr('data-id'));
      $(This).parents(".chooseList").hide();
      $(This).parents(".chooseArea.tabchoose").find(".arrow").addClass("arrowDown").removeClass("arrowUp");
      if( $(".schoolChoose #schoolList li.list>span").length-1 ==  header.getSchoolList().length && $(This).attr('data-id') == orgConfig.orgIds.baiyinAreaId ){//点击白银区

        getDynamic( $("#dynamic_list") , 'dynamicList' , $(This).attr('data-id') );
        secondNav.getShareResourceCount( orgConfig.orgIds.baiyinAreaId );
        secondNav.getTotalUser(orgConfig.orgIds.baiyinAreaId);
        getloginedTeaNums( orgConfig.orgIds.baiyinAreaId );
        getTeaSort( $("#teaSort>div"), 'teaSort_' , 1 , 30 , orgConfig.orgIds.baiyinAreaId );
        getSchoolOrTeacher( $(".schoolShow .schoolList") , "schoolList_" , $(This).attr('data-id') );
        $(".hotSpace .hotNav>li").show();
        hotspace( $("#goodspace_content") , 'goodspaceContent' , '2' , 30 , $(This).attr('data-id'));

        $(".hotSpace a.more").attr("href", service.newSpaceBase + '/JCenterHome/www/interspace/interspace.html');

        $("#schoolList").html( template( 'school_list' , { data : header.getSchoolList() }) );

      }else{//非白银区

        getDynamic( $("#dynamic_list") , 'dynamicList' , null , $(This).attr('data-id') );
        secondNav.getShareResourceCount( null , $(This).attr('data-id') );
        secondNav.getTotalUser( null , $(This).attr('data-id') );
        getloginedTeaNums( null , $(This).attr('data-id') );
        getTeaSort( $("#teaSort>div"), 'teaSort_' , 1 , 30 , null , $(This).attr('data-id') );
        getSchoolOrTeacher( $(".schoolShow .schoolList") , "schoolList_" , null , $(This).attr('data-id') );
        hotspace( $("#goodspace_content") , 'goodspaceContent' , '2' , 30 , null , $(This).attr('data-id'));

        $(".hotSpace a.more").attr("href", service.newSpaceBase + '/JCenterHome/www/home/index.html?spaceId='+$(This).attr('data-id')+'&spaceType=school');

        if( $(".schoolChoose #schoolList li.list>span").length == header.getSchoolList().length ){//第一次点击非白银区，拼接白银区数据
          $(".hotSpace .hotNav>li[type!='2']").hide();
          $("#schoolList").html( template( 'school_list' , { data : [{'id':orgConfig.orgIds.baiyinAreaId,'name':'白银区','showName':'白银区'}].concat( header.getSchoolList() ) }));
        }
      }
    });

    //空间角色切换
    $(".wrapper").delegate(".hotSpace .hotNav li" , "click" , function(){
      $(this).addClass("active").siblings().removeClass("active");
      hotspace( $("#goodspace_content") , 'goodspaceContent' , $(this).attr("type") , 30 , appId == orgConfig.orgIds.baiyinAreaId ?  appId : null , appId == orgConfig.orgIds.baiyinAreaId ?  null : appId );
      lookNum = 0;
    });
    //判断当前用户是否有权限进入该APP,
    $("body .wrap").delegate('.verify_app_enter' , 'click' , function () {
      if( header.getUser() ){
        appVerify.verifyApp( service.appIds[$(this).attr('type')] , '2' )
      }else{
        layer.alert("请登录后操作。", {icon: 0});
        return;
      }
    });

    $("body").delegate('#activityRegister,#reviewEnter', 'click', function () {
      var url = service.activityHost + '/anonymous/activityIndex';
      if ($(this).attr("id") == 'reviewEnter') {
        if (!header.getUser()) {
          layer.alert("请登录后再试", {icon: 0});
          return;
        }
        if (header.getUserRole() == "3001" || header.getUserRole() == "3002" || header.getUserRole() == "3003") {
          window.location.href = service.activityHost + '/temp/activity/www/background/index.html';
          return;
        } else {
          layer.alert("您没有权限", {icon: 0});
          return;
        }
      }
      $.ajax({
        url: url,
        type: 'GET',
        dataType: "jsonp",
        jsonp: "callback",
        success: function (data) {
          if (data.code == "success") {
            window.location.href = service.activityHost + data.data + ( header.getUser() ? '?login=true' : '?login=false' );
          } else {
            layer.alert(data.msg, {icon: 0});
          }
        },
        error: function (data) {
          layer.alert('服务器异常', {icon: 0});
        }
      });
    });
    $("body").delegate("#jxds,#ftyk",'click',function(){
      if( header.getUser() ){
        window.open( $(this).find("a").attr("data-href") , '_blank');
      }else{
        layer.alert("请登录后操作。", {icon: 0});
        return;
      }
    });



    var onOff = true;
    var $hotSpace = $('#goodspace_content');
    var $teaSort = $('#teaSort>div');
    var hotSpaceNum = 0;
    var teaSortNum = 0;
    function move( n , $obj , width ){

      $obj.animate(
        {
          'margin-left': width*-n
        },
        800,
        function() {
          onOff = true;
        }
      );
    }
    //下一个
    $("body").delegate('.hotSpace .next ' , 'click' , function (e) {
      if( !onOff ) return;
      hotSpaceNum++;
      onOff = false;
      move(hotSpaceNum , $hotSpace , parseInt($hotSpace.find('div.spaceList').width()) );
      if( $hotSpace.find('ul').length-1 == hotSpaceNum ){
        $(this).hide();
      }
      $(this).parents('.hotSpace').find("a.prev").show();
    });
    //上一个
    $("body").delegate('.hotSpace .prev ' , 'click' , function (e) {
      if( !onOff ) return;
      hotSpaceNum--;
      onOff = false;
      move(hotSpaceNum , $hotSpace , parseInt($hotSpace.find('div.spaceList').width()) );
      if( 0 == hotSpaceNum ){
        $(this).hide();
      }
      $(this).parents('.hotSpace').find("a.next").show();
    });
    //下一个
    $("body").delegate('.teacher_rank .next' , 'click' , function (e) {
      if( !onOff ) return;
      teaSortNum++;
      onOff = false;
      move(teaSortNum , $teaSort , parseInt($teaSort.find('ul').width()) );
      if( $teaSort.find('ul').length-1 == teaSortNum ){
        $(this).hide();
      }
      $(this).parents('.teacher_rank').find("a.prev").show();
    });
    //上一个
    $("body").delegate('.teacher_rank .prev' , 'click' , function (e) {
      if( !onOff ) return;
      teaSortNum--;
      onOff = false;
      move(teaSortNum , $teaSort , parseInt($teaSort.find('ul').width()) );
      if( 0 == teaSortNum ){
        $(this).hide();
      }
      $(this).parents('.teacher_rank').find("a.next").show();
    });




    $('body').on('click','.schoolTitle',function(){
      $('.schoolMenu').hide();
      $(this).next().show();
    });

    $(window).scroll(function(){
      if( $(window).scrollTop() >= $(window).height() ){
        $('#others').show();
      }else{
        $('#others').hide();
      }
    });
    $('#goTop').click(function(){
      $("html,body").animate({scrollTop:0},500);
    });

});



