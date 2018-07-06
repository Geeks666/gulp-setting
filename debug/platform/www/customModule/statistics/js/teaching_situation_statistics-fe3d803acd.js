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

  define('', ['jquery', 'service', 'tools', 'common', 'select', 'page'], function ($, service, tools, common, select, Page) {
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
        case 'school_teaching_contrast':
          {
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
        case 'schoolRoutineTeaching':
          {
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
                textStyle: { color: '#e7e7e7', fontSize: 14 },
                data: ['教案', '课件', '教学反思', '计划总结']
              },
              series: [{
                name: '常规教学',
                type: 'pie',
                radius: '70%',
                center: ['50%', '40%'],
                data: [{ value: data.jiaoan_write, name: '教案' }, { value: data.kejian_write, name: '课件' }, { value: data.fansi_write, name: '教学反思' }, { value: data.plansummary_write, name: '计划总结' }]
              }]
            };
            echart_schoolRoutineTeaching.setOption(option_schoolRoutineTeaching);
            common.echart.hideLoading(echart_schoolRoutineTeaching);
            break;
          }
        case 'schoolEducationalResearch':
          {
            var echart_schoolEducationalR = {
              color: ['#a4d47a', '#da60fb', '#ff3f66', '#0fcbe4', '#eaec68', '#408bf1', '#fe8b1e', '#fdd51d', '#54bb76', '#3055b3', '#8154cc'],
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
              series: [{
                name: "占比",
                type: 'pie',
                radius: ['38%', '58%'],
                center: ['53%', '37%'],
                textStyle: {
                  color: '#333'
                },
                data: [{ value: data.activity_issue, name: '集体备课' }, { value: data.xjjy_org_issue, name: '校际教研' }, { value: data.record_res, name: '成长档案' }, { value: data.listen_write, name: '听课记录' }, { value: data.thesis_write, name: '教学文章' }]
              }]
            };
            echart_schoolEducationalResearch.setOption(echart_schoolEducationalR);
            common.echart.hideLoading(echart_schoolEducationalResearch);
          }
        case 'schoolTeachingManagement':
          {
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
                data: ['查阅教案', '查阅课件', '查阅反思', '查阅听课记录', '查阅集体备课', '查阅计划总结', '查阅教学文章']
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
                areaStyle: { normal: {} },
                data: [data.jiaoan_scan, data.kejian_scan, data.fansi_scan, data.listen_scan, data.activity_scan, data.plansummary_scan, data.thesis_scan]
              }]
            };
            echart_schoolTeachingManagement.setOption(echart_schoolTeachingM);
            common.echart.hideLoading(echart_schoolTeachingManagement);
            break;
          }
        case 'schoolTotalResults':
          {
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
                textStyle: { color: '#e7e7e7', fontSize: 12 },
                data: [],
                formatter: function formatter(name) {
                  return tools.hideTextByLen(name, 20);
                },
                tooltip: {
                  show: true
                }
              },
              series: [{
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
              }]
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
        case 'schoolTeachingAchievements':
          {
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
                textStyle: { color: '#e7e7e7', fontSize: 14 },
                data: []
              },
              series: [{
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
              }]
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
        case 'schoolGradeTeachingAchievements':
          {
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
                textStyle: { color: '#e7e7e7', fontSize: 14 },
                data: []
              },
              series: [{
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
              }]
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
      $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&schoolYear=' + schoolYear + '&errorDomId=school_teaching_contrast').success(function (result) {
        if (result['code'] == 1) {
          render(result.data, 'school_teaching_contrast');
        }
      });
    }

    $('body').on('selectChange', '#areaSchool', function () {
      areaSchoolCasecContrast($('#areaSchool').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
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
      $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&schoolYear=' + schoolYear + '&errorDomId=schoolTotalResultsWrap').success(function (result) {
        if (result['code'] == 1) {
          render(result.data, 'schoolTotalResults');
          var html = "";
          $.each(result.data.dataList, function (index, item) {
            var cls = '';
            if (index + (currentPage - 1) * 10 < 3) {
              cls = 'num1';
            }
            html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>" + ((currentPage - 1) * 10 + (index + 1)) + "</span><strong class='strong' title='" + item.orgName + "'>" + item.orgName + "</strong></td>" + " <td>" + item.count + "</td><td>" + (item.count / (result.data.allCount || 1) * 100).toFixed(2) + '%' + "</td></tr>";
          });
          $('#rank_percent3').html(html);
          $('#schtotal').html(result.data.allCount);
        }
      });
    }

    $('body').on('selectChange', '#schtotalSelect', function () {
      schoolCasecContrast($('#schtotalSelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
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
      if (common.role == 'city') {
        url = '/jy/open?path=/api/statistic/area/city_orgdata?areaId=' + common.areaid;
      } else if (common.role == 'county') {
        url = '/jy/open?path=/api/statistic/area/area_orgdata?areaId=' + common.areaid;
      } else if (common.role == 'school') {
        url = '/jy/open?path=/api/statistic/org/sch_jy_manage_data?orgId=' + common.orgid;
      }
      $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&errorDomId=schoolWrap').success(function (result) {
        if (result['code'] == 1) {
          render(result.data, 'schoolRoutineTeaching');
          render(result.data, 'schoolEducationalResearch');
          render(result.data, 'schoolTeachingManagement');
          $('#routine_teaching').html(result.data.jiaoan_write + result.data.kejian_write + result.data.fansi_write + result.data.plansummary_write);
          $('#educational_research').html(result.data.activity_issue + result.data.xjjy_org_issue + result.data.record_res + result.data.listen_write + result.data.thesis_write);
          $('#teaching_management').html(result.data.jiaoan_scan + result.data.kejian_scan + result.data.fansi_scan + result.data.listen_scan + result.data.activity_scan + result.data.plansummary_scan + result.data.thesis_scan);
        }
      });
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
      $.getJSON(service.prefix + '/jy/open?path=/api/statistic/org/sch_jy_subject?orgId=' + common.orgid + '&time=' + time + '&phaseId=' + phaseId + '&schoolYear=' + schoolYear + '&currentPage=' + currentPage + '&errorDomId=schoolTeachingAchievementsWrap').success(function (result) {
        if (result['code'] == 1) {
          render(result.data, 'schoolTeachingAchievements');
          var html = "";
          $.each(result.data.pageList.datalist, function (index, item) {
            var cls = '';
            if (index + (currentPage - 1) * 10 < 3) {
              cls = 'num1';
            }
            html += "<tr><td style='padding-left:10%;text-align:left;width:40%;'><span class='num " + cls + "'>" + ((currentPage - 1) * 10 + (index + 1)) + "</span><strong class='strong' title='" + item.subject + "'>" + item.subject + "</strong></td>" + " <td style='width:30%;'>" + item.count + "</td><td style='width:30%;'>" + (item.count / (result.data.allCount || 1) * 100).toFixed(2) + '%' + "</td></tr>";
          });
          $('#subschoolAchievements').html(result.data.allCount);
          $('#rank_percent2').html(html);
          if (!isPaging) {
            $('#pageTool2').html('');
          }
          if (result['data']['pageList']['totalPages'] > 1 && !isPaging) renderPage('pageTool2', result['data']['pageList']['totalCount']);
        }
      });
    }

    $('body').on('selectChange', '#subjectContrast', function () {
      DisciplineComparison($('#subjectContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });

    function renderPage(domId, total) {
      var p = new Page();
      p.init({
        target: '#' + domId, pagesize: 10, pageCount: 1,
        count: total, callback: function callback(current) {
          DisciplineComparison($('#subjectContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'), current, true);
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
      $.getJSON(service.prefix + '/jy/open?path=/api/statistic/org/sch_jy_grade?orgId=' + common.orgid + '&time=' + time + '&phaseId=' + phaseId + '&schoolYear=' + schoolYear + '&currentPage=' + currentPage + '&errorDomId=schoolGradeTeachingAchievementsError').success(function (result) {
        if (result['code'] == 1) {
          render(result.data, 'schoolGradeTeachingAchievements');
          var html = "";
          $.each(result.data.pageList.datalist, function (index, item) {
            var cls = '';
            if (index + (currentPage - 1) * 10 < 3) {
              cls = 'num1';
            }
            html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>" + ((currentPage - 1) * 10 + (index + 1)) + "</span><strong class='strong' title='" + item.grade + "'>" + item.grade + "</strong></td>" + " <td>" + item.count + "</td><td>" + (item.count / (result.data.allCount || 1) * 100).toFixed(2) + '%' + "</td></tr>";
          });
          $('#rank_percent1').html(html);
          $('#gardeschoolAchievements').html(result.data.allCount);
          if (!isPaging) {
            $('#pageTool3').html('');
          }
          if (result['data']['pageList']['totalPages'] > 1 && !isPaging) renderPage1('pageTool3', result['data']['pageList']['totalCount']);
        }
      });
    }

    function renderPage1(domId, total) {
      var p = new Page();
      p.init({
        target: '#' + domId, pagesize: 10, pageCount: 1,
        count: total, callback: function callback(current) {
          gradeContrast($('#gradeContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'), current, true);
        }
      });
    }

    $('body').on('selectChange', '#gradeContrast', function () {
      gradeContrast($('#gradeContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
    });

    $('body').on('click', '#searchBtn', function () {
      if (common.role == 'city') {
        areaSchoolCasecContrast($('#areaSchool').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      }
      if (common.role == 'school') {
        $('#subject').hide();
        $('#grade').hide();
        schoolTeaching('', $('#studySection .selectTop').attr('data-value'), '', '', $('#schoolYear .selectTop').attr('data-value'));
        gradeContrast($('#gradeContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
        DisciplineComparison($('#subjectContrast').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      } else {
        schoolTeaching('', $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      }
      if (common.role == 'county') {
        schoolCasecContrast($('#schtotalSelect').attr('data-value'), $('#studySection .selectTop').attr('data-value'), $('#subject .selectTop').attr('data-value'), $('#schoolYear .selectTop').attr('data-value'));
      }
    });
    $('#searchBtn').trigger('click');
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3RlYWNoaW5nX3NpdHVhdGlvbl9zdGF0aXN0aWNzLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25maWciLCJiYXNlVXJsIiwicGF0aHMiLCJjb25maWdwYXRocyIsImRlZmluZSIsIiQiLCJzZXJ2aWNlIiwidG9vbHMiLCJjb21tb24iLCJzZWxlY3QiLCJQYWdlIiwib24iLCJpbmRleCIsIm5leHQiLCJmaW5kIiwiaGlkZSIsImVxIiwic2hvdyIsInRleHQiLCJlY2hhcnRfc2Nob29sX3RlYWNoaW5nX2NvbnRyYXN0IiwiZWNoYXJ0IiwiaW5pdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJlY2hhcnRfc2Nob29sUm91dGluZVRlYWNoaW5nIiwiZWNoYXJ0X3NjaG9vbEVkdWNhdGlvbmFsUmVzZWFyY2giLCJlY2hhcnRfc2Nob29sVGVhY2hpbmdNYW5hZ2VtZW50IiwiZWNoYXJ0X3NjaG9vbFRvdGFsUmVzdWx0cyIsImVjaGFydF9zY2hvb2xUZWFjaGluZ0FjaGlldmVtZW50cyIsImVjaGFydF9zY2hvb2xHcmFkZVRlYWNoaW5nQWNoaWV2ZW1lbnRzIiwicmVuZGVyIiwiZGF0YSIsImNhdGVnb3J5IiwiZWNoYXJ0X3NjaG9vbF90ZWFjaGluZ19jIiwiY29sb3IiLCJ0ZXh0U3R5bGUiLCJmb250U2l6ZSIsImdyaWQiLCJ0b3AiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJjb250YWluTGFiZWwiLCJsZWdlbmQiLCJ3aWR0aCIsIml0ZW1XaWR0aCIsInhBeGlzIiwidHlwZSIsImF4aXNMYWJlbCIsImF4aXNMaW5lIiwibGluZVN0eWxlIiwiYXhpc1RpY2siLCJ5QXhpcyIsInNwbGl0TGluZSIsInRvb2x0aXAiLCJ0cmlnZ2VyIiwiYXhpc1BvaW50ZXIiLCJzZXJpZXMiLCJuYW1lIiwiYmFyV2lkdGgiLCJpIiwibGVuZ3RoIiwiYXJlYU5hbWUiLCJjb3VudCIsInNldE9wdGlvbiIsImhpZGVMb2FkaW5nIiwib3B0aW9uX3NjaG9vbFJvdXRpbmVUZWFjaGluZyIsImJhY2tncm91bmRDb2xvciIsImZvcm1hdHRlciIsIngiLCJ5IiwiaXRlbUdhcCIsInJhZGl1cyIsImNlbnRlciIsInZhbHVlIiwiamlhb2FuX3dyaXRlIiwia2VqaWFuX3dyaXRlIiwiZmFuc2lfd3JpdGUiLCJwbGFuc3VtbWFyeV93cml0ZSIsImVjaGFydF9zY2hvb2xFZHVjYXRpb25hbFIiLCJjYWxjdWxhYmxlIiwiYWN0aXZpdHlfaXNzdWUiLCJ4amp5X29yZ19pc3N1ZSIsInJlY29yZF9yZXMiLCJsaXN0ZW5fd3JpdGUiLCJ0aGVzaXNfd3JpdGUiLCJlY2hhcnRfc2Nob29sVGVhY2hpbmdNIiwiYm91bmRhcnlHYXAiLCJhbGlnbldpdGhMYWJlbCIsInN0YWNrIiwiaXRlbVN0eWxlIiwibm9ybWFsIiwiYXJlYVN0eWxlIiwiamlhb2FuX3NjYW4iLCJrZWppYW5fc2NhbiIsImZhbnNpX3NjYW4iLCJsaXN0ZW5fc2NhbiIsImFjdGl2aXR5X3NjYW4iLCJwbGFuc3VtbWFyeV9zY2FuIiwidGhlc2lzX3NjYW4iLCJvcHRpb25fc2Nob29sVG90YWxSZXN1bHRzIiwiaGlkZVRleHRCeUxlbiIsImxhYmVsTGluZSIsImVtcGhhc2lzIiwic2hhZG93Qmx1ciIsInNoYWRvd09mZnNldFgiLCJzaGFkb3dDb2xvciIsImRhdGFMaXN0Iiwib2JqIiwib3JnTmFtZSIsInB1c2giLCJsYWJlbCIsIm9wdGlvbl9zY2hvb2xUZWFjaGluZ0FjaGlldmVtZW50cyIsInBhZ2VMaXN0IiwiZGF0YWxpc3QiLCJzdWJqZWN0Iiwib3B0aW9uX3NjaG9vbEdyYWRlVGVhY2hpbmdBY2hpZXZlbWVudHMiLCJncmFkZSIsImFyZWFTY2hvb2xDYXNlY0NvbnRyYXN0IiwidGltZSIsInBoYXNlSWQiLCJzdWJqZWN0SWQiLCJzY2hvb2xZZWFyIiwic2hvd0xvYWRpbmciLCJ1cmwiLCJhcmVhaWQiLCJnZXRKU09OIiwicHJlZml4Iiwic3VjY2VzcyIsInJlc3VsdCIsImF0dHIiLCJzY2hvb2xDYXNlY0NvbnRyYXN0IiwiaHRtbCIsImVhY2giLCJpdGVtIiwiY2xzIiwiY3VycmVudFBhZ2UiLCJhbGxDb3VudCIsInRvRml4ZWQiLCJzY2hvb2xUZWFjaGluZyIsImdyYWRlSWQiLCJyb2xlIiwib3JnaWQiLCJEaXNjaXBsaW5lQ29tcGFyaXNvbiIsImlzUGFnaW5nIiwicmVuZGVyUGFnZSIsImRvbUlkIiwidG90YWwiLCJwIiwidGFyZ2V0IiwicGFnZXNpemUiLCJwYWdlQ291bnQiLCJjYWxsYmFjayIsImN1cnJlbnQiLCJncmFkZUNvbnRyYXN0IiwicmVuZGVyUGFnZTEiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxXQUFTLEtBREk7QUFFYkMsU0FBTztBQUNMLGtCQUFjO0FBRFQ7QUFGTSxDQUFmO0FBTUFILFFBQVEsQ0FBQyxZQUFELENBQVIsRUFBd0IsVUFBVUksV0FBVixFQUF1QjtBQUM3QztBQUNBSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7O0FBRUFDLFNBQU8sRUFBUCxFQUFXLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsT0FBdEIsRUFBK0IsUUFBL0IsRUFBeUMsUUFBekMsRUFBbUQsTUFBbkQsQ0FBWCxFQUNFLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXFDQyxNQUFyQyxFQUE2Q0MsSUFBN0MsRUFBbUQ7QUFDakRMLE1BQUUsTUFBRixFQUFVTSxFQUFWLENBQWEsT0FBYixFQUFzQixnQkFBdEIsRUFBd0MsWUFBWTtBQUNsRCxVQUFJTixFQUFFLElBQUYsRUFBUU8sS0FBUixNQUFtQixDQUF2QixFQUEwQjtBQUN4QlAsVUFBRSxhQUFGLEVBQWlCUSxJQUFqQixHQUF3QkMsSUFBeEIsQ0FBNkIsSUFBN0IsRUFBbUNDLElBQW5DLEdBQTBDQyxFQUExQyxDQUE2QyxDQUE3QyxFQUFnREMsSUFBaEQ7QUFDQVosVUFBRSxpQkFBRixFQUFxQlEsSUFBckIsR0FBNEJDLElBQTVCLENBQWlD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RUFDRTdILEVBQUUsd0JBQUYsRUFBNEI2SCxJQUE1QixDQUFpQyxZQUFqQyxDQURGO0FBRUFhLDZCQUFxQjFJLEVBQUUsa0JBQUYsRUFBc0I2SCxJQUF0QixDQUEyQixZQUEzQixDQUFyQixFQUErRDdILEVBQUUsMEJBQUYsRUFBOEI2SCxJQUE5QixDQUFtQyxZQUFuQyxDQUEvRCxFQUNFN0gsRUFBRSx3QkFBRixFQUE0QjZILElBQTVCLENBQWlDLFlBQWpDLENBREY7QUFFRCxPQVRELE1BU087QUFDTFMsdUJBQWUsRUFBZixFQUFtQnRJLEVBQUUsMEJBQUYsRUFBOEI2SCxJQUE5QixDQUFtQyxZQUFuQyxDQUFuQixFQUNFN0gsRUFBRSxxQkFBRixFQUF5QjZILElBQXpCLENBQThCLFlBQTlCLENBREYsRUFDK0M3SCxFQUFFLG1CQUFGLEVBQXVCNkgsSUFBdkIsQ0FBNEIsWUFBNUIsQ0FEL0MsRUFFRTdILEVBQUUsd0JBQUYsRUFBNEI2SCxJQUE1QixDQUFpQyxZQUFqQyxDQUZGO0FBR0Q7QUFDRCxVQUFJMUgsT0FBT3FJLElBQVAsSUFBZSxRQUFuQixFQUE2QjtBQUMzQlYsNEJBQW9COUgsRUFBRSxpQkFBRixFQUFxQjZILElBQXJCLENBQTBCLFlBQTFCLENBQXBCLEVBQTZEN0gsRUFBRSwwQkFBRixFQUE4QjZILElBQTlCLENBQW1DLFlBQW5DLENBQTdELEVBQ0U3SCxFQUFFLHFCQUFGLEVBQXlCNkgsSUFBekIsQ0FBOEIsWUFBOUIsQ0FERixFQUMrQzdILEVBQUUsd0JBQUYsRUFBNEI2SCxJQUE1QixDQUFpQyxZQUFqQyxDQUQvQztBQUVEO0FBRUYsS0F4QkQ7QUF5QkE3SCxNQUFFLFlBQUYsRUFBZ0JrRCxPQUFoQixDQUF3QixPQUF4QjtBQUVELEdBcnJCSDtBQXNyQkQsQ0ExckJEIiwiZmlsZSI6ImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL3RlYWNoaW5nX3NpdHVhdGlvbl9zdGF0aXN0aWNzLWZlM2Q4MDNhY2QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdjdXN0b21Db25mJzogJ3N0YXRpc3RpY3MvanMvY3VzdG9tQ29uZi5qcydcclxuICB9XHJcbn0pO1xyXG5yZXF1aXJlKFsnY3VzdG9tQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICAvLyBjb25maWdwYXRocy5wYXRocy5kaWFsb2cgPSBcIm15c3BhY2UvanMvYXBwRGlhbG9nLmpzXCI7XHJcbiAgcmVxdWlyZS5jb25maWcoY29uZmlncGF0aHMpO1xyXG5cclxuICBkZWZpbmUoJycsIFsnanF1ZXJ5JywgJ3NlcnZpY2UnLCAndG9vbHMnLCAnY29tbW9uJywgJ3NlbGVjdCcsICdwYWdlJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgc2VydmljZSwgdG9vbHMsIGNvbW1vbiwgc2VsZWN0LCBQYWdlKSB7XHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnI3NjaG9vbFllYXIgbGknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCQodGhpcykuaW5kZXgoKSAhPSAwKSB7XHJcbiAgICAgICAgICAkKCcjYXJlYVNjaG9vbCcpLm5leHQoKS5maW5kKCdsaScpLmhpZGUoKS5lcSgwKS5zaG93KCk7XHJcbiAgICAgICAgICAkKCcjc2NodG90YWxTZWxlY3QnKS5uZXh0KCkuZmluZCgnbGknKS5oaWRlKCkuZXEoMCkuc2hvdygpO1xyXG4gICAgICAgICAgJCgnI3N1YmplY3RDb250cmFzdCcpLm5leHQoKS5maW5kKCdsaScpLmhpZGUoKS5lcSgwKS5zaG93KCk7XHJcbiAgICAgICAgICAkKCcjZ3JhZGVDb250cmFzdCcpLm5leHQoKS5maW5kKCdsaScpLmhpZGUoKS5lcSgwKS5zaG93KCk7XHJcbiAgICAgICAgICAkKCcjYXJlYVNjaG9vbCBzcGFuLCNzY2h0b3RhbFNlbGVjdCBzcGFuLCNzdWJqZWN0Q29udHJhc3Qgc3BhbiwjZ3JhZGVDb250cmFzdCBzcGFuJykudGV4dCgn5YWo5a2m5bm0Jyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKCcjYXJlYVNjaG9vbCcpLm5leHQoKS5maW5kKCdsaScpLnNob3coKTtcclxuICAgICAgICAgICQoJyNzY2h0b3RhbFNlbGVjdCcpLm5leHQoKS5maW5kKCdsaScpLnNob3coKTtcclxuICAgICAgICAgICQoJyNzdWJqZWN0Q29udHJhc3QnKS5uZXh0KCkuZmluZCgnbGknKS5zaG93KCk7XHJcbiAgICAgICAgICAkKCcjZ3JhZGVDb250cmFzdCcpLm5leHQoKS5maW5kKCdsaScpLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAvL+WQhOWMuuWfn+WtpuagoeaVmeeglOaDheWGteWvueavlFxyXG4gICAgICB2YXIgZWNoYXJ0X3NjaG9vbF90ZWFjaGluZ19jb250cmFzdCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nob29sX3RlYWNoaW5nX2NvbnRyYXN0JykpO1xyXG5cclxuICAgICAgLy/lrabmoKHmlZnnoJTkuI7nrqHnkIYtLeaIkOaenOWIhuW4gyAg5bi46KeE5pWZ5a2mXHJcbiAgICAgIHZhciBlY2hhcnRfc2Nob29sUm91dGluZVRlYWNoaW5nID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2hvb2xSb3V0aW5lVGVhY2hpbmcnKSk7XHJcblxyXG4gICAgICAvL+WtpuagoeaVmeeglOS4jueuoeeQhi0t5oiQ5p6c5YiG5biDICDmlZnogrLnp5HnoJRcclxuICAgICAgdmFyIGVjaGFydF9zY2hvb2xFZHVjYXRpb25hbFJlc2VhcmNoID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2hvb2xFZHVjYXRpb25hbFJlc2VhcmNoJykpO1xyXG5cclxuICAgICAgLy/lrabmoKHmlZnnoJTkuI7nrqHnkIYtLeaIkOaenOWIhuW4gyAg5pWZ5a2m566h55CGXHJcbiAgICAgIHZhciBlY2hhcnRfc2Nob29sVGVhY2hpbmdNYW5hZ2VtZW50ID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2hvb2xUZWFjaGluZ01hbmFnZW1lbnQnKSk7XHJcblxyXG4gICAgICAvL+WQhOagoeaVmeeglOaIkOaenOWvueavlCAg5a2m5qCh5pWZ56CU5oiQ5p6c5oC76YePXHJcbiAgICAgIHZhciBlY2hhcnRfc2Nob29sVG90YWxSZXN1bHRzID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2hvb2xUb3RhbFJlc3VsdHMnKSk7XHJcblxyXG4gICAgICAvL+WQhOWtpuenkeaDheWGteWvueavlCAg5a2m5qCh5pWZ56CU5oiQ5p6cXHJcbiAgICAgIHZhciBlY2hhcnRfc2Nob29sVGVhY2hpbmdBY2hpZXZlbWVudHMgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjaG9vbFRlYWNoaW5nQWNoaWV2ZW1lbnRzJykpO1xyXG5cclxuICAgICAgLy/lkITlubTnuqfmg4XlhrXlr7nmr5QgIOWtpuagoeaVmeeglOaIkOaenFxyXG4gICAgICB2YXIgZWNoYXJ0X3NjaG9vbEdyYWRlVGVhY2hpbmdBY2hpZXZlbWVudHMgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjaG9vbEdyYWRlVGVhY2hpbmdBY2hpZXZlbWVudHMnKSk7XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyKGRhdGEsIGNhdGVnb3J5KSB7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeSkge1xyXG4gICAgICAgICAgY2FzZSAnc2Nob29sX3RlYWNoaW5nX2NvbnRyYXN0Jzoge1xyXG4gICAgICAgICAgICB2YXIgZWNoYXJ0X3NjaG9vbF90ZWFjaGluZ19jID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbXCIjMmZjODg1XCJdLFxyXG4gICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjOTJhY2NmJyxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgICAgICAgdG9wOiAnMTUlJyxcclxuICAgICAgICAgICAgICAgIGxlZnQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICByaWdodDogJzElJyxcclxuICAgICAgICAgICAgICAgIGJvdHRvbTogJzMlJyxcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICByaWdodDogMTAsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAwLFxyXG4gICAgICAgICAgICAgICAgaXRlbVdpZHRoOiAyNSxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCIjZDdkN2Q3XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbJ+W8gOmAmuepuumXtOaVsCddXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB4QXhpczogW3tcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXHJcbiAgICAgICAgICAgICAgICBheGlzTGFiZWw6IHtcclxuICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtdXHJcbiAgICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICAgICAgeUF4aXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcclxuICAgICAgICAgICAgICAgICAgc3BsaXRMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxyXG4gICAgICAgICAgICAgICAgYXhpc1BvaW50ZXI6IHsgLy8g5Z2Q5qCH6L205oyH56S65Zmo77yM5Z2Q5qCH6L206Kem5Y+R5pyJ5pWIXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaGFkb3cnIC8vIOm7mOiupOS4uuebtOe6v++8jOWPr+mAieS4uu+8midsaW5lJyB8ICdzaGFkb3cnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxyXG4gICAgICAgICAgICAgICAgYmFyV2lkdGg6IDIyLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBlY2hhcnRfc2Nob29sX3RlYWNoaW5nX2MueEF4aXNbMF0uZGF0YVtpXSA9IGRhdGFbaV0uYXJlYU5hbWU7XHJcbiAgICAgICAgICAgICAgZWNoYXJ0X3NjaG9vbF90ZWFjaGluZ19jLnNlcmllc1swXS5kYXRhW2ldID0gZGF0YVtpXS5jb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlY2hhcnRfc2Nob29sX3RlYWNoaW5nX2NvbnRyYXN0LnNldE9wdGlvbihlY2hhcnRfc2Nob29sX3RlYWNoaW5nX2MpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9zY2hvb2xfdGVhY2hpbmdfY29udHJhc3QpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3NjaG9vbFJvdXRpbmVUZWFjaGluZyc6IHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbl9zY2hvb2xSb3V0aW5lVGVhY2hpbmcgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnI2ZlYmIyNicsICcjM2Y4NmVhJywgJyNmZjNmNjYnLCAnIzUzYmI3NycsICcjYjY1M2NmJywgJyNkMDE3NGYnLCAnIzMxNmVjNScsICcjMTRjN2UwJywgJyNmZGQ1MWQnLCAnI2ZkOGMxZCddLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJycsXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifSA6IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIHk6ICdib3R0b20nLFxyXG4gICAgICAgICAgICAgICAgaXRlbUdhcDogMjAsXHJcbiAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtjb2xvcjogJyNlN2U3ZTcnLCBmb250U2l6ZTogMTR9LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogWyfmlZnmoYgnLCAn6K++5Lu2JywgJ+aVmeWtpuWPjeaAnScsICforqHliJLmgLvnu5MnXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICfluLjop4TmlZnlraYnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiAnNzAlJyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyOiBbJzUwJScsICc0MCUnXSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW1xyXG4gICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogZGF0YS5qaWFvYW5fd3JpdGUsIG5hbWU6ICfmlZnmoYgnfSxcclxuICAgICAgICAgICAgICAgICAgICB7dmFsdWU6IGRhdGEua2VqaWFuX3dyaXRlLCBuYW1lOiAn6K++5Lu2J30sXHJcbiAgICAgICAgICAgICAgICAgICAge3ZhbHVlOiBkYXRhLmZhbnNpX3dyaXRlLCBuYW1lOiAn5pWZ5a2m5Y+N5oCdJ30sXHJcbiAgICAgICAgICAgICAgICAgICAge3ZhbHVlOiBkYXRhLnBsYW5zdW1tYXJ5X3dyaXRlLCBuYW1lOiAn6K6h5YiS5oC757uTJ31cclxuICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZWNoYXJ0X3NjaG9vbFJvdXRpbmVUZWFjaGluZy5zZXRPcHRpb24ob3B0aW9uX3NjaG9vbFJvdXRpbmVUZWFjaGluZyk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3NjaG9vbFJvdXRpbmVUZWFjaGluZyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAnc2Nob29sRWR1Y2F0aW9uYWxSZXNlYXJjaCc6IHtcclxuICAgICAgICAgICAgdmFyIGVjaGFydF9zY2hvb2xFZHVjYXRpb25hbFIgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnI2E0ZDQ3YScsICcjZGE2MGZiJywgJyNmZjNmNjYnLCAnIzBmY2JlNCcsICcjZWFlYzY4JywgJyM0MDhiZjEnLCAnI2ZlOGIxZScsICcjZmRkNTFkJywgJyM1NGJiNzYnLCAnIzMwNTViMycsXHJcbiAgICAgICAgICAgICAgICAnIzgxNTRjYyddLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogXCJ7YX0gPGJyLz57Yn0gOiB7Y30gKHtkfSUpXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgeDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICB5OiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICAgIGl0ZW1HYXA6IDEwLFxyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFsn6ZuG5L2T5aSH6K++JywgJ+agoemZheaVmeeglCcsICfmiJDplb/moaPmoYgnLCAn5ZCs6K++6K6w5b2VJywgJ+aVmeWtpuaWh+eroCddXHJcbiAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgY2FsY3VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogXCLljaDmr5RcIixcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ3BpZScsXHJcbiAgICAgICAgICAgICAgICAgIHJhZGl1czogWyczOCUnLCAnNTglJ10sXHJcbiAgICAgICAgICAgICAgICAgIGNlbnRlcjogWyc1MyUnLCAnMzclJ10sXHJcbiAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzMzMydcclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW1xyXG4gICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogZGF0YS5hY3Rpdml0eV9pc3N1ZSwgbmFtZTogJ+mbhuS9k+Wkh+ivvid9LFxyXG4gICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogZGF0YS54amp5X29yZ19pc3N1ZSwgbmFtZTogJ+agoemZheaVmeeglCd9LFxyXG4gICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogZGF0YS5yZWNvcmRfcmVzLCBuYW1lOiAn5oiQ6ZW/5qGj5qGIJ30sXHJcbiAgICAgICAgICAgICAgICAgICAge3ZhbHVlOiBkYXRhLmxpc3Rlbl93cml0ZSwgbmFtZTogJ+WQrOivvuiusOW9lSd9LFxyXG4gICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogZGF0YS50aGVzaXNfd3JpdGUsIG5hbWU6ICfmlZnlrabmlofnq6AnfVxyXG4gICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlY2hhcnRfc2Nob29sRWR1Y2F0aW9uYWxSZXNlYXJjaC5zZXRPcHRpb24oZWNoYXJ0X3NjaG9vbEVkdWNhdGlvbmFsUik7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3NjaG9vbEVkdWNhdGlvbmFsUmVzZWFyY2gpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAnc2Nob29sVGVhY2hpbmdNYW5hZ2VtZW50Jzoge1xyXG4gICAgICAgICAgICB2YXIgZWNoYXJ0X3NjaG9vbFRlYWNoaW5nTSA9IHtcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcydcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzE1JScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNkN2Q3ZDdcIlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRhdGE6IFtcIuaVmeWtpueuoeeQhlwiXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY2FsY3VsYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICBib3VuZGFyeUdhcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgYXhpc1RpY2s6IHtcclxuICAgICAgICAgICAgICAgICAgICBhbGlnbldpdGhMYWJlbDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbJ+afpemYheaVmeahiCcsICfmn6XpmIXor77ku7YnLCAn5p+l6ZiF5Y+N5oCdJywgJ+afpemYheWQrOivvuiusOW9lScsICfmn6XpmIXpm4bkvZPlpIfor74nLCAn5p+l6ZiF6K6h5YiS5oC757uTJywgJ+afpemYheaVmeWtpuaWh+eroCddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICB5QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBzcGxpdExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmUnLFxyXG4gICAgICAgICAgICAgICAgICBzdGFjazogJ+aAu+mHjycsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNTFiODczJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1MWI4NzMnXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBhcmVhU3R5bGU6IHtub3JtYWw6IHt9fSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW2RhdGEuamlhb2FuX3NjYW4sIGRhdGEua2VqaWFuX3NjYW4sIGRhdGEuZmFuc2lfc2NhbiwgZGF0YS5saXN0ZW5fc2NhbiwgZGF0YS5hY3Rpdml0eV9zY2FuLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucGxhbnN1bW1hcnlfc2NhbiwgZGF0YS50aGVzaXNfc2Nhbl1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVjaGFydF9zY2hvb2xUZWFjaGluZ01hbmFnZW1lbnQuc2V0T3B0aW9uKGVjaGFydF9zY2hvb2xUZWFjaGluZ00pO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9zY2hvb2xUZWFjaGluZ01hbmFnZW1lbnQpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3NjaG9vbFRvdGFsUmVzdWx0cyc6IHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbl9zY2hvb2xUb3RhbFJlc3VsdHMgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnIzUzYmI3NycsICcjZmRkNTFkJywgJyNmZDhjMWQnLCAnI2ZmM2Y2NicsICcjM2Y4NmVhJywgJyMzMTZlYzUnLCAnIzE0YzdlMCcsICcjZDAxNzRmJywgJyNiNjUzY2YnXSxcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcnLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdpdGVtJyxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogXCJ7YX0gPGJyLz57Yn0gOiB7Y30gKHtkfSUpXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgeDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICB5OiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge2NvbG9yOiAnI2U3ZTdlNycsIGZvbnRTaXplOiAxMn0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvb2xzLmhpZGVUZXh0QnlMZW4obmFtZSwgMjApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICflkITljLrln5/miJDmnpzmgLvph4/ljaDmr5QnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiAnNTglJyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyOiBbJzUwJScsICc0MCUnXSxcclxuICAgICAgICAgICAgICAgICAgbGFiZWxMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IDJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxyXG4gICAgICAgICAgICAgICAgICBpdGVtU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbXBoYXNpczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2hhZG93Qmx1cjogNSxcclxuICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMSknXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICB2YXIgb2JqID0ge307XHJcbiAgICAgICAgICAgICAgb2JqWyd2YWx1ZSddID0gZGF0YS5kYXRhTGlzdFtpXS5jb3VudDtcclxuICAgICAgICAgICAgICBvYmpbJ25hbWUnXSA9IGRhdGEuZGF0YUxpc3RbaV0ub3JnTmFtZTtcclxuICAgICAgICAgICAgICBvcHRpb25fc2Nob29sVG90YWxSZXN1bHRzLnNlcmllc1swXS5kYXRhLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICBvcHRpb25fc2Nob29sVG90YWxSZXN1bHRzLnNlcmllc1swXS5kYXRhW2ldLmxhYmVsID0ge307XHJcbiAgICAgICAgICAgICAgb3B0aW9uX3NjaG9vbFRvdGFsUmVzdWx0cy5zZXJpZXNbMF0uZGF0YVtpXS5sYWJlbC5ub3JtYWwgPSB7fTtcclxuICAgICAgICAgICAgICBvcHRpb25fc2Nob29sVG90YWxSZXN1bHRzLnNlcmllc1swXS5kYXRhW2ldLmxhYmVsLm5vcm1hbC5mb3JtYXR0ZXIgPSB0b29scy5oaWRlVGV4dEJ5TGVuKGRhdGEuZGF0YUxpc3RbaV0ub3JnTmFtZSwgMjApO1xyXG4gICAgICAgICAgICAgIG9wdGlvbl9zY2hvb2xUb3RhbFJlc3VsdHMubGVnZW5kLmRhdGFbaV0gPSBkYXRhLmRhdGFMaXN0W2ldLm9yZ05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWNoYXJ0X3NjaG9vbFRvdGFsUmVzdWx0cy5zZXRPcHRpb24ob3B0aW9uX3NjaG9vbFRvdGFsUmVzdWx0cyk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3NjaG9vbFRvdGFsUmVzdWx0cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAnc2Nob29sVGVhY2hpbmdBY2hpZXZlbWVudHMnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fc2Nob29sVGVhY2hpbmdBY2hpZXZlbWVudHMgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFtcIiNmZjNmNjZcIiwgXCIjZmI4YjFiXCIsIFwiI2ZkZDUxZFwiLCBcIiNhNWQ2N2JcIiwgXCIjNWFiNTdjXCIsIFwiIzBmY2JlNlwiLCBcIiM0NDhjZmJcIiwgXCIjNDU2ZmRlXCIsIFwiIzgwNTRjZFwiLCBcIiNiNjUyY2NcIl0sXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnJyxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2F9IDxici8+e2J9IDoge2N9ICh7ZH0lKVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIHg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgeTogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICAgICBpdGVtR2FwOiAxNSxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge2NvbG9yOiAnI2U3ZTdlNycsIGZvbnRTaXplOiAxNH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICflkITlrabnp5Hmg4XlhrXlr7nmr5QnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiAnNjAlJyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyOiBbJzUwJScsICc0MCUnXSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5wYWdlTGlzdC5kYXRhbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgICAgICBvYmpbJ3ZhbHVlJ10gPSBkYXRhLnBhZ2VMaXN0LmRhdGFsaXN0W2ldLmNvdW50O1xyXG4gICAgICAgICAgICAgIG9ialsnbmFtZSddID0gZGF0YS5wYWdlTGlzdC5kYXRhbGlzdFtpXS5zdWJqZWN0O1xyXG4gICAgICAgICAgICAgIG9wdGlvbl9zY2hvb2xUZWFjaGluZ0FjaGlldmVtZW50cy5zZXJpZXNbMF0uZGF0YS5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgICAgb3B0aW9uX3NjaG9vbFRlYWNoaW5nQWNoaWV2ZW1lbnRzLmxlZ2VuZC5kYXRhW2ldID0gZGF0YS5wYWdlTGlzdC5kYXRhbGlzdFtpXS5zdWJqZWN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVjaGFydF9zY2hvb2xUZWFjaGluZ0FjaGlldmVtZW50cy5zZXRPcHRpb24ob3B0aW9uX3NjaG9vbFRlYWNoaW5nQWNoaWV2ZW1lbnRzKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfc2Nob29sVGVhY2hpbmdBY2hpZXZlbWVudHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3NjaG9vbEdyYWRlVGVhY2hpbmdBY2hpZXZlbWVudHMnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fc2Nob29sR3JhZGVUZWFjaGluZ0FjaGlldmVtZW50cyA9IHtcclxuICAgICAgICAgICAgICBjb2xvcjogW1wiIzBmY2JlNlwiLCAnIzNmODZlYScsICcjNTNiYjc3JywgJyNmZjNmNjYnLCAnI2ZkZDUxZCcsICcjZmQ4YzFkJywgJyNiNjUzY2YnLCAnIzMxNmVjNScsICcjMTRjN2UwJ10sXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnJyxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2F9IDxici8+e2J9IDoge2N9ICh7ZH0lKVwiXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIHg6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgeTogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICAgICBpdGVtR2FwOiAxNSxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge2NvbG9yOiAnI2U3ZTdlNycsIGZvbnRTaXplOiAxNH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICflkITlubTnuqfmg4XlhrXljaDmr5QnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiAnNjIlJyxcclxuICAgICAgICAgICAgICAgICAgY2VudGVyOiBbJzUwJScsICc0MCUnXSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtcGhhc2lzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiAxMCxcclxuICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC41KSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5wYWdlTGlzdC5kYXRhbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgICAgICBvYmpbJ3ZhbHVlJ10gPSBkYXRhLnBhZ2VMaXN0LmRhdGFsaXN0W2ldLmNvdW50O1xyXG4gICAgICAgICAgICAgIG9ialsnbmFtZSddID0gZGF0YS5wYWdlTGlzdC5kYXRhbGlzdFtpXS5ncmFkZTtcclxuICAgICAgICAgICAgICBvcHRpb25fc2Nob29sR3JhZGVUZWFjaGluZ0FjaGlldmVtZW50cy5zZXJpZXNbMF0uZGF0YS5wdXNoKG9iaik7XHJcbiAgICAgICAgICAgICAgb3B0aW9uX3NjaG9vbEdyYWRlVGVhY2hpbmdBY2hpZXZlbWVudHMubGVnZW5kLmRhdGFbaV0gPSBkYXRhLnBhZ2VMaXN0LmRhdGFsaXN0W2ldLmdyYWRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVjaGFydF9zY2hvb2xHcmFkZVRlYWNoaW5nQWNoaWV2ZW1lbnRzLnNldE9wdGlvbihvcHRpb25fc2Nob29sR3JhZGVUZWFjaGluZ0FjaGlldmVtZW50cyk7XHJcbiAgICAgICAgICAgIGNvbW1vbi5lY2hhcnQuaGlkZUxvYWRpbmcoZWNoYXJ0X3NjaG9vbEdyYWRlVGVhY2hpbmdBY2hpZXZlbWVudHMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uICAgICAgIOWQhOWMuuWfn+WtpuagoeaVmeeglOaDheWGteWvueavlFxyXG4gICAgICAgKiBAcGFyYW0gYXJlYUlkICAgICAg5biCaWRcclxuICAgICAgICogQHBhcmFtIHRpbWUgICAgICAgIOaXtumXtOautSh5ZXN0ZXJkYXk65pio5aSp77yMbGFzdHNldmVu77ya5pyA6L+R5LiD5aSp77yMbGFzdHRoaXJ0ee+8muacgOi/keS4ieWNgeWkqSlcclxuICAgICAgICogQHBhcmFtIHBoYXNlSWQgICAgIOWtpuautWlkXHJcbiAgICAgICAqIEBwYXJhbSBzdWJqZWN0SWQgICDlrabnp5FpZFxyXG4gICAgICAgKiBAcGFyYW0gZ3JhZGVJZCAgICAg5bm057qnaWRcclxuICAgICAgICogQHBhcmFtIHNjaG9vbFllYXIgIOWtpuW5tFxyXG4gICAgICAgKi9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFyZWFTY2hvb2xDYXNlY0NvbnRyYXN0KHRpbWUsIHBoYXNlSWQsIHN1YmplY3RJZCwgc2Nob29sWWVhcikge1xyXG4gICAgICAgIGVjaGFydF9zY2hvb2xfdGVhY2hpbmdfY29udHJhc3QgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjaG9vbF90ZWFjaGluZ19jb250cmFzdCcpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9zY2hvb2xfdGVhY2hpbmdfY29udHJhc3QpO1xyXG4gICAgICAgIHZhciB1cmwgPSAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9hcmVhL2NpdHlfb3JndG90YWxfYXJlYT9hcmVhSWQ9JyArIGNvbW1vbi5hcmVhaWQ7XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgdXJsICsgJyZ0aW1lPScgKyB0aW1lICsgJyZwaGFzZUlkPScgKyBwaGFzZUlkICsgJyZzdWJqZWN0SWQ9JyArIHN1YmplY3RJZCArXHJcbiAgICAgICAgICAnJnNjaG9vbFllYXI9JyArIHNjaG9vbFllYXIgKyAnJmVycm9yRG9tSWQ9c2Nob29sX3RlYWNoaW5nX2NvbnRyYXN0JylcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyKHJlc3VsdC5kYXRhLCAnc2Nob29sX3RlYWNoaW5nX2NvbnRyYXN0Jyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnI2FyZWFTY2hvb2wnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYXJlYVNjaG9vbENhc2VjQ29udHJhc3QoJCgnI2FyZWFTY2hvb2wnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICQoJyNzdWJqZWN0IC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gICAgICAg5ZCE5a2m5qCh5pWZ56CU5oiQ5p6c5oC76YePXHJcbiAgICAgICAqIEBwYXJhbSBhcmVhSWQgICAgICDluIJpZFxyXG4gICAgICAgKiBAcGFyYW0gdGltZSAgICAgICAg5pe26Ze05q61KHllc3RlcmRheTrmmKjlpKnvvIxsYXN0c2V2ZW7vvJrmnIDov5HkuIPlpKnvvIxsYXN0dGhpcnR577ya5pyA6L+R5LiJ5Y2B5aSpKVxyXG4gICAgICAgKiBAcGFyYW0gcGhhc2VJZCAgICAg5a2m5q61aWRcclxuICAgICAgICogQHBhcmFtIHN1YmplY3RJZCAgIOWtpuenkWlkXHJcbiAgICAgICAqIEBwYXJhbSBzY2hvb2xZZWFyICDlrablubRcclxuICAgICAgICovXHJcblxyXG4gICAgICBmdW5jdGlvbiBzY2hvb2xDYXNlY0NvbnRyYXN0KHRpbWUsIHBoYXNlSWQsIHN1YmplY3RJZCwgc2Nob29sWWVhcikge1xyXG4gICAgICAgIGVjaGFydF9zY2hvb2xUb3RhbFJlc3VsdHMgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NjaG9vbFRvdGFsUmVzdWx0cycpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9zY2hvb2xUb3RhbFJlc3VsdHMpO1xyXG4gICAgICAgIHZhciB1cmwgPSAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9hcmVhL2FyZWFfb3JndG90YWxfb3JnP2FyZWFJZD0nICsgY29tbW9uLmFyZWFpZDtcclxuICAgICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyB1cmwgKyAnJnRpbWU9JyArIHRpbWUgKyAnJnBoYXNlSWQ9JyArIHBoYXNlSWQgKyAnJnN1YmplY3RJZD0nICsgc3ViamVjdElkICtcclxuICAgICAgICAgICcmc2Nob29sWWVhcj0nICsgc2Nob29sWWVhciArICcmZXJyb3JEb21JZD1zY2hvb2xUb3RhbFJlc3VsdHNXcmFwJylcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyKHJlc3VsdC5kYXRhLCAnc2Nob29sVG90YWxSZXN1bHRzJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocmVzdWx0LmRhdGEuZGF0YUxpc3QsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgY2xzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgoaW5kZXggKyAoKGN1cnJlbnRQYWdlIC0gMSkgKiAxMCkpIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNscyA9ICdudW0xJztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHRyPjx0ZCBzdHlsZT0ncGFkZGluZy1sZWZ0OjEwJTt0ZXh0LWFsaWduOmxlZnQ7Jz48c3BhbiBjbGFzcz0nbnVtIFwiICsgY2xzICsgXCInPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAoICgoY3VycmVudFBhZ2UgLSAxKSAqIDEwKSArIChpbmRleCArIDEpICkgKyBcIjwvc3Bhbj48c3Ryb25nIGNsYXNzPSdzdHJvbmcnIHRpdGxlPSdcIiArIGl0ZW0ub3JnTmFtZSArIFwiJz5cIiArIGl0ZW0ub3JnTmFtZSArIFwiPC9zdHJvbmc+PC90ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgPHRkPlwiICsgaXRlbS5jb3VudCArIFwiPC90ZD48dGQ+XCIgKyAoKGl0ZW0uY291bnQgLyAocmVzdWx0LmRhdGEuYWxsQ291bnQgfHwgMSkpICogMTAwKS50b0ZpeGVkKDIpICtcclxuICAgICAgICAgICAgICAgICAgICAnJScgKyBcIjwvdGQ+PC90cj5cIjtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoJyNyYW5rX3BlcmNlbnQzJykuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICQoJyNzY2h0b3RhbCcpLmh0bWwocmVzdWx0LmRhdGEuYWxsQ291bnQpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdzZWxlY3RDaGFuZ2UnLCAnI3NjaHRvdGFsU2VsZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNjaG9vbENhc2VjQ29udHJhc3QoJCgnI3NjaHRvdGFsU2VsZWN0JykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksXHJcbiAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjc2Nob29sWWVhciAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiAgICAgICDlrabmoKHmlZnnoJTmiJDmnpxcclxuICAgICAgICogQHBhcmFtIGFyZWFJZCAgICAgIOW4gmlkXHJcbiAgICAgICAqIEBwYXJhbSB0aW1lICAgICAgICDml7bpl7TmrrUoeWVzdGVyZGF5OuaYqOWkqe+8jGxhc3RzZXZlbu+8muacgOi/keS4g+Wkqe+8jGxhc3R0aGlydHnvvJrmnIDov5HkuInljYHlpKkpXHJcbiAgICAgICAqIEBwYXJhbSBwaGFzZUlkICAgICDlrabmrrVpZFxyXG4gICAgICAgKiBAcGFyYW0gc3ViamVjdElkICAg5a2m56eRaWRcclxuICAgICAgICogQHBhcmFtIGdyYWRlSWQgICAgIOW5tOe6p2lkXHJcbiAgICAgICAqIEBwYXJhbSBzY2hvb2xZZWFyICDlrablubRcclxuICAgICAgICovXHJcblxyXG4gICAgICBmdW5jdGlvbiBzY2hvb2xUZWFjaGluZyh0aW1lLCBwaGFzZUlkLCBzdWJqZWN0SWQsIGdyYWRlSWQsIHNjaG9vbFllYXIpIHtcclxuICAgICAgICBlY2hhcnRfc2Nob29sUm91dGluZVRlYWNoaW5nID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2hvb2xSb3V0aW5lVGVhY2hpbmcnKSk7XHJcbiAgICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfc2Nob29sUm91dGluZVRlYWNoaW5nKTtcclxuICAgICAgICBlY2hhcnRfc2Nob29sRWR1Y2F0aW9uYWxSZXNlYXJjaCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nob29sRWR1Y2F0aW9uYWxSZXNlYXJjaCcpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9zY2hvb2xFZHVjYXRpb25hbFJlc2VhcmNoKTtcclxuICAgICAgICBlY2hhcnRfc2Nob29sVGVhY2hpbmdNYW5hZ2VtZW50ID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2hvb2xUZWFjaGluZ01hbmFnZW1lbnQnKSk7XHJcbiAgICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfc2Nob29sVGVhY2hpbmdNYW5hZ2VtZW50KTtcclxuICAgICAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgICAgICBpZiAoY29tbW9uLnJvbGUgPT0gJ2NpdHknKSB7XHJcbiAgICAgICAgICB1cmwgPSAnL2p5L29wZW4/cGF0aD0vYXBpL3N0YXRpc3RpYy9hcmVhL2NpdHlfb3JnZGF0YT9hcmVhSWQ9JyArIGNvbW1vbi5hcmVhaWQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb21tb24ucm9sZSA9PSAnY291bnR5Jykge1xyXG4gICAgICAgICAgdXJsID0gJy9qeS9vcGVuP3BhdGg9L2FwaS9zdGF0aXN0aWMvYXJlYS9hcmVhX29yZ2RhdGE/YXJlYUlkPScgKyBjb21tb24uYXJlYWlkO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29tbW9uLnJvbGUgPT0gJ3NjaG9vbCcpIHtcclxuICAgICAgICAgIHVybCA9ICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL29yZy9zY2hfanlfbWFuYWdlX2RhdGE/b3JnSWQ9JyArIGNvbW1vbi5vcmdpZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgdXJsICsgJyZ0aW1lPScgKyB0aW1lICsgJyZwaGFzZUlkPScgKyBwaGFzZUlkICsgJyZzdWJqZWN0SWQ9JyArIHN1YmplY3RJZCArXHJcbiAgICAgICAgICAnJmdyYWRlSWQ9JyArIGdyYWRlSWQgKyAnJnNjaG9vbFllYXI9JyArIHNjaG9vbFllYXIgKyAnJmVycm9yRG9tSWQ9c2Nob29sV3JhcCcpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlcihyZXN1bHQuZGF0YSwgJ3NjaG9vbFJvdXRpbmVUZWFjaGluZycpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyKHJlc3VsdC5kYXRhLCAnc2Nob29sRWR1Y2F0aW9uYWxSZXNlYXJjaCcpO1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyKHJlc3VsdC5kYXRhLCAnc2Nob29sVGVhY2hpbmdNYW5hZ2VtZW50Jyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjcm91dGluZV90ZWFjaGluZycpLmh0bWwoXHJcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhLmppYW9hbl93cml0ZSArIHJlc3VsdC5kYXRhLmtlamlhbl93cml0ZSArIHJlc3VsdC5kYXRhLmZhbnNpX3dyaXRlICtcclxuICAgICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEucGxhbnN1bW1hcnlfd3JpdGVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAkKCcjZWR1Y2F0aW9uYWxfcmVzZWFyY2gnKS5odG1sKFxyXG4gICAgICAgICAgICAgICAgICByZXN1bHQuZGF0YS5hY3Rpdml0eV9pc3N1ZSArIHJlc3VsdC5kYXRhLnhqanlfb3JnX2lzc3VlICsgcmVzdWx0LmRhdGEucmVjb3JkX3JlcyArXHJcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5kYXRhLmxpc3Rlbl93cml0ZSArIHJlc3VsdC5kYXRhLnRoZXNpc193cml0ZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICQoJyN0ZWFjaGluZ19tYW5hZ2VtZW50JykuaHRtbChcclxuICAgICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEuamlhb2FuX3NjYW4gKyByZXN1bHQuZGF0YS5rZWppYW5fc2NhbiArIHJlc3VsdC5kYXRhLmZhbnNpX3NjYW4gK1xyXG4gICAgICAgICAgICAgICAgICByZXN1bHQuZGF0YS5saXN0ZW5fc2NhbiArIHJlc3VsdC5kYXRhLmFjdGl2aXR5X3NjYW4gKyByZXN1bHQuZGF0YS5wbGFuc3VtbWFyeV9zY2FuICtcclxuICAgICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEudGhlc2lzX3NjYW5cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiAgICAgICDlkITlrabnp5Hmg4XlhrXlr7nmr5RcclxuICAgICAgICogQHBhcmFtIGFyZWFJZCAgICAgIOW4gmlkXHJcbiAgICAgICAqIEBwYXJhbSB0aW1lICAgICAgICDml7bpl7TmrrUoeWVzdGVyZGF5OuaYqOWkqe+8jGxhc3RzZXZlbu+8muacgOi/keS4g+Wkqe+8jGxhc3R0aGlydHnvvJrmnIDov5HkuInljYHlpKkpXHJcbiAgICAgICAqIEBwYXJhbSBwaGFzZUlkICAgICDlrabmrrVpZFxyXG4gICAgICAgKiBAcGFyYW0gc2Nob29sWWVhciAg5a2m5bm0XHJcbiAgICAgICAqL1xyXG4gICAgICB2YXIgY3VycmVudFBhZ2UgPSAxO1xyXG5cclxuICAgICAgZnVuY3Rpb24gRGlzY2lwbGluZUNvbXBhcmlzb24odGltZSwgcGhhc2VJZCwgc2Nob29sWWVhciwgY3VycmVudFBhZ2UsIGlzUGFnaW5nKSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZSB8fCAxO1xyXG4gICAgICAgIGVjaGFydF9zY2hvb2xUZWFjaGluZ0FjaGlldmVtZW50cyA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2Nob29sVGVhY2hpbmdBY2hpZXZlbWVudHMnKSk7XHJcbiAgICAgICAgY29tbW9uLmVjaGFydC5zaG93TG9hZGluZyhlY2hhcnRfc2Nob29sVGVhY2hpbmdBY2hpZXZlbWVudHMpO1xyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL29yZy9zY2hfanlfc3ViamVjdD9vcmdJZD0nICsgY29tbW9uLm9yZ2lkICsgJyZ0aW1lPScgKyB0aW1lICtcclxuICAgICAgICAgICcmcGhhc2VJZD0nICsgcGhhc2VJZCArICcmc2Nob29sWWVhcj0nICsgc2Nob29sWWVhciArICcmY3VycmVudFBhZ2U9JyArIGN1cnJlbnRQYWdlICsgJyZlcnJvckRvbUlkPXNjaG9vbFRlYWNoaW5nQWNoaWV2ZW1lbnRzV3JhcCcpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlcihyZXN1bHQuZGF0YSwgJ3NjaG9vbFRlYWNoaW5nQWNoaWV2ZW1lbnRzJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocmVzdWx0LmRhdGEucGFnZUxpc3QuZGF0YWxpc3QsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgY2xzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgoaW5kZXggKyAoKGN1cnJlbnRQYWdlIC0gMSkgKiAxMCkpIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNscyA9ICdudW0xJztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHRyPjx0ZCBzdHlsZT0ncGFkZGluZy1sZWZ0OjEwJTt0ZXh0LWFsaWduOmxlZnQ7d2lkdGg6NDAlOyc+PHNwYW4gY2xhc3M9J251bSBcIiArIGNscyArIFwiJz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgKCAoKGN1cnJlbnRQYWdlIC0gMSkgKiAxMCkgKyAoaW5kZXggKyAxKSApICsgXCI8L3NwYW4+PHN0cm9uZyBjbGFzcz0nc3Ryb25nJyB0aXRsZT0nXCIgKyBpdGVtLnN1YmplY3QgKyBcIic+XCJcclxuICAgICAgICAgICAgICAgICAgICArIGl0ZW0uc3ViamVjdCArIFwiPC9zdHJvbmc+PC90ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgXCIgPHRkIHN0eWxlPSd3aWR0aDozMCU7Jz5cIiArIGl0ZW0uY291bnQgKyBcIjwvdGQ+PHRkIHN0eWxlPSd3aWR0aDozMCU7Jz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgKChpdGVtLmNvdW50IC8gKHJlc3VsdC5kYXRhLmFsbENvdW50IHx8IDEpKSAqIDEwMCkudG9GaXhlZCgyKSArICclJyArIFwiPC90ZD48L3RyPlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJCgnI3N1YnNjaG9vbEFjaGlldmVtZW50cycpLmh0bWwocmVzdWx0LmRhdGEuYWxsQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3JhbmtfcGVyY2VudDInKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc1BhZ2luZykge1xyXG4gICAgICAgICAgICAgICAgICAkKCcjcGFnZVRvb2wyJykuaHRtbCgnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0WydkYXRhJ11bJ3BhZ2VMaXN0J11bJ3RvdGFsUGFnZXMnXSA+IDEgJiYgIWlzUGFnaW5nKVxyXG4gICAgICAgICAgICAgICAgICByZW5kZXJQYWdlKCdwYWdlVG9vbDInLCByZXN1bHRbJ2RhdGEnXVsncGFnZUxpc3QnXVsndG90YWxDb3VudCddKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0Q2hhbmdlJywgJyNzdWJqZWN0Q29udHJhc3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgRGlzY2lwbGluZUNvbXBhcmlzb24oJCgnI3N1YmplY3RDb250cmFzdCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyUGFnZShkb21JZCwgdG90YWwpIHtcclxuICAgICAgICB2YXIgcCA9IG5ldyBQYWdlKCk7XHJcbiAgICAgICAgcC5pbml0KHtcclxuICAgICAgICAgIHRhcmdldDogJyMnICsgZG9tSWQsIHBhZ2VzaXplOiAxMCwgcGFnZUNvdW50OiAxLFxyXG4gICAgICAgICAgY291bnQ6IHRvdGFsLCBjYWxsYmFjazogZnVuY3Rpb24gKGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgRGlzY2lwbGluZUNvbXBhcmlzb24oJCgnI3N1YmplY3RDb250cmFzdCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgICAgICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksIGN1cnJlbnQsIHRydWUpO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gICAgICAg5ZCE5bm057qn5oOF5Ya15a+55q+UXHJcbiAgICAgICAqIEBwYXJhbSBhcmVhSWQgICAgICDluIJpZFxyXG4gICAgICAgKiBAcGFyYW0gdGltZSAgICAgICAg5pe26Ze05q61KHllc3RlcmRheTrmmKjlpKnvvIxsYXN0c2V2ZW7vvJrmnIDov5HkuIPlpKnvvIxsYXN0dGhpcnR577ya5pyA6L+R5LiJ5Y2B5aSpKVxyXG4gICAgICAgKiBAcGFyYW0gcGhhc2VJZCAgICAg5a2m5q61aWRcclxuICAgICAgICogQHBhcmFtIHNjaG9vbFllYXIgIOWtpuW5tFxyXG4gICAgICAgKi9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdyYWRlQ29udHJhc3QodGltZSwgcGhhc2VJZCwgc2Nob29sWWVhciwgY3VycmVudFBhZ2UsIGlzUGFnaW5nKSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2UgPSBjdXJyZW50UGFnZSB8fCAxO1xyXG4gICAgICAgIGVjaGFydF9zY2hvb2xHcmFkZVRlYWNoaW5nQWNoaWV2ZW1lbnRzID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY2hvb2xHcmFkZVRlYWNoaW5nQWNoaWV2ZW1lbnRzJykpO1xyXG4gICAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3NjaG9vbEdyYWRlVGVhY2hpbmdBY2hpZXZlbWVudHMpO1xyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvankvb3Blbj9wYXRoPS9hcGkvc3RhdGlzdGljL29yZy9zY2hfanlfZ3JhZGU/b3JnSWQ9JyArIGNvbW1vbi5vcmdpZCArICcmdGltZT0nICsgdGltZSArXHJcbiAgICAgICAgICAnJnBoYXNlSWQ9JyArIHBoYXNlSWQgKyAnJnNjaG9vbFllYXI9JyArIHNjaG9vbFllYXIgKyAnJmN1cnJlbnRQYWdlPScgKyBjdXJyZW50UGFnZSArICcmZXJyb3JEb21JZD1zY2hvb2xHcmFkZVRlYWNoaW5nQWNoaWV2ZW1lbnRzRXJyb3InKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIocmVzdWx0LmRhdGEsICdzY2hvb2xHcmFkZVRlYWNoaW5nQWNoaWV2ZW1lbnRzJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2gocmVzdWx0LmRhdGEucGFnZUxpc3QuZGF0YWxpc3QsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgY2xzID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgoaW5kZXggKyAoKGN1cnJlbnRQYWdlIC0gMSkgKiAxMCkpIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNscyA9ICdudW0xJztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBodG1sICs9IFwiPHRyPjx0ZCBzdHlsZT0ncGFkZGluZy1sZWZ0OjEwJTt0ZXh0LWFsaWduOmxlZnQ7Jz48c3BhbiBjbGFzcz0nbnVtIFwiICsgY2xzICsgXCInPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAoICgoY3VycmVudFBhZ2UgLSAxKSAqIDEwKSArIChpbmRleCArIDEpICkgKyBcIjwvc3Bhbj48c3Ryb25nIGNsYXNzPSdzdHJvbmcnIHRpdGxlPSdcIiArIGl0ZW0uZ3JhZGUgKyBcIic+XCIgKyBpdGVtLmdyYWRlICsgXCI8L3N0cm9uZz48L3RkPlwiICtcclxuICAgICAgICAgICAgICAgICAgICBcIiA8dGQ+XCIgKyBpdGVtLmNvdW50ICsgXCI8L3RkPjx0ZD5cIiArICgoaXRlbS5jb3VudCAvIChyZXN1bHQuZGF0YS5hbGxDb3VudCB8fCAxKSkgKiAxMDApLnRvRml4ZWQoMikgK1xyXG4gICAgICAgICAgICAgICAgICAgICclJyArIFwiPC90ZD48L3RyPlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJCgnI3JhbmtfcGVyY2VudDEnKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2dhcmRlc2Nob29sQWNoaWV2ZW1lbnRzJykuaHRtbChyZXN1bHQuZGF0YS5hbGxDb3VudCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzUGFnaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICQoJyNwYWdlVG9vbDMnKS5odG1sKCcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2RhdGEnXVsncGFnZUxpc3QnXVsndG90YWxQYWdlcyddID4gMSAmJiAhaXNQYWdpbmcpXHJcbiAgICAgICAgICAgICAgICAgIHJlbmRlclBhZ2UxKCdwYWdlVG9vbDMnLCByZXN1bHRbJ2RhdGEnXVsncGFnZUxpc3QnXVsndG90YWxDb3VudCddKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlbmRlclBhZ2UxKGRvbUlkLCB0b3RhbCkge1xyXG4gICAgICAgIHZhciBwID0gbmV3IFBhZ2UoKTtcclxuICAgICAgICBwLmluaXQoe1xyXG4gICAgICAgICAgdGFyZ2V0OiAnIycgKyBkb21JZCwgcGFnZXNpemU6IDEwLCBwYWdlQ291bnQ6IDEsXHJcbiAgICAgICAgICBjb3VudDogdG90YWwsIGNhbGxiYWNrOiBmdW5jdGlvbiAoY3VycmVudCkge1xyXG4gICAgICAgICAgICBncmFkZUNvbnRyYXN0KCQoJyNncmFkZUNvbnRyYXN0JykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksXHJcbiAgICAgICAgICAgICAgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgY3VycmVudCwgdHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0Q2hhbmdlJywgJyNncmFkZUNvbnRyYXN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGdyYWRlQ29udHJhc3QoJCgnI2dyYWRlQ29udHJhc3QnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNzZWFyY2hCdG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGNvbW1vbi5yb2xlID09ICdjaXR5Jykge1xyXG4gICAgICAgICAgYXJlYVNjaG9vbENhc2VjQ29udHJhc3QoJCgnI2FyZWFTY2hvb2wnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICAgJCgnI3N1YmplY3QgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21tb24ucm9sZSA9PSAnc2Nob29sJykge1xyXG4gICAgICAgICAgJCgnI3N1YmplY3QnKS5oaWRlKCk7XHJcbiAgICAgICAgICAkKCcjZ3JhZGUnKS5oaWRlKCk7XHJcbiAgICAgICAgICBzY2hvb2xUZWFjaGluZygnJywgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLCAnJywgJycsXHJcbiAgICAgICAgICAgICQoJyNzY2hvb2xZZWFyIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICAgICAgZ3JhZGVDb250cmFzdCgkKCcjZ3JhZGVDb250cmFzdCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgICAkKCcjc2Nob29sWWVhciAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgICAgIERpc2NpcGxpbmVDb21wYXJpc29uKCQoJyNzdWJqZWN0Q29udHJhc3QnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNzdHVkeVNlY3Rpb24gLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSxcclxuICAgICAgICAgICAgJCgnI3NjaG9vbFllYXIgLnNlbGVjdFRvcCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNjaG9vbFRlYWNoaW5nKCcnLCAkKCcjc3R1ZHlTZWN0aW9uIC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksXHJcbiAgICAgICAgICAgICQoJyNzdWJqZWN0IC5zZWxlY3RUb3AnKS5hdHRyKCdkYXRhLXZhbHVlJyksICQoJyNncmFkZSAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgICAkKCcjc2Nob29sWWVhciAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbW1vbi5yb2xlID09ICdjb3VudHknKSB7XHJcbiAgICAgICAgICBzY2hvb2xDYXNlY0NvbnRyYXN0KCQoJyNzY2h0b3RhbFNlbGVjdCcpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJCgnI3N0dWR5U2VjdGlvbiAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLFxyXG4gICAgICAgICAgICAkKCcjc3ViamVjdCAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpLCAkKCcjc2Nob29sWWVhciAuc2VsZWN0VG9wJykuYXR0cignZGF0YS12YWx1ZScpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuICAgICAgJCgnI3NlYXJjaEJ0bicpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcblxyXG4gICAgfSk7XHJcbn0pIl19
