'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  },
  enforeDefine: true
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  require(['jquery', 'tools', 'header', 'footer', 'service', 'webuploader', 'layer', 'template'], function ($, tools, header, footer, service, WebUploader, layer, template) {
    function getPicPath(id) {
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'] : service.prefix + service.path_url['download_url'].replace('#resid#', id);
      ;
    }

    $(function () {
      var uploadUrl = service.path_url['upload_url'].substring(0, 4) === 'http' ? service.path_url['upload_url'] : service.htmlHost + service.path_url['upload_url'];
      var uploader = WebUploader.create({
        // swf文件路径
        swf: '../../../../lib/component/upload/image-js/Uploader-8e6362e0d8.swf',
        accept: {
          title: 'Images',
          extensions: 'jpg,jpeg,png',
          mimeTypes: 'image/jpg, image/jpeg, image/png'
        },
        // 文件接收服务端。
        server: uploadUrl,
        //文件数量
        fileNumLimit: 50,
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
          id: '#editImg2'
        },
        fileSizeLimit: 20 * 1024 * 1024 * 1024, // 20G
        fileSingleSizeLimit: 5 * 1024 * 1024 * 1024 // 5G
      });
      //当有文件添加进来的时候
      uploader.on('fileQueued', function (file) {
        window.picUrlId = '';
        // console.log($('#rt_'+file.source.ruid));
        $('#rt_' + file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').show();
        // window.setImgEle.parent().siblings('.upLoading').show();
        uploader.upload();
      });

      uploader.on('uploadAccept', function (ob, ret) {
        if (!ret.data) {
          ret.data = ret.key;
          ret.code = 'success';
        }
        console.log(ret);
        if (ret.code == 'success') {
          window.picUrlId = ret.data;
          $('#rt_' + ob.file.source.ruid).parents('.inforList').find('img').attr('src', getPicPath(ret.data));
          window.picUrlCur = true;
          $('#rt_' + ob.file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').hide();
        } else {
          window.picUrlCur = false;
          $('#rt_' + ob.file.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').hide();
        }
        uploader.reset();
      });
      uploader.on('uploadError', function (code) {
        console.log(code);
        $('#rt_' + code.source.ruid).parents('.inforList').find('img').parent().siblings('.upLoading').hide();
      });
    });

    /** 平台登录方法(oauth)方法*/
    function oauthLogin() {
      var url = window.location.href;
      if (url.indexOf("#page")) {
        url = url.split("#page")[0];
      }
      if (url.indexOf("?") != -1) {
        url = service.prefix + '/login?redirectUrl=' + url;
      } else {
        url = service.prefix + '/login?redirectUrl=' + url;
      }
      window.location.href = url;

      //window.location.href = service.prefix + '/login';
    }

    //用户类型
    function infoUserType(type) {
      switch (type) {
        case 2:
          return 2;
        case 3:
          return 3;
        case 4:
          return 3;
        case 5:
          return 4;
        case 301:
          return 2;
        case 300:
          return 2;
        case 200:
          return 1;
        case 1:
          return 1;
        case 201:
          return 1;
        default:
          return 0;
      }
    }

    //下拉框
    function mbSelect() {
      //选择项 隐藏下拉框
      $(document).on("click", ".mbSelect", function (e) {
        var e = e || window.event;
        var tar = e.target || e.srcElement;
        if (changeCur && $(tar).parents('.subSelGatList').parent().attr('id') != 'userSubject') {
          $('.select-box .types').hide();
          if ($(tar).hasClass('select')) {
            $(".mbSel").hide();
            if ($(tar).parents('.mbSelect').hasClass('phaseSel') && $(tar).attr('data-id') != $(tar).parents('.mbSelect').find('.selShow').attr('data-id')) {
              initSubject($(tar).parents('.subSelGat').attr('id'), $(tar).attr('data-id'), false);
            }
            $(tar).parents('.mbSelect').find('.selShow').html($(tar).html()).attr('data-id', $(tar).attr('data-id'));
          }
          if ($(tar).hasClass('selShow')) {
            if ($(tar).parent().find(".mbSel").css('display') == 'none') {
              $(".mbSel").hide();
              $(tar).parent().find(".mbSel").show();
            } else {
              $(tar).parent().find(".mbSel").hide();
            }
          }
        }
      });
      //点击下空白处，下拉框消失
      $(document).on("click", function (e) {
        var e = e || window.event;
        var tar = e.target || e.srcElement;
        $(".mbSel").hide();
      });
      //阻止冒泡
      $(document).on('click', '.mbSelect', function (e) {
        e.stopPropagation();
      });
    }

    $('body').on('click', '.mbSelectSmaill li', function () {
      var pid = $(this).parents('li.clearFix').attr('id'),
          id = $(this).attr('data-id');
      $(this).parents('.mbSelectSmaill').attr('data-id', id);
      if ($(this).hasClass('trigger')) {
        fetchGrade(pid, id);
        fetchSubject(pid, id);
      }
    });

    //图片url拼接
    function getPicPath(id) {
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    }

    //无修改恢复数据
    function noChange() {
      changeCur = false;
      handleBinded();
      $('.conLeft .modMark').removeClass('icon-star-pseudo');
      $('.inforList .cenMark').removeClass('conChange').attr({ 'readonly': 'readonly', 'unselectable': 'on' });

      $('.perCenBtn .saveBtn,.cancelBtn').hide();
      $('.perCenBtn .editBtn').show();
      $('#userDuty .mbSelect').hide().find('.selShow').html($('#userDuty .mbSelect+input').val());
      $('#userDuty .mbSelect+input').show();
      $('#sexEdit .mbSelect').hide().find('.selShow').html($('#sexEdit .mbSelect+input').val());
      $('#sexEdit .mbSelect+input').show();

      $('.inforList .subSelGat .mbSelect').addClass('mbNoSelect');

      $('.cenMark').each(function (i) {
        $('.cenMark').eq(i).attr('value', $(this).attr('data-old')).val($(this).attr('data-old'));
      });

      $('.inforList .editImg').hide();

      $('.addItem,.deleteItem').hide();

      $('#userSubject').find('.curSubSelGat').remove();

      $('.setUserPic img').attr('src', $('.setUserPic img').attr('data-old'));

      $('.inforList .clues').hide().removeClass('red');

      $('#userLoginEmail .eMailCode').addClass('eMailCodeHide');
      $('#securityPhone .eMailCode').addClass('eMailCodeHide');
      $('#LoginEmailCode, #securityCode').addClass('eMailCodeHide').find('.conCen').val('');

      $('.classInfo').show();
      $('.classInfoSelect').hide();
    }

    //有修改修改数据
    function change() {
      handleBinded();
      $('.conLeft .modMark').removeClass('icon-star-pseudo');
      $('.inforList .cenMark').removeClass('conChange').attr({ 'readonly': 'readonly', 'unselectable': 'on' });

      $('.perCenBtn .saveBtn,.cancelBtn').hide();
      $('.perCenBtn .editBtn').show();
      $('#userDuty .mbSelect').hide();
      $('#userDuty .mbSelect+input').show();
      $('#sexEdit .mbSelect').hide();
      $('#sexEdit .mbSelect+input').show();

      $('.inforList .subSelGat .mbSelect').addClass('mbNoSelect');

      $('.inforList .editImg').hide();

      $('.addItem,.deleteItem').hide();

      $('#sexEdit input').val($('#sexEdit .selShow').html());
      $('#userDuty input').val($('#userDuty .selShow').html());
      $('#userNamed input').val($('#userNamed .selShow').html());

      $('#userSubject').find('.curSubSelGat').removeClass('curSubSelGat');

      $('#birthdayShow').attr('value', $('#birthdaySel').val());
      $('#birthdaySel').hide();
      $('#birthdayShow').show();
      $('.cenMark').each(function (i) {
        // tools.log(i);
        $('.cenMark').eq(i).attr('data-old', $(this).val());
      });
      $('.setBannerBg img').attr('data-old', $('.setBannerBg img').attr('src'));
      $('.setUserPic img').attr('data-old', $('.setUserPic img').attr('src'));

      $('.inforList .clues').hide().removeClass('red');

      $('#userLoginEmail .eMailCode').addClass('eMailCodeHide');
      $('#securityPhone .eMailCode').addClass('eMailCodeHide');
      $('#LoginEmailCode, #securityCode').addClass('eMailCodeHide').find('.conCen').val('');
    }

    function handleBinded() {
      $.each($('.binded'), function (index, item) {
        if ($(item).attr('data-show') === 'true') {
          if ($(item).parent().attr('id') == 'securityPhone') {
            $(item).siblings('input').css('width', 'auto');
          }
          $(item).show();
        } else {
          $(item).hide();
          $(item).siblings('input').css('width', '233px');
        }
      });
    }

    function createSelect(text, classSuffix) {
      return '<div class="mbSelect mbSelectSmaill" readonly>' + '<p class="selShow">' + text + '</p>' + '<ul class="mbSel select_' + classSuffix + '">' + '</ul>' + '</div>';
    }

    function fetchPhase(id, subject) {
      $.getJSON(service.htmlHost + '/pf/api/meta/orgPhase?orgId=' + persUser['orgId'], function (res) {
        if (res['code'] === 'success') {
          var html = '';
          var selected = res['data'][0];
          $.each(res['data'], function (index, item) {
            if (item['name'] === subject.pahse) selected = item;
            html += '<li class="trigger" data-id="' + item['id'] + '"><p class="select">' + item['name'] + '</p></li>';
          });
          $('#' + id + ' .select_phase').html(html);
          $('#' + id + ' .select_phase').parent().attr('data-id', selected['id']);
          fetchGrade(id, selected['id'], subject.grade);
          fetchSubject(id, selected['id'], subject.subject);
        } else handleErr('学段数据请求错误，请刷新重试');
      }).error(function (err) {
        handleErr('学段数据请求错误，请刷新重试');
      });
    }

    function fetchGrade(id, phaseId, text) {
      $.getJSON(service.htmlHost + '/pf/api/meta/orgGrade?orgId=' + persUser['orgId'] + '&phaseId=' + phaseId, function (res) {
        if (res['code'] === 'success') {
          var html = '';
          var selected = res['data'][0];
          $.each(res['data'], function (index, item) {
            if (item['name'] === text) selected = item;
            html += '<li data-id="' + item['id'] + '"><p class="select">' + item['name'] + '</p></li>';
          });
          $('#' + id + ' .select_grade').html(html);
          $('#' + id + ' .select_grade').parent().attr('data-id', selected['id']);
        } else handleErr('年级数据请求错误，请刷新重试');
      }).error(function (err) {
        handleErr('年级数据请求错误，请刷新重试');
      });
    }

    function fetchSubject(id, phaseId, text) {
      $.getJSON(service.htmlHost + '/pf/api/meta/orgSubject?orgId=' + persUser['orgId'] + '&phaseId=' + phaseId, function (res) {
        if (res['code'] === 'success') {
          var html = '';
          var selected = res['data'][0];
          $.each(res['data'], function (index, item) {
            if (item['name'] === text) selected = item;
            html += '<li data-id="' + item['id'] + '"><p class="select">' + item['name'] + '</p></li>';
          });
          $('#' + id + ' .select_subject').html(html);
          $('#' + id + ' .select_subject').parent().attr('data-id', selected['id']);
        } else handleErr('学科数据请求错误，请刷新重试');
      }).error(function (err) {
        handleErr('学科数据请求错误，请刷新重试');
      });
    }

    function handleErr(msg) {
      layer.alert(msg, { icon: 0 });
    }

    //自定用户类型
    var USERTYPE = {
      NONE: 0,
      DISTRICT: 1,
      TEACHER: 2,
      STUDENT: 3,
      PARENT: 4
    };
    //用户信息存储
    var persUser = new Object();
    //输入状态:原始密码、新密码、再密码、姓名、联系电话、验证电子邮箱、家长电话、校验码、手机号绑定的手机号
    var pwdCur = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    //编辑态判断
    var changeCur = false;
    //选项默认basicInfor
    var selectType = 'basicInfor';
    //初始化下拉框
    mbSelect();

    //数据初始化
    $.ajax({
      type: "get",
      url: service.htmlHost + '/pf/uc/info',
      success: function success(data) {
        if (data.code == 'success') {
          data = data.data;
          persUser.orgId = data.account.orgId;
          //通用
          persUser.userType = infoUserType(data.account.userType);
          // data.account.userInfo.photo=data.account.userInfo.photo||'';
          if (persUser.userType == USERTYPE.STUDENT) {
            persUser.photo = data.account.userInfo.photo ? getPicPath(data.account.userInfo.photo) : 'images/studentPic.png';
          } else {
            persUser.photo = data.account.userInfo.photo ? getPicPath(data.account.userInfo.photo) : 'images/teacherPic.png';
          }

          persUser.name = data.account.userInfo.name || '';
          pwdCur[3] = persUser.name ? 1 : 0;
          persUser.account = data.account.account;
          persUser.sex = data.account.userInfo.sex == 1 ? '男' : '女';
          persUser.telephone = data.account.userInfo.telephone || '';
          pwdCur[4] = persUser.telephone ? 1 : 0;
          data.account.email = data.account.email || '';
          persUser.email = data.account.email || data.account.userInfo.email;
          persUser.boundEmail = data.account.email;
          persUser.boundPhone = data.account.cellphone && data.account.cellphone != -1 ? data.account.cellphone : '';
          pwdCur[5] = persUser.boundEmail ? 1 : 0;
          pwdCur[8] = persUser.boundPhone ? 1 : 0;

          if (persUser.boundEmail) {
            $('#userEmail').find('.conCen').removeClass('cenMark');
            $('#userEmail').find('.clues').html('如需修改请到【绑定信息】中进行修改').addClass('bule');
            $('#userLoginEmail .binded').attr('data-show', 'true');
          }
          if (persUser.boundPhone) {
            $('#securityPhone .binded').attr('data-show', 'true');
          }

          $('.perCenSelect .userLogoCen .logoImg').attr('src', persUser.photo);
          $('.perCenSelect .userLogo .userName').html(persUser.name);
          $('#userLogo .UserPicImg img').attr({ 'src': persUser.photo, 'data-old': persUser.photo });
          $('#userName').find('.conCen').attr({ 'data-old': persUser.name, 'value': persUser.name });
          $('#userNum').find('.conCen').attr({ 'value': persUser.account });
          $('#sexEdit').find('.conCen').attr({ 'data-old': persUser.sex, 'value': persUser.sex });
          $('#sexEdit').find('.selShow').html(persUser.sex);
          $('#userPhone').find('.conCen').attr({ 'data-old': persUser.telephone, 'value': persUser.telephone });
          $('#userEmail').find('.conCen').attr({ 'data-old': persUser.email, 'value': persUser.email });
          if (!persUser.boundEmail) {
            $('.perCenCon .inforChange .perCenBtn .editBtn').html('绑定邮箱');
          }
          if (!persUser.boundPhone) {
            $('.perCenCon .securityVerification .perCenBtn .editBtn').html('绑定手机号');
          }
          $('#userLoginEmail').find('.conCen').attr({
            'data-old': persUser.boundEmail,
            'value': persUser.boundEmail
          });
          $('#securityPhone').find('.conCen').attr({
            'data-old': persUser.boundPhone,
            'value': persUser.boundPhone
          });

          if (persUser.userType == USERTYPE.DISTRICT) {
            $('.basicInfor').find('#stuGrade,#stuClass,#stuSchNum,#perName,#perPhone').remove();

            persUser.orgName = data.account.userInfo.orgName || '';
            persUser.userSubject = data.roles || '';
            $('#userUnit').find('.conCen').attr({ 'data-old': persUser.orgName, 'value': persUser.orgName });
            persUser.subjectStr = '';
            $.each(persUser.userSubject, function (index, subject) {
              subject.phase = subject.phase || '';
              subject.subject = subject.subject || '';
              subject.role = subject.role || '';
              persUser.subjectStr += '<li class="clearFix">' + '<span>' + subject.role + '</span>' + '<span>' + subject.phase + '</span>' + '<span>' + subject.subject + '</span>' + '</li>';
            });
            $('#userSubject').find('.classInfo').html(persUser.subjectStr);
          } else if (persUser.userType == USERTYPE.TEACHER) {
            $('.basicInfor').find('#stuGrade,#stuClass,#stuSchNum,#perName,#perPhone').remove();

            persUser.orgName = data.account.userInfo.orgName || '';
            persUser.userSubject = data.roles || '';
            $('#userUnit').find('.conCen').attr({ 'data-old': persUser.orgName, 'value': persUser.orgName });
            persUser.subjectStr = '';
            persUser.subjectStrSelect = '';
            $.each(persUser.userSubject, function (index, subject) {
              subject.phase = subject.phase || '';
              subject.grade = subject.grade || '';
              subject.subject = subject.subject || '';
              subject.role = subject.role || '';
              persUser.subjectStr += '<li class="clearFix">' + '<span>' + subject.role + '</span>' + '<span>' + subject.phase + '</span>' + '<span>' + subject.grade + '</span>' + '<span>' + subject.subject + '</span>' + '</li>';
              persUser.subjectStrSelect += '<li class="clearFix" data-role="' + subject['id'] + '" id="select' + index + '">' + '<span>' + subject.role + '</span>' + (subject.roleInfo.showPhase ? createSelect(subject.phase, 'phase') : '') + (subject.roleInfo.showGrade ? createSelect(subject.grade, 'grade') : '') + (subject.roleInfo.showSubject ? createSelect(subject.subject, 'subject') : '') + '</li>';
              /*fetchPhase('select' + index, subject);*/
            });
            $('#userSubject').find('.classInfo').html(persUser.subjectStr);
            $('#userSubject').find('.classInfoSelect').html(persUser.subjectStrSelect);
          } else if (persUser.userType == USERTYPE.STUDENT) {
            $('.basicInfor').find('#userUnit,#userDuty,#userSubject,#stuClass').remove();

            persUser.studentCode = data.account.userInfo.studentCode;
            persUser.parentsName = data.account.userInfo.parentsName;
            persUser.parentsPhone = data.account.userInfo.parentsPhone;
            $('#stuSchNum').find('.conCen').attr({ 'value': persUser.studentCode });
            $('#perName').find('.conCen').attr({ 'value': persUser.parentsName });
            $('#perPhone').find('.conCen').attr({
              'data-old': persUser.parentsPhone,
              'value': persUser.parentsPhone
            });
            pwdCur[6] = persUser.parentsPhone ? 1 : 0;
          } else if (persUser.userType == USERTYPE.PARENT) {
            $('.basicInfor').find('#userUnit,#userDuty,#userSubject,#stuGrade,#stuClass,#stuSchNum,#perName,#perPhone').remove();
          }

          $('.perCenCon .basicInfor').removeClass('eMailCodeHide');
        } else if (data.code == 'login_error') {
          layer.alert('用户已过期，请重新登录', { icon: 0 }, function () {
            oauthLogin();
          });
        } else {
          layer.alert('信息初始化失败，请刷新页面重试！', { icon: 0 });
        }
      },
      error: function error(data) {
        layer.alert('信息初始化失败，请刷新页面重试！', { icon: 0 });
      }
    });

    //资料编辑/保存/取消状态切换
    $('.editBtn').on('click', function (e) {
      changeCur = true;
      $('.binded').hide();
      $('.binded').siblings('input').css('width', '233px');
      $('.inforList .modMark').addClass('icon-star-pseudo');
      $('.inforList .cenMark').addClass('conChange').removeAttr('readonly unselectable');

      $('.perCenBtn .saveBtn,.cancelBtn').css('display', 'inline-block');
      $('.perCenBtn .editBtn').hide();

      $('.inforList .mbSelect').show();
      $('.inforList .mbSelect+input').hide();

      $('.inforList .editImg').show();

      $('.inforList .clues').show();

      $('#editImg2').find('div').eq(1).css({ 'width': '100%', 'height': '100%' });

      // 职务信息
      $('.classInfo').hide();
      $('.classInfoSelect').show();

      if (selectType == 'inforChange') {
        $('#userLoginEmail .eMailCode').removeClass('eMailCodeHide eMailCodeForbid');
        $('#securityPhone .eMailCode').removeClass('eMailCodeHide eMailCodeForbid');
        $('#LoginEmailCode, #securityCode').removeClass('eMailCodeHide').find('.conCen').val('');
        $('#userLoginEmail .clues').html('').css('color', '#fff');
      }
      if (selectType === 'securityVerification') {
        $('#securityCode .eMailCode').removeClass('eMailCodeHide eMailCodeForbid');
        $('#securityPhone .eMailCode').removeClass('eMailCodeHide eMailCodeForbid');
        $('#securityCode').removeClass('eMailCodeHide').find('.conCen').val('');
        $('#securityCode .clues').html('').css('color', '#fff');
      }
    });
    $('.cancelBtn').on('click', function (e) {
      noChange();
      // $('#sexEdit input').val($('#sexEdit .selShow').html())
    });
    $('.saveBtn').on('click', function (e) {
      if (selectType != 'inforChange') {
        $('.inforList .clues').hide();
      }

      //基本信息保存
      if (selectType == 'basicInfor') {
        if (pwdCur[3] == 0) {
          $('#userName').find('.clues').show().html('请输入您的姓名').addClass('red');
        } else if (pwdCur[4] == 0) {
          $('#userPhone').find('.clues').show().html('请输入您的联系电话').addClass('red');
        } else if (pwdCur[6] == 0 && persUser.userType == USERTYPE.STUDENT) {
          $('#perPhone').find('.clues').show().html('请输入家长的联系电话').addClass('red');
        } else if ($('#userEmail').find('.clues').hasClass('red')) {
          $('#userEmail').find('.clues').show().html('您输入的电子邮箱不正确').addClass('red');
        } else {
          var upInfoObj = {};
          upInfoObj.name = $('#userName').find('.conCen').val();
          upInfoObj.sex = $('#sexEdit').find('.selShow').html() == '男' ? 1 : 2;
          upInfoObj.telephone = $('#userPhone').find('.conCen').val();
          upInfoObj.email = $('#userEmail').find('.conCen').val();
          if (persUser.userType == USERTYPE.STUDENT) {
            upInfoObj.papersNumber = $('#perPhone').find('.conCen').val();
          }

          // 职务信息
          upInfoObj.userRoles = [];
          $.each($('#userSubject').find('.classInfoSelect .clearFix'), function (index, item) {
            var roleId = $(item).attr('data-role');
            var phaseId = $(item).find('.select_phase').parent().attr('data-id'),
                gradeId = $(item).find('.select_grade').parent().attr('data-id'),
                subjectId = $(item).find('.select_subject').parent().attr('data-id');
            upInfoObj["userRoles[" + index + "].id"] = roleId;
            upInfoObj["userRoles[" + index + "].phaseId"] = phaseId;
            upInfoObj["userRoles[" + index + "].gradeId"] = gradeId;
            upInfoObj["userRoles[" + index + "].subjectId"] = subjectId;
          });

          $.ajax({
            type: "post",
            url: service.htmlHost + '/pf/uc/upInfo',
            data: upInfoObj,
            success: function success(data) {
              if (data.code == 'success') {
                layer.alert('基本资料修改成功', { icon: 0 }, function () {
                  location.reload();
                });
                $('.perCenSelect .userLogo .userName').html(upInfoObj.name);
                $('#login_message .login_username').html(upInfoObj.name + '<span class="arrow"></span>');
                change();
              } else if (data.code == 'login_error') {
                layer.alert('用户已过期，请重新登录', { icon: 0 }, function () {
                  oauthLogin();
                });
              } else {
                layer.alert(data.msg, { icon: 0 });
              }
            },
            error: function error(data) {
              layer.alert('基本资料修改失败，请刷新页面后重试！', { icon: 0 });
            }
          });
        }
      }
      // 安全验证
      else if (selectType == 'securityVerification') {
          if (pwdCur[7] == 0) $('#securityCode').find('.clues').show().html('请输入验证码').addClass('red');else {
            $.ajax({
              type: 'post',
              url: service.htmlHost + '/pf/uc/verifyMobile',
              data: {
                mobile: $('#securityPhone input').val().trim(),
                code: $('#securityCode input').val().trim()
              },
              success: function success(res) {
                if (res['code'] === 'success') {
                  layer.alert('手机号绑定成功', { icon: 0 }, function () {
                    location.reload();
                  });
                } else layer.alert('手机号绑定失败，请刷新页面后重试！', { icon: 0 });
              },
              error: function error(err) {
                layer.alert('手机号绑定失败，请刷新页面后重试！', { icon: 0 });
              }
            });
          }
        }
        //头像保存
        else if (selectType == 'setUserLogo') {
            if (window.picUrlCur) {
              $.ajax({
                type: "post",
                url: service.htmlHost + '/pf/uc/updatePhoto',
                data: {
                  'photo': window.picUrlId
                },
                success: function success(data) {
                  if (data.code == 'success') {
                    layer.alert('头像修改成功', { icon: 0 });
                    $('.perCenSelect .userLogoCen .logoImg').attr('src', $('#userLogo .UserPicImg img').attr('src'));
                    change();
                  } else if (data.code == 'login_error') {
                    layer.alert('用户已过期，请重新登录', { icon: 0 }, function () {
                      oauthLogin();
                    });
                  } else {
                    layer.alert(data.msg, { icon: 0 });
                  }
                },
                error: function error(data) {
                  layer.alert('头像修改失败，请刷新页面后重试！', { icon: 0 });
                }
              });
            } else {
              noChange();
            }
          }
          //绑定信息保存
          else if (selectType == 'inforChange') {
              if (pwdCur[5] != 1) {
                $('#userLoginEmail .clues').show().html('您输入的电子邮箱不正确').addClass('red');
              } else {
                $.ajax({
                  type: "post",
                  url: service.htmlHost + '/pf/uc/verifyMail',
                  data: {
                    'mailAddress': $('#userLoginEmail input').val(),
                    'code': $('#LoginEmailCode input').val()
                  },
                  success: function success(data) {
                    if (data.code == 'success') {
                      layer.alert('绑定邮箱修改成功', { icon: 0 });
                      $('.perCenCon .inforChange .perCenBtn .editBtn').html('更换邮箱');
                      $('#userEmail').find('.conCen').removeClass('cenMark conChange').val($('#userLoginEmail input').val());
                      $('#userEmail').find('.clues').html('如需修改请到【绑定信息】中进行修改').addClass('bule');
                      change();
                      // $('#userLoginEmail .clues').html('验证码已发送，请登录邮箱查看').css('color','#1cd677')
                    } else if (data.code == 'failed') {
                      layer.alert('验证码错误', { icon: 0 });
                    } else if (data.code == 'login_error') {
                      layer.alert('用户已过期，请重新登录', { icon: 0 }, function () {
                        oauthLogin();
                      });
                    } else {
                      layer.alert('绑定邮箱修改失败', { icon: 0 });
                    }
                  },
                  error: function error(data) {
                    layer.alert('绑定邮箱修改失败，请刷新页面后重试！', { icon: 0 });
                  }
                });
              }
            }
    });
    //密码修改
    $('.passWord .pwdSaveBtn').on('click', function (e) {
      if (pwdCur[0] == 1 && pwdCur[1] == 1 && pwdCur[2] == 1) {
        $.ajax({
          type: "post",
          url: service.htmlHost + '/pf/uc/updatePas',
          data: {
            'oldPas': $('#priCode input').val(),
            'newPas': $('#newPwd input').val()
          },
          success: function success(data) {
            if (data.code == 'success') {
              layer.alert('密码修改成功', { icon: 0 });
              //修改成功后执行
              $('.perCenCon .passWord .conCen').attr('value', '').val('');
              $('.perCenCon .passWord .clues').hide();
            } else if (data.code == 'login_error') {
              layer.alert('用户已过期，请重新登录', { icon: 0 }, function () {
                oauthLogin();
              });
            } else {
              layer.alert(data.msg, { icon: 0 });
            }
          },
          error: function error(data) {
            layer.alert('密码修改失败，请刷新页面后重试！', { icon: 0 });
          }
        });
      } else if (pwdCur[0] != 1) {
        $('#priCode').find('.clues').show().html('请输入原密码').addClass('red');
      } else if (pwdCur[1] != 1) {
        // $('#newPwd').find('.clues').show().html('请输入新密码').addClass('red');
      } else if (pwdCur[2] != 1) {
        if ($('#againNewPwd input').val().length > 0) {
          $('#againNewPwd').find('.clues').show().html('两次输入密码不一致').addClass('red');
        } else {
          $('#againNewPwd').find('.clues').show().html('请输入确认密码').addClass('red');
        }
      }
    });
    //邮箱验证码发送
    $('#userLoginEmail .eMailCode').on('click', function (e) {
      var e = e || window.event;
      var tar = e.target || e.srcElement;
      if (pwdCur[5] == 1) {
        if (!$(tar).hasClass('eMailCodeForbid')) {
          $('#userLoginEmail .clues').html('邮件正在发送中...').show().css('color', '#1cd677');
          $('#userLoginEmail .conCen').attr({ 'readonly': 'readonly', 'unselectable': 'on' });
          $(tar).addClass('eMailCodeForbid');
          $.ajax({
            type: "post",
            url: service.htmlHost + '/pf/uc/mailSend',
            data: {
              'mailAddress': $('#userLoginEmail input').val()
            },
            success: function success(data) {
              if (data.code == 'success') {
                $('#userLoginEmail .clues').html('验证码已发送，请登录邮箱查看').show().css('color', '#1cd677');
              } else if (data.code == 'login_error') {
                layer.alert('用户已过期，请重新登录', { icon: 0 }, function () {
                  oauthLogin();
                });
                $('#userLoginEmail .clues').html('验证码发送失败').show().css('color', 'red');
              } else {
                layer.alert('验证码发送失败', { icon: 0 });
                $(tar).removeClass('eMailCodeForbid');
                $('#userLoginEmail .conCen').removeAttr('readonly unselectable');
                $('#userLoginEmail .clues').html(data.msg || '验证码发送失败').show().css('color', 'red');
              }
            },
            error: function error(data) {
              layer.alert('验证码发送失败，请刷新页面后重试！', { icon: 0 });
            }
          });
        }
      } else {
        $(tar).parent().find('.clues').show().html('请输入您的电子邮箱').addClass('red');
      }
    });
    // 手机验证码发送
    $('.securityVerification .eMailCode').on('click', function (e) {
      var e = e || window.event;
      var tar = e.target || e.srcElement;
      var mobile = $('#securityPhone input').val().trim();
      if (pwdCur[8] == 1) {
        if (!$(tar).hasClass('eMailCodeForbid')) {
          $('#securityPhone .clues').html('验证码正在发送中...').show().css('color', '#1cd677');
          $('#securityPhone .conCen').attr({ 'readonly': 'readonly', 'unselectable': 'on' });
          $(tar).addClass('eMailCodeForbid');
          $.ajax({
            type: "post",
            url: service.htmlHost + '/pf/uc/sendMobileCode',
            data: {
              'mobile': mobile
            },
            success: function success(data) {
              if (data.code == 'success') {
                $('#securityPhone .clues').html('验证码已发送，请注意查收').show().css('color', '#1cd677');
              } else if (data.code == 'login_error') {
                layer.alert('用户已过期，请重新登录', { icon: 0 }, function () {
                  oauthLogin();
                });
                $('#securityPhone .clues').html('验证码发送失败').show().css('color', 'red');
              } else {
                layer.alert('验证码发送失败', { icon: 0 });
                $(tar).removeClass('eMailCodeForbid');
                $('#securityPhone .clues').html('验证码发送失败').show().css('color', 'red');
                $('#securityPhone .conCen').removeAttr('readonly unselectable');
              }
            },
            error: function error(data) {
              $('#securityPhone .clues').html('验证码发送失败').show().css('color', 'red');
              $(tar).removeClass('eMailCodeForbid');
              layer.alert('验证码发送失败，请刷新页面后重试！', { icon: 0 });
            }
          });
        }
      } else {
        var msg = '请输入您的手机号';
        if (mobile != '' && !/^1[34578]\d{9}$/.test(mobile)) {
          msg = '手机号码格式不正确';
        }
        $(tar).parent().find('.clues').show().html(msg).addClass('red');
      }
    });

    //选项卡切换
    $('.perCenSelect .selList').on('click', function (e) {
      var e = e || window.event;
      var tar = e.target || e.srcElement;
      var tarP = $(tar).hasClass('selList') ? $(tar) : $(tar).parent();
      selectType = $(tarP).attr('data_type');
      tarP.addClass('select').siblings().removeClass('select');
      $('.perCenCon .basicInfor, .securityVerification, .setUserLogo, .passWord, .inforChange').hide();
      $('.perCenCon .cenConTitle').html($(tarP).find('p').html());
      $('.perCenCon .' + selectType).show();
      noChange();
      if (selectType == 'passWord') {
        changeCur = true;
        $('.perCenCon .passWord .conCen').val('');
        pwdCur[0] = 0;
        pwdCur[1] = 0;
        pwdCur[2] = 0;
      }
      $('.perCenCon .subTitle').hide().removeClass('curr');
      if (selectType === 'inforChange') {
        $('.perCenCon .cenConTitle').html('邮箱绑定');
        $('.perCenCon .cenConTitle').addClass('cenConTitle1');
        $('.perCenCon .subTitle').show();
        // 选定绑定邮箱
        $('.perCenCon .cenConTitle').addClass('curr');
        $('.perCenCon .inforChange').show();
        $('.perCenCon .securityVerification').hide();
      }
    });

    // 绑定信息tab切换
    $('.perCenCon').on('click', '.cenConTitle1, .subTitle', function () {
      noChange();
      $(this).siblings().removeClass('curr');
      $(this).addClass('curr');

      if ($(this).hasClass('cenConTitle')) {
        selectType = 'inforChange';
        $('.perCenCon .inforChange').show();
        $('.perCenCon .securityVerification').hide();
      } else {
        if (!persUser.boundPhone) $('.securityVerification .editBtn').trigger('click');
        selectType = 'securityVerification';
        $('.perCenCon .inforChange').hide();
        $('.perCenCon .securityVerification').show();
      }
    });

    /**
     * 显示安全验证
     */
    function showSecurity() {
      selectType = 'securityVerification';
      $('.perCenCon .cenConTitle').html('安全验证');
      $('.perCenCon .basicInfor').hide();
      $('.perCenCon .securityVerification').show();
    }

    // 安全验证取消
    $('.cancelBtn1').on('click', function () {
      selectType = 'basicInfor';
      $('.perCenCon .cenConTitle').html('基本资料');
      $('.perCenCon .basicInfor').show();
      $('.perCenCon .securityVerification').hide();
    });

    //input操作
    $(document).on('blur', '.perCenCon .conCen', function (e) {
      var e = e || window.event;
      var tar = e.target || e.srcElement;
      var tarP = $(tar).parent();
      var tarVal = $(tar).val().trim();
      if (changeCur) {
        if (tarP.attr('id') == 'userName') {
          if (tarVal.match('^[A-Za-z0-9\u4E00-\u9FA5]+$')) {
            pwdCur[3] = 1;
            tarP.find('.clues').hide().html('请输入您的姓名').removeClass('red');
          } else if (tarVal == '') {
            pwdCur[3] = 0;
            tarP.find('.clues').show().html('请输入您的姓名').addClass('red');
          } else {
            pwdCur[3] = 0;
            tarP.find('.clues').show().html('您输入的姓名不正确').addClass('red');
          }
        } else if (tarP.attr('id') === 'securityPhone') {
          if (/^1[34578]\d{9}$/.test(tarVal)) {
            pwdCur[8] = 1;
            tarP.find('.clues').hide().html('手机号码格式不正确').removeClass('red');
          } else if (tarVal == '') {
            pwdCur[8] = 0;
            tarP.find('.clues').show().html('请输入您的手机号').addClass('red');
          } else {
            pwdCur[8] = 0;
            tarP.find('.clues').show().html('手机号码格式不正确').addClass('red');
          }
        } else if (tarP.attr('id') == 'securityCode') {
          if (tarVal) {
            pwdCur[7] = 1;
            tarP.find('.clues').hide();
          } else {
            pwdCur[7] = 0;
            tarP.find('.clues').show().html('请输入验证码').addClass('red');
          }
        } else if (tarP.attr('id') == 'userPhone') {
          if (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(tarVal) || /^1[34578]\d{9}$/.test(tarVal)) {
            pwdCur[4] = 1;
            tarP.find('.clues').hide().html('请输入联系电话').removeClass('red');
          } else if (tarVal == '') {
            pwdCur[4] = 1;
            tarP.find('.clues').hide().html('请输入联系电话').removeClass('red');
          } else {
            pwdCur[4] = 0;
            tarP.find('.clues').show().html('您输入的联系电话不正确').addClass('red');
          }
        } else if (tarP.attr('id') == 'perPhone') {
          if (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(tarVal) || /^1[34578]\d{9}$/.test(tarVal)) {
            pwdCur[6] = 1;
            tarP.find('.clues').hide().html('请输入联系电话').removeClass('red');
          } else if (tarVal == '') {
            pwdCur[6] = 0;
            tarP.find('.clues').show().html('请输入联系电话').addClass('red');
          } else {
            pwdCur[6] = 0;
            tarP.find('.clues').show().html('您输入的联系电话不正确').addClass('red');
          }
        } else if (tarP.attr('id') == 'userEmail' || tarP.attr('id') == 'userLoginEmail') {
          if ($('#userLoginEmail .eMailCode').hasClass('eMailCodeForbid') && selectType == 'inforChange') {} else {
            if (tarVal.match('^[0-9a-zA-Z]+@(([0-9a-zA-Z]+)[.])+[a-z]{2,4}$')) {
              tarP.find('.clues').hide().html('请输入您的电子邮箱').removeClass('red');
              pwdCur[5] = 1;
            } else if (tarVal != '') {
              tarP.find('.clues').show().html('您输入的电子邮箱不正确').addClass('red');
              pwdCur[5] = 0;
            } else {
              tarP.find('.clues').show().html('请输入您的电子邮箱').css('color', 'red');
              pwdCur[5] = 0;
            }
          }
        } else if (tarP.attr('id') == 'priCode') {
          if (tarVal.match('^\\S{6,20}$')) {
            tarP.find('.clues').hide().html('请输入您的原始密码').removeClass('red');
            pwdCur[0] = 1;
          } else if (tarVal == '') {
            tarP.find('.clues').show().html('请输入原密码').addClass('red');
            pwdCur[0] = 0;
          } else {
            tarP.find('.clues').show().html('您输入的原密码不正确').addClass('red');
            pwdCur[0] = 0;
          }
        } else if (tarP.attr('id') == 'newPwd') {
          if (tarVal.match('^\\S{6,20}$')) {
            if (tarVal != $('#againNewPwd').find('input').val() && pwdCur[2] == 1) {
              $('#againNewPwd').find('.clues').show().html('两次输入密码不一致').addClass('red');
              pwdCur[2] = 0;
            } else if (tarVal == $('#againNewPwd').find('input').val()) {
              $('#againNewPwd').find('.clues').hide().html('两次输入密码不一致').removeClass('red');
              pwdCur[2] = 1;
            }
            tarP.find('.clues').hide().html('6-20位字符，建议数字、字母、标点符号组合').removeClass('red');
            pwdCur[1] = 1;
          } else if (tarVal == '') {
            tarP.find('.clues').show().html('请输入新密码').addClass('red');
            pwdCur[1] = 0;
          } else {
            tarP.find('.clues').show().html('6-20位字符，建议数字、字母、标点符号组合').addClass('red');
            pwdCur[1] = 0;
          }
        } else if (tarP.attr('id') == 'againNewPwd') {
          if (tarVal.match('^\\S{6,20}$')) {
            if (tarVal != $('#newPwd').find('input').val()) {
              tarP.find('.clues').show().html('两次输入密码不一致').addClass('red');
              if (pwdCur[1] == 1) {
                pwdCur[2] = 0;
              } else {
                pwdCur[2] = 1;
              }
            } else {
              tarP.find('.clues').hide().html('请输入确认密码').removeClass('red');
              pwdCur[2] = 1;
            }
          } else if (tarVal == '') {
            tarP.find('.clues').show().html('请输入再次输入新密码').addClass('red');
            pwdCur[2] = 0;
          } else {
            tarP.find('.clues').show().html('两次输入密码不一致').addClass('red');
            pwdCur[2] = 0;
          }
        }
      }
    });
    $(document).on('focus', '.perCenCon .conCen', function (e) {
      var e = e || window.event;
      var tar = e.target || e.srcElement;
      var tarP = $(tar).parent();
      if (selectType != 'inforChange') {
        $(tarP).find('.clues').hide().removeClass('red');
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlcnNDZW50ZXIvanMvcGVyc0NlbnRlci5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiZW5mb3JlRGVmaW5lIiwiY29uZmlncGF0aHMiLCIkIiwidG9vbHMiLCJoZWFkZXIiLCJmb290ZXIiLCJzZXJ2aWNlIiwiV2ViVXBsb2FkZXIiLCJsYXllciIsInRlbXBsYXRlIiwiZ2V0UGljUGF0aCIsImlkIiwicGF0aF91cmwiLCJzdWJzdHJpbmciLCJwcmVmaXgiLCJyZXBsYWNlIiwidXBsb2FkVXJsIiwiaHRtbEhvc3QiLCJ1cGxvYWRlciIsImNyZWF0ZSIsInN3ZiIsImFjY2VwdCIsInRpdGxlIiwiZXh0ZW5zaW9ucyIsIm1pbWVUeXBlcyIsInNlcnZlciIsImZpbGVOdW1MaW1pdCIsInBpY2siLCJmaWxlU2l6ZUxpbWl0IiwiZmlsZVNpbmdsZVNpemVMaW1pdCIsIm9uIiwiZmlsZSIsIndpbmRvdyIsInBpY1VybElkIiwic291cmNlIiwicnVpZCIsInBhcmVudHMiLCJmaW5kIiwicGFyZW50Iiwic2libGluZ3MiLCJzaG93IiwidXBsb2FkIiwib2IiLCJyZXQiLCJkYXRhIiwia2V5IiwiY29kZSIsImNvbnNvbGUiLCJsb2ciLCJhdHRyIiwicGljVXJsQ3VyIiwiaGlkZSIsInJlc2V0Iiwib2F1dGhMb2dpbiIsInVybCIsImxvY2F0aW9uIiwiaHJlZiIsImluZGV4T2YiLCJzcGxpdCIsImluZm9Vc2VyVHlwZSIsInR5cGUiLCJtYlNlbGVjdCIsImRvY3VtZW50IiwiZSIsImV2ZW50IiwidGFyIiwidGFyZ2V0Iiwic3JjRWxlbWVudCIsImNoYW5nZUN1ciIsImhhc0NsYXNzIiwiaW5pdFN1YmplY3QiLCJodG1sIiwiY3NzIiwic3RvcFByb3BhZ2F0aW9uIiwicGlkIiwiZmV0Y2hHcmFkZSIsImZldGNoU3ViamVjdCIsIm5vQ2hhbmdlIiwiaGFuZGxlQmluZGVkIiwicmVtb3ZlQ2xhc3MiLCJ2YWwiLCJhZGRDbGFzcyIsImVhY2giLCJpIiwiZXEiLCJyZW1vdmUiLCJjaGFuZ2UiLCJpbmRleCIsIml0ZW0iLCJjcmVhdGVTZWxlY3QiLCJ0ZXh0IiwiY2xhc3NTdWZmaXgiLCJmZXRjaFBoYXNlIiwic3ViamVjdCIsImdldEpTT04iLCJwZXJzVXNlciIsInJlcyIsInNlbGVjdGVkIiwicGFoc2UiLCJncmFkZSIsImhhbmRsZUVyciIsImVycm9yIiwiZXJyIiwicGhhc2VJZCIsIm1zZyIsImFsZXJ0IiwiaWNvbiIsIlVTRVJUWVBFIiwiTk9ORSIsIkRJU1RSSUNUIiwiVEVBQ0hFUiIsIlNUVURFTlQiLCJQQVJFTlQiLCJPYmplY3QiLCJwd2RDdXIiLCJzZWxlY3RUeXBlIiwiYWpheCIsInN1Y2Nlc3MiLCJvcmdJZCIsImFjY291bnQiLCJ1c2VyVHlwZSIsInBob3RvIiwidXNlckluZm8iLCJuYW1lIiwic2V4IiwidGVsZXBob25lIiwiZW1haWwiLCJib3VuZEVtYWlsIiwiYm91bmRQaG9uZSIsImNlbGxwaG9uZSIsIm9yZ05hbWUiLCJ1c2VyU3ViamVjdCIsInJvbGVzIiwic3ViamVjdFN0ciIsInBoYXNlIiwicm9sZSIsInN1YmplY3RTdHJTZWxlY3QiLCJyb2xlSW5mbyIsInNob3dQaGFzZSIsInNob3dHcmFkZSIsInNob3dTdWJqZWN0Iiwic3R1ZGVudENvZGUiLCJwYXJlbnRzTmFtZSIsInBhcmVudHNQaG9uZSIsInJlbW92ZUF0dHIiLCJ1cEluZm9PYmoiLCJwYXBlcnNOdW1iZXIiLCJ1c2VyUm9sZXMiLCJyb2xlSWQiLCJncmFkZUlkIiwic3ViamVjdElkIiwicmVsb2FkIiwibW9iaWxlIiwidHJpbSIsImxlbmd0aCIsInRlc3QiLCJ0YXJQIiwidHJpZ2dlciIsInNob3dTZWN1cml0eSIsInRhclZhbCIsIm1hdGNoIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsV0FBUyxLQURJO0FBRWJDLFNBQU87QUFDTCxvQkFBZ0I7QUFEWCxHQUZNO0FBS2JDLGdCQUFjO0FBTEQsQ0FBZjtB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O0FBQ0Y7QUFDRjtBQUNGLEtBOUhEO0FBK0hBaEgsTUFBRTRELFFBQUYsRUFBWWhDLEVBQVosQ0FBZSxPQUFmLEVBQXdCLG9CQUF4QixFQUE4QyxVQUFVaUMsQ0FBVixFQUFhO0FBQ3pELFVBQUlBLElBQUlBLEtBQUsvQixPQUFPZ0MsS0FBcEI7QUFDQSxVQUFJQyxNQUFNRixFQUFFRyxNQUFGLElBQVlILEVBQUVJLFVBQXhCO0FBQ0EsVUFBSXlGLE9BQU8xSixFQUFFK0QsR0FBRixFQUFPM0IsTUFBUCxFQUFYO0FBQ0EsVUFBSTZFLGNBQWMsYUFBbEIsRUFBaUM7QUFDL0JqSCxVQUFFMEosSUFBRixFQUFRdkgsSUFBUixDQUFhLFFBQWIsRUFBdUJjLElBQXZCLEdBQThCNEIsV0FBOUIsQ0FBMEMsS0FBMUM7QUFDRDtBQUVGLEtBUkQ7QUFVRCxHQXIvQkQ7QUFzL0JELENBei9CRCIsImZpbGUiOiJwZXJzQ2VudGVyL2pzL3BlcnNDZW50ZXItM2Q1ZGRjYmRiMy5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ3BsYXRmb3JtQ29uZic6ICdwdWJsaWMvanMvcGxhdGZvcm1Db25mLmpzJ1xyXG4gIH0sXHJcbiAgZW5mb3JlRGVmaW5lOiB0cnVlXHJcbn0pO1xyXG5yZXF1aXJlKFsncGxhdGZvcm1Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG4gIC8vIGNvbmZpZ3BhdGhzLnBhdGhzLmRpYWxvZyA9IFwibXlzcGFjZS9qcy9hcHBEaWFsb2cuanNcIjtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcbiAgcmVxdWlyZShbJ2pxdWVyeScsICd0b29scycsICdoZWFkZXInLCAnZm9vdGVyJywgJ3NlcnZpY2UnLCAnd2VidXBsb2FkZXInLCAnbGF5ZXInLCAndGVtcGxhdGUnXSwgZnVuY3Rpb24gKCQsIHRvb2xzLCBoZWFkZXIsIGZvb3Rlciwgc2VydmljZSwgV2ViVXBsb2FkZXIsIGxheWVyLCB0ZW1wbGF0ZSkge1xyXG4gICAgZnVuY3Rpb24gZ2V0UGljUGF0aChpZCkge1xyXG4gICAgICByZXR1cm4gc2VydmljZS5wYXRoX3VybFsnZG93bmxvYWRfdXJsJ10uc3Vic3RyaW5nKDAsIDQpID09PSAnaHR0cCcgPyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXSA6IChzZXJ2aWNlLnByZWZpeCArIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkpO1xyXG4gICAgICA7XHJcbiAgICB9XHJcblxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB1cGxvYWRVcmwgPSBzZXJ2aWNlLnBhdGhfdXJsWyd1cGxvYWRfdXJsJ10uc3Vic3RyaW5nKDAsIDQpID09PSAnaHR0cCcgPyBzZXJ2aWNlLnBhdGhfdXJsWyd1cGxvYWRfdXJsJ10gOiAoc2VydmljZS5odG1sSG9zdCArIHNlcnZpY2UucGF0aF91cmxbJ3VwbG9hZF91cmwnXSk7XHJcbiAgICAgIHZhciB1cGxvYWRlciA9IFdlYlVwbG9hZGVyLmNyZWF0ZSh7XHJcbiAgICAgICAgLy8gc3dm5paH5Lu26Lev5b6EXHJcbiAgICAgICAgc3dmOiAnLi4vLi4vLi4vLi4vbGliL2NvbXBvbmVudC91cGxvYWQvaW1hZ2UtanMvVXBsb2FkZXIuc3dmJyxcclxuICAgICAgICBhY2NlcHQ6IHtcclxuICAgICAgICAgIHRpdGxlOiAnSW1hZ2VzJyxcclxuICAgICAgICAgIGV4dGVuc2lvbnM6ICdqcGcsanBlZyxwbmcnLFxyXG4gICAgICAgICAgbWltZVR5cGVzOiAnaW1hZ2UvanBnLCBpbWFnZS9qcGVnLCBpbWFnZS9wbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyDmlofku7bmjqXmlLbmnI3liqHnq6/jgIJcclxuICAgICAgICBzZXJ2ZXI6IHVwbG9hZFVybCxcclxuICAgICAgICAvL+aWh+S7tuaVsOmHj1xyXG4gICAgICAgIGZpbGVOdW1MaW1pdDogNTAsXHJcbiAgICAgICAgLy8g6YCJ5oup5paH5Lu255qE5oyJ6ZKu44CC5Y+v6YCJ44CCXHJcbiAgICAgICAgLy8g5YaF6YOo5qC55o2u5b2T5YmN6L+Q6KGM5piv5Yib5bu677yM5Y+v6IO95pivaW5wdXTlhYPntKDvvIzkuZ/lj6/og73mmK9mbGFzaC5cclxuICAgICAgICBwaWNrOiB7XHJcbiAgICAgICAgICBpZDogJyNlZGl0SW1nMidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpbGVTaXplTGltaXQ6IDIwICogMTAyNCAqIDEwMjQgKiAxMDI0LCAgICAvLyAyMEdcclxuICAgICAgICBmaWxlU2luZ2xlU2l6ZUxpbWl0OiA1ICogMTAyNCAqIDEwMjQgKiAxMDI0ICAgIC8vIDVHXHJcbiAgICAgIH0pO1xyXG4gICAgICAvL+W9k+acieaWh+S7tua3u+WKoOi/m+adpeeahOaXtuWAmVxyXG4gICAgICB1cGxvYWRlci5vbignZmlsZVF1ZXVlZCcsIGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgd2luZG93LnBpY1VybElkID0gJyc7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJCgnI3J0XycrZmlsZS5zb3VyY2UucnVpZCkpO1xyXG4gICAgICAgICQoJyNydF8nICsgZmlsZS5zb3VyY2UucnVpZCkucGFyZW50cygnLmluZm9yTGlzdCcpLmZpbmQoJ2ltZycpLnBhcmVudCgpLnNpYmxpbmdzKCcudXBMb2FkaW5nJykuc2hvdygpO1xyXG4gICAgICAgIC8vIHdpbmRvdy5zZXRJbWdFbGUucGFyZW50KCkuc2libGluZ3MoJy51cExvYWRpbmcnKS5zaG93KCk7XHJcbiAgICAgICAgdXBsb2FkZXIudXBsb2FkKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdXBsb2FkZXIub24oJ3VwbG9hZEFjY2VwdCcsIGZ1bmN0aW9uIChvYiwgcmV0KSB7XHJcbiAgICAgICAgaWYgKCFyZXQuZGF0YSkge1xyXG4gICAgICAgICAgcmV0LmRhdGEgPSByZXQua2V5O1xyXG4gICAgICAgICAgcmV0LmNvZGUgPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKHJldClcclxuICAgICAgICBpZiAocmV0LmNvZGUgPT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICB3aW5kb3cucGljVXJsSWQgPSByZXQuZGF0YTtcclxuICAgICAgICAgICQoJyNydF8nICsgb2IuZmlsZS5zb3VyY2UucnVpZCkucGFyZW50cygnLmluZm9yTGlzdCcpLmZpbmQoJ2ltZycpLmF0dHIoJ3NyYycsIGdldFBpY1BhdGgocmV0LmRhdGEpKTtcclxuICAgICAgICAgIHdpbmRvdy5waWNVcmxDdXIgPSB0cnVlO1xyXG4gICAgICAgICAgJCgnI3J0XycgKyBvYi5maWxlLnNvdXJjZS5ydWlkKS5wYXJlbnRzKCcuaW5mb3JMaXN0JykuZmluZCgnaW1nJykucGFyZW50KCkuc2libGluZ3MoJy51cExvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHdpbmRvdy5waWNVcmxDdXIgPSBmYWxzZTtcclxuICAgICAgICAgICQoJyNydF8nICsgb2IuZmlsZS5zb3VyY2UucnVpZCkucGFyZW50cygnLmluZm9yTGlzdCcpLmZpbmQoJ2ltZycpLnBhcmVudCgpLnNpYmxpbmdzKCcudXBMb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1cGxvYWRlci5yZXNldCgpO1xyXG4gICAgICB9KTtcclxuICAgICAgdXBsb2FkZXIub24oJ3VwbG9hZEVycm9yJywgZnVuY3Rpb24gKGNvZGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhjb2RlKTtcclxuICAgICAgICAkKCcjcnRfJyArIGNvZGUuc291cmNlLnJ1aWQpLnBhcmVudHMoJy5pbmZvckxpc3QnKS5maW5kKCdpbWcnKS5wYXJlbnQoKS5zaWJsaW5ncygnLnVwTG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG5cclxuXHJcbiAgICAvKiog5bmz5Y+w55m75b2V5pa55rOVKG9hdXRoKeaWueazlSovXHJcbiAgICBmdW5jdGlvbiBvYXV0aExvZ2luKCkge1xyXG4gICAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICAgIGlmICh1cmwuaW5kZXhPZihcIiNwYWdlXCIpKSB7XHJcbiAgICAgICAgdXJsID0gdXJsLnNwbGl0KFwiI3BhZ2VcIilbMF07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHVybC5pbmRleE9mKFwiP1wiKSAhPSAtMSkge1xyXG4gICAgICAgIHVybCA9IHNlcnZpY2UucHJlZml4ICsgJy9sb2dpbj9yZWRpcmVjdFVybD0nICsgdXJsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVybCA9IHNlcnZpY2UucHJlZml4ICsgJy9sb2dpbj9yZWRpcmVjdFVybD0nICsgdXJsO1xyXG4gICAgICB9XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xyXG5cclxuICAgICAgLy93aW5kb3cubG9jYXRpb24uaHJlZiA9IHNlcnZpY2UucHJlZml4ICsgJy9sb2dpbic7XHJcbiAgICB9XHJcblxyXG4gICAgLy/nlKjmiLfnsbvlnotcclxuICAgIGZ1bmN0aW9uIGluZm9Vc2VyVHlwZSh0eXBlKSB7XHJcbiAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHJldHVybiAzO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgIHJldHVybiA0O1xyXG4gICAgICAgIGNhc2UgMzAxOlxyXG4gICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgY2FzZSAzMDA6XHJcbiAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICBjYXNlIDIwMDpcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIGNhc2UgMjAxOlxyXG4gICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy/kuIvmi4nmoYZcclxuICAgIGZ1bmN0aW9uIG1iU2VsZWN0KCkge1xyXG4gICAgICAvL+mAieaLqemhuSDpmpDol4/kuIvmi4nmoYZcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIi5tYlNlbGVjdFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XHJcbiAgICAgICAgdmFyIHRhciA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuICAgICAgICBpZiAoY2hhbmdlQ3VyICYmICQodGFyKS5wYXJlbnRzKCcuc3ViU2VsR2F0TGlzdCcpLnBhcmVudCgpLmF0dHIoJ2lkJykgIT0gJ3VzZXJTdWJqZWN0Jykge1xyXG4gICAgICAgICAgJCgnLnNlbGVjdC1ib3ggLnR5cGVzJykuaGlkZSgpO1xyXG4gICAgICAgICAgaWYgKCQodGFyKS5oYXNDbGFzcygnc2VsZWN0JykpIHtcclxuICAgICAgICAgICAgJChcIi5tYlNlbFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIGlmICgkKHRhcikucGFyZW50cygnLm1iU2VsZWN0JykuaGFzQ2xhc3MoJ3BoYXNlU2VsJykgJiYgJCh0YXIpLmF0dHIoJ2RhdGEtaWQnKSAhPSAkKHRhcikucGFyZW50cygnLm1iU2VsZWN0JykuZmluZCgnLnNlbFNob3cnKS5hdHRyKCdkYXRhLWlkJykpIHtcclxuICAgICAgICAgICAgICBpbml0U3ViamVjdCgkKHRhcikucGFyZW50cygnLnN1YlNlbEdhdCcpLmF0dHIoJ2lkJyksICQodGFyKS5hdHRyKCdkYXRhLWlkJyksIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKHRhcikucGFyZW50cygnLm1iU2VsZWN0JykuZmluZCgnLnNlbFNob3cnKS5odG1sKCQodGFyKS5odG1sKCkpLmF0dHIoJ2RhdGEtaWQnLCAkKHRhcikuYXR0cignZGF0YS1pZCcpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICgkKHRhcikuaGFzQ2xhc3MoJ3NlbFNob3cnKSkge1xyXG4gICAgICAgICAgICBpZiAoJCh0YXIpLnBhcmVudCgpLmZpbmQoXCIubWJTZWxcIikuY3NzKCdkaXNwbGF5JykgPT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgICAgJChcIi5tYlNlbFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgJCh0YXIpLnBhcmVudCgpLmZpbmQoXCIubWJTZWxcIikuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICQodGFyKS5wYXJlbnQoKS5maW5kKFwiLm1iU2VsXCIpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0pO1xyXG4gICAgICAvL+eCueWHu+S4i+epuueZveWkhO+8jOS4i+aLieahhua2iOWksVxyXG4gICAgICAkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcclxuICAgICAgICB2YXIgdGFyID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG4gICAgICAgICQoXCIubWJTZWxcIikuaGlkZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgLy/pmLvmraLlhpLms6FcclxuICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5tYlNlbGVjdCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWJTZWxlY3RTbWFpbGwgbGknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBwaWQgPSAkKHRoaXMpLnBhcmVudHMoJ2xpLmNsZWFyRml4JykuYXR0cignaWQnKSxcclxuICAgICAgICBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pZCcpO1xyXG4gICAgICAkKHRoaXMpLnBhcmVudHMoJy5tYlNlbGVjdFNtYWlsbCcpLmF0dHIoJ2RhdGEtaWQnLCBpZCk7XHJcbiAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCd0cmlnZ2VyJykpIHtcclxuICAgICAgICBmZXRjaEdyYWRlKHBpZCwgaWQpO1xyXG4gICAgICAgIGZldGNoU3ViamVjdChwaWQsIGlkKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy/lm77niYd1cmzmi7zmjqVcclxuICAgIGZ1bmN0aW9uIGdldFBpY1BhdGgoaWQpIHtcclxuICAgICAgcmV0dXJuIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnN1YnN0cmluZygwLCA0KSA9PT0gJ2h0dHAnID8gc2VydmljZS5wYXRoX3VybFsnZG93bmxvYWRfdXJsJ10ucmVwbGFjZSgnI3Jlc2lkIycsIGlkKSA6IChzZXJ2aWNlLnByZWZpeCArIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5peg5L+u5pS55oGi5aSN5pWw5o2uXHJcbiAgICBmdW5jdGlvbiBub0NoYW5nZSgpIHtcclxuICAgICAgY2hhbmdlQ3VyID0gZmFsc2U7XHJcbiAgICAgIGhhbmRsZUJpbmRlZCgpO1xyXG4gICAgICAkKCcuY29uTGVmdCAubW9kTWFyaycpLnJlbW92ZUNsYXNzKCdpY29uLXN0YXItcHNldWRvJyk7XHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmNlbk1hcmsnKS5yZW1vdmVDbGFzcygnY29uQ2hhbmdlJykuYXR0cih7J3JlYWRvbmx5JzogJ3JlYWRvbmx5JywgJ3Vuc2VsZWN0YWJsZSc6ICdvbid9KTtcclxuXHJcbiAgICAgICQoJy5wZXJDZW5CdG4gLnNhdmVCdG4sLmNhbmNlbEJ0bicpLmhpZGUoKTtcclxuICAgICAgJCgnLnBlckNlbkJ0biAuZWRpdEJ0bicpLnNob3coKTtcclxuICAgICAgJCgnI3VzZXJEdXR5IC5tYlNlbGVjdCcpLmhpZGUoKS5maW5kKCcuc2VsU2hvdycpLmh0bWwoJCgnI3VzZXJEdXR5IC5tYlNlbGVjdCtpbnB1dCcpLnZhbCgpKTtcclxuICAgICAgJCgnI3VzZXJEdXR5IC5tYlNlbGVjdCtpbnB1dCcpLnNob3coKTtcclxuICAgICAgJCgnI3NleEVkaXQgLm1iU2VsZWN0JykuaGlkZSgpLmZpbmQoJy5zZWxTaG93JykuaHRtbCgkKCcjc2V4RWRpdCAubWJTZWxlY3QraW5wdXQnKS52YWwoKSk7XHJcbiAgICAgICQoJyNzZXhFZGl0IC5tYlNlbGVjdCtpbnB1dCcpLnNob3coKTtcclxuXHJcbiAgICAgICQoJy5pbmZvckxpc3QgLnN1YlNlbEdhdCAubWJTZWxlY3QnKS5hZGRDbGFzcygnbWJOb1NlbGVjdCcpO1xyXG5cclxuICAgICAgJCgnLmNlbk1hcmsnKS5lYWNoKGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgJCgnLmNlbk1hcmsnKS5lcShpKS5hdHRyKCd2YWx1ZScsICQodGhpcykuYXR0cignZGF0YS1vbGQnKSkudmFsKCQodGhpcykuYXR0cignZGF0YS1vbGQnKSlcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5lZGl0SW1nJykuaGlkZSgpO1xyXG5cclxuICAgICAgJCgnLmFkZEl0ZW0sLmRlbGV0ZUl0ZW0nKS5oaWRlKCk7XHJcblxyXG4gICAgICAkKCcjdXNlclN1YmplY3QnKS5maW5kKCcuY3VyU3ViU2VsR2F0JykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAkKCcuc2V0VXNlclBpYyBpbWcnKS5hdHRyKCdzcmMnLCAkKCcuc2V0VXNlclBpYyBpbWcnKS5hdHRyKCdkYXRhLW9sZCcpKTtcclxuXHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmNsdWVzJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuXHJcbiAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuZU1haWxDb2RlJykuYWRkQ2xhc3MoJ2VNYWlsQ29kZUhpZGUnKTtcclxuICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmVNYWlsQ29kZScpLmFkZENsYXNzKCdlTWFpbENvZGVIaWRlJyk7XHJcbiAgICAgICQoJyNMb2dpbkVtYWlsQ29kZSwgI3NlY3VyaXR5Q29kZScpLmFkZENsYXNzKCdlTWFpbENvZGVIaWRlJykuZmluZCgnLmNvbkNlbicpLnZhbCgnJyk7XHJcblxyXG4gICAgICAkKCcuY2xhc3NJbmZvJykuc2hvdygpO1xyXG4gICAgICAkKCcuY2xhc3NJbmZvU2VsZWN0JykuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5pyJ5L+u5pS55L+u5pS55pWw5o2uXHJcbiAgICBmdW5jdGlvbiBjaGFuZ2UoKSB7XHJcbiAgICAgIGhhbmRsZUJpbmRlZCgpO1xyXG4gICAgICAkKCcuY29uTGVmdCAubW9kTWFyaycpLnJlbW92ZUNsYXNzKCdpY29uLXN0YXItcHNldWRvJyk7XHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmNlbk1hcmsnKS5yZW1vdmVDbGFzcygnY29uQ2hhbmdlJykuYXR0cih7J3JlYWRvbmx5JzogJ3JlYWRvbmx5JywgJ3Vuc2VsZWN0YWJsZSc6ICdvbid9KTtcclxuXHJcbiAgICAgICQoJy5wZXJDZW5CdG4gLnNhdmVCdG4sLmNhbmNlbEJ0bicpLmhpZGUoKTtcclxuICAgICAgJCgnLnBlckNlbkJ0biAuZWRpdEJ0bicpLnNob3coKTtcclxuICAgICAgJCgnI3VzZXJEdXR5IC5tYlNlbGVjdCcpLmhpZGUoKTtcclxuICAgICAgJCgnI3VzZXJEdXR5IC5tYlNlbGVjdCtpbnB1dCcpLnNob3coKTtcclxuICAgICAgJCgnI3NleEVkaXQgLm1iU2VsZWN0JykuaGlkZSgpO1xyXG4gICAgICAkKCcjc2V4RWRpdCAubWJTZWxlY3QraW5wdXQnKS5zaG93KCk7XHJcblxyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5zdWJTZWxHYXQgLm1iU2VsZWN0JykuYWRkQ2xhc3MoJ21iTm9TZWxlY3QnKTtcclxuXHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmVkaXRJbWcnKS5oaWRlKCk7XHJcblxyXG4gICAgICAkKCcuYWRkSXRlbSwuZGVsZXRlSXRlbScpLmhpZGUoKTtcclxuXHJcbiAgICAgICQoJyNzZXhFZGl0IGlucHV0JykudmFsKCQoJyNzZXhFZGl0IC5zZWxTaG93JykuaHRtbCgpKTtcclxuICAgICAgJCgnI3VzZXJEdXR5IGlucHV0JykudmFsKCQoJyN1c2VyRHV0eSAuc2VsU2hvdycpLmh0bWwoKSk7XHJcbiAgICAgICQoJyN1c2VyTmFtZWQgaW5wdXQnKS52YWwoJCgnI3VzZXJOYW1lZCAuc2VsU2hvdycpLmh0bWwoKSk7XHJcblxyXG4gICAgICAkKCcjdXNlclN1YmplY3QnKS5maW5kKCcuY3VyU3ViU2VsR2F0JykucmVtb3ZlQ2xhc3MoJ2N1clN1YlNlbEdhdCcpO1xyXG5cclxuICAgICAgJCgnI2JpcnRoZGF5U2hvdycpLmF0dHIoJ3ZhbHVlJywgJCgnI2JpcnRoZGF5U2VsJykudmFsKCkpO1xyXG4gICAgICAkKCcjYmlydGhkYXlTZWwnKS5oaWRlKCk7XHJcbiAgICAgICQoJyNiaXJ0aGRheVNob3cnKS5zaG93KCk7XHJcbiAgICAgICQoJy5jZW5NYXJrJykuZWFjaChmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIC8vIHRvb2xzLmxvZyhpKTtcclxuICAgICAgICAkKCcuY2VuTWFyaycpLmVxKGkpLmF0dHIoJ2RhdGEtb2xkJywgJCh0aGlzKS52YWwoKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKCcuc2V0QmFubmVyQmcgaW1nJykuYXR0cignZGF0YS1vbGQnLCAkKCcuc2V0QmFubmVyQmcgaW1nJykuYXR0cignc3JjJykpO1xyXG4gICAgICAkKCcuc2V0VXNlclBpYyBpbWcnKS5hdHRyKCdkYXRhLW9sZCcsICQoJy5zZXRVc2VyUGljIGltZycpLmF0dHIoJ3NyYycpKTtcclxuXHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmNsdWVzJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuXHJcbiAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuZU1haWxDb2RlJykuYWRkQ2xhc3MoJ2VNYWlsQ29kZUhpZGUnKTtcclxuICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmVNYWlsQ29kZScpLmFkZENsYXNzKCdlTWFpbENvZGVIaWRlJyk7XHJcbiAgICAgICQoJyNMb2dpbkVtYWlsQ29kZSwgI3NlY3VyaXR5Q29kZScpLmFkZENsYXNzKCdlTWFpbENvZGVIaWRlJykuZmluZCgnLmNvbkNlbicpLnZhbCgnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaGFuZGxlQmluZGVkKCkge1xyXG4gICAgICAkLmVhY2goJCgnLmJpbmRlZCcpLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICBpZiAoJChpdGVtKS5hdHRyKCdkYXRhLXNob3cnKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICBpZiAoJChpdGVtKS5wYXJlbnQoKS5hdHRyKCdpZCcpID09ICdzZWN1cml0eVBob25lJykge1xyXG4gICAgICAgICAgICAkKGl0ZW0pLnNpYmxpbmdzKCdpbnB1dCcpLmNzcygnd2lkdGgnLCAnYXV0bycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJChpdGVtKS5zaG93KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoaXRlbSkuaGlkZSgpO1xyXG4gICAgICAgICAgJChpdGVtKS5zaWJsaW5ncygnaW5wdXQnKS5jc3MoJ3dpZHRoJywgJzIzM3B4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVTZWxlY3QodGV4dCwgY2xhc3NTdWZmaXgpIHtcclxuICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwibWJTZWxlY3QgbWJTZWxlY3RTbWFpbGxcIiByZWFkb25seT4nICtcclxuICAgICAgICAnPHAgY2xhc3M9XCJzZWxTaG93XCI+JyArIHRleHQgKyAnPC9wPicgK1xyXG4gICAgICAgICc8dWwgY2xhc3M9XCJtYlNlbCBzZWxlY3RfJyArIGNsYXNzU3VmZml4ICsgJ1wiPicgK1xyXG4gICAgICAgICc8L3VsPicgK1xyXG4gICAgICAgICc8L2Rpdj4nXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmV0Y2hQaGFzZShpZCwgc3ViamVjdCkge1xyXG4gICAgICAkLmdldEpTT04oc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL21ldGEvb3JnUGhhc2U/b3JnSWQ9JyArIHBlcnNVc2VyWydvcmdJZCddLCBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgaWYgKHJlc1snY29kZSddID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSByZXNbJ2RhdGEnXVswXTtcclxuICAgICAgICAgICQuZWFjaChyZXNbJ2RhdGEnXSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtWyduYW1lJ10gPT09IHN1YmplY3QucGFoc2UpIHNlbGVjdGVkID0gaXRlbTtcclxuICAgICAgICAgICAgaHRtbCArPSAnPGxpIGNsYXNzPVwidHJpZ2dlclwiIGRhdGEtaWQ9XCInICsgaXRlbVsnaWQnXSArICdcIj48cCBjbGFzcz1cInNlbGVjdFwiPicgKyBpdGVtWyduYW1lJ10gKyAnPC9wPjwvbGk+JztcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgJCgnIycgKyBpZCArICcgLnNlbGVjdF9waGFzZScpLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAkKCcjJyArIGlkICsgJyAuc2VsZWN0X3BoYXNlJykucGFyZW50KCkuYXR0cignZGF0YS1pZCcsIHNlbGVjdGVkWydpZCddKTtcclxuICAgICAgICAgIGZldGNoR3JhZGUoaWQsIHNlbGVjdGVkWydpZCddLCBzdWJqZWN0LmdyYWRlKTtcclxuICAgICAgICAgIGZldGNoU3ViamVjdChpZCwgc2VsZWN0ZWRbJ2lkJ10sIHN1YmplY3Quc3ViamVjdCk7XHJcbiAgICAgICAgfSBlbHNlIGhhbmRsZUVycign5a2m5q615pWw5o2u6K+35rGC6ZSZ6K+v77yM6K+35Yi35paw6YeN6K+VJyk7XHJcbiAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICBoYW5kbGVFcnIoJ+WtpuauteaVsOaNruivt+axgumUmeivr++8jOivt+WIt+aWsOmHjeivlScpXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZldGNoR3JhZGUoaWQsIHBoYXNlSWQsIHRleHQpIHtcclxuICAgICAgJC5nZXRKU09OKHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9tZXRhL29yZ0dyYWRlP29yZ0lkPScgKyBwZXJzVXNlclsnb3JnSWQnXSArICcmcGhhc2VJZD0nICsgcGhhc2VJZCxcclxuICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzWydjb2RlJ10gPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSByZXNbJ2RhdGEnXVswXTtcclxuICAgICAgICAgICAgJC5lYWNoKHJlc1snZGF0YSddLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICBpZiAoaXRlbVsnbmFtZSddID09PSB0ZXh0KSBzZWxlY3RlZCA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgaHRtbCArPSAnPGxpIGRhdGEtaWQ9XCInICsgaXRlbVsnaWQnXSArICdcIj48cCBjbGFzcz1cInNlbGVjdFwiPicgKyBpdGVtWyduYW1lJ10gKyAnPC9wPjwvbGk+JztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJyMnICsgaWQgKyAnIC5zZWxlY3RfZ3JhZGUnKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAkKCcjJyArIGlkICsgJyAuc2VsZWN0X2dyYWRlJykucGFyZW50KCkuYXR0cignZGF0YS1pZCcsIHNlbGVjdGVkWydpZCddKTtcclxuICAgICAgICAgIH0gZWxzZSBoYW5kbGVFcnIoJ+W5tOe6p+aVsOaNruivt+axgumUmeivr++8jOivt+WIt+aWsOmHjeivlScpO1xyXG4gICAgICAgIH1cclxuICAgICAgKS5lcnJvcihmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgaGFuZGxlRXJyKCflubTnuqfmlbDmja7or7fmsYLplJnor6/vvIzor7fliLfmlrDph43or5UnKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmZXRjaFN1YmplY3QoaWQsIHBoYXNlSWQsIHRleHQpIHtcclxuICAgICAgJC5nZXRKU09OKHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9tZXRhL29yZ1N1YmplY3Q/b3JnSWQ9JyArIHBlcnNVc2VyWydvcmdJZCddICsgJyZwaGFzZUlkPScgKyBwaGFzZUlkLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgIGlmIChyZXNbJ2NvZGUnXSA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9IHJlc1snZGF0YSddWzBdO1xyXG4gICAgICAgICAgICAkLmVhY2gocmVzWydkYXRhJ10sIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICAgIGlmIChpdGVtWyduYW1lJ10gPT09IHRleHQpIHNlbGVjdGVkID0gaXRlbTtcclxuICAgICAgICAgICAgICBodG1sICs9ICc8bGkgZGF0YS1pZD1cIicgKyBpdGVtWydpZCddICsgJ1wiPjxwIGNsYXNzPVwic2VsZWN0XCI+JyArIGl0ZW1bJ25hbWUnXSArICc8L3A+PC9saT4nO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnIycgKyBpZCArICcgLnNlbGVjdF9zdWJqZWN0JykuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgJCgnIycgKyBpZCArICcgLnNlbGVjdF9zdWJqZWN0JykucGFyZW50KCkuYXR0cignZGF0YS1pZCcsIHNlbGVjdGVkWydpZCddKTtcclxuICAgICAgICAgIH0gZWxzZSBoYW5kbGVFcnIoJ+WtpuenkeaVsOaNruivt+axgumUmeivr++8jOivt+WIt+aWsOmHjeivlScpO1xyXG4gICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICBoYW5kbGVFcnIoJ+WtpuenkeaVsOaNruivt+axgumUmeivr++8jOivt+WIt+aWsOmHjeivlScpXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZUVycihtc2cpIHtcclxuICAgICAgbGF5ZXIuYWxlcnQobXNnLCB7aWNvbjogMH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8v6Ieq5a6a55So5oi357G75Z6LXHJcbiAgICB2YXIgVVNFUlRZUEUgPSB7XHJcbiAgICAgIE5PTkU6IDAsXHJcbiAgICAgIERJU1RSSUNUOiAxLFxyXG4gICAgICBURUFDSEVSOiAyLFxyXG4gICAgICBTVFVERU5UOiAzLFxyXG4gICAgICBQQVJFTlQ6IDRcclxuICAgIH07XHJcbiAgICAvL+eUqOaIt+S/oeaBr+WtmOWCqFxyXG4gICAgdmFyIHBlcnNVc2VyID0gbmV3IE9iamVjdCgpO1xyXG4gICAgLy/ovpPlhaXnirbmgIE65Y6f5aeL5a+G56CB44CB5paw5a+G56CB44CB5YaN5a+G56CB44CB5aeT5ZCN44CB6IGU57O755S16K+d44CB6aqM6K+B55S15a2Q6YKu566x44CB5a626ZW/55S16K+d44CB5qCh6aqM56CB44CB5omL5py65Y+357uR5a6a55qE5omL5py65Y+3XHJcbiAgICB2YXIgcHdkQ3VyID0gWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdO1xyXG4gICAgLy/nvJbovpHmgIHliKTmlq1cclxuICAgIHZhciBjaGFuZ2VDdXIgPSBmYWxzZTtcclxuICAgIC8v6YCJ6aG56buY6K6kYmFzaWNJbmZvclxyXG4gICAgdmFyIHNlbGVjdFR5cGUgPSAnYmFzaWNJbmZvcic7XHJcbiAgICAvL+WIneWni+WMluS4i+aLieahhlxyXG4gICAgbWJTZWxlY3QoKTtcclxuXHJcbiAgICAvL+aVsOaNruWIneWni+WMllxyXG4gICAgJC5hamF4KHtcclxuICAgICAgdHlwZTogXCJnZXRcIixcclxuICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi91Yy9pbmZvJyxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICBpZiAoZGF0YS5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgZGF0YSA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgIHBlcnNVc2VyLm9yZ0lkID0gZGF0YS5hY2NvdW50Lm9yZ0lkO1xyXG4gICAgICAgICAgLy/pgJrnlKhcclxuICAgICAgICAgIHBlcnNVc2VyLnVzZXJUeXBlID0gaW5mb1VzZXJUeXBlKGRhdGEuYWNjb3VudC51c2VyVHlwZSk7XHJcbiAgICAgICAgICAvLyBkYXRhLmFjY291bnQudXNlckluZm8ucGhvdG89ZGF0YS5hY2NvdW50LnVzZXJJbmZvLnBob3RvfHwnJztcclxuICAgICAgICAgIGlmIChwZXJzVXNlci51c2VyVHlwZSA9PSBVU0VSVFlQRS5TVFVERU5UKSB7XHJcbiAgICAgICAgICAgIHBlcnNVc2VyLnBob3RvID0gZGF0YS5hY2NvdW50LnVzZXJJbmZvLnBob3RvID8gZ2V0UGljUGF0aChkYXRhLmFjY291bnQudXNlckluZm8ucGhvdG8pIDogJ2ltYWdlcy9zdHVkZW50UGljLnBuZyc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwZXJzVXNlci5waG90byA9IGRhdGEuYWNjb3VudC51c2VySW5mby5waG90byA/IGdldFBpY1BhdGgoZGF0YS5hY2NvdW50LnVzZXJJbmZvLnBob3RvKSA6ICdpbWFnZXMvdGVhY2hlclBpYy5wbmcnO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHBlcnNVc2VyLm5hbWUgPSBkYXRhLmFjY291bnQudXNlckluZm8ubmFtZSB8fCAnJztcclxuICAgICAgICAgIHB3ZEN1clszXSA9IHBlcnNVc2VyLm5hbWUgPyAxIDogMDtcclxuICAgICAgICAgIHBlcnNVc2VyLmFjY291bnQgPSBkYXRhLmFjY291bnQuYWNjb3VudDtcclxuICAgICAgICAgIHBlcnNVc2VyLnNleCA9IGRhdGEuYWNjb3VudC51c2VySW5mby5zZXggPT0gMSA/ICfnlLcnIDogJ+Wlsyc7XHJcbiAgICAgICAgICBwZXJzVXNlci50ZWxlcGhvbmUgPSBkYXRhLmFjY291bnQudXNlckluZm8udGVsZXBob25lIHx8ICcnO1xyXG4gICAgICAgICAgcHdkQ3VyWzRdID0gcGVyc1VzZXIudGVsZXBob25lID8gMSA6IDA7XHJcbiAgICAgICAgICBkYXRhLmFjY291bnQuZW1haWwgPSBkYXRhLmFjY291bnQuZW1haWwgfHwgJyc7XHJcbiAgICAgICAgICBwZXJzVXNlci5lbWFpbCA9IGRhdGEuYWNjb3VudC5lbWFpbCB8fCBkYXRhLmFjY291bnQudXNlckluZm8uZW1haWw7XHJcbiAgICAgICAgICBwZXJzVXNlci5ib3VuZEVtYWlsID0gZGF0YS5hY2NvdW50LmVtYWlsO1xyXG4gICAgICAgICAgcGVyc1VzZXIuYm91bmRQaG9uZSA9IChkYXRhLmFjY291bnQuY2VsbHBob25lICYmIGRhdGEuYWNjb3VudC5jZWxscGhvbmUgIT0gLTEpID8gZGF0YS5hY2NvdW50LmNlbGxwaG9uZSA6ICcnO1xyXG4gICAgICAgICAgcHdkQ3VyWzVdID0gcGVyc1VzZXIuYm91bmRFbWFpbCA/IDEgOiAwO1xyXG4gICAgICAgICAgcHdkQ3VyWzhdID0gcGVyc1VzZXIuYm91bmRQaG9uZSA/IDEgOiAwO1xyXG5cclxuICAgICAgICAgIGlmIChwZXJzVXNlci5ib3VuZEVtYWlsKSB7XHJcbiAgICAgICAgICAgICQoJyN1c2VyRW1haWwnKS5maW5kKCcuY29uQ2VuJykucmVtb3ZlQ2xhc3MoJ2Nlbk1hcmsnKTtcclxuICAgICAgICAgICAgJCgnI3VzZXJFbWFpbCcpLmZpbmQoJy5jbHVlcycpLmh0bWwoJ+WmgumcgOS/ruaUueivt+WIsOOAkOe7keWumuS/oeaBr+OAkeS4rei/m+ihjOS/ruaUuScpLmFkZENsYXNzKCdidWxlJyk7XHJcbiAgICAgICAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuYmluZGVkJykuYXR0cignZGF0YS1zaG93JywgJ3RydWUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChwZXJzVXNlci5ib3VuZFBob25lKSB7XHJcbiAgICAgICAgICAgICQoJyNzZWN1cml0eVBob25lIC5iaW5kZWQnKS5hdHRyKCdkYXRhLXNob3cnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICQoJy5wZXJDZW5TZWxlY3QgLnVzZXJMb2dvQ2VuIC5sb2dvSW1nJykuYXR0cignc3JjJywgcGVyc1VzZXIucGhvdG8pO1xyXG4gICAgICAgICAgJCgnLnBlckNlblNlbGVjdCAudXNlckxvZ28gLnVzZXJOYW1lJykuaHRtbChwZXJzVXNlci5uYW1lKTtcclxuICAgICAgICAgICQoJyN1c2VyTG9nbyAuVXNlclBpY0ltZyBpbWcnKS5hdHRyKHsnc3JjJzogcGVyc1VzZXIucGhvdG8sICdkYXRhLW9sZCc6IHBlcnNVc2VyLnBob3RvfSk7XHJcbiAgICAgICAgICAkKCcjdXNlck5hbWUnKS5maW5kKCcuY29uQ2VuJykuYXR0cih7J2RhdGEtb2xkJzogcGVyc1VzZXIubmFtZSwgJ3ZhbHVlJzogcGVyc1VzZXIubmFtZX0pO1xyXG4gICAgICAgICAgJCgnI3VzZXJOdW0nKS5maW5kKCcuY29uQ2VuJykuYXR0cih7J3ZhbHVlJzogcGVyc1VzZXIuYWNjb3VudH0pO1xyXG4gICAgICAgICAgJCgnI3NleEVkaXQnKS5maW5kKCcuY29uQ2VuJykuYXR0cih7J2RhdGEtb2xkJzogcGVyc1VzZXIuc2V4LCAndmFsdWUnOiBwZXJzVXNlci5zZXh9KTtcclxuICAgICAgICAgICQoJyNzZXhFZGl0JykuZmluZCgnLnNlbFNob3cnKS5odG1sKHBlcnNVc2VyLnNleCk7XHJcbiAgICAgICAgICAkKCcjdXNlclBob25lJykuZmluZCgnLmNvbkNlbicpLmF0dHIoeydkYXRhLW9sZCc6IHBlcnNVc2VyLnRlbGVwaG9uZSwgJ3ZhbHVlJzogcGVyc1VzZXIudGVsZXBob25lfSk7XHJcbiAgICAgICAgICAkKCcjdXNlckVtYWlsJykuZmluZCgnLmNvbkNlbicpLmF0dHIoeydkYXRhLW9sZCc6IHBlcnNVc2VyLmVtYWlsLCAndmFsdWUnOiBwZXJzVXNlci5lbWFpbH0pO1xyXG4gICAgICAgICAgaWYgKCFwZXJzVXNlci5ib3VuZEVtYWlsKSB7XHJcbiAgICAgICAgICAgICQoJy5wZXJDZW5Db24gLmluZm9yQ2hhbmdlIC5wZXJDZW5CdG4gLmVkaXRCdG4nKS5odG1sKCfnu5Hlrprpgq7nrrEnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCFwZXJzVXNlci5ib3VuZFBob25lKSB7XHJcbiAgICAgICAgICAgICQoJy5wZXJDZW5Db24gLnNlY3VyaXR5VmVyaWZpY2F0aW9uIC5wZXJDZW5CdG4gLmVkaXRCdG4nKS5odG1sKCfnu5HlrprmiYvmnLrlj7cnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsJykuZmluZCgnLmNvbkNlbicpLmF0dHIoe1xyXG4gICAgICAgICAgICAnZGF0YS1vbGQnOiBwZXJzVXNlci5ib3VuZEVtYWlsLFxyXG4gICAgICAgICAgICAndmFsdWUnOiBwZXJzVXNlci5ib3VuZEVtYWlsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJyNzZWN1cml0eVBob25lJykuZmluZCgnLmNvbkNlbicpLmF0dHIoe1xyXG4gICAgICAgICAgICAnZGF0YS1vbGQnOiBwZXJzVXNlci5ib3VuZFBob25lLFxyXG4gICAgICAgICAgICAndmFsdWUnOiBwZXJzVXNlci5ib3VuZFBob25lXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAocGVyc1VzZXIudXNlclR5cGUgPT0gVVNFUlRZUEUuRElTVFJJQ1QpIHtcclxuICAgICAgICAgICAgJCgnLmJhc2ljSW5mb3InKS5maW5kKCcjc3R1R3JhZGUsI3N0dUNsYXNzLCNzdHVTY2hOdW0sI3Blck5hbWUsI3BlclBob25lJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICBwZXJzVXNlci5vcmdOYW1lID0gZGF0YS5hY2NvdW50LnVzZXJJbmZvLm9yZ05hbWUgfHwgJyc7XHJcbiAgICAgICAgICAgIHBlcnNVc2VyLnVzZXJTdWJqZWN0ID0gZGF0YS5yb2xlcyB8fCAnJztcclxuICAgICAgICAgICAgJCgnI3VzZXJVbml0JykuZmluZCgnLmNvbkNlbicpLmF0dHIoeydkYXRhLW9sZCc6IHBlcnNVc2VyLm9yZ05hbWUsICd2YWx1ZSc6IHBlcnNVc2VyLm9yZ05hbWV9KTtcclxuICAgICAgICAgICAgcGVyc1VzZXIuc3ViamVjdFN0ciA9ICcnO1xyXG4gICAgICAgICAgICAkLmVhY2gocGVyc1VzZXIudXNlclN1YmplY3QsIGZ1bmN0aW9uIChpbmRleCwgc3ViamVjdCkge1xyXG4gICAgICAgICAgICAgIHN1YmplY3QucGhhc2UgPSBzdWJqZWN0LnBoYXNlIHx8ICcnO1xyXG4gICAgICAgICAgICAgIHN1YmplY3Quc3ViamVjdCA9IHN1YmplY3Quc3ViamVjdCB8fCAnJztcclxuICAgICAgICAgICAgICBzdWJqZWN0LnJvbGUgPSBzdWJqZWN0LnJvbGUgfHwgJyc7XHJcbiAgICAgICAgICAgICAgcGVyc1VzZXIuc3ViamVjdFN0ciArPSAnPGxpIGNsYXNzPVwiY2xlYXJGaXhcIj4nICtcclxuICAgICAgICAgICAgICAgICc8c3Bhbj4nICsgc3ViamVjdC5yb2xlICsgJzwvc3Bhbj4nICtcclxuICAgICAgICAgICAgICAgICc8c3Bhbj4nICsgc3ViamVjdC5waGFzZSArICc8L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAnPHNwYW4+JyArIHN1YmplY3Quc3ViamVjdCArICc8L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9saT4nXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcjdXNlclN1YmplY3QnKS5maW5kKCcuY2xhc3NJbmZvJykuaHRtbChwZXJzVXNlci5zdWJqZWN0U3RyKTtcclxuXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHBlcnNVc2VyLnVzZXJUeXBlID09IFVTRVJUWVBFLlRFQUNIRVIpIHtcclxuICAgICAgICAgICAgJCgnLmJhc2ljSW5mb3InKS5maW5kKCcjc3R1R3JhZGUsI3N0dUNsYXNzLCNzdHVTY2hOdW0sI3Blck5hbWUsI3BlclBob25lJykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICBwZXJzVXNlci5vcmdOYW1lID0gZGF0YS5hY2NvdW50LnVzZXJJbmZvLm9yZ05hbWUgfHwgJyc7XHJcbiAgICAgICAgICAgIHBlcnNVc2VyLnVzZXJTdWJqZWN0ID0gZGF0YS5yb2xlcyB8fCAnJztcclxuICAgICAgICAgICAgJCgnI3VzZXJVbml0JykuZmluZCgnLmNvbkNlbicpLmF0dHIoeydkYXRhLW9sZCc6IHBlcnNVc2VyLm9yZ05hbWUsICd2YWx1ZSc6IHBlcnNVc2VyLm9yZ05hbWV9KTtcclxuICAgICAgICAgICAgcGVyc1VzZXIuc3ViamVjdFN0ciA9ICcnO1xyXG4gICAgICAgICAgICBwZXJzVXNlci5zdWJqZWN0U3RyU2VsZWN0ID0gJyc7XHJcbiAgICAgICAgICAgICQuZWFjaChwZXJzVXNlci51c2VyU3ViamVjdCwgZnVuY3Rpb24gKGluZGV4LCBzdWJqZWN0KSB7XHJcbiAgICAgICAgICAgICAgc3ViamVjdC5waGFzZSA9IHN1YmplY3QucGhhc2UgfHwgJyc7XHJcbiAgICAgICAgICAgICAgc3ViamVjdC5ncmFkZSA9IHN1YmplY3QuZ3JhZGUgfHwgJyc7XHJcbiAgICAgICAgICAgICAgc3ViamVjdC5zdWJqZWN0ID0gc3ViamVjdC5zdWJqZWN0IHx8ICcnO1xyXG4gICAgICAgICAgICAgIHN1YmplY3Qucm9sZSA9IHN1YmplY3Qucm9sZSB8fCAnJztcclxuICAgICAgICAgICAgICBwZXJzVXNlci5zdWJqZWN0U3RyICs9ICc8bGkgY2xhc3M9XCJjbGVhckZpeFwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxzcGFuPicgKyBzdWJqZWN0LnJvbGUgKyAnPC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgJzxzcGFuPicgKyBzdWJqZWN0LnBoYXNlICsgJzwvc3Bhbj4nICtcclxuICAgICAgICAgICAgICAgICc8c3Bhbj4nICsgc3ViamVjdC5ncmFkZSArICc8L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAnPHNwYW4+JyArIHN1YmplY3Quc3ViamVjdCArICc8L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9saT4nXHJcbiAgICAgICAgICAgICAgcGVyc1VzZXIuc3ViamVjdFN0clNlbGVjdCArPSAnPGxpIGNsYXNzPVwiY2xlYXJGaXhcIiBkYXRhLXJvbGU9XCInICsgc3ViamVjdFsnaWQnXSArICdcIiBpZD1cInNlbGVjdCcgKyBpbmRleCArICdcIj4nICtcclxuICAgICAgICAgICAgICAgICc8c3Bhbj4nICsgc3ViamVjdC5yb2xlICsgJzwvc3Bhbj4nICtcclxuICAgICAgICAgICAgICAgIChzdWJqZWN0LnJvbGVJbmZvLnNob3dQaGFzZSA/IGNyZWF0ZVNlbGVjdChzdWJqZWN0LnBoYXNlLCAncGhhc2UnKSA6ICcnKSArXHJcbiAgICAgICAgICAgICAgICAoc3ViamVjdC5yb2xlSW5mby5zaG93R3JhZGUgPyBjcmVhdGVTZWxlY3Qoc3ViamVjdC5ncmFkZSwgJ2dyYWRlJykgOiAnJykgK1xyXG4gICAgICAgICAgICAgICAgKHN1YmplY3Qucm9sZUluZm8uc2hvd1N1YmplY3QgPyBjcmVhdGVTZWxlY3Qoc3ViamVjdC5zdWJqZWN0LCAnc3ViamVjdCcpIDogJycpICtcclxuICAgICAgICAgICAgICAgICc8L2xpPic7XHJcbiAgICAgICAgICAgICAgLypmZXRjaFBoYXNlKCdzZWxlY3QnICsgaW5kZXgsIHN1YmplY3QpOyovXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcjdXNlclN1YmplY3QnKS5maW5kKCcuY2xhc3NJbmZvJykuaHRtbChwZXJzVXNlci5zdWJqZWN0U3RyKVxyXG4gICAgICAgICAgICAkKCcjdXNlclN1YmplY3QnKS5maW5kKCcuY2xhc3NJbmZvU2VsZWN0JykuaHRtbChwZXJzVXNlci5zdWJqZWN0U3RyU2VsZWN0KVxyXG5cclxuICAgICAgICAgIH0gZWxzZSBpZiAocGVyc1VzZXIudXNlclR5cGUgPT0gVVNFUlRZUEUuU1RVREVOVCkge1xyXG4gICAgICAgICAgICAkKCcuYmFzaWNJbmZvcicpLmZpbmQoJyN1c2VyVW5pdCwjdXNlckR1dHksI3VzZXJTdWJqZWN0LCNzdHVDbGFzcycpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgcGVyc1VzZXIuc3R1ZGVudENvZGUgPSBkYXRhLmFjY291bnQudXNlckluZm8uc3R1ZGVudENvZGU7XHJcbiAgICAgICAgICAgIHBlcnNVc2VyLnBhcmVudHNOYW1lID0gZGF0YS5hY2NvdW50LnVzZXJJbmZvLnBhcmVudHNOYW1lO1xyXG4gICAgICAgICAgICBwZXJzVXNlci5wYXJlbnRzUGhvbmUgPSBkYXRhLmFjY291bnQudXNlckluZm8ucGFyZW50c1Bob25lO1xyXG4gICAgICAgICAgICAkKCcjc3R1U2NoTnVtJykuZmluZCgnLmNvbkNlbicpLmF0dHIoeyd2YWx1ZSc6IHBlcnNVc2VyLnN0dWRlbnRDb2RlfSk7XHJcbiAgICAgICAgICAgICQoJyNwZXJOYW1lJykuZmluZCgnLmNvbkNlbicpLmF0dHIoeyd2YWx1ZSc6IHBlcnNVc2VyLnBhcmVudHNOYW1lfSk7XHJcbiAgICAgICAgICAgICQoJyNwZXJQaG9uZScpLmZpbmQoJy5jb25DZW4nKS5hdHRyKHtcclxuICAgICAgICAgICAgICAnZGF0YS1vbGQnOiBwZXJzVXNlci5wYXJlbnRzUGhvbmUsXHJcbiAgICAgICAgICAgICAgJ3ZhbHVlJzogcGVyc1VzZXIucGFyZW50c1Bob25lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwd2RDdXJbNl0gPSBwZXJzVXNlci5wYXJlbnRzUGhvbmUgPyAxIDogMDtcclxuICAgICAgICAgIH0gZWxzZSBpZiAocGVyc1VzZXIudXNlclR5cGUgPT0gVVNFUlRZUEUuUEFSRU5UKSB7XHJcbiAgICAgICAgICAgICQoJy5iYXNpY0luZm9yJykuZmluZCgnI3VzZXJVbml0LCN1c2VyRHV0eSwjdXNlclN1YmplY3QsI3N0dUdyYWRlLCNzdHVDbGFzcywjc3R1U2NoTnVtLCNwZXJOYW1lLCNwZXJQaG9uZScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICQoJy5wZXJDZW5Db24gLmJhc2ljSW5mb3InKS5yZW1vdmVDbGFzcygnZU1haWxDb2RlSGlkZScpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRhdGEuY29kZSA9PSAnbG9naW5fZXJyb3InKSB7XHJcbiAgICAgICAgICBsYXllci5hbGVydCgn55So5oi35bey6L+H5pyf77yM6K+36YeN5paw55m75b2VJywge2ljb246IDB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG9hdXRoTG9naW4oKVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxheWVyLmFsZXJ0KCfkv6Hmga/liJ3lp4vljJblpLHotKXvvIzor7fliLfmlrDpobXpnaLph43or5XvvIEnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgbGF5ZXIuYWxlcnQoJ+S/oeaBr+WIneWni+WMluWksei0pe+8jOivt+WIt+aWsOmhtemdoumHjeivle+8gScsIHtpY29uOiAwfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8v6LWE5paZ57yW6L6RL+S/neWtmC/lj5bmtojnirbmgIHliIfmjaJcclxuICAgICQoJy5lZGl0QnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY2hhbmdlQ3VyID0gdHJ1ZTtcclxuICAgICAgJCgnLmJpbmRlZCcpLmhpZGUoKTtcclxuICAgICAgJCgnLmJpbmRlZCcpLnNpYmxpbmdzKCdpbnB1dCcpLmNzcygnd2lkdGgnLCAnMjMzcHgnKTtcclxuICAgICAgJCgnLmluZm9yTGlzdCAubW9kTWFyaycpLmFkZENsYXNzKCdpY29uLXN0YXItcHNldWRvJyk7XHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmNlbk1hcmsnKS5hZGRDbGFzcygnY29uQ2hhbmdlJykucmVtb3ZlQXR0cigncmVhZG9ubHkgdW5zZWxlY3RhYmxlJyk7XHJcblxyXG4gICAgICAkKCcucGVyQ2VuQnRuIC5zYXZlQnRuLC5jYW5jZWxCdG4nKS5jc3MoJ2Rpc3BsYXknLCAnaW5saW5lLWJsb2NrJyk7XHJcbiAgICAgICQoJy5wZXJDZW5CdG4gLmVkaXRCdG4nKS5oaWRlKCk7XHJcblxyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5tYlNlbGVjdCcpLnNob3coKTtcclxuICAgICAgJCgnLmluZm9yTGlzdCAubWJTZWxlY3QraW5wdXQnKS5oaWRlKCk7XHJcblxyXG5cclxuICAgICAgJCgnLmluZm9yTGlzdCAuZWRpdEltZycpLnNob3coKTtcclxuXHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmNsdWVzJykuc2hvdygpO1xyXG5cclxuICAgICAgJCgnI2VkaXRJbWcyJykuZmluZCgnZGl2JykuZXEoMSkuY3NzKHsnd2lkdGgnOiAnMTAwJScsICdoZWlnaHQnOiAnMTAwJSd9KTtcclxuXHJcbiAgICAgIC8vIOiBjOWKoeS/oeaBr1xyXG4gICAgICAkKCcuY2xhc3NJbmZvJykuaGlkZSgpO1xyXG4gICAgICAkKCcuY2xhc3NJbmZvU2VsZWN0Jykuc2hvdygpO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdFR5cGUgPT0gJ2luZm9yQ2hhbmdlJykge1xyXG4gICAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuZU1haWxDb2RlJykucmVtb3ZlQ2xhc3MoJ2VNYWlsQ29kZUhpZGUgZU1haWxDb2RlRm9yYmlkJyk7XHJcbiAgICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmVNYWlsQ29kZScpLnJlbW92ZUNsYXNzKCdlTWFpbENvZGVIaWRlIGVNYWlsQ29kZUZvcmJpZCcpO1xyXG4gICAgICAgICQoJyNMb2dpbkVtYWlsQ29kZSwgI3NlY3VyaXR5Q29kZScpLnJlbW92ZUNsYXNzKCdlTWFpbENvZGVIaWRlJykuZmluZCgnLmNvbkNlbicpLnZhbCgnJyk7XHJcbiAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5jbHVlcycpLmh0bWwoJycpLmNzcygnY29sb3InLCAnI2ZmZicpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHNlbGVjdFR5cGUgPT09ICdzZWN1cml0eVZlcmlmaWNhdGlvbicpIHtcclxuICAgICAgICAkKCcjc2VjdXJpdHlDb2RlIC5lTWFpbENvZGUnKS5yZW1vdmVDbGFzcygnZU1haWxDb2RlSGlkZSBlTWFpbENvZGVGb3JiaWQnKTtcclxuICAgICAgICAkKCcjc2VjdXJpdHlQaG9uZSAuZU1haWxDb2RlJykucmVtb3ZlQ2xhc3MoJ2VNYWlsQ29kZUhpZGUgZU1haWxDb2RlRm9yYmlkJyk7XHJcbiAgICAgICAgJCgnI3NlY3VyaXR5Q29kZScpLnJlbW92ZUNsYXNzKCdlTWFpbENvZGVIaWRlJykuZmluZCgnLmNvbkNlbicpLnZhbCgnJyk7XHJcbiAgICAgICAgJCgnI3NlY3VyaXR5Q29kZSAuY2x1ZXMnKS5odG1sKCcnKS5jc3MoJ2NvbG9yJywgJyNmZmYnKVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICQoJy5jYW5jZWxCdG4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBub0NoYW5nZSgpO1xyXG4gICAgICAvLyAkKCcjc2V4RWRpdCBpbnB1dCcpLnZhbCgkKCcjc2V4RWRpdCAuc2VsU2hvdycpLmh0bWwoKSlcclxuICAgIH0pO1xyXG4gICAgJCgnLnNhdmVCdG4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBpZiAoc2VsZWN0VHlwZSAhPSAnaW5mb3JDaGFuZ2UnKSB7XHJcbiAgICAgICAgJCgnLmluZm9yTGlzdCAuY2x1ZXMnKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8v5Z+65pys5L+h5oGv5L+d5a2YXHJcbiAgICAgIGlmIChzZWxlY3RUeXBlID09ICdiYXNpY0luZm9yJykge1xyXG4gICAgICAgIGlmIChwd2RDdXJbM10gPT0gMCkge1xyXG4gICAgICAgICAgJCgnI3VzZXJOYW1lJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaCqOeahOWnk+WQjScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHB3ZEN1cls0XSA9PSAwKSB7XHJcbiAgICAgICAgICAkKCcjdXNlclBob25lJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaCqOeahOiBlOezu+eUteivnScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHB3ZEN1cls2XSA9PSAwICYmIHBlcnNVc2VyLnVzZXJUeXBlID09IFVTRVJUWVBFLlNUVURFTlQpIHtcclxuICAgICAgICAgICQoJyNwZXJQaG9uZScpLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXlrrbplb/nmoTogZTns7vnlLXor50nKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICgkKCcjdXNlckVtYWlsJykuZmluZCgnLmNsdWVzJykuaGFzQ2xhc3MoJ3JlZCcpKSB7XHJcbiAgICAgICAgICAkKCcjdXNlckVtYWlsJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+aCqOi+k+WFpeeahOeUteWtkOmCrueuseS4jeato+ehricpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHVwSW5mb09iaiA9IHt9O1xyXG4gICAgICAgICAgdXBJbmZvT2JqLm5hbWUgPSAkKCcjdXNlck5hbWUnKS5maW5kKCcuY29uQ2VuJykudmFsKCk7XHJcbiAgICAgICAgICB1cEluZm9PYmouc2V4ID0gJCgnI3NleEVkaXQnKS5maW5kKCcuc2VsU2hvdycpLmh0bWwoKSA9PSAn55S3JyA/IDEgOiAyO1xyXG4gICAgICAgICAgdXBJbmZvT2JqLnRlbGVwaG9uZSA9ICQoJyN1c2VyUGhvbmUnKS5maW5kKCcuY29uQ2VuJykudmFsKCk7XHJcbiAgICAgICAgICB1cEluZm9PYmouZW1haWwgPSAkKCcjdXNlckVtYWlsJykuZmluZCgnLmNvbkNlbicpLnZhbCgpO1xyXG4gICAgICAgICAgaWYgKHBlcnNVc2VyLnVzZXJUeXBlID09IFVTRVJUWVBFLlNUVURFTlQpIHtcclxuICAgICAgICAgICAgdXBJbmZvT2JqLnBhcGVyc051bWJlciA9ICQoJyNwZXJQaG9uZScpLmZpbmQoJy5jb25DZW4nKS52YWwoKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIOiBjOWKoeS/oeaBr1xyXG4gICAgICAgICAgdXBJbmZvT2JqLnVzZXJSb2xlcyA9IFtdO1xyXG4gICAgICAgICAgJC5lYWNoKCQoJyN1c2VyU3ViamVjdCcpLmZpbmQoJy5jbGFzc0luZm9TZWxlY3QgLmNsZWFyRml4JyksIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgcm9sZUlkID0gJChpdGVtKS5hdHRyKCdkYXRhLXJvbGUnKTtcclxuICAgICAgICAgICAgdmFyIHBoYXNlSWQgPSAkKGl0ZW0pLmZpbmQoJy5zZWxlY3RfcGhhc2UnKS5wYXJlbnQoKS5hdHRyKCdkYXRhLWlkJyksXHJcbiAgICAgICAgICAgICAgZ3JhZGVJZCA9ICQoaXRlbSkuZmluZCgnLnNlbGVjdF9ncmFkZScpLnBhcmVudCgpLmF0dHIoJ2RhdGEtaWQnKSxcclxuICAgICAgICAgICAgICBzdWJqZWN0SWQgPSAkKGl0ZW0pLmZpbmQoJy5zZWxlY3Rfc3ViamVjdCcpLnBhcmVudCgpLmF0dHIoJ2RhdGEtaWQnKTtcclxuICAgICAgICAgICAgdXBJbmZvT2JqW1widXNlclJvbGVzW1wiICsgaW5kZXggKyBcIl0uaWRcIl0gPSByb2xlSWQ7XHJcbiAgICAgICAgICAgIHVwSW5mb09ialtcInVzZXJSb2xlc1tcIiArIGluZGV4ICsgXCJdLnBoYXNlSWRcIl0gPSBwaGFzZUlkO1xyXG4gICAgICAgICAgICB1cEluZm9PYmpbXCJ1c2VyUm9sZXNbXCIgKyBpbmRleCArIFwiXS5ncmFkZUlkXCJdID0gZ3JhZGVJZDtcclxuICAgICAgICAgICAgdXBJbmZvT2JqW1widXNlclJvbGVzW1wiICsgaW5kZXggKyBcIl0uc3ViamVjdElkXCJdID0gc3ViamVjdElkO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvdXBJbmZvJyxcclxuICAgICAgICAgICAgZGF0YTogdXBJbmZvT2JqLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgPT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydCgn5Z+65pys6LWE5paZ5L+u5pS55oiQ5YqfJywge2ljb246IDB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkKCcucGVyQ2VuU2VsZWN0IC51c2VyTG9nbyAudXNlck5hbWUnKS5odG1sKHVwSW5mb09iai5uYW1lKTtcclxuICAgICAgICAgICAgICAgICQoJyNsb2dpbl9tZXNzYWdlIC5sb2dpbl91c2VybmFtZScpLmh0bWwodXBJbmZvT2JqLm5hbWUgKyAnPHNwYW4gY2xhc3M9XCJhcnJvd1wiPjwvc3Bhbj4nKTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn5Z+65pys6LWE5paZ5L+u5pS55aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIOWuieWFqOmqjOivgVxyXG4gICAgICBlbHNlIGlmIChzZWxlY3RUeXBlID09ICdzZWN1cml0eVZlcmlmaWNhdGlvbicpIHtcclxuICAgICAgICBpZiAocHdkQ3VyWzddID09IDApICQoJyNzZWN1cml0eUNvZGUnKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl6aqM6K+B56CBJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL3VjL3ZlcmlmeU1vYmlsZScsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBtb2JpbGU6ICQoJyNzZWN1cml0eVBob25lIGlucHV0JykudmFsKCkudHJpbSgpLFxyXG4gICAgICAgICAgICAgIGNvZGU6ICQoJyNzZWN1cml0eUNvZGUgaW5wdXQnKS52YWwoKS50cmltKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgIGlmIChyZXNbJ2NvZGUnXSA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydCgn5omL5py65Y+357uR5a6a5oiQ5YqfJywge2ljb246IDB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGxheWVyLmFsZXJ0KCfmiYvmnLrlj7fnu5HlrprlpLHotKXvvIzor7fliLfmlrDpobXpnaLlkI7ph43or5XvvIEnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfmiYvmnLrlj7fnu5HlrprlpLHotKXvvIzor7fliLfmlrDpobXpnaLlkI7ph43or5XvvIEnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIC8v5aS05YOP5L+d5a2YXHJcbiAgICAgIGVsc2UgaWYgKHNlbGVjdFR5cGUgPT0gJ3NldFVzZXJMb2dvJykge1xyXG4gICAgICAgIGlmICh3aW5kb3cucGljVXJsQ3VyKSB7XHJcbiAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi91Yy91cGRhdGVQaG90bycsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAncGhvdG8nOiB3aW5kb3cucGljVXJsSWRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+WktOWDj+S/ruaUueaIkOWKnycsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgICAkKCcucGVyQ2VuU2VsZWN0IC51c2VyTG9nb0NlbiAubG9nb0ltZycpLmF0dHIoJ3NyYycsICQoJyN1c2VyTG9nbyAuVXNlclBpY0ltZyBpbWcnKS5hdHRyKCdzcmMnKSk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2UoKVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn5aS05YOP5L+u5pS55aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5vQ2hhbmdlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIC8v57uR5a6a5L+h5oGv5L+d5a2YXHJcbiAgICAgIGVsc2UgaWYgKHNlbGVjdFR5cGUgPT0gJ2luZm9yQ2hhbmdlJykge1xyXG4gICAgICAgIGlmIChwd2RDdXJbNV0gIT0gMSkge1xyXG4gICAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5jbHVlcycpLnNob3coKS5odG1sKCfmgqjovpPlhaXnmoTnlLXlrZDpgq7nrrHkuI3mraPnoa4nKS5hZGRDbGFzcygncmVkJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvdmVyaWZ5TWFpbCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAnbWFpbEFkZHJlc3MnOiAkKCcjdXNlckxvZ2luRW1haWwgaW5wdXQnKS52YWwoKSxcclxuICAgICAgICAgICAgICAnY29kZSc6ICQoJyNMb2dpbkVtYWlsQ29kZSBpbnB1dCcpLnZhbCgpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnu5Hlrprpgq7nrrHkv67mlLnmiJDlip8nLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgICAgJCgnLnBlckNlbkNvbiAuaW5mb3JDaGFuZ2UgLnBlckNlbkJ0biAuZWRpdEJ0bicpLmh0bWwoJ+abtOaNoumCrueusScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3VzZXJFbWFpbCcpLmZpbmQoJy5jb25DZW4nKS5yZW1vdmVDbGFzcygnY2VuTWFyayBjb25DaGFuZ2UnKS52YWwoJCgnI3VzZXJMb2dpbkVtYWlsIGlucHV0JykudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3VzZXJFbWFpbCcpLmZpbmQoJy5jbHVlcycpLmh0bWwoJ+WmgumcgOS/ruaUueivt+WIsOOAkOe7keWumuS/oeaBr+OAkeS4rei/m+ihjOS/ruaUuScpLmFkZENsYXNzKCdidWxlJyk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIC8vICQoJyN1c2VyTG9naW5FbWFpbCAuY2x1ZXMnKS5odG1sKCfpqozor4HnoIHlt7Llj5HpgIHvvIzor7fnmbvlvZXpgq7nrrHmn6XnnIsnKS5jc3MoJ2NvbG9yJywnIzFjZDY3NycpXHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNvZGUgPT0gJ2ZhaWxlZCcpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfpqozor4HnoIHplJnor68nLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+e7keWumumCrueuseS/ruaUueWksei0pScsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn57uR5a6a6YKu566x5L+u5pS55aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gICAgLy/lr4bnoIHkv67mlLlcclxuICAgICQoJy5wYXNzV29yZCAucHdkU2F2ZUJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGlmIChwd2RDdXJbMF0gPT0gMSAmJiBwd2RDdXJbMV0gPT0gMSAmJiBwd2RDdXJbMl0gPT0gMSkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvdXBkYXRlUGFzJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgJ29sZFBhcyc6ICQoJyNwcmlDb2RlIGlucHV0JykudmFsKCksXHJcbiAgICAgICAgICAgICduZXdQYXMnOiAkKCcjbmV3UHdkIGlucHV0JykudmFsKClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCflr4bnoIHkv67mlLnmiJDlip8nLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgIC8v5L+u5pS55oiQ5Yqf5ZCO5omn6KGMXHJcbiAgICAgICAgICAgICAgJCgnLnBlckNlbkNvbiAucGFzc1dvcmQgLmNvbkNlbicpLmF0dHIoJ3ZhbHVlJywgJycpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgJCgnLnBlckNlbkNvbiAucGFzc1dvcmQgLmNsdWVzJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuY29kZSA9PSAnbG9naW5fZXJyb3InKSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+eUqOaIt+W3sui/h+acn++8jOivt+mHjeaWsOeZu+W9lScsIHtpY29uOiAwfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+WvhueggeS/ruaUueWksei0pe+8jOivt+WIt+aWsOmhtemdouWQjumHjeivle+8gScsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocHdkQ3VyWzBdICE9IDEpIHtcclxuICAgICAgICAkKCcjcHJpQ29kZScpLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXljp/lr4bnoIEnKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAocHdkQ3VyWzFdICE9IDEpIHtcclxuICAgICAgICAvLyAkKCcjbmV3UHdkJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaWsOWvhueggScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgfSBlbHNlIGlmIChwd2RDdXJbMl0gIT0gMSkge1xyXG4gICAgICAgIGlmICgkKCcjYWdhaW5OZXdQd2QgaW5wdXQnKS52YWwoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAkKCcjYWdhaW5OZXdQd2QnKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5Lik5qyh6L6T5YWl5a+G56CB5LiN5LiA6Ie0JykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKCcjYWdhaW5OZXdQd2QnKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl56Gu6K6k5a+G56CBJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvL+mCrueusemqjOivgeeggeWPkemAgVxyXG4gICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5lTWFpbENvZGUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgICB2YXIgdGFyID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG4gICAgICBpZiAocHdkQ3VyWzVdID09IDEpIHtcclxuICAgICAgICBpZiAoISQodGFyKS5oYXNDbGFzcygnZU1haWxDb2RlRm9yYmlkJykpIHtcclxuICAgICAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuY2x1ZXMnKS5odG1sKCfpgq7ku7bmraPlnKjlj5HpgIHkuK0uLi4nKS5zaG93KCkuY3NzKCdjb2xvcicsICcjMWNkNjc3Jyk7XHJcbiAgICAgICAgICAkKCcjdXNlckxvZ2luRW1haWwgLmNvbkNlbicpLmF0dHIoeydyZWFkb25seSc6ICdyZWFkb25seScsICd1bnNlbGVjdGFibGUnOiAnb24nfSk7XHJcbiAgICAgICAgICAkKHRhcikuYWRkQ2xhc3MoJ2VNYWlsQ29kZUZvcmJpZCcpO1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvbWFpbFNlbmQnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgJ21haWxBZGRyZXNzJzogJCgnI3VzZXJMb2dpbkVtYWlsIGlucHV0JykudmFsKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5jbHVlcycpLmh0bWwoJ+mqjOivgeeggeW3suWPkemAge+8jOivt+eZu+W9lemCrueuseafpeeciycpLnNob3coKS5jc3MoJ2NvbG9yJywgJyMxY2Q2NzcnKVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuY2x1ZXMnKS5odG1sKCfpqozor4HnoIHlj5HpgIHlpLHotKUnKS5zaG93KCkuY3NzKCdjb2xvcicsICdyZWQnKVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydCgn6aqM6K+B56CB5Y+R6YCB5aSx6LSlJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgICAgICQodGFyKS5yZW1vdmVDbGFzcygnZU1haWxDb2RlRm9yYmlkJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjdXNlckxvZ2luRW1haWwgLmNvbkNlbicpLnJlbW92ZUF0dHIoJ3JlYWRvbmx5IHVuc2VsZWN0YWJsZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5jbHVlcycpLmh0bWwoZGF0YS5tc2cgfHwgJ+mqjOivgeeggeWPkemAgeWksei0pScpLnNob3coKS5jc3MoJ2NvbG9yJywgJ3JlZCcpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn6aqM6K+B56CB5Y+R6YCB5aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGFyKS5wYXJlbnQoKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl5oKo55qE55S15a2Q6YKu566xJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIOaJi+acuumqjOivgeeggeWPkemAgVxyXG4gICAgJCgnLnNlY3VyaXR5VmVyaWZpY2F0aW9uIC5lTWFpbENvZGUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgICB2YXIgdGFyID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG4gICAgICB2YXIgbW9iaWxlID0gJCgnI3NlY3VyaXR5UGhvbmUgaW5wdXQnKS52YWwoKS50cmltKCk7XHJcbiAgICAgIGlmIChwd2RDdXJbOF0gPT0gMSkge1xyXG4gICAgICAgIGlmICghJCh0YXIpLmhhc0NsYXNzKCdlTWFpbENvZGVGb3JiaWQnKSkge1xyXG4gICAgICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmNsdWVzJykuaHRtbCgn6aqM6K+B56CB5q2j5Zyo5Y+R6YCB5LitLi4uJykuc2hvdygpLmNzcygnY29sb3InLCAnIzFjZDY3NycpO1xyXG4gICAgICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmNvbkNlbicpLmF0dHIoeydyZWFkb25seSc6ICdyZWFkb25seScsICd1bnNlbGVjdGFibGUnOiAnb24nfSk7XHJcbiAgICAgICAgICAkKHRhcikuYWRkQ2xhc3MoJ2VNYWlsQ29kZUZvcmJpZCcpO1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvc2VuZE1vYmlsZUNvZGUnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgJ21vYmlsZSc6IG1vYmlsZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgPT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjc2VjdXJpdHlQaG9uZSAuY2x1ZXMnKS5odG1sKCfpqozor4HnoIHlt7Llj5HpgIHvvIzor7fms6jmhI/mn6XmlLYnKS5zaG93KCkuY3NzKCdjb2xvcicsICcjMWNkNjc3Jyk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNvZGUgPT0gJ2xvZ2luX2Vycm9yJykge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+eUqOaIt+W3sui/h+acn++8jOivt+mHjeaWsOeZu+W9lScsIHtpY29uOiAwfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICBvYXV0aExvZ2luKClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmNsdWVzJykuaHRtbCgn6aqM6K+B56CB5Y+R6YCB5aSx6LSlJykuc2hvdygpLmNzcygnY29sb3InLCAncmVkJylcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+mqjOivgeeggeWPkemAgeWksei0pScsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgICAkKHRhcikucmVtb3ZlQ2xhc3MoJ2VNYWlsQ29kZUZvcmJpZCcpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmNsdWVzJykuaHRtbCgn6aqM6K+B56CB5Y+R6YCB5aSx6LSlJykuc2hvdygpLmNzcygnY29sb3InLCAncmVkJylcclxuICAgICAgICAgICAgICAgICQoJyNzZWN1cml0eVBob25lIC5jb25DZW4nKS5yZW1vdmVBdHRyKCdyZWFkb25seSB1bnNlbGVjdGFibGUnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICQoJyNzZWN1cml0eVBob25lIC5jbHVlcycpLmh0bWwoJ+mqjOivgeeggeWPkemAgeWksei0pScpLnNob3coKS5jc3MoJ2NvbG9yJywgJ3JlZCcpXHJcbiAgICAgICAgICAgICAgJCh0YXIpLnJlbW92ZUNsYXNzKCdlTWFpbENvZGVGb3JiaWQnKTtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn6aqM6K+B56CB5Y+R6YCB5aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBtc2cgPSAn6K+36L6T5YWl5oKo55qE5omL5py65Y+3JztcclxuICAgICAgICBpZiAobW9iaWxlICE9ICcnICYmICEvXjFbMzQ1NzhdXFxkezl9JC8udGVzdChtb2JpbGUpKSB7XHJcbiAgICAgICAgICBtc2cgPSAn5omL5py65Y+356CB5qC85byP5LiN5q2j56GuJztcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh0YXIpLnBhcmVudCgpLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKG1zZykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgLy/pgInpobnljaHliIfmjaJcclxuICAgICQoJy5wZXJDZW5TZWxlY3QgLnNlbExpc3QnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgICB2YXIgdGFyID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG4gICAgICB2YXIgdGFyUCA9ICQodGFyKS5oYXNDbGFzcygnc2VsTGlzdCcpID8gJCh0YXIpIDogJCh0YXIpLnBhcmVudCgpO1xyXG4gICAgICBzZWxlY3RUeXBlID0gJCh0YXJQKS5hdHRyKCdkYXRhX3R5cGUnKTtcclxuICAgICAgdGFyUC5hZGRDbGFzcygnc2VsZWN0Jykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2VsZWN0Jyk7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLmJhc2ljSW5mb3IsIC5zZWN1cml0eVZlcmlmaWNhdGlvbiwgLnNldFVzZXJMb2dvLCAucGFzc1dvcmQsIC5pbmZvckNoYW5nZScpLmhpZGUoKTtcclxuICAgICAgJCgnLnBlckNlbkNvbiAuY2VuQ29uVGl0bGUnKS5odG1sKCQodGFyUCkuZmluZCgncCcpLmh0bWwoKSk7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLicgKyBzZWxlY3RUeXBlKS5zaG93KCk7XHJcbiAgICAgIG5vQ2hhbmdlKCk7XHJcbiAgICAgIGlmIChzZWxlY3RUeXBlID09ICdwYXNzV29yZCcpIHtcclxuICAgICAgICBjaGFuZ2VDdXIgPSB0cnVlO1xyXG4gICAgICAgICQoJy5wZXJDZW5Db24gLnBhc3NXb3JkIC5jb25DZW4nKS52YWwoJycpO1xyXG4gICAgICAgIHB3ZEN1clswXSA9IDA7XHJcbiAgICAgICAgcHdkQ3VyWzFdID0gMDtcclxuICAgICAgICBwd2RDdXJbMl0gPSAwO1xyXG4gICAgICB9XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLnN1YlRpdGxlJykuaGlkZSgpLnJlbW92ZUNsYXNzKCdjdXJyJyk7XHJcbiAgICAgIGlmIChzZWxlY3RUeXBlID09PSAnaW5mb3JDaGFuZ2UnKSB7XHJcbiAgICAgICAgJCgnLnBlckNlbkNvbiAuY2VuQ29uVGl0bGUnKS5odG1sKCfpgq7nrrHnu5HlrponKTtcclxuICAgICAgICAkKCcucGVyQ2VuQ29uIC5jZW5Db25UaXRsZScpLmFkZENsYXNzKCdjZW5Db25UaXRsZTEnKTtcclxuICAgICAgICAkKCcucGVyQ2VuQ29uIC5zdWJUaXRsZScpLnNob3coKTtcclxuICAgICAgICAvLyDpgInlrprnu5Hlrprpgq7nrrFcclxuICAgICAgICAkKCcucGVyQ2VuQ29uIC5jZW5Db25UaXRsZScpLmFkZENsYXNzKCdjdXJyJyk7XHJcbiAgICAgICAgJCgnLnBlckNlbkNvbiAuaW5mb3JDaGFuZ2UnKS5zaG93KCk7XHJcbiAgICAgICAgJCgnLnBlckNlbkNvbiAuc2VjdXJpdHlWZXJpZmljYXRpb24nKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOe7keWumuS/oeaBr3RhYuWIh+aNolxyXG4gICAgJCgnLnBlckNlbkNvbicpLm9uKCdjbGljaycsICcuY2VuQ29uVGl0bGUxLCAuc3ViVGl0bGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIG5vQ2hhbmdlKCk7XHJcbiAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnY3VycicpO1xyXG4gICAgICAkKHRoaXMpLmFkZENsYXNzKCdjdXJyJyk7XHJcblxyXG4gICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnY2VuQ29uVGl0bGUnKSkge1xyXG4gICAgICAgIHNlbGVjdFR5cGUgPSAnaW5mb3JDaGFuZ2UnO1xyXG4gICAgICAgICQoJy5wZXJDZW5Db24gLmluZm9yQ2hhbmdlJykuc2hvdygpO1xyXG4gICAgICAgICQoJy5wZXJDZW5Db24gLnNlY3VyaXR5VmVyaWZpY2F0aW9uJykuaGlkZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICghcGVyc1VzZXIuYm91bmRQaG9uZSkgJCgnLnNlY3VyaXR5VmVyaWZpY2F0aW9uIC5lZGl0QnRuJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICBzZWxlY3RUeXBlID0gJ3NlY3VyaXR5VmVyaWZpY2F0aW9uJztcclxuICAgICAgICAkKCcucGVyQ2VuQ29uIC5pbmZvckNoYW5nZScpLmhpZGUoKTtcclxuICAgICAgICAkKCcucGVyQ2VuQ29uIC5zZWN1cml0eVZlcmlmaWNhdGlvbicpLnNob3coKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrlronlhajpqozor4FcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2hvd1NlY3VyaXR5KCkge1xyXG4gICAgICBzZWxlY3RUeXBlID0gJ3NlY3VyaXR5VmVyaWZpY2F0aW9uJztcclxuICAgICAgJCgnLnBlckNlbkNvbiAuY2VuQ29uVGl0bGUnKS5odG1sKCflronlhajpqozor4EnKTtcclxuICAgICAgJCgnLnBlckNlbkNvbiAuYmFzaWNJbmZvcicpLmhpZGUoKTtcclxuICAgICAgJCgnLnBlckNlbkNvbiAuc2VjdXJpdHlWZXJpZmljYXRpb24nKS5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5a6J5YWo6aqM6K+B5Y+W5raIXHJcbiAgICAkKCcuY2FuY2VsQnRuMScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZWN0VHlwZSA9ICdiYXNpY0luZm9yJztcclxuICAgICAgJCgnLnBlckNlbkNvbiAuY2VuQ29uVGl0bGUnKS5odG1sKCfln7rmnKzotYTmlpknKTtcclxuICAgICAgJCgnLnBlckNlbkNvbiAuYmFzaWNJbmZvcicpLnNob3coKTtcclxuICAgICAgJCgnLnBlckNlbkNvbiAuc2VjdXJpdHlWZXJpZmljYXRpb24nKS5oaWRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL2lucHV05pON5L2cXHJcbiAgICAkKGRvY3VtZW50KS5vbignYmx1cicsICcucGVyQ2VuQ29uIC5jb25DZW4nLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgICB2YXIgdGFyID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG4gICAgICB2YXIgdGFyUCA9ICQodGFyKS5wYXJlbnQoKTtcclxuICAgICAgdmFyIHRhclZhbCA9ICQodGFyKS52YWwoKS50cmltKCk7XHJcbiAgICAgIGlmIChjaGFuZ2VDdXIpIHtcclxuICAgICAgICBpZiAodGFyUC5hdHRyKCdpZCcpID09ICd1c2VyTmFtZScpIHtcclxuICAgICAgICAgIGlmICh0YXJWYWwubWF0Y2goJ15bQS1aYS16MC05XFx1NGUwMC1cXHU5ZmE1XSskJykpIHtcclxuICAgICAgICAgICAgcHdkQ3VyWzNdID0gMTtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5oaWRlKCkuaHRtbCgn6K+36L6T5YWl5oKo55qE5aeT5ZCNJykucmVtb3ZlQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0YXJWYWwgPT0gJycpIHtcclxuICAgICAgICAgICAgcHdkQ3VyWzNdID0gMDtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl5oKo55qE5aeT5ZCNJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcHdkQ3VyWzNdID0gMDtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5oKo6L6T5YWl55qE5aeT5ZCN5LiN5q2j56GuJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyUC5hdHRyKCdpZCcpID09PSAnc2VjdXJpdHlQaG9uZScpIHtcclxuICAgICAgICAgIGlmICgvXjFbMzQ1NzhdXFxkezl9JC8udGVzdCh0YXJWYWwpKSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls4XSA9IDE7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuaGlkZSgpLmh0bWwoJ+aJi+acuuWPt+eggeagvOW8j+S4jeato+ehricpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGFyVmFsID09ICcnKSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls4XSA9IDA7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaCqOeahOaJi+acuuWPtycpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls4XSA9IDA7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+aJi+acuuWPt+eggeagvOW8j+S4jeato+ehricpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRhclAuYXR0cignaWQnKSA9PSAnc2VjdXJpdHlDb2RlJykge1xyXG4gICAgICAgICAgaWYgKHRhclZhbCkge1xyXG4gICAgICAgICAgICBwd2RDdXJbN10gPSAxO1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLmhpZGUoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls3XSA9IDA7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpemqjOivgeeggScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRhclAuYXR0cignaWQnKSA9PSAndXNlclBob25lJykge1xyXG4gICAgICAgICAgaWYgKC9eKFxcKFxcZHszLDR9XFwpfFxcZHszLDR9LXxcXHMpP1xcZHs3LDE0fSQvLnRlc3QodGFyVmFsKSB8fCAvXjFbMzQ1NzhdXFxkezl9JC8udGVzdCh0YXJWYWwpKSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls0XSA9IDE7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuaGlkZSgpLmh0bWwoJ+ivt+i+k+WFpeiBlOezu+eUteivnScpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGFyVmFsID09ICcnKSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls0XSA9IDE7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuaGlkZSgpLmh0bWwoJ+ivt+i+k+WFpeiBlOezu+eUteivnScpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls0XSA9IDA7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+aCqOi+k+WFpeeahOiBlOezu+eUteivneS4jeato+ehricpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRhclAuYXR0cignaWQnKSA9PSAncGVyUGhvbmUnKSB7XHJcbiAgICAgICAgICBpZiAoL14oXFwoXFxkezMsNH1cXCl8XFxkezMsNH0tfFxccyk/XFxkezcsMTR9JC8udGVzdCh0YXJWYWwpIHx8IC9eMVszNDU3OF1cXGR7OX0kLy50ZXN0KHRhclZhbCkpIHtcclxuICAgICAgICAgICAgcHdkQ3VyWzZdID0gMTtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5oaWRlKCkuaHRtbCgn6K+36L6T5YWl6IGU57O755S16K+dJykucmVtb3ZlQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0YXJWYWwgPT0gJycpIHtcclxuICAgICAgICAgICAgcHdkQ3VyWzZdID0gMDtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl6IGU57O755S16K+dJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcHdkQ3VyWzZdID0gMDtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5oKo6L6T5YWl55qE6IGU57O755S16K+d5LiN5q2j56GuJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyUC5hdHRyKCdpZCcpID09ICd1c2VyRW1haWwnIHx8IHRhclAuYXR0cignaWQnKSA9PSAndXNlckxvZ2luRW1haWwnKSB7XHJcbiAgICAgICAgICBpZiAoJCgnI3VzZXJMb2dpbkVtYWlsIC5lTWFpbENvZGUnKS5oYXNDbGFzcygnZU1haWxDb2RlRm9yYmlkJykgJiYgc2VsZWN0VHlwZSA9PSAnaW5mb3JDaGFuZ2UnKSB7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRhclZhbC5tYXRjaCgnXlswLTlhLXpBLVpdK0AoKFswLTlhLXpBLVpdKylbLl0pK1thLXpdezIsNH0kJykpIHtcclxuICAgICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLmhpZGUoKS5odG1sKCfor7fovpPlhaXmgqjnmoTnlLXlrZDpgq7nrrEnKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgICAgcHdkQ3VyWzVdID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJWYWwgIT0gJycpIHtcclxuICAgICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfmgqjovpPlhaXnmoTnlLXlrZDpgq7nrrHkuI3mraPnoa4nKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgICAgcHdkQ3VyWzVdID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXmgqjnmoTnlLXlrZDpgq7nrrEnKS5jc3MoJ2NvbG9yJywgJ3JlZCcpO1xyXG4gICAgICAgICAgICAgIHB3ZEN1cls1XSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJQLmF0dHIoJ2lkJykgPT0gJ3ByaUNvZGUnKSB7XHJcbiAgICAgICAgICBpZiAodGFyVmFsLm1hdGNoKCdeXFxcXFN7NiwyMH0kJykpIHtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5oaWRlKCkuaHRtbCgn6K+36L6T5YWl5oKo55qE5Y6f5aeL5a+G56CBJykucmVtb3ZlQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICBwd2RDdXJbMF0gPSAxO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0YXJWYWwgPT0gJycpIHtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl5Y6f5a+G56CBJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICBwd2RDdXJbMF0gPSAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5oKo6L6T5YWl55qE5Y6f5a+G56CB5LiN5q2j56GuJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICBwd2RDdXJbMF0gPSAwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyUC5hdHRyKCdpZCcpID09ICduZXdQd2QnKSB7XHJcbiAgICAgICAgICBpZiAodGFyVmFsLm1hdGNoKCdeXFxcXFN7NiwyMH0kJykpIHtcclxuICAgICAgICAgICAgaWYgKHRhclZhbCAhPSAkKCcjYWdhaW5OZXdQd2QnKS5maW5kKCdpbnB1dCcpLnZhbCgpICYmIHB3ZEN1clsyXSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgJCgnI2FnYWluTmV3UHdkJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+S4pOasoei+k+WFpeWvhueggeS4jeS4gOiHtCcpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgICAgICBwd2RDdXJbMl0gPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRhclZhbCA9PSAkKCcjYWdhaW5OZXdQd2QnKS5maW5kKCdpbnB1dCcpLnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgJCgnI2FnYWluTmV3UHdkJykuZmluZCgnLmNsdWVzJykuaGlkZSgpLmh0bWwoJ+S4pOasoei+k+WFpeWvhueggeS4jeS4gOiHtCcpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuICAgICAgICAgICAgICBwd2RDdXJbMl0gPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuaGlkZSgpLmh0bWwoJzYtMjDkvY3lrZfnrKbvvIzlu7rorq7mlbDlrZfjgIHlrZfmr43jgIHmoIfngrnnrKblj7fnu4TlkIgnKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgIHB3ZEN1clsxXSA9IDE7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRhclZhbCA9PSAnJykge1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXmlrDlr4bnoIEnKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgIHB3ZEN1clsxXSA9IDA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCc2LTIw5L2N5a2X56ym77yM5bu66K6u5pWw5a2X44CB5a2X5q+N44CB5qCH54K556ym5Y+357uE5ZCIJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICBwd2RDdXJbMV0gPSAwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyUC5hdHRyKCdpZCcpID09ICdhZ2Fpbk5ld1B3ZCcpIHtcclxuICAgICAgICAgIGlmICh0YXJWYWwubWF0Y2goJ15cXFxcU3s2LDIwfSQnKSkge1xyXG4gICAgICAgICAgICBpZiAodGFyVmFsICE9ICQoJyNuZXdQd2QnKS5maW5kKCdpbnB1dCcpLnZhbCgpKSB7XHJcbiAgICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5Lik5qyh6L6T5YWl5a+G56CB5LiN5LiA6Ie0JykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICAgIGlmIChwd2RDdXJbMV0gPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcHdkQ3VyWzJdID0gMDtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHdkQ3VyWzJdID0gMTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuaGlkZSgpLmh0bWwoJ+ivt+i+k+WFpeehruiupOWvhueggScpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuICAgICAgICAgICAgICBwd2RDdXJbMl0gPSAxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAodGFyVmFsID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeWGjeasoei+k+WFpeaWsOWvhueggScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgICAgcHdkQ3VyWzJdID0gMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+S4pOasoei+k+WFpeWvhueggeS4jeS4gOiHtCcpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgICAgcHdkQ3VyWzJdID0gMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5wZXJDZW5Db24gLmNvbkNlbicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XHJcbiAgICAgIHZhciB0YXIgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XHJcbiAgICAgIHZhciB0YXJQID0gJCh0YXIpLnBhcmVudCgpO1xyXG4gICAgICBpZiAoc2VsZWN0VHlwZSAhPSAnaW5mb3JDaGFuZ2UnKSB7XHJcbiAgICAgICAgJCh0YXJQKS5maW5kKCcuY2x1ZXMnKS5oaWRlKCkucmVtb3ZlQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gIH0pO1xyXG59KVxyXG5cclxuIl19
