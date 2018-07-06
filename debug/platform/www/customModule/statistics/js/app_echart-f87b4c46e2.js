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

  define('', ['jquery', 'service', 'common'], function ($, service, common) {
    var role = common.role;
    var echart_app_traffic = common.echart.init(document.getElementById('app_traffic'));
    var echart_app_traffic10 = common.echart.init(document.getElementById('app_traffic10'));
    var echart_app_traffic10_pie = common.echart.init(document.getElementById('app_traffic10_pie'));
    var echart_app_use = common.echart.init(document.getElementById('app_use'));

    // 日期默认值
    $('#date_start_traffic, #date_start_traffic10, #date_start_use').val(laydate.now(-8));
    $('#date_end_traffic, #date_end_traffic10, #date_end_use').val(laydate.now(-1));

    /**
     * 获取应用名称数据
     * @returns {*}
     */
    function appFetchData() {
      return $.getJSON(service.prefix + '/application/myapp', function (result) {
        if (result['code'] == 200) {
          var html = '';
          result['data'].unshift({ id: 'all', name: '全部' });
          $.each(result['data'], function (index, item) {
            html += '<li data-value="' + item['id'] + '">' + item['name'] + '</li>';
          });
          var firstItem = result['data'][0];
          $('#select_app_name').attr('data-value', firstItem['id']).find('span').html(firstItem['name']).parents('.selectWrap').find('ol').html(html);
        }
      });
    }

    /**
     * @description 获取区域数据
     * @returns {*}
     */
    function areaFetchData() {
      return $.getJSON(service.prefix + '/organization/area/school', function (result) {
        if (result['code'] == 200) {
          var html = '';
          result['data'].unshift({ id: 'all', name: '全部' });
          $.each(result['data'], function (index, item) {
            html += '<li data-value="' + item['id'] + '">' + item['name'] + '</li>';
          });
          var firstItem = result['data'][0];
          $('#select_area').attr('data-value', firstItem['id']).find('span').html(firstItem['name']).parents('.selectWrap').find('ol').html(html);
        }
      });
    }

    /**
     * @description 平台应用访问量统计
     * @param appid 应用id
     * @param starttime
     * @param endtime
     * @param areaId 区域id或学校id(如果为全部,此值为all)
     */
    function appTrafficFetchData(appid, starttime, endtime, areaId) {
      var extra = '?errorDomId=app_traffic';
      if (areaId) extra = '?id=' + areaId + '&errorDomId=app_traffic';
      echart_app_traffic = common.echart.init(document.getElementById('app_traffic'));
      common.echart.showLoading(echart_app_traffic);
      var url = service.prefix + '/application/' + appid + '/' + starttime + '/' + endtime + '/visit' + extra;
      $.getJSON(url, function (result) {
        if (result['code'] == 200) render(converData(result['data']), 'app_traffic');
      });
    }

    function converData(data) {
      var xAxisData = [],
          seriesData = [];
      $.each(data, function (index, item) {
        xAxisData.push(item['time'].split(' ')[0]);
        seriesData.push(item['value']);
      });
      return {
        xAxisData: xAxisData,
        seriesData: seriesData
      };
    }

    $('body').on('click', '#btn_app_traffic', function () {
      var date_start = $('#date_start_traffic').val(),
          date_end = $('#date_end_traffic').val(),
          area = $('#select_area').attr('data-value');
      if (role === 'school') area = '';
      if (common.isLess30Day(date_start, date_end)) appTrafficFetchData($('#select_app_name').attr('data-value'), date_start, date_end, area);else $.alert('时间间隔不得超过30天');
    });
    $.when(appFetchData(), areaFetchData()).done(function () {
      $('#btn_app_traffic').trigger('click');
    });

    /**
     * @description 平台应用访问量排行top10
     * @param starttime
     * @param endtime
     */
    function appTraffic10FetchData(starttime, endtime) {
      common.removeTipDom('app_traffic10_wrap');
      echart_app_traffic10 = common.echart.init(document.getElementById('app_traffic10'));
      echart_app_traffic10_pie = common.echart.init(document.getElementById('app_traffic10_pie'));
      common.echart.showLoading(echart_app_traffic10);
      common.echart.showLoading(echart_app_traffic10_pie);
      $.getJSON(service.prefix + '/application/' + starttime + '/' + endtime + '/ranking?errorDomId=app_traffic10_wrap', function (result) {
        if (result['code'] == 200) {
          if (result['data']['application']['length'] == 0) common.appendTipDom('app_traffic10_wrap', 'tip');
          if (result['data']['application']['length'] != 0) {
            render(convert10Data(result['data']), 'app_traffic10');
          }
        }
      });
    }

    var usertypeObj = {
      edumanager: '教育局管理者',
      eduemploye: '教育局职工',
      schmanager: '学校管理者',
      parent: '家长',
      schemploye: '学校职工',
      teacher: '教师',
      student: '学生'
    };

    if (role === 'school') {
      delete usertypeObj.edumanager;
      delete usertypeObj.eduemploye;
    }

    function convert10Data(data) {
      var yAxisData = [],
          seriesDataBar = [],
          seriesData = [];
      $.each(data['application'].reverse(), function (index, item) {
        yAxisData.push(item['name']);
        seriesDataBar.push(item['value']);
      });
      $.each(data['userrole'], function (key, value) {
        if (usertypeObj[key]) seriesData.push({ name: usertypeObj[key], value: value });
      });
      return {
        'application': {
          yAxisData: yAxisData,
          seriesData: seriesDataBar
        },
        'usertype': {
          seriesData: seriesData
        }
      };
    }

    $('body').on('click', '#btn_app_traffic10', function () {
      var date_start = $('#date_start_traffic10').val(),
          date_end = $('#date_end_traffic10').val();
      if (common.isLess30Day(date_start, date_end)) appTraffic10FetchData(date_start, date_end);else $.alert('时间间隔不得超过30天');
    });
    $('#btn_app_traffic10').trigger('click');

    /**
     * @description 平台应用使用情况统计
     * @param type 排序字段（person:按使用人数排名，count:按使用数量排名）
     * @param starttime
     * @param endtime
     */
    function appUseFetchData(type, starttime, endtime) {
      echart_app_use = common.echart.init(document.getElementById('app_use'));
      common.echart.showLoading(echart_app_use);
      $.getJSON(service.prefix + '/application/' + type + '/' + starttime + '/' + endtime + '/used?errorDomId=app_use').success(function (result) {
        if (result['code'] == 200) render(convertUseData(result['data']), 'app_use', type);
      });
    }

    function convertUseData(data) {
      var xAxisData = [],
          seriesData = [];
      $.each(data, function (index, item) {
        xAxisData.push(item['name']);
        seriesData.push(item['value']);
      });
      return {
        xAxisData: xAxisData,
        seriesData: seriesData
      };
    }

    $('body').on('click', '#btn_app_use', function (result) {
      var type = $('#tab_app_use').attr('data-value');
      var date_start = $('#date_start_use').val(),
          date_end = $('#date_end_use').val();
      if (common.isLess30Day(date_start, date_end)) appUseFetchData(type, date_start, date_end);else $.alert('时间间隔不得超过30天');
    });
    $('#btn_app_use').trigger('click');

    $('body').on('tabChange', '.tab', function () {
      appUseFetchData($(this).attr('data-value'), $('#date_start_use').val(), $('#date_end_use').val());
    });
    // tab 切换
    $('body').on('click', '.tab1 .ulli', function () {
      if ($(this).attr('class').indexOf('liAct') >= 0) return false;
      var date_start = $('#date_start_use').val(),
          date_end = $('#date_end_use').val();
      if (!common.isLess30Day(date_start, date_end)) {
        $.alert('时间间隔不得超过30天');
      } else {
        $(this).siblings().removeClass('liAct');
        $(this).addClass('liAct');
        appUseFetchData($(this).attr('data-value'), date_start, date_end);
      }
    });

    function render(data, category, type) {
      switch (category) {
        case 'app_traffic':
          {
            var option_app_traffic = {
              color: ['#00beff'],
              tooltip: {
                trigger: 'axis'
              },
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              grid: {
                top: '13%',
                left: '0%',
                right: '0%',
                bottom: '5%',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisLabel: {
                  textStyle: {
                    fontSize: 12
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                data: data['xAxisData']
              }],
              yAxis: [{
                type: 'value',
                splitLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                }
              }],
              series: {
                name: '访问量',
                type: 'line',
                data: data['seriesData']
              }
            };
            echart_app_traffic.setOption(option_app_traffic);
            common.echart.hideLoading(echart_app_traffic);
            break;
          }
        case 'app_traffic10':
          {
            var option_app_traffic10 = {
              color: ['#29c983'],
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                top: '5%',
                left: '3%',
                right: '10%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [{
                type: 'value',
                splitLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                }
              }],
              yAxis: [{
                type: 'category',
                data: data['application']['yAxisData'],
                axisLabel: {
                  textStyle: {
                    fontSize: 12
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisTick: {
                  alignWithLabel: true
                }
              }],
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  textStyle: {
                    color: '#29c983'
                  }
                }
              },
              series: [{
                name: '访问量',
                type: 'bar',
                barWidth: 20,
                data: data['application']['seriesData']
              }]
            };
            echart_app_traffic10.setOption(option_app_traffic10);
            common.echart.hideLoading(echart_app_traffic10);
            var option_app_traffic10_pie = {
              color: ['#ff3f66', '#b653d1', '#3f86ea', '#14c7e0', '#53bb77', '#fdd51d', '#fd8c1d', '#ff3f66', '#b653cf'],
              title: {
                text: '使用应用的用户类型统计',
                x: '45%',
                y: '90%',
                textStyle: {
                  color: '#b8d1ef',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: [{
                name: '',
                center: ['55%', '50%'],
                radius: ['0', '60%'],
                type: 'pie',
                data: data['usertype']['seriesData']
              }]
            };
            echart_app_traffic10_pie.setOption(option_app_traffic10_pie);
            common.echart.hideLoading(echart_app_traffic10_pie);
            break;
          }
        case 'app_use':
          {
            var option_app_use = {
              color: ['#00bfff'],
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                top: '10%',
                left: '0%',
                right: '0%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                data: data['xAxisData'],
                axisLabel: {
                  textStyle: {
                    fontSize: 12
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisTick: {
                  // alignWithLabel: true
                }
              }],
              yAxis: [{
                type: 'value',
                splitLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#3e4370'
                  }
                }
              }],
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#00bfff'
                  }
                }
              },
              series: [{
                name: type === 'person' ? '使用人数' : '使用次数',
                type: 'bar',
                barWidth: 30,
                data: data['seriesData']
              }]
            };
            echart_app_use.setOption(option_app_use);
            common.echart.hideLoading(echart_app_use);
            break;
          }
        default:
          {}
      }
    }

    // 日期处理
    var date_start_traffic = {
      elem: '#date_start_traffic',
      max: laydate.now(-2),
      isclear: false,
      istoday: false,
      choose: function choose(datas) {
        date_end_traffic.min = datas;
      }
    },
        date_start_traffic10 = $.extend({}, date_start_traffic, {
      elem: '#date_start_traffic10', choose: function choose(datas) {
        date_end_traffic10.min = datas;
      }
    }),
        date_start_use = $.extend({}, date_start_traffic, {
      elem: '#date_start_use', choose: function choose(datas) {
        date_end_use.min = datas;
      }
    });

    var date_end_traffic = {
      elem: '#date_end_traffic',
      min: laydate.now(-7),
      max: laydate.now(-1),
      isclear: false,
      istoday: false,
      choose: function choose(datas) {
        date_start_traffic.max = datas;
      }
    },
        date_end_traffic10 = $.extend({}, date_end_traffic, {
      elem: '#date_end_traffic10', choose: function choose(datas) {
        date_start_traffic10.max = datas;
      }
    }),
        date_end_use = $.extend({}, date_end_traffic, {
      elem: '#date_end_use', choose: function choose(datas) {
        date_start_use.max = datas;
      }
    });
    $('body').on('click', '.laydate-icon', function () {
      var obj = eval('(' + this.id + ')');
      laydate(obj);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL2FwcF9lY2hhcnQuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInNlcnZpY2UiLCJjb21tb24iLCJyb2xlIiwiZWNoYXJ0X2FwcF90cmFmZmljIiwiZWNoYXJ0IiwiaW5pdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJlY2hhcnRfYXBwX3RyYWZmaWMxMCIsImVjaGFydF9hcHBfdHJhZmZpYzEwX3BpZSIsImVjaGFydF9hcHBfdXNlIiwidmFsIiwibGF5ZGF0ZSIsIm5vdyIsImFwcEZldGNoRGF0YSIsImdldEpTT04iLCJwcmVmaXgiLCJyZXN1bHQiLCJodG1sIiwidW5zaGlmdCIsImlkIiwibmFtZSIsImVhY2giLCJpbmRleCIsIml0ZW0iLCJmaXJzdEl0ZW0iLCJhdHRyIiwiZmluZCIsInBhcmVudHMiLCJhcmVhRmV0Y2hEYXRhIiwiYXBwVHJhZmZpY0ZldGNoRGF0YSIsImFwcGlkIiwic3RhcnR0aW1lIiwiZW5kdGltZSIsImFyZWFJZCIsImV4dHJhIiwic2hvd0xvYWRpbmciLCJ1cmwiLCJyZW5kZXIiLCJjb252ZXJEYXRhIiwiZGF0YSIsInhBeGlzRGF0YSIsInNlcmllc0RhdGEiLCJwdXNoIiwic3BsaXQiLCJvbiIsImRhdGVfc3RhcnQiLCJkYXRlX2VuZCIsImFyZWEiLCJpc0xlc3MzMERheSIsImFsZXJ0Iiwid2hlbiIsImRvbmUiLCJ0cmlnZ2VyIiwiYXBwVHJhZmZpYzEwRmV0Y2hEYXRhIiwicmVtb3ZlVGlwRG9tIiwiYXBwZW5kVGlwRG9tIiwiY29udmVydDEwRGF0YSIsInVzZXJ0eXBlT2JqIiwiZWR1bWFuYWdlciIsImVkdWVtcGxveWUiLCJzY2htYW5hZ2VyIiwicGFyZW50Iiwic2NoZW1wbG95ZSIsInRlYWNoZXIiLCJzdHVkZW50IiwieUF4aXNEYXRhIiwic2VyaWVzRGF0YUJhciIsInJldmVyc2UiLCJrZXkiLCJ2YWx1ZSIsImFwcFVzZUZldGNoRGF0YSIsInR5cGUiLCJzdWNjZXNzIiwiY29udmVydFVzZURhdGEiLCJpbmRleE9mIiwic2libGluZ3MiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiY2F0ZWdvcnkiLCJvcHRpb25fYXBwX3RyYWZmaWMiLCJjb2xvciIsInRvb2x0aXAiLCJ0ZXh0U3R5bGUiLCJmb250U2l6ZSIsImdyaWQiLCJ0b3AiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJjb250YWluTGFiZWwiLCJ4QXhpcyIsImJvdW5kYXJ5R2FwIiwiYXhpc0xhYmVsIiwiYXhpc0xpbmUiLCJsaW5lU3R5bGUiLCJ5QXhpcyIsInNwbGl0TGluZSIsInNlcmllcyIsInNldE9wdGlvbiIsImhpZGVMb2FkaW5nIiwib3B0aW9uX2FwcF90cmFmZmljMTAiLCJheGlzUG9pbnRlciIsImF4aXNUaWNrIiwiYWxpZ25XaXRoTGFiZWwiLCJsYWJlbCIsIm5vcm1hbCIsInNob3ciLCJwb3NpdGlvbiIsImJhcldpZHRoIiwib3B0aW9uX2FwcF90cmFmZmljMTBfcGllIiwidGl0bGUiLCJ0ZXh0IiwieCIsInkiLCJmb250V2VpZ2h0IiwiZm9ybWF0dGVyIiwiY2VudGVyIiwicmFkaXVzIiwib3B0aW9uX2FwcF91c2UiLCJkYXRlX3N0YXJ0X3RyYWZmaWMiLCJlbGVtIiwibWF4IiwiaXNjbGVhciIsImlzdG9kYXkiLCJjaG9vc2UiLCJkYXRhcyIsImRhdGVfZW5kX3RyYWZmaWMiLCJtaW4iLCJkYXRlX3N0YXJ0X3RyYWZmaWMxMCIsImV4dGVuZCIsImRhdGVfZW5kX3RyYWZmaWMxMCIsImRhdGVfc3RhcnRfdXNlIiwiZGF0ZV9lbmRfdXNlIiwib2JqIiwiZXZhbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsa0JBQWM7QUFEVDtBQUZNLENBQWY7QUFNQUgsUUFBUSxDQUFDLFlBQUQsQ0FBUixFQUF3QixVQUFV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a0IsS0FBdkI7QUFBQSxRQVVFSyxxQkFBcUJwSSxFQUFFbUksTUFBRixDQUFTLEVBQVQsRUFBYUgsZ0JBQWIsRUFBK0I7QUFDbEROLFlBQU0scUJBRDRDLEVBQ3JCSSxRQUFRLGdCQUFVQyxLQUFWLEVBQWlCO0FBQ3BERyw2QkFBcUJQLEdBQXJCLEdBQTJCSSxLQUEzQjtBQUNEO0FBSGlELEtBQS9CLENBVnZCO0FBQUEsUUFlRU8sZUFBZXRJLEVBQUVtSSxNQUFGLENBQVMsRUFBVCxFQUFhSCxnQkFBYixFQUErQjtBQUM1Q04sWUFBTSxlQURzQyxFQUNyQkksUUFBUSxnQkFBVUMsS0FBVixFQUFpQjtBQUM5Q00sdUJBQWVWLEdBQWYsR0FBcUJJLEtBQXJCO0FBQ0Q7QUFIMkMsS0FBL0IsQ0FmakI7QUFvQkEvSCxNQUFFLE1BQUYsRUFBVThDLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLGVBQXRCLEVBQXVDLFlBQVk7QUFDakQsVUFBSXlGLE1BQU1DLEtBQUssTUFBTSxLQUFLbkgsRUFBWCxHQUFnQixHQUFyQixDQUFWO0FBQ0FSLGNBQVEwSCxHQUFSO0FBQ0QsS0FIRDtBQUlELEdBemZIO0FBMGZELENBOWZEIiwiZmlsZSI6ImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL2FwcF9lY2hhcnQtZjg3YjRjNDZlMi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ2N1c3RvbUNvbmYnOiAnc3RhdGlzdGljcy9qcy9jdXN0b21Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydjdXN0b21Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAnc2VydmljZScsICdjb21tb24nXSxcclxuICAgIGZ1bmN0aW9uICgkLCBzZXJ2aWNlLCBjb21tb24pIHtcclxuICAgICAgdmFyIHJvbGUgPSBjb21tb24ucm9sZTtcclxuICAgICAgdmFyIGVjaGFydF9hcHBfdHJhZmZpYyA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwX3RyYWZmaWMnKSk7XHJcbiAgICAgIHZhciBlY2hhcnRfYXBwX3RyYWZmaWMxMCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwX3RyYWZmaWMxMCcpKTtcclxuICAgICAgdmFyIGVjaGFydF9hcHBfdHJhZmZpYzEwX3BpZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwX3RyYWZmaWMxMF9waWUnKSk7XHJcbiAgICAgIHZhciBlY2hhcnRfYXBwX3VzZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwX3VzZScpKTtcclxuXHJcbiAgICAgIC8vIOaXpeacn+m7mOiupOWAvFxyXG4gICAgICAkKCcjZGF0ZV9zdGFydF90cmFmZmljLCAjZGF0ZV9zdGFydF90cmFmZmljMTAsICNkYXRlX3N0YXJ0X3VzZScpLnZhbChsYXlkYXRlLm5vdygtOCkpO1xyXG4gICAgICAkKCcjZGF0ZV9lbmRfdHJhZmZpYywgI2RhdGVfZW5kX3RyYWZmaWMxMCwgI2RhdGVfZW5kX3VzZScpLnZhbChsYXlkYXRlLm5vdygtMSkpO1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOiOt+WPluW6lOeUqOWQjeensOaVsOaNrlxyXG4gICAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGFwcEZldGNoRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9hcHBsaWNhdGlvbi9teWFwcCcsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSAnJztcclxuICAgICAgICAgICAgcmVzdWx0WydkYXRhJ10udW5zaGlmdCh7aWQ6ICdhbGwnLCBuYW1lOiAn5YWo6YOoJ30pO1xyXG4gICAgICAgICAgICAkLmVhY2gocmVzdWx0WydkYXRhJ10sIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgIGh0bWwgKz0gJzxsaSBkYXRhLXZhbHVlPVwiJyArIGl0ZW1bJ2lkJ10gKyAnXCI+JyArIGl0ZW1bJ25hbWUnXSArICc8L2xpPic7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgZmlyc3RJdGVtID0gcmVzdWx0WydkYXRhJ11bMF07XHJcbiAgICAgICAgICAgICQoJyNzZWxlY3RfYXBwX25hbWUnKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXZhbHVlJywgZmlyc3RJdGVtWydpZCddKVxyXG4gICAgICAgICAgICAgIC5maW5kKCdzcGFuJykuaHRtbChmaXJzdEl0ZW1bJ25hbWUnXSlcclxuICAgICAgICAgICAgICAucGFyZW50cygnLnNlbGVjdFdyYXAnKS5maW5kKCdvbCcpLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g6I635Y+W5Yy65Z+f5pWw5o2uXHJcbiAgICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gYXJlYUZldGNoRGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9vcmdhbml6YXRpb24vYXJlYS9zY2hvb2wnLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSB7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgIHJlc3VsdFsnZGF0YSddLnVuc2hpZnQoe2lkOiAnYWxsJywgbmFtZTogJ+WFqOmDqCd9KTtcclxuICAgICAgICAgICAgJC5lYWNoKHJlc3VsdFsnZGF0YSddLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICBodG1sICs9ICc8bGkgZGF0YS12YWx1ZT1cIicgKyBpdGVtWydpZCddICsgJ1wiPicgKyBpdGVtWyduYW1lJ10gKyAnPC9saT4nO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGZpcnN0SXRlbSA9IHJlc3VsdFsnZGF0YSddWzBdO1xyXG4gICAgICAgICAgICAkKCcjc2VsZWN0X2FyZWEnKVxyXG4gICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXZhbHVlJywgZmlyc3RJdGVtWydpZCddKVxyXG4gICAgICAgICAgICAgIC5maW5kKCdzcGFuJykuaHRtbChmaXJzdEl0ZW1bJ25hbWUnXSlcclxuICAgICAgICAgICAgICAucGFyZW50cygnLnNlbGVjdFdyYXAnKS5maW5kKCdvbCcpLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w5bqU55So6K6/6Zeu6YeP57uf6K6hXHJcbiAgICAgICAqIEBwYXJhbSBhcHBpZCDlupTnlKhpZFxyXG4gICAgICAgKiBAcGFyYW0gc3RhcnR0aW1lXHJcbiAgICAgICAqIEBwYXJhbSBlbmR0aW1lXHJcbiAgICAgICAqIEBwYXJhbSBhcmVhSWQg5Yy65Z+faWTmiJblrabmoKFpZCjlpoLmnpzkuLrlhajpg6gs5q2k5YC85Li6YWxsKVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gYXBwVHJhZmZpY0ZldGNoRGF0YShhcHBpZCwgc3RhcnR0aW1lLCBlbmR0aW1lLCBhcmVhSWQpIHtcclxuICAgICAgICB2YXIgZXh0cmEgPSAnP2Vycm9yRG9tSWQ9YXBwX3RyYWZmaWMnO1xyXG4gICAgICAgIGlmIChhcmVhSWQpIGV4dHJhID0gJz9pZD0nICsgYXJlYUlkICsgJyZlcnJvckRvbUlkPWFwcF90cmFmZmljJztcclxuICAgICAgICBlY2hhcnRfYXBwX3RyYWZmaWMgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcF90cmFmZmljJykpO1xyXG4gICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X2FwcF90cmFmZmljKTtcclxuICAgICAgICB2YXIgdXJsID0gc2VydmljZS5wcmVmaXggKyAnL2FwcGxpY2F0aW9uLycgKyBhcHBpZCArICcvJ1xyXG4gICAgICAgICAgKyBzdGFydHRpbWUgKyAnLycgKyBlbmR0aW1lICsgJy92aXNpdCcgKyBleHRyYTtcclxuICAgICAgICAkLmdldEpTT04odXJsLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSByZW5kZXIoY29udmVyRGF0YShyZXN1bHRbJ2RhdGEnXSksICdhcHBfdHJhZmZpYycpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNvbnZlckRhdGEoZGF0YSkge1xyXG4gICAgICAgIHZhciB4QXhpc0RhdGEgPSBbXSwgc2VyaWVzRGF0YSA9IFtdO1xyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgIHhBeGlzRGF0YS5wdXNoKGl0ZW1bJ3RpbWUnXS5zcGxpdCgnICcpWzBdKTtcclxuICAgICAgICAgIHNlcmllc0RhdGEucHVzaChpdGVtWyd2YWx1ZSddKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhOiB4QXhpc0RhdGEsXHJcbiAgICAgICAgICBzZXJpZXNEYXRhOiBzZXJpZXNEYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNidG5fYXBwX3RyYWZmaWMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGVfc3RhcnQgPSAkKCcjZGF0ZV9zdGFydF90cmFmZmljJykudmFsKCksIGRhdGVfZW5kID0gJCgnI2RhdGVfZW5kX3RyYWZmaWMnKS52YWwoKSxcclxuICAgICAgICAgIGFyZWEgPSAkKCcjc2VsZWN0X2FyZWEnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICAgICAgaWYgKHJvbGUgPT09ICdzY2hvb2wnKSBhcmVhID0gJyc7XHJcbiAgICAgICAgaWYgKGNvbW1vbi5pc0xlc3MzMERheShkYXRlX3N0YXJ0LCBkYXRlX2VuZCkpXHJcbiAgICAgICAgICBhcHBUcmFmZmljRmV0Y2hEYXRhKCQoJyNzZWxlY3RfYXBwX25hbWUnKS5hdHRyKCdkYXRhLXZhbHVlJyksIGRhdGVfc3RhcnQsIGRhdGVfZW5kLCBhcmVhKTtcclxuICAgICAgICBlbHNlICQuYWxlcnQoJ+aXtumXtOmXtOmalOS4jeW+l+i2hei/hzMw5aSpJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkLndoZW4oYXBwRmV0Y2hEYXRhKCksIGFyZWFGZXRjaERhdGEoKSlcclxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkKCcjYnRuX2FwcF90cmFmZmljJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w5bqU55So6K6/6Zeu6YeP5o6S6KGMdG9wMTBcclxuICAgICAgICogQHBhcmFtIHN0YXJ0dGltZVxyXG4gICAgICAgKiBAcGFyYW0gZW5kdGltZVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gYXBwVHJhZmZpYzEwRmV0Y2hEYXRhKHN0YXJ0dGltZSwgZW5kdGltZSkge1xyXG4gICAgICAgIGNvbW1vbi5yZW1vdmVUaXBEb20oJ2FwcF90cmFmZmljMTBfd3JhcCcpO1xyXG4gICAgICAgIGVjaGFydF9hcHBfdHJhZmZpYzEwID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHBfdHJhZmZpYzEwJykpO1xyXG4gICAgICAgIGVjaGFydF9hcHBfdHJhZmZpYzEwX3BpZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwX3RyYWZmaWMxMF9waWUnKSk7XHJcbiAgICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfYXBwX3RyYWZmaWMxMCk7XHJcbiAgICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfYXBwX3RyYWZmaWMxMF9waWUpO1xyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvYXBwbGljYXRpb24vJyArIHN0YXJ0dGltZSArICcvJyArIGVuZHRpbWUgKyAnL3Jhbmtpbmc/ZXJyb3JEb21JZD1hcHBfdHJhZmZpYzEwX3dyYXAnLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdFsnZGF0YSddWydhcHBsaWNhdGlvbiddWydsZW5ndGgnXSA9PSAwKSBjb21tb24uYXBwZW5kVGlwRG9tKCdhcHBfdHJhZmZpYzEwX3dyYXAnLCAndGlwJyk7XHJcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdFsnZGF0YSddWydhcHBsaWNhdGlvbiddWydsZW5ndGgnXSAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIoY29udmVydDEwRGF0YShyZXN1bHRbJ2RhdGEnXSksICdhcHBfdHJhZmZpYzEwJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHVzZXJ0eXBlT2JqID0ge1xyXG4gICAgICAgIGVkdW1hbmFnZXI6ICfmlZnogrLlsYDnrqHnkIbogIUnLFxyXG4gICAgICAgIGVkdWVtcGxveWU6ICfmlZnogrLlsYDogYzlt6UnLFxyXG4gICAgICAgIHNjaG1hbmFnZXI6ICflrabmoKHnrqHnkIbogIUnLFxyXG4gICAgICAgIHBhcmVudDogJ+WutumVvycsXHJcbiAgICAgICAgc2NoZW1wbG95ZTogJ+WtpuagoeiBjOW3pScsXHJcbiAgICAgICAgdGVhY2hlcjogJ+aVmeW4iCcsXHJcbiAgICAgICAgc3R1ZGVudDogJ+WtpueUnydcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChyb2xlID09PSAnc2Nob29sJykge1xyXG4gICAgICAgIGRlbGV0ZSB1c2VydHlwZU9iai5lZHVtYW5hZ2VyO1xyXG4gICAgICAgIGRlbGV0ZSB1c2VydHlwZU9iai5lZHVlbXBsb3llO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBjb252ZXJ0MTBEYXRhKGRhdGEpIHtcclxuICAgICAgICB2YXIgeUF4aXNEYXRhID0gW10sIHNlcmllc0RhdGFCYXIgPSBbXSwgc2VyaWVzRGF0YSA9IFtdO1xyXG4gICAgICAgICQuZWFjaChkYXRhWydhcHBsaWNhdGlvbiddLnJldmVyc2UoKSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICB5QXhpc0RhdGEucHVzaChpdGVtWyduYW1lJ10pO1xyXG4gICAgICAgICAgc2VyaWVzRGF0YUJhci5wdXNoKGl0ZW1bJ3ZhbHVlJ10pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQuZWFjaChkYXRhWyd1c2Vycm9sZSddLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgaWYgKHVzZXJ0eXBlT2JqW2tleV0pIHNlcmllc0RhdGEucHVzaCh7bmFtZTogdXNlcnR5cGVPYmpba2V5XSwgdmFsdWU6IHZhbHVlfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICdhcHBsaWNhdGlvbic6IHtcclxuICAgICAgICAgICAgeUF4aXNEYXRhOiB5QXhpc0RhdGEsXHJcbiAgICAgICAgICAgIHNlcmllc0RhdGE6IHNlcmllc0RhdGFCYXJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAndXNlcnR5cGUnOiB7XHJcbiAgICAgICAgICAgIHNlcmllc0RhdGE6IHNlcmllc0RhdGFcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnI2J0bl9hcHBfdHJhZmZpYzEwJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRlX3N0YXJ0ID0gJCgnI2RhdGVfc3RhcnRfdHJhZmZpYzEwJykudmFsKCksIGRhdGVfZW5kID0gJCgnI2RhdGVfZW5kX3RyYWZmaWMxMCcpLnZhbCgpO1xyXG4gICAgICAgIGlmIChjb21tb24uaXNMZXNzMzBEYXkoZGF0ZV9zdGFydCwgZGF0ZV9lbmQpKSBhcHBUcmFmZmljMTBGZXRjaERhdGEoZGF0ZV9zdGFydCwgZGF0ZV9lbmQpO1xyXG4gICAgICAgIGVsc2UgJC5hbGVydCgn5pe26Ze06Ze06ZqU5LiN5b6X6LaF6L+HMzDlpKknKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoJyNidG5fYXBwX3RyYWZmaWMxMCcpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIOW5s+WPsOW6lOeUqOS9v+eUqOaDheWGtee7n+iuoVxyXG4gICAgICAgKiBAcGFyYW0gdHlwZSDmjpLluo/lrZfmrrXvvIhwZXJzb2465oyJ5L2/55So5Lq65pWw5o6S5ZCN77yMY291bnQ65oyJ5L2/55So5pWw6YeP5o6S5ZCN77yJXHJcbiAgICAgICAqIEBwYXJhbSBzdGFydHRpbWVcclxuICAgICAgICogQHBhcmFtIGVuZHRpbWVcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGFwcFVzZUZldGNoRGF0YSh0eXBlLCBzdGFydHRpbWUsIGVuZHRpbWUpIHtcclxuICAgICAgICBlY2hhcnRfYXBwX3VzZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwX3VzZScpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9hcHBfdXNlKTtcclxuICAgICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL2FwcGxpY2F0aW9uLycgKyB0eXBlICsgJy8nICsgc3RhcnR0aW1lICsgJy8nICsgZW5kdGltZSArICcvdXNlZD9lcnJvckRvbUlkPWFwcF91c2UnKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSByZW5kZXIoY29udmVydFVzZURhdGEocmVzdWx0WydkYXRhJ10pLCAnYXBwX3VzZScsIHR5cGUpXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY29udmVydFVzZURhdGEoZGF0YSkge1xyXG4gICAgICAgIHZhciB4QXhpc0RhdGEgPSBbXSwgc2VyaWVzRGF0YSA9IFtdO1xyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgIHhBeGlzRGF0YS5wdXNoKGl0ZW1bJ25hbWUnXSk7XHJcbiAgICAgICAgICBzZXJpZXNEYXRhLnB1c2goaXRlbVsndmFsdWUnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHhBeGlzRGF0YTogeEF4aXNEYXRhLFxyXG4gICAgICAgICAgc2VyaWVzRGF0YTogc2VyaWVzRGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcjYnRuX2FwcF91c2UnLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIHR5cGUgPSAkKCcjdGFiX2FwcF91c2UnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICAgICAgdmFyIGRhdGVfc3RhcnQgPSAkKCcjZGF0ZV9zdGFydF91c2UnKS52YWwoKSwgZGF0ZV9lbmQgPSAkKCcjZGF0ZV9lbmRfdXNlJykudmFsKCk7XHJcbiAgICAgICAgaWYgKGNvbW1vbi5pc0xlc3MzMERheShkYXRlX3N0YXJ0LCBkYXRlX2VuZCkpIGFwcFVzZUZldGNoRGF0YSh0eXBlLCBkYXRlX3N0YXJ0LCBkYXRlX2VuZCk7XHJcbiAgICAgICAgZWxzZSAkLmFsZXJ0KCfml7bpl7Tpl7TpmpTkuI3lvpfotoXov4czMOWkqScpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnI2J0bl9hcHBfdXNlJykudHJpZ2dlcignY2xpY2snKTtcclxuXHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ3RhYkNoYW5nZScsICcudGFiJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFwcFVzZUZldGNoRGF0YSgkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI2RhdGVfc3RhcnRfdXNlJykudmFsKCksICQoJyNkYXRlX2VuZF91c2UnKS52YWwoKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyB0YWIg5YiH5o2iXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnRhYjEgLnVsbGknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignY2xhc3MnKS5pbmRleE9mKCdsaUFjdCcpID49IDApIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgZGF0ZV9zdGFydCA9ICQoJyNkYXRlX3N0YXJ0X3VzZScpLnZhbCgpLCBkYXRlX2VuZCA9ICQoJyNkYXRlX2VuZF91c2UnKS52YWwoKTtcclxuICAgICAgICBpZiAoIWNvbW1vbi5pc0xlc3MzMERheShkYXRlX3N0YXJ0LCBkYXRlX2VuZCkpIHtcclxuICAgICAgICAgICQuYWxlcnQoJ+aXtumXtOmXtOmalOS4jeW+l+i2hei/hzMw5aSpJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnbGlBY3QnKTtcclxuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2xpQWN0Jyk7XHJcbiAgICAgICAgICBhcHBVc2VGZXRjaERhdGEoJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyksIGRhdGVfc3RhcnQsIGRhdGVfZW5kKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyKGRhdGEsIGNhdGVnb3J5LCB0eXBlKSB7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeSkge1xyXG4gICAgICAgICAgY2FzZSAnYXBwX3RyYWZmaWMnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fYXBwX3RyYWZmaWMgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnIzAwYmVmZiddLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICcxMyUnLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzAlJyxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnMCUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnNSUnLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICBib3VuZGFyeUdhcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWyd4QXhpc0RhdGEnXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn6K6/6Zeu6YePJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3Nlcmllc0RhdGEnXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZWNoYXJ0X2FwcF90cmFmZmljLnNldE9wdGlvbihvcHRpb25fYXBwX3RyYWZmaWMpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9hcHBfdHJhZmZpYyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAnYXBwX3RyYWZmaWMxMCc6IHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbl9hcHBfdHJhZmZpYzEwID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyMyOWM5ODMnXSxcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZicsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaGFkb3cnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICc1JScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICBzcGxpdExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICB5QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydhcHBsaWNhdGlvbiddWyd5QXhpc0RhdGEnXSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduV2l0aExhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzI5Yzk4MydcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICforr/pl67ph48nLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgICAgICAgYmFyV2lkdGg6IDIwLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydhcHBsaWNhdGlvbiddWydzZXJpZXNEYXRhJ11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVjaGFydF9hcHBfdHJhZmZpYzEwLnNldE9wdGlvbihvcHRpb25fYXBwX3RyYWZmaWMxMCk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X2FwcF90cmFmZmljMTApO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uX2FwcF90cmFmZmljMTBfcGllID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyNmZjNmNjYnLCAnI2I2NTNkMScsICcjM2Y4NmVhJywgJyMxNGM3ZTAnLCAnIzUzYmI3NycsICcjZmRkNTFkJywgJyNmZDhjMWQnLCAnI2ZmM2Y2NicsICcjYjY1M2NmJ10sXHJcbiAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6ICfkvb/nlKjlupTnlKjnmoTnlKjmiLfnsbvlnovnu5/orqEnLFxyXG4gICAgICAgICAgICAgICAgeDogJzQ1JScsXHJcbiAgICAgICAgICAgICAgICB5OiAnOTAlJyxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyNiOGQxZWYnLFxyXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE2XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2F9IDxici8+e2J9IDoge2N9ICh7ZH0lKVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlcjogWyc1NSUnLCAnNTAlJ10sXHJcbiAgICAgICAgICAgICAgICAgIHJhZGl1czogWycwJywgJzYwJSddLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVsndXNlcnR5cGUnXVsnc2VyaWVzRGF0YSddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlY2hhcnRfYXBwX3RyYWZmaWMxMF9waWUuc2V0T3B0aW9uKG9wdGlvbl9hcHBfdHJhZmZpYzEwX3BpZSk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X2FwcF90cmFmZmljMTBfcGllKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdhcHBfdXNlJzoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uX2FwcF91c2UgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnIzAwYmZmZiddLFxyXG4gICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjOTJhY2NmJyxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3NoYWRvdydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMCUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcwJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3hBeGlzRGF0YSddLFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxpZ25XaXRoTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3RvcCcsXHJcbiAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwYmZmZidcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHR5cGUgPT09ICdwZXJzb24nID8gJ+S9v+eUqOS6uuaVsCcgOiAn5L2/55So5qyh5pWwJyxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgICAgICAgIGJhcldpZHRoOiAzMCxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVsnc2VyaWVzRGF0YSddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlY2hhcnRfYXBwX3VzZS5zZXRPcHRpb24ob3B0aW9uX2FwcF91c2UpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9hcHBfdXNlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyDml6XmnJ/lpITnkIZcclxuICAgICAgdmFyIGRhdGVfc3RhcnRfdHJhZmZpYyA9IHtcclxuICAgICAgICAgIGVsZW06ICcjZGF0ZV9zdGFydF90cmFmZmljJyxcclxuICAgICAgICAgIG1heDogbGF5ZGF0ZS5ub3coLTIpLFxyXG4gICAgICAgICAgaXNjbGVhcjogZmFsc2UsXHJcbiAgICAgICAgICBpc3RvZGF5OiBmYWxzZSxcclxuICAgICAgICAgIGNob29zZTogZnVuY3Rpb24gKGRhdGFzKSB7XHJcbiAgICAgICAgICAgIGRhdGVfZW5kX3RyYWZmaWMubWluID0gZGF0YXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRlX3N0YXJ0X3RyYWZmaWMxMCA9ICQuZXh0ZW5kKHt9LCBkYXRlX3N0YXJ0X3RyYWZmaWMsIHtcclxuICAgICAgICAgIGVsZW06ICcjZGF0ZV9zdGFydF90cmFmZmljMTAnLCBjaG9vc2U6IGZ1bmN0aW9uIChkYXRhcykge1xyXG4gICAgICAgICAgICBkYXRlX2VuZF90cmFmZmljMTAubWluID0gZGF0YXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgZGF0ZV9zdGFydF91c2UgPSAkLmV4dGVuZCh7fSwgZGF0ZV9zdGFydF90cmFmZmljLCB7XHJcbiAgICAgICAgICBlbGVtOiAnI2RhdGVfc3RhcnRfdXNlJywgY2hvb3NlOiBmdW5jdGlvbiAoZGF0YXMpIHtcclxuICAgICAgICAgICAgZGF0ZV9lbmRfdXNlLm1pbiA9IGRhdGFzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIGRhdGVfZW5kX3RyYWZmaWMgPSB7XHJcbiAgICAgICAgICBlbGVtOiAnI2RhdGVfZW5kX3RyYWZmaWMnLFxyXG4gICAgICAgICAgbWluOiBsYXlkYXRlLm5vdygtNyksXHJcbiAgICAgICAgICBtYXg6IGxheWRhdGUubm93KC0xKSxcclxuICAgICAgICAgIGlzY2xlYXI6IGZhbHNlLFxyXG4gICAgICAgICAgaXN0b2RheTogZmFsc2UsXHJcbiAgICAgICAgICBjaG9vc2U6IGZ1bmN0aW9uIChkYXRhcykge1xyXG4gICAgICAgICAgICBkYXRlX3N0YXJ0X3RyYWZmaWMubWF4ID0gZGF0YXM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRlX2VuZF90cmFmZmljMTAgPSAkLmV4dGVuZCh7fSwgZGF0ZV9lbmRfdHJhZmZpYywge1xyXG4gICAgICAgICAgZWxlbTogJyNkYXRlX2VuZF90cmFmZmljMTAnLCBjaG9vc2U6IGZ1bmN0aW9uIChkYXRhcykge1xyXG4gICAgICAgICAgICBkYXRlX3N0YXJ0X3RyYWZmaWMxMC5tYXggPSBkYXRhcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KSxcclxuICAgICAgICBkYXRlX2VuZF91c2UgPSAkLmV4dGVuZCh7fSwgZGF0ZV9lbmRfdHJhZmZpYywge1xyXG4gICAgICAgICAgZWxlbTogJyNkYXRlX2VuZF91c2UnLCBjaG9vc2U6IGZ1bmN0aW9uIChkYXRhcykge1xyXG4gICAgICAgICAgICBkYXRlX3N0YXJ0X3VzZS5tYXggPSBkYXRhcztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubGF5ZGF0ZS1pY29uJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBvYmogPSBldmFsKCcoJyArIHRoaXMuaWQgKyAnKScpO1xyXG4gICAgICAgIGxheWRhdGUob2JqKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxufSkiXX0=
