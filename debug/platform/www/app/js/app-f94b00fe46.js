'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  }
});
define(['jquery', 'template', 'layer', '../../home/js/tab', 'service', 'tools', 'banner', 'ajaxBanner', 'secondNav', 'appDetail', 'footer', 'header'], function ($, template, layer, tab, service, tools, banner, ajaxBanner, secondNav, appDetail, footer, header) {
  var app = [{
    name: '教学大师',
    praiseNum: 45612,
    url: 'http://zl.feitianedu.com:8088/?uid=0C9081C49AE6CBA90AD307E32F14EBDE',
    picurl: '../images/app/jxds.png'
  }, {
    name: '飞天优课',
    isBlack: true,
    praiseNum: 45612,
    url: './feitian.html',
    picurl: '../images/app/ftyk.png'
  }, {
    name: '互动教研',
    praiseNum: 7715,
    url: 'http://jy.feitianedu.com/jy/ws/sso?uid=D2152220D06F403E6D3DEBA42289FB31C8A84FAD212F5A915E549175775F4953928DA73B8C94266EAACFFCDF8C9D00AE&appid=8f8da512ae3d43b39bbce4ac104fa0e0&appkey=559a3447a425474bb07c77d5800da06c',
    picurl: '../images/app/hdjy.png'
  }, {
    name: '资源管理',
    praiseNum: 3652,
    url: 'http://zy.feitianedu.com/winLogin.anys?uid=D2152220D06F403E6D3DEBA42289FB31C8A84FAD212F5A915E549175775F4953928DA73B8C94266EAACFFCDF8C9D00AE&appid=1c196e7b-00da-11e4-b418-af0a269fad83&appkey=23f68e4f-00da-11e4-b418-af0a269fad83',
    picurl: '../images/app/zygl.png'
  }, {
    name: '数字图书馆',
    praiseNum: 5284,
    url: 'http://9yue.mainbo.com/winshare/mianbologin?uid=7C164BD5F5A44D28D6132EC085337242',
    picurl: '../images/app/sztsg.png'
  }, {
    name: '公文流转',
    praiseNum: 4258,
    picurl: '../images/app/gwlz.png'
  }, {
    name: '行政办公',
    praiseNum: 2510,
    picurl: '../images/app/xzbg.png'
  }, {
    name: '系统管理',
    praiseNum: 6520,
    picurl: '../images/app/xtgl.png'
  }, {
    name: '消息中心',
    praiseNum: 2358,
    picurl: '../images/app/xxzx.png'
  }, {
    name: '人事管理',
    praiseNum: 7425,
    picurl: '../images/app/rsgl.png'
  }, {
    name: '学籍管理',
    praiseNum: 4102,
    picurl: '../images/app/xjgl.png'
  }, {
    name: '校产管理',
    praiseNum: 850,
    picurl: '../images/app/xcgl.png'
  }, {
    name: '教务成绩',
    praiseNum: 1470,
    picurl: '../images/app/jwcj.png'
  }, {
    name: '综合素质',
    praiseNum: 2035,
    picurl: '../images/app/zhsz.png'
  }, {
    name: '成长档案',
    praiseNum: 3520,
    picurl: '../images/app/czda.png'
  }, {
    name: '党建管理',
    praiseNum: 2015,
    picurl: '../images/app/djgl.png'
  }, {
    name: '问卷调查',
    praiseNum: 842,
    picurl: '../images/app/wjdc.png'
  }, {
    name: '课题管理',
    praiseNum: 1200,
    picurl: '../images/app/ktgl.png'
  }, {
    name: '档案管理',
    praiseNum: 620,
    picurl: '../images/app/dagl.png'
  }, {
    name: '社团管理',
    praiseNum: 3052,
    picurl: '../images/app/stgl.png'
  }, {
    name: '学分管理',
    praiseNum: 620,
    picurl: '../images/app/xfgl.png'
  }];
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
      url: service.htmlHost + '/pf/api/app/types',
      type: 'GET',
      success: function success(data) {
        console.log(data);
        if (data && data.code == "success") {
          if (data.data.length > 0) {
            typeList = data.data;
            loadAppData($("#appList"), 'appList_');
          }
        } else {
          alert("获取应用分类异常");
        }
      }
    });
  };
  /**
   *
   * @param $obj
   * @param temId 模板id
   */
  function loadAppData($obj, temId) {
    $.ajax({
      url: service.htmlHost + '/pf/api/app/list',
      type: 'GET',
      success: function success(data) {
        console.log(data);
        if (data && data.code == "success") {
          var html = "";
          if (data.data.length > 0) {
            $.each(data.data, function (index) {
              data.data[index].logo = getPicPath(data.data[index].logo);
              data.data[index].category = getType(data.data[index].category);
            });

            html = template(temId, data);
          } else {
            html = showprompt();
          }
          $obj.html(html);
        } else {
          alert("获取应用异常");
        }
      }
    });
  };

  function getType(category) {
    for (var i = 0; i < typeList.length; i++) {
      if (category == typeList[i].value) {
        return typeList[i].name;
      }
    }
  };
  function getPicPath(id) {
    return service.prefix + '/pf/res/download/' + id;
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9qcy9hcHAuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImRlZmluZSIsIiQiLCJ0ZW1wbGF0ZSIsImxheWVyIiwidGFiIiwic2VydmljZSIsInRvb2xzIiwiYmFubmVyIiwiYWpheEJhbm5lciIsInNlY29uZE5hdiIsImFwcERldGFpbCIsImZvb3RlciIsImhlYWRlciIsImFwcCIsIm5hbWUiLCJwcmFpc2VOdW0iLCJ1cmwiLCJwaWN1cmwiLCJpc0JsYWNrIiwidHlwZUxpc3QiLCJnZXRDYXRlZ29yeSIsImFqYXgiLCJodG1sSG9zdCIsInR5cGUiLCJzdWNjZXNzIiwiZGF0YSIsImNvbnNvbGUiLCJsb2ciLCJjb2RlIiwibGVuZ3RoIiwibG9hZEFwcERhdGEiLCJhbGVydCIsIiRvYmoiLCJ0ZW1JZCIsImh0bWwiLCJlYWNoIiwiaW5kZXgiLCJsb2dvIiwiZ2V0UGljUGF0aCIsImNhdGVnb3J5IiwiZ2V0VHlwZSIsInNob3dwcm9tcHQiLCJpIiwidmFsdWUiLCJpZCIsInByZWZpeCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsb0JBQWdCO0FBRFg7QUFGTSxDQUFmO0FBTUFDLE9BQU8sQ0FBQyxRQUFELEVBQVksVUFBWixFQUF5QixPQUF6QixFQUFtQyxtQkFBbkMsRUFBeUQsU0FBekQsRUFBcUUsT0FBckUsRUFBK0UsUUFBL0UsRUFBMEYsWUFBMUYsRUFBeUcsV0FBekcsRUFBdUgsV0FBdkgsRUFBcUksUUFBckksRUFBZ0osUUFBaEosQ0FBUCxFQUNFLFVBQVVDLENBQVYsRUFBY0MsUUFBZCxFQUF5QkMsS0FBekIsRUFBaUNDLEdBQWpDLEVBQXVDQyxPQUF2QyxFQUFpREMsS0FBakQsRUFBeURDLE1BQXpELEVBQWtFQyxVQUFsRSxFQUErRUMsU0FBL0UsRUFBMkZDLFNBQTNGLEVBQXVHQyxNQUF2RyxFQUFnSEMsTUFBaEgs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dUIsQ0FBVCxFQUFZQyxLQUE1QixFQUFtQztBQUNqQyxlQUFPeEIsU0FBU3VCLENBQVQsRUFBWTVCLElBQW5CO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsV0FBU3dCLFVBQVQsQ0FBcUJNLEVBQXJCLEVBQXlCO0FBQ3ZCLFdBQU92QyxRQUFRd0MsTUFBUixHQUFpQixtQkFBakIsR0FBcUNELEVBQTVDO0FBQ0Q7QUFDRixDQTdMRCIsImZpbGUiOiJhcHAvanMvYXBwLWY5NGIwMGZlNDYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdwbGF0Zm9ybUNvbmYnOiAncHVibGljL2pzL3BsYXRmb3JtQ29uZi5qcydcclxuICB9XHJcbn0pO1xyXG5kZWZpbmUoWydqcXVlcnknICwgJ3RlbXBsYXRlJyAsICdsYXllcicgLCAnLi4vLi4vaG9tZS9qcy90YWInICwgJ3NlcnZpY2UnICwgJ3Rvb2xzJyAsICdiYW5uZXInICwgJ2FqYXhCYW5uZXInICwgJ3NlY29uZE5hdicgLCAnYXBwRGV0YWlsJyAsICdmb290ZXInICwgJ2hlYWRlciddLFxyXG4gIGZ1bmN0aW9uICgkICwgdGVtcGxhdGUgLCBsYXllciAsIHRhYiAsIHNlcnZpY2UgLCB0b29scyAsIGJhbm5lciAsIGFqYXhCYW5uZXIgLCBzZWNvbmROYXYgLCBhcHBEZXRhaWwgLCBmb290ZXIgLCBoZWFkZXIpIHtcclxuICB2YXIgYXBwICA9IFtcclxuICAgIHtcclxuICAgICAgbmFtZTon5pWZ5a2m5aSn5biIJyxcclxuICAgICAgcHJhaXNlTnVtOjQ1NjEyLFxyXG4gICAgICB1cmw6J2h0dHA6Ly96bC5mZWl0aWFuZWR1LmNvbTo4MDg4Lz91aWQ9MEM5MDgxQzQ5QUU2Q0JBOTBBRDMwN0UzMkYxNEVCREUnLFxyXG4gICAgICBwaWN1cmw6Jy4uL2ltYWdlcy9hcHAvanhkcy5wbmcnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOifpo57lpKnkvJjor74nLFxyXG4gICAgICBpc0JsYWNrOnRydWUsXHJcbiAgICAgIHByYWlzZU51bTo0NTYxMixcclxuICAgICAgdXJsOicuL2ZlaXRpYW4uaHRtbCcsXHJcbiAgICAgIHBpY3VybDonLi4vaW1hZ2VzL2FwcC9mdHlrLnBuZydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6J+S6kuWKqOaVmeeglCcsXHJcbiAgICAgIHByYWlzZU51bTo3NzE1LFxyXG4gICAgICB1cmw6J2h0dHA6Ly9qeS5mZWl0aWFuZWR1LmNvbS9qeS93cy9zc28/dWlkPUQyMTUyMjIwRDA2RjQwM0U2RDNERUJBNDIyODlGQjMxQzhBODRGQUQyMTJGNUE5MTVFNTQ5MTc1Nzc1RjQ5NTM5MjhEQTczQjhDOTQyNjZFQUFDRkZDREY4QzlEMDBBRSZhcHBpZD04ZjhkYTUxMmFlM2Q0M2IzOWJiY2U0YWMxMDRmYTBlMCZhcHBrZXk9NTU5YTM0NDdhNDI1NDc0YmIwN2M3N2Q1ODAwZGEwNmMnLFxyXG4gICAgICBwaWN1cmw6Jy4uL2ltYWdlcy9hcHAvaGRqeS5wbmcnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOifotYTmupDnrqHnkIYnLFxyXG4gICAgICBwcmFpc2VOdW06MzY1MixcclxuICAgICAgdXJsOidodHRwOi8venkuZmVpdGlhbmVkdS5jb20vd2luTG9naW4uYW55cz91aWQ9RDIxNTIyMjBEMDZGNDAzRTZEM0RFQkE0MjI4OUZCMzFDOEE4NEZBRDIxMkY1QTkxNUU1NDkxNzU3NzVGNDk1MzkyOERBNzNCOEM5NDI2NkVBQUNGRkNERjhDOUQwMEFFJmFwcGlkPTFjMTk2ZTdiLTAwZGEtMTFlNC1iNDE4LWFmMGEyNjlmYWQ4MyZhcHBrZXk9MjNmNjhlNGYtMDBkYS0xMWU0LWI0MTgtYWYwYTI2OWZhZDgzJyxcclxuICAgICAgcGljdXJsOicuLi9pbWFnZXMvYXBwL3p5Z2wucG5nJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTon5pWw5a2X5Zu+5Lmm6aaGJyxcclxuICAgICAgcHJhaXNlTnVtOjUyODQsXHJcbiAgICAgIHVybDonaHR0cDovLzl5dWUubWFpbmJvLmNvbS93aW5zaGFyZS9taWFuYm9sb2dpbj91aWQ9N0MxNjRCRDVGNUE0NEQyOEQ2MTMyRUMwODUzMzcyNDInLFxyXG4gICAgICBwaWN1cmw6Jy4uL2ltYWdlcy9hcHAvc3p0c2cucG5nJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTon5YWs5paH5rWB6L2sJyxcclxuICAgICAgcHJhaXNlTnVtOjQyNTgsXHJcbiAgICAgIHBpY3VybDonLi4vaW1hZ2VzL2FwcC9nd2x6LnBuZydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6J+ihjOaUv+WKnuWFrCcsXHJcbiAgICAgIHByYWlzZU51bToyNTEwLFxyXG4gICAgICBwaWN1cmw6Jy4uL2ltYWdlcy9hcHAveHpiZy5wbmcnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOifns7vnu5/nrqHnkIYnLFxyXG4gICAgICBwcmFpc2VOdW06NjUyMCxcclxuICAgICAgcGljdXJsOicuLi9pbWFnZXMvYXBwL3h0Z2wucG5nJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTon5raI5oGv5Lit5b+DJyxcclxuICAgICAgcHJhaXNlTnVtOjIzNTgsXHJcbiAgICAgIHBpY3VybDonLi4vaW1hZ2VzL2FwcC94eHp4LnBuZydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6J+S6uuS6i+euoeeQhicsXHJcbiAgICAgIHByYWlzZU51bTo3NDI1LFxyXG4gICAgICBwaWN1cmw6Jy4uL2ltYWdlcy9hcHAvcnNnbC5wbmcnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiflrabnsY3nrqHnkIYnLFxyXG4gICAgICBwcmFpc2VOdW06NDEwMixcclxuICAgICAgcGljdXJsOicuLi9pbWFnZXMvYXBwL3hqZ2wucG5nJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTon5qCh5Lqn566h55CGJyxcclxuICAgICAgcHJhaXNlTnVtOjg1MCxcclxuICAgICAgcGljdXJsOicuLi9pbWFnZXMvYXBwL3hjZ2wucG5nJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTon5pWZ5Yqh5oiQ57upJyxcclxuICAgICAgcHJhaXNlTnVtOjE0NzAsXHJcbiAgICAgIHBpY3VybDonLi4vaW1hZ2VzL2FwcC9qd2NqLnBuZydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6J+e7vOWQiOe0oOi0qCcsXHJcbiAgICAgIHByYWlzZU51bToyMDM1LFxyXG4gICAgICBwaWN1cmw6Jy4uL2ltYWdlcy9hcHAvemhzei5wbmcnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOifmiJDplb/moaPmoYgnLFxyXG4gICAgICBwcmFpc2VOdW06MzUyMCxcclxuICAgICAgcGljdXJsOicuLi9pbWFnZXMvYXBwL2N6ZGEucG5nJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTon5YWa5bu6566h55CGJyxcclxuICAgICAgcHJhaXNlTnVtOjIwMTUsXHJcbiAgICAgIHBpY3VybDonLi4vaW1hZ2VzL2FwcC9kamdsLnBuZydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6J+mXruWNt+iwg+afpScsXHJcbiAgICAgIHByYWlzZU51bTo4NDIsXHJcbiAgICAgIHBpY3VybDonLi4vaW1hZ2VzL2FwcC93amRjLnBuZydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6J+ivvumimOeuoeeQhicsXHJcbiAgICAgIHByYWlzZU51bToxMjAwLFxyXG4gICAgICBwaWN1cmw6Jy4uL2ltYWdlcy9hcHAva3RnbC5wbmcnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOifmoaPmoYjnrqHnkIYnLFxyXG4gICAgICBwcmFpc2VOdW06NjIwLFxyXG4gICAgICBwaWN1cmw6Jy4uL2ltYWdlcy9hcHAvZGFnbC5wbmcnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOifnpL7lm6LnrqHnkIYnLFxyXG4gICAgICBwcmFpc2VOdW06MzA1MixcclxuICAgICAgcGljdXJsOicuLi9pbWFnZXMvYXBwL3N0Z2wucG5nJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgbmFtZTon5a2m5YiG566h55CGJyxcclxuICAgICAgcHJhaXNlTnVtOjYyMCxcclxuICAgICAgcGljdXJsOicuLi9pbWFnZXMvYXBwL3hmZ2wucG5nJ1xyXG4gICAgfVxyXG4gIF07XHJcbiAgLyp2YXIgYXBwU3RyID0gJyc7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcHAubGVuZ3RoOyBpKyspIHtcclxuICAgIGFwcFN0ciArPSAnPGxpIGNsYXNzPVwibGlzdFwiPicgK1xyXG4gICAgICAgICc8aW1nIGNsYXNzPVwiYXBwUGljXCIgc3JjPVwiJyArIGFwcFtpXS5waWN1cmwgKyAnXCIgPicgK1xyXG4gICAgICAgICc8cD48YSB0YXJnZXQ9XCInICsgKGFwcFtpXS5pc0JsYWNrID8gJ19ibGFuayc6JycpICsgICdcIiBocmVmPVwiJyArIChhcHBbaV0udXJsIHx8ICdqYXZhc2NyaXB0OjsnKSArICdcIj4nICsgYXBwW2ldLm5hbWUgKyAnPC9hPjwvcD4nICtcclxuICAgICAgICAnPHAgY2xhc3M9XCJwcmFpc2UgY2xlYXJGaXhcIj48c3BhbiBjbGFzcz1cInphblwiPjwvc3Bhbj4nICsgYXBwW2ldLnByYWlzZU51bSArICfkurrotZ48L3A+JyArXHJcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwidHlwZVwiPui1hOa6kDwvc3Bhbj4nICtcclxuICAgICAgICAnPC9saT4nO1xyXG4gIH0qL1xyXG4gIC8vJCgnLmFwcExpc3QnKS5odG1sKGFwcFN0cik7XHJcbiAgLy8kKCcuYXBwTGlzdCcpLmh0bWwoIHRlbXBsYXRlKCAnYXBwTGlzdF8nICwgeyAnZGF0YScgOiBhcHB9ICkgKTtcclxuICB2YXIgdHlwZUxpc3QgPSBudWxsO1xyXG4gIC8vZ2V0Q2F0ZWdvcnkoKTtcclxuICAvKipcclxuICAgKiDojrflj5ZhcHDmiYDmnInnsbvliKtcclxuICAgKi9cclxuICBmdW5jdGlvbiBnZXRDYXRlZ29yeSgpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybCA6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9hcHAvdHlwZXMnLFxyXG4gICAgICB0eXBlIDonR0VUJyxcclxuICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCBkYXRhIClcclxuICAgICAgICBpZiggZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIgKXtcclxuICAgICAgICAgIGlmKCBkYXRhLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0eXBlTGlzdCA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgICAgbG9hZEFwcERhdGEoICQoXCIjYXBwTGlzdFwiKSAsICdhcHBMaXN0XycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYWxlcnQoXCLojrflj5blupTnlKjliIbnsbvlvILluLhcIilcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0gJG9ialxyXG4gICAqIEBwYXJhbSB0ZW1JZCDmqKHmnb9pZFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGxvYWRBcHBEYXRhKCAkb2JqICwgdGVtSWQpIHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybCA6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9hcHAvbGlzdCcsXHJcbiAgICAgIHR5cGUgOidHRVQnLFxyXG4gICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgY29uc29sZS5sb2coIGRhdGEgKVxyXG4gICAgICAgIGlmKCBkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIiApe1xyXG4gICAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xyXG4gICAgICAgICAgaWYoIGRhdGEuZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICQuZWFjaCggZGF0YS5kYXRhICwgZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgZGF0YS5kYXRhW2luZGV4XS5sb2dvID0gZ2V0UGljUGF0aCggZGF0YS5kYXRhW2luZGV4XS5sb2dvICk7XHJcbiAgICAgICAgICAgICAgZGF0YS5kYXRhW2luZGV4XS5jYXRlZ29yeSA9IGdldFR5cGUoIGRhdGEuZGF0YVtpbmRleF0uY2F0ZWdvcnkgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBodG1sID0gdGVtcGxhdGUoIHRlbUlkICwgZGF0YSApO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGh0bWwgPSBzaG93cHJvbXB0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkb2JqLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBhbGVydChcIuiOt+WPluW6lOeUqOW8guW4uFwiKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gZ2V0VHlwZSggY2F0ZWdvcnkgKXtcclxuICAgIGZvciggdmFyIGkgPSAwIDsgaSA8IHR5cGVMaXN0Lmxlbmd0aCA7IGkrKyApe1xyXG4gICAgICBpZiggY2F0ZWdvcnkgPT0gdHlwZUxpc3RbaV0udmFsdWUgKXtcclxuICAgICAgICByZXR1cm4gdHlwZUxpc3RbaV0ubmFtZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcbiAgZnVuY3Rpb24gZ2V0UGljUGF0aCggaWQgKXtcclxuICAgIHJldHVybiBzZXJ2aWNlLnByZWZpeCArICcvcGYvcmVzL2Rvd25sb2FkLycraWQ7XHJcbiAgfTtcclxufSk7Il19
