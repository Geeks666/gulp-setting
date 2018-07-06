require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'tools', 'common'],
    function ($, service, tools, common) {
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
        $.getJSON(service.prefix + '/resource/' + scope + '/' + phaseid + '/statistics?errorDomId=' + domId,
          function (result) {
            if (result['code'] == 200)
              if (result['data'][type]['length'] === 0) common.appendTipDom(domId, 'tip');
              else render(convertPieData(result['data'][type]), domId, type);
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
        $.getJSON(service.prefix + '/resource/' + scope + '/' + time + '/tendency?errorDomId=resource_trand',
          function (result) {
            if (result['code'] == 200)
              render(convertLineData(result['data']), 'resource_trand');
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
        $.getJSON(service.prefix + '/resource/' + scope + '/orgUsage/statistics?errorDomId=resource_use',
          function (result) {
            if (result['code'] == 200)
              render(convertBarData(result['data']), 'resource_use');
          });
      }

      resourceUseFetchData('all');

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

        $.getJSON(service.prefix + '/resource/' + type + '/userOperate/statistics?errorDomId=' + domId,
          function (result) {
            if (result['code'] == 200)
              render(convertBarData1(result['data'], name), domId, color);
          });
      }

      function convertBarData1(data, name) {
        var xAxisData = [],
          seriesData = {name: name, type: 'bar', barWidth: 20, data: data};
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
          data: [
            {
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
            },
            {
              name: 'other',
              value: (total - val),
              label: {
                normal: {
                  show: false
                }
              },
              itemStyle: {normal: {color: '#3e5284'}}
            }
          ]
        }
      }

      /**
       * @description 渲染echarts图表
       * @param data
       * @param category
       * @param thirtParam
       */
      function render(data, category, thirtParam) {
        switch (category) {
          case 'resource': {
            var option_resource = {
              backgroundColor: '',
              color: ['#ffba26'],
              tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              series: [
                createPieData(data['syncResourceTotal'], data['resTotal'], ['12.5%', '50%']),
                createPieData(data['ugcResourceTotal'], data['resTotal'], ['37.5%', '50%']),
                createPieData(data['publisherCoverageRate'] * data['resTotal'], data['resTotal'], ['62.5%', '50%']),
                createPieData(data['subjectCoverageRate'] * data['resTotal'], data['resTotal'], ['87.5%', '50%'])
              ]
            };
            echart_resource.setOption(option_resource);
            common.echart.hideLoading(echart_resource);
            break;
          }
          case 'resource_total_school': {

          }
          case 'resource_total': {
            var option_resource_total = {
              color: ['#eaec68', '#a4d47a', '#54bb76', '#0fcbe4', '#408bf1', '#3055b3',
                '#8154cc', '#da60fb', '#ff3f66', '#fe8b1e', '#fdd51d'],
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
              option_resource_total.legend = $.extend({}, option_resource_total.legend, {
                  top: '8%',
                  bottom: '2%',
                  itemGap: 10
                }
              );
            }
            if (category === 'resource_total') {
              echart_resource_total.setOption(option_resource_total);
              common.echart.hideLoading(echart_resource_total);
            }
            else if (category === 'resource_total_school') {
              echart_resource_total_school.setOption(option_resource_total);
              common.echart.hideLoading(echart_resource_total_school);
            }
            break;
          }
          case 'resource_trand': {
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
            echart_resource_trand.setOption(option_resource_trand);
            common.echart.hideLoading(echart_resource_trand);
            break;
          }
          case 'resource_use': {
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
                containLabel: true,
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
            echart_resource_use.setOption(option_resource_use);
            common.echart.hideLoading(echart_resource_use);
            break;
          }
          case 'resource_use_school': {
          }
          case 'resource_contribution_school': {
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
              series: data['seriesData']
            };
            if (category === 'resource_use_school') {
              echart_resource_use_school.setOption(option);
              common.echart.hideLoading(echart_resource_use_school);
            }
            else if (category === 'resource_contribution_school') {
              echart_resource_contribution_school.setOption(option);
              common.echart.hideLoading(echart_resource_contribution_school);
            }
            break;
          }
          default: {
          }
        }
      }
    }
  );
})