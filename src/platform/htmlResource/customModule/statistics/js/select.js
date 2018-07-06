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

    $('.schooltotal').show();
    //$('.schooltotal').hide();
    $('.areatotal').show();
    //$('.areatotal').hide();
    /*var url = service.prefix + '/jy/config';
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
    });*/
  }

  useRole();

  // 获取 学年  学段   学科   年级
  function schoolYear() {
    var result = {
      "code":1,
      "data":[
        2017,
        2016,
        2015
      ]
    };
    var url = service.prefix + '/jy/open?path=/api/statistic/org/sch_schoolYear_list';
    /*$.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function (result) {*/
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
    /*}
    });*/
  }

  function StudySection() {
    var url = "";
    var result = null;
    if (common.role == 'school') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_phase_list?orgId=' + common.orgid;
    } else {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_phase_list';
      result = {
        "code":1,
        "data":[
          {
            "dicStatus":"active",
            "childCount":7,
            "type":"sys",
            "operator":"sysAdmin",
            "parentId":139,
            "standardCode":"2",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"139_140",
            "name":"小学",
            "id":140,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":1
          },
          {
            "dicStatus":"active",
            "childCount":4,
            "type":"sys",
            "operator":"sysAdmin",
            "parentId":139,
            "standardCode":"3",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"139_141",
            "name":"初中",
            "id":141,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":2
          },
          {
            "dicStatus":"active",
            "childCount":77,
            "type":"sys",
            "operator":"sysAdmin",
            "parentId":139,
            "standardCode":"4",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"139_142",
            "name":"高中",
            "id":142,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":4
          },
          {
            "dicStatus":"active",
            "childCount":4,
            "type":"sys",
            "operator":"A20130520000003",
            "parentId":139,
            "standardCode":"1",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"139_1020",
            "name":"幼儿",
            "id":1020,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":5
          },
          {
            "dicStatus":"active",
            "childCount":2,
            "type":"sys",
            "operator":"A20130520000003",
            "parentId":139,
            "standardCode":"6",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"139_1102",
            "name":"职教",
            "id":1102,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":7
          }
        ]
      };
    }
    /*$.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function (result) {*/
        if (result['code'] == 1) {
          var html = '';
          $.each(result['data'], function (index) {
            html += '<li data-value="' + result['data'][index].id + '">' + result['data'][index].name + '</li>';
          });
          $('#studySection .selectBottom ol').html(html);
          $('#studySection .selectTop span').html($('#studySection .selectBottom ol li').eq(0).text());
          $('#studySection .selectTop').attr('data-value', $('#studySection .selectBottom ol li').eq(0).attr('data-value'));
        }
      /*}
    });*/
  }

  function subject(phaseId) {
    var url = "";
    var result = null;
    if (common.role == 'city') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId;
    } else if (common.role == 'county') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId + '&areaId=' + common.areaid;
      result = {
        "code":1,
        "data":[
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"uclassroot",
            "parentId":97,
            "standardCode":"13",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_100",
            "name":"语文",
            "id":100,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":1
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"uclassroot",
            "parentId":97,
            "standardCode":"14",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"98_103",
            "name":"数学",
            "id":103,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":2
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"gsj1",
            "parentId":97,
            "standardCode":"41",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"98_104",
            "name":"英语",
            "id":104,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":8
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"A20130520000003",
            "parentId":97,
            "standardCode":"94",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_1029",
            "name":"诵读",
            "id":1029,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":59
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"lcm",
            "parentId":97,
            "standardCode":"60",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_1903",
            "name":"综合实践",
            "id":1903,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":63
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"A20130520000003",
            "parentId":97,
            "standardCode":"23",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"0",
            "name":"艺术",
            "id":933,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":54
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"sysAdmin",
            "parentId":97,
            "standardCode":"11",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_168",
            "name":"品德与社会",
            "id":168,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":43
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"sysAdmin",
            "parentId":97,
            "standardCode":"11",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_169",
            "name":"品德与生活",
            "id":169,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":44
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"uclassroot",
            "parentId":97,
            "standardCode":"26",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_170",
            "name":"信息技术",
            "id":170,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":33
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"uclassroot",
            "parentId":97,
            "standardCode":"15",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_171",
            "name":"科学",
            "id":171,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":27
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"uclassroot",
            "parentId":97,
            "standardCode":"24",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_172",
            "name":"音乐",
            "id":172,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":28
          },
          {
            "dicStatus":"active",
            "childCount":0,
            "type":"sys",
            "operator":"uclassroot",
            "parentId":97,
            "standardCode":"25",
            "dicLevel":2,
            "enable":1,
            "cascadeDicIds":"97_173",
            "name":"美术",
            "id":173,
            "page":{
              "pageSize":10,
              "currentPage":1,
              "totalCount":0
            },
            "dicOrderby":39
          }
        ]
      };
    } else if (common.role == 'school') {
      url = service.prefix + '/jy/open?path=/api/statistic/org/sch_subject_list?phaseId=' + phaseId + '&orgId=' + common.orgid;
    }
   /* $.ajax({
     url: url,
     async: false,
     type: "get",
     dataType: 'json',
     success: function (result) {*/
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
     /* }
    });*/
  }

  function grade(phaseId) {
    var result = {
      "code":1,
      "data":[
        {
          "dicStatus":"active",
          "childCount":0,
          "type":"sys",
          "operator":"uclassroot",
          "parentId":140,
          "standardCode":"021",
          "dicLevel":3,
          "enable":1,
          "cascadeDicIds":"139_140_102",
          "name":"一年级",
          "id":102,
          "page":{
            "pageSize":10,
            "currentPage":1,
            "totalCount":0
          },
          "dicOrderby":1
        },
        {
          "dicStatus":"active",
          "childCount":0,
          "type":"sys",
          "operator":"uclassroot",
          "parentId":140,
          "standardCode":"022",
          "dicLevel":3,
          "enable":1,
          "cascadeDicIds":"139_140_113",
          "name":"二年级",
          "id":113,
          "page":{
            "pageSize":10,
            "currentPage":1,
            "totalCount":0
          },
          "dicOrderby":2
        },
        {
          "dicStatus":"active",
          "childCount":0,
          "type":"sys",
          "operator":"uclassroot",
          "parentId":140,
          "standardCode":"023",
          "dicLevel":3,
          "enable":1,
          "cascadeDicIds":"139_140_114",
          "name":"三年级",
          "id":114,
          "page":{
            "pageSize":10,
            "currentPage":1,
            "totalCount":0
          },
          "dicOrderby":3
        },
        {
          "dicStatus":"active",
          "childCount":0,
          "type":"sys",
          "operator":"uclassroot",
          "parentId":140,
          "standardCode":"025",
          "dicLevel":3,
          "enable":1,
          "cascadeDicIds":"139_140_115",
          "name":"四年级",
          "id":115,
          "page":{
            "pageSize":10,
            "currentPage":1,
            "totalCount":0
          },
          "dicOrderby":4
        },
        {
          "dicStatus":"active",
          "childCount":0,
          "type":"sys",
          "operator":"uclassroot",
          "parentId":140,
          "standardCode":"027",
          "dicLevel":3,
          "enable":1,
          "cascadeDicIds":"139_140_160",
          "name":"五年级",
          "id":160,
          "page":{
            "pageSize":10,
            "currentPage":1,
            "totalCount":0
          },
          "dicOrderby":5
        },
        {
          "dicStatus":"active",
          "childCount":0,
          "type":"sys",
          "operator":"uclassroot",
          "parentId":140,
          "standardCode":"029",
          "dicLevel":3,
          "enable":1,
          "cascadeDicIds":"139_140_161",
          "name":"六年级",
          "id":161,
          "page":{
            "pageSize":10,
            "currentPage":1,
            "totalCount":0
          },
          "dicOrderby":6
        }
      ]
    };
    /*var url = service.prefix + '/jy/open?path=/api/statistic/org/sch_grade_list?phaseId=' + phaseId;
    $.ajax({
      url: url,
      async: false,
      type: "get",
      dataType: 'json',
      success: function (result) {*/
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
      /*}
    });*/
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