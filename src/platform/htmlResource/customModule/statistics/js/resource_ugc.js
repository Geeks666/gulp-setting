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
    var echart = common.echart.init(document.getElementById('ugc'));
    var echart_trand = common.echart.init(document.getElementById('ugc_trand'));
    var echart_contribution = common.echart.init(document.getElementById('ugc_contribution_pie'));
    common.echart.showLoading(echart_contribution);
    echart_contribution.on('click', function (param) {
      $('#maxArea').html(param['name']);
      ugcConBarFetchData(getAreaId(param['name']));
    });
    var echart_contribution_bar = common.echart.init(document.getElementById('ugc_contribution_bar'));
    common.echart.showLoading(echart_contribution_bar);

    var ugcResourceArray = []; // 教师上传资源
    function getAreaId(area) {
      var id = '';
      $.each(ugcResourceArray, function (index, item) {
        if (area == item['name']) {
          id = item['id'];
          return false;
        }
      });
      return id;
    }

    // 教师上传资源总量
    $.getJSON(service.prefix + '/resource/count', function (result) {
      if (result['code'] == 200) {
        $('#ugcResourceTotal').html(result['data']['ugcResourceTotal']);
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
      $.getJSON(service.prefix + '/resource/ugc/' + phaseid + '/statistics?errorDomId=' + domId,
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
      resourceFetchData($(this).attr('data-value'), type, 'ugc');
    });
    $('body').on('radioChange', '#radio_resource', function () {
      var phaseid = $('#select_resource').attr('data-value');
      resourceFetchData(phaseid, $(this).attr('data-value'), 'ugc');
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
      $.getJSON(service.prefix + '/resource/ugc/' + time + '/tendency?errorDomId=' + domId,
        function (result) {
          if (result['code'] == 200)
            render(convertLineData(result['data']), domId);
        });
    }

    function convertLineData(data) {
      var legendData = ['收藏量', '下载量'], xAxisData = [],
        seriesData1 = {name: '收藏量', areaStyle: {normal: {}}, type: 'line', data: []},
        seriesData2 = {name: '下载量', areaStyle: {normal: {}}, type: 'line', data: []};
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
      resourceTrandFetchData($(this).attr('data-value'), 'ugc_trand');
    });
    $('#select_resource_trand').trigger('selectChange');

    // 教师上传资源贡献情况统计
    $.getJSON(service.prefix + '/resource/ugc/statistics?errorDomId=ugc_contribution', function (result) {
      if (result['code'] == 200) {
        $('#maxArea').html(result['data']['trend']['maxArea']);
        render(convertData(result['data']['area']), 'ugc_contribution_pie');
        ugcResourceArray = result['data']['area'];
        render(convertBarData(result['data']['trend']['statistics'], '0'), 'ugc_contribution_bar');
      }
    });

    function convertData(data) {
      var legendData = [], seriesData = [], other = 0;
      $.each(data, function (index, item) {
        if (index < 10) {
          legendData.push(item['name']);
          seriesData.push({name: item['name'], value: item['value']})
        }
        else other += item['value'];
      });
      if (data.length > 10) {
        data.length = 10;
        legendData.push('其它');
        seriesData.push({name: '其它', value: other});
      }
      return {
        legendData: legendData,
        seriesData: seriesData
      };
    }

    /**
     * UGC资源贡献趋势
     * @param area
     */
    function ugcConBarFetchData(area) {
      echart_contribution_bar = common.echart.init(document.getElementById('ugc_contribution_bar'));
      common.echart.showLoading(echart_contribution_bar);
      $.getJSON(service.prefix + '/resource/ugcTrend/' + encodeURIComponent(area) + '?errorDomId=ugc_contribution_bar',
        function (result) {
          if (result['code'] == 200) render(convertBarData(result['data']), 'ugc_contribution_bar');
        })
    }

    function convertBarData(data, category) {
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

    function render(data, category, thirtParam) {
      switch (category) {
        case 'ugc': {
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
        case 'ugc_trand': {
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
              left: '0%',
              right: '0%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
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
        case 'ugc_contribution_pie': {
          var option_contribution = {
            color: ['#669feb', '#5093ed', '#408bf1', '#2f75d4', '#286bc7', '#165fc4',
              '#1357b4', '#b7ceed', '#aac7ef', '#8db5eb', '#7cadee'],
            tooltip: {
              trigger: 'item',
              formatter: "{b} <br/> {c} ({d}%)"
            },
            legend: {
              y: 'bottom',
              itemGap: 10,
              textStyle: {color: '#e7e7e7', fontSize: 14},
              data: data['legendData']
            },
            series: [
              {
                name: '圆圈',
                type: 'pie',
                center: ['50%', '45%'],
                radius: [90, 91],
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
                name: '贡献情况',
                type: 'pie',
                radius: [0, 80],
                center: ['50%', '45%'],
                data: data['seriesData']
              }
            ]
          };
          echart_contribution.setOption(option_contribution);
          common.echart.hideLoading(echart_contribution);
          break;
        }
        case 'ugc_contribution_bar': {
          var option_bar = {
            color: ['#00bfff'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            textStyle: {
              color: '#92accf',
              fontSize: 12
            },
            grid: {
              top: '15%',
              left: '2%',
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
            series: [
              {
                name: '贡献情况',
                type: 'bar',
                barWidth: 27,
                data: data['seriesData']
              }
            ]
          };
          echart_contribution_bar.setOption(option_bar);
          common.echart.hideLoading(echart_contribution_bar);
        }
        default: {
        }
      }
    }
  });
})