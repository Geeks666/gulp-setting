require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'tools', 'common', 'paging'],
    function ($, service, tools, common, Paging) {
      var mapName = (common.areaname === '北京市' ? 'beijing' : 'chongqing');
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
        $.getJSON(service.prefix + '/platform/area/count',
          function (result) {
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
      $.when(getMap())
        .then(areaCountFetchData);

      /**
       * @description 获取平台用户地域分布
       * @param areaname
       */
      function mapFetchData(areaname) {
        var extra = '?errorDomId=userarea_map_pie';
        if (areaname) extra = '?areaname=' + encodeURIComponent(areaname) + '&errorDomId=userarea_map_pie';
        echart_userarea_map_pie = common.echart.init(document.getElementById('userarea_map_pie'));
        common.echart.hideLoading(echart_userarea_map_pie);
        $.getJSON(service.prefix + '/platform/area/distribute' + extra,
          function (result) {
            if (result['code'] == 200) render(converPieData(result['data'], areaname), 'userarea_map_pie');
            $('#county').html(areaname);
          });
      }

      function converPieData(data, areaname) {
        var legendData = [], seriesData = [], other = 0;
        $.each(data, function (index, item) {
          if (index > 9) other += item['value'];
          else legendData.push(item['name']);
        });
        if (data['length'] > 10) {
          data['length'] = 10;
          legendData.push('其它');
          data.push({name: '其它', value: other})
        }
        return {
          legendData: legendData,
          name: areaname,
          seriesData: data
        }
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
        return $.getJSON(service.prefix + '/platform/' + type + '/' + isfirst + '/used?time=' + time + extra,
          function (result) {
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
                          count: result['data']['school']['totalSize'], callback: function (current) {
                            areaFetchData($('.userDistribution').attr('data-type'), $('.userDistribution').attr('data-fun'),
                              $('.userDistribution').attr('data-value'), $('.userDistribution').attr('data-id'), current);
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
                  if (isfirst == 1) $('#total_users_isfirst').html(total);
                  else $('#total_users_nofirst').html(total);
                }
              }

            }
          });
      }

      function convertData(data) {
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

      $('body').on('selectChange', '.selectTop', function () {
        if ($(this).attr('data-fun'))
          areaFetchData($(this).attr('data-type'), $(this).attr('data-fun'),
            $(this).attr('data-value'), $(this).attr('data-id'));
      });
      $('.selectTop').trigger('selectChange');


      // 区县管理员——首次使用平台的用户分布
      function convertSchool1Data(data) {
        var legendData = [], seriesData = [], other = 0;
        data = data['school']['dataList'];
        $.each(data, function (index, item) {
          if (index > 9) other += item['value'];
          else legendData.push(item['name']);
        });
        if (data['length'] > 10) {
          data['length'] = 10;
          legendData.push('其它');
          data.push({name: '其它', value: other});
        }
        return {
          legendData: legendData,
          seriesData: data
        }
      }

      // 使用平台的用户分布情况
      var colors = ['#ff3f66', '#fb8b1e', '#fdd51d', '#53bb77', '#14c7e0',
        '#b653cf', '#3f86ea', '#bd6982', '#6497cb', '#c08851'];

      function convertSchool0Data(data) {
        var seriesData = [];
        // 学校标题的展示和定位
        var title = $('.row3-user-area-county .title'), html = '';
        var tempIndex = 0, top = 226, left = 0, // 标题位置
          x = '10%', y = '20%'; // 图表center位置
        $.each(data['school']['dataList'], function (index, item) {
          if (tempIndex > 4) {
            top = 406;
            tempIndex = 0;
            y = '70%';
          }
          x = tempIndex + tempIndex + 1 + '0%';
          seriesData.push(createPieData(item['value'], data['total'], [x, y], colors[index]));
          left = 0 + ((tempIndex) * 198);
          html += '<div class="title-item" style="top: ' + top + 'px; left: ' + left + 'px;">' + item['name'] + '</div>';
          tempIndex++;
        });
        title.html(html);
        return {seriesData: seriesData}
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
        $.getJSON(service.prefix + '/platform/school/ranking?errorDomId=table_county' + extra,
          function (result) {
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
          count: total, callback: function (current) {
            schoolFetchData(current);
          }
        });
      }

      schoolFetchData();

      function createTable(data, domId, pageNo) {
        pageNo = pageNo || 1;
        var html = '', total = 0;
        $.each(data, function (index, item) {
          total += item['value'];
          var cls = 'num ';
          if (pageNo == 1 && index < 3) cls += 'num' + (index + 1);
          html += '<tr>' +
            '<td><span class="' + cls + '">' + (index + 1 + ((pageNo - 1) * 10)) + '</span><a title="' + item['name'] + '">' + item['name'] + '</a></td>' +
            '<td class="mark">' + item['value'] + '</td>' +
            '</tr>';
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
          data: [
            {
              value: v, name: (v * 100 / total).toFixed(1) + '%',
              itemStyle: {normal: {color: color}},
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
              value: (total - v), name: 'other',
              label: {
                normal: {
                  show: false
                }
              },
              itemStyle: {normal: {color: '#2b4178'}}
            }
          ]
        }
      }

      function render(data, category) {
        switch (category) {
          case 'userarea_map': {
            var option_userarea_map = {
              tooltip: {
                trigger: 'item',
                formatter: function (param) {
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
              series: [
                {
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
                }
              ]
            };
            echart_userarea_map.setOption(option_userarea_map);
            common.echart.hideLoading(echart_userarea_map);
            break;
          }
          case 'userarea_map_pie': {
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
                textStyle: {color: '#e7e7e7', fontSize: 14},
                data: data['legendData']
              },
              series: [
                {
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
                }
              ]
            };
            echart_userarea_map_pie.setOption(option_userarea_map_pie);
            common.echart.hideLoading(echart_userarea_map_pie);
            break;
          }
          case 'userarea_isfirst_county': {
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
                formatter: function (name) {
                  return tools.hideTextByLen(name, 14);
                },
                tooltip: {
                  show: true
                }
              }],
              series: [
                {
                  name: '首次使用平台的用户分布',
                  type: 'pie',
                  center: ['50%', '35%'],
                  radius: [0, 100],
                  roseType: 'area',
                  data: data['seriesData']
                }
              ]
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
          case 'userarea_nofirst_county': {
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
          default: {
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
                  name: name,
                  type: 'bar',
                  barWidth: 30,
                  data: data['seriesData']
                }
              ]
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
})