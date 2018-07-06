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
      $.getJSON(service.prefix + '/resource/ugc/' + phaseid + '/statistics?errorDomId=' + domId, function (result) {
        if (result['code'] == 200) {
          if (result['data'][type]['length'] === 0) common.appendTipDom(domId, 'tip');else render(convertPieData(result['data'][type]), domId, type);
        }
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
      $.getJSON(service.prefix + '/resource/ugc/' + time + '/tendency?errorDomId=' + domId, function (result) {
        if (result['code'] == 200) render(convertLineData(result['data']), domId);
      });
    }

    function convertLineData(data) {
      var legendData = ['收藏量', '下载量'],
          xAxisData = [],
          seriesData1 = { name: '收藏量', areaStyle: { normal: {} }, type: 'line', data: [] },
          seriesData2 = { name: '下载量', areaStyle: { normal: {} }, type: 'line', data: [] };
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
      var legendData = [],
          seriesData = [],
          other = 0;
      $.each(data, function (index, item) {
        if (index < 10) {
          legendData.push(item['name']);
          seriesData.push({ name: item['name'], value: item['value'] });
        } else other += item['value'];
      });
      if (data.length > 10) {
        data.length = 10;
        legendData.push('其它');
        seriesData.push({ name: '其它', value: other });
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
      $.getJSON(service.prefix + '/resource/ugcTrend/' + encodeURIComponent(area) + '?errorDomId=ugc_contribution_bar', function (result) {
        if (result['code'] == 200) render(convertBarData(result['data']), 'ugc_contribution_bar');
      });
    }

    function convertBarData(data, category) {
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

    function render(data, category, thirtParam) {
      switch (category) {
        case 'ugc':
          {
            var option = {
              color: ['#eaec68', '#a4d47a', '#54bb76', '#0fcbe4', '#408bf1', '#3055b3', '#8154cc', '#da60fb', '#ff3f66', '#fe8b1e', '#fdd51d'],
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
              option.legend = $.extend({}, option.legend, {
                top: '8%',
                bottom: '2%',
                itemGap: 10
              });
            }
            echart.setOption(option);
            common.echart.hideLoading(echart);
            break;
          }
        case 'ugc_trand':
          {
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
              xAxis: [{
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
            echart_trand.setOption(option_trand);
            common.echart.hideLoading(echart_trand);
            break;
          }
        case 'ugc_contribution_pie':
          {
            var option_contribution = {
              color: ['#669feb', '#5093ed', '#408bf1', '#2f75d4', '#286bc7', '#165fc4', '#1357b4', '#b7ceed', '#aac7ef', '#8db5eb', '#7cadee'],
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br/> {c} ({d}%)"
              },
              legend: {
                y: 'bottom',
                itemGap: 10,
                textStyle: { color: '#e7e7e7', fontSize: 14 },
                data: data['legendData']
              },
              series: [{
                name: '圆圈',
                type: 'pie',
                center: ['50%', '45%'],
                radius: [90, 91],
                silent: true,
                labelLine: { normal: { show: false } },
                itemStyle: {
                  normal: {
                    color: '#3758ab'
                  }
                },
                data: [100]
              }, {
                name: '贡献情况',
                type: 'pie',
                radius: [0, 80],
                center: ['50%', '45%'],
                data: data['seriesData']
              }]
            };
            echart_contribution.setOption(option_contribution);
            common.echart.hideLoading(echart_contribution);
            break;
          }
        case 'ugc_contribution_bar':
          {
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
              series: [{
                name: '贡献情况',
                type: 'bar',
                barWidth: 27,
                data: data['seriesData']
              }]
            };
            echart_contribution_bar.setOption(option_bar);
            common.echart.hideLoading(echart_contribution_bar);
          }
        default:
          {}
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3Jlc291cmNlX3VnYy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiY29uZmlncGF0aHMiLCJkZWZpbmUiLCIkIiwic2VydmljZSIsImNvbW1vbiIsImVjaGFydCIsImluaXQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZWNoYXJ0X3RyYW5kIiwiZWNoYXJ0X2NvbnRyaWJ1dGlvbiIsInNob3dMb2FkaW5nIiwib24iLCJwYXJhbSIsImh0bWwiLCJ1Z2NDb25CYXJGZXRjaERhdGEiLCJnZXRBcmVhSWQiLCJlY2hhcnRfY29udHJpYnV0aW9uX2JhciIsInVnY1Jlc291cmNlQXJyYXkiLCJhcmVhIiwiaWQiLCJlYWNoIiwiaW5kZXgiLCJpdGVtIiwiZ2V0SlNPTiIsInByZWZpeCIsInJlc3VsdCIsInJlc291cmNlRmV0Y2hEYXRhIiwicGhhc2VpZCIsInR5cGUiLCJkb21JZCIsImFwcGVuZFRpcERvbSIsInJlbmRlciIsImNvbnZlcnRQaWVEYXRhIiwiZGF0YSIsImxlZ2VuZERhdGEiLCJzZXJpZXNEYXRhIiwib3RoZXIiLCJwdXNoIiwibGVuZ3RoIiwibmFtZSIsInZhbHVlIiwiYXR0ciIsInRyaWdnZXIiLCJyZXNvdXJjZVRyYW5kRmV0Y2hEYXRhIiwidGltZSIsImNvbnZlcnRMaW5lRGF0YSIsInhBeGlzRGF0YSIsInNlcmllc0RhdGExIiwiYXJlYVN0eWxlIiwibm9ybWFsIiwic2VyaWVzRGF0YTIiLCJjb252ZXJ0RGF0YSIsImNvbnZlcnRCYXJEYXRhIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY2F0ZWdvcnkiLCJ0aGlydFBhcmFtIiwib3B0aW9uIiwiY29sb3IiLCJ0b29sdGlwIiwiZm9ybWF0dGVyIiwibGVnZW5kIiwidG9wIiwicmlnaHQiLCJib3R0b20iLCJsZWZ0Iiwib3JpZW50IiwiaXRlbUdhcCIsInRleHRTdHlsZSIsImZvbnRTaXplIiwiY2FsY3VsYWJsZSIsInNlcmllcyIsImNlbnRlciIsInJhZGl1cyIsInNpbGVudCIsImxhYmVsTGluZSIsInNob3ciLCJpdGVtU3R5bGUiLCJyb3NlVHlwZSIsImV4dGVuZCIsInNldE9wdGlvbiIsImhpZGVMb2FkaW5nIiwib3B0aW9uX3RyYW5kIiwiZ3JpZCIsImNvbnRhaW5MYWJlbCIsInhBeGlzIiwiYXhpc0xhYmVsIiwiYXhpc0xpbmUiLCJsaW5lU3R5bGUiLCJ5QXhpcyIsInNwbGl0TGluZSIsIm9wdGlvbl9jb250cmlidXRpb24iLCJ5Iiwib3B0aW9uX2JhciIsImF4aXNQb2ludGVyIiwiYXhpc1RpY2siLCJiYXJXaWR0aCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsa0JBQWM7QUFEVDtBQUZNLENBQWY7QUFNQUgsUUFBUSxDQUFDLFlBQUQsQ0FBUixFQUF3QixVQUFVSSxXQUFWLEVBQXVCO0FBQzdDO0FBQ0FKLFVBQVFDLE1BQVIsQ0FBZUcsV0FBZjs7QUFFQUMsU0FBTyxFQUFQLEVBQVcsQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixRQUF0QixDQUFYLEVBQTRDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsTUFBdEIsRUFBOEI7QUFDeEUsUUFBSUMsU0FBU0QsT0FBT0MsTUFBUCxDQUFjQyxJQUFkLENBQW1CQyxTQUFTQyxjQUFULENBQXdCLEtBQXhCLENBQW5CLENBQWI7QUFDQSxRQUFJQyxlQUFlTCxPQUFPQyxNQUFQLENBQWNDLElBQWQsQ0FBbUJDLFNBQVNDLGNBQVQsQ0FBd0IsV0FBeEIsQ0FBbkIsQ0FBbkI7QUFDQSxRQUFJRSxzQkFBc0JOLE9BQU9DLE1BQVAsQ0FBY0MsSUFBZCxDQUFtQkMsU0FBU0MsY0FBVCxDQUF3QixzQkFBeEIsQ0FBbkIsQ0FBMUI7QUFDQUosV0FBT0MsTUFBUCxDQUFjTSxXQUFkLENBQTBCRCxtQkFBMUI7QUFDQUEsd0JBQW9CRSxFQUFwQixDQUF1QixPQUF2QixF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LHNCQUFRLENBQ047QUFDRS9CLHNCQUFNLE1BRFI7QUFFRVgsc0JBQU0sS0FGUjtBQUdFbUUsMEJBQVUsRUFIWjtBQUlFOUQsc0JBQU1BLEtBQUssWUFBTDtBQUpSLGVBRE07QUFyRE8sYUFBakI7QUE4REFqQixvQ0FBd0IrRCxTQUF4QixDQUFrQ2EsVUFBbEM7QUFDQXpGLG1CQUFPQyxNQUFQLENBQWM0RSxXQUFkLENBQTBCaEUsdUJBQTFCO0FBQ0Q7QUFDRDtBQUFTLFdBQ1I7QUFuT0g7QUFxT0Q7QUFDRixHQW5aRDtBQW9aRCxDQXhaRCIsImZpbGUiOiJjdXN0b21Nb2R1bGUvc3RhdGlzdGljcy9qcy9yZXNvdXJjZV91Z2MtNzAzYWY5NjQ0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ2N1c3RvbUNvbmYnOiAnc3RhdGlzdGljcy9qcy9jdXN0b21Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydjdXN0b21Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAnc2VydmljZScsICdjb21tb24nXSwgZnVuY3Rpb24gKCQsIHNlcnZpY2UsIGNvbW1vbikge1xyXG4gICAgdmFyIGVjaGFydCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndWdjJykpO1xyXG4gICAgdmFyIGVjaGFydF90cmFuZCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndWdjX3RyYW5kJykpO1xyXG4gICAgdmFyIGVjaGFydF9jb250cmlidXRpb24gPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VnY19jb250cmlidXRpb25fcGllJykpO1xyXG4gICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfY29udHJpYnV0aW9uKTtcclxuICAgIGVjaGFydF9jb250cmlidXRpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICQoJyNtYXhBcmVhJykuaHRtbChwYXJhbVsnbmFtZSddKTtcclxuICAgICAgdWdjQ29uQmFyRmV0Y2hEYXRhKGdldEFyZWFJZChwYXJhbVsnbmFtZSddKSk7XHJcbiAgICB9KTtcclxuICAgIHZhciBlY2hhcnRfY29udHJpYnV0aW9uX2JhciA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndWdjX2NvbnRyaWJ1dGlvbl9iYXInKSk7XHJcbiAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9jb250cmlidXRpb25fYmFyKTtcclxuXHJcbiAgICB2YXIgdWdjUmVzb3VyY2VBcnJheSA9IFtdOyAvLyDmlZnluIjkuIrkvKDotYTmupBcclxuICAgIGZ1bmN0aW9uIGdldEFyZWFJZChhcmVhKSB7XHJcbiAgICAgIHZhciBpZCA9ICcnO1xyXG4gICAgICAkLmVhY2godWdjUmVzb3VyY2VBcnJheSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgaWYgKGFyZWEgPT0gaXRlbVsnbmFtZSddKSB7XHJcbiAgICAgICAgICBpZCA9IGl0ZW1bJ2lkJ107XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOaVmeW4iOS4iuS8oOi1hOa6kOaAu+mHj1xyXG4gICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9yZXNvdXJjZS9jb3VudCcsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDIwMCkge1xyXG4gICAgICAgICQoJyN1Z2NSZXNvdXJjZVRvdGFsJykuaHRtbChyZXN1bHRbJ2RhdGEnXVsndWdjUmVzb3VyY2VUb3RhbCddKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w6LWE5rqQ5oC76YeP57uf6K6hXHJcbiAgICAgKiBAcGFyYW0gcGhhc2VpZFxyXG4gICAgICogQHBhcmFtIHR5cGUgc3ViamVjdDrlrabnp5HvvIxwdWJsaXNoZXLlh7rniYjnpL5cclxuICAgICAqIEBwYXJhbSBkb21JZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZXNvdXJjZUZldGNoRGF0YShwaGFzZWlkLCB0eXBlLCBkb21JZCkge1xyXG4gICAgICBlY2hhcnQgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tSWQpKTtcclxuICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnQpO1xyXG4gICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3Jlc291cmNlL3VnYy8nICsgcGhhc2VpZCArICcvc3RhdGlzdGljcz9lcnJvckRvbUlkPScgKyBkb21JZCxcclxuICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbJ2RhdGEnXVt0eXBlXVsnbGVuZ3RoJ10gPT09IDApIGNvbW1vbi5hcHBlbmRUaXBEb20oZG9tSWQsICd0aXAnKTtcclxuICAgICAgICAgICAgZWxzZSByZW5kZXIoY29udmVydFBpZURhdGEocmVzdWx0WydkYXRhJ11bdHlwZV0pLCBkb21JZCwgdHlwZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29udmVydFBpZURhdGEoZGF0YSkge1xyXG4gICAgICB2YXIgbGVnZW5kRGF0YSA9IFtdLCBzZXJpZXNEYXRhID0gW10sIG90aGVyID0gMDtcclxuICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIGlmIChpbmRleCA8IDEwKSBsZWdlbmREYXRhLnB1c2goaXRlbVsnbmFtZSddKTtcclxuICAgICAgICBlbHNlIG90aGVyICs9IGl0ZW1bJ3ZhbHVlJ107XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgICAgZGF0YS5sZW5ndGggPSAxMDtcclxuICAgICAgICBsZWdlbmREYXRhLnB1c2goJ+WFtuWugycpO1xyXG4gICAgICAgIGRhdGEucHVzaCh7bmFtZTogJ+WFtuWugycsIHZhbHVlOiBvdGhlcn0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbGVnZW5kRGF0YTogbGVnZW5kRGF0YSxcclxuICAgICAgICBzZXJpZXNEYXRhOiBkYXRhXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnI3NlbGVjdF9yZXNvdXJjZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHR5cGUgPSAkKCcjcmFkaW9fcmVzb3VyY2UnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICAgIHJlc291cmNlRmV0Y2hEYXRhKCQodGhpcykuYXR0cignZGF0YS12YWx1ZScpLCB0eXBlLCAndWdjJyk7XHJcbiAgICB9KTtcclxuICAgICQoJ2JvZHknKS5vbigncmFkaW9DaGFuZ2UnLCAnI3JhZGlvX3Jlc291cmNlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgcGhhc2VpZCA9ICQoJyNzZWxlY3RfcmVzb3VyY2UnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICAgIHJlc291cmNlRmV0Y2hEYXRhKHBoYXNlaWQsICQodGhpcykuYXR0cignZGF0YS12YWx1ZScpLCAndWdjJyk7XHJcbiAgICB9KTtcclxuICAgICQoJyNyYWRpb19yZXNvdXJjZScpLnRyaWdnZXIoJ3JhZGlvQ2hhbmdlJyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w6LWE5rqQ55qE5L2/55So6LaL5Yq/XHJcbiAgICAgKiBAcGFyYW0gdGltZSB5ZXN0ZXJkYXk65pio5aSp77yMbGFzdHNldmVu77ya5pyA6L+R5LiD5aSp77yMbGFzdHRoaXJ0ee+8muacgOi/keS4ieWNgeWkqVxyXG4gICAgICogQHBhcmFtIGRvbUlkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlc291cmNlVHJhbmRGZXRjaERhdGEodGltZSwgZG9tSWQpIHtcclxuICAgICAgZWNoYXJ0X3RyYW5kID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbUlkKSk7XHJcbiAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3RyYW5kKTtcclxuICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9yZXNvdXJjZS91Z2MvJyArIHRpbWUgKyAnL3RlbmRlbmN5P2Vycm9yRG9tSWQ9JyArIGRvbUlkLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApXHJcbiAgICAgICAgICAgIHJlbmRlcihjb252ZXJ0TGluZURhdGEocmVzdWx0WydkYXRhJ10pLCBkb21JZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY29udmVydExpbmVEYXRhKGRhdGEpIHtcclxuICAgICAgdmFyIGxlZ2VuZERhdGEgPSBbJ+aUtuiXj+mHjycsICfkuIvovb3ph48nXSwgeEF4aXNEYXRhID0gW10sXHJcbiAgICAgICAgc2VyaWVzRGF0YTEgPSB7bmFtZTogJ+aUtuiXj+mHjycsIGFyZWFTdHlsZToge25vcm1hbDoge319LCB0eXBlOiAnbGluZScsIGRhdGE6IFtdfSxcclxuICAgICAgICBzZXJpZXNEYXRhMiA9IHtuYW1lOiAn5LiL6L296YePJywgYXJlYVN0eWxlOiB7bm9ybWFsOiB7fX0sIHR5cGU6ICdsaW5lJywgZGF0YTogW119O1xyXG4gICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgIHZhciB0aW1lID0gdmFsdWVbJ25hbWUnXSArICcnO1xyXG4gICAgICAgIGlmICh0aW1lLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgIHRpbWUgPSB0aW1lLmxlbmd0aCA8IDIgPyAnMCcgKyB0aW1lIDogdGltZTtcclxuICAgICAgICAgIHRpbWUgKz0gJzowMCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHhBeGlzRGF0YS5wdXNoKHRpbWUpO1xyXG4gICAgICAgIHNlcmllc0RhdGExLmRhdGEucHVzaCh2YWx1ZVsnY29sbGVjdCddKTtcclxuICAgICAgICBzZXJpZXNEYXRhMi5kYXRhLnB1c2godmFsdWVbJ2Rvd25sb2FkJ10pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsZWdlbmREYXRhOiBsZWdlbmREYXRhLFxyXG4gICAgICAgIHhBeGlzRGF0YTogeEF4aXNEYXRhLFxyXG4gICAgICAgIHNlcmllc0RhdGE6IFtzZXJpZXNEYXRhMSwgc2VyaWVzRGF0YTJdXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnI3NlbGVjdF9yZXNvdXJjZV90cmFuZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmVzb3VyY2VUcmFuZEZldGNoRGF0YSgkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJ3VnY190cmFuZCcpO1xyXG4gICAgfSk7XHJcbiAgICAkKCcjc2VsZWN0X3Jlc291cmNlX3RyYW5kJykudHJpZ2dlcignc2VsZWN0Q2hhbmdlJyk7XHJcblxyXG4gICAgLy8g5pWZ5biI5LiK5Lyg6LWE5rqQ6LSh54yu5oOF5Ya157uf6K6hXHJcbiAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3Jlc291cmNlL3VnYy9zdGF0aXN0aWNzP2Vycm9yRG9tSWQ9dWdjX2NvbnRyaWJ1dGlvbicsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDIwMCkge1xyXG4gICAgICAgICQoJyNtYXhBcmVhJykuaHRtbChyZXN1bHRbJ2RhdGEnXVsndHJlbmQnXVsnbWF4QXJlYSddKTtcclxuICAgICAgICByZW5kZXIoY29udmVydERhdGEocmVzdWx0WydkYXRhJ11bJ2FyZWEnXSksICd1Z2NfY29udHJpYnV0aW9uX3BpZScpO1xyXG4gICAgICAgIHVnY1Jlc291cmNlQXJyYXkgPSByZXN1bHRbJ2RhdGEnXVsnYXJlYSddO1xyXG4gICAgICAgIHJlbmRlcihjb252ZXJ0QmFyRGF0YShyZXN1bHRbJ2RhdGEnXVsndHJlbmQnXVsnc3RhdGlzdGljcyddLCAnMCcpLCAndWdjX2NvbnRyaWJ1dGlvbl9iYXInKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gY29udmVydERhdGEoZGF0YSkge1xyXG4gICAgICB2YXIgbGVnZW5kRGF0YSA9IFtdLCBzZXJpZXNEYXRhID0gW10sIG90aGVyID0gMDtcclxuICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIGlmIChpbmRleCA8IDEwKSB7XHJcbiAgICAgICAgICBsZWdlbmREYXRhLnB1c2goaXRlbVsnbmFtZSddKTtcclxuICAgICAgICAgIHNlcmllc0RhdGEucHVzaCh7bmFtZTogaXRlbVsnbmFtZSddLCB2YWx1ZTogaXRlbVsndmFsdWUnXX0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Ugb3RoZXIgKz0gaXRlbVsndmFsdWUnXTtcclxuICAgICAgfSk7XHJcbiAgICAgIGlmIChkYXRhLmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgICAgZGF0YS5sZW5ndGggPSAxMDtcclxuICAgICAgICBsZWdlbmREYXRhLnB1c2goJ+WFtuWugycpO1xyXG4gICAgICAgIHNlcmllc0RhdGEucHVzaCh7bmFtZTogJ+WFtuWugycsIHZhbHVlOiBvdGhlcn0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbGVnZW5kRGF0YTogbGVnZW5kRGF0YSxcclxuICAgICAgICBzZXJpZXNEYXRhOiBzZXJpZXNEYXRhXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVR0PotYTmupDotKHnjK7otovlir9cclxuICAgICAqIEBwYXJhbSBhcmVhXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHVnY0NvbkJhckZldGNoRGF0YShhcmVhKSB7XHJcbiAgICAgIGVjaGFydF9jb250cmlidXRpb25fYmFyID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1Z2NfY29udHJpYnV0aW9uX2JhcicpKTtcclxuICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfY29udHJpYnV0aW9uX2Jhcik7XHJcbiAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvcmVzb3VyY2UvdWdjVHJlbmQvJyArIGVuY29kZVVSSUNvbXBvbmVudChhcmVhKSArICc/ZXJyb3JEb21JZD11Z2NfY29udHJpYnV0aW9uX2JhcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDIwMCkgcmVuZGVyKGNvbnZlcnRCYXJEYXRhKHJlc3VsdFsnZGF0YSddKSwgJ3VnY19jb250cmlidXRpb25fYmFyJyk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0QmFyRGF0YShkYXRhLCBjYXRlZ29yeSkge1xyXG4gICAgICB2YXIgeEF4aXNEYXRhID0gW10sIHNlcmllc0RhdGEgPSBbXTtcclxuICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgIHhBeGlzRGF0YS5wdXNoKGl0ZW1bJ25hbWUnXSk7XHJcbiAgICAgICAgc2VyaWVzRGF0YS5wdXNoKGl0ZW1bJ3ZhbHVlJ10pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB4QXhpc0RhdGE6IHhBeGlzRGF0YSxcclxuICAgICAgICBzZXJpZXNEYXRhOiBzZXJpZXNEYXRhXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW5kZXIoZGF0YSwgY2F0ZWdvcnksIHRoaXJ0UGFyYW0pIHtcclxuICAgICAgc3dpdGNoIChjYXRlZ29yeSkge1xyXG4gICAgICAgIGNhc2UgJ3VnYyc6IHtcclxuICAgICAgICAgIHZhciBvcHRpb24gPSB7XHJcbiAgICAgICAgICAgIGNvbG9yOiBbJyNlYWVjNjgnLCAnI2E0ZDQ3YScsICcjNTRiYjc2JywgJyMwZmNiZTQnLCAnIzQwOGJmMScsICcjMzA1NWIzJyxcclxuICAgICAgICAgICAgICAnIzgxNTRjYycsICcjZGE2MGZiJywgJyNmZjNmNjYnLCAnI2ZlOGIxZScsICcjZmRkNTFkJ10sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcIntifSA8YnIvPiB7Y30gKHtkfSUpXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgdG9wOiAnMTMlJyxcclxuICAgICAgICAgICAgICByaWdodDogJzcwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTAlJyxcclxuICAgICAgICAgICAgICBsZWZ0OiAnMTglJyxcclxuICAgICAgICAgICAgICBvcmllbnQ6ICd2ZXJ0aWNhbCcsXHJcbiAgICAgICAgICAgICAgaXRlbUdhcDogMzAsXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7Y29sb3I6ICcjZTdlN2U3JywgZm9udFNpemU6IDE0fSxcclxuICAgICAgICAgICAgICBkYXRhOiBkYXRhWydsZWdlbmREYXRhJ11cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2FsY3VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ+WchuWciCcsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgIGNlbnRlcjogWyc2NSUnLCAnNTAlJ10sXHJcbiAgICAgICAgICAgICAgICByYWRpdXM6IFsxMzAsIDEzMV0sXHJcbiAgICAgICAgICAgICAgICBzaWxlbnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBsYWJlbExpbmU6IHtub3JtYWw6IHtzaG93OiBmYWxzZX19LFxyXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzM3NThhYidcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFsxMDBdXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn6LWE5rqQ5oC76YePJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyOiBbJzY1JScsICc1MCUnXSxcclxuICAgICAgICAgICAgICAgIHJhZGl1czogWzAsIDEyMF0sXHJcbiAgICAgICAgICAgICAgICByb3NlVHlwZTogJ2FyZWEnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVsnc2VyaWVzRGF0YSddXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgaWYgKHRoaXJ0UGFyYW0gPT09ICdwdWJsaXNoZXInKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbi5sZWdlbmQgPSAkLmV4dGVuZCh7fSwgb3B0aW9uLmxlZ2VuZCwge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnOCUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMiUnLFxyXG4gICAgICAgICAgICAgICAgaXRlbUdhcDogMTBcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlY2hhcnQuc2V0T3B0aW9uKG9wdGlvbik7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAndWdjX3RyYW5kJzoge1xyXG4gICAgICAgICAgdmFyIG9wdGlvbl90cmFuZCA9IHtcclxuICAgICAgICAgICAgY29sb3I6IFsnIzUzYmI3NycsICcjZmYzZjY2J10sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgZGF0YTogZGF0YVsnbGVnZW5kRGF0YSddLFxyXG4gICAgICAgICAgICAgIGl0ZW1HYXA6IDUwLFxyXG4gICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjYTFiY2U5JyxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNFxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjOTJhY2NmJyxcclxuICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgIGxlZnQ6ICcwJScsXHJcbiAgICAgICAgICAgICAgcmlnaHQ6ICcwJScsXHJcbiAgICAgICAgICAgICAgYm90dG9tOiAnMyUnLFxyXG4gICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXHJcbiAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWyd4QXhpc0RhdGEnXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgc2VyaWVzOiBkYXRhWydzZXJpZXNEYXRhJ11cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBlY2hhcnRfdHJhbmQuc2V0T3B0aW9uKG9wdGlvbl90cmFuZCk7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF90cmFuZCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAndWdjX2NvbnRyaWJ1dGlvbl9waWUnOiB7XHJcbiAgICAgICAgICB2YXIgb3B0aW9uX2NvbnRyaWJ1dGlvbiA9IHtcclxuICAgICAgICAgICAgY29sb3I6IFsnIzY2OWZlYicsICcjNTA5M2VkJywgJyM0MDhiZjEnLCAnIzJmNzVkNCcsICcjMjg2YmM3JywgJyMxNjVmYzQnLFxyXG4gICAgICAgICAgICAgICcjMTM1N2I0JywgJyNiN2NlZWQnLCAnI2FhYzdlZicsICcjOGRiNWViJywgJyM3Y2FkZWUnXSxcclxuICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2J9IDxici8+IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICB5OiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICBpdGVtR2FwOiAxMCxcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtjb2xvcjogJyNlN2U3ZTcnLCBmb250U2l6ZTogMTR9LFxyXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ2xlZ2VuZERhdGEnXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn5ZyG5ZyIJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyOiBbJzUwJScsICc0NSUnXSxcclxuICAgICAgICAgICAgICAgIHJhZGl1czogWzkwLCA5MV0sXHJcbiAgICAgICAgICAgICAgICBzaWxlbnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBsYWJlbExpbmU6IHtub3JtYWw6IHtzaG93OiBmYWxzZX19LFxyXG4gICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzM3NThhYidcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFsxMDBdXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn6LSh54yu5oOF5Ya1JyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgcmFkaXVzOiBbMCwgODBdLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyOiBbJzUwJScsICc0NSUnXSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3Nlcmllc0RhdGEnXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGVjaGFydF9jb250cmlidXRpb24uc2V0T3B0aW9uKG9wdGlvbl9jb250cmlidXRpb24pO1xyXG4gICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfY29udHJpYnV0aW9uKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlICd1Z2NfY29udHJpYnV0aW9uX2Jhcic6IHtcclxuICAgICAgICAgIHZhciBvcHRpb25fYmFyID0ge1xyXG4gICAgICAgICAgICBjb2xvcjogWycjMDBiZmZmJ10sXHJcbiAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdzaGFkb3cnXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgdG9wOiAnMTUlJyxcclxuICAgICAgICAgICAgICBsZWZ0OiAnMiUnLFxyXG4gICAgICAgICAgICAgIHJpZ2h0OiAnMSUnLFxyXG4gICAgICAgICAgICAgIGJvdHRvbTogJzMlJyxcclxuICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeEF4aXM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVsneEF4aXNEYXRhJ10sXHJcbiAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICAvLyBhbGlnbldpdGhMYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ+i0oeeMruaDheWGtScsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgICAgIGJhcldpZHRoOiAyNyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3Nlcmllc0RhdGEnXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGVjaGFydF9jb250cmlidXRpb25fYmFyLnNldE9wdGlvbihvcHRpb25fYmFyKTtcclxuICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X2NvbnRyaWJ1dGlvbl9iYXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pIl19
