require.config({
  paths: {
    'jquery': '../../../../lib/jquery/jquery-1.9.1.js',
    'template': '../../../../lib/arTtemplate/template.js',
    'echarts': '../../../../lib/echarts/echarts.min.js',
    'layer': '../../../../lib/layer/layer.js',
    'service': '../../../../base/js/service.js',
    'orgConfig': '../../../../config/orgConfig.js',
    'tools': '../../../../base/js/requiretools.js',
    'banner': '../../home/js/banner.js',
    'textScroll': '../../home/js/textScroll.js',
    'tab': '../../home/js/tab.js',
    'ajaxBanner': '../../home/js/ajaxBanner.js',
    'secondNav': '../../home/js/secondNav.js',
    'footer': '../../../../public/footer/js/logout.js',
    'header': '../../../../public/header/js/header.js',
  },
  shim: {
    'layer': {
      deps: ['jquery']
    }
  }
});
define(['jquery' , 'template' , 'echarts' , 'layer' , 'service' , 'orgConfig', 'tools' , 'banner' , 'textScroll' , 'tab' , 'ajaxBanner' , 'secondNav' , 'footer' , 'header'],
  function ($ , template , echarts , layer ,service , orgConfig , tools , banner , textScroll , tab , ajaxBanner , secondNav ,  footer , header) {
    var colors = ['#f16c32','#f19d32','#f3d753','#81ca4c','#35a95d','#14c7e0','#4e8fe8','#426db8','#9053cf','#cf539f','#d7423d'];

    getTeacherData( $(".teacher_list") , 'teacherRank' );
    getUserRankData( $(".user_rank_echart") , 'userRankEchart');
    getResourceRank( $(".resource_rank_echart") , service.appIds['byqjyjg_appId'] , '140' , 'resourceRankEchart');
    getActivityRankData( $(".activity_rank_echart") , 'activityRankEchart');
    getActivityWorksRankData( $(".activity_works_rank_echart") , 'activityWorksRankEchart');
    /**
     *
     * @param $obj
     * @param temId
     * @param areaId
     */
    function getTeacherData( $obj , temId ){
      $.ajax({
        url : service.htmlHost + '/pf/api/rank/teaR',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.list && data.data.list.length > 0) {
              for( var i = 0 ; i < data.data.list.length ; i++ ){
                data.data.list[i].showName =  tools.hideTextByLen( data.data.list[i].name , 16 ) ;
              }
              html = template( temId , { 'data' : data.data.list} );
              $(".teacher_rank .total_num span").text(data.data.count);
            }else{
              html = showprompt();
            }
            $obj.html(html);
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取教师数量排行异常。", {icon: 0});
        }
      });
    };
    function getUserRankData( $obj , id){
      $.ajax({
        url : service.htmlHost + '/pf/api/rank/useR',
        type :'GET',
        success : function(data){
          console.log( data )
          if( data && data.code == "success" ){
            if( data.data && data.data.list && data.data.list.length > 0) {
              for( var i = 0 ; i < data.data.list.length ; i++ ){
                data.data.list[i].name = data.data.list[i].name ;
              }
              $(".user_rank .total_num span").text(data.data.count);
              initUserRankEchart(data.data.list,id);
            }else{
              $obj.html( showprompt() );
            }
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取教师活跃度异常。", {icon: 0});
        }
      });

    }
    function initUserRankEchart( data , id ){
      var user_rank_echart = echarts.init( document.getElementById(id) );
      var option = {
        title : {},
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color :colors.slice(0,data.length),
        legend: {
          left: '30',
          bottom: '30',
          data: []
        },
        series : [
          {
            name: '教师活跃度',
            type: 'pie',
            radius : '55%',
            center: ['50%', '38%'],
            data: data ,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      for( var i = 0 ; i < data.length ; i++ ){
        option.legend.data[i] = data[i].name;
        option.series[0].data[i].label = {};
        option.series[0].data[i].label.normal = {};
        option.series[0].data[i].label.normal.formatter = tools.hideTextByLen( data[i].name , 12 );
      }
      user_rank_echart.setOption(option);
    };
    function getResourceRank( $obj , orgCode , phaseId , id){
      var $data = {
        'orgCode' : orgCode,
        'phaseId' : phaseId
      }
      $.ajax({
        url : service.htmlHost + '/pf/api/direct/resI_subResRanking',
        type :'GET',
        data: $data,
        success : function(data){
          if( data && data.success == true ){
            if( data.data && data.data.length > 0) {
              initResourceRankEchart(data.data,id);
            }else{
              $obj.html( showprompt() );
            }
          }else{
            layer.alert( "获取资源贡献排行数据异常" , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取资源贡献排行数据异常。", {icon: 0});
        }
      });

    }
    function initResourceRankEchart( data , id ){
      var resource_rank_echart = echarts.init( document.getElementById(id) );
      option = {
        title : {},
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color :colors.slice(0,data.length),
        legend: {
          orient : 'vertical',
          x : '70',
          y : 'middle',
          itemGap:25,
          data:[]
        },
        series : [
          {
            name:'资源贡献数',
            type:'pie',
            radius : [30, 110],
            center : ['70%', '50%'],
            roseType : 'area',
            data:data
          }
        ]
      };
      for( var i = 0 ; i < data.length ; i++ ){
        if( i < 10 ){
          option.legend.data[i] = data[i].name;
          option.series[0].data[i].label = {};
          option.series[0].data[i].label.normal = {};
          option.series[0].data[i].label.normal.formatter = tools.hideTextByLen( data[i].name , 12 );
        }else{
          if( i == 10 ){
            option.legend.data[i] = '其它';
            option.series[0].data[i].name='其它';
          }else{
            option.series[0].data[10].value += data[i].value;
          }
        }
      }
      option.series[0].data = option.series[0].data.slice(0,11);
      resource_rank_echart.setOption(option);
    };
    function getActivityRankData( $obj , id ){
      $.ajax({
        url : service.htmlHost + '/pf/api/direct/activity_teachers',
        type :'GET',
        success : function(data){
          console.log( data )
          if( data && data.code == "success" ){
            if( data.data && data.data.list && data.data.list.length > 0) {
              for( var i = 0 ; i < data.data.list.length ; i++ ){
                data.data.list[i].name = data.data.list[i].activityName ;
                data.data.list[i].value = data.data.list[i].teacherCount;
              }
              $(".activity_rank .total_num span").text(data.data.teacherCount);
              initActivityRankEchart(data.data.list.slice(0,10),id);
            }else{
              $obj.html( showprompt() );
            }
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取活动参与度排行异常。", {icon: 0});
        }
      });
    }
    function initActivityRankEchart( data , id ){
      var activity_rank_echart = echarts.init( document.getElementById(id) );
      option = {
        title : {},
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color :colors.slice(0,data.length),
        series : [
          {
            name:'活动参与度排行',
            type:'pie',
            radius : [25, 100],
            center : ['50%', '50%'],
            roseType : 'area',
            data:data
          }
        ]
      };
      for( var i = 0 ; i < data.length ; i++ ){
        option.series[0].data[i].label = {};
        option.series[0].data[i].label.normal = {};
        option.series[0].data[i].label.normal.formatter = tools.hideTextByLen( data[i].name , 12 );
      }
      activity_rank_echart.setOption(option);
    };
    function getActivityWorksRankData( $obj , id ){
      $.ajax({
        url : service.htmlHost + '/pf/api/direct/activity_works',
        type :'GET',
        success : function(data){
          console.log( data )
          if( data && data.code == "success" ){
            if( data.data && data.data.list && data.data.list.length > 0) {
              for( var i = 0 ; i < data.data.list.length ; i++ ){
                data.data.list[i].name = data.data.list[i].activityName ;
                data.data.list[i].value = data.data.list[i].worksCount;
              }
              $(".activity_works_rank .total_num span").text(data.data.worksCount);
              initActivityWorksRankEchart(data.data.list.slice(0,10),id);
            }else{
              $obj.html( showprompt() );
            }
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取活动作品数排行异常。", {icon: 0});
        }
      });
    }
    function initActivityWorksRankEchart( data , id ){
      var activity_works_rank_echart = echarts.init( document.getElementById(id) );
      option = {
        title : {},
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color :colors.slice(0,data.length),
        series : [
          {
            name:'作品数',
            type:'pie',
            radius : [25, 100],
            center : ['50%', '50%'],
            roseType : 'area',
            data:data
          }
        ]
      };
      for( var i = 0 ; i < data.length ; i++ ){
        option.series[0].data[i].label = {};
        option.series[0].data[i].label.normal = {};
        option.series[0].data[i].label.normal.formatter = tools.hideTextByLen( data[i].name , 12 );
      }
      activity_works_rank_echart.setOption(option);
    };
    /**
     * 公用没有内容方法
     * @returns {string}
     */
    function showprompt(){
      return "<p id='no-content'>没有您查看的内容</p>";
    };
    $("body").delegate('.grade_select>span i','click',function ( e ) {
      e.stopPropagation();
      if( $(this).hasClass('arrow_up') ){
        $(this).removeClass('arrow_up');
        $(this).parents("span").siblings("div").hide();
      }else{
        $(this).addClass('arrow_up');
        $(this).parents("span").siblings("div").show();
      }
    });
    $("body").delegate('.grade_select ul li','click',function ( e ) {
      e.stopPropagation();
      $(this).parents(".grade_select").find("span strong").text($(this).text()).parents("span").attr("data-value",$(this).attr("data-value"));
      $(this).parents(".grade_select").find("div").hide().siblings("span").find("i").removeClass('arrow_up');
      getResourceRank($(".resource_rank_echart") ,  service.appIds['byqjyjg_appId'] , $(this).attr("data-value") , 'resourceRankEchart');
    });
    $(document).click(function () {
      if( $('.grade_select>span i').hasClass('arrow_up') ){
        $('.grade_select>span i').removeClass('arrow_up');
        $('.grade_select>span i').parents('span').siblings("div").hide();
      }
    });

  }
);



