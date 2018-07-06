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
    var echart_usertype = common.echart.init(document.getElementById('usertype'));
    echart_usertype.on('legendselectchanged', function (param) {
      updateTotal(param['selected']);
    });
    var echart_usertype_nofirst = common.echart.init(document.getElementById('usertype_nofirst'));
    var echart_usertype_isfirst = common.echart.init(document.getElementById('usertype_isfirst'));

    /**
     * @description 平台使用用户统计 用户类型分布
     * @param scope 范围(all:所有用户类型，part：部分用户类型)
     */
    var userType = {};

    function usertypeTotalFetchData(scope) {
      $.getJSON(service.prefix + '/platform/usertype?scope=' + scope + '&errorDomId=usertype', function (result) {
        if (result['code'] == 200) {
          $('#total').html(result['data']['userrole']['total']);
          userType = result['data']['userrole'];
          render(convertData(result['data']['userrole'], scope), 'pie');
        }
      });
    }

    var usertypeObj = {
      edu: '教育局',
      school: '学校',
      userrole: {
        edumanager: '教育局管理者',
        eduemploye: '教育局职工',
        schmanager: '学校管理者',
        parent: '家长',
        schemploye: '学校职工',
        teacher: '教师',
        student: '学生'
      }
    };

    if (role === 'school') {
      delete usertypeObj.userrole.edumanager;
      delete usertypeObj.userrole.eduemploye;
    }

    function convertData(data, scope) {
      var legendData = [],
          seriesData1 = [],
          seriesData2 = [],
          total_school = 0;
      $.each(data, function (key, value) {
        if (usertypeObj['userrole'][key]) {
          legendData.push(usertypeObj['userrole'][key]);
          seriesData2.push({ name: usertypeObj['userrole'][key], value: value });
          if (key != 'edumanager' && key != 'eduemploye') total_school += value;
        }
      });
      if (role !== 'school') {
        seriesData1.push({ name: usertypeObj['edu'], value: data['eduemploye'] });
        seriesData1.push({ name: usertypeObj['school'], value: total_school });
      }

      return {
        legendData: legendData,
        seriesData1: seriesData1,
        seriesData2: seriesData2
      };
    }

    function updateTotal(data) {
      var total = 0;
      $.each(data, function (key, value) {
        if (value) {
          $.each(usertypeObj.userrole, function (k, v) {
            if (key === v) total += userType[k];
          });
        }
      });
      $('#total').html(total);
    }

    if (role === 'school') usertypeTotalFetchData('part');else usertypeTotalFetchData('all');

    /**
     * @description 使用平台的用户类型统计
     * @param isfirst 是否是首次登陆(true:首次登陆，false:非首次登陆)
     * @param time 时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     */
    function usertypeFetchData(isfirst, time, domId) {
      if (domId === 'usertype_nofirst') {
        echart_usertype_nofirst = common.echart.init(document.getElementById('usertype_nofirst'));
        common.echart.showLoading(echart_usertype_nofirst);
      } else {
        echart_usertype_isfirst = common.echart.init(document.getElementById('usertype_isfirst'));
        common.echart.showLoading(echart_usertype_isfirst);
      }
      $.getJSON(service.prefix + '/platform/usertype/' + isfirst + '/used?time=' + time + '&errorDomId=' + domId, function (result) {
        if (result['code'] == 200) render(convertBarData(result['data']), domId);
      });
    }

    function convertBarData(data) {
      var legendData = [],
          xAxisData = [],
          seriesData = [];
      $.each(data, function (index, item) {
        var temp = (item['time'] + "").split(' ')[0];
        temp = temp.length < 3 ? temp.length < 2 ? '0' + temp + ':00' : temp + ':00' : temp;
        xAxisData.push(temp);
      });
      if (role === 'school') delete usertypeObj.userrole.eduemploye;
      $.each(usertypeObj.userrole, function (key, value) {
        legendData.push(usertypeObj.userrole[key]);
        var temp = { name: value, type: 'bar', stack: '总量', barWidth: 20, data: [] };
        $.each(data, function (index, item) {
          temp.data.push(item[key]);
        });
        seriesData.push(temp);
      });

      return {
        legendData: legendData,
        xAxisData: xAxisData,
        seriesData: seriesData
      };
    }

    $('body').on('selectChange', '.selectTop', function () {
      usertypeFetchData($(this).attr('data-fun'), $(this).attr('data-value'), $(this).attr('data-id'));
    });
    $('.selectTop').trigger('selectChange');

    function render(data, category) {
      switch (category) {
        case 'pie':
          {
            var option_usertype = {};
            if (role === 'school') {
              option_usertype = {
                color: ['#ff3f66', '#53bb77', '#3f86ea', '#fdd51d'],
                tooltip: {
                  trigger: 'item',
                  formatter: "{b} <br/> {c} ({d}%)"
                },
                legend: {
                  orient: 'vertical',
                  x: '20%',
                  y: 'center',
                  data: data['legendData'],
                  itemGap: 20,
                  textStyle: { color: '#e7e7e7', fontSize: 14 }
                },
                calculable: true,
                series: [{
                  type: 'pie',
                  radius: [30, 110],
                  center: ['65%', '50%'],
                  roseType: 'area',
                  data: data['seriesData2']
                }, {
                  name: '内圆圈',
                  type: 'pie',
                  radius: [20, 21],
                  center: ['65%', '50%'],
                  silent: true,
                  labelLine: { normal: { show: false } },
                  itemStyle: {
                    normal: {
                      color: '#3758ab'
                    }
                  },
                  data: [100]
                }, {
                  name: '外圆圈',
                  type: 'pie',
                  radius: [120, 121],
                  center: ['65%', '50%'],
                  silent: true,
                  labelLine: { normal: { show: false } },
                  itemStyle: {
                    normal: {
                      color: '#3758ab'
                    }
                  },
                  data: [100]
                }]
              };
            } else {
              option_usertype = {
                color: ['#306cc1', '#d0174f', '#fdd51d', '#53bb77', '#14c7e0', '#3f86ea', '#b653cf', '#ff3f66', '#fd8c1d'],
                backgroundColor: '',
                tooltip: {
                  trigger: 'item',
                  formatter: "{b} <br /> {c} ({d}%)"
                },
                legend: {
                  orient: 'vertical',
                  x: '5%',
                  y: '20%',
                  itemGap: 20,
                  textStyle: { color: '#e7e7e7', fontSize: 14 },
                  data: data['legendData']
                },
                series: [{
                  type: 'pie',
                  center: ['60%', '50%'],
                  radius: [0, '40%'],
                  label: {
                    normal: {
                      position: 'inner'
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: data['seriesData1']
                }, {
                  type: 'pie',
                  center: ['60%', '50%'],
                  radius: ['55%', '75%'],
                  data: data['seriesData2']
                }]
              };
            }
            echart_usertype.setOption(option_usertype);
            echart_usertype.hideLoading();
            break;
          }
        default:
          {
            var option_bar = {
              color: ['#2569ca', '#377ddf', '#4e8ee9', '#5b9af3', '#82adeb', '#a5c6f5', '#c8dcf9'],
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              legend: {
                data: data['legendData'],
                x: 'center',
                itemGap: 20,
                textStyle: {
                  color: '#a1bce9',
                  fontSize: 14
                }
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                left: '1%',
                right: '1%',
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
                  alignWithLabel: true
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
              series: data['seriesData']
            };

            if (category === 'usertype_nofirst') {
              echart_usertype_nofirst.setOption(option_bar);
              common.echart.hideLoading(echart_usertype_nofirst);
            } else if (category === 'usertype_isfirst') {
              echart_usertype_isfirst.setOption(option_bar);
              common.echart.hideLoading(echart_usertype_isfirst);
            }
          }
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3VzZXJfdHlwZS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiY29uZmlncGF0aHMiLCJkZWZpbmUiLCIkIiwic2VydmljZSIsImNvbW1vbiIsInJvbGUiLCJlY2hhcnRfdXNlcnR5cGUiLCJlY2hhcnQiLCJpbml0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIm9uIiwicGFyYW0iLCJ1cGRhdGVUb3RhbCIsImVjaGFydF91c2VydHlwZV9ub2ZpcnN0IiwiZWNoYXJ0X3VzZXJ0eXBlX2lzZmlyc3QiLCJ1c2VyVHlwZSIsInVzZXJ0eXBlVG90YWxGZXRjaERhdGEiLCJzY29wZSIsImdldEpTT04iLCJwcmVmaXgiLCJyZXN1bHQiLCJodG1sIiwicmVuZGVyIiwiY29udmVydERhdGEiLCJ1c2VydHlwZU9iaiIsImVkdSIsInNjaG9vbCIsInVzZXJyb2xlIiwiZWR1bWFuYWdlciIsImVkdWVtcGxveWUiLCJzY2htYW5hZ2VyIiwicGFyZW50Iiwic2NoZW1wbG95ZSIsInRlYWNoZXIiLCJzdHVkZW50IiwiZGF0YSIsImxlZ2VuZERhdGEiLCJzZXJpZXNEYXRhMSIsInNlcmllc0RhdGEyIiwidG90YWxfc2Nob29sIiwiZWFjaCIsImtleSIsInZhbHVlIiwicHVzaCIsIm5hbWUiLCJ0b3RhbCIsImsiLCJ2IiwidXNlcnR5cGVGZXRjaERhdGEiLCJpc2ZpcnN0IiwidGltZSIsImRvbUlkIiwic2hvd0xvYWRpbmciLCJjb252ZXJ0QmFyRGF0YSIsInhBeGlzRGF0YSIsInNlcmllc0RhdGEiLCJpbmRleCIsIml0ZW0iLCJ0ZW1wIiwic3BsaXQiLCJsZW5ndGgiLCJ0eXBlIiwic3RhY2siLCJiYXJXaWR0aCIsImF0dHIiLCJ0cmlnZ2VyIiwiY2F0ZWdvcnkiLCJvcHRpb25fdXNlcnR5cGUiLCJjb2xvciIsInRvb2x0aXAiLCJmb3JtYXR0ZXIiLCJsZWdlbmQiLCJvcmllbnQiLCJ4IiwieSIsIml0ZW1HYXAiLCJ0ZXh0U3R5bGUiLCJmb250U2l6ZSIsImNhbGN1bGFibGUiLCJzZXJpZXMiLCJyYWRpdXMiLCJjZW50ZXIiLCJyb3NlVHlwZSIsInNpbGVudCIsImxhYmVsTGluZSIsIm5vcm1hbCIsInNob3ciLCJpdGVtU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJsYWJlbCIsInBvc2l0aW9uIiwic2V0T3B0aW9uIiwiaGlkZUxvYWRpbmciLCJvcHRpb25fYmFyIiwiYXhpc1BvaW50ZXIiLCJncmlkIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwiY29udGFpbkxhYmVsIiwieEF4aXMiLCJheGlzTGFiZWwiLCJheGlzTGluZSIsImxpbmVTdHlsZSIsImF4aXNUaWNrIiwiYWxpZ25XaXRoTGFiZWwiLCJ5QXhpcyIsInNwbGl0TGluZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsa0JBQWM7QUFEVDtBQUZNLENBQWY7QUFNQUgsUUFBUSxDQUFDLFlBQUQsQ0FBUixFQUF3QixVQUFVSSxXQUFWLEVBQXVCO0FBQzdDO0FBQ0FKLFVBQVFDLE1BQVIsQ0FBZUcsV0FBZjs7QUFFQUMsU0FBTyxFQUFQLEVBQVcsQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixRQUF0QixDQUFYLEVBQTRDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsTUFBdEIsRUFBOEI7QUFDeEUsUUFBSUMsT0FBT0QsT0FBT0MsSUFBbEI7QUFDQSxRQUFJQyxrQkFBa0JGLE9BQU9HLE1BQVAsQ0FBY0MsSUFBZCxDQUFtQkMsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFuQixDQUF0QjtBQUNBSixvQkFBZ0JLLEVBQWhCLENBQW1CLHFCQUFuQixFQUEwQyxVQUFVQyxLQUFWLEVBQWlCO0FBQ3pEQyxrQkFBWUQsTUFBTSxVQUFOLENBQVo7QUFDRCxLQUZEO0FBR0EsUUFBSUUsMEJBQTBCVixPQUFPRyxNQUFQLENBQWNDLElBQWQs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LHVCQUFPLElBRkg7QUFHSkMsd0JBQVEsSUFISjtBQUlKQyw4QkFBYztBQUpWLGVBckJTO0FBMkJmQyxxQkFBTyxDQUNMO0FBQ0V2QyxzQkFBTSxVQURSO0FBRUUxQixzQkFBTUEsS0FBSyxXQUFMLENBRlI7QUFHRWtFLDJCQUFXO0FBQ1R6Qiw2QkFBVztBQUNUQyw4QkFBVTtBQUREO0FBREYsaUJBSGI7QUFRRXlCLDBCQUFVO0FBQ1JDLDZCQUFXO0FBQ1RuQywyQkFBTztBQURFO0FBREgsaUJBUlo7QUFhRW9DLDBCQUFVO0FBQ1JDLGtDQUFnQjtBQURSO0FBYlosZUFESyxDQTNCUTtBQThDZkMscUJBQU8sQ0FDTDtBQUNFN0Msc0JBQU0sT0FEUjtBQUVFOEMsMkJBQVc7QUFDVEosNkJBQVc7QUFDVG5DLDJCQUFPO0FBREU7QUFERixpQkFGYjtBQU9Fa0MsMEJBQVU7QUFDUkMsNkJBQVc7QUFDVG5DLDJCQUFPO0FBREU7QUFESDtBQVBaLGVBREssQ0E5Q1E7QUE2RGZXLHNCQUFRNUMsS0FBSyxZQUFMO0FBN0RPLGFBQWpCOztBQWdFQSxnQkFBSStCLGFBQWEsa0JBQWpCLEVBQXFDO0FBQ25DckQsc0NBQXdCOEUsU0FBeEIsQ0FBa0NFLFVBQWxDO0FBQ0ExRixxQkFBT0csTUFBUCxDQUFjc0YsV0FBZCxDQUEwQi9FLHVCQUExQjtBQUNELGFBSEQsTUFJSyxJQUFJcUQsYUFBYSxrQkFBakIsRUFBcUM7QUFDeENwRCxzQ0FBd0I2RSxTQUF4QixDQUFrQ0UsVUFBbEM7QUFDQTFGLHFCQUFPRyxNQUFQLENBQWNzRixXQUFkLENBQTBCOUUsdUJBQTFCO0FBQ0Q7QUFDRjtBQWhMSDtBQWtMRDtBQUNGLEdBcFREO0FBcVRELENBelREIiwiZmlsZSI6ImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3VzZXJfdHlwZS0zMWJhMzhiMjMxLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZS5jb25maWcoe1xyXG4gIGJhc2VVcmw6ICcuLi8nLFxyXG4gIHBhdGhzOiB7XHJcbiAgICAnY3VzdG9tQ29uZic6ICdzdGF0aXN0aWNzL2pzL2N1c3RvbUNvbmYuanMnXHJcbiAgfVxyXG59KTtcclxucmVxdWlyZShbJ2N1c3RvbUNvbmYnXSwgZnVuY3Rpb24gKGNvbmZpZ3BhdGhzKSB7XHJcbiAgLy8gY29uZmlncGF0aHMucGF0aHMuZGlhbG9nID0gXCJteXNwYWNlL2pzL2FwcERpYWxvZy5qc1wiO1xyXG4gIHJlcXVpcmUuY29uZmlnKGNvbmZpZ3BhdGhzKTtcclxuXHJcbiAgZGVmaW5lKCcnLCBbJ2pxdWVyeScsICdzZXJ2aWNlJywgJ2NvbW1vbiddLCBmdW5jdGlvbiAoJCwgc2VydmljZSwgY29tbW9uKSB7XHJcbiAgICB2YXIgcm9sZSA9IGNvbW1vbi5yb2xlO1xyXG4gICAgdmFyIGVjaGFydF91c2VydHlwZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcnR5cGUnKSk7XHJcbiAgICBlY2hhcnRfdXNlcnR5cGUub24oJ2xlZ2VuZHNlbGVjdGNoYW5nZWQnLCBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgdXBkYXRlVG90YWwocGFyYW1bJ3NlbGVjdGVkJ10pO1xyXG4gICAgfSk7XHJcbiAgICB2YXIgZWNoYXJ0X3VzZXJ0eXBlX25vZmlyc3QgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJ0eXBlX25vZmlyc3QnKSk7XHJcbiAgICB2YXIgZWNoYXJ0X3VzZXJ0eXBlX2lzZmlyc3QgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJ0eXBlX2lzZmlyc3QnKSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w5L2/55So55So5oi357uf6K6hIOeUqOaIt+exu+Wei+WIhuW4g1xyXG4gICAgICogQHBhcmFtIHNjb3BlIOiMg+WbtChhbGw65omA5pyJ55So5oi357G75Z6L77yMcGFydO+8mumDqOWIhueUqOaIt+exu+WeiylcclxuICAgICAqL1xyXG4gICAgdmFyIHVzZXJUeXBlID0ge307XHJcblxyXG4gICAgZnVuY3Rpb24gdXNlcnR5cGVUb3RhbEZldGNoRGF0YShzY29wZSkge1xyXG4gICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3BsYXRmb3JtL3VzZXJ0eXBlP3Njb3BlPScgKyBzY29wZSArICcmZXJyb3JEb21JZD11c2VydHlwZScsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSB7XHJcbiAgICAgICAgICAkKCcjdG90YWwnKS5odG1sKHJlc3VsdFsnZGF0YSddWyd1c2Vycm9sZSddWyd0b3RhbCddKTtcclxuICAgICAgICAgIHVzZXJUeXBlID0gcmVzdWx0WydkYXRhJ11bJ3VzZXJyb2xlJ107XHJcbiAgICAgICAgICByZW5kZXIoY29udmVydERhdGEocmVzdWx0WydkYXRhJ11bJ3VzZXJyb2xlJ10sIHNjb3BlKSwgJ3BpZScpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHZhciB1c2VydHlwZU9iaiA9IHtcclxuICAgICAgZWR1OiAn5pWZ6IKy5bGAJyxcclxuICAgICAgc2Nob29sOiAn5a2m5qChJyxcclxuICAgICAgdXNlcnJvbGU6IHtcclxuICAgICAgICBlZHVtYW5hZ2VyOiAn5pWZ6IKy5bGA566h55CG6ICFJyxcclxuICAgICAgICBlZHVlbXBsb3llOiAn5pWZ6IKy5bGA6IGM5belJyxcclxuICAgICAgICBzY2htYW5hZ2VyOiAn5a2m5qCh566h55CG6ICFJyxcclxuICAgICAgICBwYXJlbnQ6ICflrrbplb8nLFxyXG4gICAgICAgIHNjaGVtcGxveWU6ICflrabmoKHogYzlt6UnLFxyXG4gICAgICAgIHRlYWNoZXI6ICfmlZnluIgnLFxyXG4gICAgICAgIHN0dWRlbnQ6ICflrabnlJ8nXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKHJvbGUgPT09ICdzY2hvb2wnKSB7XHJcbiAgICAgIGRlbGV0ZSAgdXNlcnR5cGVPYmoudXNlcnJvbGUuZWR1bWFuYWdlcjtcclxuICAgICAgZGVsZXRlICB1c2VydHlwZU9iai51c2Vycm9sZS5lZHVlbXBsb3llO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnREYXRhKGRhdGEsIHNjb3BlKSB7XHJcbiAgICAgIHZhciBsZWdlbmREYXRhID0gW10sIHNlcmllc0RhdGExID0gW10sIHNlcmllc0RhdGEyID0gW10sIHRvdGFsX3NjaG9vbCA9IDA7XHJcbiAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGlmICh1c2VydHlwZU9ialsndXNlcnJvbGUnXVtrZXldKSB7XHJcbiAgICAgICAgICBsZWdlbmREYXRhLnB1c2godXNlcnR5cGVPYmpbJ3VzZXJyb2xlJ11ba2V5XSk7XHJcbiAgICAgICAgICBzZXJpZXNEYXRhMi5wdXNoKHtuYW1lOiB1c2VydHlwZU9ialsndXNlcnJvbGUnXVtrZXldLCB2YWx1ZTogdmFsdWV9KTtcclxuICAgICAgICAgIGlmIChrZXkgIT0gJ2VkdW1hbmFnZXInICYmIGtleSAhPSAnZWR1ZW1wbG95ZScpIHRvdGFsX3NjaG9vbCArPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAocm9sZSAhPT0gJ3NjaG9vbCcpIHtcclxuICAgICAgICBzZXJpZXNEYXRhMS5wdXNoKHtuYW1lOiB1c2VydHlwZU9ialsnZWR1J10sIHZhbHVlOiBkYXRhWydlZHVlbXBsb3llJ119KTtcclxuICAgICAgICBzZXJpZXNEYXRhMS5wdXNoKHtuYW1lOiB1c2VydHlwZU9ialsnc2Nob29sJ10sIHZhbHVlOiB0b3RhbF9zY2hvb2x9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsZWdlbmREYXRhOiBsZWdlbmREYXRhLFxyXG4gICAgICAgIHNlcmllc0RhdGExOiBzZXJpZXNEYXRhMSxcclxuICAgICAgICBzZXJpZXNEYXRhMjogc2VyaWVzRGF0YTJcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVUb3RhbChkYXRhKSB7XHJcbiAgICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgJC5lYWNoKHVzZXJ0eXBlT2JqLnVzZXJyb2xlLCBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB2KSB0b3RhbCArPSB1c2VyVHlwZVtrXTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICQoJyN0b3RhbCcpLmh0bWwodG90YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyb2xlID09PSAnc2Nob29sJykgdXNlcnR5cGVUb3RhbEZldGNoRGF0YSgncGFydCcpO1xyXG4gICAgZWxzZSB1c2VydHlwZVRvdGFsRmV0Y2hEYXRhKCdhbGwnKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXNjcmlwdGlvbiDkvb/nlKjlubPlj7DnmoTnlKjmiLfnsbvlnovnu5/orqFcclxuICAgICAqIEBwYXJhbSBpc2ZpcnN0IOaYr+WQpuaYr+mmluasoeeZu+mZhih0cnVlOummluasoeeZu+mZhu+8jGZhbHNlOumdnummluasoeeZu+mZhilcclxuICAgICAqIEBwYXJhbSB0aW1lIOaXtumXtOautSh5ZXN0ZXJkYXk65pio5aSp77yMbGFzdHNldmVu77ya5pyA6L+R5LiD5aSp77yMbGFzdHRoaXJ0ee+8muacgOi/keS4ieWNgeWkqSlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXNlcnR5cGVGZXRjaERhdGEoaXNmaXJzdCwgdGltZSwgZG9tSWQpIHtcclxuICAgICAgaWYgKGRvbUlkID09PSAndXNlcnR5cGVfbm9maXJzdCcpIHtcclxuICAgICAgICBlY2hhcnRfdXNlcnR5cGVfbm9maXJzdCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcnR5cGVfbm9maXJzdCcpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF91c2VydHlwZV9ub2ZpcnN0KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBlY2hhcnRfdXNlcnR5cGVfaXNmaXJzdCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcnR5cGVfaXNmaXJzdCcpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF91c2VydHlwZV9pc2ZpcnN0KTtcclxuICAgICAgfVxyXG4gICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3BsYXRmb3JtL3VzZXJ0eXBlLycgKyBpc2ZpcnN0ICsgJy91c2VkP3RpbWU9JyArIHRpbWUgKyAnJmVycm9yRG9tSWQ9JyArIGRvbUlkLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHJlbmRlcihjb252ZXJ0QmFyRGF0YShyZXN1bHRbJ2RhdGEnXSksIGRvbUlkKVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRCYXJEYXRhKGRhdGEpIHtcclxuICAgICAgdmFyIGxlZ2VuZERhdGEgPSBbXSwgeEF4aXNEYXRhID0gW10sIHNlcmllc0RhdGEgPSBbXTtcclxuICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIHZhciB0ZW1wID0gKGl0ZW1bJ3RpbWUnXSArIFwiXCIpLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgdGVtcCA9IHRlbXAubGVuZ3RoIDwgMyA/IHRlbXAubGVuZ3RoIDwgMiA/ICcwJyArIHRlbXAgKyAnOjAwJyA6IHRlbXAgKyAnOjAwJyA6IHRlbXA7XHJcbiAgICAgICAgeEF4aXNEYXRhLnB1c2godGVtcCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAocm9sZSA9PT0gJ3NjaG9vbCcpIGRlbGV0ZSB1c2VydHlwZU9iai51c2Vycm9sZS5lZHVlbXBsb3llO1xyXG4gICAgICAkLmVhY2godXNlcnR5cGVPYmoudXNlcnJvbGUsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgbGVnZW5kRGF0YS5wdXNoKHVzZXJ0eXBlT2JqLnVzZXJyb2xlW2tleV0pO1xyXG4gICAgICAgIHZhciB0ZW1wID0ge25hbWU6IHZhbHVlLCB0eXBlOiAnYmFyJywgc3RhY2s6ICfmgLvph48nLCBiYXJXaWR0aDogMjAsIGRhdGE6IFtdfTtcclxuICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICB0ZW1wLmRhdGEucHVzaChpdGVtW2tleV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNlcmllc0RhdGEucHVzaCh0ZW1wKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGxlZ2VuZERhdGE6IGxlZ2VuZERhdGEsXHJcbiAgICAgICAgeEF4aXNEYXRhOiB4QXhpc0RhdGEsXHJcbiAgICAgICAgc2VyaWVzRGF0YTogc2VyaWVzRGF0YVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnLnNlbGVjdFRvcCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdXNlcnR5cGVGZXRjaERhdGEoJCh0aGlzKS5hdHRyKCdkYXRhLWZ1bicpLCAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCh0aGlzKS5hdHRyKCdkYXRhLWlkJykpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcuc2VsZWN0VG9wJykudHJpZ2dlcignc2VsZWN0Q2hhbmdlJyk7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVuZGVyKGRhdGEsIGNhdGVnb3J5KSB7XHJcbiAgICAgIHN3aXRjaCAoY2F0ZWdvcnkpIHtcclxuICAgICAgICBjYXNlICdwaWUnOiB7XHJcbiAgICAgICAgICB2YXIgb3B0aW9uX3VzZXJ0eXBlID0ge307XHJcbiAgICAgICAgICBpZiAocm9sZSA9PT0gJ3NjaG9vbCcpIHtcclxuICAgICAgICAgICAgb3B0aW9uX3VzZXJ0eXBlID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyNmZjNmNjYnLCAnIzUzYmI3NycsICcjM2Y4NmVhJywgJyNmZGQ1MWQnXSxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2J9IDxici8+IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBvcmllbnQ6ICd2ZXJ0aWNhbCcsXHJcbiAgICAgICAgICAgICAgICB4OiAnMjAlJyxcclxuICAgICAgICAgICAgICAgIHk6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVsnbGVnZW5kRGF0YSddLFxyXG4gICAgICAgICAgICAgICAgaXRlbUdhcDogMjAsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtjb2xvcjogJyNlN2U3ZTcnLCBmb250U2l6ZTogMTR9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjYWxjdWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiBbMzAsIDExMF0sXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlcjogWyc2NSUnLCAnNTAlJ10sXHJcbiAgICAgICAgICAgICAgICAgIHJvc2VUeXBlOiAnYXJlYScsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3Nlcmllc0RhdGEyJ11cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICflhoXlnIblnIgnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiBbMjAsIDIxXSxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyOiBbJzY1JScsICc1MCUnXSxcclxuICAgICAgICAgICAgICAgICAgc2lsZW50OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBsYWJlbExpbmU6IHtub3JtYWw6IHtzaG93OiBmYWxzZX19LFxyXG4gICAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzM3NThhYidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFsxMDBdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiAn5aSW5ZyG5ZyIJyxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZScsXHJcbiAgICAgICAgICAgICAgICAgIHJhZGl1czogWzEyMCwgMTIxXSxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyOiBbJzY1JScsICc1MCUnXSxcclxuICAgICAgICAgICAgICAgICAgc2lsZW50OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBsYWJlbExpbmU6IHtub3JtYWw6IHtzaG93OiBmYWxzZX19LFxyXG4gICAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzM3NThhYidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFsxMDBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3B0aW9uX3VzZXJ0eXBlID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyMzMDZjYzEnLCAnI2QwMTc0ZicsICcjZmRkNTFkJywgJyM1M2JiNzcnLCAnIzE0YzdlMCcsICcjM2Y4NmVhJywgJyNiNjUzY2YnLCAnI2ZmM2Y2NicsICcjZmQ4YzFkJ10sXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnJyxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2J9IDxiciAvPiB7Y30gKHtkfSUpXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgb3JpZW50OiAndmVydGljYWwnLFxyXG4gICAgICAgICAgICAgICAgeDogJzUlJyxcclxuICAgICAgICAgICAgICAgIHk6ICcyMCUnLFxyXG4gICAgICAgICAgICAgICAgaXRlbUdhcDogMjAsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtjb2xvcjogJyNlN2U3ZTcnLCBmb250U2l6ZTogMTR9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVsnbGVnZW5kRGF0YSddXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZScsXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlcjogWyc2MCUnLCAnNTAlJ10sXHJcbiAgICAgICAgICAgICAgICAgIHJhZGl1czogWzAsICc0MCUnXSxcclxuICAgICAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnaW5uZXInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBsYWJlbExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydzZXJpZXNEYXRhMSddXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyOiBbJzYwJScsICc1MCUnXSxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiBbJzU1JScsICc3NSUnXSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVsnc2VyaWVzRGF0YTInXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVjaGFydF91c2VydHlwZS5zZXRPcHRpb24ob3B0aW9uX3VzZXJ0eXBlKTtcclxuICAgICAgICAgIGVjaGFydF91c2VydHlwZS5oaWRlTG9hZGluZygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgIHZhciBvcHRpb25fYmFyID0ge1xyXG4gICAgICAgICAgICBjb2xvcjogWycjMjU2OWNhJywgJyMzNzdkZGYnLCAnIzRlOGVlOScsICcjNWI5YWYzJywgJyM4MmFkZWInLCAnI2E1YzZmNScsICcjYzhkY2Y5J10sXHJcbiAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZicsXHJcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ2xlZ2VuZERhdGEnXSxcclxuICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICBpdGVtR2FwOiAyMCxcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ExYmNlOScsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTRcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdzaGFkb3cnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogJzElJyxcclxuICAgICAgICAgICAgICByaWdodDogJzElJyxcclxuICAgICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHhBeGlzOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3hBeGlzRGF0YSddLFxyXG4gICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYXhpc1RpY2s6IHtcclxuICAgICAgICAgICAgICAgICAgYWxpZ25XaXRoTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHlBeGlzOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgIHNwbGl0TGluZToge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHNlcmllczogZGF0YVsnc2VyaWVzRGF0YSddXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ3VzZXJ0eXBlX25vZmlyc3QnKSB7XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VydHlwZV9ub2ZpcnN0LnNldE9wdGlvbihvcHRpb25fYmFyKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfdXNlcnR5cGVfbm9maXJzdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChjYXRlZ29yeSA9PT0gJ3VzZXJ0eXBlX2lzZmlyc3QnKSB7XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VydHlwZV9pc2ZpcnN0LnNldE9wdGlvbihvcHRpb25fYmFyKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfdXNlcnR5cGVfaXNmaXJzdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pXHJcbiJdfQ==
