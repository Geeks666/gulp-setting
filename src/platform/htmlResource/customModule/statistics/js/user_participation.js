require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'common'],
    function ($, service, common) {
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
        $.getJSON(service.prefix + '/platform/tendency?starttime=' + starttime + '&endtime=' +
          endtime + '&errorDomId=user_trend', function (result) {
          if (result['code'] == 200) render(convertData(result['data']), 'user_trend')
        });
      }

      function convertData(data) {
        var xAxisData = [], seriesData = [];
        $.each(data, function (index, item) {
          xAxisData.push(item['time'].split(' ')[0]);
          seriesData.push(item['value']);
        });
        return {
          xAxisData: xAxisData,
          seriesData: seriesData
        }
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
        var xAxisData = [], seriesData = [];
        $.each(data, function (index, item) {
          xAxisData.push(item['name']);
          seriesData.push(item['value']);
        });
        return {
          xAxisData: xAxisData,
          seriesData: seriesData
        }
      }

      function render(data, category) {
        switch (category) {
          case 'user_trend': {
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
              xAxis: [
                {
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
                }
              ],
              yAxis: [
                {
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
                }
              ],
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
          case 'user_frequency': {
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
              xAxis: [
                {
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
                }
              ],
              yAxis: [
                {
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
                }
              ],
              series: [
                {
                  name: '用户平均每天使用次数',
                  type: 'bar',
                  barWidth: 30,
                  data: data['seriesData']
                }
              ]
            };
            echart_user_frequency.setOption(option_user_frequency);
            common.echart.hideLoading(echart_user_frequency);
            break;
          }
          default: {
          }
        }
      }


      var start = {
        elem: '#date_start',
        max: laydate.now(-2),
        isclear: false,
        istoday: false,
        choose: function (datas) {
          end.min = datas;
        }
      };

      var end = {
        elem: '#date_end',
        min: laydate.now(-7),
        max: laydate.now(-1),
        isclear: false,
        istoday: false,
        choose: function (datas) {
          start.max = datas;
        }
      };

      $('body').on('click', '#date_start, #date_end', function () {
        if (this.id === 'date_start') laydate(start);
        else laydate(end);
      });

      $('#date_start').val(laydate.now(-8));
      $('#date_end').val(laydate.now(-1));
      $('body').on('click', '.dateConfirmBtn', function () {
        var starttime = $('#date_start').val(),
          endtime = $('#date_end').val();
        if (common.isLess30Day(starttime, endtime)) trandFetchData(starttime, endtime);
        else $.alert('时间间隔不得超过30天');
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
          choose: function (date) {
            frequencyFetchData(date);
          }
        });
      });
      frequencyFetchData(laydate.now(-1));
    });
})