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

  define('', ['jquery', 'service', 'tools', 'common', 'paging'], function ($, service, tools, common, Paging) {
    var mapName = common.areaname === '北京市' ? 'beijing' : 'chongqing';
    // var echart_userarea_map = common.echart.init(document.getElementById('userarea_map'));
    // 地图事件绑定
    /* echart_userarea_map.on('click', function (param) {
       mapFetchData(param['name']);
     });*/
    var echart_userarea_map_pie = common.echart.init(document.getElementById('userarea_map_pie'));
    var echart_userarea_isfirst = common.echart.init(document.getElementById('userarea_isfirst'));
    var echart_userarea_nofirst = common.echart.init(document.getElementById('userarea_nofirst'));

    // 区县管理员
    var echart_userarea_isfirst_county = common.echart.init(document.getElementById('userarea_isfirst_county'));
    var echart_userarea_nofirst_county = common.echart.init(document.getElementById('userarea_nofirst_county'));

    // 获取地图
    // todo 地图url
    function getMap() {
      return $.getJSON('../../../../lib/echarts/maps/' + mapName + '.json', function (mapJson) {
        common.echart.registerMap(mapName, mapJson);
      });
    }

    /**
     * @description 获取每个区的总人数
     */
    function areaCountFetchData() {
      $.getJSON(service.prefix + '/platform/area/count', function (result) {
        if (result['code'] == 200) {
          var total = 0;
          $.each(result['data'], function (index, item) {
            total += item['value'];
          });
          $('#total_users').html(total);
          render(result['data'], 'userarea_map');
          if (result['data']['length'] === 0) {
            common.appendTipDom('userarea_map_pie', 'tip');
          } else {
            mapFetchData(result['data'][0]['name']);
          }
        }
      });
    }

    // 地图json获取成功后获取区域数据，渲染地图图表
    $.when(getMap()).then(areaCountFetchData);

    /**
     * @description 获取平台用户地域分布
     * @param areaname
     */
    function mapFetchData(areaname) {
      var extra = '?errorDomId=userarea_map_pie';
      if (areaname) extra = '?areaname=' + encodeURIComponent(areaname) + '&errorDomId=userarea_map_pie';
      echart_userarea_map_pie = common.echart.init(document.getElementById('userarea_map_pie'));
      common.echart.hideLoading(echart_userarea_map_pie);
      $.getJSON(service.prefix + '/platform/area/distribute' + extra, function (result) {
        if (result['code'] == 200) render(converPieData(result['data'], areaname), 'userarea_map_pie');
        $('#county').html(areaname);
      });
    }

    function converPieData(data, areaname) {
      var legendData = [],
          seriesData = [],
          other = 0;
      $.each(data, function (index, item) {
        if (index > 9) other += item['value'];else legendData.push(item['name']);
      });
      if (data['length'] > 10) {
        data['length'] = 10;
        legendData.push('其它');
        data.push({ name: '其它', value: other });
      }
      return {
        legendData: legendData,
        name: areaname,
        seriesData: data
      };
    }

    /**
     * @description 使用平台的用户地域分布
     * @param 统计类型（area：区域分布，usertype:用户类型；school:学校）
     * @param isfirst 是否是首次登陆(1:首次登陆，0:非首次登陆)
     * @param time 时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     * @param domId
     * @param pageNo 当前页数
     */
    function areaFetchData(type, isfirst, time, domId, pageNo) {
      var extra = '&errorDomId=' + domId;
      if (pageNo) extra += '&pageNo=' + pageNo;
      if (type === 'area') {
        if (isfirst == 1) {
          echart_userarea_isfirst = common.echart.init(document.getElementById('userarea_isfirst'));
          common.echart.showLoading(echart_userarea_isfirst);
        } else {
          echart_userarea_nofirst = common.echart.init(document.getElementById('userarea_nofirst'));
          common.echart.showLoading(echart_userarea_nofirst);
        }
      } else if (type === 'school') {
        if (isfirst == 1) {
          echart_userarea_isfirst_county = common.echart.init(document.getElementById('userarea_isfirst_county'));
          common.echart.showLoading(echart_userarea_isfirst_county);
        } else {
          echart_userarea_nofirst_county = common.echart.init(document.getElementById('userarea_nofirst_county'));
          common.echart.showLoading(echart_userarea_nofirst_county);
        }
      }
      return $.getJSON(service.prefix + '/platform/' + type + '/' + isfirst + '/used?time=' + time + extra, function (result) {
        if (result['code'] == 200) {
          if (result['data']['length'] === 0) {
            common.appendTipDom(domId, 'tip');
          } else {
            if (type === 'school') {
              if (result['data']['school']['totalSize'] > 0) {
                if (isfirst == 1) {
                  $('#total_isfirst_school').html(result['data']['total']);
                  render(convertSchool1Data(result['data']), domId);
                } else if (isfirst == 0) {
                  $('#total_nofirst_school').html(result['data']['total']);
                  render(convertSchool0Data(result['data']), domId);
                  var pageCount = result['data']['school']['pageCount'];
                  if (pageCount > 1 && !pageNo) {
                    $('#pageTool_county').html('');
                    var pp = new Paging();
                    pp.init({
                      target: '#pageTool_county', firstTpl: false, lastTpl: false, pagesize: 10, pageCount: 0,
                      count: result['data']['school']['totalSize'], callback: function callback(current) {
                        areaFetchData($('.userDistribution').attr('data-type'), $('.userDistribution').attr('data-fun'), $('.userDistribution').attr('data-value'), $('.userDistribution').attr('data-id'), current);
                      }
                    });
                  }
                }
              } else {
                common.appendTipDom(domId, 'tip');
              }
            } else if (type == 'area' && result['data']['length'] > 0) {
              render(convertData(result['data']), domId);
              var total = 0;
              $.each(result['data'], function (index, item) {
                total += item['value'];
              });
              if (isfirst == 1) $('#total_users_isfirst').html(total);else $('#total_users_nofirst').html(total);
            }
          }
        }
      });
    }

    function convertData(data) {
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

    $('body').on('selectChange', '.selectTop', function () {
      if ($(this).attr('data-fun')) areaFetchData($(this).attr('data-type'), $(this).attr('data-fun'), $(this).attr('data-value'), $(this).attr('data-id'));
    });
    $('.selectTop').trigger('selectChange');

    // 区县管理员——首次使用平台的用户分布
    function convertSchool1Data(data) {
      var legendData = [],
          seriesData = [],
          other = 0;
      data = data['school']['dataList'];
      $.each(data, function (index, item) {
        if (index > 9) other += item['value'];else legendData.push(item['name']);
      });
      if (data['length'] > 10) {
        data['length'] = 10;
        legendData.push('其它');
        data.push({ name: '其它', value: other });
      }
      return {
        legendData: legendData,
        seriesData: data
      };
    }

    // 使用平台的用户分布情况
    var colors = ['#ff3f66', '#fb8b1e', '#fdd51d', '#53bb77', '#14c7e0', '#b653cf', '#3f86ea', '#bd6982', '#6497cb', '#c08851'];

    function convertSchool0Data(data) {
      var seriesData = [];
      // 学校标题的展示和定位
      var title = $('.row3-user-area-county .title'),
          html = '';
      var tempIndex = 0,
          top = 226,
          left = 0,
          // 标题位置
      x = '10%',
          y = '20%'; // 图表center位置
      $.each(data['school']['dataList'], function (index, item) {
        if (tempIndex > 4) {
          top = 406;
          tempIndex = 0;
          y = '70%';
        }
        x = tempIndex + tempIndex + 1 + '0%';
        seriesData.push(createPieData(item['value'], data['total'], [x, y], colors[index]));
        left = 0 + tempIndex * 198;
        html += '<div class="title-item" style="top: ' + top + 'px; left: ' + left + 'px;">' + item['name'] + '</div>';
        tempIndex++;
      });
      title.html(html);
      return { seriesData: seriesData };
    }

    // 区县管理员
    /**
     * @description 各校用户总量统计
     * @param pageNo
     */
    var currentPage = 1;

    function schoolFetchData(pageNo) {
      var extra = '';
      if (pageNo) extra = '&pageNo=' + pageNo;
      $.getJSON(service.prefix + '/platform/school/ranking?errorDomId=table_county' + extra, function (result) {
        if (result['code'] == 200) {
          var totalSize = result['data']['totalSize'];
          if (totalSize > 0) {
            createTable(result['data']['dataList'], 'table_userarea_county', pageNo);
          } else if (totalSize == 0) {
            $('#table_userarea_county').empty().append('<div id="empty_info"><div><p>没有相关内容</p></div></div>');
          }
          if (result.data.pageCount > 1 && currentPage === 1) renderPage('pageTool', totalSize);
        }
      });
    }

    function renderPage(pageId, total) {
      currentPage++;
      $('#' + pageId).html('');
      var p = new Paging();
      p.init({
        target: '#' + pageId, pagesize: 10, pageCount: 1,
        count: total, callback: function callback(current) {
          schoolFetchData(current);
        }
      });
    }

    schoolFetchData();

    function createTable(data, domId, pageNo) {
      pageNo = pageNo || 1;
      var html = '',
          total = 0;
      $.each(data, function (index, item) {
        total += item['value'];
        var cls = 'num ';
        if (pageNo == 1 && index < 3) cls += 'num' + (index + 1);
        html += '<tr>' + '<td><span class="' + cls + '">' + (index + 1 + (pageNo - 1) * 10) + '</span><a title="' + item['name'] + '">' + item['name'] + '</a></td>' + '<td class="mark">' + item['value'] + '</td>' + '</tr>';
      });
      $('#total_users_county').html(total);
      $('#' + domId).html(html);
    }

    function createPieData(v, total, center, color) {
      if (total == 0) {
        v = 0;
        total = 1;
      }
      return {
        silent: true,
        clockwise: false,
        type: 'pie',
        radius: [45, 55],
        avoidLabelOverlap: false,
        center: center,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [{
          value: v, name: (v * 100 / total).toFixed(1) + '%',
          itemStyle: { normal: { color: color } },
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
          value: total - v, name: 'other',
          label: {
            normal: {
              show: false
            }
          },
          itemStyle: { normal: { color: '#2b4178' } }
        }]
      };
    }

    function render(data, category) {
      switch (category) {
        case 'userarea_map':
          {
            var option_userarea_map = {
              tooltip: {
                trigger: 'item',
                formatter: function formatter(param) {
                  return param['name'] + ' : ' + (param['value'] || 0);
                }
              },
              visualMap: {
                right: '5%',
                bottom: '0',
                text: ['高', '低'],
                calculable: true,
                itemWidth: 16,
                itemHeight: 100,
                textStyle: {
                  color: '#fff'
                }
              },
              series: [{
                name: '北京',
                type: 'map',
                mapType: mapName,
                selectedMode: 'single',
                left: '15%',
                label: {
                  normal: {
                    // show: true
                  },
                  emphasis: {
                    show: true
                  }
                },
                data: data
              }]
            };
            echart_userarea_map.setOption(option_userarea_map);
            common.echart.hideLoading(echart_userarea_map);
            break;
          }
        case 'userarea_map_pie':
          {
            var option_userarea_map_pie = {
              color: ['#d0174f', '#316ec5', '#3f86ea', '#14c7e0', '#53bb77', '#fdd51d', '#fd8c1d', '#ff3f66', '#b653cf'],
              backgroundColor: '',
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'horizontal',
                left: 'center',
                bottom: '0',
                itemGap: 20,
                textStyle: { color: '#e7e7e7', fontSize: 14 },
                data: data['legendData']
              },
              series: [{
                name: data['name'],
                type: 'pie',
                radius: '55%',
                center: ['50%', '40%'],
                data: data['seriesData'],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }]
            };
            echart_userarea_map_pie.setOption(option_userarea_map_pie);
            common.echart.hideLoading(echart_userarea_map_pie);
            break;
          }
        case 'userarea_isfirst_county':
          {
            var option_userarea_isfirst_county = {
              color: ['#d7423d', '#53bb77', '#f19d32', '#14c7e0', '#cf539f', '#3f86ea'],
              title: {},
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br/> {c} ({d}%)"
              },
              calculable: true,
              legend: [{
                bottom: '2%',
                itemGap: 10,
                textStyle: {
                  color: '#fff'
                },
                data: data['legendData'],
                formatter: function formatter(name) {
                  return tools.hideTextByLen(name, 14);
                },
                tooltip: {
                  show: true
                }
              }],
              series: [{
                name: '首次使用平台的用户分布',
                type: 'pie',
                center: ['50%', '35%'],
                radius: [0, 100],
                roseType: 'area',
                data: data['seriesData']
              }]
            };
            for (var i = 0; i < data['seriesData'].length; i++) {
              option_userarea_isfirst_county.series[0].data[i].label = {};
              option_userarea_isfirst_county.series[0].data[i].label.normal = {};
              option_userarea_isfirst_county.series[0].data[i].label.normal.formatter = tools.hideTextByLen(data['seriesData'][i].name, 20);
            }
            echart_userarea_isfirst_county.setOption(option_userarea_isfirst_county);
            common.echart.hideLoading(echart_userarea_isfirst_county);
            break;
          }
        case 'userarea_nofirst_county':
          {
            var option_userarea_nofirst_county = {
              backgroundColor: '',
              tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              series: data['seriesData']
            };
            echart_userarea_nofirst_county.setOption(option_userarea_nofirst_county);
            common.echart.hideLoading(echart_userarea_nofirst_county);
            break;
          }
        default:
          {
            var color = '#29c983',
                name = '平台用户';
            if (category === 'userarea_isfirst') {
              color = '#00bfff';
              name = '首次使用平台用户';
            }
            var option_bar = {
              color: [color],
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
                top: '20',
                left: '10',
                right: '4%',
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
                name: name,
                type: 'bar',
                barWidth: 30,
                data: data['seriesData']
              }]
            };
            if (category === 'userarea_isfirst') {
              echart_userarea_isfirst.setOption(option_bar);
              common.echart.hideLoading(echart_userarea_isfirst);
            } else if (category === 'userarea_nofirst') {
              echart_userarea_nofirst.setOption(option_bar);
              common.echart.hideLoading(echart_userarea_nofirst);
            }
          }
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3VzZXJfYXJlYS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiY29uZmlncGF0aHMiLCJkZWZpbmUiLCIkIiwic2VydmljZSIsInRvb2xzIiwiY29tbW9uIiwiUGFnaW5nIiwibWFwTmFtZSIsImFyZWFuYW1lIiwiZWNoYXJ0X3VzZXJhcmVhX21hcF9waWUiLCJlY2hhcnQiLCJpbml0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImVjaGFydF91c2VyYXJlYV9pc2ZpcnN0IiwiZWNoYXJ0X3VzZXJhcmVhX25vZmlyc3QiLCJlY2hhcnRfdXNlcmFyZWFfaXNmaXJzdF9jb3VudHkiLCJlY2hhcnRfdXNlcmFyZWFfbm9maXJzdF9jb3VudHkiLCJnZXRNYXAiLCJnZXRKU09OIiwibWFwSnNvbiIsInJlZ2lzdGVyTWFwIiwiYXJlYUNvdW50RmV0Y2hEYXRhIiwicHJlZml4IiwicmVzdWx0IiwidG90YWwiLCJlYWNoIiwiaW5kZXgiLCJpdGVtIiwiaHRtbCIsInJlbmRlciIsImFwcGVuZFRpcERvbSIsIm1hcEZldGNoRGF0YSIsIndoZW4iLCJ0aGVuIiwiZXh0cmEiLCJlbmNvZGVVUklDb21wb25lbnQiLCJoaWRlTG9hZGluZyIsImNvbnZlclBpZURhdGEiLCJkYXRhIiwibGVnZW5kRGF0YSIsInNlcmllc0RhdGEiLCJvdGhlciIsInB1c2giLCJuYW1lIiwidmFsdWUiLCJhcmVhRmV0Y2hEYXRhIiwidHlwZSIsImlzZmlyc3QiLCJ0aW1lIiwiZG9tSWQiLCJwYWdlTm8iLCJzaG93TG9hZGluZyIsImNvbnZlcnRTY2hvb2wxRGF0YSIsImNvbnZlcnRTY2hvb2wwRGF0YSIsInBhZ2VDb3VudCIsInBwIiwidGFyZ2V0IiwiZmlyc3RUcGwiLCJsYXN0VHBsIiwicGFnZXNpemUiLCJjb3VudCIsImNhbGxiYWNrIiwiY3VycmVudCIsImF0dHIiLCJjb252ZXJ0RGF0YSIsInhBeGlzRGF0YSIsIm9uIiwidHJpZ2dlciIsImNvbG9ycyIsInRpdGxlIiwidGVtcEluZGV4IiwidG9wIiwibGVmdCIsIngiLCJ5IiwiY3JlYXRlUGllRGF0YSIsImN1cnJlbnRQYWdlIiwic2Nob29sRmV0Y2hEYXRhIiwidG90YWxTaXplIiwiY3JlYXRlVGFibGUiLCJlbXB0eSIsImFwcGVuZCIsInJlbmRlclBhZ2UiLCJwYWdlSWQiLCJwIiwiY2xzIiwidiIsImNlbnRlciIsImNvbG9yIiwic2lsZW50IiwiY2xvY2t3aXNlIiwicmFkaXVzIiwiYXZvaWRMYWJlbE92ZXJsYXAiLCJsYWJlbExpbmUiLCJub3JtYWwiLCJzaG93IiwidG9GaXhlZCIsIml0ZW1TdHlsZSIsImxhYmVsIiwicG9zaXRpb24iLCJ0ZXh0U3R5bGUiLCJmb250U2l6ZSIsImNhdGVnb3J5Iiwib3B0aW9uX3VzZXJhcmVhX21hcCIsInRvb2x0aXAiLCJmb3JtYXR0ZXIiLCJwYXJhbSIsInZpc3VhbE1hcCIsInJpZ2h0IiwiYm90dG9tIiwidGV4dCIsImNhbGN1bGFibGUiLCJpdGVtV2lkdGgiLCJpdGVtSGVpZ2h0Iiwic2VyaWVzIiwibWFwVHlwZSIsInNlbGVjdGVkTW9kZSIsImVtcGhhc2lzIiwiZWNoYXJ0X3VzZXJhcmVhX21hcCIsInNldE9wdGlvbiIsIm9wdGlvbl91c2VyYXJlYV9tYXBfcGllIiwiYmFja2dyb3VuZENvbG9yIiwibGVnZW5kIiwib3JpZW50IiwiaXRlbUdhcCIsInNoYWRvd0JsdXIiLCJzaGFkb3dPZmZzZXRYIiwic2hhZG93Q29sb3IiLCJvcHRpb25fdXNlcmFyZWFfaXNmaXJzdF9jb3VudHkiLCJoaWRlVGV4dEJ5TGVuIiwicm9zZVR5cGUiLCJpIiwibGVuZ3RoIiwib3B0aW9uX3VzZXJhcmVhX25vZmlyc3RfY291bnR5Iiwib3B0aW9uX2JhciIsImF4aXNQb2ludGVyIiwiZ3JpZCIsImNvbnRhaW5MYWJlbCIsInhBeGlzIiwiYXhpc0xhYmVsIiwiYXhpc0xpbmUiLCJsaW5lU3R5bGUiLCJheGlzVGlj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aUJBSGI7QUFRRXVDLDBCQUFVO0FBQ1JDLDZCQUFXO0FBQ1RyRCwyQkFBTztBQURFO0FBREgsaUJBUlo7QUFhRXNELDBCQUFVO0FBQ1I7QUFEUTtBQWJaLGVBREssQ0FuQlE7QUFzQ2ZDLHFCQUFPLENBQ0w7QUFDRWpHLHNCQUFNLE9BRFI7QUFFRWtHLDJCQUFXO0FBQ1RILDZCQUFXO0FBQ1RyRCwyQkFBTztBQURFO0FBREYsaUJBRmI7QUFPRW9ELDBCQUFVO0FBQ1JDLDZCQUFXO0FBQ1RyRCwyQkFBTztBQURFO0FBREg7QUFQWixlQURLLENBdENRO0FBcURmMEIsc0JBQVEsQ0FDTjtBQUNFdkUsc0JBQU1BLElBRFI7QUFFRUcsc0JBQU0sS0FGUjtBQUdFbUcsMEJBQVUsRUFIWjtBQUlFM0csc0JBQU1BLEtBQUssWUFBTDtBQUpSLGVBRE07QUFyRE8sYUFBakI7QUE4REEsZ0JBQUlnRSxhQUFhLGtCQUFqQixFQUFxQztBQUNuQ3pGLHNDQUF3QjBHLFNBQXhCLENBQWtDZSxVQUFsQztBQUNBbEkscUJBQU9LLE1BQVAsQ0FBYzJCLFdBQWQsQ0FBMEJ2Qix1QkFBMUI7QUFDRCxhQUhELE1BR08sSUFBSXlGLGFBQWEsa0JBQWpCLEVBQXFDO0FBQzFDeEYsc0NBQXdCeUcsU0FBeEIsQ0FBa0NlLFVBQWxDO0FBQ0FsSSxxQkFBT0ssTUFBUCxDQUFjMkIsV0FBZCxDQUEwQnRCLHVCQUExQjtBQUNEO0FBQ0Y7QUFyTkg7QUF1TkQ7QUFFRixHQTdoQkg7QUE4aEJELENBbGlCRCIsImZpbGUiOiJjdXN0b21Nb2R1bGUvc3RhdGlzdGljcy9qcy91c2VyX2FyZWEtNDM1YWU4NGU1NC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ2N1c3RvbUNvbmYnOiAnc3RhdGlzdGljcy9qcy9jdXN0b21Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydjdXN0b21Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAnc2VydmljZScsICd0b29scycsICdjb21tb24nLCAncGFnaW5nJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgc2VydmljZSwgdG9vbHMsIGNvbW1vbiwgUGFnaW5nKSB7XHJcbiAgICAgIHZhciBtYXBOYW1lID0gKGNvbW1vbi5hcmVhbmFtZSA9PT0gJ+WMl+S6rOW4gicgPyAnYmVpamluZycgOiAnY2hvbmdxaW5nJyk7XHJcbiAgICAgLy8gdmFyIGVjaGFydF91c2VyYXJlYV9tYXAgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJhcmVhX21hcCcpKTtcclxuICAgICAgLy8g5Zyw5Zu+5LqL5Lu257uR5a6aXHJcbiAgICAgLyogZWNoYXJ0X3VzZXJhcmVhX21hcC5vbignY2xpY2snLCBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICBtYXBGZXRjaERhdGEocGFyYW1bJ25hbWUnXSk7XHJcbiAgICAgIH0pOyovXHJcbiAgICAgIHZhciBlY2hhcnRfdXNlcmFyZWFfbWFwX3BpZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcmFyZWFfbWFwX3BpZScpKTtcclxuICAgICAgdmFyIGVjaGFydF91c2VyYXJlYV9pc2ZpcnN0ID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyYXJlYV9pc2ZpcnN0JykpO1xyXG4gICAgICB2YXIgZWNoYXJ0X3VzZXJhcmVhX25vZmlyc3QgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJhcmVhX25vZmlyc3QnKSk7XHJcblxyXG4gICAgICAvLyDljLrljr/nrqHnkIblkZhcclxuICAgICAgdmFyIGVjaGFydF91c2VyYXJlYV9pc2ZpcnN0X2NvdW50eSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcmFyZWFfaXNmaXJzdF9jb3VudHknKSk7XHJcbiAgICAgIHZhciBlY2hhcnRfdXNlcmFyZWFfbm9maXJzdF9jb3VudHkgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJhcmVhX25vZmlyc3RfY291bnR5JykpO1xyXG5cclxuXHJcbiAgICAgIC8vIOiOt+WPluWcsOWbvlxyXG4gICAgICAvLyB0b2RvIOWcsOWbvnVybFxyXG4gICAgICBmdW5jdGlvbiBnZXRNYXAoKSB7XHJcbiAgICAgICAgcmV0dXJuICQuZ2V0SlNPTignLi4vLi4vLi4vLi4vbGliL2VjaGFydHMvbWFwcy8nICsgbWFwTmFtZSArICcuanNvbicsIGZ1bmN0aW9uIChtYXBKc29uKSB7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LnJlZ2lzdGVyTWFwKG1hcE5hbWUsIG1hcEpzb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIOiOt+WPluavj+S4quWMuueahOaAu+S6uuaVsFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gYXJlYUNvdW50RmV0Y2hEYXRhKCkge1xyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvcGxhdGZvcm0vYXJlYS9jb3VudCcsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHtcclxuICAgICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICQuZWFjaChyZXN1bHRbJ2RhdGEnXSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbCArPSBpdGVtWyd2YWx1ZSddO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICQoJyN0b3RhbF91c2VycycpLmh0bWwodG90YWwpO1xyXG4gICAgICAgICAgICAgIHJlbmRlcihyZXN1bHRbJ2RhdGEnXSwgJ3VzZXJhcmVhX21hcCcpO1xyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2RhdGEnXVsnbGVuZ3RoJ10gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbW1vbi5hcHBlbmRUaXBEb20oJ3VzZXJhcmVhX21hcF9waWUnLCAndGlwJyk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hcEZldGNoRGF0YShyZXN1bHRbJ2RhdGEnXVswXVsnbmFtZSddKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyDlnLDlm75qc29u6I635Y+W5oiQ5Yqf5ZCO6I635Y+W5Yy65Z+f5pWw5o2u77yM5riy5p+T5Zyw5Zu+5Zu+6KGoXHJcbiAgICAgICQud2hlbihnZXRNYXAoKSlcclxuICAgICAgICAudGhlbihhcmVhQ291bnRGZXRjaERhdGEpO1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiDojrflj5blubPlj7DnlKjmiLflnLDln5/liIbluINcclxuICAgICAgICogQHBhcmFtIGFyZWFuYW1lXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBtYXBGZXRjaERhdGEoYXJlYW5hbWUpIHtcclxuICAgICAgICB2YXIgZXh0cmEgPSAnP2Vycm9yRG9tSWQ9dXNlcmFyZWFfbWFwX3BpZSc7XHJcbiAgICAgICAgaWYgKGFyZWFuYW1lKSBleHRyYSA9ICc/YXJlYW5hbWU9JyArIGVuY29kZVVSSUNvbXBvbmVudChhcmVhbmFtZSkgKyAnJmVycm9yRG9tSWQ9dXNlcmFyZWFfbWFwX3BpZSc7XHJcbiAgICAgICAgZWNoYXJ0X3VzZXJhcmVhX21hcF9waWUgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJhcmVhX21hcF9waWUnKSk7XHJcbiAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfdXNlcmFyZWFfbWFwX3BpZSk7XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9wbGF0Zm9ybS9hcmVhL2Rpc3RyaWJ1dGUnICsgZXh0cmEsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHJlbmRlcihjb252ZXJQaWVEYXRhKHJlc3VsdFsnZGF0YSddLCBhcmVhbmFtZSksICd1c2VyYXJlYV9tYXBfcGllJyk7XHJcbiAgICAgICAgICAgICQoJyNjb3VudHknKS5odG1sKGFyZWFuYW1lKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBjb252ZXJQaWVEYXRhKGRhdGEsIGFyZWFuYW1lKSB7XHJcbiAgICAgICAgdmFyIGxlZ2VuZERhdGEgPSBbXSwgc2VyaWVzRGF0YSA9IFtdLCBvdGhlciA9IDA7XHJcbiAgICAgICAgJC5lYWNoKGRhdGEsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgaWYgKGluZGV4ID4gOSkgb3RoZXIgKz0gaXRlbVsndmFsdWUnXTtcclxuICAgICAgICAgIGVsc2UgbGVnZW5kRGF0YS5wdXNoKGl0ZW1bJ25hbWUnXSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGRhdGFbJ2xlbmd0aCddID4gMTApIHtcclxuICAgICAgICAgIGRhdGFbJ2xlbmd0aCddID0gMTA7XHJcbiAgICAgICAgICBsZWdlbmREYXRhLnB1c2goJ+WFtuWugycpO1xyXG4gICAgICAgICAgZGF0YS5wdXNoKHtuYW1lOiAn5YW25a6DJywgdmFsdWU6IG90aGVyfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGxlZ2VuZERhdGE6IGxlZ2VuZERhdGEsXHJcbiAgICAgICAgICBuYW1lOiBhcmVhbmFtZSxcclxuICAgICAgICAgIHNlcmllc0RhdGE6IGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5L2/55So5bmz5Y+w55qE55So5oi35Zyw5Z+f5YiG5biDXHJcbiAgICAgICAqIEBwYXJhbSDnu5/orqHnsbvlnovvvIhhcmVh77ya5Yy65Z+f5YiG5biD77yMdXNlcnR5cGU655So5oi357G75Z6L77ybc2Nob29sOuWtpuagoe+8iVxyXG4gICAgICAgKiBAcGFyYW0gaXNmaXJzdCDmmK/lkKbmmK/pppbmrKHnmbvpmYYoMTrpppbmrKHnmbvpmYbvvIwwOumdnummluasoeeZu+mZhilcclxuICAgICAgICogQHBhcmFtIHRpbWUg5pe26Ze05q61KHllc3RlcmRheTrmmKjlpKnvvIxsYXN0c2V2ZW7vvJrmnIDov5HkuIPlpKnvvIxsYXN0dGhpcnR577ya5pyA6L+R5LiJ5Y2B5aSpKVxyXG4gICAgICAgKiBAcGFyYW0gZG9tSWRcclxuICAgICAgICogQHBhcmFtIHBhZ2VObyDlvZPliY3pobXmlbBcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGFyZWFGZXRjaERhdGEodHlwZSwgaXNmaXJzdCwgdGltZSwgZG9tSWQsIHBhZ2VObykge1xyXG4gICAgICAgIHZhciBleHRyYSA9ICcmZXJyb3JEb21JZD0nICsgZG9tSWQ7XHJcbiAgICAgICAgaWYgKHBhZ2VObykgZXh0cmEgKz0gJyZwYWdlTm89JyArIHBhZ2VObztcclxuICAgICAgICBpZiAodHlwZSA9PT0gJ2FyZWEnKSB7XHJcbiAgICAgICAgICBpZiAoaXNmaXJzdCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VyYXJlYV9pc2ZpcnN0ID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyYXJlYV9pc2ZpcnN0JykpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF91c2VyYXJlYV9pc2ZpcnN0KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VyYXJlYV9ub2ZpcnN0ID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyYXJlYV9ub2ZpcnN0JykpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF91c2VyYXJlYV9ub2ZpcnN0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzY2hvb2wnKSB7XHJcbiAgICAgICAgICBpZiAoaXNmaXJzdCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VyYXJlYV9pc2ZpcnN0X2NvdW50eSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcmFyZWFfaXNmaXJzdF9jb3VudHknKSk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3VzZXJhcmVhX2lzZmlyc3RfY291bnR5KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VyYXJlYV9ub2ZpcnN0X2NvdW50eSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcmFyZWFfbm9maXJzdF9jb3VudHknKSk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3VzZXJhcmVhX25vZmlyc3RfY291bnR5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvcGxhdGZvcm0vJyArIHR5cGUgKyAnLycgKyBpc2ZpcnN0ICsgJy91c2VkP3RpbWU9JyArIHRpbWUgKyBleHRyYSxcclxuICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDIwMCkge1xyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2RhdGEnXVsnbGVuZ3RoJ10gPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbW1vbi5hcHBlbmRUaXBEb20oZG9tSWQsICd0aXAnKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdzY2hvb2wnKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2RhdGEnXVsnc2Nob29sJ11bJ3RvdGFsU2l6ZSddID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc2ZpcnN0ID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICQoJyN0b3RhbF9pc2ZpcnN0X3NjaG9vbCcpLmh0bWwocmVzdWx0WydkYXRhJ11bJ3RvdGFsJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVuZGVyKGNvbnZlcnRTY2hvb2wxRGF0YShyZXN1bHRbJ2RhdGEnXSksIGRvbUlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzZmlyc3QgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgJCgnI3RvdGFsX25vZmlyc3Rfc2Nob29sJykuaHRtbChyZXN1bHRbJ2RhdGEnXVsndG90YWwnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZW5kZXIoY29udmVydFNjaG9vbDBEYXRhKHJlc3VsdFsnZGF0YSddKSwgZG9tSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHBhZ2VDb3VudCA9IHJlc3VsdFsnZGF0YSddWydzY2hvb2wnXVsncGFnZUNvdW50J107XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAocGFnZUNvdW50ID4gMSAmJiAhcGFnZU5vKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwYWdlVG9vbF9jb3VudHknKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBwID0gbmV3IFBhZ2luZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcC5pbml0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICcjcGFnZVRvb2xfY291bnR5JywgZmlyc3RUcGw6IGZhbHNlLCBsYXN0VHBsOiBmYWxzZSwgcGFnZXNpemU6IDEwLCBwYWdlQ291bnQ6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHJlc3VsdFsnZGF0YSddWydzY2hvb2wnXVsndG90YWxTaXplJ10sIGNhbGxiYWNrOiBmdW5jdGlvbiAoY3VycmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYUZldGNoRGF0YSgkKCcudXNlckRpc3RyaWJ1dGlvbicpLmF0dHIoJ2RhdGEtdHlwZScpLCAkKCcudXNlckRpc3RyaWJ1dGlvbicpLmF0dHIoJ2RhdGEtZnVuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy51c2VyRGlzdHJpYnV0aW9uJykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcudXNlckRpc3RyaWJ1dGlvbicpLmF0dHIoJ2RhdGEtaWQnKSwgY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uLmFwcGVuZFRpcERvbShkb21JZCwgJ3RpcCcpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2FyZWEnICYmIHJlc3VsdFsnZGF0YSddWydsZW5ndGgnXSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgcmVuZGVyKGNvbnZlcnREYXRhKHJlc3VsdFsnZGF0YSddKSwgZG9tSWQpO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAkLmVhY2gocmVzdWx0WydkYXRhJ10sIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IGl0ZW1bJ3ZhbHVlJ107XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoaXNmaXJzdCA9PSAxKSAkKCcjdG90YWxfdXNlcnNfaXNmaXJzdCcpLmh0bWwodG90YWwpO1xyXG4gICAgICAgICAgICAgICAgICBlbHNlICQoJyN0b3RhbF91c2Vyc19ub2ZpcnN0JykuaHRtbCh0b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnREYXRhKGRhdGEpIHtcclxuICAgICAgICB2YXIgeEF4aXNEYXRhID0gW10sIHNlcmllc0RhdGEgPSBbXTtcclxuICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICB4QXhpc0RhdGEucHVzaChpdGVtWyduYW1lJ10pO1xyXG4gICAgICAgICAgc2VyaWVzRGF0YS5wdXNoKGl0ZW1bJ3ZhbHVlJ10pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB4QXhpc0RhdGE6IHhBeGlzRGF0YSxcclxuICAgICAgICAgIHNlcmllc0RhdGE6IHNlcmllc0RhdGFcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0Q2hhbmdlJywgJy5zZWxlY3RUb3AnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignZGF0YS1mdW4nKSlcclxuICAgICAgICAgIGFyZWFGZXRjaERhdGEoJCh0aGlzKS5hdHRyKCdkYXRhLXR5cGUnKSwgJCh0aGlzKS5hdHRyKCdkYXRhLWZ1bicpLFxyXG4gICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCh0aGlzKS5hdHRyKCdkYXRhLWlkJykpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnLnNlbGVjdFRvcCcpLnRyaWdnZXIoJ3NlbGVjdENoYW5nZScpO1xyXG5cclxuXHJcbiAgICAgIC8vIOWMuuWOv+euoeeQhuWRmOKAlOKAlOmmluasoeS9v+eUqOW5s+WPsOeahOeUqOaIt+WIhuW4g1xyXG4gICAgICBmdW5jdGlvbiBjb252ZXJ0U2Nob29sMURhdGEoZGF0YSkge1xyXG4gICAgICAgIHZhciBsZWdlbmREYXRhID0gW10sIHNlcmllc0RhdGEgPSBbXSwgb3RoZXIgPSAwO1xyXG4gICAgICAgIGRhdGEgPSBkYXRhWydzY2hvb2wnXVsnZGF0YUxpc3QnXTtcclxuICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPiA5KSBvdGhlciArPSBpdGVtWyd2YWx1ZSddO1xyXG4gICAgICAgICAgZWxzZSBsZWdlbmREYXRhLnB1c2goaXRlbVsnbmFtZSddKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoZGF0YVsnbGVuZ3RoJ10gPiAxMCkge1xyXG4gICAgICAgICAgZGF0YVsnbGVuZ3RoJ10gPSAxMDtcclxuICAgICAgICAgIGxlZ2VuZERhdGEucHVzaCgn5YW25a6DJyk7XHJcbiAgICAgICAgICBkYXRhLnB1c2goe25hbWU6ICflhbblroMnLCB2YWx1ZTogb3RoZXJ9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGxlZ2VuZERhdGE6IGxlZ2VuZERhdGEsXHJcbiAgICAgICAgICBzZXJpZXNEYXRhOiBkYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyDkvb/nlKjlubPlj7DnmoTnlKjmiLfliIbluIPmg4XlhrVcclxuICAgICAgdmFyIGNvbG9ycyA9IFsnI2ZmM2Y2NicsICcjZmI4YjFlJywgJyNmZGQ1MWQnLCAnIzUzYmI3NycsICcjMTRjN2UwJyxcclxuICAgICAgICAnI2I2NTNjZicsICcjM2Y4NmVhJywgJyNiZDY5ODInLCAnIzY0OTdjYicsICcjYzA4ODUxJ107XHJcblxyXG4gICAgICBmdW5jdGlvbiBjb252ZXJ0U2Nob29sMERhdGEoZGF0YSkge1xyXG4gICAgICAgIHZhciBzZXJpZXNEYXRhID0gW107XHJcbiAgICAgICAgLy8g5a2m5qCh5qCH6aKY55qE5bGV56S65ZKM5a6a5L2NXHJcbiAgICAgICAgdmFyIHRpdGxlID0gJCgnLnJvdzMtdXNlci1hcmVhLWNvdW50eSAudGl0bGUnKSwgaHRtbCA9ICcnO1xyXG4gICAgICAgIHZhciB0ZW1wSW5kZXggPSAwLCB0b3AgPSAyMjYsIGxlZnQgPSAwLCAvLyDmoIfpopjkvY3nva5cclxuICAgICAgICAgIHggPSAnMTAlJywgeSA9ICcyMCUnOyAvLyDlm77ooahjZW50ZXLkvY3nva5cclxuICAgICAgICAkLmVhY2goZGF0YVsnc2Nob29sJ11bJ2RhdGFMaXN0J10sIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgaWYgKHRlbXBJbmRleCA+IDQpIHtcclxuICAgICAgICAgICAgdG9wID0gNDA2O1xyXG4gICAgICAgICAgICB0ZW1wSW5kZXggPSAwO1xyXG4gICAgICAgICAgICB5ID0gJzcwJSc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4ID0gdGVtcEluZGV4ICsgdGVtcEluZGV4ICsgMSArICcwJSc7XHJcbiAgICAgICAgICBzZXJpZXNEYXRhLnB1c2goY3JlYXRlUGllRGF0YShpdGVtWyd2YWx1ZSddLCBkYXRhWyd0b3RhbCddLCBbeCwgeV0sIGNvbG9yc1tpbmRleF0pKTtcclxuICAgICAgICAgIGxlZnQgPSAwICsgKCh0ZW1wSW5kZXgpICogMTk4KTtcclxuICAgICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJ0aXRsZS1pdGVtXCIgc3R5bGU9XCJ0b3A6ICcgKyB0b3AgKyAncHg7IGxlZnQ6ICcgKyBsZWZ0ICsgJ3B4O1wiPicgKyBpdGVtWyduYW1lJ10gKyAnPC9kaXY+JztcclxuICAgICAgICAgIHRlbXBJbmRleCsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRpdGxlLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgcmV0dXJuIHtzZXJpZXNEYXRhOiBzZXJpZXNEYXRhfVxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgLy8g5Yy65Y6/566h55CG5ZGYXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5ZCE5qCh55So5oi35oC76YeP57uf6K6hXHJcbiAgICAgICAqIEBwYXJhbSBwYWdlTm9cclxuICAgICAgICovXHJcbiAgICAgIHZhciBjdXJyZW50UGFnZSA9IDE7XHJcblxyXG4gICAgICBmdW5jdGlvbiBzY2hvb2xGZXRjaERhdGEocGFnZU5vKSB7XHJcbiAgICAgICAgdmFyIGV4dHJhID0gJyc7XHJcbiAgICAgICAgaWYgKHBhZ2VObykgZXh0cmEgPSAnJnBhZ2VObz0nICsgcGFnZU5vO1xyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvcGxhdGZvcm0vc2Nob29sL3Jhbmtpbmc/ZXJyb3JEb21JZD10YWJsZV9jb3VudHknICsgZXh0cmEsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHtcclxuICAgICAgICAgICAgICB2YXIgdG90YWxTaXplID0gcmVzdWx0WydkYXRhJ11bJ3RvdGFsU2l6ZSddO1xyXG4gICAgICAgICAgICAgIGlmICh0b3RhbFNpemUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVUYWJsZShyZXN1bHRbJ2RhdGEnXVsnZGF0YUxpc3QnXSwgJ3RhYmxlX3VzZXJhcmVhX2NvdW50eScsIHBhZ2VObyk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0b3RhbFNpemUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgJCgnI3RhYmxlX3VzZXJhcmVhX2NvdW50eScpLmVtcHR5KCkuYXBwZW5kKCc8ZGl2IGlkPVwiZW1wdHlfaW5mb1wiPjxkaXY+PHA+5rKh5pyJ55u45YWz5YaF5a65PC9wPjwvZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAocmVzdWx0LmRhdGEucGFnZUNvdW50ID4gMSAmJiBjdXJyZW50UGFnZSA9PT0gMSkgcmVuZGVyUGFnZSgncGFnZVRvb2wnLCB0b3RhbFNpemUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyUGFnZShwYWdlSWQsIHRvdGFsKSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2UrKztcclxuICAgICAgICAkKCcjJyArIHBhZ2VJZCkuaHRtbCgnJyk7XHJcbiAgICAgICAgdmFyIHAgPSBuZXcgUGFnaW5nKCk7XHJcbiAgICAgICAgcC5pbml0KHtcclxuICAgICAgICAgIHRhcmdldDogJyMnICsgcGFnZUlkLCBwYWdlc2l6ZTogMTAsIHBhZ2VDb3VudDogMSxcclxuICAgICAgICAgIGNvdW50OiB0b3RhbCwgY2FsbGJhY2s6IGZ1bmN0aW9uIChjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIHNjaG9vbEZldGNoRGF0YShjdXJyZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2Nob29sRmV0Y2hEYXRhKCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBjcmVhdGVUYWJsZShkYXRhLCBkb21JZCwgcGFnZU5vKSB7XHJcbiAgICAgICAgcGFnZU5vID0gcGFnZU5vIHx8IDE7XHJcbiAgICAgICAgdmFyIGh0bWwgPSAnJywgdG90YWwgPSAwO1xyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgIHRvdGFsICs9IGl0ZW1bJ3ZhbHVlJ107XHJcbiAgICAgICAgICB2YXIgY2xzID0gJ251bSAnO1xyXG4gICAgICAgICAgaWYgKHBhZ2VObyA9PSAxICYmIGluZGV4IDwgMykgY2xzICs9ICdudW0nICsgKGluZGV4ICsgMSk7XHJcbiAgICAgICAgICBodG1sICs9ICc8dHI+JyArXHJcbiAgICAgICAgICAgICc8dGQ+PHNwYW4gY2xhc3M9XCInICsgY2xzICsgJ1wiPicgKyAoaW5kZXggKyAxICsgKChwYWdlTm8gLSAxKSAqIDEwKSkgKyAnPC9zcGFuPjxhIHRpdGxlPVwiJyArIGl0ZW1bJ25hbWUnXSArICdcIj4nICsgaXRlbVsnbmFtZSddICsgJzwvYT48L3RkPicgK1xyXG4gICAgICAgICAgICAnPHRkIGNsYXNzPVwibWFya1wiPicgKyBpdGVtWyd2YWx1ZSddICsgJzwvdGQ+JyArXHJcbiAgICAgICAgICAgICc8L3RyPic7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCgnI3RvdGFsX3VzZXJzX2NvdW50eScpLmh0bWwodG90YWwpO1xyXG4gICAgICAgICQoJyMnICsgZG9tSWQpLmh0bWwoaHRtbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVBpZURhdGEodiwgdG90YWwsIGNlbnRlciwgY29sb3IpIHtcclxuICAgICAgICBpZiAodG90YWwgPT0gMCkge1xyXG4gICAgICAgICAgdiA9IDA7XHJcbiAgICAgICAgICB0b3RhbCA9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBzaWxlbnQ6IHRydWUsXHJcbiAgICAgICAgICBjbG9ja3dpc2U6IGZhbHNlLFxyXG4gICAgICAgICAgdHlwZTogJ3BpZScsXHJcbiAgICAgICAgICByYWRpdXM6IFs0NSwgNTVdLFxyXG4gICAgICAgICAgYXZvaWRMYWJlbE92ZXJsYXA6IGZhbHNlLFxyXG4gICAgICAgICAgY2VudGVyOiBjZW50ZXIsXHJcbiAgICAgICAgICBsYWJlbExpbmU6IHtcclxuICAgICAgICAgICAgbm9ybWFsOiB7XHJcbiAgICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRhdGE6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiB2LCBuYW1lOiAodiAqIDEwMCAvIHRvdGFsKS50b0ZpeGVkKDEpICsgJyUnLFxyXG4gICAgICAgICAgICAgIGl0ZW1TdHlsZToge25vcm1hbDoge2NvbG9yOiBjb2xvcn19LFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAyNFxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6ICh0b3RhbCAtIHYpLCBuYW1lOiAnb3RoZXInLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGl0ZW1TdHlsZToge25vcm1hbDoge2NvbG9yOiAnIzJiNDE3OCd9fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiByZW5kZXIoZGF0YSwgY2F0ZWdvcnkpIHtcclxuICAgICAgICBzd2l0Y2ggKGNhdGVnb3J5KSB7XHJcbiAgICAgICAgICBjYXNlICd1c2VyYXJlYV9tYXAnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fdXNlcmFyZWFfbWFwID0ge1xyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbVsnbmFtZSddICsgJyA6ICcgKyAocGFyYW1bJ3ZhbHVlJ10gfHwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB2aXN1YWxNYXA6IHtcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnNSUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMCcsXHJcbiAgICAgICAgICAgICAgICB0ZXh0OiBbJ+mrmCcsICfkvY4nXSxcclxuICAgICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpdGVtV2lkdGg6IDE2LFxyXG4gICAgICAgICAgICAgICAgaXRlbUhlaWdodDogMTAwLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiAn5YyX5LqsJyxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ21hcCcsXHJcbiAgICAgICAgICAgICAgICAgIG1hcFR5cGU6IG1hcE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGVkTW9kZTogJ3NpbmdsZScsXHJcbiAgICAgICAgICAgICAgICAgIGxlZnQ6ICcxNSUnLFxyXG4gICAgICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZW1waGFzaXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VyYXJlYV9tYXAuc2V0T3B0aW9uKG9wdGlvbl91c2VyYXJlYV9tYXApO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF91c2VyYXJlYV9tYXApO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3VzZXJhcmVhX21hcF9waWUnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fdXNlcmFyZWFfbWFwX3BpZSA9IHtcclxuICAgICAgICAgICAgICBjb2xvcjogWycjZDAxNzRmJywgJyMzMTZlYzUnLCAnIzNmODZlYScsICcjMTRjN2UwJywgJyM1M2JiNzcnLCAnI2ZkZDUxZCcsICcjZmQ4YzFkJywgJyNmZjNmNjYnLCAnI2I2NTNjZiddLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJycsXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifSA6IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBvcmllbnQ6ICdob3Jpem9udGFsJyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMCcsXHJcbiAgICAgICAgICAgICAgICBpdGVtR2FwOiAyMCxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge2NvbG9yOiAnI2U3ZTdlNycsIGZvbnRTaXplOiAxNH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydsZWdlbmREYXRhJ11cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhWyduYW1lJ10sXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6ICc1NSUnLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXI6IFsnNTAlJywgJzQwJSddLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydzZXJpZXNEYXRhJ10sXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VyYXJlYV9tYXBfcGllLnNldE9wdGlvbihvcHRpb25fdXNlcmFyZWFfbWFwX3BpZSk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3VzZXJhcmVhX21hcF9waWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3VzZXJhcmVhX2lzZmlyc3RfY291bnR5Jzoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uX3VzZXJhcmVhX2lzZmlyc3RfY291bnR5ID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyNkNzQyM2QnLCAnIzUzYmI3NycsICcjZjE5ZDMyJywgJyMxNGM3ZTAnLCAnI2NmNTM5ZicsICcjM2Y4NmVhJ10sXHJcbiAgICAgICAgICAgICAgdGl0bGU6IHt9LFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogXCJ7Yn0gPGJyLz4ge2N9ICh7ZH0lKVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBjYWxjdWxhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDogW3tcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogJzIlJyxcclxuICAgICAgICAgICAgICAgIGl0ZW1HYXA6IDEwLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydsZWdlbmREYXRhJ10sXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0b29scy5oaWRlVGV4dEJ5TGVuKG5hbWUsIDE0KTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IHRydWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogJ+mmluasoeS9v+eUqOW5s+WPsOeahOeUqOaIt+WIhuW4gycsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXI6IFsnNTAlJywgJzM1JSddLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFswLCAxMDBdLFxyXG4gICAgICAgICAgICAgICAgICByb3NlVHlwZTogJ2FyZWEnLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydzZXJpZXNEYXRhJ11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YVsnc2VyaWVzRGF0YSddLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgb3B0aW9uX3VzZXJhcmVhX2lzZmlyc3RfY291bnR5LnNlcmllc1swXS5kYXRhW2ldLmxhYmVsID0ge307XHJcbiAgICAgICAgICAgICAgb3B0aW9uX3VzZXJhcmVhX2lzZmlyc3RfY291bnR5LnNlcmllc1swXS5kYXRhW2ldLmxhYmVsLm5vcm1hbCA9IHt9O1xyXG4gICAgICAgICAgICAgIG9wdGlvbl91c2VyYXJlYV9pc2ZpcnN0X2NvdW50eS5zZXJpZXNbMF0uZGF0YVtpXS5sYWJlbC5ub3JtYWwuZm9ybWF0dGVyID0gdG9vbHMuaGlkZVRleHRCeUxlbihkYXRhWydzZXJpZXNEYXRhJ11baV0ubmFtZSwgMjApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VyYXJlYV9pc2ZpcnN0X2NvdW50eS5zZXRPcHRpb24ob3B0aW9uX3VzZXJhcmVhX2lzZmlyc3RfY291bnR5KTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfdXNlcmFyZWFfaXNmaXJzdF9jb3VudHkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3VzZXJhcmVhX25vZmlyc3RfY291bnR5Jzoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uX3VzZXJhcmVhX25vZmlyc3RfY291bnR5ID0ge1xyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJycsXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2F9IDxici8+e2J9OiB7Y30gKHtkfSUpXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNlcmllczogZGF0YVsnc2VyaWVzRGF0YSddXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVjaGFydF91c2VyYXJlYV9ub2ZpcnN0X2NvdW50eS5zZXRPcHRpb24ob3B0aW9uX3VzZXJhcmVhX25vZmlyc3RfY291bnR5KTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfdXNlcmFyZWFfbm9maXJzdF9jb3VudHkpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgdmFyIGNvbG9yID0gJyMyOWM5ODMnLFxyXG4gICAgICAgICAgICAgIG5hbWUgPSAn5bmz5Y+w55So5oi3JztcclxuICAgICAgICAgICAgaWYgKGNhdGVnb3J5ID09PSAndXNlcmFyZWFfaXNmaXJzdCcpIHtcclxuICAgICAgICAgICAgICBjb2xvciA9ICcjMDBiZmZmJztcclxuICAgICAgICAgICAgICBuYW1lID0gJ+mmluasoeS9v+eUqOW5s+WPsOeUqOaItyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG9wdGlvbl9iYXIgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFtjb2xvcl0sXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgICBheGlzUG9pbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnc2hhZG93J1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMjAnLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzEwJyxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnNCUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWyd4QXhpc0RhdGEnXSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsaWduV2l0aExhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHlBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgIHNwbGl0TGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgICAgICAgYmFyV2lkdGg6IDMwLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydzZXJpZXNEYXRhJ11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ3VzZXJhcmVhX2lzZmlyc3QnKSB7XHJcbiAgICAgICAgICAgICAgZWNoYXJ0X3VzZXJhcmVhX2lzZmlyc3Quc2V0T3B0aW9uKG9wdGlvbl9iYXIpO1xyXG4gICAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3VzZXJhcmVhX2lzZmlyc3QpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNhdGVnb3J5ID09PSAndXNlcmFyZWFfbm9maXJzdCcpIHtcclxuICAgICAgICAgICAgICBlY2hhcnRfdXNlcmFyZWFfbm9maXJzdC5zZXRPcHRpb24ob3B0aW9uX2Jhcik7XHJcbiAgICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfdXNlcmFyZWFfbm9maXJzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxufSkiXX0=
