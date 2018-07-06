require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  define('',['jquery', 'service', 'tools', 'common'],
    function ($, service, tools, common) {
      var role = common.role;
      $(document).ready(function () {
        getSpaceQuantity('false');
      });
      //个人空间使用情况统计 按地域分布
      var echart_space_personal = common.echart.init(document.getElementById('space_personal_region'));
      //个人空间使用情况统计 按用户类型
      var space_personal_user_open = common.echart.init(document.getElementById('space_personal_user_open'));
      var space_personal_user_use = common.echart.init(document.getElementById('space_personal_user_use'));
      var space_personal_user_visit = common.echart.init(document.getElementById('space_personal_user_visit'));
      //个人空间使用情况趋势分析
      var echart_space_personal_trend = common.echart.init(document.getElementById('space_personal_trend'));
      //群组空间使用情况统计 数量统计
      var echart_space_group = common.echart.init(document.getElementById('group_num_count'));
      //群组空间使用情况统计 占比分析
      var space_group_user_open = common.echart.init(document.getElementById('space_group_user_open'));
      var space_group_user_visit = common.echart.init(document.getElementById('space_group_user_visit'));
      //群组空间使用情况趋势分析
      var echart_space_group_trend = common.echart.init(document.getElementById('space_group_trend'));

      // errorDomID
      var space_personal_region = 'space_personal_region';
      var space_personal_use = 'space_personal_use';
      var group_num_count = 'space_personal_use';
      var group_ratio_analysis = 'group_ratio_analysis';
      var space_personal_trend = 'space_personal_trend';
      var space_group_trend = 'space_group_trend';
      var get_space_count = 'get_space_count';


      function render(data, category) {
        switch (category) {
          case 'space_personal_region': {
            var space_personal = {
              color: ["#00beff", "#ff3f66", "#53bb77"],
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '1%',
                bottom: '3%',
                containLabel: true
              },
              legend: {
                right: 10,
                width: 400,
                itemWidth: 25,
                textStyle: {
                  color: "#d7d7d7"
                },
                data: ["开通空间数", "使用空间数", "被访问空间数"]
              },
              xAxis: [{
                type: 'category',
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
                  show: false
                },
                data: []
              }],
              yAxis: [
                {
                  type: 'value',
                  splitLine: {
                    lineStyle: {
                      color: '#3e4370',
                      fontSize: 14
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#3e4370'
                    }
                  }
                }
              ],
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              series: [{
                name: '开通空间数',
                type: 'bar',
                barWidth: 17,
                data: []
              }, {
                name: '使用空间数',
                type: 'bar',
                barWidth: 17,
                data: []
              }, {
                name: '被访问空间数',
                type: 'bar',
                barWidth: 17,
                data: []
              }]
            };
            for (var i = 0; i < data.length; i++) {
              space_personal.xAxis[0].data[i] = data[i].name;
              space_personal.series[0].data[i] = data[i].openNum;
              space_personal.series[1].data[i] = data[i].useNum;
              space_personal.series[2].data[i] = data[i].visitNum;
            }
            echart_space_personal.setOption(space_personal);
            common.echart.hideLoading(echart_space_personal);
            break;
          }
          case 'space_personal_user_open': {
            var space_personal_user_o = {
              color: ['#296fd1', '#377ddf', '#5c99f2', '#92baf7'],
              title: {
                text: '累计开通空间数及占比',
                x: 'center',
                y: '3%',
                textStyle: {
                  color: '#0efde0',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                },
                data: data.legendData
              },

              calculable: true,
              series: [
                {
                  name: "开通空间数",
                  type: 'pie',
                  radius: ['35%', '55%'],
                  textStyle: {
                    color: '#333'
                  },
                  data: data.seriesData
                }
              ]
            };
            space_personal_user_open.setOption(space_personal_user_o);
            common.echart.hideLoading(space_personal_user_open);
          }
          case 'space_personal_user_use': {
            var space_personal_use_u = {
              color: ['#3cbd69', '#51d07d', '#81dda1', '#a5edbe'],
              title: {
                text: '累计使用空间数及占比',
                x: 'center',
                y: '3%',
                textStyle: {
                  color: '#0efde0',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                },
                data: data.legendData
              },

              calculable: true,
              series: [
                {
                  name: "使用空间数",
                  type: 'pie',
                  radius: ['35%', '55%'],
                  textStyle: {
                    color: '#333'
                  },
                  data: data.seriesData
                }
              ]
            };
            space_personal_user_use.setOption(space_personal_use_u);
            common.echart.hideLoading(space_personal_user_use);
          }
          case 'space_personal_user_visit': {
            var space_personal_user_v = {
              color: ['#af44ae', '#c162c0', '#e090df', '#f4b8f3'],
              title: {
                text: '被访问空间数及占比',
                x: 'center',
                y: '3%',
                textStyle: {
                  color: '#0efde0',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                },
                data: data.legendData
              },

              calculable: true,
              series: [
                {
                  name: "被访问空间数",
                  type: 'pie',
                  radius: ['35%', '55%'],
                  textStyle: {
                    color: '#333'
                  },
                  data: data.seriesData
                }
              ]
            };
            space_personal_user_visit.setOption(space_personal_user_v);
            common.echart.hideLoading(space_personal_user_visit);
            break;
          }
          case 'space_personal_trend': {
            var space_personal_t = {
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '1%',
                bottom: '3%',
                containLabel: true
              },
              legend: {
                textStyle: {
                  color: "#d7d7d7"
                },
                data: ["开通空间数", "使用空间数", "被访问空间数"]
              },
              calculable: true,
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: true,
                  axisTick: {
                    alignWithLabel: true
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#3e4370'
                    }
                  },
                  axisLabel: {
                    textStyle: {
                      fontSize: 12,
                      color: '#92accf'
                    }
                  },
                  data: []
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  axisLine: {
                    lineStyle: {
                      color: '#3e4370'
                    }
                  },
                  axisLabel: {
                    textStyle: {
                      fontSize: 12,
                      color: '#92accf'
                    }
                  },
                  splitLine: {
                    lineStyle: {
                      color: '#3e4370'
                    }
                  }
                }
              ],
              series: [
                {
                  name: '开通空间数',
                  type: 'line',
                  stack: '总量',
                  itemStyle: {
                    normal: {
                      color: '#0cb0e0',
                      lineStyle: {
                        color: '#0cb0e0'
                      }
                    }
                  },
                  areaStyle: {normal: {}},
                  data: []
                },
                {
                  name: '使用空间数',
                  type: 'line',
                  stack: '总量',
                  itemStyle: {
                    normal: {
                      color: '#ff3f66',
                      lineStyle: {
                        color: '#ff3f66'
                      }
                    }
                  },
                  areaStyle: {normal: {}},
                  data: []
                },
                {
                  name: '被访问空间数',
                  type: 'line',
                  stack: '总量',
                  itemStyle: {
                    normal: {
                      color: '#53bb77',
                      lineStyle: {
                        color: '#53bb77'
                      }
                    }
                  },
                  areaStyle: {normal: {}},
                  data: []
                }
              ]
            };
            for (var i = 0; i < data.length; i++) {
              space_personal_t.xAxis[0].data[i] = data[i].createDate.split(' ')[0];
              space_personal_t.series[0].data[i] = data[i].openNum;
              space_personal_t.series[1].data[i] = data[i].useNum;
              space_personal_t.series[2].data[i] = data[i].visitNum;
            }
            echart_space_personal_trend.setOption(space_personal_t);
            common.echart.hideLoading(echart_space_personal_trend);
            break;
          }
          case 'group_num_count': {
            var space_g = {
              color: ["#00beff", "#d4588f"],
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '1%',
                bottom: '3%',
                containLabel: true
              },
              legend: {
                right: 10,
                width: 400,
                itemWidth: 25,
                textStyle: {
                  color: "#d7d7d7"
                },
                data: ['开通空间数', '被访问空间数']
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
                axisTick: {
                  show: false
                },
                data: []
              }],
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
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              series: [{
                name: '开通空间数',
                type: 'bar',
                barWidth: 17,
                data: []
              }, {
                name: '被访问空间数',
                type: 'bar',
                barWidth: 17,
                data: []
              }]
            };
            for (var i = 0; i < data.length; i++) {
              space_g.xAxis[0].data[i] = data[i].name;
              space_g.series[0].data[i] = data[i].openNum;
              space_g.series[1].data[i] = data[i].visitNum;
            }
            echart_space_group.setOption(space_g);
            common.echart.hideLoading(echart_space_group);
            break;
          }
          case 'space_group_user_open': {
            var space_group_user_o = {
              color: ['#eaec68', '#a4d47a', '#54bb76', '#0fcbe4', '#408bf1', '#3055b3',
                '#8154cc', '#da60fb', '#ff3f66', '#fe8b1e', '#fdd51d'],
              title: {
                text: '累计开通空间数及占比',
                x: 'center',
                y: '3%',
                textStyle: {
                  color: '#0efde0',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                },
                data: data.legendData1
              },

              calculable: true,
              series: [
                {
                  name: "访问量",
                  type: 'pie',
                  radius: ['35%', '60%'],
                  textStyle: {
                    color: '#333'
                  },
                  data: data.seriesData1
                }
              ]
            };
            space_group_user_open.setOption(space_group_user_o);
            common.echart.hideLoading(space_group_user_open);
          }
          case 'space_group_user_visit': {
            var space_group_user_v = {
              color: ['#eaec68', '#a4d47a', '#54bb76', '#0fcbe4', '#408bf1', '#3055b3',
                '#8154cc', '#da60fb', '#ff3f66', '#fe8b1e', '#fdd51d'],
              title: {
                text: '被访问空间数及占比',
                x: 'center',
                y: '3%',
                textStyle: {
                  color: '#0efde0',
                  fontWeight: 'normal',
                  fontSize: 16
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                },
                data: data.legendData1
              },

              calculable: true,
              series: [
                {
                  name: "访问量",
                  type: 'pie',
                  radius: ['35%', '60%'],
                  textStyle: {
                    color: '#333'
                  },
                  data: data.seriesData2
                }
              ]
            };
            space_group_user_visit.setOption(space_group_user_v);
            common.echart.hideLoading(space_group_user_visit);
            break;
          }
          case 'space_group_trend': {
            var space_group_t = {
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '1%',
                bottom: '3%',
                containLabel: true
              },
              legend: {
                textStyle: {
                  color: "#d7d7d7"
                },
                data: ['开通空间数', '被访问空间数']
              },
              calculable: true,
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: true,
                  axisTick: {
                    alignWithLabel: true
                  },
                  axisLabel: {
                    textStyle: {
                      fontSize: 12,
                      color: '#92accf'
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#3e4370'
                    }
                  },
                  data: []
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  axisLabel: {
                    textStyle: {
                      fontSize: 12,
                      color: '#92accf'
                    }
                  },
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
                  name: '开通空间数',
                  type: 'line',
                  stack: '总量',
                  itemStyle: {
                    normal: {
                      color: '#ff3f66',
                      lineStyle: {
                        color: '#ff3f66'
                      }
                    }
                  },
                  areaStyle: {normal: {}},
                  data: []
                },
                {
                  name: '被访问空间数',
                  type: 'line',
                  stack: '总量',
                  itemStyle: {
                    normal: {
                      color: '#53bb77',
                      lineStyle: {
                        color: '#53bb77'
                      }
                    }
                  },
                  areaStyle: {normal: {}},
                  data: []
                }
              ]
            };
            for (var i = 0; i < data.length; i++) {
              space_group_t.xAxis[0].data[i] = data[i].createDate.split(' ')[0];
              space_group_t.series[0].data[i] = data[i].openNum;
              space_group_t.series[1].data[i] = data[i].visitNum;
            }
            echart_space_group_trend.setOption(space_group_t);
            common.echart.hideLoading(echart_space_group_trend);
            break;
          }
        }
      }

      // 地域分布，用户类型切换
      $('body').on('radioChange', '.radio', function () {
        var array = $(this).attr('data-value').split("@");
        $(this).parents('.item-tab').find('#' + array[0]).show().siblings(".space").hide();
        spaceUsePieData(array[1], array[2], array[0]);
      });

      /**
       * @description 个人空间使用情况统计  群组空间使用情况统计
       * @param spacetype 排序字段（person：个人空间，group：群组空间）
       * @param type  （area：地域分布，usertype:用户类型）
       */
      function spaceUseData(spacetype, type, spaceId) {
        echart_space_personal = common.echart.init(document.getElementById('space_personal_region'));
        common.echart.showLoading(echart_space_personal);
        echart_space_group = common.echart.init(document.getElementById('group_num_count'));
        common.echart.showLoading(echart_space_group);
        var spaceType = '';
        if (type) {
          spaceType = 'type=' + type + '&'
        }
        $.getJSON(service.prefix + '/space' + '/case/' + spacetype + '?' + spaceType + 'errorDomId=' + spaceId)
          .success(function (result) {
            if (result['code'] == 200 && result.data.length != 0) {
              render(result.data, spaceId);
            }
          });
      }

      spaceUseData('person', 'area', 'space_personal_region');
      spaceUseData('group', '', 'group_num_count');
      if (role === 'school') $('.radio').trigger('radioChange');

      /**
       * @description 个人空间使用情况统计 饼图
       * @param spacetype 排序字段（person：个人空间，group：群组空间）
       * @param type  （area：地域分布，usertype:用户类型）该参数只针对个人空间有效，群组空间无需该参数
       */
      function spaceUsePieData(spacetype, type, pieId) {
        if (spacetype === 'person') {
          space_personal_user_open = common.echart.init(document.getElementById('space_personal_user_open'));
          common.echart.showLoading(space_personal_user_open);
          space_personal_user_use = common.echart.init(document.getElementById('space_personal_user_use'));
          common.echart.showLoading(space_personal_user_use);
          space_personal_user_visit = common.echart.init(document.getElementById('space_personal_user_visit'));
          common.echart.showLoading(space_personal_user_visit);
        } else {
          space_group_user_open = common.echart.init(document.getElementById('space_group_user_open'));
          common.echart.showLoading(space_group_user_open);
          space_group_user_visit = common.echart.init(document.getElementById('space_group_user_visit'));
          common.echart.showLoading(space_group_user_visit);
        }
        var pieType = '';
        if (type) {
          pieType = 'type=' + type + '&'
        }
        $.getJSON(service.prefix + '/space/case/' + spacetype + '?' + pieType + 'errorDomId=' + pieId)
          .success(function (result) {
            if (result['code'] == 200) {
              if (spacetype === 'person') {
                render(convertPieData(result.data.openScale, 'person'), 'space_personal_user_open');
                render(convertPieData(result.data.useScale, 'person'), 'space_personal_user_use');
                render(convertPieData(result.data.visitScale, 'person'), 'space_personal_user_visit');
              } else
                render(convertPieData(result.data, 'group'), 'space_group_user_open');
            }
          });
      }


      function convertPieData(data, spacetype) {
        var person = {
          "parentSpaceNum": '家长',
          "researchSpaceNum": '教育局职工',
          "spaceTotal": '总数',
          "studentSpaceNum": '学生',
          "teacherSpaceNum": '教师'
        };
        if (role === 'school') delete person['researchSpaceNum'];
        var legendData = [], legendData1 = [];
        var seriesData = [], seriesData1 = [], seriesData2 = [];
        var other1 = 0, other2 = 0;
        $.each(data, function (index, item) {
          if (index >= 10) {
            other1 += item['openNum'];
            other2 += item['visitNum'];
          }
        });
        if (data && data.length > 10) {
          data.length = 10;
          data.push({name: '其它', openNum: other1, visitNum: other2});
        }
        if (spacetype == "person") {
          var j = 0;
          for (var key in data) {
            if (key != 'spaceTotal' && person[key]) {
              legendData[j] = person[key];
              seriesData[j] = {};
              seriesData[j].name = legendData[j];
              seriesData[j].value = data[key];
              j++;
            }
          }
          legendData.push('其它');
        } else if (spacetype == "group") {
          for (var i = 0; i < data.length; i++) {
            legendData1.push(data[i].name);
            seriesData1.push({name: data[i].name, value: data[i].openNum});
            seriesData2.push({name: data[i].name, value: data[i].visitNum});
          }
          legendData1.push('其它');
        }
        return {
          legendData: legendData,
          seriesData: seriesData,
          legendData1: legendData1,
          seriesData1: seriesData1,
          seriesData2: seriesData2
        };
      }

      /**
       * @description 个人空间使用趋势分析
       * @param    type  String  空间类型（person：个人空间，group：群组空间）
       * @param   startDate  String  开始时间(格式：yyyy-MM-dd)
       * @param    endDate  Strng  结束时间(格式：yyyy-MM-dd)
       */
      function spaceUseTrendData(type, startDate, endDate, trendId) {
        if (type == 'person') {
          echart_space_personal_trend = common.echart.init(document.getElementById('space_personal_trend'));
          common.echart.showLoading(echart_space_personal_trend);
        } else {
          echart_space_group_trend = common.echart.init(document.getElementById('space_group_trend'));
          common.echart.showLoading(echart_space_group_trend);
        }
        $.getJSON(service.prefix + '/space/trend' + '?type=' + type + '&startDate=' + startDate + '&endDate=' + endDate +
          '&errorDomId=' + trendId)
          .success(function (result) {
            if (result['code'] == 200) {
              render(result.data, trendId);
            }
          });
      }


      var date_start = {
        elem: '#date_start',
        max: laydate.now(-2),
        isclear: false,
        istoday: false,
        choose: function (datas) {
          date_end.min = datas;
        }
      }, group_start = $.extend({}, date_start, {
        elem: '#group_date_start',
        choose: function (datas) {
          group_date_end.min = datas;
        }
      });
      var date_end = {
        elem: '#date_end',
        min: laydate.now(-7),
        max: laydate.now(-1),
        isclear: false,
        istoday: false,
        choose: function (datas) {
          date_start.max = datas;
        }
      }, group_date_end = $.extend({}, date_end, {
        elem: '#group_date_end',
        choose: function (datas) {
          group_start.max = datas;
        }
      });

      $('#date_start,#group_date_start').val(laydate.now(-8));
      $('#date_end,#group_date_end').val(laydate.now(-1));

      $('body').on('click', '.laydate-icon', function () {
        var obj = eval('(' + this.id + ')');
        laydate(obj);
      });

      $('body').on('click', '.personTrenddateBtn', function () {
        var personstarttime = $('#date_start').val(),
          personendtime = $('#date_end').val();
        if (common.isLess30Day(personstarttime, personendtime))
          spaceUseTrendData('person', personstarttime, personendtime, 'space_personal_trend');
        else $.alert('时间间隔不得超过30天');
      });
      $('.personTrenddateBtn').trigger('click');

      $('body').on('click', '.groupTrenddateBtn', function () {
        var groupstarttime = $('#group_date_start').val(),
          groupendtime = $('#group_date_end').val();
        if (common.isLess30Day(groupstarttime, groupendtime))
          spaceUseTrendData('group', groupstarttime, groupendtime, 'space_group_trend');
        else $.alert('时间间隔不得超过30天');
      });
      $('.groupTrenddateBtn').trigger('click');

      /**
       * @description 获取空间数量
       * @param detail  Boolean  是否统计详细信息（空间开通率、空间月活跃度、日均访问量），为true时统计，
       *                         详细统计后台会多出很多查询所以尽量不要进行详细信息的统计。
       */

      function getSpaceQuantity(detail) {
        var url = service.prefix + '/space/count' + '?detail=' + detail + '&errorDomId=' + get_space_count;
        $.ajax({
          type: "GET",
          dataType: "json",
          url: url,
          success: function (json) {
            if (json['code'] == 200) {
              // 个人空间
              $('.personal_space').html(json.data.person.spaceTotal);
              $('.student_space').html(json.data.person.studentSpaceNum + '个');
              $('.parent_space').html(json.data.person.parentSpaceNum + '个');
              $('.teacher_space').html(json.data.person.teacherSpaceNum + '个');
              $('.teaching_space').html(json.data.person.researchSpaceNum + '个');
              // 群组空间
              $('.group_space').html(json.data.group.spaceTotal);
              $('.education_space').html(json.data.group.areaSpaceNum + '个');
              $('.school_space').html(json.data.group.schoolSpaceNum + '个');
              $('.class_space').html(json.data.group.classSpaceNum + '个');
              $('.subject_space').html(json.data.group.subjectSpaceNum + '个');
            }
          },
          error: function (json) {

          }
        });
      }

    });
})