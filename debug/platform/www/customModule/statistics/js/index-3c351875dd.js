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
  define('', ['jquery', 'service', 'common', 'paging'], function ($, service, common, Paging) {
    var role = common.role;
    var echart_usertype = common.echart.init(document.getElementById('usertype'));
    common.echart.showLoading(echart_usertype);
    var echart_platform_trend = common.echart.init(document.getElementById('platform_trend'));
    common.echart.showLoading(echart_platform_trend);
    var echart_pvitality = common.echart.init(document.getElementById('pvitality'));
    common.echart.showLoading(echart_pvitality);
    var echart_gvitality = common.echart.init(document.getElementById('gvitality'));
    common.echart.showLoading(echart_gvitality);
    var echart_resource_total = common.echart.init(document.getElementById('resource_total'));
    common.echart.showLoading(echart_resource_total);

    // 学校管理员
    var echart_usertype_school = common.echart.init(document.getElementById('usertype_school'));
    var echart_useruse_school = common.echart.init(document.getElementById('useruse_school'));

    // errorDomID
    var usertype = 'usertype';
    var platform_trend = 'platform_trend';
    var person_space = 'person_space';
    var group_space = 'group_space';
    var resource_total = 'resource_total';
    var useruse_school = 'useruse_school';

    // 平台使用情况
    $.getJSON(service.prefix + '/platform/count', function (result) {
      for (var key in result.data) {
        if ((result.data[key] + '').indexOf('+') >= 0) {
          $('#' + key).addClass('add');
        } else if ((result.data[key] + '').indexOf('-') >= 0) {
          $('#' + key).addClass('minus');
        }
        $('#' + key).html(result.data[key]);
      }
    });

    // 平台使用用户统计 用户类型分布
    var userType = {};

    function platformUserStatistics() {
      $.getJSON(service.prefix + '/platform/usertype?errorDomID=' + usertype).success(function (result) {
        if (result['code'] == 200) {
          userType = result['data']['userrole'];
          render(convertPieData(result.data.userrole), 'usertype');
          render(convertPieData(result.data.userrole), 'usertype_school');
          if (role === 'school') {
            var per = 0;
            if (result['data']['person'] == 0) per = 0;else per = Math.round(result['data']['used'] * 100 / result['data']['person']);
            if (per > 100) per = 100;
            $('#mainbo_echart_school').css('width', per + '%').find('.mainbo-label').html(per + '%');
          }
        }
      });
    }

    var usertypeObj = {
      edu: '教育局',
      school: '学校',
      userrole: {
        edumanager: '教育局管理者',
        eduemploye: '教育局职工',
        schmanager: '学校管理者',
        parent: '家长',
        schemploye: '学校职工',
        teacher: '教师',
        student: '学生'
      }
    };

    if (role === 'school') {
      delete usertypeObj.userrole.edumanager;
      delete usertypeObj.userrole.eduemploye;
    }

    function convertPieData(data) {
      var legendData = [],
          seriesData1 = [],
          seriesData2 = [],
          total_school = 0;
      $.each(data, function (key, value) {
        if (usertypeObj['userrole'][key]) {
          legendData.push(usertypeObj['userrole'][key]);
          seriesData2.push({ name: usertypeObj['userrole'][key], value: value });
          if (key != 'edumanager' && key != 'eduemploye') total_school += value;
        }
      });
      if (role !== 'school') {
        legendData.unshift(usertypeObj['edu'], usertypeObj['school']);
        seriesData1.push({ name: usertypeObj['edu'], value: data['eduemploye'] });
        seriesData1.push({ name: usertypeObj['school'], value: total_school });
      }

      return {
        legendData: legendData,
        seriesData1: seriesData1,
        seriesData2: seriesData2
      };
    }

    platformUserStatistics();

    /**
     * @description 各区域用户数量排名及占比
     * @param type String  类型（area:区域，school:学校）
     * @param role String  用户角色（teacher:老师，student:学生）
     */
    var currentPage = 1;

    function rederTable(type, pageNo, domId) {
      pageNo = pageNo || 1;
      var url = service.prefix + '/platform/' + type + '/ranking?pageNo=' + pageNo + '&errorDomId=' + domId;
      $.getJSON(url, function (result) {
        var html = '';

        if (result['code'] == 200) {
          if (type == 'school') {
            $.each(result.data.dataList, function (index, value) {
              var cls = '';
              if (index + (pageNo - 1) * 10 < 3) {
                cls = 'num1';
              }
              html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>" + ((pageNo - 1) * 10 + index + 1) + "</span>" + "<strong class='strong' title='" + result.data.dataList[index].name + "'>" + result.data.dataList[index].name + "</strong></td>" + "<td>" + result.data.dataList[index].value + "</td></tr>";
            });
            $('#' + domId).html(html);
          } else if (type == 'area') {
            $.each(result.data.dataList, function (index, value) {
              var cls = '';
              if (index + (pageNo - 1) * 10 < 3) {
                cls = 'num1';
              }
              html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>" + ((pageNo - 1) * 10 + index + 1) + "</span>" + "<strong class='strong' title='" + result.data.dataList[index].name + "'>" + result.data.dataList[index].name + "</strong></td>" + "<td>" + result.data.dataList[index].value + "</td>" + "<td>" + result.data.dataList[index].ratio + "</td></tr>";
            });
            $('#' + domId).html(html);
          }
          // 为空提示
          if (result.data.dataList.length === 0) {
            $('.tableWrapIndex table').empty().append('<div id="empty_info"><div><p>没有相关内容</p></div></div>');
          }
          if (result.data.pageCount > 1 && currentPage === 1) renderPage('pageTool', result.data.totalSize, type, domId);
        }
      });
    }

    function renderPage(pageId, total, type, domId) {
      currentPage++;
      $('#' + pageId).html('');
      var p = new Paging();
      p.init({
        target: '#' + pageId, pagesize: 10, pageCount: 1,
        count: total, callback: function callback(current) {
          rederTable(type, current, domId);
        }
      });
    }

    if (role === 'city') rederTable('area', '', 'rank_percent');else if (role === 'county') rederTable('school', '', 'rank_county');

    // 学校管理员——用户使用情况
    // 用户使用次数排名
    $('body').on('tabChange', '.tab', function () {
      userSchoolFetchData($(this).attr('data-value'), 'useruse_school');
    });
    $('.tab').trigger('tabChange');

    function userSchoolFetchData(role, useruse_school) {
      echart_useruse_school = common.echart.init(document.getElementById('useruse_school'));
      common.echart.showLoading(echart_useruse_school);
      $.getJSON(service.prefix + '/platform/person/ranking?role=' + role + '&errorDomId=' + useruse_school, function (result) {
        render(result.data, 'useruse_school');
      });
    }

    userSchoolFetchData('teacher', 'useruse_school');

    // 平台使用趋势下拉框
    $('body').on('selectChange', '.selectTop', function () {
      trendFetchData($(this).attr('data-value'));
    });
    $('.selectTop').trigger('selectChange');

    // 平台资源统计
    function platformResstatistics() {
      $.getJSON(service.prefix + '/resource/resourceTypeStatistics?errorDomId=' + resource_total).success(function (result) {
        if (result['code'] == 200) {
          $('#groupcount1').html(result.data.total);
          render(result.data, 'resource_total');
        }
      });
    }

    platformResstatistics();

    /**
     * @description 平台使用趋势统计
     * @param time 时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
     * @param starttime
     * @param endtime
     */
    function trendFetchData(time, starttime, endtime) {
      echart_platform_trend = common.echart.init(document.getElementById('platform_trend'));
      common.echart.showLoading(echart_platform_trend);
      var url = service.prefix + '/platform/tendency?time=' + time + '&errorDomId=' + platform_trend;
      if (starttime && endtime) url += '&starttime=' + starttime + '&endtime=' + endtime;
      $.getJSON(url, function (result) {
        render(convertData(result.data), platform_trend);
      });
    }

    function convertData(data) {
      var xAxisData = [],
          seriesData = [];
      $.each(data, function (index, item) {
        var time = item['time'] + '';
        if (time.length < 3) {
          time = time.length < 2 ? '0' + time : time;
          time += ':00';
        } else {
          time = time.split(' ')[0];
        }
        xAxisData.push(time);
        seriesData.push(item['value']);
      });
      return {
        xAxisData: xAxisData,
        seriesData: seriesData
      };
    }

    trendFetchData('yesterday', 'platform_trend');

    // 个人空间，群组空间切换
    $('body').on('radioChange', '.radio', function () {
      var array = $(this).attr('data-value');
      $(this).parents('.item-tab').find('#' + array).show().siblings(".space").hide();
      getSpaceQuantity(array);
    });
    $('.radio').trigger('radioChange');

    /**
     * @description 获取空间数量
     * @param detail  Boolean  是否统计详细信息（空间开通率、空间月活跃度、日均访问量），为true时统计，
     *                         详细统计后台会多出很多查询所以尽量不要进行详细信息的统计。
     */

    function getSpaceQuantity() {
      var url = service.prefix + '/space/count?detail=true&errorDomId=' + person_space;
      $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        success: function success(json) {
          if (json['code'] == 200) {
            // 个人空间
            $('#persontootal').html(json.data.person.spaceTotal);
            $('#researcher').html(json.data.person.researchSpaceNum);
            $('#teacher').html(json.data.person.teacherSpaceNum);
            $('#student').html(json.data.person.studentSpaceNum);
            $('#parent').html(json.data.person.parentSpaceNum);
            $('#paveragevisit').html(Math.round(json.data.person.avgVisit));
            $('#mainbo_echart_county .mainbo-label').html(Math.round(json.data.person.openRate * 100) + '%');
            $('#mainbo_echart_county').css('height', json.data.person.openRate * 100 + '%');

            // 群组空间
            $('#grouptotal').html(json.data.group.spaceTotal);
            $('#area').html(json.data.group.areaSpaceNum);
            $('#school').html(json.data.group.schoolSpaceNum);
            $('#class').html(json.data.group.classSpaceNum);
            $('#subject').html(json.data.group.subjectSpaceNum);
            $('#gaveragevisit').html(Math.round(json.data.group.avgVisit));
            render(json.data, '');
          }
        },
        error: function error(json) {}
      });
    }

    /**
     * @description 区域使用量统计（区域管理员）
     * @param detail  Boolean  是否统计详细信息（空间开通率、空间月活跃度、日均访问量），为true时统计，
     *                         详细统计后台会多出很多查询所以尽量不要进行详细信息的统计。
     */
    function regionalUsageStatistics() {
      $.getJSON(service.prefix + '/platform/org/person/count').success(function (result) {
        if (result['code'] == 200) {
          $('#c_bureauOfEducation').html(result.data.edu);
          $('#c_school').html(result.data.school);
          $('#c_teacher').html(result.data.teacher);
          $('#c_student').html(result.data.student);
          $('#c_parent').html(result.data.parent);

          $('#use_c_teacher').html(result.data.used.teacher);
          $('#use_c_parent').html(result.data.used.parent);
          $('#use_c_student').html(result.data.used.student);
          var array = [],
              i = 0;
          for (var key in result.data.used) {
            array[i] = { name: key, value: result.data.used[key] };
            i++;
          }
          array.sort(function (a, b) {
            return a.value - b.value;
          });
          for (var i = 0; i < array.length; i++) {
            if (array[i].value == 0) {
              $('#use_c_' + array[i].name).next().css('width', '0px');
            } else {
              $('#use_c_' + array[i].name).next().css('width', 54 * (i + 1) + 'px');
            }
          }
        }
      });
    }

    regionalUsageStatistics();

    /**
     * @description 个人空间和群组空间的月活跃度的SeriesData
     * @param v1 活跃度
     * @returns {{name: string, silent: boolean, clockwise: boolean, type: string, radius: [number,number], avoidLabelOverlap: boolean, label: {normal: {show: boolean, position: string, formatter: string, textStyle: {color: string, fontSize: number}}}, labelLine: {normal: {show: boolean}}, data: [*,*]}}
     */
    function getSeriesData(v1) {
      return {
        name: '',
        silent: true,
        clockwise: false,
        type: 'pie',
        radius: [40, 60],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
            formatter: Math.round(v1 * 100) + '%',
            textStyle: {
              color: '#fff',
              fontSize: 18
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [{
          value: v1,
          label: {
            normal: {
              show: true,
              position: 'center'
            }
          }
        }, {
          value: 1 - v1, name: 'other'
        }]
      };
    }

    function render(data, category) {
      if (!data) return false;
      switch (category) {
        case 'usertype':
          {
            var option_usertype = {
              color: ['#d0174f', '#316ec5', '#b653d1', '#14c7e0', '#53bb77', '#fdd51d', '#fd8c1d', '#3f86ea', '#ff3f66'],
              backgroundColor: '',
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br /> {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                x: 'left',
                y: '5%',
                itemGap: 20,
                selectedMode: false,
                textStyle: { color: '#e7e7e7', fontSize: 14 },
                data: data['legendData']
              },
              series: [{
                type: 'pie',
                radius: [0, '35%'],
                center: ['55%', '45%'],
                label: {
                  normal: {
                    position: 'inner'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: data['seriesData1']
              }, {
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['55%', '45%'],
                data: data['seriesData2']
              }]
            };
            echart_usertype && echart_usertype.setOption(option_usertype);
            common.echart.hideLoading(echart_usertype);
            break;
          }
        case 'platform_trend':
          {
            var option_platform_trend = {
              color: ['#00beff'],
              tooltip: {
                trigger: 'axis'
              },
              textStyle: {
                color: '#92accf',
                fontSize: 12
              },
              legend: {
                data: ['使用平台用户数'],
                x: 'center',
                textStyle: {
                  color: '#a1bce9',
                  fontSize: 14
                }
              },
              grid: {
                top: '13%',
                left: '1%',
                right: '1%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                boundaryGap: true,
                axisTick: {
                  alignWithLabel: true
                },
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
              series: {
                name: ['使用平台用户数'],
                type: 'line',
                data: data['seriesData']
              }
            };
            echart_platform_trend.setOption(option_platform_trend);
            common.echart.hideLoading(echart_platform_trend);
            break;
          }
        case 'resource_total':
          {
            var option_resource_total = {
              color: ['#d7423d', '#53bb77', '#f19d32', '#14c7e0', '#cf539f', '#3f86ea'],
              title: {},
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br/> {d}%"
              },
              calculable: true,
              series: [{
                name: '圆心',
                type: 'pie',
                radius: [0, 25],
                silent: true,
                itemStyle: {
                  normal: {
                    labelLine: {
                      show: false
                    },
                    color: '#fff',
                    borderColor: '#fff'
                  }
                },

                data: [100]
              }, {
                name: '资源总量',
                type: 'pie',
                radius: [25, 120],
                roseType: 'area',
                data: []
              }]
            };
            option_resource_total.series[1].data = data.type;
            echart_resource_total && echart_resource_total.setOption(option_resource_total);
            common.echart.hideLoading(echart_resource_total);
            break;
          }
        case 'usertype_school':
          {
            var option_usertype_school = {
              color: ['#ff3f66', '#ffba26', '#53bb77', '#3f86ea', '#b653d1'],
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: [{
                name: '用户类型',
                type: 'pie',
                radius: ['0%', '60%'],
                center: ['50%', '40%'],
                data: data['seriesData2']
              }]
            };

            echart_usertype_school && echart_usertype_school.setOption(option_usertype_school);
            common.echart.hideLoading(echart_platform_trend);
            break;
          }
        case 'useruse_school':
          {
            var option_useruse_school = {
              color: ['#28c983'],
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
              xAxis: [{
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
              yAxis: [{
                type: 'category',
                data: [],
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
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  textStyle: {
                    color: '#29c983'
                  }
                }
              },
              series: [{
                name: '使用次数',
                type: 'bar',
                barWidth: 20,
                data: []
              }]
            };
            for (var i = 0; i < data.length; i++) {
              option_useruse_school.yAxis[0].data[i] = data[i].name;
              option_useruse_school.series[0].data[i] = data[i].value;
            }
            echart_useruse_school && echart_useruse_school.setOption(option_useruse_school);
            common.echart.hideLoading(echart_useruse_school);
            break;
          }
        default:
          {
            var option = {
              backgroundColor: '',
              color: ['#4873dc', '#3e5284'],
              tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              series: [getSeriesData(data.person['monthVitality'])]
            };
            // 个人空间
            echart_pvitality.setOption(option);
            common.echart.hideLoading(echart_pvitality);
            // 群组空间
            option.series = getSeriesData(data.group['monthVitality']);
            echart_gvitality.setOption(option);
            common.echart.hideLoading(echart_gvitality);
          }
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbU1vZHVsZS9zdGF0aXN0aWNzL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25maWciLCJiYXNlVXJsIiwicGF0aHMiLCJjb25maWdwYXRocyIsImRlZmluZSIsIiQiLCJzZXJ2aWNlIiwiY29tbW9uIiwiUGFnaW5nIiwicm9sZSIsImVjaGFydF91c2VydHlwZSIsImVjaGFydCIsImluaXQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic2hvd0xvYWRpbmciLCJlY2hhcnRfcGxhdGZvcm1fdHJlbmQiLCJlY2hhcnRfcHZpdGFsaXR5IiwiZWNoYXJ0X2d2aXRhbGl0eSIsImVjaGFydF9yZXNvdXJjZV90b3RhbCIsImVjaGFydF91c2VydHlwZV9zY2hvb2wiLCJlY2hhcnRfdXNlcnVzZV9zY2hvb2wiLCJ1c2VydHlwZSIsInBsYXRmb3JtX3RyZW5kIiwicGVyc29uX3NwYWNlIiwiZ3JvdXBfc3BhY2UiLCJyZXNvdXJjZV90b3RhbCIsInVzZXJ1c2Vfc2Nob29sIiwiZ2V0SlNPTiIsInByZWZpeCIsInJlc3VsdCIsImtleSIsImRhdGEiLCJpbmRleE9mIiwiYWRkQ2xhc3MiLCJodG1sIiwidXNlclR5cGUiLCJwbGF0Zm9ybVVzZXJTdGF0aXN0aWNzIiwic3VjY2VzcyIsInJlbmRlciIsImNvbnZlcnRQaWVEYXRhIiwidXNlcnJvbGUiLCJwZXIiLCJNYXRoIiwicm91bmQiLCJjc3MiLCJmaW5kIiwidXNlcnR5cGVPYmoiLCJlZHUiLCJzY2hvb2wiLCJlZHVtYW5hZ2VyIiwiZWR1ZW1wbG95ZSIsInNjaG1hbmFnZXIiLCJwYXJlbnQiLCJzY2hlbXBsb3llIiwidGVhY2hlciIsInN0dWRlbnQiLCJsZWdlbmREYXRhIiwic2VyaWVzRGF0YTEiLCJzZXJpZXNEYXRhMiIsInRvdGFsX3NjaG9vbCIsImVhY2giLCJ2YWx1ZSIsInB1c2giLCJuYW1lIiwidW5zaGlmdCIsImN1cnJlbnRQYWdlIiwicmVkZXJUYWJsZSIsInR5cGUiLCJwYWdlTm8iLCJkb21JZCIsInVybCIsImRhdGFMaXN0IiwiaW5kZXgiLCJjbHMiLCJyYXRpbyIsImxlbmd0aCIsImVtcHR5IiwiYXBwZW5kIiwicGFnZUNvdW50IiwicmVuZGVyUGFnZSIsInRvdGFsU2l6ZSIsInBhZ2VJZCIsInRvdGFsIiwicCIsInRhcmdldCIsInBhZ2VzaXplIiwiY291bnQiLCJjYWxsYmFjayIsImN1cnJlbnQiLCJvbiIsInVzZXJTY2hvb2xGZXRjaERhdGEiLCJhdHRyIiwidHJpZ2dlciIsInRyZW5kRmV0Y2hEYXRhIiwicGxhdGZvcm1SZXNzdGF0aXN0aWNzIiwidGltZSIsInN0YXJ0dGltZSIsImVuZHRpbWUiLCJjb252ZXJ0RGF0YSIsInhBeGlzRGF0YSIsInNlcmllc0RhdGEiLCJpdGVtIiwic3BsaXQiLCJhcnJheSIsInBhcmVudHMiLCJzaG93Iiwic2libGluZ3MiLCJoaWRlIiwiZ2V0U3BhY2VRdWFudGl0eSIsImFqYXgiLCJkYXRhVHlwZSIsImpzb24iLCJwZXJzb24iLCJzcGFjZVRvdGFsIiwicmVzZWFyY2hTcGFjZU51bSIsInRlYWNoZXJTcGFjZU51bSIsInN0dWRlbnRTcGFjZU51bSIsInBhcmVudFNwYWNlTnVtIiwiYXZnVmlzaXQiLCJvcGVuUmF0ZSIsImdyb3VwIiwiYXJlYVNwYWNlTnVtIiwic2Nob29sU3BhY2VOdW0iLCJjbGFzc1NwYWNlTnVtIiwic3ViamVjdFNwYWNlTnVtIiwiZXJyb3IiLCJyZWdpb25hbFVzYWdlU3RhdGlzdGljcyIsInVzZWQiLCJpIiwic29ydCIsImEiLCJiIiwibmV4dCIsImdldFNlcmllc0RhdGEiLCJ2MSIsInNpbGVudCIsImNsb2Nrd2lzZSIsInJhZGl1cyIsImF2b2lkTGFiZWxPdmVybGFwIiwibGFiZWwiLCJub3JtYWwiLCJwb3NpdGlvbiIsImZvcm1hdHRlciIsInRleHRTdHlsZSIsImNvbG9yIiwiZm9udFNpemUiLCJsYWJlbExpbmUiLCJjYXRlZ29yeSIsIm9wdGlvbl91c2VydHlwZSIsImJhY2tncm91bmRDb2xvciIsInRvb2x0aXAiLCJsZWdlbmQiLCJvcmllbnQiLCJ4IiwieSIsIml0ZW1HYXAiLCJzZWxlY3RlZE1vZGUiLCJzZXJpZXMiLCJjZW50ZXIiLCJzZXRPcHRpb24iLCJoaWRlTG9hZGluZyIsIm9wdGlvbl9wbGF0Zm9ybV90cmVuZCIsImdyaWQiLCJ0b3AiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJjb250YWluTGFiZWwiLCJ4QXhpcyIsImJvdW5kYXJ5R2FwIiwiYXhpc1RpY2siLCJhbGlnbldpdGhMYWJlbCIsImF4aXNMYWJlbCIsImF4aXNMaW5lIiwibGluZVN0eWxlIiwieUF4aXMiLCJzcGxpdExpbmUiLCJvcHRpb25fcmVzb3VyY2VfdG90YWwiLCJ0aXRsZSIsImNhbGN1bGFibGUiLCJpdGVtU3R5bGUiLCJib3JkZXJDb2xvciIsInJvc2VUeXBlIiwib3B0aW9uX3VzZXJ0eXBlX3NjaG9vbCIsIm9wdGlvbl91c2VydXNlX3NjaG9vbCIsImF4aXNQb2ludGVyIiwiYmFyV2lkdGgiLCJvcHRpb24iXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxXQUFTLEtBREk7QUFFYkMsU0FBTztBQUNMLGtCQUFjO0FBRFQ7QUFGTSxDQUFmO0FBTUFILFFBQVEsQ0FBQyxZQUFELENBQVIsRUFBd0IsVUFBVUksV0FBVixFQUF1QjtBQUM3QztBQUNBSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7QUFDQUMsU0FBTyxFQUFQLEVBQVUsQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixRQUF0QixFQUFnQyxRQUFoQyxDQUFWLEVBQ0UsVUFBVUMsQ0FBVixFQUFhQyxPQUFiLEVBQXNCQyxNQUF0QixFQUE4QkMsTUFBOUIsRUFBc0M7QUFDcEMsUUFBSUMsT0FBT0YsT0FBT0UsSUFBbEI7QUFDQSxRQUFJQyxrQkFBa0JILE9BQU9JLE1BQVAsQ0FBY0MsSUFBZCxDQUFtQkMsU0FBU0MsY0FBVCxDQUF3QixVQUF4QixDQUFuQixDQUF0QjtBQUNBUCxXQUFPSSxNQUFQLENBQWNJLFdBQWQsQ0FBMEJM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TyxDQUFDLFNBQUQsRUFBWSxTQUFaLENBRkk7QUFHWE0sdUJBQVM7QUFDUDdDLHNCQUFNLEtBREM7QUFFUGIseUJBQVMsTUFGRjtBQUdQa0QsMkJBQVc7QUFISixlQUhFO0FBUVhlLHNCQUFRLENBQUN4QixjQUFjdEcsS0FBS2lGLE1BQUwsQ0FBWSxlQUFaLENBQWQsQ0FBRDtBQVJHLGFBQWI7QUFVQTtBQUNBaEcsNkJBQWlCK0ksU0FBakIsQ0FBMkI0QixNQUEzQjtBQUNBckwsbUJBQU9JLE1BQVAsQ0FBY3NKLFdBQWQsQ0FBMEJoSixnQkFBMUI7QUFDQTtBQUNBMkssbUJBQU85QixNQUFQLEdBQWdCeEIsY0FBY3RHLEtBQUt5RixLQUFMLENBQVcsZUFBWCxDQUFkLENBQWhCO0FBQ0F2Ryw2QkFBaUI4SSxTQUFqQixDQUEyQjRCLE1BQTNCO0FBQ0FyTCxtQkFBT0ksTUFBUCxDQUFjc0osV0FBZCxDQUEwQi9JLGdCQUExQjtBQUNEO0FBdFJIO0FBd1JEO0FBQ0YsR0FwcEJIO0FBcXBCRCxDQXhwQkQiLCJmaWxlIjoiY3VzdG9tTW9kdWxlL3N0YXRpc3RpY3MvanMvaW5kZXgtM2MzNTE4NzVkZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ2N1c3RvbUNvbmYnOiAnc3RhdGlzdGljcy9qcy9jdXN0b21Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydjdXN0b21Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcbiAgZGVmaW5lKCcnLFsnanF1ZXJ5JywgJ3NlcnZpY2UnLCAnY29tbW9uJywgJ3BhZ2luZyddLFxyXG4gICAgZnVuY3Rpb24gKCQsIHNlcnZpY2UsIGNvbW1vbiwgUGFnaW5nKSB7XHJcbiAgICAgIHZhciByb2xlID0gY29tbW9uLnJvbGU7XHJcbiAgICAgIHZhciBlY2hhcnRfdXNlcnR5cGUgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJ0eXBlJykpO1xyXG4gICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF91c2VydHlwZSk7XHJcbiAgICAgIHZhciBlY2hhcnRfcGxhdGZvcm1fdHJlbmQgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXRmb3JtX3RyZW5kJykpO1xyXG4gICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9wbGF0Zm9ybV90cmVuZCk7XHJcbiAgICAgIHZhciBlY2hhcnRfcHZpdGFsaXR5ID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdml0YWxpdHknKSk7XHJcbiAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X3B2aXRhbGl0eSk7XHJcbiAgICAgIHZhciBlY2hhcnRfZ3ZpdGFsaXR5ID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdndml0YWxpdHknKSk7XHJcbiAgICAgIGNvbW1vbi5lY2hhcnQuc2hvd0xvYWRpbmcoZWNoYXJ0X2d2aXRhbGl0eSk7XHJcbiAgICAgIHZhciBlY2hhcnRfcmVzb3VyY2VfdG90YWwgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc291cmNlX3RvdGFsJykpO1xyXG4gICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9yZXNvdXJjZV90b3RhbCk7XHJcblxyXG4gICAgICAvLyDlrabmoKHnrqHnkIblkZhcclxuICAgICAgdmFyIGVjaGFydF91c2VydHlwZV9zY2hvb2wgPSBjb21tb24uZWNoYXJ0LmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXJ0eXBlX3NjaG9vbCcpKTtcclxuICAgICAgdmFyIGVjaGFydF91c2VydXNlX3NjaG9vbCA9IGNvbW1vbi5lY2hhcnQuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcnVzZV9zY2hvb2wnKSk7XHJcblxyXG4gICAgICAvLyBlcnJvckRvbUlEXHJcbiAgICAgIHZhciB1c2VydHlwZSA9ICd1c2VydHlwZSc7XHJcbiAgICAgIHZhciBwbGF0Zm9ybV90cmVuZCA9ICdwbGF0Zm9ybV90cmVuZCc7XHJcbiAgICAgIHZhciBwZXJzb25fc3BhY2UgPSAncGVyc29uX3NwYWNlJztcclxuICAgICAgdmFyIGdyb3VwX3NwYWNlID0gJ2dyb3VwX3NwYWNlJztcclxuICAgICAgdmFyIHJlc291cmNlX3RvdGFsID0gJ3Jlc291cmNlX3RvdGFsJztcclxuICAgICAgdmFyIHVzZXJ1c2Vfc2Nob29sID0gJ3VzZXJ1c2Vfc2Nob29sJztcclxuXHJcbiAgICAgIC8vIOW5s+WPsOS9v+eUqOaDheWGtVxyXG4gICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3BsYXRmb3JtL2NvdW50JywgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiByZXN1bHQuZGF0YSkge1xyXG4gICAgICAgICAgaWYgKChyZXN1bHQuZGF0YVtrZXldICsgJycpLmluZGV4T2YoJysnKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICQoJyMnICsga2V5KS5hZGRDbGFzcygnYWRkJyk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKChyZXN1bHQuZGF0YVtrZXldICsgJycpLmluZGV4T2YoJy0nKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICQoJyMnICsga2V5KS5hZGRDbGFzcygnbWludXMnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICQoJyMnICsga2V5KS5odG1sKHJlc3VsdC5kYXRhW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyDlubPlj7Dkvb/nlKjnlKjmiLfnu5/orqEg55So5oi357G75Z6L5YiG5biDXHJcbiAgICAgIHZhciB1c2VyVHlwZSA9IHt9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gcGxhdGZvcm1Vc2VyU3RhdGlzdGljcygpIHtcclxuICAgICAgICAkLmdldEpTT04oc2VydmljZS5wcmVmaXggKyAnL3BsYXRmb3JtL3VzZXJ0eXBlP2Vycm9yRG9tSUQ9JyArIHVzZXJ0eXBlKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgdXNlclR5cGUgPSByZXN1bHRbJ2RhdGEnXVsndXNlcnJvbGUnXTtcclxuICAgICAgICAgICAgICByZW5kZXIoY29udmVydFBpZURhdGEocmVzdWx0LmRhdGEudXNlcnJvbGUpLCAndXNlcnR5cGUnKTtcclxuICAgICAgICAgICAgICByZW5kZXIoY29udmVydFBpZURhdGEocmVzdWx0LmRhdGEudXNlcnJvbGUpLCAndXNlcnR5cGVfc2Nob29sJyk7XHJcbiAgICAgICAgICAgICAgaWYgKHJvbGUgPT09ICdzY2hvb2wnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGVyID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbJ2RhdGEnXVsncGVyc29uJ10gPT0gMCkgcGVyID0gMDtcclxuICAgICAgICAgICAgICAgIGVsc2UgcGVyID0gTWF0aC5yb3VuZChyZXN1bHRbJ2RhdGEnXVsndXNlZCddICogMTAwIC8gcmVzdWx0WydkYXRhJ11bJ3BlcnNvbiddKTtcclxuICAgICAgICAgICAgICAgIGlmIChwZXIgPiAxMDApIHBlciA9IDEwMDtcclxuICAgICAgICAgICAgICAgICQoJyNtYWluYm9fZWNoYXJ0X3NjaG9vbCcpLmNzcygnd2lkdGgnLCBwZXIgKyAnJScpLmZpbmQoJy5tYWluYm8tbGFiZWwnKS5odG1sKHBlciArICclJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHVzZXJ0eXBlT2JqID0ge1xyXG4gICAgICAgIGVkdTogJ+aVmeiCsuWxgCcsXHJcbiAgICAgICAgc2Nob29sOiAn5a2m5qChJyxcclxuICAgICAgICB1c2Vycm9sZToge1xyXG4gICAgICAgICAgZWR1bWFuYWdlcjogJ+aVmeiCsuWxgOeuoeeQhuiAhScsXHJcbiAgICAgICAgICBlZHVlbXBsb3llOiAn5pWZ6IKy5bGA6IGM5belJyxcclxuICAgICAgICAgIHNjaG1hbmFnZXI6ICflrabmoKHnrqHnkIbogIUnLFxyXG4gICAgICAgICAgcGFyZW50OiAn5a626ZW/JyxcclxuICAgICAgICAgIHNjaGVtcGxveWU6ICflrabmoKHogYzlt6UnLFxyXG4gICAgICAgICAgdGVhY2hlcjogJ+aVmeW4iCcsXHJcbiAgICAgICAgICBzdHVkZW50OiAn5a2m55SfJ1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChyb2xlID09PSAnc2Nob29sJykge1xyXG4gICAgICAgIGRlbGV0ZSAgdXNlcnR5cGVPYmoudXNlcnJvbGUuZWR1bWFuYWdlcjtcclxuICAgICAgICBkZWxldGUgIHVzZXJ0eXBlT2JqLnVzZXJyb2xlLmVkdWVtcGxveWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNvbnZlcnRQaWVEYXRhKGRhdGEpIHtcclxuICAgICAgICB2YXIgbGVnZW5kRGF0YSA9IFtdLCBzZXJpZXNEYXRhMSA9IFtdLCBzZXJpZXNEYXRhMiA9IFtdLCB0b3RhbF9zY2hvb2wgPSAwO1xyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgaWYgKHVzZXJ0eXBlT2JqWyd1c2Vycm9sZSddW2tleV0pIHtcclxuICAgICAgICAgICAgbGVnZW5kRGF0YS5wdXNoKHVzZXJ0eXBlT2JqWyd1c2Vycm9sZSddW2tleV0pO1xyXG4gICAgICAgICAgICBzZXJpZXNEYXRhMi5wdXNoKHtuYW1lOiB1c2VydHlwZU9ialsndXNlcnJvbGUnXVtrZXldLCB2YWx1ZTogdmFsdWV9KTtcclxuICAgICAgICAgICAgaWYgKGtleSAhPSAnZWR1bWFuYWdlcicgJiYga2V5ICE9ICdlZHVlbXBsb3llJykgdG90YWxfc2Nob29sICs9IHZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChyb2xlICE9PSAnc2Nob29sJykge1xyXG4gICAgICAgICAgbGVnZW5kRGF0YS51bnNoaWZ0KHVzZXJ0eXBlT2JqWydlZHUnXSwgdXNlcnR5cGVPYmpbJ3NjaG9vbCddKTtcclxuICAgICAgICAgIHNlcmllc0RhdGExLnB1c2goe25hbWU6IHVzZXJ0eXBlT2JqWydlZHUnXSwgdmFsdWU6IGRhdGFbJ2VkdWVtcGxveWUnXX0pO1xyXG4gICAgICAgICAgc2VyaWVzRGF0YTEucHVzaCh7bmFtZTogdXNlcnR5cGVPYmpbJ3NjaG9vbCddLCB2YWx1ZTogdG90YWxfc2Nob29sfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbGVnZW5kRGF0YTogbGVnZW5kRGF0YSxcclxuICAgICAgICAgIHNlcmllc0RhdGExOiBzZXJpZXNEYXRhMSxcclxuICAgICAgICAgIHNlcmllc0RhdGEyOiBzZXJpZXNEYXRhMlxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBsYXRmb3JtVXNlclN0YXRpc3RpY3MoKTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5ZCE5Yy65Z+f55So5oi35pWw6YeP5o6S5ZCN5Y+K5Y2g5q+UXHJcbiAgICAgICAqIEBwYXJhbSB0eXBlIFN0cmluZyAg57G75Z6L77yIYXJlYTrljLrln5/vvIxzY2hvb2w65a2m5qCh77yJXHJcbiAgICAgICAqIEBwYXJhbSByb2xlIFN0cmluZyAg55So5oi36KeS6Imy77yIdGVhY2hlcjrogIHluIjvvIxzdHVkZW50OuWtpueUn++8iVxyXG4gICAgICAgKi9cclxuICAgICAgdmFyIGN1cnJlbnRQYWdlID0gMTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlZGVyVGFibGUodHlwZSwgcGFnZU5vLCBkb21JZCkge1xyXG4gICAgICAgIHBhZ2VObyA9IHBhZ2VObyB8fCAxO1xyXG4gICAgICAgIHZhciB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICcvcGxhdGZvcm0vJyArIHR5cGUgKyAnL3Jhbmtpbmc/cGFnZU5vPScgKyBwYWdlTm8gKyAnJmVycm9yRG9tSWQ9JyArIGRvbUlkO1xyXG4gICAgICAgICQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcblxyXG4gICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09IDIwMCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnc2Nob29sJykge1xyXG4gICAgICAgICAgICAgICQuZWFjaChyZXN1bHQuZGF0YS5kYXRhTGlzdCwgZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNscyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKChpbmRleCArICgocGFnZU5vIC0gMSkgKiAxMCkpIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICBjbHMgPSAnbnVtMSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPHRyPjx0ZCBzdHlsZT0ncGFkZGluZy1sZWZ0OjEwJTt0ZXh0LWFsaWduOmxlZnQ7Jz48c3BhbiBjbGFzcz0nbnVtIFwiICsgY2xzICsgXCInPlwiXHJcbiAgICAgICAgICAgICAgICAgICsgKCgocGFnZU5vIC0gMSkgKiAxMCkgKyBpbmRleCArIDEpICsgXCI8L3NwYW4+XCJcclxuICAgICAgICAgICAgICAgICAgKyBcIjxzdHJvbmcgY2xhc3M9J3N0cm9uZycgdGl0bGU9J1wiICsgcmVzdWx0LmRhdGEuZGF0YUxpc3RbaW5kZXhdLm5hbWUgKyBcIic+XCIgKyByZXN1bHQuZGF0YS5kYXRhTGlzdFtpbmRleF0ubmFtZSArIFwiPC9zdHJvbmc+PC90ZD5cIiArIFwiPHRkPlwiICtcclxuICAgICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEuZGF0YUxpc3RbaW5kZXhdLnZhbHVlICsgXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgJCgnIycgKyBkb21JZCkuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdhcmVhJykge1xyXG4gICAgICAgICAgICAgICQuZWFjaChyZXN1bHQuZGF0YS5kYXRhTGlzdCwgZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNscyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKChpbmRleCArICgocGFnZU5vIC0gMSkgKiAxMCkpIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICBjbHMgPSAnbnVtMSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBodG1sICs9IFwiPHRyPjx0ZCBzdHlsZT0ncGFkZGluZy1sZWZ0OjEwJTt0ZXh0LWFsaWduOmxlZnQ7Jz48c3BhbiBjbGFzcz0nbnVtIFwiICsgY2xzICsgXCInPlwiXHJcbiAgICAgICAgICAgICAgICAgICsgKCgocGFnZU5vIC0gMSkgKiAxMCkgKyBpbmRleCArIDEpICsgXCI8L3NwYW4+XCJcclxuICAgICAgICAgICAgICAgICAgKyBcIjxzdHJvbmcgY2xhc3M9J3N0cm9uZycgdGl0bGU9J1wiICsgcmVzdWx0LmRhdGEuZGF0YUxpc3RbaW5kZXhdLm5hbWUgKyBcIic+XCIgKyByZXN1bHQuZGF0YS5kYXRhTGlzdFtpbmRleF0ubmFtZSArIFwiPC9zdHJvbmc+PC90ZD5cIiArIFwiPHRkPlwiICtcclxuICAgICAgICAgICAgICAgICAgcmVzdWx0LmRhdGEuZGF0YUxpc3RbaW5kZXhdLnZhbHVlICsgXCI8L3RkPlwiXHJcbiAgICAgICAgICAgICAgICAgICsgXCI8dGQ+XCIgKyByZXN1bHQuZGF0YS5kYXRhTGlzdFtpbmRleF0ucmF0aW8gKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAkKCcjJyArIGRvbUlkKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIOS4uuepuuaPkOekulxyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmRhdGEuZGF0YUxpc3QubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgJCgnLnRhYmxlV3JhcEluZGV4IHRhYmxlJykuZW1wdHkoKS5hcHBlbmQoJzxkaXYgaWQ9XCJlbXB0eV9pbmZvXCI+PGRpdj48cD7msqHmnInnm7jlhbPlhoXlrrk8L3A+PC9kaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5kYXRhLnBhZ2VDb3VudCA+IDEgJiYgY3VycmVudFBhZ2UgPT09IDEpIHJlbmRlclBhZ2UoJ3BhZ2VUb29sJywgcmVzdWx0LmRhdGEudG90YWxTaXplLCB0eXBlLCBkb21JZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVuZGVyUGFnZShwYWdlSWQsIHRvdGFsLCB0eXBlLCBkb21JZCkge1xyXG4gICAgICAgIGN1cnJlbnRQYWdlKys7XHJcbiAgICAgICAgJCgnIycgKyBwYWdlSWQpLmh0bWwoJycpO1xyXG4gICAgICAgIHZhciBwID0gbmV3IFBhZ2luZygpO1xyXG4gICAgICAgIHAuaW5pdCh7XHJcbiAgICAgICAgICB0YXJnZXQ6ICcjJyArIHBhZ2VJZCwgcGFnZXNpemU6IDEwLCBwYWdlQ291bnQ6IDEsXHJcbiAgICAgICAgICBjb3VudDogdG90YWwsIGNhbGxiYWNrOiBmdW5jdGlvbiAoY3VycmVudCkge1xyXG4gICAgICAgICAgICByZWRlclRhYmxlKHR5cGUsIGN1cnJlbnQsIGRvbUlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJvbGUgPT09ICdjaXR5JykgcmVkZXJUYWJsZSgnYXJlYScsICcnLCAncmFua19wZXJjZW50Jyk7XHJcbiAgICAgIGVsc2UgaWYgKHJvbGUgPT09ICdjb3VudHknKSByZWRlclRhYmxlKCdzY2hvb2wnLCAnJywgJ3JhbmtfY291bnR5Jyk7XHJcblxyXG4gICAgICAvLyDlrabmoKHnrqHnkIblkZjigJTigJTnlKjmiLfkvb/nlKjmg4XlhrVcclxuICAgICAgLy8g55So5oi35L2/55So5qyh5pWw5o6S5ZCNXHJcbiAgICAgICQoJ2JvZHknKS5vbigndGFiQ2hhbmdlJywgJy50YWInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdXNlclNjaG9vbEZldGNoRGF0YSgkKHRoaXMpLmF0dHIoJ2RhdGEtdmFsdWUnKSwgJ3VzZXJ1c2Vfc2Nob29sJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcudGFiJykudHJpZ2dlcigndGFiQ2hhbmdlJyk7XHJcblxyXG4gICAgICBmdW5jdGlvbiB1c2VyU2Nob29sRmV0Y2hEYXRhKHJvbGUsIHVzZXJ1c2Vfc2Nob29sKSB7XHJcbiAgICAgICAgZWNoYXJ0X3VzZXJ1c2Vfc2Nob29sID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VydXNlX3NjaG9vbCcpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF91c2VydXNlX3NjaG9vbCk7XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9wbGF0Zm9ybS9wZXJzb24vcmFua2luZz9yb2xlPScgKyByb2xlICsgJyZlcnJvckRvbUlkPScgKyB1c2VydXNlX3NjaG9vbFxyXG4gICAgICAgICAgLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHJlbmRlcihyZXN1bHQuZGF0YSwgJ3VzZXJ1c2Vfc2Nob29sJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdXNlclNjaG9vbEZldGNoRGF0YSgndGVhY2hlcicsICd1c2VydXNlX3NjaG9vbCcpO1xyXG5cclxuLy8g5bmz5Y+w5L2/55So6LaL5Yq/5LiL5ouJ5qGGXHJcbiAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0Q2hhbmdlJywgJy5zZWxlY3RUb3AnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJlbmRGZXRjaERhdGEoJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJykpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnLnNlbGVjdFRvcCcpLnRyaWdnZXIoJ3NlbGVjdENoYW5nZScpO1xyXG5cclxuXHJcbiAgICAgIC8vIOW5s+WPsOi1hOa6kOe7n+iuoVxyXG4gICAgICBmdW5jdGlvbiBwbGF0Zm9ybVJlc3N0YXRpc3RpY3MoKSB7XHJcbiAgICAgICAgJC5nZXRKU09OKHNlcnZpY2UucHJlZml4ICsgJy9yZXNvdXJjZS9yZXNvdXJjZVR5cGVTdGF0aXN0aWNzP2Vycm9yRG9tSWQ9JyArIHJlc291cmNlX3RvdGFsKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgJCgnI2dyb3VwY291bnQxJykuaHRtbChyZXN1bHQuZGF0YS50b3RhbCk7XHJcbiAgICAgICAgICAgICAgcmVuZGVyKHJlc3VsdC5kYXRhLCAncmVzb3VyY2VfdG90YWwnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBsYXRmb3JtUmVzc3RhdGlzdGljcygpO1xyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5bmz5Y+w5L2/55So6LaL5Yq/57uf6K6hXHJcbiAgICAgICAqIEBwYXJhbSB0aW1lIOaXtumXtOautSh5ZXN0ZXJkYXk65pio5aSp77yMbGFzdHNldmVu77ya5pyA6L+R5LiD5aSp77yMbGFzdHRoaXJ0ee+8muacgOi/keS4ieWNgeWkqSlcclxuICAgICAgICogQHBhcmFtIHN0YXJ0dGltZVxyXG4gICAgICAgKiBAcGFyYW0gZW5kdGltZVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gdHJlbmRGZXRjaERhdGEodGltZSwgc3RhcnR0aW1lLCBlbmR0aW1lKSB7XHJcbiAgICAgICAgZWNoYXJ0X3BsYXRmb3JtX3RyZW5kID0gY29tbW9uLmVjaGFydC5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF0Zm9ybV90cmVuZCcpKTtcclxuICAgICAgICBjb21tb24uZWNoYXJ0LnNob3dMb2FkaW5nKGVjaGFydF9wbGF0Zm9ybV90cmVuZCk7XHJcbiAgICAgICAgdmFyIHVybCA9IHNlcnZpY2UucHJlZml4ICsgJy9wbGF0Zm9ybS90ZW5kZW5jeT90aW1lPScgKyB0aW1lICsgJyZlcnJvckRvbUlkPScgKyBwbGF0Zm9ybV90cmVuZDtcclxuICAgICAgICBpZiAoc3RhcnR0aW1lICYmIGVuZHRpbWUpIHVybCArPSAnJnN0YXJ0dGltZT0nICsgc3RhcnR0aW1lICsgJyZlbmR0aW1lPScgKyBlbmR0aW1lO1xyXG4gICAgICAgICQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgcmVuZGVyKGNvbnZlcnREYXRhKHJlc3VsdC5kYXRhKSwgcGxhdGZvcm1fdHJlbmQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gY29udmVydERhdGEoZGF0YSkge1xyXG4gICAgICAgIHZhciB4QXhpc0RhdGEgPSBbXSwgc2VyaWVzRGF0YSA9IFtdO1xyXG4gICAgICAgICQuZWFjaChkYXRhLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgIHZhciB0aW1lID0gaXRlbVsndGltZSddICsgJyc7XHJcbiAgICAgICAgICBpZiAodGltZS5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgIHRpbWUgPSB0aW1lLmxlbmd0aCA8IDIgPyAnMCcgKyB0aW1lIDogdGltZTtcclxuICAgICAgICAgICAgdGltZSArPSAnOjAwJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRpbWUgPSB0aW1lLnNwbGl0KCcgJylbMF07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB4QXhpc0RhdGEucHVzaCh0aW1lKTtcclxuICAgICAgICAgIHNlcmllc0RhdGEucHVzaChpdGVtWyd2YWx1ZSddKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgeEF4aXNEYXRhOiB4QXhpc0RhdGEsXHJcbiAgICAgICAgICBzZXJpZXNEYXRhOiBzZXJpZXNEYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0cmVuZEZldGNoRGF0YSgneWVzdGVyZGF5JywgJ3BsYXRmb3JtX3RyZW5kJyk7XHJcblxyXG4gICAgICAvLyDkuKrkurrnqbrpl7TvvIznvqTnu4Tnqbrpl7TliIfmjaJcclxuICAgICAgJCgnYm9keScpLm9uKCdyYWRpb0NoYW5nZScsICcucmFkaW8nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFycmF5ID0gJCh0aGlzKS5hdHRyKCdkYXRhLXZhbHVlJyk7XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuaXRlbS10YWInKS5maW5kKCcjJyArIGFycmF5KS5zaG93KCkuc2libGluZ3MoXCIuc3BhY2VcIikuaGlkZSgpO1xyXG4gICAgICAgIGdldFNwYWNlUXVhbnRpdHkoYXJyYXkpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnLnJhZGlvJykudHJpZ2dlcigncmFkaW9DaGFuZ2UnKTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g6I635Y+W56m66Ze05pWw6YePXHJcbiAgICAgICAqIEBwYXJhbSBkZXRhaWwgIEJvb2xlYW4gIOaYr+WQpue7n+iuoeivpue7huS/oeaBr++8iOepuumXtOW8gOmAmueOh+OAgeepuumXtOaciOa0u+i3g+W6puOAgeaXpeWdh+iuv+mXrumHj++8ie+8jOS4unRydWXml7bnu5/orqHvvIxcclxuICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAg6K+m57uG57uf6K6h5ZCO5Y+w5Lya5aSa5Ye65b6I5aSa5p+l6K+i5omA5Lul5bC96YeP5LiN6KaB6L+b6KGM6K+m57uG5L+h5oGv55qE57uf6K6h44CCXHJcbiAgICAgICAqL1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0U3BhY2VRdWFudGl0eSgpIHtcclxuICAgICAgICB2YXIgdXJsID0gc2VydmljZS5wcmVmaXggKyAnL3NwYWNlL2NvdW50P2RldGFpbD10cnVlJmVycm9yRG9tSWQ9JyArIHBlcnNvbl9zcGFjZTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdHlwZTogXCJHRVRcIixcclxuICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGpzb24pIHtcclxuICAgICAgICAgICAgaWYgKGpzb25bJ2NvZGUnXSA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAvLyDkuKrkurrnqbrpl7RcclxuICAgICAgICAgICAgICAkKCcjcGVyc29udG9vdGFsJykuaHRtbChqc29uLmRhdGEucGVyc29uLnNwYWNlVG90YWwpO1xyXG4gICAgICAgICAgICAgICQoJyNyZXNlYXJjaGVyJykuaHRtbChqc29uLmRhdGEucGVyc29uLnJlc2VhcmNoU3BhY2VOdW0pO1xyXG4gICAgICAgICAgICAgICQoJyN0ZWFjaGVyJykuaHRtbChqc29uLmRhdGEucGVyc29uLnRlYWNoZXJTcGFjZU51bSk7XHJcbiAgICAgICAgICAgICAgJCgnI3N0dWRlbnQnKS5odG1sKGpzb24uZGF0YS5wZXJzb24uc3R1ZGVudFNwYWNlTnVtKTtcclxuICAgICAgICAgICAgICAkKCcjcGFyZW50JykuaHRtbChqc29uLmRhdGEucGVyc29uLnBhcmVudFNwYWNlTnVtKTtcclxuICAgICAgICAgICAgICAkKCcjcGF2ZXJhZ2V2aXNpdCcpLmh0bWwoTWF0aC5yb3VuZChqc29uLmRhdGEucGVyc29uLmF2Z1Zpc2l0KSk7XHJcbiAgICAgICAgICAgICAgJCgnI21haW5ib19lY2hhcnRfY291bnR5IC5tYWluYm8tbGFiZWwnKS5odG1sKE1hdGgucm91bmQoanNvbi5kYXRhLnBlcnNvbi5vcGVuUmF0ZSAqIDEwMCkgKyAnJScpO1xyXG4gICAgICAgICAgICAgICQoJyNtYWluYm9fZWNoYXJ0X2NvdW50eScpLmNzcygnaGVpZ2h0JywganNvbi5kYXRhLnBlcnNvbi5vcGVuUmF0ZSAqIDEwMCArICclJyk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIOe+pOe7hOepuumXtFxyXG4gICAgICAgICAgICAgICQoJyNncm91cHRvdGFsJykuaHRtbChqc29uLmRhdGEuZ3JvdXAuc3BhY2VUb3RhbCk7XHJcbiAgICAgICAgICAgICAgJCgnI2FyZWEnKS5odG1sKGpzb24uZGF0YS5ncm91cC5hcmVhU3BhY2VOdW0pO1xyXG4gICAgICAgICAgICAgICQoJyNzY2hvb2wnKS5odG1sKGpzb24uZGF0YS5ncm91cC5zY2hvb2xTcGFjZU51bSk7XHJcbiAgICAgICAgICAgICAgJCgnI2NsYXNzJykuaHRtbChqc29uLmRhdGEuZ3JvdXAuY2xhc3NTcGFjZU51bSk7XHJcbiAgICAgICAgICAgICAgJCgnI3N1YmplY3QnKS5odG1sKGpzb24uZGF0YS5ncm91cC5zdWJqZWN0U3BhY2VOdW0pO1xyXG4gICAgICAgICAgICAgICQoJyNnYXZlcmFnZXZpc2l0JykuaHRtbChNYXRoLnJvdW5kKGpzb24uZGF0YS5ncm91cC5hdmdWaXNpdCkpO1xyXG4gICAgICAgICAgICAgIHJlbmRlcihqc29uLmRhdGEsICcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoanNvbikge1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiDljLrln5/kvb/nlKjph4/nu5/orqHvvIjljLrln5/nrqHnkIblkZjvvIlcclxuICAgICAgICogQHBhcmFtIGRldGFpbCAgQm9vbGVhbiAg5piv5ZCm57uf6K6h6K+m57uG5L+h5oGv77yI56m66Ze05byA6YCa546H44CB56m66Ze05pyI5rS76LeD5bqm44CB5pel5Z2H6K6/6Zeu6YeP77yJ77yM5Li6dHJ1ZeaXtue7n+iuoe+8jFxyXG4gICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICDor6bnu4bnu5/orqHlkI7lj7DkvJrlpJrlh7rlvojlpJrmn6Xor6LmiYDku6XlsL3ph4/kuI3opoHov5vooYzor6bnu4bkv6Hmga/nmoTnu5/orqHjgIJcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHJlZ2lvbmFsVXNhZ2VTdGF0aXN0aWNzKCkge1xyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLnByZWZpeCArICcvcGxhdGZvcm0vb3JnL3BlcnNvbi9jb3VudCcpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbJ2NvZGUnXSA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAkKCcjY19idXJlYXVPZkVkdWNhdGlvbicpLmh0bWwocmVzdWx0LmRhdGEuZWR1KTtcclxuICAgICAgICAgICAgICAkKCcjY19zY2hvb2wnKS5odG1sKHJlc3VsdC5kYXRhLnNjaG9vbCk7XHJcbiAgICAgICAgICAgICAgJCgnI2NfdGVhY2hlcicpLmh0bWwocmVzdWx0LmRhdGEudGVhY2hlcik7XHJcbiAgICAgICAgICAgICAgJCgnI2Nfc3R1ZGVudCcpLmh0bWwocmVzdWx0LmRhdGEuc3R1ZGVudCk7XHJcbiAgICAgICAgICAgICAgJCgnI2NfcGFyZW50JykuaHRtbChyZXN1bHQuZGF0YS5wYXJlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAkKCcjdXNlX2NfdGVhY2hlcicpLmh0bWwocmVzdWx0LmRhdGEudXNlZC50ZWFjaGVyKTtcclxuICAgICAgICAgICAgICAkKCcjdXNlX2NfcGFyZW50JykuaHRtbChyZXN1bHQuZGF0YS51c2VkLnBhcmVudCk7XHJcbiAgICAgICAgICAgICAgJCgnI3VzZV9jX3N0dWRlbnQnKS5odG1sKHJlc3VsdC5kYXRhLnVzZWQuc3R1ZGVudCk7XHJcbiAgICAgICAgICAgICAgdmFyIGFycmF5ID0gW10sIGkgPSAwO1xyXG4gICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZXN1bHQuZGF0YS51c2VkKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHtuYW1lOiBrZXksIHZhbHVlOiByZXN1bHQuZGF0YS51c2VkW2tleV19O1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBhcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSAtIGIudmFsdWU7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldLnZhbHVlID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgJCgnI3VzZV9jXycgKyBhcnJheVtpXS5uYW1lKS5uZXh0KCkuY3NzKCd3aWR0aCcsICcwcHgnKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICQoJyN1c2VfY18nICsgYXJyYXlbaV0ubmFtZSkubmV4dCgpLmNzcygnd2lkdGgnLCA1NCAqIChpICsgMSkgKyAncHgnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgcmVnaW9uYWxVc2FnZVN0YXRpc3RpY3MoKTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24g5Liq5Lq656m66Ze05ZKM576k57uE56m66Ze055qE5pyI5rS76LeD5bqm55qEU2VyaWVzRGF0YVxyXG4gICAgICAgKiBAcGFyYW0gdjEg5rS76LeD5bqmXHJcbiAgICAgICAqIEByZXR1cm5zIHt7bmFtZTogc3RyaW5nLCBzaWxlbnQ6IGJvb2xlYW4sIGNsb2Nrd2lzZTogYm9vbGVhbiwgdHlwZTogc3RyaW5nLCByYWRpdXM6IFtudW1iZXIsbnVtYmVyXSwgYXZvaWRMYWJlbE92ZXJsYXA6IGJvb2xlYW4sIGxhYmVsOiB7bm9ybWFsOiB7c2hvdzogYm9vbGVhbiwgcG9zaXRpb246IHN0cmluZywgZm9ybWF0dGVyOiBzdHJpbmcsIHRleHRTdHlsZToge2NvbG9yOiBzdHJpbmcsIGZvbnRTaXplOiBudW1iZXJ9fX0sIGxhYmVsTGluZToge25vcm1hbDoge3Nob3c6IGJvb2xlYW59fSwgZGF0YTogWyosKl19fVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZ2V0U2VyaWVzRGF0YSh2MSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICAgIHNpbGVudDogdHJ1ZSxcclxuICAgICAgICAgIGNsb2Nrd2lzZTogZmFsc2UsXHJcbiAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgIHJhZGl1czogWzQwLCA2MF0sXHJcbiAgICAgICAgICBhdm9pZExhYmVsT3ZlcmxhcDogZmFsc2UsXHJcbiAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiBmYWxzZSxcclxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgZm9ybWF0dGVyOiAoTWF0aC5yb3VuZCh2MSAqIDEwMCkgKyAnJScpLFxyXG4gICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxOFxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxhYmVsTGluZToge1xyXG4gICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICBzaG93OiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGF0YTogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IHYxLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdjZW50ZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6ICgxIC0gdjEpLCBuYW1lOiAnb3RoZXInXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlbmRlcihkYXRhLCBjYXRlZ29yeSkge1xyXG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHN3aXRjaCAoY2F0ZWdvcnkpIHtcclxuICAgICAgICAgIGNhc2UgJ3VzZXJ0eXBlJzoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uX3VzZXJ0eXBlID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyNkMDE3NGYnLCAnIzMxNmVjNScsICcjYjY1M2QxJywgJyMxNGM3ZTAnLCAnIzUzYmI3NycsICcjZmRkNTFkJywgJyNmZDhjMWQnLCAnIzNmODZlYScsICcjZmYzZjY2J10sXHJcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnJyxcclxuICAgICAgICAgICAgICB0b29sdGlwOiB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2J9IDxiciAvPiB7Y30gKHtkfSUpXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgICAgICAgb3JpZW50OiAndmVydGljYWwnLFxyXG4gICAgICAgICAgICAgICAgeDogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgICAgeTogJzUlJyxcclxuICAgICAgICAgICAgICAgIGl0ZW1HYXA6IDIwLFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRNb2RlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge2NvbG9yOiAnI2U3ZTdlNycsIGZvbnRTaXplOiAxNH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydsZWdlbmREYXRhJ11cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiBbMCwgJzM1JSddLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXI6IFsnNTUlJywgJzQ1JSddLFxyXG4gICAgICAgICAgICAgICAgICBsYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdpbm5lcidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3Nlcmllc0RhdGExJ11cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFsnNTAlJywgJzcwJSddLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXI6IFsnNTUlJywgJzQ1JSddLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydzZXJpZXNEYXRhMiddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlY2hhcnRfdXNlcnR5cGUgJiYgZWNoYXJ0X3VzZXJ0eXBlLnNldE9wdGlvbihvcHRpb25fdXNlcnR5cGUpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF91c2VydHlwZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAncGxhdGZvcm1fdHJlbmQnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fcGxhdGZvcm1fdHJlbmQgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnIzAwYmVmZiddLFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5MmFjY2YnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGRhdGE6IFsn5L2/55So5bmz5Y+w55So5oi35pWwJ10sXHJcbiAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyNhMWJjZTknLFxyXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgICAgICAgIHRvcDogJzEzJScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMSUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcxJScsXHJcbiAgICAgICAgICAgICAgICBib3R0b206ICczJScsXHJcbiAgICAgICAgICAgICAgICBjb250YWluTGFiZWw6IHRydWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHhBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjYXRlZ29yeScsXHJcbiAgICAgICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsaWduV2l0aExhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMYWJlbDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzTGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YVsneEF4aXNEYXRhJ11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHlBeGlzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXHJcbiAgICAgICAgICAgICAgICAgIHNwbGl0TGluZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjM2U0MzcwJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHNlcmllczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogWyfkvb/nlKjlubPlj7DnlKjmiLfmlbAnXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5lJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFbJ3Nlcmllc0RhdGEnXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZWNoYXJ0X3BsYXRmb3JtX3RyZW5kLnNldE9wdGlvbihvcHRpb25fcGxhdGZvcm1fdHJlbmQpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9wbGF0Zm9ybV90cmVuZCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2FzZSAncmVzb3VyY2VfdG90YWwnOiB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25fcmVzb3VyY2VfdG90YWwgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnI2Q3NDIzZCcsICcjNTNiYjc3JywgJyNmMTlkMzInLCAnIzE0YzdlMCcsICcjY2Y1MzlmJywgJyMzZjg2ZWEnXSxcclxuICAgICAgICAgICAgICB0aXRsZToge30sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcIntifSA8YnIvPiB7ZH0lXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNhbGN1bGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICflnIblv4MnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiBbMCwgMjVdLFxyXG4gICAgICAgICAgICAgICAgICBzaWxlbnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGFiZWxMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2ZmZidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbMTAwXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogJ+i1hOa6kOaAu+mHjycsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxyXG4gICAgICAgICAgICAgICAgICByYWRpdXM6IFsyNSwgMTIwXSxcclxuICAgICAgICAgICAgICAgICAgcm9zZVR5cGU6ICdhcmVhJyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogW11cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG9wdGlvbl9yZXNvdXJjZV90b3RhbC5zZXJpZXNbMV0uZGF0YSA9IGRhdGEudHlwZTtcclxuICAgICAgICAgICAgZWNoYXJ0X3Jlc291cmNlX3RvdGFsICYmIGVjaGFydF9yZXNvdXJjZV90b3RhbC5zZXRPcHRpb24ob3B0aW9uX3Jlc291cmNlX3RvdGFsKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfcmVzb3VyY2VfdG90YWwpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3VzZXJ0eXBlX3NjaG9vbCc6IHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbl91c2VydHlwZV9zY2hvb2wgPSB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnI2ZmM2Y2NicsICcjZmZiYTI2JywgJyM1M2JiNzcnLCAnIzNmODZlYScsICcjYjY1M2QxJ10sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifSA6IHtjfSAoe2R9JSlcIlxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICfnlKjmiLfnsbvlnosnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAncGllJyxcclxuICAgICAgICAgICAgICAgICAgcmFkaXVzOiBbJzAlJywgJzYwJSddLFxyXG4gICAgICAgICAgICAgICAgICBjZW50ZXI6IFsnNTAlJywgJzQwJSddLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhWydzZXJpZXNEYXRhMiddXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZWNoYXJ0X3VzZXJ0eXBlX3NjaG9vbCAmJiBlY2hhcnRfdXNlcnR5cGVfc2Nob29sLnNldE9wdGlvbihvcHRpb25fdXNlcnR5cGVfc2Nob29sKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfcGxhdGZvcm1fdHJlbmQpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhc2UgJ3VzZXJ1c2Vfc2Nob29sJzoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uX3VzZXJ1c2Vfc2Nob29sID0ge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBbJyMyOGM5ODMnXSxcclxuICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzkyYWNjZicsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHRvb2x0aXA6IHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcclxuICAgICAgICAgICAgICAgIGF4aXNQb2ludGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaGFkb3cnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICc1JScsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgcmlnaHQ6ICcxMCUnLFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnMyUnLFxyXG4gICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICB4QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxyXG4gICAgICAgICAgICAgICAgICBzcGxpdExpbmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzNlNDM3MCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICB5QXhpczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2F0ZWdvcnknLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzZTQzNzAnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBheGlzVGljazoge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsaWduV2l0aExhYmVsOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgICAgICBub3JtYWw6IHtcclxuICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzI5Yzk4MydcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICfkvb/nlKjmrKHmlbAnLFxyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcclxuICAgICAgICAgICAgICAgICAgYmFyV2lkdGg6IDIwLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBbXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgb3B0aW9uX3VzZXJ1c2Vfc2Nob29sLnlBeGlzWzBdLmRhdGFbaV0gPSBkYXRhW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgb3B0aW9uX3VzZXJ1c2Vfc2Nob29sLnNlcmllc1swXS5kYXRhW2ldID0gZGF0YVtpXS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlY2hhcnRfdXNlcnVzZV9zY2hvb2wgJiYgZWNoYXJ0X3VzZXJ1c2Vfc2Nob29sLnNldE9wdGlvbihvcHRpb25fdXNlcnVzZV9zY2hvb2wpO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF91c2VydXNlX3NjaG9vbCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uID0ge1xyXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJycsXHJcbiAgICAgICAgICAgICAgY29sb3I6IFsnIzQ4NzNkYycsICcjM2U1Mjg0J10sXHJcbiAgICAgICAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICAgICAgc2hvdzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXI6IFwie2F9IDxici8+e2J9OiB7Y30gKHtkfSUpXCJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIHNlcmllczogW2dldFNlcmllc0RhdGEoZGF0YS5wZXJzb25bJ21vbnRoVml0YWxpdHknXSldXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIOS4quS6uuepuumXtFxyXG4gICAgICAgICAgICBlY2hhcnRfcHZpdGFsaXR5LnNldE9wdGlvbihvcHRpb24pO1xyXG4gICAgICAgICAgICBjb21tb24uZWNoYXJ0LmhpZGVMb2FkaW5nKGVjaGFydF9wdml0YWxpdHkpO1xyXG4gICAgICAgICAgICAvLyDnvqTnu4Tnqbrpl7RcclxuICAgICAgICAgICAgb3B0aW9uLnNlcmllcyA9IGdldFNlcmllc0RhdGEoZGF0YS5ncm91cFsnbW9udGhWaXRhbGl0eSddKTtcclxuICAgICAgICAgICAgZWNoYXJ0X2d2aXRhbGl0eS5zZXRPcHRpb24ob3B0aW9uKTtcclxuICAgICAgICAgICAgY29tbW9uLmVjaGFydC5oaWRlTG9hZGluZyhlY2hhcnRfZ3ZpdGFsaXR5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG59KSJdfQ==
