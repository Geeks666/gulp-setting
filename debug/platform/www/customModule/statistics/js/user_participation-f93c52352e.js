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
    var echart_user_trend = common.echart.init(document.getElementById('user_trend'));
    var echart_user_frequency = common.echart.init(document.getElementById('user_frequency'));

    /**
     * @description 平台使用趋势统计
     * @param starttime
     * @param endtime
     */
    function trandFetchData(starttime, endtime) {
      echart_user_trend = common.echart.init(document.getElementById('user_trend'));
      common.echart.showLoading(echart_user_trend);
      $.getJSON(service.prefix + '/platform/tendency?starttime=' + starttime + '&endtime=' + endtime + '&errorDomId=user_trend', function (result) {
        if (result['code'] == 200) render(convertData(result['data']), 'user_trend');
      });
    }

    function convertData(data) {
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

    /**
     * @description 平台用户使用频率
     * @param time 时间(格式：YYYY-MM-DD)
     */
    function frequencyFetchData(time) {
      echart_user_frequency = common.echart.init(document.getElementById('user_frequency'));
      common.echart.showLoading(echart_user_frequency);
      $.getJSON(service.prefix + '/platform/' + time + '/frequency?errorDomId=user_frequency', function (result) {
        if (result['code'] == 200) render(converBarData(result['data']), 'user_frequency');
      });
    }

    function converBarData(data) {
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

    function render(data, category) {
      switch (category) {
        case 'user_trend':
          {
            var option_user_frequency = {
              color: ['#00bfff'],
              tooltip: {
                trigger: 'axis',
                formatter: '{a} <br/> {b} : {c}'
              },
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '2%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisLabel: {
                  // rotate: 45,
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
                name: '使用平台用户数',
                type: 'line',
                data: data['seriesData']
              }
            };
            echart_user_trend.setOption(option_user_frequency);
            common.echart.hideLoading(echart_user_trend);
            break;
          }
        case 'user_frequency':
          {
            var option_user_frequency = {
              color: ['#00bfff'],
              title: {
                text: '用户平均每天使用次数',
                top: '0%',
                left: '40%',
                textStyle: {
                  color: '#b8d1ef',
                  fontWeight: 'normal'
                }
              },
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              tooltip: {
                trigger: 'axis',
                formatter: '{a} <br/> {b}次 : {c}个',
                axisPointer: {
                  type: 'shadow'
                }
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '2%',
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
                min: 'dataMin',
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
              series: [{
                name: '用户平均每天使用次数',
                type: 'bar',
                barWidth: 30,
                data: data['seriesData']
              }]
            };
            echart_user_frequency.setOption(option_user_frequency);
            common.echart.hideLoading(echart_user_frequency);
            break;
          }
        default:
          {}
      }
    }

    var start = {
      elem: '#date_start',
      max: laydate.now(-2),
      isclear: false,
      istoday: false,
      choose: function choose(datas) {
        end.min = datas;
      }
    };

    var end = {
      elem: '#date_end',
      min: laydate.now(-7),
      max: laydate.now(-1),
      isclear: false,
      istoday: false,
      choose: function choose(datas) {
        start.max = datas;
      }
    };

    $('body').on('click', '#date_start, #date_end', function () {
      if (this.id === 'date_start') laydate(start);else laydate(end);
    });

    $('#date_start').val(laydate.now(-8));
    $('#date_end').val(laydate.now(-1));
    $('body').on('click', '.dateConfirmBtn', function () {
      var starttime = $('#date_start').val(),
          endtime = $('#date_end').val();
      if (common.isLess30Day(starttime, endtime)) trandFetchData(starttime, endtime);else $.alert('时间间隔不得超过30天');
    });
    $('.dateConfirmBtn').trigger('click');

    // 用户使用频率默认日期
    $('#date_signle').val(laydate.now(-1));
    $('body').on('click', '#date_signle', function () {
      laydate({
        elem: '#date_signle',
        isclear: false,
        istoday: false,
        max: laydate.now(-1),
        choose: function choose(date) {
          frequencyFetchData(date);
        }
      });
    });
    frequencyFetchData(laydate.now(-1));
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3VzZXJfcGFydGljaXBhdGlvbi5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiY29uZmlncGF0aHMiLCJkZWZpbmUiLCIkIiwic2VydmljZSIsImNvbW1vbiIsImVjaGFydF91c2VyX3RyZW5kIiwiZWNoYXJ0IiwiaW5pdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJlY2hhcnRfdXNlcl9mcmVxdWVuY3kiLCJ0cmFuZEZldGNoRGF0YSIsInN0YXJ0dGltZSIsImVuZHRpbWUiLCJzaG93TG9hZGluZyIsImdldEpTT04iLCJwcmVmaXgiLCJyZXN1bHQiLCJyZW5kZXIiLCJjb252ZXJ0RGF0YSIsImRhdGEiLCJ4QXhpc0RhdGEiLCJzZXJpZXNEYXRhIiwiZWFjaCIsImluZGV4IiwiaXRlbSIsInB1c2giLCJzcGxpdCIsImZyZXF1ZW5jeUZldGNoRGF0YSIsInRpbWUiLCJjb252ZXJCYXJEYXRhIiwiY2F0ZWdvcnkiLCJvcHRpb25fdXNlcl9mcmVxdWVuY3kiLCJjb2xvciIsInRvb2x0aXAiLCJ0cmlnZ2VyIiwiZm9ybWF0dGVyIiwidGV4dFN0eWxlIiwiZm9udFNpemUiLCJncmlkIiwidG9wIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwiY29udGFpbkxhYmVsIiwieEF4aXMiLCJ0eXBlIiwiYm91bmRhcnlHYXAiLCJheGlzTGFiZWwiLCJheGlzTGluZSIsImxpbmVTdHlsZSIsImF4aXNUaWNrIiwieUF4aXMiLCJzcGxpdExpbmUiLCJzZXJpZXMiLCJuYW1lIiwic2V0T3B0aW9uIiwiaGlkZUxvYWRpbmciLCJ0aXRsZSIsInRleHQiLCJmb250V2VpZ2h0IiwiYXhpc1BvaW50ZXIiLCJtaW4iLCJiYXJXaWR0aCIsInN0YXJ0IiwiZWxlbSIsIm1heCIsImxheWRhdGUiLCJub3ciLCJpc2NsZWFyIiwiaXN0b2RheSIsImNob29zZSIsImRhdGFzIiwiZW5kIiwi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RixFQUFlMEUsR0FBZixDQUFtQlQsUUFBUUMsR0FBUixDQUFZLENBQUMsQ0FBYixDQUFuQjtBQUNBbEUsTUFBRSxNQUFGLEVBQVV3RSxFQUFWLENBQWEsT0FBYixFQUFzQixpQkFBdEIsRUFBeUMsWUFBWTtBQUNuRCxVQUFJOUQsWUFBWVYsRUFBRSxhQUFGLEVBQWlCMEUsR0FBakIsRUFBaEI7QUFBQSxVQUNFL0QsVUFBVVgsRUFBRSxXQUFGLEVBQWUwRSxHQUFmLEVBRFo7QUFFQSxVQUFJeEUsT0FBT3lFLFdBQVAsQ0FBbUJqRSxTQUFuQixFQUE4QkMsT0FBOUIsQ0FBSixFQUE0Q0YsZUFBZUMsU0FBZixFQUEwQkMsT0FBMUIsRUFBNUMsS0FDS1gsRUFBRTRFLEtBQUYsQ0FBUSxhQUFSO0FBQ04sS0FMRDtBQU1BNUUsTUFBRSxpQkFBRixFQUFxQmlDLE9BQXJCLENBQTZCLE9BQTdCOztBQUdBO0FBQ0FqQyxNQUFFLGNBQUYsRUFBa0IwRSxHQUFsQixDQUFzQlQsUUFBUUMsR0FBUixDQUFZLENBQUMsQ0FBYixDQUF0QjtBQUNBbEUsTUFBRSxNQUFGLEVBQVV3RSxFQUFWLENBQWEsT0FBYixFQUFzQixjQUF0QixFQUFzQyxZQUFZO0FBQ2hEUCxjQUFRO0FBQ05GLGNBQU0sY0FEQTtBQUVOSSxpQkFBUyxLQUZIO0FBR05DLGlCQUFTLEtBSEg7QUFJTkosYUFBS0MsUUFBUUMsR0FBUixDQUFZLENBQUMsQ0FBYixDQUpDO0FBS05HLGdCQUFRLGdCQUFVUSxJQUFWLEVBQWdCO0FBQ3RCbkQsNkJBQW1CbUQsSUFBbkI7QUFDRDtBQVBLLE9BQVI7QUFTRCxLQVZEO0FBV0FuRCx1QkFBbUJ1QyxRQUFRQyxHQUFSLENBQVksQ0FBQyxDQUFiLENBQW5CO0FBQ0QsR0FoUUg7QUFpUUQsQ0FyUUQiLCJmaWxlIjoiY3VzdG9tTW9kdWxlL3N0YXRpc3RpY3MvanMvdXNlcl9wYXJ0aWNpcGF0aW9uLWY5M2M1MjM1MmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdjdXN0b21Db25mJzogJ3N0YXRpc3RpY3MvanMvY3VzdG9tQ29uZi5qcydcclxuICB9XHJcbn0pO1xyXG5yZXF1aXJlKFsnY3VzdG9tQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICAvLyBjb25maWdwYXRocy5wYXRocy5kaWFsb2cgPSBcIm15c3BhY2UvanMvYXBwRGlhbG9nLmpzXCI7XHJcbiAgcmVxdWlyZS5jb25maWcoY29uZmlncGF0aHMpO1xyXG5cclxuICBkZWZpbmUoJycsIFsnanF1ZXJ5JywgJ3NlcnZpY2UnLCAnY29tbW9uJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgc2VydmljZSwgY29tbW9uKSB7XHJcbiAgICAgIHZhciBlY2hhcnRfdXNlcl90cmVuZCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcl90cmVuZCcpKTtcclxuICAgICAgdmFyIGVjaGFydF91c2VyX2ZyZXF1ZW5jeSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcl9mcmVxdWVuY3knKSk7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIOW5s+WPsOS9v+eUqOi2i+WKv+e7n+iuoVxyXG4gICAgICAgKiBAcGFyYW0gc3RhcnR0aW1lXHJcbiAgICAgICAqIEBwYXJhbSBlbmR0aW1lXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiB0cmFuZEZldGNoRGF0YShzdGFydHRpbWUsIGVuZHRpbWUpIHtcclxuICAgICAgICBlY2hhcnRfdXNlcl90cmVuZCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcl90cmVuZCcpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF91c2VyX3RyZW5kKTtcclxuICAgICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3BsYXRmb3JtL3RlbmRlbmN5P3N0YXJ0dGltZT0nICsgc3RhcnR0aW1lICsgJyZlbmR0aW1lPScgK1xyXG4gICAgICAgICAgZW5kdGltZSArICcmZXJyb3JEb21JZD11c2VyX3RyZW5kJywgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDIwMCkgcmVuZGVyKGNvbnZlcnREYXRhKHJlc3VsdFsnZGF0YSddKSwgJ3VzZXJfdHJlbmQnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBjb252ZXJ0RGF0YShkYXRhKSB7XHJcbiAgICAgICAgdmFyIHhBeGlzRGF0YSA9IFtdLCBzZXJpZXNEYXRhID0gW107XHJcbiAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgeEF4aXNEYXRhLnB1c2goaXRlbVsndGltZSddLnNwbGl0KCcgJylbMF0pO1xyXG4gICAgICAgICAgc2VyaWVzRGF0YS5wdXNoKGl0ZW1bJ3ZhbHVlJ10pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB4QXhpc0RhdGE6IHhBeGlzRGF0YSxcclxuICAgICAgICAgIHNlcmllc0RhdGE6IHNlcmllc0RhdGFcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w55So5oi35L2/55So6aKR546HXHJcbiAgICAgICAqIEBwYXJhbSB0aW1lIOaXtumXtCjmoLzlvI/vvJpZWVlZLU1NLUREKVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZnJlcXVlbmN5RmV0Y2hEYXRhKHRpbWUpIHtcclxuICAgICAgICBlY2hhcnRfdXNlcl9mcmVxdWVuY3kgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJfZnJlcXVlbmN5JykpO1xyXG4gICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3VzZXJfZnJlcXVlbmN5KTtcclxuICAgICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3BsYXRmb3JtLycgKyB0aW1lICsgJy9mcmVxdWVuY3k/ZXJyb3JEb21JZD11c2VyX2ZyZXF1ZW5jeScsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHJlbmRlcihjb252ZXJCYXJEYXRhKHJlc3VsdFsnZGF0YSddKSwgJ3VzZXJfZnJlcXVlbmN5Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNvbnZlckJhckRhdGEoZGF0YSkge1xyXG4gICAgICAgIHZhciB4QXhpc0RhdGEgPSBbXSwgc2VyaWVzRGF0YSA9IFtdO1xyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgIHhBeGlzRGF0YS5wdXNoKGl0ZW1bJ25hbWUnXSk7XHJcbiAgICAgICAgICBzZXJpZXNEYXRhLnB1c2goaXRlbVsndmFsdWUnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHhBeGlzRGF0YTogeEF4aXNEYXRhLFxyXG4gICAgICAgICAgc2VyaWVzRGF0YTogc2VyaWVzRGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyKGRhdGEsIGNhdGVnb3J5KSB7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeSkge1xyXG4gICAgICAgICAgY2FzZSAndXNlcl90cmVuZCc6IHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbl91c2VyX2ZyZXF1ZW5jeSA9IHtcclxuICAgICAgICAgICAgICBjb2xvcjogWycjMDBiZmZmJ10sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiAne2F9IDxici8+IHtifSA6IHtjfSdcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjOTJhY2NmJyxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMTUlJyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICByaWdodDogJzIlJyxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogJzMlJyxcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgeEF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJvdGF0ZTogNDUsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsaWduV2l0aExhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3hBeGlzRGF0YSddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICB5QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICBzcGxpdExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfkvb/nlKjlubPlj7DnlKjmiLfmlbAnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2xpbmUnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVsnc2VyaWVzRGF0YSddXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlY2hhcnRfdXNlcl90cmVuZC5zZXRPcHRpb24ob3B0aW9uX3VzZXJfZnJlcXVlbmN5KTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfdXNlcl90cmVuZCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAndXNlcl9mcmVxdWVuY3knOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fdXNlcl9mcmVxdWVuY3kgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnIzAwYmZmZiddLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAn55So5oi35bmz5Z2H5q+P5aSp5L2/55So5qyh5pWwJyxcclxuICAgICAgICAgICAgICAgIHRvcDogJzAlJyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICc0MCUnLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2I4ZDFlZicsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZicsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogJ3thfSA8YnIvPiB7Yn3mrKEgOiB7Y33kuKonLFxyXG4gICAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3NoYWRvdydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzE1JScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcyJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3hBeGlzRGF0YSddLFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxpZ25XaXRoTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgbWluOiAnZGF0YU1pbicsXHJcbiAgICAgICAgICAgICAgICAgIHNwbGl0TGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiAn55So5oi35bmz5Z2H5q+P5aSp5L2/55So5qyh5pWwJyxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgICAgICAgIGJhcldpZHRoOiAzMCxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVsnc2VyaWVzRGF0YSddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlY2hhcnRfdXNlcl9mcmVxdWVuY3kuc2V0T3B0aW9uKG9wdGlvbl91c2VyX2ZyZXF1ZW5jeSk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3VzZXJfZnJlcXVlbmN5KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgdmFyIHN0YXJ0ID0ge1xyXG4gICAgICAgIGVsZW06ICcjZGF0ZV9zdGFydCcsXHJcbiAgICAgICAgbWF4OiBsYXlkYXRlLm5vdygtMiksXHJcbiAgICAgICAgaXNjbGVhcjogZmFsc2UsXHJcbiAgICAgICAgaXN0b2RheTogZmFsc2UsXHJcbiAgICAgICAgY2hvb3NlOiBmdW5jdGlvbiAoZGF0YXMpIHtcclxuICAgICAgICAgIGVuZC5taW4gPSBkYXRhcztcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgZW5kID0ge1xyXG4gICAgICAgIGVsZW06ICcjZGF0ZV9lbmQnLFxyXG4gICAgICAgIG1pbjogbGF5ZGF0ZS5ub3coLTcpLFxyXG4gICAgICAgIG1heDogbGF5ZGF0ZS5ub3coLTEpLFxyXG4gICAgICAgIGlzY2xlYXI6IGZhbHNlLFxyXG4gICAgICAgIGlzdG9kYXk6IGZhbHNlLFxyXG4gICAgICAgIGNob29zZTogZnVuY3Rpb24gKGRhdGFzKSB7XHJcbiAgICAgICAgICBzdGFydC5tYXggPSBkYXRhcztcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNkYXRlX3N0YXJ0LCAjZGF0ZV9lbmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaWQgPT09ICdkYXRlX3N0YXJ0JykgbGF5ZGF0ZShzdGFydCk7XHJcbiAgICAgICAgZWxzZSBsYXlkYXRlKGVuZCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCgnI2RhdGVfc3RhcnQnKS52YWwobGF5ZGF0ZS5ub3coLTgpKTtcclxuICAgICAgJCgnI2RhdGVfZW5kJykudmFsKGxheWRhdGUubm93KC0xKSk7XHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmRhdGVDb25maXJtQnRuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzdGFydHRpbWUgPSAkKCcjZGF0ZV9zdGFydCcpLnZhbCgpLFxyXG4gICAgICAgICAgZW5kdGltZSA9ICQoJyNkYXRlX2VuZCcpLnZhbCgpO1xyXG4gICAgICAgIGlmIChjb21tb24uaXNMZXNzMzBEYXkoc3RhcnR0aW1lLCBlbmR0aW1lKSkgdHJhbmRGZXRjaERhdGEoc3RhcnR0aW1lLCBlbmR0aW1lKTtcclxuICAgICAgICBlbHNlICQuYWxlcnQoJ+aXtumXtOmXtOmalOS4jeW+l+i2hei/hzMw5aSpJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcuZGF0ZUNvbmZpcm1CdG4nKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cclxuXHJcbiAgICAgIC8vIOeUqOaIt+S9v+eUqOmikeeOh+m7mOiupOaXpeacn1xyXG4gICAgICAkKCcjZGF0ZV9zaWdubGUnKS52YWwobGF5ZGF0ZS5ub3coLTEpKTtcclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcjZGF0ZV9zaWdubGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGF5ZGF0ZSh7XHJcbiAgICAgICAgICBlbGVtOiAnI2RhdGVfc2lnbmxlJyxcclxuICAgICAgICAgIGlzY2xlYXI6IGZhbHNlLFxyXG4gICAgICAgICAgaXN0b2RheTogZmFsc2UsXHJcbiAgICAgICAgICBtYXg6IGxheWRhdGUubm93KC0xKSxcclxuICAgICAgICAgIGNob29zZTogZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICAgICAgZnJlcXVlbmN5RmV0Y2hEYXRhKGRhdGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgZnJlcXVlbmN5RmV0Y2hEYXRhKGxheWRhdGUubm93KC0xKSk7XHJcbiAgICB9KTtcclxufSkiXX0=
