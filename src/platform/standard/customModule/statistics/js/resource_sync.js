require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'tools', 'common'], function ($, service, tools, common) {
    var echart = common.echart.init(document.getElementById('sync'));
    var echart_trand = common.echart.init(document.getElementById('sync_trand'));
    var echart_use = common.echart.init(document.getElementById('sync_use'));
    common.echart.showLoading(echart_use);

    // 同步教学资源总量
    $.getJSON(service.prefix + '/resource/count', function (result) {
      if (result['code'] == 200) {
        $('#syncResourceTotal').html(result['data']['syncResourceTotal']);
      }
    });

    /**
     * @description 平台资源总量统计
     * @param phaseid
     * @param type subject:学科，publisher出版社
     * @param domId
     */
    function resourceFetchData(phaseid, type, domId) {
      echart = common.echart.init(document.getElementById(domId));
      common.echart.showLoading(echart);
      $.getJSON(service.prefix + '/resource/sync/' + phaseid + '/statistics?errorDomId=' + domId,
        function (result) {
          if (result['code'] == 200) {
            if (result['data'][type]['length'] === 0) common.appendTipDom(domId, 'tip');
            else render(convertPieData(result['data'][type]), domId, type);
          }
        });
    }

    function convertPieData(data) {
      var legendData = [], seriesData = [], other = 0;
      $.each(data, function (index, item) {
        if (index < 10) legendData.push(item['name']);
        else other += item['value'];
      });
      if (data && data.length > 10) {
        data.length = 10;
        legendData.push('其它');
        data.push({name: '其它', value: other});
      }
      return {
        legendData: legendData,
        seriesData: data
      };
    }

    $('body').on('selectChange', '#select_resource', function () {
      var type = $('#radio_resource').attr('data-value');
      resourceFetchData($(this).attr('data-value'), type, 'sync');
    });
    $('body').on('radioChange', '#radio_resource', function () {
      var phaseid = $('#select_resource').attr('data-value');
      resourceFetchData(phaseid, $(this).attr('data-value'), 'sync');
    });
    $('#radio_resource').trigger('radioChange');

    /**
     * @description 平台资源的使用趋势
     * @param time yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天
     * @param domId
     */
    function resourceTrandFetchData(time, domId) {
      echart_trand = common.echart.init(document.getElementById(domId));
      common.echart.showLoading(echart_trand);
      $.getJSON(service.prefix + '/resource/sync/' + time + '/tendency?errorDomId=' + domId,
        function (result) {
          if (result['code'] == 200)
            render(convertLineData(result['data']), domId);
        });
    }

    function convertLineData(data) {
      var legendData = ['收藏量', '下载量'], xAxisData = [],
        seriesData1 = {name: '收藏量', type: 'line', data: []},
        seriesData2 = {name: '下载量', type: 'line', data: []};
      $.each(data, function (index, value) {
        var time = value['name'] + '';
        if (time.length < 3) {
          time = time.length < 2 ? '0' + time : time;
          time += ':00';
        }
        xAxisData.push(time);
        seriesData1.data.push(value['collect']);
        seriesData2.data.push(value['download']);
      });
      return {
        legendData: legendData,
        xAxisData: xAxisData,
        seriesData: [seriesData1, seriesData2]
      };
    }

    $('body').on('selectChange', '#select_resource_trand', function () {
      resourceTrandFetchData($(this).attr('data-value'), 'sync_trand');
    });
    $('#select_resource_trand').trigger('selectChange');

    // 同步资源使用情况统计
    $.getJSON(service.prefix + '/resource/sync/orgUsage/statistics?errorDomId=sync_use',
      function (result) {
        if (result['code'] == 200)
          render(convertBarData(result['data']), 'sync_use');
      });

    function convertBarData(data) {
      var legendData = ['收藏量', '下载量'], xAxisData = [],
        seriesData1 = {name: '收藏量', type: 'bar', barWidth: 17, data: []},
        seriesData2 = {name: '下载量', type: 'bar', barWidth: 17, data: []};
      $.each(data, function (index, value) {
        xAxisData.push(value['name']);
        seriesData1.data.push(value['collect']);
        seriesData2.data.push(value['download']);
      });
      return {
        legendData: legendData,
        xAxisData: xAxisData,
        seriesData: [seriesData1, seriesData2]
      };
    }

    function render(data, category, thirtParam) {
      switch (category) {
        case 'sync': {
          var option = {
            color: ['#eaec68', '#a4d47a', '#54bb76', '#0fcbe4', '#408bf1', '#3055b3',
              '#8154cc', '#da60fb', '#ff3f66', '#fe8b1e', '#fdd51d'],
            tooltip: {
              trigger: 'item',
              formatter: "{b} <br/> {c} ({d}%)"
            },
            legend: {
              top: '13%',
              right: '70%',
              bottom: '10%',
              left: '18%',
              orient: 'vertical',
              itemGap: 30,
              textStyle: {color: '#e7e7e7', fontSize: 14},
              data: data['legendData']
            },
            calculable: true,
            series: [
              {
                name: '圆圈',
                type: 'pie',
                center: ['65%', '50%'],
                radius: [130, 131],
                silent: true,
                labelLine: {normal: {show: false}},
                itemStyle: {
                  normal: {
                    color: '#3758ab'
                  }
                },
                data: [100]
              },
              {
                name: '资源总量',
                type: 'pie',
                center: ['65%', '50%'],
                radius: [0, 120],
                roseType: 'area',
                data: data['seriesData']
              }
            ]
          };
          if (thirtParam === 'publisher') {
            option.legend = $.extend({}, option.legend, {
                top: '8%',
                bottom: '2%',
                itemGap: 10
              }
            );
          }
          echart.setOption(option);
          common.echart.hideLoading(echart);
          break;
        }
        case 'sync_trand': {
          var option_trand = {
            color: ['#53bb77', '#ff3f66'],
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: data['legendData'],
              itemGap: 50,
              textStyle: {
                color: '#a1bce9',
                fontSize: 14
              }
            },
            textStyle: {
              color: '#92accf',
              fontSize: 12
            },
            grid: {
              top: '13%',
              left: '1%',
              right: '1%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                // boundaryGap: false,
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
            series: data['seriesData']
          };
          echart_trand.setOption(option_trand);
          common.echart.hideLoading(echart_trand);
          break;
        }
        case 'sync_use': {
          var option_use = {
            color: ['#00beff', '#ff3f66'],
            textStyle: {
              color: '#92accf',
              fontSize: 12
            },
            legend: {
              data: data['legendData'],
              x: 'center',
              itemGap: 50,
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
              top: '13%',
              left: '1%',
              right: '1%',
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
                  },
                  formatter: function (name) {
                    return tools.hideTextByLen(name, 20);
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
            series: data['seriesData']
          };
          echart_use.setOption(option_use);
          common.echart.hideLoading(echart_use);
          break;
        }
        default: {
        }
      }
    }
  });
})