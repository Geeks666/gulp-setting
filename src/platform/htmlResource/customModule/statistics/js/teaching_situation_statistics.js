require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'tools', 'common', 'select', 'page','dataResource/teachingSituationStatisticsData.js'],
    function ($, service, tools, common, select, Page,teachingSituationStatisticsData) {
      common.role = 'county';
      $('body').on('click', '#schoolYear li', function () {
        if ($(this).index() != 0) {
          $('#areaSchool').next().find('li').hide().eq(0).show();
          $('#schtotalSelect').next().find('li').hide().eq(0).show();
          $('#subjectContrast').next().find('li').hide().eq(0).show();
          $('#gradeContrast').next().find('li').hide().eq(0).show();
          $('#areaSchool span,#schtotalSelect span,#subjectContrast span,#gradeContrast span').text('全学年');

        } else {
          $('#areaSchool').next().find('li').show();
          $('#schtotalSelect').next().find('li').show();
          $('#subjectContrast').next().find('li').show();
          $('#gradeContrast').next().find('li').show();
        }
      });
      //各区域学校教研情况对比
      var echart_school_teaching_contrast = common.echart.init(document.getElementById('school_teaching_contrast'));

      //学校教研与管理--成果分布  常规教学
      var echart_schoolRoutineTeaching = common.echart.init(document.getElementById('schoolRoutineTeaching'));

      //学校教研与管理--成果分布  教育科研
      var echart_schoolEducationalResearch = common.echart.init(document.getElementById('schoolEducationalResearch'));

      //学校教研与管理--成果分布  教学管理
      var echart_schoolTeachingManagement = common.echart.init(document.getElementById('schoolTeachingManagement'));

      //各校教研成果对比  学校教研成果总量
      var echart_schoolTotalResults = common.echart.init(document.getElementById('schoolTotalResults'));

      //各学科情况对比  学校教研成果
      var echart_schoolTeachingAchievements = common.echart.init(document.getElementById('schoolTeachingAchievements'));

      //各年级情况对比  学校教研成果
      var echart_schoolGradeTeachingAchievements = common.echart.init(document.getElementById('schoolGradeTeachingAchievements'));


      function render(data, category) {
        switch (category) {
          case 'school_teaching_contrast': {
            var echart_school_teaching_c = {
              color: ["#2fc885"],
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
                data: ['开通空间数']
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
              echart_school_teaching_c.xAxis[0].data[i] = data[i].areaName;
              echart_school_teaching_c.series[0].data[i] = data[i].count;
            }
            echart_school_teaching_contrast.setOption(echart_school_teaching_c);
            common.echart.hideLoading(echart_school_teaching_contrast);
            break;
          }
          case 'schoolRoutineTeaching': {
            var option_schoolRoutineTeaching = {
              color: ['#febb26', '#3f86ea', '#ff3f66', '#53bb77', '#b653cf', '#d0174f', '#316ec5', '#14c7e0', '#fdd51d', '#fd8c1d'],
              backgroundColor: '',
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                itemGap: 20,
                textStyle: {color: '#e7e7e7', fontSize: 14},
                data: ['教案', '课件', '教学反思', '计划总结']
              },
              series: [
                {
                  name: '常规教学',
                  type: 'pie',
                  radius: '70%',
                  center: ['50%', '40%'],
                  data: [
                    {value: data.jiaoan_write, name: '教案'},
                    {value: data.kejian_write, name: '课件'},
                    {value: data.fansi_write, name: '教学反思'},
                    {value: data.plansummary_write, name: '计划总结'}
                  ]
                }
              ]
            };
            echart_schoolRoutineTeaching.setOption(option_schoolRoutineTeaching);
            common.echart.hideLoading(echart_schoolRoutineTeaching);
            break;
          }
          case 'schoolEducationalResearch': {
            var echart_schoolEducationalR = {
              color: ['#a4d47a', '#da60fb', '#ff3f66', '#0fcbe4', '#eaec68', '#408bf1', '#fe8b1e', '#fdd51d', '#54bb76', '#3055b3',
                '#8154cc'],
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                itemGap: 10,
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                },
                data: ['集体备课', '校际教研', '成长档案', '听课记录', '教学文章']
              },

              calculable: true,
              series: [
                {
                  name: "占比",
                  type: 'pie',
                  radius: ['38%', '58%'],
                  center: ['53%', '37%'],
                  textStyle: {
                    color: '#333'
                  },
                  data: [
                    {value: data.activity_issue, name: '集体备课'},
                    {value: data.xjjy_org_issue, name: '校际教研'},
                    {value: data.record_res, name: '成长档案'},
                    {value: data.listen_write, name: '听课记录'},
                    {value: data.thesis_write, name: '教学文章'}
                  ]
                }
              ]
            };
            echart_schoolEducationalResearch.setOption(echart_schoolEducationalR);
            common.echart.hideLoading(echart_schoolEducationalResearch);
          }
          case 'schoolTeachingManagement': {
            var echart_schoolTeachingM = {
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
                data: ["教学管理"]
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
                  data: ['查阅教案', '查阅课件', '查阅反思', '查阅听课记录', '查阅集体备课', '查阅计划总结', '查阅教学文章']
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
                  name: '',
                  type: 'line',
                  stack: '总量',
                  itemStyle: {
                    normal: {
                      color: '#51b873',
                      lineStyle: {
                        color: '#51b873'
                      }
                    }
                  },
                  areaStyle: {normal: {}},
                  data: [data.jiaoan_scan, data.kejian_scan, data.fansi_scan, data.listen_scan, data.activity_scan,
                    data.plansummary_scan, data.thesis_scan]
                }
              ]
            };
            echart_schoolTeachingManagement.setOption(echart_schoolTeachingM);
            common.echart.hideLoading(echart_schoolTeachingManagement);
            break;
          }
          case 'schoolTotalResults': {
            var option_schoolTotalResults = {
              color: ['#53bb77', '#fdd51d', '#fd8c1d', '#ff3f66', '#3f86ea', '#316ec5', '#14c7e0', '#d0174f', '#b653cf'],
              backgroundColor: '',
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                textStyle: {color: '#e7e7e7', fontSize: 12},
                data: [],
                formatter: function (name) {
                  return tools.hideTextByLen(name, 20);
                },
                tooltip: {
                  show: true
                }
              },
              series: [
                {
                  name: '各区域成果总量占比',
                  type: 'pie',
                  radius: '58%',
                  center: ['50%', '40%'],
                  labelLine: {
                    normal: {
                      length: 2
                    }
                  },
                  data: [],
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 5,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 1)'
                    }
                  }
                }
              ]
            };
            for (var i = 0; i < data.dataList.length; i++) {
              var obj = {};
              obj['value'] = data.dataList[i].count;
              obj['name'] = data.dataList[i].orgName;
              option_schoolTotalResults.series[0].data.push(obj);
              option_schoolTotalResults.series[0].data[i].label = {};
              option_schoolTotalResults.series[0].data[i].label.normal = {};
              option_schoolTotalResults.series[0].data[i].label.normal.formatter = tools.hideTextByLen(data.dataList[i].orgName, 20);
              option_schoolTotalResults.legend.data[i] = data.dataList[i].orgName;
            }
            echart_schoolTotalResults.setOption(option_schoolTotalResults);
            common.echart.hideLoading(echart_schoolTotalResults);
            break;
          }
          case 'schoolTeachingAchievements': {
            var option_schoolTeachingAchievements = {
              color: ["#ff3f66", "#fb8b1b", "#fdd51d", "#a5d67b", "#5ab57c", "#0fcbe6", "#448cfb", "#456fde", "#8054cd", "#b652cc"],
              backgroundColor: '',
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                itemGap: 15,
                textStyle: {color: '#e7e7e7', fontSize: 14},
                data: []
              },
              series: [
                {
                  name: '各学科情况对比',
                  type: 'pie',
                  radius: '60%',
                  center: ['50%', '40%'],
                  data: [],
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
            for (var i = 0; i < data.pageList.datalist.length; i++) {
              var obj = {};
              obj['value'] = data.pageList.datalist[i].count;
              obj['name'] = data.pageList.datalist[i].subject;
              option_schoolTeachingAchievements.series[0].data.push(obj);
              option_schoolTeachingAchievements.legend.data[i] = data.pageList.datalist[i].subject;
            }
            echart_schoolTeachingAchievements.setOption(option_schoolTeachingAchievements);
            common.echart.hideLoading(echart_schoolTeachingAchievements);
            break;
          }
          case 'schoolGradeTeachingAchievements': {
            var option_schoolGradeTeachingAchievements = {
              color: ["#0fcbe6", '#3f86ea', '#53bb77', '#ff3f66', '#fdd51d', '#fd8c1d', '#b653cf', '#316ec5', '#14c7e0'],
              backgroundColor: '',
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                itemGap: 15,
                textStyle: {color: '#e7e7e7', fontSize: 14},
                data: []
              },
              series: [
                {
                  name: '各年级情况占比',
                  type: 'pie',
                  radius: '62%',
                  center: ['50%', '40%'],
                  data: [],
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
            for (var i = 0; i < data.pageList.datalist.length; i++) {
              var obj = {};
              obj['value'] = data.pageList.datalist[i].count;
              obj['name'] = data.pageList.datalist[i].grade;
              option_schoolGradeTeachingAchievements.series[0].data.push(obj);
              option_schoolGradeTeachingAchievements.legend.data[i] = data.pageList.datalist[i].grade;
            }
            echart_schoolGradeTeachingAchievements.setOption(option_schoolGradeTeachingAchievements);
            common.echart.hideLoading(echart_schoolGradeTeachingAchievements);
            break;
          }
        }
      }


      /**
       * @description       各区域学校教研情况对比
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param subjectId   学科id
       * @param gradeId     年级id
       * @param schoolYear  学年
       */

      function areaSchoolCasecContrast(time, phaseId, subjectId, schoolYear) {
        echart_school_teaching_contrast = common.echart.init(document.getElementById('school_teaching_contrast'));
        common.echart.showLoading(echart_school_teaching_contrast);
        var url = '/jy/open?path=/api/statistic/area/city_orgtotal_area?areaId=' + common.areaid;
        $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&schoolYear=' + schoolYear + '&errorDomId=school_teaching_contrast')
          .success(function (result) {
              if (result['code'] == 1) {
                render(result.data, 'school_teaching_contrast');
              }
            }
          );
      }


      $('body').on('selectChange', '#areaSchool', function () {
        areaSchoolCasecContrast($('#areaSchool').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      });

      /**
       * @description       各学校教研成果总量
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param subjectId   学科id
       * @param schoolYear  学年
       */

      function schoolCasecContrast(time, phaseId, subjectId, schoolYear) {
        echart_schoolTotalResults = common.echart.init(document.getElementById('schoolTotalResults'));
        common.echart.showLoading(echart_schoolTotalResults);
        var url = '/jy/open?path=/api/statistic/area/area_orgtotal_org?areaId=' + common.areaid;
        var result = teachingSituationStatisticsData.areaOrgtotalOrgData;
        /*$.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&schoolYear=' + schoolYear + '&errorDomId=schoolTotalResultsWrap')
          .success(function (result) {*/
              if (result['code'] == 1) {
                render(result.data, 'schoolTotalResults');
                var html = "";
                $.each(result.data.dataList, function (index, item) {
                  var cls = '';
                  if ((index + ((currentPage - 1) * 10)) < 3) {
                    cls = 'num1';
                  }
                  html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>" +
                    ( ((currentPage - 1) * 10) + (index + 1) ) + "</span><strong class='strong' title='" + item.orgName + "'>" + item.orgName + "</strong></td>" +
                    " <td>" + item.count + "</td><td>" + ((item.count / (result.data.allCount || 1)) * 100).toFixed(2) +
                    '%' + "</td></tr>";

                });
                $('#rank_percent3').html(html);
                $('#schtotal').html(result.data.allCount);
              }
         /*   }
          );*/
      }

      $('body').on('selectChange', '#schtotalSelect', function () {
        schoolCasecContrast($('#schtotalSelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      });


      /**
       * @description       学校教研成果
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param subjectId   学科id
       * @param gradeId     年级id
       * @param schoolYear  学年
       */

      function schoolTeaching(time, phaseId, subjectId, gradeId, schoolYear) {
        echart_schoolRoutineTeaching = common.echart.init(document.getElementById('schoolRoutineTeaching'));
        common.echart.showLoading(echart_schoolRoutineTeaching);
        echart_schoolEducationalResearch = common.echart.init(document.getElementById('schoolEducationalResearch'));
        common.echart.showLoading(echart_schoolEducationalResearch);
        echart_schoolTeachingManagement = common.echart.init(document.getElementById('schoolTeachingManagement'));
        common.echart.showLoading(echart_schoolTeachingManagement);
        var url = "";
        var result = null;
        if (common.role == 'city') {
          url = '/jy/open?path=/api/statistic/area/city_orgdata?areaId=' + common.areaid;
        } else if (common.role == 'county') {
          url = '/jy/open?path=/api/statistic/area/area_orgdata?areaId=' + common.areaid;
          result = teachingSituationStatisticsData.areaOrgData;
        } else if (common.role == 'school') {
          url = '/jy/open?path=/api/statistic/org/sch_jy_manage_data?orgId=' + common.orgid;
        }
        /*$.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=schoolWrap')
          .success(function (result) {*/
              if (result['code'] == 1) {
                render(result.data, 'schoolRoutineTeaching');
                render(result.data, 'schoolEducationalResearch');
                render(result.data, 'schoolTeachingManagement');
                $('#routine_teaching').html(
                  result.data.jiaoan_write + result.data.kejian_write + result.data.fansi_write +
                  result.data.plansummary_write
                );
                $('#educational_research').html(
                  result.data.activity_issue + result.data.xjjy_org_issue + result.data.record_res +
                  result.data.listen_write + result.data.thesis_write
                );
                $('#teaching_management').html(
                  result.data.jiaoan_scan + result.data.kejian_scan + result.data.fansi_scan +
                  result.data.listen_scan + result.data.activity_scan + result.data.plansummary_scan +
                  result.data.thesis_scan
                );
              }
         /*   }
          );*/
      }


      /**
       * @description       各学科情况对比
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param schoolYear  学年
       */
      var currentPage = 1;

      function DisciplineComparison(time, phaseId, schoolYear, currentPage, isPaging) {
        currentPage = currentPage || 1;
        echart_schoolTeachingAchievements = common.echart.init(document.getElementById('schoolTeachingAchievements'));
        common.echart.showLoading(echart_schoolTeachingAchievements);
        $.getJSON(service.prefix + '/jy/open?path=/api/statistic/org/sch_jy_subject?orgId=' + common.orgid + '&time=' + time +
          '&phaseId=' + phaseId + '&schoolYear=' + schoolYear + '&currentPage=' + currentPage + '&errorDomId=schoolTeachingAchievementsWrap')
          .success(function (result) {
              if (result['code'] == 1) {
                render(result.data, 'schoolTeachingAchievements');
                var html = "";
                $.each(result.data.pageList.datalist, function (index, item) {
                  var cls = '';
                  if ((index + ((currentPage - 1) * 10)) < 3) {
                    cls = 'num1';
                  }
                  html += "<tr><td style='padding-left:10%;text-align:left;width:40%;'><span class='num " + cls + "'>" +
                    ( ((currentPage - 1) * 10) + (index + 1) ) + "</span><strong class='strong' title='" + item.subject + "'>"
                    + item.subject + "</strong></td>" +
                    " <td style='width:30%;'>" + item.count + "</td><td style='width:30%;'>" +
                    ((item.count / (result.data.allCount || 1)) * 100).toFixed(2) + '%' + "</td></tr>";

                });
                $('#subschoolAchievements').html(result.data.allCount);
                $('#rank_percent2').html(html);
                if (!isPaging) {
                  $('#pageTool2').html('');
                }
                if (result['data']['pageList']['totalPages'] > 1 && !isPaging)
                  renderPage('pageTool2', result['data']['pageList']['totalCount']);
              }
            }
          );
      }

      $('body').on('selectChange', '#subjectContrast', function () {
        DisciplineComparison($('#subjectContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
      });

      function renderPage(domId, total) {
        var p = new Page();
        p.init({
          target: '#' + domId, pagesize: 10, pageCount: 1,
          count: total, callback: function (current) {
            DisciplineComparison($('#subjectContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
              $('#schoolYear .selectTop').attr('data-value'), current, true);

          }
        });
      }


      /**
       * @description       各年级情况对比
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param schoolYear  学年
       */

      function gradeContrast(time, phaseId, schoolYear, currentPage, isPaging) {
        currentPage = currentPage || 1;
        echart_schoolGradeTeachingAchievements = common.echart.init(document.getElementById('schoolGradeTeachingAchievements'));
        common.echart.showLoading(echart_schoolGradeTeachingAchievements);
        $.getJSON(service.prefix + '/jy/open?path=/api/statistic/org/sch_jy_grade?orgId=' + common.orgid + '&time=' + time +
          '&phaseId=' + phaseId + '&schoolYear=' + schoolYear + '&currentPage=' + currentPage + '&errorDomId=schoolGradeTeachingAchievementsError')
          .success(function (result) {
              if (result['code'] == 1) {
                render(result.data, 'schoolGradeTeachingAchievements');
                var html = "";
                $.each(result.data.pageList.datalist, function (index, item) {
                  var cls = '';
                  if ((index + ((currentPage - 1) * 10)) < 3) {
                    cls = 'num1';
                  }
                  html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>" +
                    ( ((currentPage - 1) * 10) + (index + 1) ) + "</span><strong class='strong' title='" + item.grade + "'>" + item.grade + "</strong></td>" +
                    " <td>" + item.count + "</td><td>" + ((item.count / (result.data.allCount || 1)) * 100).toFixed(2) +
                    '%' + "</td></tr>";

                });
                $('#rank_percent1').html(html);
                $('#gardeschoolAchievements').html(result.data.allCount);
                if (!isPaging) {
                  $('#pageTool3').html('');
                }
                if (result['data']['pageList']['totalPages'] > 1 && !isPaging)
                  renderPage1('pageTool3', result['data']['pageList']['totalCount']);
              }
            }
          );
      }

      function renderPage1(domId, total) {
        var p = new Page();
        p.init({
          target: '#' + domId, pagesize: 10, pageCount: 1,
          count: total, callback: function (current) {
            gradeContrast($('#gradeContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
              $('#schoolYear .selectTop').attr('data-value'), current, true);
          }
        });
      }

      $('body').on('selectChange', '#gradeContrast', function () {
        gradeContrast($('#gradeContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
      });


      $('body').on('click', '#searchBtn', function () {
        if (common.role == 'city') {
          areaSchoolCasecContrast($('#areaSchool').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
            $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
        }
        if (common.role == 'school') {
          $('#subject').hide();
          $('#grade').hide();
          schoolTeaching('', $('#studySection .selectTop').attr('data-value'), '', '',
            $('#schoolYear .selectTop').attr('data-value'));
          gradeContrast($('#gradeContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
            $('#schoolYear .selectTop').attr('data-value'));
          DisciplineComparison($('#subjectContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
            $('#schoolYear .selectTop').attr('data-value'));
        } else {
          schoolTeaching('', $('#studySection .selectTop').attr('data-value'),
            $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
            $('#schoolYear .selectTop').attr('data-value'));
        }
        if (common.role == 'county') {
          schoolCasecContrast($('#schtotalSelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
            $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
        }

      });
      $('#searchBtn').trigger('click');

    });
})