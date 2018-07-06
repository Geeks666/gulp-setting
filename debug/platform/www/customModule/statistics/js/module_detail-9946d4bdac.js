'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  define('', ['jquery', 'paging', 'service', 'common'], function ($, paging, service, common) {
    var role_b = common.role;
    var convertRole = { 'city': 'edu', 'county': 'area', 'school': 'school' };
    var role = convertRole[role_b];

    function moduleTable(flag, time, name, scope, pageNo, pageSize, isNext) {
      var spaceTable = 'spaceTable';
      var trColor;
      var pageIsShow = false;
      if (!pageNo) {
        pageIsShow = true;
        pageNo = 1;
      }
      var module_detail = {
        'user': {
          url: service.prefix + '/platform/details?time=' + time + '&scope=' + scope + '&pageSize=' + pageSize + '&pageNo=' + pageNo + '&errorDomId=' + spaceTable,
          tbBody: function tbBody(data, scope) {
            if (scope == 'school') {
              return "<tr class='" + trColor + "'><td>" + data.time.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.today + "</td>" + "<td>" + (data.login.split(' ')[1] || '00:00:00') + "</td>" + "<td>" + data.lastseven + "</td>" + "<td style='border-right:none;'>" + data.lastthirty + "</td></tr>";
            } else if (scope == 'edu') {
              return "<tr class='" + trColor + "'><td>" + data.time.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.total + "</td>" + "<td>" + data.today + "</td>" + "<td>" + data.yesterday + "</td>" + "<td>" + data.lastseven + "</td>" + "<td style='border-right:none;'>" + data.lastthirty + "</td></tr>";
            } else if (scope == 'area') {
              return "<tr class='" + trColor + "'><td>" + data.time.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.total + "</td>" + "<td>" + data.today + "</td>" + "<td>" + data.yesterday + "</td>" + "<td>" + data.lastseven + "</td>" + "<td style='border-right:none;'>" + data.lastthirty + "</td></tr>";
            }
          }
        },
        'space': {
          url: service.prefix + '/space/detail?time=' + time + '&pageSize=' + pageSize + '&pageNo=' + pageNo + '&errorDomId=' + spaceTable,
          tbBody: function tbBody(data, falg) {
            if (falg == "table1") {
              return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.spaceNum + "</td>" + "<td>" + data.openPersonSpaceNum + "</td>" + "<td>" + data.usePersonSpaceNum + "</td>" + "<td>" + data.visitPersonSpaceNum + "</td>" + "<td>" + data.openGroupSpaceNum + "</td>" + "<td style='border-right:none;'>" + data.visitGroupSpaceNum + "</td></tr>";
            } else if (falg == "table2") {
              return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.studentOpenNum + "</td>" + "<td>" + data.studentUseNum + "</td>" + "<td>" + data.parentOpenNum + "</td>" + "<td>" + data.parentUseNum + "</td>" + "<td>" + data.teacherOpenNum + "</td>" + "<td>" + data.teacherUseNum + "</td>" + "<td>" + data.researchOpenNum + "</td>" + "<td style='border-right:0;'>" + data.researchUseNum + "</td></tr>";
            } else if (falg == "table3") {
              return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.schoolOpenNum + "</td>" + "<td>" + data.schoolVisitNum + "</td>" + "<td>" + data.classOpenNum + "</td>" + "<td>" + data.classVisitNum + "</td>" + "<td>" + data.subjectOpenNum + "</td>" + "<td style='border-right:0;'>" + data.subjectVisitNum + "</td></tr>";
            }
            if (falg == "table4") {
              return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.spaceNum + "</td>" + "<td>" + data.openPersonSpaceNum + "</td>" + "<td>" + data.usePersonSpaceNum + "</td>" + "<td>" + data.visitPersonSpaceNum + "</td>" + "<td>" + data.openGroupSpaceNum + "</td>" + "<td style='border-right:none;'>" + data.visitGroupSpaceNum + "</td></tr>";
            } else if (falg == "table5") {
              return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.studentOpenNum + "</td>" + "<td>" + data.studentUseNum + "</td>" + "<td>" + data.parentOpenNum + "</td>" + "<td>" + data.parentUseNum + "</td>" + "<td>" + data.teacherOpenNum + "</td>" + "<td style='border-right:0;'>" + data.teacherUseNum + "</td></tr>";
            } else if (falg == "table6") {
              return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>" + data.classOpenNum + "</td>" + "<td>" + data.classVisitNum + "</td>" + "<td>" + data.subjectOpenNum + "</td>" + "<td style='border-right:0;'>" + data.subjectVisitNum + "</td></tr>";
            }
          }
        },
        'app': {
          /**
           * @description 应用数据明细
           * @param  time  String  时间(格式：YYYY-MM-DD)
           * @param  name  String  应用名称
           */
          url: service.prefix + '/application/' + time + '/details?name=' + name + '&pageSize=' + pageSize + '&pageNo=' + pageNo + '&errorDomId=' + spaceTable,
          tbBody: function tbBody(data) {
            return "<tr class='" + trColor + "'><td style='padding:0 25px;text-align: left;'>" + data.name + "</td>" + "<td>" + data.person + "</td>" + "<td>" + data.visit + "</td>" + "<td style='border-right:none;'>" + data.ratio + "</td></tr>";
          }
        },
        'resource': {
          /**
           * @description 资源统计明细
           * @param  time : 日期, 格式为:yyyy-MM-dd
           * @param  pageSize:每页大小
           * @param  pageNo：请求页数，最小为1
           */
          url: service.prefix + '/resource/' + time + '/details?pageSize=' + pageSize + '&pageNo=' + pageNo + '&errorDomId=' + spaceTable,
          tbBody: function tbBody(data) {
            return "<tr class='" + trColor + "'><td>" + data.date + "</td>" + "<td>" + data.area + "</td>" + "<td>" + data.resTotal + "</td>" + "<td>" + data.syncTotal + "</td>" + "<td>" + data.ugcTotal + "</td>" + "<td>" + data.downloadCount + "</td>" + "<td>" + data.collectCount + "</td>" + "<td>" + data.userCount + "</td>" + "<td style='border-right:none;'>" + data.perUserRes + "</td></tr>";
          }
        }
      };
      var _tabVal = $('.tab').attr('data-value');
      url = module_detail[flag].url;
      $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        success: function success(json) {
          var html = "",
              html1 = "",
              html2 = "",
              html3 = "",
              html4 = "",
              html5 = "",
              html6 = "",
              userhtml = "";
          if (json['code'] == 200) {
            if (json.data.dataList.length > 0) {
              $.each(json.data.dataList, function (i, n) {
                if (i % 2 == 0) {
                  trColor = "odd";
                } else {
                  trColor = "even";
                }
                if (flag == 'space') {
                  if (pageNo == json.data.pageCount && i == json.data.dataList.length - 1) return;
                }
                html += module_detail[flag].tbBody(n);

                if (_tabVal == 1 || !isNext) {
                  html1 += module_detail[flag].tbBody(n, "table1");
                  html4 += module_detail[flag].tbBody(n, "table4");
                }
                if (_tabVal == 2 || !isNext) {
                  html2 += module_detail[flag].tbBody(n, "table2");
                  html5 += module_detail[flag].tbBody(n, "table5");
                }
                if (_tabVal == 3 || !isNext) {
                  html3 += module_detail[flag].tbBody(n, "table3");
                  html6 += module_detail[flag].tbBody(n, "table6");
                }

                userhtml += module_detail[flag].tbBody(n, scope);
              });
              if (flag == 'space' && _tabVal == 1 && pageNo == json.data.pageCount) {
                $('.tableTotal0').html('<div class="total">合计</div>\
                <div class="total1">' + json.data.dataList[json.data.dataList.length - 1].spaceTotal + '</div>\
              <div class="total2">' + json.data.dataList[json.data.dataList.length - 1].openPersonSpaceTotal + '</div>\
              <div class="total2">' + json.data.dataList[json.data.dataList.length - 1].usePersonSpaceTotal + '</div>\
              <div class="total2">' + json.data.dataList[json.data.dataList.length - 1].visitPersonSpaceTotal + '</div>\
              <div class="total2">' + json.data.dataList[json.data.dataList.length - 1].openGroupSpaceTotal + '</div>\
              <div class="total2" style="border-right:none;">' + json.data.dataList[json.data.dataList.length - 1].visitGroupSpaceTotal + '</div>').show();
              } else {
                $('.tableTotal0').hide();
              }
              // 用户分页
              if (json.data.pageCount > 1 && pageIsShow) {
                $('#pageToolUser' + scope).html('');
                var pageToolUserCity = new paging();
                pageToolUserCity.init({
                  target: '#pageToolUser' + scope, pagesize: 10, pageCount: 8,
                  count: json.data.totalSize, callback: function callback(current) {
                    moduleTable('user', $('#date').val(), '', role, current, '10');
                  }
                });
              } else if (json.data.pageCount == 1) {
                $('#pageToolUser' + scope).html('');
              }
              // 空间分页
              if (json.data.pageCount > 1 && pageIsShow) {
                var arr = ['#pageToolAllcity', '#pageToolPresoncity', '#pageToolgrounpcity', '#pageToolAllcounty', '#pageToolPresoncounty', '#pageToolgrounpcounty'];
                for (var i = 0; i < arr.length; i++) {
                  $(arr[i]).html('');
                  var pageToolAllcity = new paging();
                  pageToolAllcity.init({
                    target: arr[i], pagesize: 10, pageCount: 8,
                    count: json.data.totalSize, callback: function callback(current) {
                      moduleTable('space', $('#date').val(), '', '', current, '10', 'true');
                    }
                  });
                }
              } else if (json.data.pageCount == 1) {
                var arr1 = ['#pageToolAllcity', '#pageToolPresoncity', '#pageToolgrounpcity', '#pageToolAllcounty', '#pageToolPresoncounty', '#pageToolgrounpcounty'];
                for (var i = 0; i < arr1.length; i++) {
                  $(arr1[i]).html('');
                }
              }

              // 资源分页
              if (json.data.pageCount > 1 && pageIsShow) {
                $('#pageTool1Res').html('');
                var pageTool1Res = new paging();
                pageTool1Res.init({
                  target: '#pageTool1Res', pagesize: 10, pageCount: 8,
                  count: json.data.totalSize, callback: function callback(current) {
                    moduleTable('resource', $('#date').val(), '', '', current, '10');
                  }
                });
              } else if (json.data.pageCount == 1) {
                $('#pageTool1Res').html('');
              }

              // 应用分页
              if (json.data.pageCount > 1 && pageIsShow) {
                $('#pageTool1App').html('');
                var pageTool1App = new paging();
                pageTool1App.init({
                  target: '#pageTool1App', pagesize: 10, pageCount: 8,
                  count: json.data.totalSize, callback: function callback(current) {
                    moduleTable('app', $('#date').val(), name, '', current, '10');
                  }
                });
              } else if (json.data.pageCount == 1) {
                $('#pageTool1App').html('');
              }
            }
          }

          if (flag == 'space') {
            if (_tabVal == 1 || !isNext) {
              $("#tableSpace1 tbody").html(html1);
              $("#tableSpace4 tbody").html(html4);
            }
            if (_tabVal == 2 || !isNext) {
              $("#tableSpace2 tbody").html(html2);
              $("#tableSpace5 tbody").html(html5);
            }
            if (_tabVal == 3 || !isNext) {
              $("#tableSpace3 tbody").html(html3);
              $("#tableSpace6 tbody").html(html6);
            }
          }
          if (flag == 'resource') {
            $('#spaceTableRes tbody').html(html);
          }
          if (flag == 'app') {
            $('#spaceTableApp tbody').html(html);
          }
          if (flag == 'user') {
            $('#table_' + scope + ' tbody').html(userhtml);
          }
          if ($('.tableWrap table tbody tr').length == 0) {
            $('.tableWrap table tbody').empty().append('<div id="empty_info"><div><p>没有相关内容</p></div></div>');
            $('.tableWrap table').next().empty();
            $('.tableWrap').find('#pageToolAllcity').empty();
          }
        }
      });
    }

    $('body').on('tabChange', '.tab', function () {
      $('#tableSpace' + $(this).attr('data-value')).show().siblings().hide();
      $('#tableSpace' + (+$(this).attr('data-value') + 3)).show().siblings().hide();
    });

    $('body').on('click', '#date', function () {
      laydate({ isclear: false, istoday: false, max: laydate.now(-1) });
    });
    $('#date').val(laydate.now(-1));

    // 资源日期
    $('body').on('click', '.dateResBtn', function () {
      var restime = $('#date').val();
      moduleTable('resource', restime, '', '', '', '10');
    });
    $('.dateResBtn').trigger('click');

    //应用日期
    $('body').on('click', '.dateAppBtn', function () {
      var restime = $('#date').val();
      moduleTable('app', restime, encodeURIComponent($('.input-serarch').val()), '', '', '10');
    });
    $('.dateAppBtn').trigger('click');

    // 空间日期
    $('body').on('click', '.dateSpaceBtn', function () {
      var restime = $('#date').val();
      moduleTable('space', restime, '', '', '', '10');
    });
    $('.dateSpaceBtn').trigger('click');

    // 用户日期
    $('body').on('click', '.dateUserBtn', function () {
      var restime = $('#date').val();
      moduleTable('user', restime, '', role, '', '10');
    });
    $('.dateUserBtn').trigger('click');

    /**
     * 数据导出
     * @param type person:用户; app:应用;space:空间;resource:资源
     * @param scope 获取用户时:area:导出区域数据(市级管理员);school:导出学校数据(区县管理员);person:导出用户数据(学校管理员)
     *              获取空间时:all:全部空间;person:个人空间 group:群组空间
     *              获取资源时:area:导出区域数据;school:导出学校数据
     * @param time 时间(格式 yyyy-mm-dd)
     */
    function exportData(type, scope, time) {
      var extra = '?type=' + type + '&time=' + time;
      if (scope) extra += '&scope=' + scope;
      location.href = service.prefix + '/export' + extra;
    }

    $('body').on('click', '.wrapTableTopExport', function () {
      var type = $(this).parents('body').attr('data-module');
      var scope = '';
      if (type === 'person') {
        switch (role_b) {
          case 'city':
            scope = 'area';
            break;
          case 'county':
            scope = 'school';
            break;
          case 'school':
            scope = 'person';
            break;
          default:
            scope = 'area';
        }
      } else if (type === 'space') {
        var currentTab = $('.tab').attr('data-value');
        switch (currentTab) {
          case '1':
            scope = 'all';
            break;
          case '2':
            scope = 'person';
            break;
          case '3':
            scope = 'group';
            break;
          default:
            scope = 'all';
        }
      } else if (type === 'resource') {
        switch (role_b) {
          case 'city':
            scope = 'area';
            break;
          case 'county':
            scope = 'school';
            break;
          default:
            scope = 'area';
        }
      }
      var time = $(this).parents().find('.laydate-icon').val();
      exportData(type, scope, time);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL21vZHVsZV9kZXRhaWwuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInBhZ2luZyIsInNlcnZpY2UiLCJjb21tb24iLCJyb2xlX2IiLCJyb2xlIiwiY29udmVydFJvbGUiLCJtb2R1bGVUYWJsZSIsImZsYWciLCJ0aW1lIiwibmFtZSIsInNjb3BlIiwicGFnZU5vIiwicGFnZVNpemUiLCJpc05leHQiLCJzcGFjZVRhYmxlIiwidHJDb2xvciIsInBhZ2VJc1Nob3ciLCJtb2R1bGVfZGV0YWlsIiwidXJsIiwicHJlZml4IiwidGJCb2R5IiwiZGF0YSIsInNwbGl0IiwidG9kYXkiLCJsb2dpbiIsImxhc3RzZXZlbiIsImxhc3R0aGlydHkiLCJ0b3RhbCIsInllc3RlcmRheSIsImZhbGciLCJjcmVhdGVEYXRlIiwic3BhY2VOdW0iLCJvcGVuUGVyc29uU3BhY2VOdW0iLCJ1c2VQZXJzb25TcGFjZU51bSIsInZpc2l0UGVyc29uU3BhY2VOdW0iLCJvcGVuR3JvdXBTcGFjZU51bSIsInZpc2l0R3JvdXBTcGFjZU51bSIsInN0dWRlbnRPcGVuTnVtIiwic3R1ZGVudFVzZU51bSIsInBhcmVudE9wZW5OdW0iLCJwYXJlbnRVc2VOdW0iLCJ0ZWFjaGVyT3Blbk51bSIsInRlYWNoZXJVc2VOdW0iLCJyZXNlYXJjaE9wZW5OdW0iLCJyZXNlYXJjaFVzZU51bSIsInNjaG9vbE9wZW5OdW0iLCJzY2hvb2xWaXNpdE51bSIsImNsYXNzT3Blbk51bSIsImNsYXNzVmlzaXROdW0iLCJzdWJqZWN0T3Blbk51bSIsInN1YmplY3RWaXNpdE51bSIsInBlcnNvbiIsInZpc2l0IiwicmF0aW8iLCJkYXRlIiwiYXJlYSIsInJlc1RvdGFsIiwic3luY1RvdGFsIiwidWdjVG90YWwiLCJkb3dubG9hZENvdW50IiwiY29sbGVjdENvdW50IiwidXNlckNvdW50IiwicGVyVXNlclJlcyIsIl90YWJWYWwiLCJhdHRyIiwiYWpheCIsInR5cGUiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJqc29uIiwiaHRtbCIsImh0bWwxIiwiaHRtbDIiLCJodG1sMyIsImh0bWw0IiwiaHRtbDUiLCJodG1sNiIsInVzZXJodG1sIiwiZGF0YUxpc3QiLCJsZW5ndGgiLCJlYWNoIiwiaSIsIm4iLCJwYWdlQ291bnQiLCJzcGFjZVRvdGFsIiwib3BlblBlcnNvblNwYWNlVG90YWwiLCJ1c2VQZXJzb25TcGFjZVRvdGFsIiwidmlzaXRQZXJzb25TcGFjZVRvdGFsIiwib3Blbkdyb3VwU3BhY2VUb3RhbCIsInZpc2l0R3JvdXBTcGFjZVRvdGFsIiwic2hvdyIsImhpZGUiLCJwYWdlVG9vbFVzZXJDaXR5IiwiaW5pdCIsInRhcmdldCIsInBhZ2VzaXplIiwiY291bnQiLCJ0b3RhbFNpemUiLCJjYWxsYmFjayIsImN1cnJlbnQiLCJ2YWwiLCJhcnIiLCJwYWdlVG9vbEFsbGNpdHkiLCJhcnIxIiwicGFnZVRvb2wxUmVzIiwicGFnZVRvb2wxQXBwIiwiZW1wdHkiLCJhcHBlbmQiLCJuZXh0IiwiZmluZCIsIm9uIiwic2libGluZ3MiLCJsYXlkYXRlIiwiaXNjbGVhciIsImlzdG9kYXkiLCJtYXgiLCJub3ciLCJyZXN0aW1lIiwidHJpZ2dlciIsImVuY29kZVVSSUNvbXBvbmVudCIsImV4cG9ydERhdGEiLCJleHRyYSIsImxvY2F0aW9uIiwiaHJlZiIsInBhcmVudHMiLCJjdXJyZW50VGFiIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsV0FBUyxLQURJO0FBRWJDLFNBQU87QUFDTCxrQkFBYztBQURUO0FBRk0sQ0FBZjtBQU1BSCxRQUFRLENBQUMsWUFBRCxDQUFSLEVBQXdCLFVBQVVJLFdBQVYsRUFBdUI7QUFDN0M7QUFDQUosVUFBUUMsTUFBUixDQUFlRyxXQUFmO0FBQ0FDLFNBQU8sRUFBUCxFQUFXLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIs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QixFQUF3Q1QsR0FBeEMsRUFBWDtBQUNBb0IsaUJBQVd0RCxJQUFYLEVBQWlCeEQsS0FBakIsRUFBd0JGLElBQXhCO0FBQ0QsS0E5Q0Q7QUFnREQsR0FqV0g7QUFrV0QsQ0FyV0QiLCJmaWxlIjoiY3VzdG9tTW9kdWxlL3N0YXRpc3RpY3MvanMvbW9kdWxlX2RldGFpbC05OTQ2ZDRiZGFjLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZS5jb25maWcoe1xyXG4gIGJhc2VVcmw6ICcuLi8nLFxyXG4gIHBhdGhzOiB7XHJcbiAgICAnY3VzdG9tQ29uZic6ICdzdGF0aXN0aWNzL2pzL2N1c3RvbUNvbmYuanMnXHJcbiAgfVxyXG59KTtcclxucmVxdWlyZShbJ2N1c3RvbUNvbmYnXSwgZnVuY3Rpb24gKGNvbmZpZ3BhdGhzKSB7XHJcbiAgLy8gY29uZmlncGF0aHMucGF0aHMuZGlhbG9nID0gXCJteXNwYWNlL2pzL2FwcERpYWxvZy5qc1wiO1xyXG4gIHJlcXVpcmUuY29uZmlnKGNvbmZpZ3BhdGhzKTtcclxuICBkZWZpbmUoJycsIFsnanF1ZXJ5JywgJ3BhZ2luZycsICdzZXJ2aWNlJywgJ2NvbW1vbiddLFxyXG4gICAgZnVuY3Rpb24gKCQsIHBhZ2luZywgc2VydmljZSwgY29tbW9uKSB7XHJcbiAgICAgIHZhciByb2xlX2IgPSBjb21tb24ucm9sZTtcclxuICAgICAgdmFyIGNvbnZlcnRSb2xlID0geydjaXR5JzogJ2VkdScsICdjb3VudHknOiAnYXJlYScsICdzY2hvb2wnOiAnc2Nob29sJ307XHJcbiAgICAgIHZhciByb2xlID0gY29udmVydFJvbGVbcm9sZV9iXTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIG1vZHVsZVRhYmxlKGZsYWcsIHRpbWUsIG5hbWUsIHNjb3BlLCBwYWdlTm8sIHBhZ2VTaXplLCBpc05leHQpIHtcclxuICAgICAgICB2YXIgc3BhY2VUYWJsZSA9ICdzcGFjZVRhYmxlJztcclxuICAgICAgICB2YXIgdHJDb2xvcjtcclxuICAgICAgICB2YXIgcGFnZUlzU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghcGFnZU5vKSB7XHJcbiAgICAgICAgICBwYWdlSXNTaG93ID0gdHJ1ZTtcclxuICAgICAgICAgIHBhZ2VObyA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBtb2R1bGVfZGV0YWlsID0ge1xyXG4gICAgICAgICAgJ3VzZXInOiB7XHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5wcmVmaXggKyAnL3BsYXRmb3JtL2RldGFpbHM/dGltZT0nICsgdGltZSArICcmc2NvcGU9JyArIHNjb3BlICsgJyZwYWdlU2l6ZT0nICsgcGFnZVNpemUgK1xyXG4gICAgICAgICAgICAnJnBhZ2VObz0nICsgcGFnZU5vICsgJyZlcnJvckRvbUlkPScgKyBzcGFjZVRhYmxlLFxyXG4gICAgICAgICAgICB0YkJvZHk6IGZ1bmN0aW9uIChkYXRhLCBzY29wZSkge1xyXG4gICAgICAgICAgICAgIGlmIChzY29wZSA9PSAnc2Nob29sJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPHRyIGNsYXNzPSdcIiArIHRyQ29sb3IgKyBcIic+PHRkPlwiICsgZGF0YS50aW1lLnNwbGl0KFwiIFwiKVswXSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5uYW1lICsgXCI8L3RkPlwiICsgXCI8dGQ+XCJcclxuICAgICAgICAgICAgICAgICAgKyBkYXRhLnRvZGF5ICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyAoZGF0YS5sb2dpbi5zcGxpdCgnICcpWzFdIHx8ICcwMDowMDowMCcpICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLmxhc3RzZXZlbiArIFwiPC90ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgIFwiPHRkIHN0eWxlPSdib3JkZXItcmlnaHQ6bm9uZTsnPlwiICsgZGF0YS5sYXN0dGhpcnR5ICsgXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY29wZSA9PSAnZWR1Jykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPHRyIGNsYXNzPSdcIiArIHRyQ29sb3IgKyBcIic+PHRkPlwiICsgZGF0YS50aW1lLnNwbGl0KFwiIFwiKVswXSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5uYW1lICsgXCI8L3RkPlwiICsgXCI8dGQ+XCJcclxuICAgICAgICAgICAgICAgICAgKyBkYXRhLnRvdGFsICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLnRvZGF5ICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLnllc3RlcmRheSArIFwiPC90ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgIFwiPHRkPlwiICsgZGF0YS5sYXN0c2V2ZW4gKyBcIjwvdGQ+XCIgKyBcIjx0ZCBzdHlsZT0nYm9yZGVyLXJpZ2h0Om5vbmU7Jz5cIiArIGRhdGEubGFzdHRoaXJ0eSArXHJcbiAgICAgICAgICAgICAgICAgIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2NvcGUgPT0gJ2FyZWEnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCI8dHIgY2xhc3M9J1wiICsgdHJDb2xvciArIFwiJz48dGQ+XCIgKyBkYXRhLnRpbWUuc3BsaXQoXCIgXCIpWzBdICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLm5hbWUgKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIlxyXG4gICAgICAgICAgICAgICAgICArIGRhdGEudG90YWwgKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEudG9kYXkgKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEueWVzdGVyZGF5ICsgXCI8L3RkPlwiICtcclxuICAgICAgICAgICAgICAgICAgXCI8dGQ+XCIgKyBkYXRhLmxhc3RzZXZlbiArIFwiPC90ZD5cIiArIFwiPHRkIHN0eWxlPSdib3JkZXItcmlnaHQ6bm9uZTsnPlwiICsgZGF0YS5sYXN0dGhpcnR5ICtcclxuICAgICAgICAgICAgICAgICAgXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgJ3NwYWNlJzoge1xyXG4gICAgICAgICAgICB1cmw6IHNlcnZpY2UucHJlZml4ICsgJy9zcGFjZS9kZXRhaWw/dGltZT0nICsgdGltZSArICcmcGFnZVNpemU9JyArIHBhZ2VTaXplICsgJyZwYWdlTm89JyArIHBhZ2VObyArXHJcbiAgICAgICAgICAgICcmZXJyb3JEb21JZD0nICsgc3BhY2VUYWJsZSxcclxuICAgICAgICAgICAgdGJCb2R5OiBmdW5jdGlvbiAoZGF0YSwgZmFsZykge1xyXG4gICAgICAgICAgICAgIGlmIChmYWxnID09IFwidGFibGUxXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIjx0ciBjbGFzcz0nXCIgKyB0ckNvbG9yICsgXCInPjx0ZD5cIiArIGRhdGEuY3JlYXRlRGF0ZS5zcGxpdChcIiBcIilbMF0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEubmFtZVxyXG4gICAgICAgICAgICAgICAgICArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5zcGFjZU51bSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5vcGVuUGVyc29uU3BhY2VOdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEudXNlUGVyc29uU3BhY2VOdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEudmlzaXRQZXJzb25TcGFjZU51bSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICtcclxuICAgICAgICAgICAgICAgICAgZGF0YS5vcGVuR3JvdXBTcGFjZU51bSArIFwiPC90ZD5cIiArIFwiPHRkIHN0eWxlPSdib3JkZXItcmlnaHQ6bm9uZTsnPlwiICsgZGF0YS52aXNpdEdyb3VwU3BhY2VOdW0gKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZhbGcgPT0gXCJ0YWJsZTJcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPHRyIGNsYXNzPSdcIiArIHRyQ29sb3IgKyBcIic+PHRkPlwiICsgZGF0YS5jcmVhdGVEYXRlLnNwbGl0KFwiIFwiKVswXSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLnN0dWRlbnRPcGVuTnVtICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLnN0dWRlbnRVc2VOdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEucGFyZW50T3Blbk51bSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5wYXJlbnRVc2VOdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEudGVhY2hlck9wZW5OdW0gK1xyXG4gICAgICAgICAgICAgICAgICBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEudGVhY2hlclVzZU51bSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5yZXNlYXJjaE9wZW5OdW0gKyBcIjwvdGQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICBcIjx0ZCBzdHlsZT0nYm9yZGVyLXJpZ2h0OjA7Jz5cIiArIGRhdGEucmVzZWFyY2hVc2VOdW0gKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZhbGcgPT0gXCJ0YWJsZTNcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPHRyIGNsYXNzPSdcIiArIHRyQ29sb3IgKyBcIic+PHRkPlwiICsgZGF0YS5jcmVhdGVEYXRlLnNwbGl0KFwiIFwiKVswXSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLnNjaG9vbE9wZW5OdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEuc2Nob29sVmlzaXROdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuY2xhc3NPcGVuTnVtICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLmNsYXNzVmlzaXROdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEuc3ViamVjdE9wZW5OdW0gK1xyXG4gICAgICAgICAgICAgICAgICBcIjwvdGQ+XCIgKyBcIjx0ZCBzdHlsZT0nYm9yZGVyLXJpZ2h0OjA7Jz5cIiArIGRhdGEuc3ViamVjdFZpc2l0TnVtICsgXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChmYWxnID09IFwidGFibGU0XCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIjx0ciBjbGFzcz0nXCIgKyB0ckNvbG9yICsgXCInPjx0ZD5cIiArIGRhdGEuY3JlYXRlRGF0ZS5zcGxpdChcIiBcIilbMF0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEubmFtZVxyXG4gICAgICAgICAgICAgICAgICArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5zcGFjZU51bSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5vcGVuUGVyc29uU3BhY2VOdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEudXNlUGVyc29uU3BhY2VOdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEudmlzaXRQZXJzb25TcGFjZU51bSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICtcclxuICAgICAgICAgICAgICAgICAgZGF0YS5vcGVuR3JvdXBTcGFjZU51bSArIFwiPC90ZD5cIiArIFwiPHRkIHN0eWxlPSdib3JkZXItcmlnaHQ6bm9uZTsnPlwiICsgZGF0YS52aXNpdEdyb3VwU3BhY2VOdW0gKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZhbGcgPT0gXCJ0YWJsZTVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPHRyIGNsYXNzPSdcIiArIHRyQ29sb3IgKyBcIic+PHRkPlwiICsgZGF0YS5jcmVhdGVEYXRlLnNwbGl0KFwiIFwiKVswXSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLnN0dWRlbnRPcGVuTnVtICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLnN0dWRlbnRVc2VOdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEucGFyZW50T3Blbk51bSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS5wYXJlbnRVc2VOdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEudGVhY2hlck9wZW5OdW0gK1xyXG4gICAgICAgICAgICAgICAgICBcIjwvdGQ+XCIgKyBcIjx0ZCBzdHlsZT0nYm9yZGVyLXJpZ2h0OjA7Jz5cIiArIGRhdGEudGVhY2hlclVzZU51bSArIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmFsZyA9PSBcInRhYmxlNlwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCI8dHIgY2xhc3M9J1wiICsgdHJDb2xvciArIFwiJz48dGQ+XCIgKyBkYXRhLmNyZWF0ZURhdGUuc3BsaXQoXCIgXCIpWzBdICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLm5hbWVcclxuICAgICAgICAgICAgICAgICAgKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEuY2xhc3NPcGVuTnVtICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLmNsYXNzVmlzaXROdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuc3ViamVjdE9wZW5OdW0gKyBcIjwvdGQ+XCIgKyBcIjx0ZCBzdHlsZT0nYm9yZGVyLXJpZ2h0OjA7Jz5cIiArIGRhdGEuc3ViamVjdFZpc2l0TnVtICsgXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgJ2FwcCc6IHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvbiDlupTnlKjmlbDmja7mmI7nu4ZcclxuICAgICAgICAgICAgICogQHBhcmFtICB0aW1lICBTdHJpbmcgIOaXtumXtCjmoLzlvI/vvJpZWVlZLU1NLUREKVxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gIG5hbWUgIFN0cmluZyAg5bqU55So5ZCN56ewXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB1cmw6IHNlcnZpY2UucHJlZml4ICsgJy9hcHBsaWNhdGlvbi8nICsgdGltZSArICcvZGV0YWlscz9uYW1lPScgKyBuYW1lICsgJyZwYWdlU2l6ZT0nICsgcGFnZVNpemUgK1xyXG4gICAgICAgICAgICAnJnBhZ2VObz0nICsgcGFnZU5vICsgJyZlcnJvckRvbUlkPScgKyBzcGFjZVRhYmxlLFxyXG4gICAgICAgICAgICB0YkJvZHk6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFwiPHRyIGNsYXNzPSdcIiArIHRyQ29sb3IgKyBcIic+PHRkIHN0eWxlPSdwYWRkaW5nOjAgMjVweDt0ZXh0LWFsaWduOiBsZWZ0Oyc+XCIgKyBkYXRhLm5hbWUgKyBcIjwvdGQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgXCI8dGQ+XCIgKyBkYXRhLnBlcnNvbiArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS52aXNpdCArIFwiPC90ZD5cIiArIFwiPHRkIHN0eWxlPSdib3JkZXItcmlnaHQ6bm9uZTsnPlwiICtcclxuICAgICAgICAgICAgICAgIGRhdGEucmF0aW8gKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgICdyZXNvdXJjZSc6IHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvbiDotYTmupDnu5/orqHmmI7nu4ZcclxuICAgICAgICAgICAgICogQHBhcmFtICB0aW1lIDog5pel5pyfLCDmoLzlvI/kuLo6eXl5eS1NTS1kZFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gIHBhZ2VTaXplOuavj+mhteWkp+Wwj1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0gIHBhZ2VOb++8muivt+axgumhteaVsO+8jOacgOWwj+S4ujFcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5wcmVmaXggKyAnL3Jlc291cmNlLycgKyB0aW1lICsgJy9kZXRhaWxzP3BhZ2VTaXplPScgKyBwYWdlU2l6ZSArICcmcGFnZU5vPScgKyBwYWdlTm8gK1xyXG4gICAgICAgICAgICAnJmVycm9yRG9tSWQ9JyArIHNwYWNlVGFibGUsXHJcbiAgICAgICAgICAgIHRiQm9keTogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gXCI8dHIgY2xhc3M9J1wiICsgdHJDb2xvciArIFwiJz48dGQ+XCIgKyBkYXRhLmRhdGUgKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEuYXJlYSArIFwiPC90ZD5cIiArIFwiPHRkPlwiICtcclxuICAgICAgICAgICAgICAgIGRhdGEucmVzVG90YWwgKyBcIjwvdGQ+XCIgKyBcIjx0ZD5cIiArIGRhdGEuc3luY1RvdGFsICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLnVnY1RvdGFsICsgXCI8L3RkPlwiICsgXCI8dGQ+XCJcclxuICAgICAgICAgICAgICAgICsgZGF0YS5kb3dubG9hZENvdW50ICsgXCI8L3RkPlwiICsgXCI8dGQ+XCIgKyBkYXRhLmNvbGxlY3RDb3VudCArIFwiPC90ZD5cIiArIFwiPHRkPlwiICsgZGF0YS51c2VyQ291bnQgKyBcIjwvdGQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgXCI8dGQgc3R5bGU9J2JvcmRlci1yaWdodDpub25lOyc+XCIgKyBkYXRhLnBlclVzZXJSZXMgKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIF90YWJWYWwgPSAkKCcudGFiJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgICAgIHVybCA9IG1vZHVsZV9kZXRhaWxbZmxhZ10udXJsO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxyXG4gICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoanNvbikge1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCIsIGh0bWwxID0gXCJcIiwgaHRtbDIgPSBcIlwiLCBodG1sMyA9IFwiXCIsIGh0bWw0ID0gXCJcIiwgaHRtbDUgPSBcIlwiLCBodG1sNiA9IFwiXCIsIHVzZXJodG1sID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKGpzb25bJ2NvZGUnXSA9PSAyMDApIHtcclxuICAgICAgICAgICAgICBpZiAoanNvbi5kYXRhLmRhdGFMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQuZWFjaChqc29uLmRhdGEuZGF0YUxpc3QsIGZ1bmN0aW9uIChpLCBuKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChpICUgMiA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJDb2xvciA9IFwib2RkXCI7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJDb2xvciA9IFwiZXZlblwiO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGlmIChmbGFnID09ICdzcGFjZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKHBhZ2VObyA9PSBqc29uLmRhdGEucGFnZUNvdW50KSAmJiAoaSA9PSBqc29uLmRhdGEuZGF0YUxpc3QubGVuZ3RoIC0gMSkpIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBodG1sICs9IG1vZHVsZV9kZXRhaWxbZmxhZ10udGJCb2R5KG4pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKF90YWJWYWwgPT0gMSB8fCAhaXNOZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbDEgKz0gbW9kdWxlX2RldGFpbFtmbGFnXS50YkJvZHkobiwgXCJ0YWJsZTFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbDQgKz0gbW9kdWxlX2RldGFpbFtmbGFnXS50YkJvZHkobiwgXCJ0YWJsZTRcIik7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKF90YWJWYWwgPT0gMiB8fCAhaXNOZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbDIgKz0gbW9kdWxlX2RldGFpbFtmbGFnXS50YkJvZHkobiwgXCJ0YWJsZTJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbDUgKz0gbW9kdWxlX2RldGFpbFtmbGFnXS50YkJvZHkobiwgXCJ0YWJsZTVcIik7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgaWYgKF90YWJWYWwgPT0gMyB8fCAhaXNOZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbDMgKz0gbW9kdWxlX2RldGFpbFtmbGFnXS50YkJvZHkobiwgXCJ0YWJsZTNcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbDYgKz0gbW9kdWxlX2RldGFpbFtmbGFnXS50YkJvZHkobiwgXCJ0YWJsZTZcIik7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIHVzZXJodG1sICs9IG1vZHVsZV9kZXRhaWxbZmxhZ10udGJCb2R5KG4sIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZsYWcgPT0gJ3NwYWNlJyAmJiBfdGFiVmFsID09IDEgJiYgcGFnZU5vID09IGpzb24uZGF0YS5wYWdlQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgJCgnLnRhYmxlVG90YWwwJylcclxuICAgICAgICAgICAgICAgICAgICAuaHRtbCgnPGRpdiBjbGFzcz1cInRvdGFsXCI+5ZCI6K6hPC9kaXY+XFxcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3RhbDFcIj4nICsganNvbi5kYXRhLmRhdGFMaXN0W2pzb24uZGF0YS5kYXRhTGlzdC5sZW5ndGggLSAxXS5zcGFjZVRvdGFsICsgJzwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdGFsMlwiPicgKyBqc29uLmRhdGEuZGF0YUxpc3RbanNvbi5kYXRhLmRhdGFMaXN0Lmxlbmd0aCAtIDFdLm9wZW5QZXJzb25TcGFjZVRvdGFsICsgJzwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdGFsMlwiPicgKyBqc29uLmRhdGEuZGF0YUxpc3RbanNvbi5kYXRhLmRhdGFMaXN0Lmxlbmd0aCAtIDFdLnVzZVBlcnNvblNwYWNlVG90YWwgKyAnPC9kaXY+XFxcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG90YWwyXCI+JyArIGpzb24uZGF0YS5kYXRhTGlzdFtqc29uLmRhdGEuZGF0YUxpc3QubGVuZ3RoIC0gMV0udmlzaXRQZXJzb25TcGFjZVRvdGFsICsgJzwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdGFsMlwiPicgKyBqc29uLmRhdGEuZGF0YUxpc3RbanNvbi5kYXRhLmRhdGFMaXN0Lmxlbmd0aCAtIDFdLm9wZW5Hcm91cFNwYWNlVG90YWwgKyAnPC9kaXY+XFxcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG90YWwyXCIgc3R5bGU9XCJib3JkZXItcmlnaHQ6bm9uZTtcIj4nICsganNvbi5kYXRhLmRhdGFMaXN0W2pzb24uZGF0YS5kYXRhTGlzdC5sZW5ndGggLSAxXS52aXNpdEdyb3VwU3BhY2VUb3RhbCArICc8L2Rpdj4nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAkKCcudGFibGVUb3RhbDAnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDnlKjmiLfliIbpobVcclxuICAgICAgICAgICAgICAgIGlmIChqc29uLmRhdGEucGFnZUNvdW50ID4gMSAmJiBwYWdlSXNTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICQoJyNwYWdlVG9vbFVzZXInICsgc2NvcGUpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgcGFnZVRvb2xVc2VyQ2l0eSA9IG5ldyBwYWdpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgcGFnZVRvb2xVc2VyQ2l0eS5pbml0KHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICcjcGFnZVRvb2xVc2VyJyArIHNjb3BlLCBwYWdlc2l6ZTogMTAsIHBhZ2VDb3VudDogOCxcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDoganNvbi5kYXRhLnRvdGFsU2l6ZSwgY2FsbGJhY2s6IGZ1bmN0aW9uIChjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVUYWJsZSgndXNlcicsICQoJyNkYXRlJykudmFsKCksICcnLCByb2xlLCBjdXJyZW50LCAnMTAnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChqc29uLmRhdGEucGFnZUNvdW50ID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgJCgnI3BhZ2VUb29sVXNlcicgKyBzY29wZSkuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDnqbrpl7TliIbpobVcclxuICAgICAgICAgICAgICAgIGlmIChqc29uLmRhdGEucGFnZUNvdW50ID4gMSAmJiBwYWdlSXNTaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBbJyNwYWdlVG9vbEFsbGNpdHknLCAnI3BhZ2VUb29sUHJlc29uY2l0eScsICcjcGFnZVRvb2xncm91bnBjaXR5JywgJyNwYWdlVG9vbEFsbGNvdW50eSdcclxuICAgICAgICAgICAgICAgICAgICAsICcjcGFnZVRvb2xQcmVzb25jb3VudHknLCAnI3BhZ2VUb29sZ3JvdW5wY291bnR5J107XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChhcnJbaV0pLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYWdlVG9vbEFsbGNpdHkgPSBuZXcgcGFnaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZVRvb2xBbGxjaXR5LmluaXQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBhcnJbaV0sIHBhZ2VzaXplOiAxMCwgcGFnZUNvdW50OiA4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgY291bnQ6IGpzb24uZGF0YS50b3RhbFNpemUsIGNhbGxiYWNrOiBmdW5jdGlvbiAoY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVUYWJsZSgnc3BhY2UnLCAkKCcjZGF0ZScpLnZhbCgpLCAnJywgJycsIGN1cnJlbnQsICcxMCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoanNvbi5kYXRhLnBhZ2VDb3VudCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBhcnIxID0gWycjcGFnZVRvb2xBbGxjaXR5JywgJyNwYWdlVG9vbFByZXNvbmNpdHknLCAnI3BhZ2VUb29sZ3JvdW5wY2l0eScsICcjcGFnZVRvb2xBbGxjb3VudHknXHJcbiAgICAgICAgICAgICAgICAgICAgLCAnI3BhZ2VUb29sUHJlc29uY291bnR5JywgJyNwYWdlVG9vbGdyb3VucGNvdW50eSddO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycjEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGFycjFbaV0pLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6LWE5rqQ5YiG6aG1XHJcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5kYXRhLnBhZ2VDb3VudCA+IDEgJiYgcGFnZUlzU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAkKCcjcGFnZVRvb2wxUmVzJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBwYWdlVG9vbDFSZXMgPSBuZXcgcGFnaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgIHBhZ2VUb29sMVJlcy5pbml0KHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICcjcGFnZVRvb2wxUmVzJywgcGFnZXNpemU6IDEwLCBwYWdlQ291bnQ6IDgsXHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IGpzb24uZGF0YS50b3RhbFNpemUsIGNhbGxiYWNrOiBmdW5jdGlvbiAoY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbW9kdWxlVGFibGUoJ3Jlc291cmNlJywgJCgnI2RhdGUnKS52YWwoKSwgJycsICcnLCBjdXJyZW50LCAnMTAnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChqc29uLmRhdGEucGFnZUNvdW50ID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgJCgnI3BhZ2VUb29sMVJlcycpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIOW6lOeUqOWIhumhtVxyXG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZGF0YS5wYWdlQ291bnQgPiAxICYmIHBhZ2VJc1Nob3cpIHtcclxuICAgICAgICAgICAgICAgICAgJCgnI3BhZ2VUb29sMUFwcCcpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgcGFnZVRvb2wxQXBwID0gbmV3IHBhZ2luZygpO1xyXG4gICAgICAgICAgICAgICAgICBwYWdlVG9vbDFBcHAuaW5pdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnI3BhZ2VUb29sMUFwcCcsIHBhZ2VzaXplOiAxMCwgcGFnZUNvdW50OiA4LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBqc29uLmRhdGEudG90YWxTaXplLCBjYWxsYmFjazogZnVuY3Rpb24gKGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZVRhYmxlKCdhcHAnLCAkKCcjZGF0ZScpLnZhbCgpLCBuYW1lLCAnJywgY3VycmVudCwgJzEwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoanNvbi5kYXRhLnBhZ2VDb3VudCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICQoJyNwYWdlVG9vbDFBcHAnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmbGFnID09ICdzcGFjZScpIHtcclxuICAgICAgICAgICAgICBpZiAoX3RhYlZhbCA9PSAxIHx8ICFpc05leHQpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjdGFibGVTcGFjZTEgdGJvZHlcIikuaHRtbChodG1sMSk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3RhYmxlU3BhY2U0IHRib2R5XCIpLmh0bWwoaHRtbDQpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAoX3RhYlZhbCA9PSAyIHx8ICFpc05leHQpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjdGFibGVTcGFjZTIgdGJvZHlcIikuaHRtbChodG1sMik7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3RhYmxlU3BhY2U1IHRib2R5XCIpLmh0bWwoaHRtbDUpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAoX3RhYlZhbCA9PSAzIHx8ICFpc05leHQpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjdGFibGVTcGFjZTMgdGJvZHlcIikuaHRtbChodG1sMyk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3RhYmxlU3BhY2U2IHRib2R5XCIpLmh0bWwoaHRtbDYpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmxhZyA9PSAncmVzb3VyY2UnKSB7XHJcbiAgICAgICAgICAgICAgJCgnI3NwYWNlVGFibGVSZXMgdGJvZHknKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmbGFnID09ICdhcHAnKSB7XHJcbiAgICAgICAgICAgICAgJCgnI3NwYWNlVGFibGVBcHAgdGJvZHknKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmbGFnID09ICd1c2VyJykge1xyXG4gICAgICAgICAgICAgICQoJyN0YWJsZV8nICsgc2NvcGUgKyAnIHRib2R5JykuaHRtbCh1c2VyaHRtbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCQoJy50YWJsZVdyYXAgdGFibGUgdGJvZHkgdHInKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICQoJy50YWJsZVdyYXAgdGFibGUgdGJvZHknKS5lbXB0eSgpLmFwcGVuZCgnPGRpdiBpZD1cImVtcHR5X2luZm9cIj48ZGl2PjxwPuayoeacieebuOWFs+WGheWuuTwvcD48L2Rpdj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAkKCcudGFibGVXcmFwIHRhYmxlJykubmV4dCgpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgJCgnLnRhYmxlV3JhcCcpLmZpbmQoJyNwYWdlVG9vbEFsbGNpdHknKS5lbXB0eSgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ3RhYkNoYW5nZScsICcudGFiJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJyN0YWJsZVNwYWNlJyArICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpKS5zaG93KCkuc2libGluZ3MoKS5oaWRlKCk7XHJcbiAgICAgICAgJCgnI3RhYmxlU3BhY2UnICsgKCskKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSArIDMpKS5zaG93KCkuc2libGluZ3MoKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcjZGF0ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsYXlkYXRlKHtpc2NsZWFyOiBmYWxzZSwgaXN0b2RheTogZmFsc2UsIG1heDogbGF5ZGF0ZS5ub3coLTEpfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcjZGF0ZScpLnZhbChsYXlkYXRlLm5vdygtMSkpO1xyXG5cclxuICAgICAgLy8g6LWE5rqQ5pel5pyfXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmRhdGVSZXNCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJlc3RpbWUgPSAkKCcjZGF0ZScpLnZhbCgpO1xyXG4gICAgICAgIG1vZHVsZVRhYmxlKCdyZXNvdXJjZScsIHJlc3RpbWUsICcnLCAnJywgJycsICcxMCcpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnLmRhdGVSZXNCdG4nKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cclxuICAgICAgLy/lupTnlKjml6XmnJ9cclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuZGF0ZUFwcEJ0bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzdGltZSA9ICQoJyNkYXRlJykudmFsKCk7XHJcbiAgICAgICAgbW9kdWxlVGFibGUoJ2FwcCcsIHJlc3RpbWUsIGVuY29kZVVSSUNvbXBvbmVudCgkKCcuaW5wdXQtc2VyYXJjaCcpLnZhbCgpKSwgJycsICcnLCAnMTAnKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoJy5kYXRlQXBwQnRuJykudHJpZ2dlcignY2xpY2snKTtcclxuXHJcbiAgICAgIC8vIOepuumXtOaXpeacn1xyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5kYXRlU3BhY2VCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJlc3RpbWUgPSAkKCcjZGF0ZScpLnZhbCgpO1xyXG4gICAgICAgIG1vZHVsZVRhYmxlKCdzcGFjZScsIHJlc3RpbWUsICcnLCAnJywgJycsICcxMCcpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnLmRhdGVTcGFjZUJ0bicpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcblxyXG4gICAgICAvLyDnlKjmiLfml6XmnJ9cclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuZGF0ZVVzZXJCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJlc3RpbWUgPSAkKCcjZGF0ZScpLnZhbCgpO1xyXG4gICAgICAgIG1vZHVsZVRhYmxlKCd1c2VyJywgcmVzdGltZSwgJycsIHJvbGUsICcnLCAnMTAnKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoJy5kYXRlVXNlckJ0bicpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5pWw5o2u5a+85Ye6XHJcbiAgICAgICAqIEBwYXJhbSB0eXBlIHBlcnNvbjrnlKjmiLc7IGFwcDrlupTnlKg7c3BhY2U656m66Ze0O3Jlc291cmNlOui1hOa6kFxyXG4gICAgICAgKiBAcGFyYW0gc2NvcGUg6I635Y+W55So5oi35pe2OmFyZWE65a+85Ye65Yy65Z+f5pWw5o2uKOW4gue6p+euoeeQhuWRmCk7c2Nob29sOuWvvOWHuuWtpuagoeaVsOaNrijljLrljr/nrqHnkIblkZgpO3BlcnNvbjrlr7zlh7rnlKjmiLfmlbDmja4o5a2m5qCh566h55CG5ZGYKVxyXG4gICAgICAgKiAgICAgICAgICAgICAg6I635Y+W56m66Ze05pe2OmFsbDrlhajpg6jnqbrpl7Q7cGVyc29uOuS4quS6uuepuumXtCBncm91cDrnvqTnu4Tnqbrpl7RcclxuICAgICAgICogICAgICAgICAgICAgIOiOt+WPlui1hOa6kOaXtjphcmVhOuWvvOWHuuWMuuWfn+aVsOaNrjtzY2hvb2w65a+85Ye65a2m5qCh5pWw5o2uXHJcbiAgICAgICAqIEBwYXJhbSB0aW1lIOaXtumXtCjmoLzlvI8geXl5eS1tbS1kZClcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGV4cG9ydERhdGEodHlwZSwgc2NvcGUsIHRpbWUpIHtcclxuICAgICAgICB2YXIgZXh0cmEgPSAnP3R5cGU9JyArIHR5cGUgKyAnJnRpbWU9JyArIHRpbWU7XHJcbiAgICAgICAgaWYgKHNjb3BlKSBleHRyYSArPSAnJnNjb3BlPScgKyBzY29wZVxyXG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSBzZXJ2aWNlLnByZWZpeCArICcvZXhwb3J0JyArIGV4dHJhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy53cmFwVGFibGVUb3BFeHBvcnQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHR5cGUgPSAkKHRoaXMpLnBhcmVudHMoJ2JvZHknKS5hdHRyKCdkYXRhLW1vZHVsZScpO1xyXG4gICAgICAgIHZhciBzY29wZSA9ICcnO1xyXG4gICAgICAgIGlmICh0eXBlID09PSAncGVyc29uJykge1xyXG4gICAgICAgICAgc3dpdGNoIChyb2xlX2IpIHtcclxuICAgICAgICAgICAgY2FzZSAnY2l0eSc6XHJcbiAgICAgICAgICAgICAgc2NvcGUgPSAnYXJlYSc7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvdW50eSc6XHJcbiAgICAgICAgICAgICAgc2NvcGUgPSAnc2Nob29sJztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnc2Nob29sJzpcclxuICAgICAgICAgICAgICBzY29wZSA9ICdwZXJzb24nO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgIHNjb3BlID0gJ2FyZWEnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3NwYWNlJykge1xyXG4gICAgICAgICAgdmFyIGN1cnJlbnRUYWIgPSAkKCcudGFiJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgICAgICAgc3dpdGNoIChjdXJyZW50VGFiKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJzEnOlxyXG4gICAgICAgICAgICAgIHNjb3BlID0gJ2FsbCc7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJzInOlxyXG4gICAgICAgICAgICAgIHNjb3BlID0gJ3BlcnNvbic7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJzMnOlxyXG4gICAgICAgICAgICAgIHNjb3BlID0gJ2dyb3VwJztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICBzY29wZSA9ICdhbGwnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3Jlc291cmNlJykge1xyXG4gICAgICAgICAgc3dpdGNoIChyb2xlX2IpIHtcclxuICAgICAgICAgICAgY2FzZSAnY2l0eSc6XHJcbiAgICAgICAgICAgICAgc2NvcGUgPSAnYXJlYSc7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvdW50eSc6XHJcbiAgICAgICAgICAgICAgc2NvcGUgPSAnc2Nob29sJztcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICBzY29wZSA9ICdhcmVhJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRpbWUgPSAkKHRoaXMpLnBhcmVudHMoKS5maW5kKCcubGF5ZGF0ZS1pY29uJykudmFsKCk7XHJcbiAgICAgICAgZXhwb3J0RGF0YSh0eXBlLCBzY29wZSwgdGltZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59KSJdfQ==
