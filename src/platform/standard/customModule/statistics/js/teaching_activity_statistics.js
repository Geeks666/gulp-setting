require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'common', 'select'],
    function ($, service, common, select) {
      $('body').on('click', '#schoolYear li', function () {
        if ($(this).index() != 0) {
          $('#fqActivityNum').next().find('li').hide().eq(0).show();
          $('#cyActivityNum').next().find('li').hide().eq(0).show();
          $('#fqActivityNum span,#cyActivityNum span').text('全学年');
        } else {
          $('#fqActivityNum').next().find('li').show();
          $('#cyActivityNum').next().find('li').show();
        }
      });

      //各区发起的活动数量对比
      var echart_achievements_num = common.echart.init(document.getElementById('achievements_num'));

      //活动参与情况  学校管理员
      var echart_achievements_num1 = common.echart.init(document.getElementById('achievements_num1'));

      //各区活动参与情况对比
      var echart_activity_partake = common.echart.init(document.getElementById('activity_partake'));

      //各区活动参与情况对比
      var echart_activity_partake1 = common.echart.init(document.getElementById('activity_partake1'));


      function render(data, category) {
        switch (category) {
          case 'achievements_num': {
            var echart_achievements_n = {
              color: ["#00beff", "#d4588f"],
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '2%',
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
                data: ['活动发起数量']
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
                name: '',
                type: 'bar',
                barWidth: 22,
                data: []
              }]
            };


            for (var i = 0; i < data.length; i++) {
              echart_achievements_n.xAxis[0].data[i] = data[i].areaName;
              echart_achievements_n.series[0].data[i] = data[i].count;
            }
            echart_achievements_num.setOption(echart_achievements_n);
            common.echart.hideLoading(echart_achievements_num);
            break;
          }
          case 'achievements_num1': {
            var echart_achievements_n1 = {
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
                data: ['活动发起数量']
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
                data: ["教学研讨", "在线观课", "专家指导", "校际教研", "课堂教学评价"]
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
                name: '',
                type: 'bar',
                barWidth: 22,
                data: [data.jxyt_join, data.zxgk_join, data.zjzd_join, data.xjjy_area_join, data.ktpj_join]
              }]
            };

            echart_achievements_num1.setOption(echart_achievements_n1);
            common.echart.hideLoading(echart_achievements_num1);
            break;
          }
          case 'activity_partake': {
            var echart_activity_p = {
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                top: '15%',
                left: '1%',
                right: '2%',
                bottom: '3%',
                containLabel: true
              },
              legend: {
                textStyle: {
                  color: "#d7d7d7"
                },
                data: []
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
                  name: '参与数',
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
                }
              ]
            };
            for (var i = 0; i < data.length; i++) {
              echart_activity_p.xAxis[0].data[i] = data[i].date;
              echart_activity_p.series[0].data[i] = data[i].count;
            }
            echart_activity_partake.setOption(echart_activity_p);
            common.echart.hideLoading(echart_activity_partake);
            break;
          }
        }
      }

      /**
       * @description       各区域发起的活动数量
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param subjectId   学科id
       * @param gradeId     年级id
       * @param schoolYear  学年
       */

      function fqActivityNum(time, phaseId, subjectId, gradeId, schoolYear) {
        echart_achievements_num = common.echart.init(document.getElementById('achievements_num'));
        common.echart.showLoading(echart_achievements_num);

        echart_achievements_num1 = common.echart.init(document.getElementById('achievements_num1'));
        common.echart.showLoading(echart_achievements_num1);
        var url = "";
        if (common.role == 'city') {
          url = '/jy/open?path=/api/statistic/area/areatotal_issue_area?areaId=' + common.areaid;
        } else if (common.role == 'county') {
          url = '/jy/open?path=/api/statistic/area/areatotal_issue_date?areaId=' + common.areaid;
        } else if (common.role == 'school') {
          url = '/jy/open?path=/api/statistic/org/sch_area_data?orgId=' + common.orgid;
        }
        $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=achievements_num_wrap')
          .success(function (result) {
              if (result['code'] == 1) {
                if (common.role == 'school') {
                  render(result.data, 'achievements_num1');
                } else {
                  render(result.data, 'achievements_num');
                }
              }
            }
          );
      }

      $('body').on('selectChange', '#fqActivityNum', function () {
        fqActivityNum($('#fqActivityNum').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
      });


      /**
       * @description       区域活动参与数量
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param subjectId   学科id
       * @param gradeId     年级id
       * @param schoolYear  学年
       */

      function cyActivityNum(time, phaseId, subjectId, gradeId, schoolYear) {
        echart_activity_partake = common.echart.init(document.getElementById('activity_partake'));
        common.echart.showLoading(echart_activity_partake);
        var url = "";
        if (common.role == 'city') {
          url = '/jy/open?path=/api/statistic/area/areatotal_join_area?areaId=' + common.areaid;
        } else if (common.role == 'county') {
          url = '/jy/open?path=/api/statistic/area/areatotal_join_date?areaId=' + common.areaid;
        } else if (common.role == 'school') {
          url = '/jy/open?path=/api/statistic/org/sch_area_data_trend?orgId=' + common.orgid;
        }
        $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=activity_partake_wrap')
          .success(function (result) {
              if (result['code'] == 1) {
                render(result.data, 'activity_partake');
              }
            }
          );
      }


      $('body').on('selectChange', '#cyActivityNum', function () {
        cyActivityNum($('#cyActivityNum').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
      });


      $('body').on('click', '#searchBtn', function () {
        fqActivityNum($('#fqActivityNum').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'),
          $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));

        cyActivityNum($('#cyActivityNum').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'),
          $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      });
      $('#searchBtn').trigger('click');
    });
})