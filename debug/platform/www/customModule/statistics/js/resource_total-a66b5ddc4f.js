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

  define('', ['jquery', 'service', 'tools', 'common'], function ($, service, tools, common) {
    var echart_resource = common.echart.init(document.getElementById('resource'));
    var echart_resource_total = common.echart.init(document.getElementById('resource_total'));
    var echart_resource_trand = common.echart.init(document.getElementById('resource_trand'));
    var echart_resource_use = common.echart.init(document.getElementById('resource_use'));
    common.echart.showLoading(echart_resource_use);

    // 学校管理员
    var echart_resource_total_school = common.echart.init(document.getElementById('resource_total_school'));
    var echart_resource_use_school = common.echart.init(document.getElementById('resource_use_school'));
    var echart_resource_contribution_school = common.echart.init(document.getElementById('resource_contribution_school'));

    // 平台资源统计
    $.getJSON(service.prefix + '/resource/count?errorDomId=resource_wrap', function (result) {
      if (result['code'] == 200) {
        $.each(result['data'], function (key, value) {
          if (key === 'publisherCoverageRate' || key === 'subjectCoverageRate') value = Math.round(value * 100) + '%';
          $('#' + key).html(value);
        });
        render(result['data'], 'resource');
      }
    });

    /**
     * @description 平台资源总量统计
     * @param scope all:所有资源，sync:同步教学资源,ugc:ugc资源
     * @param phaseid 学段
     * @param type subject:学科，publisher出版社
     */
    function resourceTotolFetchData(scope, phaseid, type, domId) {
      if (domId === 'resource_total') {
        echart_resource_total = common.echart.init(document.getElementById(domId));
        common.echart.showLoading(echart_resource_total);
      } else if (domId === 'resource_total_school') {
        // 学校管理员
        echart_resource_total_school = common.echart.init(document.getElementById(domId));
        common.echart.showLoading(echart_resource_total_school);
      }
      $.getJSON(service.prefix + '/resource/' + scope + '/' + phaseid + '/statistics?errorDomId=' + domId, function (result) {
        if (result['code'] == 200) if (result['data'][type]['length'] === 0) common.appendTipDom(domId, 'tip');else render(convertPieData(result['data'][type]), domId, type);
      });
    }

    function convertPieData(data) {
      var legendData = [],
          seriesData = [],
          other = 0;
      $.each(data, function (index, item) {
        if (index < 10) legendData.push(item['name']);else other += item['value'];
      });
      if (data && data.length > 10) {
        data.length = 10;
        legendData.push('其它');
        data.push({ name: '其它', value: other });
      }
      return {
        legendData: legendData,
        seriesData: data
      };
    }

    $('body').on('selectChange', '#select_resource', function () {
      var type = $('#radio_resource').attr('data-value');
      resourceTotolFetchData('all', $(this).attr('data-value'), type, 'resource_total');
    });
    $('body').on('radioChange', '#radio_resource', function () {
      var phaseid = $('#select_resource').attr('data-value');
      resourceTotolFetchData('all', phaseid, $(this).attr('data-value'), 'resource_total');
    });
    $('#radio_resource').trigger('radioChange');
    // 学校管理员
    $('body').on('radioChange', '#radio_resource_school', function () {
      var phaseid = $('#select_resource_school').attr('data-value');
      var type = $('#tab_resource_school').attr('data-value');
      resourceTotolFetchData($(this).attr('data-value'), phaseid, type, 'resource_total_school');
    });
    $('body').on('tabChange', '#tab_resource_school', function () {
      var scope = $('#radio_resource_school').attr('data-value');
      var phaseid = $('#select_resource_school').attr('data-value');
      resourceTotolFetchData(scope, phaseid, $(this).attr('data-value'), 'resource_total_school');
    });
    $('body').on('selectChange', '#select_resource_school', function () {
      var scope = $('#radio_resource_school').attr('data-value');
      var type = $('#tab_resource_school').attr('data-value');
      resourceTotolFetchData(scope, $(this).attr('data-value'), type, 'resource_total_school');
    });
    $('#tab_resource_school').trigger('tabChange');

    /**
     * @description 平台资源的使用趋势
     * @param scope all:所有资源，sync:同步教学资源,ugc:ugc资源
     * @param time yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天
     */
    function resourceTrandFetchData(scope, time) {
      echart_resource_trand = common.echart.init(document.getElementById('resource_trand'));
      common.echart.showLoading(echart_resource_trand);
      $.getJSON(service.prefix + '/resource/' + scope + '/' + time + '/tendency?errorDomId=resource_trand', function (result) {
        if (result['code'] == 200) render(convertLineData(result['data']), 'resource_trand');
      });
    }

    function convertLineData(data) {
      var legendData = ['收藏量', '下载量'],
          xAxisData = [],
          seriesData1 = { name: '收藏量', type: 'line', data: [] },
          seriesData2 = { name: '下载量', type: 'line', data: [] };
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
      var scope = $('#radio_resource_trand_school').attr('data-value');
      resourceTrandFetchData(scope, $(this).attr('data-value'));
    });
    $('#select_resource_trand').trigger('selectChange');
    // 学校管理员
    $('body').on('radioChange', '#radio_resource_trand_school', function () {
      var time = $('#select_resource_trand').attr('data-value');
      resourceTrandFetchData($(this).attr('data-value'), time);
    });

    /**
     * @description 平台资源使用情况统计
     * @param scope
     */
    function resourceUseFetchData(scope) {
      $.getJSON(service.prefix + '/resource/' + scope + '/orgUsage/statistics?errorDomId=resource_use', function (result) {
        if (result['code'] == 200) render(convertBarData(result['data']), 'resource_use');
      });
    }

    resourceUseFetchData('all');

    function convertBarData(data) {
      var legendData = ['收藏量', '下载量'],
          xAxisData = [],
          seriesData1 = { name: '收藏量', type: 'bar', barWidth: 17, data: [] },
          seriesData2 = { name: '下载量', type: 'bar', barWidth: 17, data: [] };
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

    /**
     * @description 用户生成资源的贡献情况统计
     * @param type collect:收藏量排名；download:下载量排名；contribute：贡献量排名
     */
    function resourceUserOperateFetchData(type, domId, color) {
      var name = '收藏量';
      if (type === 'download') name = '下载量';
      if (type === 'contribute') name = '贡献量';
      if (domId === 'resource_use_school') {
        echart_resource_use_school = common.echart.init(document.getElementById(domId));
        common.echart.showLoading(echart_resource_use_school);
      } else if (domId === 'resource_contribution_school') {
        echart_resource_contribution_school = common.echart.init(document.getElementById(domId));
        common.echart.showLoading(echart_resource_contribution_school);
      }

      $.getJSON(service.prefix + '/resource/' + type + '/userOperate/statistics?errorDomId=' + domId, function (result) {
        if (result['code'] == 200) render(convertBarData1(result['data'], name), domId, color);
      });
    }

    function convertBarData1(data, name) {
      var xAxisData = [],
          seriesData = { name: name, type: 'bar', barWidth: 20, data: data };
      $.each(data, function (index, item) {
        xAxisData.push(item['name']);
        seriesData.data.push(item['value']);
      });
      return {
        xAxisData: xAxisData,
        seriesData: seriesData
      };
    }

    $('body').on('radioChange', '#radio_resource_rank_school', function () {
      var color = $(this).attr('data-value') === 'download' ? '#ff3f66' : '#00beff';
      resourceUserOperateFetchData($(this).attr('data-value'), 'resource_use_school', color);
    });
    $('#radio_resource_rank_school').trigger('radioChange');
    // 平台资源共享量排名
    resourceUserOperateFetchData('contribute', 'resource_contribution_school', '#29c983');

    function createPieData(val, total, center) {
      if (total == 0) {
        val = 0;
        total = 1;
      }
      return {
        silent: true,
        clockwise: false,
        type: 'pie',
        radius: [45, 60],
        avoidLabelOverlap: false,
        center: center,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [{
          name: (val * 100 / total).toFixed(1) + '%',
          value: val,
          label: {
            normal: {
              show: true,
              position: 'center',
              textStyle: {
                color: '#fff',
                fontSize: 24
              }
            }
          }
        }, {
          name: 'other',
          value: total - val,
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: { normal: { color: '#3e5284' } }
        }]
      };
    }

    /**
     * @description 渲染echarts图表
     * @param data
     * @param category
     * @param thirtParam
     */
    function render(data, category, thirtParam) {
      switch (category) {
        case 'resource':
          {
            var option_resource = {
              backgroundColor: '',
              color: ['#ffba26'],
              tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              series: [createPieData(data['syncResourceTotal'], data['resTotal'], ['12.5%', '50%']), createPieData(data['ugcResourceTotal'], data['resTotal'], ['37.5%', '50%']), createPieData(data['publisherCoverageRate'] * data['resTotal'], data['resTotal'], ['62.5%', '50%']), createPieData(data['subjectCoverageRate'] * data['resTotal'], data['resTotal'], ['87.5%', '50%'])]
            };
            echart_resource.setOption(option_resource);
            common.echart.hideLoading(echart_resource);
            break;
          }
        case 'resource_total_school':
          {}
        case 'resource_total':
          {
            var option_resource_total = {
              color: ['#eaec68', '#a4d47a', '#54bb76', '#0fcbe4', '#408bf1', '#3055b3', '#8154cc', '#da60fb', '#ff3f66', '#fe8b1e', '#fdd51d'],
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br/> {c} ({d}%)"
              },
              legend: {
                top: '10%',
                right: '70%',
                bottom: '5%',
                left: '18%',
                orient: 'vertical',
                itemGap: 30,
                textStyle: { color: '#e7e7e7', fontSize: 14 },
                data: data['legendData']
              },
              calculable: true,
              series: [{
                name: '圆圈',
                type: 'pie',
                center: ['65%', '50%'],
                radius: [130, 131],
                silent: true,
                labelLine: { normal: { show: false } },
                itemStyle: {
                  normal: {
                    color: '#3758ab'
                  }
                },
                data: [100]
              }, {
                name: '资源总量',
                type: 'pie',
                center: ['65%', '50%'],
                radius: [0, 120],
                roseType: 'area',
                data: data['seriesData']
              }]
            };
            if (thirtParam === 'publisher') {
              option_resource_total.legend = $.extend({}, option_resource_total.legend, {
                top: '8%',
                bottom: '2%',
                itemGap: 10
              });
            }
            if (category === 'resource_total') {
              echart_resource_total.setOption(option_resource_total);
              common.echart.hideLoading(echart_resource_total);
            } else if (category === 'resource_total_school') {
              echart_resource_total_school.setOption(option_resource_total);
              common.echart.hideLoading(echart_resource_total_school);
            }
            break;
          }
        case 'resource_trand':
          {
            var option_resource_trand = {
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
                left: '1%',
                right: '2%',
                bottom: '2%',
                containLabel: true
              },
              xAxis: [{
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
            echart_resource_trand.setOption(option_resource_trand);
            common.echart.hideLoading(echart_resource_trand);
            break;
          }
        case 'resource_use':
          {
            var option_resource_use = {
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
                left: '1%',
                right: '2%',
                bottom: '2%',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                data: data['xAxisData'],
                axisLabel: {
                  textStyle: {
                    fontSize: 12
                  },
                  formatter: function formatter(name) {
                    return tools.hideTextByLen(name, 10);
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
              series: data['seriesData']
            };
            echart_resource_use.setOption(option_resource_use);
            common.echart.hideLoading(echart_resource_use);
            break;
          }
        case 'resource_use_school':
          {}
        case 'resource_contribution_school':
          {
            var option = {
              color: [thirtParam],
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
                left: '1%',
                right: '2%',
                bottom: '2%',
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
              series: data['seriesData']
            };
            if (category === 'resource_use_school') {
              echart_resource_use_school.setOption(option);
              common.echart.hideLoading(echart_resource_use_school);
            } else if (category === 'resource_contribution_school') {
              echart_resource_contribution_school.setOption(option);
              common.echart.hideLoading(echart_resource_contribution_school);
            }
            break;
          }
        default:
          {}
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3Jlc291cmNlX3RvdGFsLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25maWciLCJiYXNlVXJsIiwicGF0aHMiLCJjb25maWdwYXRocyIsImRlZmluZSIsIiQiLCJzZXJ2aWNlIiwidG9vbHMiLCJjb21tb24iLCJlY2hhcnRfcmVzb3VyY2UiLCJlY2hhcnQiLCJpbml0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImVjaGFydF9yZXNvdXJjZV90b3RhbCIsImVjaGFydF9yZXNvdXJjZV90cmFuZCIsImVjaGFydF9yZXNvdXJjZV91c2UiLCJzaG93TG9hZGluZyIsImVjaGFydF9yZXNvdXJjZV90b3RhbF9zY2hvb2wiLCJlY2hhcnRfcmVzb3VyY2VfdXNlX3NjaG9vbCIsImVjaGFydF9yZXNvdXJjZV9jb250cmlidXRpb25fc2Nob29sIiwiZ2V0SlNPTiIsInByZWZpeCIsInJlc3VsdCIsImVhY2giLCJrZXkiLCJ2YWx1ZSIsIk1hdGgiLCJyb3VuZCIsImh0bWwiLCJyZW5kZXIiLCJyZXNvdXJjZVRvdG9sRmV0Y2hEYXRhIiwic2NvcGUiLCJwaGFzZWlkIiwidHlwZSIsImRvbUlkIiwiYXBwZW5kVGlwRG9tIiwiY29udmVydFBpZURhdGEiLCJkYXRhIiwibGVnZW5kRGF0YSIsInNlcmllc0RhdGEiLCJvdGhlciIsImluZGV4IiwiaXRlbSIsInB1c2giLCJsZW5ndGgiLCJuYW1lIiwib24iLCJhdHRyIiwidHJpZ2dlciIsInJlc291cmNlVHJhbmRGZXRjaERhdGEiLCJ0aW1lIiwiY29udmVydExpbmVEYXRhIiwieEF4aXNEYXRhIiwic2VyaWVzRGF0YTEiLCJzZXJpZXNEYXRhMiIsInJlc291cmNlVXNlRmV0Y2hEYXRhIiwiY29udmVydEJhckRhdGEiLCJiYXJXaWR0aCIsInJlc291cmNlVXNlck9wZXJhdGVGZXRjaERhdGEiLCJjb2xvciIsImNvbnZlcnRCYXJEYXRhMSIsImNyZWF0ZVBpZURhdGEiLCJ2YWwiLCJ0b3RhbCIsImNlbnRlciIsInNpbGVudCIsImNsb2Nrd2lzZSIsInJhZGl1cyIsImF2b2lkTGFiZWxPdmVybGFwIiwibGFiZWxMaW5lIiwibm9ybWFsIiwic2hvdyIsInRvRml4ZWQiLCJsYWJlbCIsInBvc2l0aW9uIiwidGV4dFN0eWxlIiwiZm9udFNpemUiLCJpdGVtU3R5bGUiLCJjYXRlZ29yeSIsInRoaXJ0UGFyYW0iLCJvcHRpb25fcmVzb3VyY2UiLCJiYWNrZ3JvdW5kQ29sb3IiLCJ0b29sdGlwIiwiZm9ybWF0dGVyIiwic2VyaWVzIiwic2V0T3B0aW9uIiwiaGlkZUxvYWRpbmciLCJvcHRpb25fcmVzb3VyY2VfdG90YWwiLCJsZWdlbmQiLCJ0b3AiLCJyaWdodCIsImJvdHRvbSIsImxlZnQiLCJvcmllbnQiLCJpdGVtR2FwIiwiY2FsY3VsYWJsZSIsInJvc2VUeXBlIiwiZXh0ZW5kIiwib3B0aW9uX3Jlc291cmNlX3RyYW5kIiwiZ3JpZCIsImNvbnRhaW5MYWJlbCIsInhBeGlzIiwiYXhpc0xhYmVsIiwiYXhpc0xpbmUiLCJsaW5lU3R5bGUiLCJ5QXhpcyIsInNwbGl0TGluZSIsIm9wdGlvbl9yZXNvdXJjZV91c2UiLCJ4IiwiYXhpc1BvaW50ZXIiLCJoaWRlVGV4dEJ5TGVuIiwiYXhpc1RpY2siLCJvcHRpb24iXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxXQUFTLEtBREk7QUFFYkMsU0FBTztBQUNMLGtCQUFjO0FBRFQ7QUFGTSxDQUFmO0FBTUFILFFBQVEsQ0FBQyxZQUFELENBQVIsRUFBd0IsVUFBVUksV0FBVixFQUF1QjtBQUM3QztBQUNBSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7O0FBRUFDLFNBQU8sRUFBUCxFQUFXLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsT0FBdEIsRUFBK0IsUUFBL0IsQ0FBWCxFQUNFLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXFDO0FBQ25DLFFBQUlDLGtC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anMvcmVzb3VyY2VfdG90YWwtYTY2YjVkZGM0Zi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ2N1c3RvbUNvbmYnOiAnc3RhdGlzdGljcy9qcy9jdXN0b21Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydjdXN0b21Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAnc2VydmljZScsICd0b29scycsICdjb21tb24nXSxcclxuICAgIGZ1bmN0aW9uICgkLCBzZXJ2aWNlLCB0b29scywgY29tbW9uKSB7XHJcbiAgICAgIHZhciBlY2hhcnRfcmVzb3VyY2UgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc291cmNlJykpO1xyXG4gICAgICB2YXIgZWNoYXJ0X3Jlc291cmNlX3RvdGFsID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvdXJjZV90b3RhbCcpKTtcclxuICAgICAgdmFyIGVjaGFydF9yZXNvdXJjZV90cmFuZCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzb3VyY2VfdHJhbmQnKSk7XHJcbiAgICAgIHZhciBlY2hhcnRfcmVzb3VyY2VfdXNlID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvdXJjZV91c2UnKSk7XHJcbiAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3Jlc291cmNlX3VzZSk7XHJcblxyXG4gICAgICAvLyDlrabmoKHnrqHnkIblkZhcclxuICAgICAgdmFyIGVjaGFydF9yZXNvdXJjZV90b3RhbF9zY2hvb2wgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc291cmNlX3RvdGFsX3NjaG9vbCcpKTtcclxuICAgICAgdmFyIGVjaGFydF9yZXNvdXJjZV91c2Vfc2Nob29sID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNvdXJjZV91c2Vfc2Nob29sJykpO1xyXG4gICAgICB2YXIgZWNoYXJ0X3Jlc291cmNlX2NvbnRyaWJ1dGlvbl9zY2hvb2wgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc291cmNlX2NvbnRyaWJ1dGlvbl9zY2hvb2wnKSk7XHJcblxyXG4gICAgICAvLyDlubPlj7DotYTmupDnu5/orqFcclxuICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9yZXNvdXJjZS9jb3VudD9lcnJvckRvbUlkPXJlc291cmNlX3dyYXAnLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDIwMCkge1xyXG4gICAgICAgICAgJC5lYWNoKHJlc3VsdFsnZGF0YSddLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAncHVibGlzaGVyQ292ZXJhZ2VSYXRlJyB8fCBrZXkgPT09ICdzdWJqZWN0Q292ZXJhZ2VSYXRlJykgdmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlICogMTAwKSArICclJztcclxuICAgICAgICAgICAgJCgnIycgKyBrZXkpLmh0bWwodmFsdWUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZW5kZXIocmVzdWx0WydkYXRhJ10sICdyZXNvdXJjZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIOW5s+WPsOi1hOa6kOaAu+mHj+e7n+iuoVxyXG4gICAgICAgKiBAcGFyYW0gc2NvcGUgYWxsOuaJgOaciei1hOa6kO+8jHN5bmM65ZCM5q2l5pWZ5a2m6LWE5rqQLHVnYzp1Z2PotYTmupBcclxuICAgICAgICogQHBhcmFtIHBoYXNlaWQg5a2m5q61XHJcbiAgICAgICAqIEBwYXJhbSB0eXBlIHN1YmplY3Q65a2m56eR77yMcHVibGlzaGVy5Ye654mI56S+XHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiByZXNvdXJjZVRvdG9sRmV0Y2hEYXRhKHNjb3BlLCBwaGFzZWlkLCB0eXBlLCBkb21JZCkge1xyXG4gICAgICAgIGlmIChkb21JZCA9PT0gJ3Jlc291cmNlX3RvdGFsJykge1xyXG4gICAgICAgICAgZWNoYXJ0X3Jlc291cmNlX3RvdGFsID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlkKSk7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV90b3RhbCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkb21JZCA9PT0gJ3Jlc291cmNlX3RvdGFsX3NjaG9vbCcpIHtcclxuICAgICAgICAgIC8vIOWtpuagoeeuoeeQhuWRmFxyXG4gICAgICAgICAgZWNoYXJ0X3Jlc291cmNlX3RvdGFsX3NjaG9vbCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkb21JZCkpO1xyXG4gICAgICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfcmVzb3VyY2VfdG90YWxfc2Nob29sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9yZXNvdXJjZS8nICsgc2NvcGUgKyAnLycgKyBwaGFzZWlkICsgJy9zdGF0aXN0aWNzP2Vycm9yRG9tSWQ9JyArIGRvbUlkLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKVxyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2RhdGEnXVt0eXBlXVsnbGVuZ3RoJ10gPT09IDApIGNvbW1vbi5hcHBlbmRUaXBEb20oZG9tSWQsICd0aXAnKTtcclxuICAgICAgICAgICAgICBlbHNlIHJlbmRlcihjb252ZXJ0UGllRGF0YShyZXN1bHRbJ2RhdGEnXVt0eXBlXSksIGRvbUlkLCB0eXBlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBjb252ZXJ0UGllRGF0YShkYXRhKSB7XHJcbiAgICAgICAgdmFyIGxlZ2VuZERhdGEgPSBbXSwgc2VyaWVzRGF0YSA9IFtdLCBvdGhlciA9IDA7XHJcbiAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgaWYgKGluZGV4IDwgMTApIGxlZ2VuZERhdGEucHVzaChpdGVtWyduYW1lJ10pO1xyXG4gICAgICAgICAgZWxzZSBvdGhlciArPSBpdGVtWyd2YWx1ZSddO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEubGVuZ3RoID4gMTApIHtcclxuICAgICAgICAgIGRhdGEubGVuZ3RoID0gMTA7XHJcbiAgICAgICAgICBsZWdlbmREYXRhLnB1c2goJ+WFtuWugycpO1xyXG4gICAgICAgICAgZGF0YS5wdXNoKHtuYW1lOiAn5YW25a6DJywgdmFsdWU6IG90aGVyfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBsZWdlbmREYXRhOiBsZWdlbmREYXRhLFxyXG4gICAgICAgICAgc2VyaWVzRGF0YTogZGF0YVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0Q2hhbmdlJywgJyNzZWxlY3RfcmVzb3VyY2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHR5cGUgPSAkKCcjcmFkaW9fcmVzb3VyY2UnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICAgICAgcmVzb3VyY2VUb3RvbEZldGNoRGF0YSgnYWxsJywgJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyksIHR5cGUsICdyZXNvdXJjZV90b3RhbCcpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnYm9keScpLm9uKCdyYWRpb0NoYW5nZScsICcjcmFkaW9fcmVzb3VyY2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBoYXNlaWQgPSAkKCcjc2VsZWN0X3Jlc291cmNlJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgICAgIHJlc291cmNlVG90b2xGZXRjaERhdGEoJ2FsbCcsIHBoYXNlaWQsICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpLCAncmVzb3VyY2VfdG90YWwnKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoJyNyYWRpb19yZXNvdXJjZScpLnRyaWdnZXIoJ3JhZGlvQ2hhbmdlJyk7XHJcbiAgICAgIC8vIOWtpuagoeeuoeeQhuWRmFxyXG4gICAgICAkKCdib2R5Jykub24oJ3JhZGlvQ2hhbmdlJywgJyNyYWRpb19yZXNvdXJjZV9zY2hvb2wnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBoYXNlaWQgPSAkKCcjc2VsZWN0X3Jlc291cmNlX3NjaG9vbCcpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcclxuICAgICAgICB2YXIgdHlwZSA9ICQoJyN0YWJfcmVzb3VyY2Vfc2Nob29sJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgICAgIHJlc291cmNlVG90b2xGZXRjaERhdGEoJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyksIHBoYXNlaWQsIHR5cGUsICdyZXNvdXJjZV90b3RhbF9zY2hvb2wnKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoJ2JvZHknKS5vbigndGFiQ2hhbmdlJywgJyN0YWJfcmVzb3VyY2Vfc2Nob29sJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzY29wZSA9ICQoJyNyYWRpb19yZXNvdXJjZV9zY2hvb2wnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICAgICAgdmFyIHBoYXNlaWQgPSAkKCcjc2VsZWN0X3Jlc291cmNlX3NjaG9vbCcpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcclxuICAgICAgICByZXNvdXJjZVRvdG9sRmV0Y2hEYXRhKHNjb3BlLCBwaGFzZWlkLCAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJ3Jlc291cmNlX3RvdGFsX3NjaG9vbCcpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnI3NlbGVjdF9yZXNvdXJjZV9zY2hvb2wnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNjb3BlID0gJCgnI3JhZGlvX3Jlc291cmNlX3NjaG9vbCcpLmF0dHIoJ2RhdGEtdmFsdWUnKTtcclxuICAgICAgICB2YXIgdHlwZSA9ICQoJyN0YWJfcmVzb3VyY2Vfc2Nob29sJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgICAgIHJlc291cmNlVG90b2xGZXRjaERhdGEoc2NvcGUsICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpLCB0eXBlLCAncmVzb3VyY2VfdG90YWxfc2Nob29sJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcjdGFiX3Jlc291cmNlX3NjaG9vbCcpLnRyaWdnZXIoJ3RhYkNoYW5nZScpO1xyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w6LWE5rqQ55qE5L2/55So6LaL5Yq/XHJcbiAgICAgICAqIEBwYXJhbSBzY29wZSBhbGw65omA5pyJ6LWE5rqQ77yMc3luYzrlkIzmraXmlZnlrabotYTmupAsdWdjOnVnY+i1hOa6kFxyXG4gICAgICAgKiBAcGFyYW0gdGltZSB5ZXN0ZXJkYXk65pio5aSp77yMbGFzdHNldmVu77ya5pyA6L+R5LiD5aSp77yMbGFzdHRoaXJ0ee+8muacgOi/keS4ieWNgeWkqVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gcmVzb3VyY2VUcmFuZEZldGNoRGF0YShzY29wZSwgdGltZSkge1xyXG4gICAgICAgIGVjaGFydF9yZXNvdXJjZV90cmFuZCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzb3VyY2VfdHJhbmQnKSk7XHJcbiAgICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfcmVzb3VyY2VfdHJhbmQpO1xyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvcmVzb3VyY2UvJyArIHNjb3BlICsgJy8nICsgdGltZSArICcvdGVuZGVuY3k/ZXJyb3JEb21JZD1yZXNvdXJjZV90cmFuZCcsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApXHJcbiAgICAgICAgICAgICAgcmVuZGVyKGNvbnZlcnRMaW5lRGF0YShyZXN1bHRbJ2RhdGEnXSksICdyZXNvdXJjZV90cmFuZCcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnRMaW5lRGF0YShkYXRhKSB7XHJcbiAgICAgICAgdmFyIGxlZ2VuZERhdGEgPSBbJ+aUtuiXj+mHjycsICfkuIvovb3ph48nXSwgeEF4aXNEYXRhID0gW10sXHJcbiAgICAgICAgICBzZXJpZXNEYXRhMSA9IHtuYW1lOiAn5pS26JeP6YePJywgdHlwZTogJ2xpbmUnLCBkYXRhOiBbXX0sXHJcbiAgICAgICAgICBzZXJpZXNEYXRhMiA9IHtuYW1lOiAn5LiL6L296YePJywgdHlwZTogJ2xpbmUnLCBkYXRhOiBbXX07XHJcbiAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpbmRleCwgdmFsdWUpIHtcclxuICAgICAgICAgIHZhciB0aW1lID0gdmFsdWVbJ25hbWUnXSArICcnO1xyXG4gICAgICAgICAgaWYgKHRpbWUubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICB0aW1lID0gdGltZS5sZW5ndGggPCAyID8gJzAnICsgdGltZSA6IHRpbWU7XHJcbiAgICAgICAgICAgIHRpbWUgKz0gJzowMCc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4QXhpc0RhdGEucHVzaCh0aW1lKTtcclxuICAgICAgICAgIHNlcmllc0RhdGExLmRhdGEucHVzaCh2YWx1ZVsnY29sbGVjdCddKTtcclxuICAgICAgICAgIHNlcmllc0RhdGEyLmRhdGEucHVzaCh2YWx1ZVsnZG93bmxvYWQnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGxlZ2VuZERhdGE6IGxlZ2VuZERhdGEsXHJcbiAgICAgICAgICB4QXhpc0RhdGE6IHhBeGlzRGF0YSxcclxuICAgICAgICAgIHNlcmllc0RhdGE6IFtzZXJpZXNEYXRhMSwgc2VyaWVzRGF0YTJdXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnI3NlbGVjdF9yZXNvdXJjZV90cmFuZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2NvcGUgPSAkKCcjcmFkaW9fcmVzb3VyY2VfdHJhbmRfc2Nob29sJykuYXR0cignZGF0YS12YWx1ZScpO1xyXG4gICAgICAgIHJlc291cmNlVHJhbmRGZXRjaERhdGEoc2NvcGUsICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoJyNzZWxlY3RfcmVzb3VyY2VfdHJhbmQnKS50cmlnZ2VyKCdzZWxlY3RDaGFuZ2UnKTtcclxuICAgICAgLy8g5a2m5qCh566h55CG5ZGYXHJcbiAgICAgICQoJ2JvZHknKS5vbigncmFkaW9DaGFuZ2UnLCAnI3JhZGlvX3Jlc291cmNlX3RyYW5kX3NjaG9vbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdGltZSA9ICQoJyNzZWxlY3RfcmVzb3VyY2VfdHJhbmQnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICAgICAgcmVzb3VyY2VUcmFuZEZldGNoRGF0YSgkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgdGltZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w6LWE5rqQ5L2/55So5oOF5Ya157uf6K6hXHJcbiAgICAgICAqIEBwYXJhbSBzY29wZVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gcmVzb3VyY2VVc2VGZXRjaERhdGEoc2NvcGUpIHtcclxuICAgICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3Jlc291cmNlLycgKyBzY29wZSArICcvb3JnVXNhZ2Uvc3RhdGlzdGljcz9lcnJvckRvbUlkPXJlc291cmNlX3VzZScsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApXHJcbiAgICAgICAgICAgICAgcmVuZGVyKGNvbnZlcnRCYXJEYXRhKHJlc3VsdFsnZGF0YSddKSwgJ3Jlc291cmNlX3VzZScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc291cmNlVXNlRmV0Y2hEYXRhKCdhbGwnKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnRCYXJEYXRhKGRhdGEpIHtcclxuICAgICAgICB2YXIgbGVnZW5kRGF0YSA9IFsn5pS26JeP6YePJywgJ+S4i+i9vemHjyddLCB4QXhpc0RhdGEgPSBbXSxcclxuICAgICAgICAgIHNlcmllc0RhdGExID0ge25hbWU6ICfmlLbol4/ph48nLCB0eXBlOiAnYmFyJywgYmFyV2lkdGg6IDE3LCBkYXRhOiBbXX0sXHJcbiAgICAgICAgICBzZXJpZXNEYXRhMiA9IHtuYW1lOiAn5LiL6L296YePJywgdHlwZTogJ2JhcicsIGJhcldpZHRoOiAxNywgZGF0YTogW119O1xyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgICAgICB4QXhpc0RhdGEucHVzaCh2YWx1ZVsnbmFtZSddKTtcclxuICAgICAgICAgIHNlcmllc0RhdGExLmRhdGEucHVzaCh2YWx1ZVsnY29sbGVjdCddKTtcclxuICAgICAgICAgIHNlcmllc0RhdGEyLmRhdGEucHVzaCh2YWx1ZVsnZG93bmxvYWQnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGxlZ2VuZERhdGE6IGxlZ2VuZERhdGEsXHJcbiAgICAgICAgICB4QXhpc0RhdGE6IHhBeGlzRGF0YSxcclxuICAgICAgICAgIHNlcmllc0RhdGE6IFtzZXJpZXNEYXRhMSwgc2VyaWVzRGF0YTJdXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiDnlKjmiLfnlJ/miJDotYTmupDnmoTotKHnjK7mg4XlhrXnu5/orqFcclxuICAgICAgICogQHBhcmFtIHR5cGUgY29sbGVjdDrmlLbol4/ph4/mjpLlkI3vvJtkb3dubG9hZDrkuIvovb3ph4/mjpLlkI3vvJtjb250cmlidXRl77ya6LSh54yu6YeP5o6S5ZCNXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiByZXNvdXJjZVVzZXJPcGVyYXRlRmV0Y2hEYXRhKHR5cGUsIGRvbUlkLCBjb2xvcikge1xyXG4gICAgICAgIHZhciBuYW1lID0gJ+aUtuiXj+mHjyc7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09ICdkb3dubG9hZCcpIG5hbWUgPSAn5LiL6L296YePJztcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ2NvbnRyaWJ1dGUnKSBuYW1lID0gJ+i0oeeMrumHjyc7XHJcbiAgICAgICAgaWYgKGRvbUlkID09PSAncmVzb3VyY2VfdXNlX3NjaG9vbCcpIHtcclxuICAgICAgICAgIGVjaGFydF9yZXNvdXJjZV91c2Vfc2Nob29sID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlkKSk7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV91c2Vfc2Nob29sKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRvbUlkID09PSAncmVzb3VyY2VfY29udHJpYnV0aW9uX3NjaG9vbCcpIHtcclxuICAgICAgICAgIGVjaGFydF9yZXNvdXJjZV9jb250cmlidXRpb25fc2Nob29sID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlkKSk7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV9jb250cmlidXRpb25fc2Nob29sKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvcmVzb3VyY2UvJyArIHR5cGUgKyAnL3VzZXJPcGVyYXRlL3N0YXRpc3RpY3M/ZXJyb3JEb21JZD0nICsgZG9tSWQsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApXHJcbiAgICAgICAgICAgICAgcmVuZGVyKGNvbnZlcnRCYXJEYXRhMShyZXN1bHRbJ2RhdGEnXSwgbmFtZSksIGRvbUlkLCBjb2xvcik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY29udmVydEJhckRhdGExKGRhdGEsIG5hbWUpIHtcclxuICAgICAgICB2YXIgeEF4aXNEYXRhID0gW10sXHJcbiAgICAgICAgICBzZXJpZXNEYXRhID0ge25hbWU6IG5hbWUsIHR5cGU6ICdiYXInLCBiYXJXaWR0aDogMjAsIGRhdGE6IGRhdGF9O1xyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgIHhBeGlzRGF0YS5wdXNoKGl0ZW1bJ25hbWUnXSk7XHJcbiAgICAgICAgICBzZXJpZXNEYXRhLmRhdGEucHVzaChpdGVtWyd2YWx1ZSddKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhOiB4QXhpc0RhdGEsXHJcbiAgICAgICAgICBzZXJpZXNEYXRhOiBzZXJpZXNEYXRhXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdyYWRpb0NoYW5nZScsICcjcmFkaW9fcmVzb3VyY2VfcmFua19zY2hvb2wnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbG9yID0gJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJykgPT09ICdkb3dubG9hZCcgPyAnI2ZmM2Y2NicgOiAnIzAwYmVmZic7XHJcbiAgICAgICAgcmVzb3VyY2VVc2VyT3BlcmF0ZUZldGNoRGF0YSgkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJ3Jlc291cmNlX3VzZV9zY2hvb2wnLCBjb2xvcik7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcjcmFkaW9fcmVzb3VyY2VfcmFua19zY2hvb2wnKS50cmlnZ2VyKCdyYWRpb0NoYW5nZScpO1xyXG4gICAgICAvLyDlubPlj7DotYTmupDlhbHkuqvph4/mjpLlkI1cclxuICAgICAgcmVzb3VyY2VVc2VyT3BlcmF0ZUZldGNoRGF0YSgnY29udHJpYnV0ZScsICdyZXNvdXJjZV9jb250cmlidXRpb25fc2Nob29sJywgJyMyOWM5ODMnKTtcclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBjcmVhdGVQaWVEYXRhKHZhbCwgdG90YWwsIGNlbnRlcikge1xyXG4gICAgICAgIGlmICh0b3RhbCA9PSAwKSB7XHJcbiAgICAgICAgICB2YWwgPSAwO1xyXG4gICAgICAgICAgdG90YWwgPSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgc2lsZW50OiB0cnVlLFxyXG4gICAgICAgICAgY2xvY2t3aXNlOiBmYWxzZSxcclxuICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgcmFkaXVzOiBbNDUsIDYwXSxcclxuICAgICAgICAgIGF2b2lkTGFiZWxPdmVybGFwOiBmYWxzZSxcclxuICAgICAgICAgIGNlbnRlcjogY2VudGVyLFxyXG4gICAgICAgICAgbGFiZWxMaW5lOiB7XHJcbiAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBkYXRhOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiAodmFsICogMTAwIC8gdG90YWwpLnRvRml4ZWQoMSkgKyAnJScsXHJcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbCxcclxuICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgbm9ybWFsOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMjRcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6ICdvdGhlcicsXHJcbiAgICAgICAgICAgICAgdmFsdWU6ICh0b3RhbCAtIHZhbCksXHJcbiAgICAgICAgICAgICAgbGFiZWw6IHtcclxuICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7bm9ybWFsOiB7Y29sb3I6ICcjM2U1Mjg0J319XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5riy5p+TZWNoYXJ0c+WbvuihqFxyXG4gICAgICAgKiBAcGFyYW0gZGF0YVxyXG4gICAgICAgKiBAcGFyYW0gY2F0ZWdvcnlcclxuICAgICAgICogQHBhcmFtIHRoaXJ0UGFyYW1cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHJlbmRlcihkYXRhLCBjYXRlZ29yeSwgdGhpcnRQYXJhbSkge1xyXG4gICAgICAgIHN3aXRjaCAoY2F0ZWdvcnkpIHtcclxuICAgICAgICAgIGNhc2UgJ3Jlc291cmNlJzoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uX3Jlc291cmNlID0ge1xyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJycsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnI2ZmYmEyNiddLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifToge2N9ICh7ZH0lKVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZVBpZURhdGEoZGF0YVsnc3luY1Jlc291cmNlVG90YWwnXSwgZGF0YVsncmVzVG90YWwnXSwgWycxMi41JScsICc1MCUnXSksXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVQaWVEYXRhKGRhdGFbJ3VnY1Jlc291cmNlVG90YWwnXSwgZGF0YVsncmVzVG90YWwnXSwgWyczNy41JScsICc1MCUnXSksXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVQaWVEYXRhKGRhdGFbJ3B1Ymxpc2hlckNvdmVyYWdlUmF0ZSddICogZGF0YVsncmVzVG90YWwnXSwgZGF0YVsncmVzVG90YWwnXSwgWyc2Mi41JScsICc1MCUnXSksXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVQaWVEYXRhKGRhdGFbJ3N1YmplY3RDb3ZlcmFnZVJhdGUnXSAqIGRhdGFbJ3Jlc1RvdGFsJ10sIGRhdGFbJ3Jlc1RvdGFsJ10sIFsnODcuNSUnLCAnNTAlJ10pXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlY2hhcnRfcmVzb3VyY2Uuc2V0T3B0aW9uKG9wdGlvbl9yZXNvdXJjZSk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3Jlc291cmNlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdyZXNvdXJjZV90b3RhbF9zY2hvb2wnOiB7XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAncmVzb3VyY2VfdG90YWwnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fcmVzb3VyY2VfdG90YWwgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnI2VhZWM2OCcsICcjYTRkNDdhJywgJyM1NGJiNzYnLCAnIzBmY2JlNCcsICcjNDA4YmYxJywgJyMzMDU1YjMnLFxyXG4gICAgICAgICAgICAgICAgJyM4MTU0Y2MnLCAnI2RhNjBmYicsICcjZmYzZjY2JywgJyNmZThiMWUnLCAnI2ZkZDUxZCddLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogXCJ7Yn0gPGJyLz4ge2N9ICh7ZH0lKVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzEwJScsXHJcbiAgICAgICAgICAgICAgICByaWdodDogJzcwJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICc1JScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMTglJyxcclxuICAgICAgICAgICAgICAgIG9yaWVudDogJ3ZlcnRpY2FsJyxcclxuICAgICAgICAgICAgICAgIGl0ZW1HYXA6IDMwLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7Y29sb3I6ICcjZTdlN2U3JywgZm9udFNpemU6IDE0fSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ2xlZ2VuZERhdGEnXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY2FsY3VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogJ+WchuWciCcsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXI6IFsnNjUlJywgJzUwJSddLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFsxMzAsIDEzMV0sXHJcbiAgICAgICAgICAgICAgICAgIHNpbGVudDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgbGFiZWxMaW5lOiB7bm9ybWFsOiB7c2hvdzogZmFsc2V9fSxcclxuICAgICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzNzU4YWInXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbMTAwXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogJ+i1hOa6kOaAu+mHjycsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXI6IFsnNjUlJywgJzUwJSddLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFswLCAxMjBdLFxyXG4gICAgICAgICAgICAgICAgICByb3NlVHlwZTogJ2FyZWEnLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydzZXJpZXNEYXRhJ11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICh0aGlydFBhcmFtID09PSAncHVibGlzaGVyJykge1xyXG4gICAgICAgICAgICAgIG9wdGlvbl9yZXNvdXJjZV90b3RhbC5sZWdlbmQgPSAkLmV4dGVuZCh7fSwgb3B0aW9uX3Jlc291cmNlX3RvdGFsLmxlZ2VuZCwge1xyXG4gICAgICAgICAgICAgICAgICB0b3A6ICc4JScsXHJcbiAgICAgICAgICAgICAgICAgIGJvdHRvbTogJzIlJyxcclxuICAgICAgICAgICAgICAgICAgaXRlbUdhcDogMTBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ3Jlc291cmNlX3RvdGFsJykge1xyXG4gICAgICAgICAgICAgIGVjaGFydF9yZXNvdXJjZV90b3RhbC5zZXRPcHRpb24ob3B0aW9uX3Jlc291cmNlX3RvdGFsKTtcclxuICAgICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV90b3RhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2F0ZWdvcnkgPT09ICdyZXNvdXJjZV90b3RhbF9zY2hvb2wnKSB7XHJcbiAgICAgICAgICAgICAgZWNoYXJ0X3Jlc291cmNlX3RvdGFsX3NjaG9vbC5zZXRPcHRpb24ob3B0aW9uX3Jlc291cmNlX3RvdGFsKTtcclxuICAgICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV90b3RhbF9zY2hvb2wpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAncmVzb3VyY2VfdHJhbmQnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fcmVzb3VyY2VfdHJhbmQgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnIzUzYmI3NycsICcjZmYzZjY2J10sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ2xlZ2VuZERhdGEnXSxcclxuICAgICAgICAgICAgICAgIGl0ZW1HYXA6IDUwLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ExYmNlOScsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcyJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICcyJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXHJcbiAgICAgICAgICAgICAgICAgIC8vIGJvdW5kYXJ5R2FwOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWyd4QXhpc0RhdGEnXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBkYXRhWydzZXJpZXNEYXRhJ11cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZWNoYXJ0X3Jlc291cmNlX3RyYW5kLnNldE9wdGlvbihvcHRpb25fcmVzb3VyY2VfdHJhbmQpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV90cmFuZCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAncmVzb3VyY2VfdXNlJzoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uX3Jlc291cmNlX3VzZSA9IHtcclxuICAgICAgICAgICAgICBjb2xvcjogWycjMDBiZWZmJywgJyNmZjNmNjYnXSxcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZicsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVsnbGVnZW5kRGF0YSddLFxyXG4gICAgICAgICAgICAgICAgeDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICBpdGVtR2FwOiA1MCxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyNhMWJjZTknLFxyXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaGFkb3cnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcyJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICcyJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWyd4QXhpc0RhdGEnXSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0b29scy5oaWRlVGV4dEJ5TGVuKG5hbWUsIDEwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsaWduV2l0aExhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHlBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgIHNwbGl0TGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHNlcmllczogZGF0YVsnc2VyaWVzRGF0YSddXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVjaGFydF9yZXNvdXJjZV91c2Uuc2V0T3B0aW9uKG9wdGlvbl9yZXNvdXJjZV91c2UpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV91c2UpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3Jlc291cmNlX3VzZV9zY2hvb2wnOiB7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdyZXNvdXJjZV9jb250cmlidXRpb25fc2Nob29sJzoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbdGhpcnRQYXJhbV0sXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc2hhZG93J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMTAlJyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICByaWdodDogJzIlJyxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogJzIlJyxcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgeEF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVsneEF4aXNEYXRhJ10sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc1RpY2s6IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbGlnbldpdGhMYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICB5QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICBzcGxpdExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IGRhdGFbJ3Nlcmllc0RhdGEnXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkgPT09ICdyZXNvdXJjZV91c2Vfc2Nob29sJykge1xyXG4gICAgICAgICAgICAgIGVjaGFydF9yZXNvdXJjZV91c2Vfc2Nob29sLnNldE9wdGlvbihvcHRpb24pO1xyXG4gICAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3Jlc291cmNlX3VzZV9zY2hvb2wpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNhdGVnb3J5ID09PSAncmVzb3VyY2VfY29udHJpYnV0aW9uX3NjaG9vbCcpIHtcclxuICAgICAgICAgICAgICBlY2hhcnRfcmVzb3VyY2VfY29udHJpYnV0aW9uX3NjaG9vbC5zZXRPcHRpb24ob3B0aW9uKTtcclxuICAgICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV9jb250cmlidXRpb25fc2Nob29sKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG59KSJdfQ==
