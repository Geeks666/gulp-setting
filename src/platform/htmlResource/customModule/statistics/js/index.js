require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  define('',['jquery', 'service', 'common', 'paging','dataResource/indexData.js'],
    function ($, service, common, Paging , indexData) {

      if( window.location.href.indexOf("index_100.html") > -1 || window.location.href.indexOf("index_300.html") > -1 ){
        window.location.href = 'index_200.html';
      }

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

      $("#mapNum1").text( indexData.areaData.student );
      $("#mapNum2").text( indexData.areaData.teacher );
      $("#mapNum3").text( indexData.areaData.school );
      $("#mapNum4").text( indexData.areaData.personal );
      $("#mapNum5").text( indexData.areaData.group );
      $("#mapNum6").text( indexData.areaData.resourceTotal );
      $("#mapNum7").text( indexData.areaData.schoolTotal );


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
      //$.getJSON(service.prefix + '/platform/count', function (result) {
        var result = indexData.platformCountData;
        for (var key in result.data) {
          if ((result.data[key] + '').indexOf('+') >= 0) {
            $('#' + key).addClass('add');
          } else if ((result.data[key] + '').indexOf('-') >= 0) {
            $('#' + key).addClass('minus');
          }
          $('#' + key).html(result.data[key]);
        }
      //});

      // 平台使用用户统计 用户类型分布
      var userType = {};

      function platformUserStatistics() {
        var result = indexData.platformUsertypeData;
        //$.getJSON(service.prefix + '/platform/usertype?errorDomID=' + usertype)
        //  .success(function (result) {
            if (result['code'] == 200) {
              userType = result['data']['userrole'];
              render(convertPieData(result.data.userrole), 'usertype');
              render(convertPieData(result.data.userrole), 'usertype_school');
              if (role === 'school') {
                var per = 0;
                if (result['data']['person'] == 0) per = 0;
                else per = Math.round(result['data']['used'] * 100 / result['data']['person']);
                if (per > 100) per = 100;
                $('#mainbo_echart_school').css('width', per + '%').find('.mainbo-label').html(per + '%');
              }
            }
        //  });
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
        delete  usertypeObj.userrole.edumanager;
        delete  usertypeObj.userrole.eduemploye;
      }

      function convertPieData(data) {
        var legendData = [], seriesData1 = [], seriesData2 = [], total_school = 0;
        $.each(data, function (key, value) {
          if (usertypeObj['userrole'][key]) {
            legendData.push(usertypeObj['userrole'][key]);
            seriesData2.push({name: usertypeObj['userrole'][key], value: value});
            if (key != 'edumanager' && key != 'eduemploye') total_school += value;
          }
        });
        if (role !== 'school') {
          legendData.unshift(usertypeObj['edu'], usertypeObj['school']);
          seriesData1.push({name: usertypeObj['edu'], value: data['eduemploye']});
          seriesData1.push({name: usertypeObj['school'], value: total_school});
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
        var result = indexData.platformAreaRanking;
        pageNo = pageNo || 1;
        //var url = service.prefix + '/platform/' + type + '/ranking?pageNo=' + pageNo + '&errorDomId=' + domId;
       // $.getJSON(url, function (result) {
          var html = '';

          if (result['code'] == 200) {
            if (type == 'school') {
              $.each(result.data.dataList, function (index, value) {
                var cls = '';
                if ((index + ((pageNo - 1) * 10)) < 3) {
                  cls = 'num1';
                }
                html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>"
                  + (((pageNo - 1) * 10) + index + 1) + "</span>"
                  + "<strong class='strong' title='" + result.data.dataList[index].name + "'>" + result.data.dataList[index].name + "</strong></td>" + "<td>" +
                  result.data.dataList[index].value + "</td></tr>";
              });
              $('#' + domId).html(html);
            } else if (type == 'area') {
              $.each(result.data.dataList, function (index, value) {
                var cls = '';
                if ((index + ((pageNo - 1) * 10)) < 3) {
                  cls = 'num1';
                }
                html += "<tr><td style='padding-left:10%;text-align:left;'><span class='num " + cls + "'>"
                  + (((pageNo - 1) * 10) + index + 1) + "</span>"
                  + "<strong class='strong' title='" + result.data.dataList[index].name + "'>" + result.data.dataList[index].name + "</strong></td>" + "<td>" +
                  result.data.dataList[index].value + "</td>"
                  + "<td>" + result.data.dataList[index].ratio + "</td></tr>";
              });
              $('#' + domId).html(html);
            }
            // 为空提示
            if (result.data.dataList.length === 0) {
              $('.tableWrapIndex table').empty().append('<div id="empty_info"><div><p>没有相关内容</p></div></div>');
            }
            if (result.data.pageCount > 1 && currentPage === 1) renderPage('pageTool', result.data.totalSize, type, domId);
          }
        //});
      }

      function renderPage(pageId, total, type, domId) {
        currentPage++;
        $('#' + pageId).html('');
        var p = new Paging();
        p.init({
          target: '#' + pageId, pagesize: 10, pageCount: 1,
          count: total, callback: function (current) {
            rederTable(type, current, domId);
          }
        });
      }

      if (role === 'city') rederTable('area', '', 'rank_percent');
      else if (role === 'county') rederTable('school', '', 'rank_county');

      // 学校管理员——用户使用情况
      // 用户使用次数排名
      $('body').on('tabChange', '.tab', function () {
        userSchoolFetchData($(this).attr('data-value'), 'useruse_school');
      });
      $('.tab').trigger('tabChange');
      /*
      * 暂时没用到
      * */
      function userSchoolFetchData(role, useruse_school) {
        if( document.getElementById('useruse_school') ){
          echart_useruse_school = common.echart.init(document.getElementById('useruse_school'));
          common.echart.showLoading(echart_useruse_school);
          $.getJSON(service.prefix + '/platform/person/ranking?role=' + role + '&errorDomId=' + useruse_school
            , function (result) {
              render(result.data, 'useruse_school');
            });
        }
      }

      userSchoolFetchData('teacher', 'useruse_school');

// 平台使用趋势下拉框
      $('body').on('selectChange', '.selectTop', function () {
        trendFetchData($(this).attr('data-value'));
      });
      $('.selectTop').trigger('selectChange');


      // 平台资源统计
      function platformResstatistics() {
        var result = indexData.resourceTypeStatisticsData;
        //$.getJSON(service.prefix + '/resource/resourceTypeStatistics?errorDomId=' + resource_total)
          //.success(function (result) {
            if (result['code'] == 200) {
              $('#groupcount1').html(result.data.total);
              render(result.data, 'resource_total');
            }
          //});
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
        //var url = service.prefix + '/platform/tendency?time=' + time + '&errorDomId=' + platform_trend;
        //if (starttime && endtime) url += '&starttime=' + starttime + '&endtime=' + endtime;
        var result = indexData.platformTendencyData;
        //$.getJSON(url, function (result) {
            render(convertData(result.data), platform_trend)
         // }
        //);
      };

      function convertData(data) {
        var xAxisData = [], seriesData = [];
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
        }
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
        var json = indexData.spaceCountData;
        //var url = service.prefix + '/space/count?detail=true&errorDomId=' + person_space;
       /* $.ajax({
          type: "GET",
          dataType: "json",
          url: url,
          success: function (json) {*/
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
         /* },
          error: function (json) {

          }
        });*/
      }

      /**
       * @description 区域使用量统计（区域管理员）
       * @param detail  Boolean  是否统计详细信息（空间开通率、空间月活跃度、日均访问量），为true时统计，
       *                         详细统计后台会多出很多查询所以尽量不要进行详细信息的统计。
       */
      function regionalUsageStatistics() {
        var result = indexData.orgPersonCountData;
        /*$.getJSON(service.prefix + '/platform/org/person/count')
          .success(function (result) {*/
            if (result['code'] == 200) {
              $('#c_bureauOfEducation').html(result.data.edu);
              $('#c_school').html(result.data.school);
              $('#c_teacher').html(result.data.teacher);
              $('#c_student').html(result.data.student);
              $('#c_parent').html(result.data.parent);

              $('#use_c_teacher').html(result.data.used.teacher);
              $('#use_c_parent').html(result.data.used.parent);
              $('#use_c_student').html(result.data.used.student);
              var array = [], i = 0;
              for (var key in result.data.used) {
                array[i] = {name: key, value: result.data.used[key]};
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
        /*  });*/

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
              formatter: (Math.round(v1 * 100) + '%'),
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
          data: [
            {
              value: v1,
              label: {
                normal: {
                  show: true,
                  position: 'center'
                }
              }
            },
            {
              value: (1 - v1), name: 'other'
            }
          ]
        }
      }

      function render(data, category) {
        if (!data) return false;
        switch (category) {
          case 'usertype': {
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
                textStyle: {color: '#e7e7e7', fontSize: 14},
                data: data['legendData']
              },
              series: [
                {
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
                },
                {
                  type: 'pie',
                  radius: ['50%', '70%'],
                  center: ['55%', '45%'],
                  data: data['seriesData2']
                }
              ]
            };
            echart_usertype && echart_usertype.setOption(option_usertype);
            common.echart.hideLoading(echart_usertype);
            break;
          }
          case 'platform_trend': {
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
              xAxis: [
                {
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
                name: ['使用平台用户数'],
                type: 'line',
                data: data['seriesData']
              }
            };
            echart_platform_trend.setOption(option_platform_trend);
            common.echart.hideLoading(echart_platform_trend);
            break;
          }
          case 'resource_total': {
            var option_resource_total = {
              color: ['#d7423d', '#53bb77', '#f19d32', '#14c7e0', '#cf539f', '#3f86ea'],
              title: {},
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br/> {d}%"
              },
              calculable: true,
              series: [
                {
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
                },
                {
                  name: '资源总量',
                  type: 'pie',
                  radius: [25, 120],
                  roseType: 'area',
                  data: []
                }
              ]
            };
            option_resource_total.series[1].data = data.type;
            echart_resource_total && echart_resource_total.setOption(option_resource_total);
            common.echart.hideLoading(echart_resource_total);
            break;
          }
          case 'usertype_school': {
            var option_usertype_school = {
              color: ['#ff3f66', '#ffba26', '#53bb77', '#3f86ea', '#b653d1'],
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: [
                {
                  name: '用户类型',
                  type: 'pie',
                  radius: ['0%', '60%'],
                  center: ['50%', '40%'],
                  data: data['seriesData2']
                }
              ]
            };

            echart_usertype_school && echart_usertype_school.setOption(option_usertype_school);
            common.echart.hideLoading(echart_platform_trend);
            break;
          }
          case 'useruse_school': {
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
                  name: '使用次数',
                  type: 'bar',
                  barWidth: 20,
                  data: []
                }
              ]
            };
            for (var i = 0; i < data.length; i++) {
              option_useruse_school.yAxis[0].data[i] = data[i].name;
              option_useruse_school.series[0].data[i] = data[i].value;
            }
            echart_useruse_school && echart_useruse_school.setOption(option_useruse_school);
            common.echart.hideLoading(echart_useruse_school);
            break;
          }
          default: {
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
})