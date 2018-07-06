require.config({
  baseUrl: '../',
  paths: {
    'customConf': 'statistics/js/customConf.js'
  }
});
require(['customConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'service', 'common', 'select', 'page'],
    function ($, service, common, select, Page) {
      $('body').on('tabChange', '.tab', function () {
        $('.schoolTeachingDetail' + $(this).attr('data-value')).show().siblings().hide();
        if ($('.tab').attr('data-value') == '1') {
          teachingResearch($('#schoolTeaching').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
            $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
            $('#schoolYear .selectTop').attr('data-value'));
        } else if ($('.tab').attr('data-value') == '2') {
          schoolList($('#schoolTeaching').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
            $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
            $('#schoolYear .selectTop').attr('data-value'));
        }
      });

      //切换不是当前学年的时候，不可查看最近七天，最近三十天
      $('body').on('click', '#schoolYear li', function () {
        if ($(this).index() != 0) {
          $('#schoolTeaching').next().find('li').hide().eq(0).show();
          $('#schoolTeaching span').text('全学年');
        } else {
          $('#schoolTeaching').next().find('li').show();
        }
      });

      /**
       * @description       教师教研情况一览
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param subjectId   学科id
       * @param gradeId   年级id
       * @param schoolYear  学年
       */
      var currentPage = 1;

      function teachingResearch(time, phaseId, subjectId, gradeId, schoolYear, currentPage, isPaging) {
        currentPage = currentPage || 1;
        var url = "";
        if (common.role == 'city') {
          url = '/jy/open?path=/api/statistic/area/city_orgdata_t_area?areaId=' + common.areaid;
        } else if (common.role == 'school') {
          url = '/jy/open?path=/api/statistic/org/sch_jy_teacher_list?orgId=' + common.orgid;
        } else if (common.role == 'county') {
          url = '/jy/open?path=/api/statistic/area/area_orgdata_t_org?areaId=' + common.areaid;
        }
        $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&pageSize=10' + '&currentPage=' + currentPage)
          .success(function (result) {
            if (result['code'] == 1) {
              var html1 = "", html2 = "", html3 = "";
              $.each(result.data.datalist, function (index, item) {
                if (index % 2 == 0) {
                  trColor = "odd";
                }
                else {
                  trColor = "even";
                }
                if (common.role == 'city') {
                  html1 += "<tr class='" + trColor + "'><td>" + item.areaName + "</td><td>" + item.teacherCount +
                    "</td><td>" + (item.jiaoan_write + item.kejian_write + item.fansi_write + item.listen_write +
                      item.plansummary_write + item.thesis_write + item.activity_join + item.xjjy_org_join +
                      item.record_res ) + "</td><td>" + item.jiaoan_write +
                    "</td><td>" + item.kejian_write + "</td><td>" + item.fansi_write + "</td><td>" + item.listen_write +
                    "</td><td>" + item.plansummary_write + "</td><td>" + item.thesis_write + "</td><td>" +
                    item.activity_join + "</td><td>" + item.xjjy_org_join + "</td><td>" + item.record_res + "</td></tr>";
                } else if (common.role == 'school') {
                  html2 += "<tr class='" + trColor + "'><td>" + item.userName + "</td><td>" +
                    (item.jiaoan_write + item.kejian_write + item.fansi_write + item.listen_write +
                      item.plansummary_write + item.thesis_write + item.activity_join + item.xjjy_org_join +
                      item.record_res) + "</td><td>" + item.jiaoan_write +
                    "</td><td>" + item.kejian_write + "</td><td>" + item.fansi_write + "</td><td>" + item.listen_write +
                    "</td><td>" + item.plansummary_write + "</td><td>" + item.thesis_write + "</td><td>" +
                    item.activity_join + "</td><td>" + item.xjjy_org_join + "</td><td>" + item.record_res + "</td></tr>";
                } else if (common.role == 'county') {
                  html3 += "<tr class='" + trColor + "'><td>" + item.orgName + "</td><td>" + item.teacherCount + "</td><td>" +
                    (item.jiaoan_write + item.kejian_write + item.fansi_write + item.listen_write +
                      item.plansummary_write + item.thesis_write + item.activity_join + item.xjjy_org_join + item.record_res) +
                    "</td><td>" + item.jiaoan_write + "</td><td>" + item.kejian_write + "</td><td>" + item.fansi_write +
                    "</td><td>" + item.listen_write + "</td><td>" + item.plansummary_write + "</td><td>" +
                    item.thesis_write + "</td><td>" + item.activity_join + "</td><td>" + item.xjjy_org_join +
                    "</td><td>" + item.record_res + "</td></tr>";
                }
              });
              $('#schoolTeachingDetail1 tbody').html(html1);
              $('#schoolTeachingDetail3 tbody').html(html2);
              $('#schoolTeachingDetail5 tbody').html(html3);
              if (!isPaging) {
                $('#pageTool1').html('');
              }
              if (result['data']['totalPages'] > 1 && !isPaging)
                renderPage('pageTool1', result['data']['totalCount']);
            }
            if ($('.activityFqTable table tbody tr').length == 0) {
              $('.activityFqTable  table tbody').empty().append('<div id="empty_info"><div><p>没有相关内容</p></div></div>');
            }
          });
      }

      function renderPage(domId, total) {
        var p = new Page();
        p.init({
          target: '#' + domId, pagesize: 10, pageCount: 8,
          count: total, callback: function (current) {
            if ($('.tab').attr('data-value') == '1') {
              teachingResearch($('#schoolTeaching').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
                $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
                $('#schoolYear .selectTop').attr('data-value'), current, true);
            } else if ($('.tab').attr('data-value') == '2') {
              schoolList($('#schoolTeaching').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
                $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
                $('#schoolYear .selectTop').attr('data-value'), current, true);
            }
          }
        });
      }

      $('body').on('selectChange', '#schoolTeaching', function () {
        teachingResearch($('#schoolTeaching').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
      });

      /**
       * @description       管理情况一览
       * @param areaId      市id
       * @param time        时间段(yesterday:昨天，lastseven：最近七天，lastthirty：最近三十天)
       * @param phaseId     学段id
       * @param subjectId   学科id
       * @param gradeId     年级id
       * @param schoolYear  学年
       */

      function schoolList(time, phaseId, subjectId, gradeId, schoolYear, currentPage, isPaging) {
        currentPage = currentPage || 1;
        var url = "";
        if (common.role == 'city') {
          url = '/jy/open?path=/api/statistic/area/city_orgdata_m_area?areaId=' + common.areaid;
        } else if (common.role == 'school') {
          url = '/jy/open?path=/api/statistic/org/sch_jy_manager_list?orgId=' + common.orgid;
        } else if (common.role == 'county') {
          url = '/jy/open?path=/api/statistic/area/area_orgdata_m_org?areaId=' + common.areaid;
        }
        $.getJSON(service.prefix + url + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' + subjectId +
          '&gradeId=' + gradeId + '&schoolYear=' + schoolYear + '&pageSize=10' + '&currentPage=' + currentPage)
          .success(function (result) {
            if (result['code'] == 1) {
              var html1 = "", html2 = "", html3 = "";
              $.each(result.data.datalist, function (index, item) {
                if (index % 2 == 0) {
                  trColor = "odd";
                }
                else {
                  trColor = "even";
                }
                if (common.role == 'city') {
                  html1 += "<tr class='" + trColor + "'><td>" + item.areaName + "</td><td>" + item.managerCount +
                    "</td><td>" + (item.jiaoan_scan + item.kejian_scan + item.fansi_scan + item.listen_scan +
                      item.plansummary_scan + item.thesis_scan + item.activity_issue + item.activity_scan +
                      item.xjjy_org_issue) + "</td><td>" + item.jiaoan_scan + "</td><td>" + item.kejian_scan +
                    "</td><td>" + item.fansi_scan + "</td><td>" + item.listen_scan + "</td><td>" + item.plansummary_scan +
                    "</td><td>" + item.thesis_scan + "</td><td><span>" + item.activity_issue + '/' + "</span><span>" +
                    item.activity_scan + "</td><td><span>" + item.schoolactivity_circle + '/' + "</span><span>" +
                    item.xjjy_org_issue + "</span></td></tr>";
                } else if (common.role == 'school') {
                  html2 += "<tr class='" + trColor + "'><td>" + item.userName + "</td><td>" +
                    (item.jiaoan_scan + item.kejian_scan + item.fansi_scan + item.listen_scan +
                      item.plansummary_scan + item.thesis_scan + item.activity_issue + item.activity_scan +
                      item.xjjy_org_issue) + "</td><td>" + item.jiaoan_scan + "</td><td>" + item.kejian_scan +
                    "</td><td>" + item.fansi_scan + "</td><td>" + item.listen_scan + "</td><td>" + item.plansummary_scan +
                    "</td><td>" + item.thesis_scan + "</td><td><span>" + item.activity_issue + '/' + "</span><span>" +
                    item.activity_scan + "</td><td><span>" + item.xjjy_org_issue + "</span></td></tr>";
                } else if (common.role == 'county') {
                  html3 += "<tr class='" + trColor + "'><td>" + item.orgName + "</td><td>" + item.managerCount + "</td><td>" +
                    (item.jiaoan_scan + item.kejian_scan + item.fansi_scan + item.listen_scan +
                      item.plansummary_scan + item.thesis_scan + item.activity_issue + item.activity_scan +
                      item.xjjy_org_issue) + "</td><td>" + item.jiaoan_scan + "</td><td>" + item.kejian_scan +
                    "</td><td>" + item.fansi_scan + "</td><td>" + item.listen_scan + "</td><td>" + item.plansummary_scan +
                    "</td><td>" + item.thesis_scan + "</td><td><span>" + item.activity_issue + '/' + "</span><span>" +
                    item.activity_scan + "</td><td><span>" + item.schoolactivity_circle + '/' + "</span><span>" +
                    item.xjjy_org_issue + "</span></td></tr>";
                }
              });
              $('#schoolTeachingDetail2 tbody').html(html1);
              $('#schoolTeachingDetail4 tbody').html(html2);
              $('#schoolTeachingDetail6 tbody').html(html3);
              if (!isPaging) {
                $('#pageTool1').html('');
              }
              if (result['data']['totalPages'] > 1 && !isPaging)
                renderPage('pageTool1', result['data']['totalCount']);
            }
            if ($('.activityFqTable table tbody tr').length == 0) {
              $('.activityFqTable  table tbody').empty().append('<div id="empty_info"><div><p>没有相关内容</p></div></div>');
            }
          });
      }

      /*function renderPage1(domId, total) {
        var p = new Page();
        p.init({
          target: '#' + domId, pagesize: 10, pageCount: 8,
          count: total, callback: function (current) {
            schoolList($('#schoolTeaching').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
              $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
              $('#schoolYear .selectTop').attr('data-value'), current, true);

          }
        });
      }*/

      $('body').on('click', '#searchBtn', function () {
        teachingResearch($('#schoolTeaching').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
        schoolList($('#schoolTeaching').attr('data-value'), $('#studySection .selectTop').attr('data-value'),
          $('#subject .selectTop').attr('data-value'), $('#grade .selectTop').attr('data-value'),
          $('#schoolYear .selectTop').attr('data-value'));
      });
      $('#searchBtn').trigger('click');

    });
})