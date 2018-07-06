require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'common','dataResource/appEchartData.js'],
    function ($, service, common,appEchartData) {
      var role = common.role;
      var echart_app_traffic = common.echart.init(document.getElementById('app_traffic'));
      var echart_app_traffic10 = common.echart.init(document.getElementById('app_traffic10'));
      var echart_app_traffic10_pie = common.echart.init(document.getElementById('app_traffic10_pie'));
      var echart_app_use = common.echart.init(document.getElementById('app_use'));

      // 日期默认值
      $('#date_start_traffic, #date_start_traffic10, #date_start_use').val(laydate.now(-8));
      $('#date_end_traffic, #date_end_traffic10, #date_end_use').val(laydate.now(-1));

      /**
       * 获取应用名称数据
       * @returns {*}
       */
      function appFetchData() {
        var result = appEchartData.myappData;
        /*return $.getJSON(service.prefix + '/application/myapp', function (result) {*/
          if (result['code'] == 200) {
            var html = '';
            result['data'].unshift({id: 'all', name: '全部'});
            $.each(result['data'], function (index, item) {
              html += '<li data-value="' + item['id'] + '">' + item['name'] + '</li>';
            });
            var firstItem = result['data'][0];
            $('#select_app_name')
              .attr('data-value', firstItem['id'])
              .find('span').html(firstItem['name'])
              .parents('.selectWrap').find('ol').html(html);
          }
        /*});*/
      }

      /**
       * @description 获取区域数据
       * @returns {*}
       */
      function areaFetchData() {
        var result = appEchartData.areaSchoolArea;
        //return $.getJSON(service.prefix + '/organization/area/school', function (result) {
          if (result['code'] == 200) {
            var html = '';
            result['data'].unshift({id: 'all', name: '全部'});
            $.each(result['data'], function (index, item) {
              html += '<li data-value="' + item['id'] + '">' + item['name'] + '</li>';
            });
            var firstItem = result['data'][0];
            $('#select_area')
              .attr('data-value', firstItem['id'])
              .find('span').html(firstItem['name'])
              .parents('.selectWrap').find('ol').html(html);
          }
        //});
      }

      /**
       * @description 平台应用访问量统计
       * @param appid 应用id
       * @param starttime
       * @param endtime
       * @param areaId 区域id或学校id(如果为全部,此值为all)
       */
      function appTrafficFetchData(appid, starttime, endtime, areaId) {
        var extra = '?errorDomId=app_traffic';
        if (areaId) extra = '?id=' + areaId + '&errorDomId=app_traffic';
        echart_app_traffic = common.echart.init(document.getElementById('app_traffic'));
        common.echart.showLoading(echart_app_traffic);
        var result = appEchartData.appVisitData;
        /*var url = service.prefix + '/application/' + appid + '/'
          + starttime + '/' + endtime + '/visit' + extra;
        $.getJSON(url, function (result) {*/
          if (result['code'] == 200) render(converData(result['data']), 'app_traffic')
        //});
      }

      function converData(data) {
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

      $('body').on('click', '#btn_app_traffic', function () {
        var date_start = $('#date_start_traffic').val(), date_end = $('#date_end_traffic').val(),
          area = $('#select_area').attr('data-value');
        if (role === 'school') area = '';
        if (common.isLess30Day(date_start, date_end))
          appTrafficFetchData($('#select_app_name').attr('data-value'), date_start, date_end, area);
        else $.alert('时间间隔不得超过30天');
      });
      $.when(appFetchData(), areaFetchData())
        .done(function () {
          $('#btn_app_traffic').trigger('click');
        });

      /**
       * @description 平台应用访问量排行top10
       * @param starttime
       * @param endtime
       */
      function appTraffic10FetchData(starttime, endtime) {
        common.removeTipDom('app_traffic10_wrap');
        echart_app_traffic10 = common.echart.init(document.getElementById('app_traffic10'));
        echart_app_traffic10_pie = common.echart.init(document.getElementById('app_traffic10_pie'));
        common.echart.showLoading(echart_app_traffic10);
        common.echart.showLoading(echart_app_traffic10_pie);
        var result = appEchartData.appRankingData;
        /*$.getJSON(service.prefix + '/application/' + starttime + '/' + endtime + '/ranking?errorDomId=app_traffic10_wrap',
          function (result) {*/
            if (result['code'] == 200) {
              if (result['data']['application']['length'] == 0) common.appendTipDom('app_traffic10_wrap', 'tip');
              if (result['data']['application']['length'] != 0) {
                render(convert10Data(result['data']), 'app_traffic10');
              }
            }
         // });
      }

      var usertypeObj = {
        edumanager: '教育局管理者',
        eduemploye: '教育局职工',
        schmanager: '学校管理者',
        parent: '家长',
        schemploye: '学校职工',
        teacher: '教师',
        student: '学生'
      };

      if (role === 'school') {
        delete usertypeObj.edumanager;
        delete usertypeObj.eduemploye;
      }

      function convert10Data(data) {
        var yAxisData = [], seriesDataBar = [], seriesData = [];
        $.each(data['application'].reverse(), function (index, item) {
          yAxisData.push(item['name']);
          seriesDataBar.push(item['value']);
        });
        $.each(data['userrole'], function (key, value) {
          if (usertypeObj[key]) seriesData.push({name: usertypeObj[key], value: value});
        });
        return {
          'application': {
            yAxisData: yAxisData,
            seriesData: seriesDataBar
          },
          'usertype': {
            seriesData: seriesData
          }
        }
      }

      $('body').on('click', '#btn_app_traffic10', function () {
        var date_start = $('#date_start_traffic10').val(), date_end = $('#date_end_traffic10').val();
        if (common.isLess30Day(date_start, date_end)) appTraffic10FetchData(date_start, date_end);
        else $.alert('时间间隔不得超过30天');
      });
      $('#btn_app_traffic10').trigger('click');

      /**
       * @description 平台应用使用情况统计
       * @param type 排序字段（person:按使用人数排名，count:按使用数量排名）
       * @param starttime
       * @param endtime
       */
      function appUseFetchData(type, starttime, endtime) {
        echart_app_use = common.echart.init(document.getElementById('app_use'));
        common.echart.showLoading(echart_app_use);
        var result = appEchartData.appUsedData;
        /*$.getJSON(service.prefix + '/application/' + type + '/' + starttime + '/' + endtime + '/used?errorDomId=app_use')
          .success(function (result) {*/
            if (result['code'] == 200) render(convertUseData(result['data']), 'app_use', type)
         // });
      }

      function convertUseData(data) {
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

      $('body').on('click', '#btn_app_use', function (result) {
        var type = $('#tab_app_use').attr('data-value');
        var date_start = $('#date_start_use').val(), date_end = $('#date_end_use').val();
        if (common.isLess30Day(date_start, date_end)) appUseFetchData(type, date_start, date_end);
        else $.alert('时间间隔不得超过30天');
      });
      $('#btn_app_use').trigger('click');


      $('body').on('tabChange', '.tab', function () {
        appUseFetchData($(this).attr('data-value'), $('#date_start_use').val(), $('#date_end_use').val());
      });
      // tab 切换
      $('body').on('click', '.tab1 .ulli', function () {
        if ($(this).attr('class').indexOf('liAct') >= 0) return false;
        var date_start = $('#date_start_use').val(), date_end = $('#date_end_use').val();
        if (!common.isLess30Day(date_start, date_end)) {
          $.alert('时间间隔不得超过30天');
        } else {
          $(this).siblings().removeClass('liAct');
          $(this).addClass('liAct');
          appUseFetchData($(this).attr('data-value'), date_start, date_end);
        }
      });

      function render(data, category, type) {
        switch (category) {
          case 'app_traffic': {
            var option_app_traffic = {
              color: ['#00beff'],
              tooltip: {
                trigger: 'axis'
              },
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              grid: {
                top: '13%',
                left: '0%',
                right: '0%',
                bottom: '5%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: true,
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
              series: {
                name: '访问量',
                type: 'line',
                data: data['seriesData']
              }
            };
            echart_app_traffic.setOption(option_app_traffic);
            common.echart.hideLoading(echart_app_traffic);
            break;
          }
          case 'app_traffic10': {
            var option_app_traffic10 = {
              color: ['#29c983'],
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
                top: '5%',
                left: '3%',
                right: '10%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
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
              yAxis: [
                {
                  type: 'category',
                  data: data['application']['yAxisData'],
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
                }
              ],
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  textStyle: {
                    color: '#29c983'
                  }
                }
              },
              series: [
                {
                  name: '访问量',
                  type: 'bar',
                  barWidth: 20,
                  data: data['application']['seriesData']
                }
              ]
            };
            echart_app_traffic10.setOption(option_app_traffic10);
            common.echart.hideLoading(echart_app_traffic10);
            var option_app_traffic10_pie = {
              color: ['#ff3f66', '#b653d1', '#3f86ea', '#14c7e0', '#53bb77', '#fdd51d', '#fd8c1d', '#ff3f66', '#b653cf'],
              title: {
                text: '使用应用的用户类型统计',
                x: '45%',
                y: '90%',
                textStyle: {
                  color: '#b8d1ef',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: [
                {
                  name: '',
                  center: ['55%', '50%'],
                  radius: ['0', '60%'],
                  type: 'pie',
                  data: data['usertype']['seriesData']
                }
              ]
            };
            echart_app_traffic10_pie.setOption(option_app_traffic10_pie);
            common.echart.hideLoading(echart_app_traffic10_pie);
            break;
          }
          case 'app_use': {
            var option_app_use = {
              color: ['#00bfff'],
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
                left: '0%',
                right: '0%',
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
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#00bfff'
                  }
                }
              },
              series: [
                {
                  name: type === 'person' ? '使用人数' : '使用次数',
                  type: 'bar',
                  barWidth: 30,
                  data: data['seriesData']
                }
              ]
            };
            echart_app_use.setOption(option_app_use);
            common.echart.hideLoading(echart_app_use);
            break;
          }
          default: {
          }
        }
      }

      // 日期处理
      var date_start_traffic = {
          elem: '#date_start_traffic',
          max: laydate.now(-2),
          isclear: false,
          istoday: false,
          choose: function (datas) {
            date_end_traffic.min = datas;
          }
        },
        date_start_traffic10 = $.extend({}, date_start_traffic, {
          elem: '#date_start_traffic10', choose: function (datas) {
            date_end_traffic10.min = datas;
          }
        }),
        date_start_use = $.extend({}, date_start_traffic, {
          elem: '#date_start_use', choose: function (datas) {
            date_end_use.min = datas;
          }
        });

      var date_end_traffic = {
          elem: '#date_end_traffic',
          min: laydate.now(-7),
          max: laydate.now(-1),
          isclear: false,
          istoday: false,
          choose: function (datas) {
            date_start_traffic.max = datas;
          }
        },
        date_end_traffic10 = $.extend({}, date_end_traffic, {
          elem: '#date_end_traffic10', choose: function (datas) {
            date_start_traffic10.max = datas;
          }
        }),
        date_end_use = $.extend({}, date_end_traffic, {
          elem: '#date_end_use', choose: function (datas) {
            date_start_use.max = datas;
          }
        });
      $('body').on('click', '.laydate-icon', function () {
        var obj = eval('(' + this.id + ')');
        laydate(obj);
      });
    });
})