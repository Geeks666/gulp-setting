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
        case 'space_personal_region':
          {
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
                  show: false
                },
                data: []
              }],
              yAxis: [{
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
              }],
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
        case 'space_personal_user_open':
          {
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
              series: [{
                name: "开通空间数",
                type: 'pie',
                radius: ['35%', '55%'],
                textStyle: {
                  color: '#333'
                },
                data: data.seriesData
              }]
            };
            space_personal_user_open.setOption(space_personal_user_o);
            common.echart.hideLoading(space_personal_user_open);
          }
        case 'space_personal_user_use':
          {
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
              series: [{
                name: "使用空间数",
                type: 'pie',
                radius: ['35%', '55%'],
                textStyle: {
                  color: '#333'
                },
                data: data.seriesData
              }]
            };
            space_personal_user_use.setOption(space_personal_use_u);
            common.echart.hideLoading(space_personal_user_use);
          }
        case 'space_personal_user_visit':
          {
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
              series: [{
                name: "被访问空间数",
                type: 'pie',
                radius: ['35%', '55%'],
                textStyle: {
                  color: '#333'
                },
                data: data.seriesData
              }]
            };
            space_personal_user_visit.setOption(space_personal_user_v);
            common.echart.hideLoading(space_personal_user_visit);
            break;
          }
        case 'space_personal_trend':
          {
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
              xAxis: [{
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
              }],
              yAxis: [{
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
              }],
              series: [{
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
                areaStyle: { normal: {} },
                data: []
              }, {
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
                areaStyle: { normal: {} },
                data: []
              }, {
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
                areaStyle: { normal: {} },
                data: []
              }]
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
        case 'group_num_count':
          {
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
        case 'space_group_user_open':
          {
            var space_group_user_o = {
              color: ['#eaec68', '#a4d47a', '#54bb76', '#0fcbe4', '#408bf1', '#3055b3', '#8154cc', '#da60fb', '#ff3f66', '#fe8b1e', '#fdd51d'],
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
              series: [{
                name: "访问量",
                type: 'pie',
                radius: ['35%', '60%'],
                textStyle: {
                  color: '#333'
                },
                data: data.seriesData1
              }]
            };
            space_group_user_open.setOption(space_group_user_o);
            common.echart.hideLoading(space_group_user_open);
          }
        case 'space_group_user_visit':
          {
            var space_group_user_v = {
              color: ['#eaec68', '#a4d47a', '#54bb76', '#0fcbe4', '#408bf1', '#3055b3', '#8154cc', '#da60fb', '#ff3f66', '#fe8b1e', '#fdd51d'],
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
              series: [{
                name: "访问量",
                type: 'pie',
                radius: ['35%', '60%'],
                textStyle: {
                  color: '#333'
                },
                data: data.seriesData2
              }]
            };
            space_group_user_visit.setOption(space_group_user_v);
            common.echart.hideLoading(space_group_user_visit);
            break;
          }
        case 'space_group_trend':
          {
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
              xAxis: [{
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
              }],
              yAxis: [{
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
              }],
              series: [{
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
                areaStyle: { normal: {} },
                data: []
              }, {
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
                areaStyle: { normal: {} },
                data: []
              }]
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
        spaceType = 'type=' + type + '&';
      }
      $.getJSON(service.prefix + '/space' + '/case/' + spacetype + '?' + spaceType + 'errorDomId=' + spaceId).success(function (result) {
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
        pieType = 'type=' + type + '&';
      }
      $.getJSON(service.prefix + '/space/case/' + spacetype + '?' + pieType + 'errorDomId=' + pieId).success(function (result) {
        if (result['code'] == 200) {
          if (spacetype === 'person') {
            render(convertPieData(result.data.openScale, 'person'), 'space_personal_user_open');
            render(convertPieData(result.data.useScale, 'person'), 'space_personal_user_use');
            render(convertPieData(result.data.visitScale, 'person'), 'space_personal_user_visit');
          } else render(convertPieData(result.data, 'group'), 'space_group_user_open');
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
      var legendData = [],
          legendData1 = [];
      var seriesData = [],
          seriesData1 = [],
          seriesData2 = [];
      var other1 = 0,
          other2 = 0;
      $.each(data, function (index, item) {
        if (index >= 10) {
          other1 += item['openNum'];
          other2 += item['visitNum'];
        }
      });
      if (data && data.length > 10) {
        data.length = 10;
        data.push({ name: '其它', openNum: other1, visitNum: other2 });
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
          seriesData1.push({ name: data[i].name, value: data[i].openNum });
          seriesData2.push({ name: data[i].name, value: data[i].visitNum });
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
      $.getJSON(service.prefix + '/space/trend' + '?type=' + type + '&startDate=' + startDate + '&endDate=' + endDate + '&errorDomId=' + trendId).success(function (result) {
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
      choose: function choose(datas) {
        date_end.min = datas;
      }
    },
        group_start = $.extend({}, date_start, {
      elem: '#group_date_start',
      choose: function choose(datas) {
        group_date_end.min = datas;
      }
    });
    var date_end = {
      elem: '#date_end',
      min: laydate.now(-7),
      max: laydate.now(-1),
      isclear: false,
      istoday: false,
      choose: function choose(datas) {
        date_start.max = datas;
      }
    },
        group_date_end = $.extend({}, date_end, {
      elem: '#group_date_end',
      choose: function choose(datas) {
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
      if (common.isLess30Day(personstarttime, personendtime)) spaceUseTrendData('person', personstarttime, personendtime, 'space_personal_trend');else $.alert('时间间隔不得超过30天');
    });
    $('.personTrenddateBtn').trigger('click');

    $('body').on('click', '.groupTrenddateBtn', function () {
      var groupstarttime = $('#group_date_start').val(),
          groupendtime = $('#group_date_end').val();
      if (common.isLess30Day(groupstarttime, groupendtime)) spaceUseTrendData('group', groupstarttime, groupendtime, 'space_group_trend');else $.alert('时间间隔不得超过30天');
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
        success: function success(json) {
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
        error: function error(json) {}
      });
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3NwYWNlX2VjaGFydC5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiY29uZmlncGF0aHMiLCJkZWZpbmUiLCIkIiwic2VydmljZSIsInRvb2xzIiwiY29tbW9uIiwicm9sZSIsImRvY3VtZW50IiwicmVhZHkiLCJnZXRTcGFjZVF1YW50aXR5IiwiZWNoYXJ0X3NwYWNlX3BlcnNvbmFsIiwiZWNoYXJ0IiwiaW5pdCIsImdldEVsZW1lbnRCeUlkIiwic3BhY2VfcGVyc29uYWxfdXNlcl9vcGVuIiwic3BhY2VfcGVyc29uYWxfdXNlcl91c2UiLCJzcGFjZV9wZXJzb25hbF91c2VyX3Zpc2l0IiwiZWNoYXJ0X3NwYWNlX3BlcnNvbmFsX3RyZW5kIiwiZWNoYXJ0X3NwYWNlX2dyb3VwIiwic3BhY2VfZ3JvdXBfdXNlcl9vcGVuIiwic3BhY2VfZ3JvdXBfdXNlcl92aXNpdCIsImVjaGFydF9zcGFjZV9ncm91cF90cmVuZCIsInNwYWNlX3BlcnNvbmFsX3JlZ2lvbiIsInNwYWNlX3BlcnNvbmFsX3VzZSIsImdyb3VwX251bV9jb3VudCIsImdyb3VwX3JhdGlvX2FuYWx5c2lzIiwic3BhY2VfcGVyc29uYWxfdHJlbmQiLCJzcGFjZV9ncm91cF90cmVuZCIsImdldF9zcGFjZV9jb3VudCIsInJlbmRlciIsImRhdGEiLCJjYXRlZ29yeSIsInNwYWNlX3BlcnNvbmFsIiwiY29sb3IiLCJ0ZXh0U3R5bGUiLCJmb250U2l6ZSIsImdyaWQiLCJ0b3AiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJjb250YWluTGFiZWwiLCJsZWdlbmQiLCJ3aWR0aCIsIml0ZW1XaWR0aCIsInhBeGlzIiwidHlwZSIsImF4aXNMYWJlbCIsImZvcm1hdHRlciIsIm5hbWUiLCJoaWRlVGV4dEJ5TGVuIiwiYXhpc0xpbmUiLCJsaW5lU3R5bGUiLCJheGlzVGljayIsInNob3ciLCJ5QXhpcyIsInNwbGl0TGluZSIsInRvb2x0aXAiLCJ0cmlnZ2VyIiwiYXhpc1BvaW50ZXIiLCJzZXJpZXMiLCJiYXJXaWR0aCIsImkiLCJsZW5ndGgiLCJvcGVuTnVtIiwidXNlTnVtIiwidmlzaXROdW0iLCJzZXRPcHRpb24iLCJoaWRlTG9hZGluZyIsInNwYWNlX3BlcnNvbmFsX3VzZXJfbyIsInRpdGxlIiwidGV4dCIsIngiLCJ5IiwiZm9udFdlaWdodCIsImxlZ2VuZERhdGEiLCJjYWxjdWxhYmxlIiwicmFkaXVzIiwic2VyaWVzRGF0YSIsInNwYWNlX3BlcnNvbmFsX3VzZV91Iiwic3BhY2VfcGVyc29uYWxfdXNlcl92Iiwic3BhY2VfcGVyc29uYWxfdCIsImJvdW5kYXJ5R2FwIiwiYWxpZ25XaXRoTGFiZWwiLCJzdGFjayIsIml0ZW1TdHlsZSIsIm5vcm1hbCIsImFyZWFTdHlsZSIsImNyZWF0ZURhdGUiLCJzcGxpdCIsInNwYWNlX2ciLCJzcGFjZV9ncm91cF91c2VyX28iLCJsZWdlbmREYXRhMSIsInNlcmllc0RhdGExIiwic3BhY2VfZ3JvdXBfdXNlcl92Iiwic2VyaWVzRGF0YTIiLCJzcGFjZV9ncm91cF90Iiwib24iLCJhcnJheSIsImF0dHIiLCJwYXJlbnRzIiwiZmluZCIsInNpYmxpbmdzIiwiaGlkZSIsInNwYWNlVXNlUGllRGF0YSIsInNwYWNlVXNlRGF0YSIsInNwYWNldHlwZSIsInNwYWNlSWQiLCJzaG93TG9hZGluZyIsInNwYWNlVHlwZSIsImdldEpTT04iLCJwcmVmaXgiLCJzdWNjZXNzIiwicmVzdWx0IiwicGllSWQiLCJwaWVUeXBlIiwiY29udmVydFBpZURhdGEiLCJvcGVuU2NhbGUiLCJ1c2VTY2FsZSIsInZpc2l0U2NhbGUiLCJwZXJzb24iLCJvdGhlcjEiLCJvdGhlcjIiLCJlYWNoIiwiaW5kZXgiLCJpdGVtIiwicHVzaCIsImoiLCJrZXkiLCJ2YWx1ZSIsInNwYWNlVXNlVHJlbmREYXRhIiwic3RhcnREYXRlIiwiZW5kRGF0ZSIsInRyZW5kSWQiLCJkYXRlX3N0YXJ0IiwiZWxlbSIsIm1heCIsImxheWRhdGUiLCJub3ciLCJpc2NsZWFyIiwiaXN0b2RheSIsImNob29zZSIsImRhdGFzIiwiZGF0ZV9lbmQiLCJtaW4iLCJncm91cF9zdGFydCIsImV4dGVuZCIsImdyb3VwX2RhdGVfZW5kIiwidmFsIiwib2JqIiwiZXZhbCIsImlkIiwicGVyc29uc3RhcnR0aW1lIiwicGVyc29uZW5kdGltZSIsImlzTGVzczMwRGF5IiwiYWxlcnQiLCJncm91cHN0YXJ0dGltZSIsImdyb3VwZW5kdGltZSIsImRldGFpbCIsInVybCIsImFqYXgiLCJkYXRhVHlwZSIsImpzb24iLCJodG1sIiwic3BhY2VUb3RhbCIsInN0dWRlbnRTcGFjZU51bSIsInBhcmVudFNwYWNlTnVtIiwidGVhY2hlclNwYWNlTnVtIiwicmVzZWFyY2hTcGFjZU51bSIsImdyb3VwIiwiYXJlYVNwYWNlTnVtIiwic2Nob29sU3BhY2VOdW0iLCJjbGFzc1NwYWNlTnVtIiwic3ViamVjdFNwYWNlTnVtIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxXQUFTLEtBREk7QUFFYkMsU0FBTztBQUNMLGtCQUFjO0FBRFQ7QUFGTSxDQUFmO0FBTUFILFFBQVEsQ0FBQyxZQUFELENBQVIsRUFBd0IsVUFBVUksV0FBVixFQUF1QjtBQUM3QztBQUNBSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7QUFDQUMsU0FBTyxFQUFQLEVBQVUsQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixPQUF0QixFQUErQixRQUEvQixDQUFWLEVBQ0UsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxLQUF0QixFQUE2QkMsTUFBN0IsRUFBcUM7QUFDbkMsUUFBSUMsT0FBT0QsT0FBT0MsSUFBbEI7QUFDQUosTUFBRUssUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVk7QUFDNUJDLHVCQUFpQixPQUFqQjtBQUNELEtBRkQ7QUFHQTtBQUNBLFFBQUlDLHdCQUF3QkwsT0FBT00sTUFBUCxDQUFjQyxJQUFkLENBQW1CTCxTQUFTTSxj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LENBQVUwRixNQUFWLENBQWlCK0MsZUFBakIsR0FBbUMsR0FBNUQ7QUFDQXJLLGNBQUUsaUJBQUYsRUFBcUJpSyxJQUFyQixDQUEwQkQsS0FBS3BJLElBQUwsQ0FBVTBGLE1BQVYsQ0FBaUJnRCxnQkFBakIsR0FBb0MsR0FBOUQ7QUFDQTtBQUNBdEssY0FBRSxjQUFGLEVBQWtCaUssSUFBbEIsQ0FBdUJELEtBQUtwSSxJQUFMLENBQVUySSxLQUFWLENBQWdCTCxVQUF2QztBQUNBbEssY0FBRSxrQkFBRixFQUFzQmlLLElBQXRCLENBQTJCRCxLQUFLcEksSUFBTCxDQUFVMkksS0FBVixDQUFnQkMsWUFBaEIsR0FBK0IsR0FBMUQ7QUFDQXhLLGNBQUUsZUFBRixFQUFtQmlLLElBQW5CLENBQXdCRCxLQUFLcEksSUFBTCxDQUFVMkksS0FBVixDQUFnQkUsY0FBaEIsR0FBaUMsR0FBekQ7QUFDQXpLLGNBQUUsY0FBRixFQUFrQmlLLElBQWxCLENBQXVCRCxLQUFLcEksSUFBTCxDQUFVMkksS0FBVixDQUFnQkcsYUFBaEIsR0FBZ0MsR0FBdkQ7QUFDQTFLLGNBQUUsZ0JBQUYsRUFBb0JpSyxJQUFwQixDQUF5QkQsS0FBS3BJLElBQUwsQ0FBVTJJLEtBQVYsQ0FBZ0JJLGVBQWhCLEdBQWtDLEdBQTNEO0FBQ0Q7QUFDRixTQW5CSTtBQW9CTEMsZUFBTyxlQUFVWixJQUFWLEVBQWdCLENBRXRCO0FBdEJJLE9BQVA7QUF3QkQ7QUFFRixHQXYzQkg7QUF3M0JELENBMzNCRCIsImZpbGUiOiJjdXN0b21Nb2R1bGUvc3RhdGlzdGljcy9qcy9zcGFjZV9lY2hhcnQtN2Y1ODAxYTU5MS5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ2N1c3RvbUNvbmYnOiAnc3RhdGlzdGljcy9qcy9jdXN0b21Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydjdXN0b21Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcbiAgZGVmaW5lKCcnLFsnanF1ZXJ5JywgJ3NlcnZpY2UnLCAndG9vbHMnLCAnY29tbW9uJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgc2VydmljZSwgdG9vbHMsIGNvbW1vbikge1xyXG4gICAgICB2YXIgcm9sZSA9IGNvbW1vbi5yb2xlO1xyXG4gICAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZ2V0U3BhY2VRdWFudGl0eSgnZmFsc2UnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8v5Liq5Lq656m66Ze05L2/55So5oOF5Ya157uf6K6hIOaMieWcsOWfn+WIhuW4g1xyXG4gICAgICB2YXIgZWNoYXJ0X3NwYWNlX3BlcnNvbmFsID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFjZV9wZXJzb25hbF9yZWdpb24nKSk7XHJcbiAgICAgIC8v5Liq5Lq656m66Ze05L2/55So5oOF5Ya157uf6K6hIOaMieeUqOaIt+exu+Wei1xyXG4gICAgICB2YXIgc3BhY2VfcGVyc29uYWxfdXNlcl9vcGVuID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFjZV9wZXJzb25hbF91c2VyX29wZW4nKSk7XHJcbiAgICAgIHZhciBzcGFjZV9wZXJzb25hbF91c2VyX3VzZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3BhY2VfcGVyc29uYWxfdXNlcl91c2UnKSk7XHJcbiAgICAgIHZhciBzcGFjZV9wZXJzb25hbF91c2VyX3Zpc2l0ID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFjZV9wZXJzb25hbF91c2VyX3Zpc2l0JykpO1xyXG4gICAgICAvL+S4quS6uuepuumXtOS9v+eUqOaDheWGtei2i+WKv+WIhuaekFxyXG4gICAgICB2YXIgZWNoYXJ0X3NwYWNlX3BlcnNvbmFsX3RyZW5kID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFjZV9wZXJzb25hbF90cmVuZCcpKTtcclxuICAgICAgLy/nvqTnu4Tnqbrpl7Tkvb/nlKjmg4XlhrXnu5/orqEg5pWw6YeP57uf6K6hXHJcbiAgICAgIHZhciBlY2hhcnRfc3BhY2VfZ3JvdXAgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dyb3VwX251bV9jb3VudCcpKTtcclxuICAgICAgLy/nvqTnu4Tnqbrpl7Tkvb/nlKjmg4XlhrXnu5/orqEg5Y2g5q+U5YiG5p6QXHJcbiAgICAgIHZhciBzcGFjZV9ncm91cF91c2VyX29wZW4gPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYWNlX2dyb3VwX3VzZXJfb3BlbicpKTtcclxuICAgICAgdmFyIHNwYWNlX2dyb3VwX3VzZXJfdmlzaXQgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYWNlX2dyb3VwX3VzZXJfdmlzaXQnKSk7XHJcbiAgICAgIC8v576k57uE56m66Ze05L2/55So5oOF5Ya16LaL5Yq/5YiG5p6QXHJcbiAgICAgIHZhciBlY2hhcnRfc3BhY2VfZ3JvdXBfdHJlbmQgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYWNlX2dyb3VwX3RyZW5kJykpO1xyXG5cclxuICAgICAgLy8gZXJyb3JEb21JRFxyXG4gICAgICB2YXIgc3BhY2VfcGVyc29uYWxfcmVnaW9uID0gJ3NwYWNlX3BlcnNvbmFsX3JlZ2lvbic7XHJcbiAgICAgIHZhciBzcGFjZV9wZXJzb25hbF91c2UgPSAnc3BhY2VfcGVyc29uYWxfdXNlJztcclxuICAgICAgdmFyIGdyb3VwX251bV9jb3VudCA9ICdzcGFjZV9wZXJzb25hbF91c2UnO1xyXG4gICAgICB2YXIgZ3JvdXBfcmF0aW9fYW5hbHlzaXMgPSAnZ3JvdXBfcmF0aW9fYW5hbHlzaXMnO1xyXG4gICAgICB2YXIgc3BhY2VfcGVyc29uYWxfdHJlbmQgPSAnc3BhY2VfcGVyc29uYWxfdHJlbmQnO1xyXG4gICAgICB2YXIgc3BhY2VfZ3JvdXBfdHJlbmQgPSAnc3BhY2VfZ3JvdXBfdHJlbmQnO1xyXG4gICAgICB2YXIgZ2V0X3NwYWNlX2NvdW50ID0gJ2dldF9zcGFjZV9jb3VudCc7XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyKGRhdGEsIGNhdGVnb3J5KSB7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeSkge1xyXG4gICAgICAgICAgY2FzZSAnc3BhY2VfcGVyc29uYWxfcmVnaW9uJzoge1xyXG4gICAgICAgICAgICB2YXIgc3BhY2VfcGVyc29uYWwgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFtcIiMwMGJlZmZcIiwgXCIjZmYzZjY2XCIsIFwiIzUzYmI3N1wiXSxcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZicsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzE1JScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDEwLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwMCxcclxuICAgICAgICAgICAgICAgIGl0ZW1XaWR0aDogMjUsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwiI2Q3ZDdkN1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW1wi5byA6YCa56m66Ze05pWwXCIsIFwi5L2/55So56m66Ze05pWwXCIsIFwi6KKr6K6/6Zeu56m66Ze05pWwXCJdXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB4QXhpczogW3tcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXHJcbiAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9vbHMuaGlkZVRleHRCeUxlbihuYW1lLCAxMCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHsgLy8g5Z2Q5qCH6L205oyH56S65Zmo77yM5Z2Q5qCH6L206Kem5Y+R5pyJ5pWIXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaGFkb3cnIC8vIOm7mOiupOS4uuebtOe6v++8jOWPr+mAieS4uu+8midsaW5lJyB8ICdzaGFkb3cnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn5byA6YCa56m66Ze05pWwJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICAgICAgYmFyV2lkdGg6IDE3LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn5L2/55So56m66Ze05pWwJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICAgICAgYmFyV2lkdGg6IDE3LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn6KKr6K6/6Zeu56m66Ze05pWwJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICAgICAgYmFyV2lkdGg6IDE3LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBzcGFjZV9wZXJzb25hbC54QXhpc1swXS5kYXRhW2ldID0gZGF0YVtpXS5uYW1lO1xyXG4gICAgICAgICAgICAgIHNwYWNlX3BlcnNvbmFsLnNlcmllc1swXS5kYXRhW2ldID0gZGF0YVtpXS5vcGVuTnVtO1xyXG4gICAgICAgICAgICAgIHNwYWNlX3BlcnNvbmFsLnNlcmllc1sxXS5kYXRhW2ldID0gZGF0YVtpXS51c2VOdW07XHJcbiAgICAgICAgICAgICAgc3BhY2VfcGVyc29uYWwuc2VyaWVzWzJdLmRhdGFbaV0gPSBkYXRhW2ldLnZpc2l0TnVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVjaGFydF9zcGFjZV9wZXJzb25hbC5zZXRPcHRpb24oc3BhY2VfcGVyc29uYWwpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9zcGFjZV9wZXJzb25hbCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAnc3BhY2VfcGVyc29uYWxfdXNlcl9vcGVuJzoge1xyXG4gICAgICAgICAgICB2YXIgc3BhY2VfcGVyc29uYWxfdXNlcl9vID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyMyOTZmZDEnLCAnIzM3N2RkZicsICcjNWM5OWYyJywgJyM5MmJhZjcnXSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ+e0r+iuoeW8gOmAmuepuumXtOaVsOWPiuWNoOavlCcsXHJcbiAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIHk6ICczJScsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMGVmZGUwJyxcclxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifSA6IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIHk6ICdib3R0b20nLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEubGVnZW5kRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IFwi5byA6YCa56m66Ze05pWwXCIsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFsnMzUlJywgJzU1JSddLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzMzMnXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuc2VyaWVzRGF0YVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3BhY2VfcGVyc29uYWxfdXNlcl9vcGVuLnNldE9wdGlvbihzcGFjZV9wZXJzb25hbF91c2VyX28pO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKHNwYWNlX3BlcnNvbmFsX3VzZXJfb3Blbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdzcGFjZV9wZXJzb25hbF91c2VyX3VzZSc6IHtcclxuICAgICAgICAgICAgdmFyIHNwYWNlX3BlcnNvbmFsX3VzZV91ID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyMzY2JkNjknLCAnIzUxZDA3ZCcsICcjODFkZGExJywgJyNhNWVkYmUnXSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ+e0r+iuoeS9v+eUqOepuumXtOaVsOWPiuWNoOavlCcsXHJcbiAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIHk6ICczJScsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMGVmZGUwJyxcclxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifSA6IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIHk6ICdib3R0b20nLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEubGVnZW5kRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IFwi5L2/55So56m66Ze05pWwXCIsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFsnMzUlJywgJzU1JSddLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzMzMnXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuc2VyaWVzRGF0YVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3BhY2VfcGVyc29uYWxfdXNlcl91c2Uuc2V0T3B0aW9uKHNwYWNlX3BlcnNvbmFsX3VzZV91KTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhzcGFjZV9wZXJzb25hbF91c2VyX3VzZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdzcGFjZV9wZXJzb25hbF91c2VyX3Zpc2l0Jzoge1xyXG4gICAgICAgICAgICB2YXIgc3BhY2VfcGVyc29uYWxfdXNlcl92ID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyNhZjQ0YWUnLCAnI2MxNjJjMCcsICcjZTA5MGRmJywgJyNmNGI4ZjMnXSxcclxuICAgICAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICAgICAgdGV4dDogJ+iiq+iuv+mXruepuumXtOaVsOWPiuWNoOavlCcsXHJcbiAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIHk6ICczJScsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMGVmZGUwJyxcclxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ25vcm1hbCcsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifSA6IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIHk6ICdib3R0b20nLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEubGVnZW5kRGF0YVxyXG4gICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IFwi6KKr6K6/6Zeu56m66Ze05pWwXCIsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFsnMzUlJywgJzU1JSddLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzMzMnXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuc2VyaWVzRGF0YVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3BhY2VfcGVyc29uYWxfdXNlcl92aXNpdC5zZXRPcHRpb24oc3BhY2VfcGVyc29uYWxfdXNlcl92KTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhzcGFjZV9wZXJzb25hbF91c2VyX3Zpc2l0KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdzcGFjZV9wZXJzb25hbF90cmVuZCc6IHtcclxuICAgICAgICAgICAgdmFyIHNwYWNlX3BlcnNvbmFsX3QgPSB7XHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICcxNSUnLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzElJyxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCIjZDdkN2Q3XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXCLlvIDpgJrnqbrpl7TmlbBcIiwgXCLkvb/nlKjnqbrpl7TmlbBcIiwgXCLooqvorr/pl67nqbrpl7TmlbBcIl1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgeEF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25XaXRoTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOTJhY2NmJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHlBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMixcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIHNwbGl0TGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICflvIDpgJrnqbrpl7TmlbAnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZScsXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrOiAn5oC76YePJyxcclxuICAgICAgICAgICAgICAgICAgaXRlbVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwY2IwZTAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzBjYjBlMCdcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGFyZWFTdHlsZToge25vcm1hbDoge319LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogJ+S9v+eUqOepuumXtOaVsCcsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lJyxcclxuICAgICAgICAgICAgICAgICAgc3RhY2s6ICfmgLvph48nLFxyXG4gICAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmM2Y2NicsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmYzZjY2J1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXJlYVN0eWxlOiB7bm9ybWFsOiB7fX0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiAn6KKr6K6/6Zeu56m66Ze05pWwJyxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmUnLFxyXG4gICAgICAgICAgICAgICAgICBzdGFjazogJ+aAu+mHjycsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTNiYjc3JyxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1M2JiNzcnXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBhcmVhU3R5bGU6IHtub3JtYWw6IHt9fSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHNwYWNlX3BlcnNvbmFsX3QueEF4aXNbMF0uZGF0YVtpXSA9IGRhdGFbaV0uY3JlYXRlRGF0ZS5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgIHNwYWNlX3BlcnNvbmFsX3Quc2VyaWVzWzBdLmRhdGFbaV0gPSBkYXRhW2ldLm9wZW5OdW07XHJcbiAgICAgICAgICAgICAgc3BhY2VfcGVyc29uYWxfdC5zZXJpZXNbMV0uZGF0YVtpXSA9IGRhdGFbaV0udXNlTnVtO1xyXG4gICAgICAgICAgICAgIHNwYWNlX3BlcnNvbmFsX3Quc2VyaWVzWzJdLmRhdGFbaV0gPSBkYXRhW2ldLnZpc2l0TnVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVjaGFydF9zcGFjZV9wZXJzb25hbF90cmVuZC5zZXRPcHRpb24oc3BhY2VfcGVyc29uYWxfdCk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3NwYWNlX3BlcnNvbmFsX3RyZW5kKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdncm91cF9udW1fY291bnQnOiB7XHJcbiAgICAgICAgICAgIHZhciBzcGFjZV9nID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbXCIjMDBiZWZmXCIsIFwiI2Q0NTg4ZlwiXSxcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZicsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzE1JScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDEwLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwMCxcclxuICAgICAgICAgICAgICAgIGl0ZW1XaWR0aDogMjUsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwiI2Q3ZDdkN1wiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogWyflvIDpgJrnqbrpl7TmlbAnLCAn6KKr6K6/6Zeu56m66Ze05pWwJ11cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhBeGlzOiBbe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcclxuICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGF4aXNUaWNrOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICB5QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICBzcGxpdExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXHJcbiAgICAgICAgICAgICAgICBheGlzUG9pbnRlcjogeyAvLyDlnZDmoIfovbTmjIfnpLrlmajvvIzlnZDmoIfovbTop6blj5HmnInmlYhcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3NoYWRvdycgLy8g6buY6K6k5Li655u057q/77yM5Y+v6YCJ5Li677yaJ2xpbmUnIHwgJ3NoYWRvdydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNlcmllczogW3tcclxuICAgICAgICAgICAgICAgIG5hbWU6ICflvIDpgJrnqbrpl7TmlbAnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgICAgICBiYXJXaWR0aDogMTcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfooqvorr/pl67nqbrpl7TmlbAnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXHJcbiAgICAgICAgICAgICAgICBiYXJXaWR0aDogMTcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHNwYWNlX2cueEF4aXNbMF0uZGF0YVtpXSA9IGRhdGFbaV0ubmFtZTtcclxuICAgICAgICAgICAgICBzcGFjZV9nLnNlcmllc1swXS5kYXRhW2ldID0gZGF0YVtpXS5vcGVuTnVtO1xyXG4gICAgICAgICAgICAgIHNwYWNlX2cuc2VyaWVzWzFdLmRhdGFbaV0gPSBkYXRhW2ldLnZpc2l0TnVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVjaGFydF9zcGFjZV9ncm91cC5zZXRPcHRpb24oc3BhY2VfZyk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3NwYWNlX2dyb3VwKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdzcGFjZV9ncm91cF91c2VyX29wZW4nOiB7XHJcbiAgICAgICAgICAgIHZhciBzcGFjZV9ncm91cF91c2VyX28gPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnI2VhZWM2OCcsICcjYTRkNDdhJywgJyM1NGJiNzYnLCAnIzBmY2JlNCcsICcjNDA4YmYxJywgJyMzMDU1YjMnLFxyXG4gICAgICAgICAgICAgICAgJyM4MTU0Y2MnLCAnI2RhNjBmYicsICcjZmYzZjY2JywgJyNmZThiMWUnLCAnI2ZkZDUxZCddLFxyXG4gICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiAn57Sv6K6h5byA6YCa56m66Ze05pWw5Y+K5Y2g5q+UJyxcclxuICAgICAgICAgICAgICAgIHg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgeTogJzMlJyxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyMwZWZkZTAnLFxyXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnbm9ybWFsJyxcclxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE2XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2F9IDxici8+e2J9IDoge2N9ICh7ZH0lKVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIHg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgeTogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YS5sZWdlbmREYXRhMVxyXG4gICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IFwi6K6/6Zeu6YePXCIsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFsnMzUlJywgJzYwJSddLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzMzMnXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuc2VyaWVzRGF0YTFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHNwYWNlX2dyb3VwX3VzZXJfb3Blbi5zZXRPcHRpb24oc3BhY2VfZ3JvdXBfdXNlcl9vKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhzcGFjZV9ncm91cF91c2VyX29wZW4pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAnc3BhY2VfZ3JvdXBfdXNlcl92aXNpdCc6IHtcclxuICAgICAgICAgICAgdmFyIHNwYWNlX2dyb3VwX3VzZXJfdiA9IHtcclxuICAgICAgICAgICAgICBjb2xvcjogWycjZWFlYzY4JywgJyNhNGQ0N2EnLCAnIzU0YmI3NicsICcjMGZjYmU0JywgJyM0MDhiZjEnLCAnIzMwNTViMycsXHJcbiAgICAgICAgICAgICAgICAnIzgxNTRjYycsICcjZGE2MGZiJywgJyNmZjNmNjYnLCAnI2ZlOGIxZScsICcjZmRkNTFkJ10sXHJcbiAgICAgICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgICAgIHRleHQ6ICfooqvorr/pl67nqbrpl7TmlbDlj4rljaDmr5QnLFxyXG4gICAgICAgICAgICAgICAgeDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICB5OiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzBlZmRlMCcsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxyXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTZcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogXCJ7YX0gPGJyLz57Yn0gOiB7Y30gKHtkfSUpXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgeDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICB5OiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmxlZ2VuZERhdGExXHJcbiAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgY2FsY3VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogXCLorr/pl67ph49cIixcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZScsXHJcbiAgICAgICAgICAgICAgICAgIHJhZGl1czogWyczNSUnLCAnNjAlJ10sXHJcbiAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzMzMydcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5zZXJpZXNEYXRhMlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgc3BhY2VfZ3JvdXBfdXNlcl92aXNpdC5zZXRPcHRpb24oc3BhY2VfZ3JvdXBfdXNlcl92KTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhzcGFjZV9ncm91cF91c2VyX3Zpc2l0KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXNlICdzcGFjZV9ncm91cF90cmVuZCc6IHtcclxuICAgICAgICAgICAgdmFyIHNwYWNlX2dyb3VwX3QgPSB7XHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICcxNSUnLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzElJyxcclxuICAgICAgICAgICAgICAgIHJpZ2h0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCIjZDdkN2Q3XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbJ+W8gOmAmuepuumXtOaVsCcsICfooqvorr/pl67nqbrpl7TmlbAnXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY2FsY3VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICBib3VuZGFyeUdhcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYXhpc1RpY2s6IHtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbldpdGhMYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMixcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBzcGxpdExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogJ+W8gOmAmuepuumXtOaVsCcsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lJyxcclxuICAgICAgICAgICAgICAgICAgc3RhY2s6ICfmgLvph48nLFxyXG4gICAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmM2Y2NicsXHJcbiAgICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmYzZjY2J1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXJlYVN0eWxlOiB7bm9ybWFsOiB7fX0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiAn6KKr6K6/6Zeu56m66Ze05pWwJyxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmUnLFxyXG4gICAgICAgICAgICAgICAgICBzdGFjazogJ+aAu+mHjycsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTNiYjc3JyxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1M2JiNzcnXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBhcmVhU3R5bGU6IHtub3JtYWw6IHt9fSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHNwYWNlX2dyb3VwX3QueEF4aXNbMF0uZGF0YVtpXSA9IGRhdGFbaV0uY3JlYXRlRGF0ZS5zcGxpdCgnICcpWzBdO1xyXG4gICAgICAgICAgICAgIHNwYWNlX2dyb3VwX3Quc2VyaWVzWzBdLmRhdGFbaV0gPSBkYXRhW2ldLm9wZW5OdW07XHJcbiAgICAgICAgICAgICAgc3BhY2VfZ3JvdXBfdC5zZXJpZXNbMV0uZGF0YVtpXSA9IGRhdGFbaV0udmlzaXROdW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWNoYXJ0X3NwYWNlX2dyb3VwX3RyZW5kLnNldE9wdGlvbihzcGFjZV9ncm91cF90KTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfc3BhY2VfZ3JvdXBfdHJlbmQpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIOWcsOWfn+WIhuW4g++8jOeUqOaIt+exu+Wei+WIh+aNolxyXG4gICAgICAkKCdib2R5Jykub24oJ3JhZGlvQ2hhbmdlJywgJy5yYWRpbycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYXJyYXkgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKS5zcGxpdChcIkBcIik7XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuaXRlbS10YWInKS5maW5kKCcjJyArIGFycmF5WzBdKS5zaG93KCkuc2libGluZ3MoXCIuc3BhY2VcIikuaGlkZSgpO1xyXG4gICAgICAgIHNwYWNlVXNlUGllRGF0YShhcnJheVsxXSwgYXJyYXlbMl0sIGFycmF5WzBdKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIOS4quS6uuepuumXtOS9v+eUqOaDheWGtee7n+iuoSAg576k57uE56m66Ze05L2/55So5oOF5Ya157uf6K6hXHJcbiAgICAgICAqIEBwYXJhbSBzcGFjZXR5cGUg5o6S5bqP5a2X5q6177yIcGVyc29u77ya5Liq5Lq656m66Ze077yMZ3JvdXDvvJrnvqTnu4Tnqbrpl7TvvIlcclxuICAgICAgICogQHBhcmFtIHR5cGUgIO+8iGFyZWHvvJrlnLDln5/liIbluIPvvIx1c2VydHlwZTrnlKjmiLfnsbvlnovvvIlcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHNwYWNlVXNlRGF0YShzcGFjZXR5cGUsIHR5cGUsIHNwYWNlSWQpIHtcclxuICAgICAgICBlY2hhcnRfc3BhY2VfcGVyc29uYWwgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYWNlX3BlcnNvbmFsX3JlZ2lvbicpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9zcGFjZV9wZXJzb25hbCk7XHJcbiAgICAgICAgZWNoYXJ0X3NwYWNlX2dyb3VwID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdncm91cF9udW1fY291bnQnKSk7XHJcbiAgICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfc3BhY2VfZ3JvdXApO1xyXG4gICAgICAgIHZhciBzcGFjZVR5cGUgPSAnJztcclxuICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgc3BhY2VUeXBlID0gJ3R5cGU9JyArIHR5cGUgKyAnJidcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9zcGFjZScgKyAnL2Nhc2UvJyArIHNwYWNldHlwZSArICc/JyArIHNwYWNlVHlwZSArICdlcnJvckRvbUlkPScgKyBzcGFjZUlkKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwICYmIHJlc3VsdC5kYXRhLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgcmVuZGVyKHJlc3VsdC5kYXRhLCBzcGFjZUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNwYWNlVXNlRGF0YSgncGVyc29uJywgJ2FyZWEnLCAnc3BhY2VfcGVyc29uYWxfcmVnaW9uJyk7XHJcbiAgICAgIHNwYWNlVXNlRGF0YSgnZ3JvdXAnLCAnJywgJ2dyb3VwX251bV9jb3VudCcpO1xyXG4gICAgICBpZiAocm9sZSA9PT0gJ3NjaG9vbCcpICQoJy5yYWRpbycpLnRyaWdnZXIoJ3JhZGlvQ2hhbmdlJyk7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIOS4quS6uuepuumXtOS9v+eUqOaDheWGtee7n+iuoSDppbzlm75cclxuICAgICAgICogQHBhcmFtIHNwYWNldHlwZSDmjpLluo/lrZfmrrXvvIhwZXJzb27vvJrkuKrkurrnqbrpl7TvvIxncm91cO+8mue+pOe7hOepuumXtO+8iVxyXG4gICAgICAgKiBAcGFyYW0gdHlwZSAg77yIYXJlYe+8muWcsOWfn+WIhuW4g++8jHVzZXJ0eXBlOueUqOaIt+exu+Wei++8ieivpeWPguaVsOWPqumSiOWvueS4quS6uuepuumXtOacieaViO+8jOe+pOe7hOepuumXtOaXoOmcgOivpeWPguaVsFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gc3BhY2VVc2VQaWVEYXRhKHNwYWNldHlwZSwgdHlwZSwgcGllSWQpIHtcclxuICAgICAgICBpZiAoc3BhY2V0eXBlID09PSAncGVyc29uJykge1xyXG4gICAgICAgICAgc3BhY2VfcGVyc29uYWxfdXNlcl9vcGVuID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFjZV9wZXJzb25hbF91c2VyX29wZW4nKSk7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKHNwYWNlX3BlcnNvbmFsX3VzZXJfb3Blbik7XHJcbiAgICAgICAgICBzcGFjZV9wZXJzb25hbF91c2VyX3VzZSA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3BhY2VfcGVyc29uYWxfdXNlcl91c2UnKSk7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKHNwYWNlX3BlcnNvbmFsX3VzZXJfdXNlKTtcclxuICAgICAgICAgIHNwYWNlX3BlcnNvbmFsX3VzZXJfdmlzaXQgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYWNlX3BlcnNvbmFsX3VzZXJfdmlzaXQnKSk7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKHNwYWNlX3BlcnNvbmFsX3VzZXJfdmlzaXQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzcGFjZV9ncm91cF91c2VyX29wZW4gPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYWNlX2dyb3VwX3VzZXJfb3BlbicpKTtcclxuICAgICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoc3BhY2VfZ3JvdXBfdXNlcl9vcGVuKTtcclxuICAgICAgICAgIHNwYWNlX2dyb3VwX3VzZXJfdmlzaXQgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwYWNlX2dyb3VwX3VzZXJfdmlzaXQnKSk7XHJcbiAgICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKHNwYWNlX2dyb3VwX3VzZXJfdmlzaXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGllVHlwZSA9ICcnO1xyXG4gICAgICAgIGlmICh0eXBlKSB7XHJcbiAgICAgICAgICBwaWVUeXBlID0gJ3R5cGU9JyArIHR5cGUgKyAnJidcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9zcGFjZS9jYXNlLycgKyBzcGFjZXR5cGUgKyAnPycgKyBwaWVUeXBlICsgJ2Vycm9yRG9tSWQ9JyArIHBpZUlkKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNwYWNldHlwZSA9PT0gJ3BlcnNvbicpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlcihjb252ZXJ0UGllRGF0YShyZXN1bHQuZGF0YS5vcGVuU2NhbGUsICdwZXJzb24nKSwgJ3NwYWNlX3BlcnNvbmFsX3VzZXJfb3BlbicpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyKGNvbnZlcnRQaWVEYXRhKHJlc3VsdC5kYXRhLnVzZVNjYWxlLCAncGVyc29uJyksICdzcGFjZV9wZXJzb25hbF91c2VyX3VzZScpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyKGNvbnZlcnRQaWVEYXRhKHJlc3VsdC5kYXRhLnZpc2l0U2NhbGUsICdwZXJzb24nKSwgJ3NwYWNlX3BlcnNvbmFsX3VzZXJfdmlzaXQnKTtcclxuICAgICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHJlbmRlcihjb252ZXJ0UGllRGF0YShyZXN1bHQuZGF0YSwgJ2dyb3VwJyksICdzcGFjZV9ncm91cF91c2VyX29wZW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBjb252ZXJ0UGllRGF0YShkYXRhLCBzcGFjZXR5cGUpIHtcclxuICAgICAgICB2YXIgcGVyc29uID0ge1xyXG4gICAgICAgICAgXCJwYXJlbnRTcGFjZU51bVwiOiAn5a626ZW/JyxcclxuICAgICAgICAgIFwicmVzZWFyY2hTcGFjZU51bVwiOiAn5pWZ6IKy5bGA6IGM5belJyxcclxuICAgICAgICAgIFwic3BhY2VUb3RhbFwiOiAn5oC75pWwJyxcclxuICAgICAgICAgIFwic3R1ZGVudFNwYWNlTnVtXCI6ICflrabnlJ8nLFxyXG4gICAgICAgICAgXCJ0ZWFjaGVyU3BhY2VOdW1cIjogJ+aVmeW4iCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChyb2xlID09PSAnc2Nob29sJykgZGVsZXRlIHBlcnNvblsncmVzZWFyY2hTcGFjZU51bSddO1xyXG4gICAgICAgIHZhciBsZWdlbmREYXRhID0gW10sIGxlZ2VuZERhdGExID0gW107XHJcbiAgICAgICAgdmFyIHNlcmllc0RhdGEgPSBbXSwgc2VyaWVzRGF0YTEgPSBbXSwgc2VyaWVzRGF0YTIgPSBbXTtcclxuICAgICAgICB2YXIgb3RoZXIxID0gMCwgb3RoZXIyID0gMDtcclxuICAgICAgICAkLmVhY2goZGF0YSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMTApIHtcclxuICAgICAgICAgICAgb3RoZXIxICs9IGl0ZW1bJ29wZW5OdW0nXTtcclxuICAgICAgICAgICAgb3RoZXIyICs9IGl0ZW1bJ3Zpc2l0TnVtJ107XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAxMCkge1xyXG4gICAgICAgICAgZGF0YS5sZW5ndGggPSAxMDtcclxuICAgICAgICAgIGRhdGEucHVzaCh7bmFtZTogJ+WFtuWugycsIG9wZW5OdW06IG90aGVyMSwgdmlzaXROdW06IG90aGVyMn0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3BhY2V0eXBlID09IFwicGVyc29uXCIpIHtcclxuICAgICAgICAgIHZhciBqID0gMDtcclxuICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgIT0gJ3NwYWNlVG90YWwnICYmIHBlcnNvbltrZXldKSB7XHJcbiAgICAgICAgICAgICAgbGVnZW5kRGF0YVtqXSA9IHBlcnNvbltrZXldO1xyXG4gICAgICAgICAgICAgIHNlcmllc0RhdGFbal0gPSB7fTtcclxuICAgICAgICAgICAgICBzZXJpZXNEYXRhW2pdLm5hbWUgPSBsZWdlbmREYXRhW2pdO1xyXG4gICAgICAgICAgICAgIHNlcmllc0RhdGFbal0udmFsdWUgPSBkYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgaisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZWdlbmREYXRhLnB1c2goJ+WFtuWugycpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2V0eXBlID09IFwiZ3JvdXBcIikge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxlZ2VuZERhdGExLnB1c2goZGF0YVtpXS5uYW1lKTtcclxuICAgICAgICAgICAgc2VyaWVzRGF0YTEucHVzaCh7bmFtZTogZGF0YVtpXS5uYW1lLCB2YWx1ZTogZGF0YVtpXS5vcGVuTnVtfSk7XHJcbiAgICAgICAgICAgIHNlcmllc0RhdGEyLnB1c2goe25hbWU6IGRhdGFbaV0ubmFtZSwgdmFsdWU6IGRhdGFbaV0udmlzaXROdW19KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxlZ2VuZERhdGExLnB1c2goJ+WFtuWugycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbGVnZW5kRGF0YTogbGVnZW5kRGF0YSxcclxuICAgICAgICAgIHNlcmllc0RhdGE6IHNlcmllc0RhdGEsXHJcbiAgICAgICAgICBsZWdlbmREYXRhMTogbGVnZW5kRGF0YTEsXHJcbiAgICAgICAgICBzZXJpZXNEYXRhMTogc2VyaWVzRGF0YTEsXHJcbiAgICAgICAgICBzZXJpZXNEYXRhMjogc2VyaWVzRGF0YTJcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIOS4quS6uuepuumXtOS9v+eUqOi2i+WKv+WIhuaekFxyXG4gICAgICAgKiBAcGFyYW0gICAgdHlwZSAgU3RyaW5nICDnqbrpl7TnsbvlnovvvIhwZXJzb27vvJrkuKrkurrnqbrpl7TvvIxncm91cO+8mue+pOe7hOepuumXtO+8iVxyXG4gICAgICAgKiBAcGFyYW0gICBzdGFydERhdGUgIFN0cmluZyAg5byA5aeL5pe26Ze0KOagvOW8j++8mnl5eXktTU0tZGQpXHJcbiAgICAgICAqIEBwYXJhbSAgICBlbmREYXRlICBTdHJuZyAg57uT5p2f5pe26Ze0KOagvOW8j++8mnl5eXktTU0tZGQpXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBzcGFjZVVzZVRyZW5kRGF0YSh0eXBlLCBzdGFydERhdGUsIGVuZERhdGUsIHRyZW5kSWQpIHtcclxuICAgICAgICBpZiAodHlwZSA9PSAncGVyc29uJykge1xyXG4gICAgICAgICAgZWNoYXJ0X3NwYWNlX3BlcnNvbmFsX3RyZW5kID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFjZV9wZXJzb25hbF90cmVuZCcpKTtcclxuICAgICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3NwYWNlX3BlcnNvbmFsX3RyZW5kKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZWNoYXJ0X3NwYWNlX2dyb3VwX3RyZW5kID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFjZV9ncm91cF90cmVuZCcpKTtcclxuICAgICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3NwYWNlX2dyb3VwX3RyZW5kKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9zcGFjZS90cmVuZCcgKyAnP3R5cGU9JyArIHR5cGUgKyAnJnN0YXJ0RGF0ZT0nICsgc3RhcnREYXRlICsgJyZlbmREYXRlPScgKyBlbmREYXRlICtcclxuICAgICAgICAgICcmZXJyb3JEb21JZD0nICsgdHJlbmRJZClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDIwMCkge1xyXG4gICAgICAgICAgICAgIHJlbmRlcihyZXN1bHQuZGF0YSwgdHJlbmRJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgdmFyIGRhdGVfc3RhcnQgPSB7XHJcbiAgICAgICAgZWxlbTogJyNkYXRlX3N0YXJ0JyxcclxuICAgICAgICBtYXg6IGxheWRhdGUubm93KC0yKSxcclxuICAgICAgICBpc2NsZWFyOiBmYWxzZSxcclxuICAgICAgICBpc3RvZGF5OiBmYWxzZSxcclxuICAgICAgICBjaG9vc2U6IGZ1bmN0aW9uIChkYXRhcykge1xyXG4gICAgICAgICAgZGF0ZV9lbmQubWluID0gZGF0YXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBncm91cF9zdGFydCA9ICQuZXh0ZW5kKHt9LCBkYXRlX3N0YXJ0LCB7XHJcbiAgICAgICAgZWxlbTogJyNncm91cF9kYXRlX3N0YXJ0JyxcclxuICAgICAgICBjaG9vc2U6IGZ1bmN0aW9uIChkYXRhcykge1xyXG4gICAgICAgICAgZ3JvdXBfZGF0ZV9lbmQubWluID0gZGF0YXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdmFyIGRhdGVfZW5kID0ge1xyXG4gICAgICAgIGVsZW06ICcjZGF0ZV9lbmQnLFxyXG4gICAgICAgIG1pbjogbGF5ZGF0ZS5ub3coLTcpLFxyXG4gICAgICAgIG1heDogbGF5ZGF0ZS5ub3coLTEpLFxyXG4gICAgICAgIGlzY2xlYXI6IGZhbHNlLFxyXG4gICAgICAgIGlzdG9kYXk6IGZhbHNlLFxyXG4gICAgICAgIGNob29zZTogZnVuY3Rpb24gKGRhdGFzKSB7XHJcbiAgICAgICAgICBkYXRlX3N0YXJ0Lm1heCA9IGRhdGFzO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgZ3JvdXBfZGF0ZV9lbmQgPSAkLmV4dGVuZCh7fSwgZGF0ZV9lbmQsIHtcclxuICAgICAgICBlbGVtOiAnI2dyb3VwX2RhdGVfZW5kJyxcclxuICAgICAgICBjaG9vc2U6IGZ1bmN0aW9uIChkYXRhcykge1xyXG4gICAgICAgICAgZ3JvdXBfc3RhcnQubWF4ID0gZGF0YXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQoJyNkYXRlX3N0YXJ0LCNncm91cF9kYXRlX3N0YXJ0JykudmFsKGxheWRhdGUubm93KC04KSk7XHJcbiAgICAgICQoJyNkYXRlX2VuZCwjZ3JvdXBfZGF0ZV9lbmQnKS52YWwobGF5ZGF0ZS5ub3coLTEpKTtcclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmxheWRhdGUtaWNvbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgb2JqID0gZXZhbCgnKCcgKyB0aGlzLmlkICsgJyknKTtcclxuICAgICAgICBsYXlkYXRlKG9iaik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcucGVyc29uVHJlbmRkYXRlQnRuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwZXJzb25zdGFydHRpbWUgPSAkKCcjZGF0ZV9zdGFydCcpLnZhbCgpLFxyXG4gICAgICAgICAgcGVyc29uZW5kdGltZSA9ICQoJyNkYXRlX2VuZCcpLnZhbCgpO1xyXG4gICAgICAgIGlmIChjb21tb24uaXNMZXNzMzBEYXkocGVyc29uc3RhcnR0aW1lLCBwZXJzb25lbmR0aW1lKSlcclxuICAgICAgICAgIHNwYWNlVXNlVHJlbmREYXRhKCdwZXJzb24nLCBwZXJzb25zdGFydHRpbWUsIHBlcnNvbmVuZHRpbWUsICdzcGFjZV9wZXJzb25hbF90cmVuZCcpO1xyXG4gICAgICAgIGVsc2UgJC5hbGVydCgn5pe26Ze06Ze06ZqU5LiN5b6X6LaF6L+HMzDlpKknKTtcclxuICAgICAgfSk7XHJcbiAgICAgICQoJy5wZXJzb25UcmVuZGRhdGVCdG4nKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuZ3JvdXBUcmVuZGRhdGVCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGdyb3Vwc3RhcnR0aW1lID0gJCgnI2dyb3VwX2RhdGVfc3RhcnQnKS52YWwoKSxcclxuICAgICAgICAgIGdyb3VwZW5kdGltZSA9ICQoJyNncm91cF9kYXRlX2VuZCcpLnZhbCgpO1xyXG4gICAgICAgIGlmIChjb21tb24uaXNMZXNzMzBEYXkoZ3JvdXBzdGFydHRpbWUsIGdyb3VwZW5kdGltZSkpXHJcbiAgICAgICAgICBzcGFjZVVzZVRyZW5kRGF0YSgnZ3JvdXAnLCBncm91cHN0YXJ0dGltZSwgZ3JvdXBlbmR0aW1lLCAnc3BhY2VfZ3JvdXBfdHJlbmQnKTtcclxuICAgICAgICBlbHNlICQuYWxlcnQoJ+aXtumXtOmXtOmalOS4jeW+l+i2hei/hzMw5aSpJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcuZ3JvdXBUcmVuZGRhdGVCdG4nKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiDojrflj5bnqbrpl7TmlbDph49cclxuICAgICAgICogQHBhcmFtIGRldGFpbCAgQm9vbGVhbiAg5piv5ZCm57uf6K6h6K+m57uG5L+h5oGv77yI56m66Ze05byA6YCa546H44CB56m66Ze05pyI5rS76LeD5bqm44CB5pel5Z2H6K6/6Zeu6YeP77yJ77yM5Li6dHJ1ZeaXtue7n+iuoe+8jFxyXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICDor6bnu4bnu5/orqHlkI7lj7DkvJrlpJrlh7rlvojlpJrmn6Xor6LmiYDku6XlsL3ph4/kuI3opoHov5vooYzor6bnu4bkv6Hmga/nmoTnu5/orqHjgIJcclxuICAgICAgICovXHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRTcGFjZVF1YW50aXR5KGRldGFpbCkge1xyXG4gICAgICAgIHZhciB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICcvc3BhY2UvY291bnQnICsgJz9kZXRhaWw9JyArIGRldGFpbCArICcmZXJyb3JEb21JZD0nICsgZ2V0X3NwYWNlX2NvdW50O1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxyXG4gICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoanNvbikge1xyXG4gICAgICAgICAgICBpZiAoanNvblsnY29kZSddID09IDIwMCkge1xyXG4gICAgICAgICAgICAgIC8vIOS4quS6uuepuumXtFxyXG4gICAgICAgICAgICAgICQoJy5wZXJzb25hbF9zcGFjZScpLmh0bWwoanNvbi5kYXRhLnBlcnNvbi5zcGFjZVRvdGFsKTtcclxuICAgICAgICAgICAgICAkKCcuc3R1ZGVudF9zcGFjZScpLmh0bWwoanNvbi5kYXRhLnBlcnNvbi5zdHVkZW50U3BhY2VOdW0gKyAn5LiqJyk7XHJcbiAgICAgICAgICAgICAgJCgnLnBhcmVudF9zcGFjZScpLmh0bWwoanNvbi5kYXRhLnBlcnNvbi5wYXJlbnRTcGFjZU51bSArICfkuKonKTtcclxuICAgICAgICAgICAgICAkKCcudGVhY2hlcl9zcGFjZScpLmh0bWwoanNvbi5kYXRhLnBlcnNvbi50ZWFjaGVyU3BhY2VOdW0gKyAn5LiqJyk7XHJcbiAgICAgICAgICAgICAgJCgnLnRlYWNoaW5nX3NwYWNlJykuaHRtbChqc29uLmRhdGEucGVyc29uLnJlc2VhcmNoU3BhY2VOdW0gKyAn5LiqJyk7XHJcbiAgICAgICAgICAgICAgLy8g576k57uE56m66Ze0XHJcbiAgICAgICAgICAgICAgJCgnLmdyb3VwX3NwYWNlJykuaHRtbChqc29uLmRhdGEuZ3JvdXAuc3BhY2VUb3RhbCk7XHJcbiAgICAgICAgICAgICAgJCgnLmVkdWNhdGlvbl9zcGFjZScpLmh0bWwoanNvbi5kYXRhLmdyb3VwLmFyZWFTcGFjZU51bSArICfkuKonKTtcclxuICAgICAgICAgICAgICAkKCcuc2Nob29sX3NwYWNlJykuaHRtbChqc29uLmRhdGEuZ3JvdXAuc2Nob29sU3BhY2VOdW0gKyAn5LiqJyk7XHJcbiAgICAgICAgICAgICAgJCgnLmNsYXNzX3NwYWNlJykuaHRtbChqc29uLmRhdGEuZ3JvdXAuY2xhc3NTcGFjZU51bSArICfkuKonKTtcclxuICAgICAgICAgICAgICAkKCcuc3ViamVjdF9zcGFjZScpLmh0bWwoanNvbi5kYXRhLmdyb3VwLnN1YmplY3RTcGFjZU51bSArICfkuKonKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoanNvbikge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG59KSJdfQ==
