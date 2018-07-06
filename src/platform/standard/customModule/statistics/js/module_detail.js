require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  define('', ['jquery', 'paging', 'service', 'common'],
    function ($, paging, service, common) {
      var role_b = common.role;
      var convertRole = {'city': 'edu', 'county': 'area', 'school': 'school'};
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
            url: service.prefix + '/platform/details?time=' + time + '&scope=' + scope + '&pageSize=' + pageSize +
            '&pageNo=' + pageNo + '&errorDomId=' + spaceTable,
            tbBody: function (data, scope) {
              if (scope == 'school') {
                return "<tr class='" + trColor + "'><td>" + data.time.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>"
                  + data.today + "</td>" + "<td>" + (data.login.split(' ')[1] || '00:00:00') + "</td>" + "<td>" + data.lastseven + "</td>" +
                  "<td style='border-right:none;'>" + data.lastthirty + "</td></tr>";
              } else if (scope == 'edu') {
                return "<tr class='" + trColor + "'><td>" + data.time.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>"
                  + data.total + "</td>" + "<td>" + data.today + "</td>" + "<td>" + data.yesterday + "</td>" +
                  "<td>" + data.lastseven + "</td>" + "<td style='border-right:none;'>" + data.lastthirty +
                  "</td></tr>";
              } else if (scope == 'area') {
                return "<tr class='" + trColor + "'><td>" + data.time.split(" ")[0] + "</td>" + "<td>" + data.name + "</td>" + "<td>"
                  + data.total + "</td>" + "<td>" + data.today + "</td>" + "<td>" + data.yesterday + "</td>" +
                  "<td>" + data.lastseven + "</td>" + "<td style='border-right:none;'>" + data.lastthirty +
                  "</td></tr>";
              }
            }
          },
          'space': {
            url: service.prefix + '/space/detail?time=' + time + '&pageSize=' + pageSize + '&pageNo=' + pageNo +
            '&errorDomId=' + spaceTable,
            tbBody: function (data, falg) {
              if (falg == "table1") {
                return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name
                  + "</td>" + "<td>" + data.spaceNum + "</td>" + "<td>" + data.openPersonSpaceNum + "</td>" + "<td>" +
                  data.usePersonSpaceNum + "</td>" + "<td>" + data.visitPersonSpaceNum + "</td>" + "<td>" +
                  data.openGroupSpaceNum + "</td>" + "<td style='border-right:none;'>" + data.visitGroupSpaceNum + "</td></tr>";
              } else if (falg == "table2") {
                return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name
                  + "</td>" + "<td>" + data.studentOpenNum + "</td>" + "<td>" + data.studentUseNum + "</td>" + "<td>" +
                  data.parentOpenNum + "</td>" + "<td>" + data.parentUseNum + "</td>" + "<td>" + data.teacherOpenNum +
                  "</td>" + "<td>" + data.teacherUseNum + "</td>" + "<td>" + data.researchOpenNum + "</td>" +
                  "<td style='border-right:0;'>" + data.researchUseNum + "</td></tr>";
              } else if (falg == "table3") {
                return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name
                  + "</td>" + "<td>" + data.schoolOpenNum + "</td>" + "<td>" + data.schoolVisitNum + "</td>" + "<td>" +
                  data.classOpenNum + "</td>" + "<td>" + data.classVisitNum + "</td>" + "<td>" + data.subjectOpenNum +
                  "</td>" + "<td style='border-right:0;'>" + data.subjectVisitNum + "</td></tr>";
              }
              if (falg == "table4") {
                return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name
                  + "</td>" + "<td>" + data.spaceNum + "</td>" + "<td>" + data.openPersonSpaceNum + "</td>" + "<td>" +
                  data.usePersonSpaceNum + "</td>" + "<td>" + data.visitPersonSpaceNum + "</td>" + "<td>" +
                  data.openGroupSpaceNum + "</td>" + "<td style='border-right:none;'>" + data.visitGroupSpaceNum + "</td></tr>";
              } else if (falg == "table5") {
                return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name
                  + "</td>" + "<td>" + data.studentOpenNum + "</td>" + "<td>" + data.studentUseNum + "</td>" + "<td>" +
                  data.parentOpenNum + "</td>" + "<td>" + data.parentUseNum + "</td>" + "<td>" + data.teacherOpenNum +
                  "</td>" + "<td style='border-right:0;'>" + data.teacherUseNum + "</td></tr>";
              } else if (falg == "table6") {
                return "<tr class='" + trColor + "'><td>" + data.createDate.split(" ")[0] + "</td>" + "<td>" + data.name
                  + "</td>" + "<td>" + data.classOpenNum + "</td>" + "<td>" + data.classVisitNum + "</td>" + "<td>" +
                  data.subjectOpenNum + "</td>" + "<td style='border-right:0;'>" + data.subjectVisitNum + "</td></tr>";
              }
            }
          },
          'app': {
            /**
             * @description 应用数据明细
             * @param  time  String  时间(格式：YYYY-MM-DD)
             * @param  name  String  应用名称
             */
            url: service.prefix + '/application/' + time + '/details?name=' + name + '&pageSize=' + pageSize +
            '&pageNo=' + pageNo + '&errorDomId=' + spaceTable,
            tbBody: function (data) {
              return "<tr class='" + trColor + "'><td style='padding:0 25px;text-align: left;'>" + data.name + "</td>" +
                "<td>" + data.person + "</td>" + "<td>" + data.visit + "</td>" + "<td style='border-right:none;'>" +
                data.ratio + "</td></tr>";
            }
          },
          'resource': {
            /**
             * @description 资源统计明细
             * @param  time : 日期, 格式为:yyyy-MM-dd
             * @param  pageSize:每页大小
             * @param  pageNo：请求页数，最小为1
             */
            url: service.prefix + '/resource/' + time + '/details?pageSize=' + pageSize + '&pageNo=' + pageNo +
            '&errorDomId=' + spaceTable,
            tbBody: function (data) {
              return "<tr class='" + trColor + "'><td>" + data.date + "</td>" + "<td>" + data.area + "</td>" + "<td>" +
                data.resTotal + "</td>" + "<td>" + data.syncTotal + "</td>" + "<td>" + data.ugcTotal + "</td>" + "<td>"
                + data.downloadCount + "</td>" + "<td>" + data.collectCount + "</td>" + "<td>" + data.userCount + "</td>" +
                "<td style='border-right:none;'>" + data.perUserRes + "</td></tr>";
            }
          }
        };
        var _tabVal = $('.tab').attr('data-value');
        url = module_detail[flag].url;
        $.ajax({
          type: "GET",
          dataType: "json",
          url: url,
          success: function (json) {
            var html = "", html1 = "", html2 = "", html3 = "", html4 = "", html5 = "", html6 = "", userhtml = "";
            if (json['code'] == 200) {
              if (json.data.dataList.length > 0) {
                $.each(json.data.dataList, function (i, n) {
                  if (i % 2 == 0) {
                    trColor = "odd";
                  }
                  else {
                    trColor = "even";
                  }
                  if (flag == 'space') {
                    if ((pageNo == json.data.pageCount) && (i == json.data.dataList.length - 1)) return;
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
                  $('.tableTotal0')
                    .html('<div class="total">合计</div>\
                <div class="total1">' + json.data.dataList[json.data.dataList.length - 1].spaceTotal + '</div>\
              <div class="total2">' + json.data.dataList[json.data.dataList.length - 1].openPersonSpaceTotal + '</div>\
              <div class="total2">' + json.data.dataList[json.data.dataList.length - 1].usePersonSpaceTotal + '</div>\
              <div class="total2">' + json.data.dataList[json.data.dataList.length - 1].visitPersonSpaceTotal + '</div>\
              <div class="total2">' + json.data.dataList[json.data.dataList.length - 1].openGroupSpaceTotal + '</div>\
              <div class="total2" style="border-right:none;">' + json.data.dataList[json.data.dataList.length - 1].visitGroupSpaceTotal + '</div>')
                    .show();
                } else {
                  $('.tableTotal0').hide();
                }
                // 用户分页
                if (json.data.pageCount > 1 && pageIsShow) {
                  $('#pageToolUser' + scope).html('');
                  var pageToolUserCity = new paging();
                  pageToolUserCity.init({
                    target: '#pageToolUser' + scope, pagesize: 10, pageCount: 8,
                    count: json.data.totalSize, callback: function (current) {
                      moduleTable('user', $('#date').val(), '', role, current, '10');
                    }
                  });
                } else if (json.data.pageCount == 1) {
                  $('#pageToolUser' + scope).html('');
                }
                // 空间分页
                if (json.data.pageCount > 1 && pageIsShow) {
                  var arr = ['#pageToolAllcity', '#pageToolPresoncity', '#pageToolgrounpcity', '#pageToolAllcounty'
                    , '#pageToolPresoncounty', '#pageToolgrounpcounty'];
                  for (var i = 0; i < arr.length; i++) {
                    $(arr[i]).html('');
                    var pageToolAllcity = new paging();
                    pageToolAllcity.init({
                      target: arr[i], pagesize: 10, pageCount: 8,
                      count: json.data.totalSize, callback: function (current) {
                        moduleTable('space', $('#date').val(), '', '', current, '10', 'true');
                      }
                    });
                  }
                } else if (json.data.pageCount == 1) {
                  var arr1 = ['#pageToolAllcity', '#pageToolPresoncity', '#pageToolgrounpcity', '#pageToolAllcounty'
                    , '#pageToolPresoncounty', '#pageToolgrounpcounty'];
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
                    count: json.data.totalSize, callback: function (current) {
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
                    count: json.data.totalSize, callback: function (current) {
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
        laydate({isclear: false, istoday: false, max: laydate.now(-1)});
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
        if (scope) extra += '&scope=' + scope
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
})