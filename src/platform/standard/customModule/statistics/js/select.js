define(['jquery', 'service', 'common'], function ($, service, common) {
  /**
   * 数据导出
   * @param type  string  person:用户; app:应用;space:空间;resource:资源;jy:教研
   * @param scope  获取用户时：area:导出区域数据(市级管理员);school:导出学校数据(区县管理员);person:导出用户数据(学校管理员)
   *              获取空间时:all:全部空间;person:个人空间 group:群组空间
   *              获取资源时：area:导出区域数据;school:导出学校数据
   *              获取教研时: (area/school/person)_(activity/research)_(为活动时:"start/join;为教研情况时：mamager/teacher)
   * @param time 时间(格式 yyyy-mm-dd)
   */
  var role_b = common.role;
  var convertRole = {'city': 'edu', 'county': 'area', 'school': 'school'};
  var role = convertRole[role_b];

  function exportData(type, scope, time, phaseId, subjectId, gradeId, schoolYear) {
    if (common.role == 'school') {
      var extra = '?orgId=' + common.orgid + '&type=' + type + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' +
        subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear;
    } else {
      var extra = '?areaId=' + common.areaid + '&type=' + type + '&time=' + time + '&phaseId=' + phaseId + '&subjectId=' +
        subjectId + '&gradeId=' + gradeId + '&schoolYear=' + schoolYear;
    }
    if (scope) extra += '&scope=' + scope
    location.href = service.prefix + '/export' + extra;

  }

  $('body').on('click', '.wrapTableTopExport', function () {
    var type = $(this).parents('body').attr('data-module');
    var style = $(this).parents('body').attr('data-table');
    var tableList = $(this).parents('body').attr('data-tableList');
    var tableList_school = $(this).parents('body').attr('data-tableList-school');
    var scope = '';
    if (type === 'jy') {
      if (style === 'activity') {
        switch (role_b) {
          case 'city':
            scope = 'area' + tableList;
            break;
          case 'county':
            scope = 'school' + tableList;
            break;
          case 'school':
            scope = 'person' + tableList_school;
            break;
          default:
            scope = 'area' + tableList;
        }
      } else if (style === 'research') {
        var currentTab = $('.tab').attr('data-value');
        if (currentTab == 1) {
          switch (role_b) {
            case 'city':
              scope = 'area_research_teacher';
              break;
            case 'county':
              scope = 'school_research_teacher';
              break;
            case 'school':
              scope = 'person_research_teacher';
              break;
            default:
              scope = 'area_research_teacher';
          }
        } else if (currentTab == 2) {
          switch (role_b) {
            case 'city':
              scope = 'area_research_mamager';
              break;
            case 'county':
              scope = 'school_research_mamager';
              break;
            case 'school':
              scope = 'person_research_mamager';
              break;
            default:
              scope = 'area_research_mamager';
          }
        }
      }
    }
    var time = $(this).parents('.wrapTableTop').find('.row .selectTop').attr("data-value");
    var studySection = $('#studySection .selectTop').attr('data-value');
    var subject = $('#subject .selectTop').attr('data-value');
    var grade = $('#grade .selectTop').attr('data-value');
    var schoolYear = $('#schoolYear .selectTop').attr('data-value');
    exportData(type, scope, time, studySection, subject, grade, schoolYear);
  });

  // 判断当前用户是否有权限查看区域 学校统计
  function useRole() {
    var url = service.prefix + '/jy/config';
    $.ajax({
      url: url,
      type: "get",
      dataType: 'json',
      success: function (result) {
        if (result['code'] == 200) {
          if (result.data.schoolJy == true) {
            $('.schooltotal').show();
          } else {
            $('.schooltotal').hide();
          }
          if (result.data.areaJy == true) {
            $('.areatotal').show();
          } else {
            $('.areatotal').hide();
          }
        }
      }
    });
  }

  useRole();

  // 获取 学年  学段   学科   年级
  function schoolYear() {
    var url = service.prefix + '/jy/open?path=/api/statistic/org/sch_schoolYear_list';
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function (result) {
        if (result['code'] == 1) {
          var html = '';
          $.each(result['data'], function (index) {
            html += '<li data-value="' + result['data'][index] + '">' + (result['data'][index]) + '-' +
              (result['data'][index] + 1) + '学年' + '</li>';
          });
          $('#schoolYear .selectBottom ol').html(html);
          $('#schoolYear .selectTop span').html($('#schoolYear .selectBottom ol li').eq(0).text());
          $('#schoolYear .selectTop').attr('data-value', $('#schoolYear .selectBottom ol li').eq(0).attr('data-value'));
        }
      }
    });
  }

  function StudySection() {
    var url = "";
    if (common.role == 'school') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_phase_list?orgId=' + common.orgid;
    } else {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_phase_list';
    }
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function (result) {
        if (result['code'] == 1) {
          var html = '';
          $.each(result['data'], function (index) {
            html += '<li data-value="' + result['data'][index].id + '">' + result['data'][index].name + '</li>';
          });
          $('#studySection .selectBottom ol').html(html);
          $('#studySection .selectTop span').html($('#studySection .selectBottom ol li').eq(0).text());
          $('#studySection .selectTop').attr('data-value', $('#studySection .selectBottom ol li').eq(0).attr('data-value'));
        }
      }
    });
  }

  function subject(phaseId) {
    var url = "";
    if (common.role == 'city') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId;
    } else if (common.role == 'county') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId + '&areaId=' + common.areaid;
    } else if (common.role == 'school') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId + '&orgId=' + common.orgid;
    }
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function (result) {
        var html = '';
        if (result['code'] == 1) {
          if (result['data'] && result['data'].length > 0) {
            $.each(result['data'], function (index) {
              html += '<li data-value="' + result['data'][index].id + '">' + result['data'][index].name + '</li>';
            });
            $('#subject .selectBottom ol li').hide().eq(0).show();
            $('#subject .selectBottom ol').append(html);
            $('#subject .selectTop span').html($('#subject .selectBottom ol li').eq(0).text());
            $('#subject .selectTop').attr('data-value', $('#subject .selectBottom ol li').eq(0).attr('data-value'));
          }
        }
      }
    });
  }

  function grade(phaseId) {
    var url = service.prefix + '/jy/open?path=/api/statistic/org/sch_grade_list?phaseId=' + phaseId;
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function (result) {
        var html = '';
        if (result['code'] == 1) {
          if (result['data'] && result['data'].length > 0) {
            $.each(result['data'], function (index) {
              html += '<li data-value="' + result['data'][index].id + '">' + result['data'][index].name + '</li>';
            });
            $('#grade .selectBottom ol li').hide().eq(0).show();
            $('#grade .selectBottom ol').append(html);
            $('#grade .selectTop span').html($('#grade .selectBottom ol li').eq(0).text());
            $('#grade .selectTop').attr('data-value', $('#grade .selectBottom ol li').eq(0).attr('data-value'));
          }
        }
      }
    });
  }

  schoolYear();
  $.when(StudySection()).done(
    function () {
      subject($('#studySection .selectTop').attr('data-value'));
      grade($('#studySection .selectTop').attr('data-value'));
    }
  );

  $('body').on('selectChange', '#studySection .selectTop', function () {
    subject($('#studySection .selectTop').attr('data-value'));
    grade($('#studySection .selectTop').attr('data-value'));
  });
});