'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  },
  enforeDefine: true
});
require(['platformConf'], function (configpaths) {
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
              fetchPhase('select' + index, subject);
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
        $('#userLoginEmail .clues').html('');
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
        mailValidate($("#userLoginEmail .conCen").val().trim(), $("#userLoginEmail"));
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
            mailValidate(tarVal, tarP);
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

    function mailValidate(tarVal, tarP) {
      if (tarVal.match('^[0-9a-zA-Z]+@(([0-9a-zA-Z]+)[.])+[a-z]{2,4}$')) {
        tarP.find('.clues').hide().html('').removeClass('red');
        pwdCur[5] = 1;
      } else if (tarVal != '') {
        tarP.find('.clues').show().html('您输入的电子邮箱不正确').addClass('red');
        pwdCur[5] = 0;
      } else {
        tarP.find('.clues').show().html('请输入您的电子邮箱').addClass('red');
        pwdCur[5] = 0;
      }
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlcnNDZW50ZXIvanMvcGVyc0NlbnRlci5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiZW5mb3JlRGVmaW5lIiwiY29uZmlncGF0aHMiLCIkIiwidG9vbHMiLCJoZWFkZXIiLCJmb290ZXIiLCJzZXJ2aWNlIiwiV2ViVXBsb2FkZXIiLCJsYXllciIsInRlbXBsYXRlIiwiZ2V0UGljUGF0aCIsImlkIiwicGF0aF91cmwiLCJzdWJzdHJpbmciLCJwcmVmaXgiLCJyZXBsYWNlIiwidXBsb2FkVXJsIiwiaHRtbEhvc3QiLCJ1cGxvYWRlciIsImNyZWF0ZSIsInN3ZiIsImFjY2VwdCIsInRpdGxlIiwiZXh0ZW5zaW9ucyIsIm1pbWVUeXBlcyIsInNlcnZlciIsImZpbGVOdW1MaW1pdCIsInBpY2siLCJmaWxlU2l6ZUxpbWl0IiwiZmlsZVNpbmdsZVNpemVMaW1pdCIsIm9uIiwiZmlsZSIsIndpbmRvdyIsInBpY1VybElkIiwic291cmNlIiwicnVpZCIsInBhcmVudHMiLCJmaW5kIiwicGFyZW50Iiwic2libGluZ3MiLCJzaG93IiwidXBsb2FkIiwib2IiLCJyZXQiLCJkYXRhIiwia2V5IiwiY29kZSIsImNvbnNvbGUiLCJsb2ciLCJhdHRyIiwicGljVXJsQ3VyIiwiaGlkZSIsInJlc2V0Iiwib2F1dGhMb2dpbiIsInVybCIsImxvY2F0aW9uIiwiaHJlZiIsImluZGV4T2YiLCJzcGxpdCIsImluZm9Vc2VyVHlwZSIsInR5cGUiLCJtYlNlbGVjdCIsImRvY3VtZW50IiwiZSIsImV2ZW50IiwidGFyIiwidGFyZ2V0Iiwic3JjRWxlbWVudCIsImNoYW5nZUN1ciIsImhhc0NsYXNzIiwiaW5pdFN1YmplY3QiLCJodG1sIiwiY3NzIiwic3RvcFByb3BhZ2F0aW9uIiwicGlkIiwiZmV0Y2hHcmFkZSIsImZldGNoU3ViamVjdCIsIm5vQ2hhbmdlIiwiaGFuZGxlQmluZGVkIiwicmVtb3ZlQ2xhc3MiLCJ2YWwiLCJhZGRDbGFzcyIsImVhY2giLCJpIiwiZXEiLCJyZW1vdmUiLCJjaGFuZ2UiLCJpbmRleCIsIml0ZW0iLCJjcmVhdGVTZWxlY3QiLCJ0ZXh0IiwiY2xhc3NTdWZmaXgiLCJmZXRjaFBoYXNlIiwic3ViamVjdCIsImdldEpTT04iLCJwZXJzVXNlciIsInJlcyIsInNlbGVjdGVkIiwicGFoc2UiLCJncmFkZSIsImhhbmRsZUVyciIsImVycm9yIiwiZXJyIiwicGhhc2VJZCIsIm1zZyIsImFsZXJ0IiwiaWNvbiIsIlVTRVJUWVBFIiwiTk9ORSIsIkRJU1RSSUNUIiwiVEVBQ0hFUiIsIlNUVURFTlQiLCJQQVJFTlQiLCJPYmplY3QiLCJwd2RDdXIiLCJzZWxlY3RUeXBlIiwiYWpheCIsInN1Y2Nlc3MiLCJvcmdJZCIsImFjY291bnQiLCJ1c2VyVHlwZSIsInBob3RvIiwidXNlckluZm8iLCJuYW1lIiwic2V4IiwidGVsZXBob25lIiwiZW1haWwiLCJib3VuZEVtYWlsIiwiYm91bmRQaG9uZSIsImNlbGxwaG9uZSIsIm9yZ05hbWUiLCJ1c2VyU3ViamVjdCIsInJvbGVzIiwic3ViamVjdFN0ciIsInBoYXNlIiwicm9sZSIsInN1YmplY3RTdHJTZWxlY3QiLCJyb2xlSW5mbyIsInNob3dQaGFzZSIsInNob3dHcmFkZSIsInNob3dTdWJqZWN0Iiwic3R1ZGVudENvZGUiLCJwYXJlbnRzTmFtZSIsInBhcmVudHNQaG9uZSIsInJlbW92ZUF0dHIiLCJ1cEluZm9PYmoiLCJwYXBlcnNOdW1iZXIiLCJ1c2VyUm9sZXMiLCJyb2xlSWQiLCJncmFkZUlkIiwic3ViamVjdElkIiwicmVsb2FkIiwibW9iaWxlIiwidHJpbSIsImxlbmd0aCIsIm1haWxWYWxpZGF0ZSIsInRlc3QiLCJ0YXJQIiwidHJpZ2dlciIsInNob3dTZWN1cml0eSIsInRhclZhbCIsIm1hdGNoIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsV0FBUyxLQURJO0FBRWJDLFNBQU87QUFDTCxvQkFBZ0I7QUFEWCxHQUZNO0FBS2JDLGdC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b0JjLElBQXBCLEdBQTJCb0IsSUFBM0IsQ0FBZ0MsRUFBaEMsRUFBb0NRLFdBQXBDLENBQWdELEtBQWhEO0FBQ0FtQyxlQUFPLENBQVAsSUFBWSxDQUFaO0FBQ0QsT0FIRCxNQUdPLElBQUk4QyxVQUFVLEVBQWQsRUFBa0I7QUFDdkJILGFBQUt4SCxJQUFMLENBQVUsUUFBVixFQUFvQkcsSUFBcEIsR0FBMkIrQixJQUEzQixDQUFnQyxhQUFoQyxFQUErQ1UsUUFBL0MsQ0FBd0QsS0FBeEQ7QUFDQWlDLGVBQU8sQ0FBUCxJQUFZLENBQVo7QUFDRCxPQUhNLE1BR0E7QUFDTDJDLGFBQUt4SCxJQUFMLENBQVUsUUFBVixFQUFvQkcsSUFBcEIsR0FBMkIrQixJQUEzQixDQUFnQyxXQUFoQyxFQUE2Q1UsUUFBN0MsQ0FBc0QsS0FBdEQ7QUFDQWlDLGVBQU8sQ0FBUCxJQUFZLENBQVo7QUFDRDtBQUNGO0FBQ0YsR0F4L0JEO0FBeS9CRCxDQTUvQkQiLCJmaWxlIjoicGVyc0NlbnRlci9qcy9wZXJzQ2VudGVyLWQyYjE2NGRmZmIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdwbGF0Zm9ybUNvbmYnOiAncHVibGljL2pzL3BsYXRmb3JtQ29uZi5qcydcclxuICB9LFxyXG4gIGVuZm9yZURlZmluZTogdHJ1ZVxyXG59KTtcclxucmVxdWlyZShbJ3BsYXRmb3JtQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIHJlcXVpcmUoWydqcXVlcnknLCAndG9vbHMnLCAnaGVhZGVyJywgJ2Zvb3RlcicsICdzZXJ2aWNlJywgJ3dlYnVwbG9hZGVyJywgJ2xheWVyJywgJ3RlbXBsYXRlJ10sIGZ1bmN0aW9uICgkLCB0b29scywgaGVhZGVyLCBmb290ZXIsIHNlcnZpY2UsIFdlYlVwbG9hZGVyLCBsYXllciwgdGVtcGxhdGUpIHtcclxuICAgIGZ1bmN0aW9uIGdldFBpY1BhdGgoaWQpIHtcclxuICAgICAgcmV0dXJuIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnN1YnN0cmluZygwLCA0KSA9PT0gJ2h0dHAnID8gc2VydmljZS5wYXRoX3VybFsnZG93bmxvYWRfdXJsJ10gOiAoc2VydmljZS5wcmVmaXggKyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5yZXBsYWNlKCcjcmVzaWQjJywgaWQpKTtcclxuICAgICAgO1xyXG4gICAgfVxyXG5cclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgdXBsb2FkVXJsID0gc2VydmljZS5wYXRoX3VybFsndXBsb2FkX3VybCddLnN1YnN0cmluZygwLCA0KSA9PT0gJ2h0dHAnID8gc2VydmljZS5wYXRoX3VybFsndXBsb2FkX3VybCddIDogKHNlcnZpY2UuaHRtbEhvc3QgKyBzZXJ2aWNlLnBhdGhfdXJsWyd1cGxvYWRfdXJsJ10pO1xyXG4gICAgICB2YXIgdXBsb2FkZXIgPSBXZWJVcGxvYWRlci5jcmVhdGUoe1xyXG4gICAgICAgIC8vIHN3ZuaWh+S7tui3r+W+hFxyXG4gICAgICAgIHN3ZjogJy4uLy4uLy4uLy4uL2xpYi9jb21wb25lbnQvdXBsb2FkL2ltYWdlLWpzL1VwbG9hZGVyLnN3ZicsXHJcbiAgICAgICAgYWNjZXB0OiB7XHJcbiAgICAgICAgICB0aXRsZTogJ0ltYWdlcycsXHJcbiAgICAgICAgICBleHRlbnNpb25zOiAnanBnLGpwZWcscG5nJyxcclxuICAgICAgICAgIG1pbWVUeXBlczogJ2ltYWdlL2pwZywgaW1hZ2UvanBlZywgaW1hZ2UvcG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g5paH5Lu25o6l5pS25pyN5Yqh56uv44CCXHJcbiAgICAgICAgc2VydmVyOiB1cGxvYWRVcmwsXHJcbiAgICAgICAgLy/mlofku7bmlbDph49cclxuICAgICAgICBmaWxlTnVtTGltaXQ6IDUwLFxyXG4gICAgICAgIC8vIOmAieaLqeaWh+S7tueahOaMiemSruOAguWPr+mAieOAglxyXG4gICAgICAgIC8vIOWGhemDqOagueaNruW9k+WJjei/kOihjOaYr+WIm+W7uu+8jOWPr+iDveaYr2lucHV05YWD57Sg77yM5Lmf5Y+v6IO95pivZmxhc2guXHJcbiAgICAgICAgcGljazoge1xyXG4gICAgICAgICAgaWQ6ICcjZWRpdEltZzInXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaWxlU2l6ZUxpbWl0OiAyMCAqIDEwMjQgKiAxMDI0ICogMTAyNCwgICAgLy8gMjBHXHJcbiAgICAgICAgZmlsZVNpbmdsZVNpemVMaW1pdDogNSAqIDEwMjQgKiAxMDI0ICogMTAyNCAgICAvLyA1R1xyXG4gICAgICB9KTtcclxuICAgICAgLy/lvZPmnInmlofku7bmt7vliqDov5vmnaXnmoTml7blgJlcclxuICAgICAgdXBsb2FkZXIub24oJ2ZpbGVRdWV1ZWQnLCBmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgIHdpbmRvdy5waWNVcmxJZCA9ICcnO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCQoJyNydF8nK2ZpbGUuc291cmNlLnJ1aWQpKTtcclxuICAgICAgICAkKCcjcnRfJyArIGZpbGUuc291cmNlLnJ1aWQpLnBhcmVudHMoJy5pbmZvckxpc3QnKS5maW5kKCdpbWcnKS5wYXJlbnQoKS5zaWJsaW5ncygnLnVwTG9hZGluZycpLnNob3coKTtcclxuICAgICAgICAvLyB3aW5kb3cuc2V0SW1nRWxlLnBhcmVudCgpLnNpYmxpbmdzKCcudXBMb2FkaW5nJykuc2hvdygpO1xyXG4gICAgICAgIHVwbG9hZGVyLnVwbG9hZCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHVwbG9hZGVyLm9uKCd1cGxvYWRBY2NlcHQnLCBmdW5jdGlvbiAob2IsIHJldCkge1xyXG4gICAgICAgIGlmICghcmV0LmRhdGEpIHtcclxuICAgICAgICAgIHJldC5kYXRhID0gcmV0LmtleTtcclxuICAgICAgICAgIHJldC5jb2RlID0gJ3N1Y2Nlc3MnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhyZXQpXHJcbiAgICAgICAgaWYgKHJldC5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgd2luZG93LnBpY1VybElkID0gcmV0LmRhdGE7XHJcbiAgICAgICAgICAkKCcjcnRfJyArIG9iLmZpbGUuc291cmNlLnJ1aWQpLnBhcmVudHMoJy5pbmZvckxpc3QnKS5maW5kKCdpbWcnKS5hdHRyKCdzcmMnLCBnZXRQaWNQYXRoKHJldC5kYXRhKSk7XHJcbiAgICAgICAgICB3aW5kb3cucGljVXJsQ3VyID0gdHJ1ZTtcclxuICAgICAgICAgICQoJyNydF8nICsgb2IuZmlsZS5zb3VyY2UucnVpZCkucGFyZW50cygnLmluZm9yTGlzdCcpLmZpbmQoJ2ltZycpLnBhcmVudCgpLnNpYmxpbmdzKCcudXBMb2FkaW5nJykuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3aW5kb3cucGljVXJsQ3VyID0gZmFsc2U7XHJcbiAgICAgICAgICAkKCcjcnRfJyArIG9iLmZpbGUuc291cmNlLnJ1aWQpLnBhcmVudHMoJy5pbmZvckxpc3QnKS5maW5kKCdpbWcnKS5wYXJlbnQoKS5zaWJsaW5ncygnLnVwTG9hZGluZycpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXBsb2FkZXIucmVzZXQoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHVwbG9hZGVyLm9uKCd1cGxvYWRFcnJvcicsIGZ1bmN0aW9uIChjb2RlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29kZSk7XHJcbiAgICAgICAgJCgnI3J0XycgKyBjb2RlLnNvdXJjZS5ydWlkKS5wYXJlbnRzKCcuaW5mb3JMaXN0JykuZmluZCgnaW1nJykucGFyZW50KCkuc2libGluZ3MoJy51cExvYWRpbmcnKS5oaWRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuXHJcblxyXG4gICAgLyoqIOW5s+WPsOeZu+W9leaWueazlShvYXV0aCnmlrnms5UqL1xyXG4gICAgZnVuY3Rpb24gb2F1dGhMb2dpbigpIHtcclxuICAgICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgICBpZiAodXJsLmluZGV4T2YoXCIjcGFnZVwiKSkge1xyXG4gICAgICAgIHVybCA9IHVybC5zcGxpdChcIiNwYWdlXCIpWzBdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgIT0gLTEpIHtcclxuICAgICAgICB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICcvbG9naW4/cmVkaXJlY3RVcmw9JyArIHVybDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICcvbG9naW4/cmVkaXJlY3RVcmw9JyArIHVybDtcclxuICAgICAgfVxyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHVybDtcclxuXHJcbiAgICAgIC8vd2luZG93LmxvY2F0aW9uLmhyZWYgPSBzZXJ2aWNlLnByZWZpeCArICcvbG9naW4nO1xyXG4gICAgfVxyXG5cclxuICAgIC8v55So5oi357G75Z6LXHJcbiAgICBmdW5jdGlvbiBpbmZvVXNlclR5cGUodHlwZSkge1xyXG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICByZXR1cm4gNDtcclxuICAgICAgICBjYXNlIDMwMTpcclxuICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgIGNhc2UgMzAwOlxyXG4gICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgY2FzZSAyMDA6XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICBjYXNlIDIwMTpcclxuICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v5LiL5ouJ5qGGXHJcbiAgICBmdW5jdGlvbiBtYlNlbGVjdCgpIHtcclxuICAgICAgLy/pgInmi6npobkg6ZqQ6JeP5LiL5ouJ5qGGXHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIubWJTZWxlY3RcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgICAgIHZhciB0YXIgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XHJcbiAgICAgICAgaWYgKGNoYW5nZUN1ciAmJiAkKHRhcikucGFyZW50cygnLnN1YlNlbEdhdExpc3QnKS5wYXJlbnQoKS5hdHRyKCdpZCcpICE9ICd1c2VyU3ViamVjdCcpIHtcclxuICAgICAgICAgICQoJy5zZWxlY3QtYm94IC50eXBlcycpLmhpZGUoKTtcclxuICAgICAgICAgIGlmICgkKHRhcikuaGFzQ2xhc3MoJ3NlbGVjdCcpKSB7XHJcbiAgICAgICAgICAgICQoXCIubWJTZWxcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICBpZiAoJCh0YXIpLnBhcmVudHMoJy5tYlNlbGVjdCcpLmhhc0NsYXNzKCdwaGFzZVNlbCcpICYmICQodGFyKS5hdHRyKCdkYXRhLWlkJykgIT0gJCh0YXIpLnBhcmVudHMoJy5tYlNlbGVjdCcpLmZpbmQoJy5zZWxTaG93JykuYXR0cignZGF0YS1pZCcpKSB7XHJcbiAgICAgICAgICAgICAgaW5pdFN1YmplY3QoJCh0YXIpLnBhcmVudHMoJy5zdWJTZWxHYXQnKS5hdHRyKCdpZCcpLCAkKHRhcikuYXR0cignZGF0YS1pZCcpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJCh0YXIpLnBhcmVudHMoJy5tYlNlbGVjdCcpLmZpbmQoJy5zZWxTaG93JykuaHRtbCgkKHRhcikuaHRtbCgpKS5hdHRyKCdkYXRhLWlkJywgJCh0YXIpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoJCh0YXIpLmhhc0NsYXNzKCdzZWxTaG93JykpIHtcclxuICAgICAgICAgICAgaWYgKCQodGFyKS5wYXJlbnQoKS5maW5kKFwiLm1iU2VsXCIpLmNzcygnZGlzcGxheScpID09ICdub25lJykge1xyXG4gICAgICAgICAgICAgICQoXCIubWJTZWxcIikuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICQodGFyKS5wYXJlbnQoKS5maW5kKFwiLm1iU2VsXCIpLnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkKHRhcikucGFyZW50KCkuZmluZChcIi5tYlNlbFwiKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuICAgICAgLy/ngrnlh7vkuIvnqbrnmb3lpITvvIzkuIvmi4nmoYbmtojlpLFcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XHJcbiAgICAgICAgdmFyIHRhciA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuICAgICAgICAkKFwiLm1iU2VsXCIpLmhpZGUoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8v6Zi75q2i5YaS5rOhXHJcbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcubWJTZWxlY3QnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm1iU2VsZWN0U21haWxsIGxpJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgcGlkID0gJCh0aGlzKS5wYXJlbnRzKCdsaS5jbGVhckZpeCcpLmF0dHIoJ2lkJyksXHJcbiAgICAgICAgaWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaWQnKTtcclxuICAgICAgJCh0aGlzKS5wYXJlbnRzKCcubWJTZWxlY3RTbWFpbGwnKS5hdHRyKCdkYXRhLWlkJywgaWQpO1xyXG4gICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygndHJpZ2dlcicpKSB7XHJcbiAgICAgICAgZmV0Y2hHcmFkZShwaWQsIGlkKTtcclxuICAgICAgICBmZXRjaFN1YmplY3QocGlkLCBpZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8v5Zu+54mHdXJs5ou85o6lXHJcbiAgICBmdW5jdGlvbiBnZXRQaWNQYXRoKGlkKSB7XHJcbiAgICAgIHJldHVybiBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5zdWJzdHJpbmcoMCwgNCkgPT09ICdodHRwJyA/IHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkgOiAoc2VydmljZS5wcmVmaXggKyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5yZXBsYWNlKCcjcmVzaWQjJywgaWQpKTtcclxuICAgIH1cclxuXHJcbiAgICAvL+aXoOS/ruaUueaBouWkjeaVsOaNrlxyXG4gICAgZnVuY3Rpb24gbm9DaGFuZ2UoKSB7XHJcbiAgICAgIGNoYW5nZUN1ciA9IGZhbHNlO1xyXG4gICAgICBoYW5kbGVCaW5kZWQoKTtcclxuICAgICAgJCgnLmNvbkxlZnQgLm1vZE1hcmsnKS5yZW1vdmVDbGFzcygnaWNvbi1zdGFyLXBzZXVkbycpO1xyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5jZW5NYXJrJykucmVtb3ZlQ2xhc3MoJ2NvbkNoYW5nZScpLmF0dHIoeydyZWFkb25seSc6ICdyZWFkb25seScsICd1bnNlbGVjdGFibGUnOiAnb24nfSk7XHJcblxyXG4gICAgICAkKCcucGVyQ2VuQnRuIC5zYXZlQnRuLC5jYW5jZWxCdG4nKS5oaWRlKCk7XHJcbiAgICAgICQoJy5wZXJDZW5CdG4gLmVkaXRCdG4nKS5zaG93KCk7XHJcbiAgICAgICQoJyN1c2VyRHV0eSAubWJTZWxlY3QnKS5oaWRlKCkuZmluZCgnLnNlbFNob3cnKS5odG1sKCQoJyN1c2VyRHV0eSAubWJTZWxlY3QraW5wdXQnKS52YWwoKSk7XHJcbiAgICAgICQoJyN1c2VyRHV0eSAubWJTZWxlY3QraW5wdXQnKS5zaG93KCk7XHJcbiAgICAgICQoJyNzZXhFZGl0IC5tYlNlbGVjdCcpLmhpZGUoKS5maW5kKCcuc2VsU2hvdycpLmh0bWwoJCgnI3NleEVkaXQgLm1iU2VsZWN0K2lucHV0JykudmFsKCkpO1xyXG4gICAgICAkKCcjc2V4RWRpdCAubWJTZWxlY3QraW5wdXQnKS5zaG93KCk7XHJcblxyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5zdWJTZWxHYXQgLm1iU2VsZWN0JykuYWRkQ2xhc3MoJ21iTm9TZWxlY3QnKTtcclxuXHJcbiAgICAgICQoJy5jZW5NYXJrJykuZWFjaChmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgICQoJy5jZW5NYXJrJykuZXEoaSkuYXR0cigndmFsdWUnLCAkKHRoaXMpLmF0dHIoJ2RhdGEtb2xkJykpLnZhbCgkKHRoaXMpLmF0dHIoJ2RhdGEtb2xkJykpXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCgnLmluZm9yTGlzdCAuZWRpdEltZycpLmhpZGUoKTtcclxuXHJcbiAgICAgICQoJy5hZGRJdGVtLC5kZWxldGVJdGVtJykuaGlkZSgpO1xyXG5cclxuICAgICAgJCgnI3VzZXJTdWJqZWN0JykuZmluZCgnLmN1clN1YlNlbEdhdCcpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgJCgnLnNldFVzZXJQaWMgaW1nJykuYXR0cignc3JjJywgJCgnLnNldFVzZXJQaWMgaW1nJykuYXR0cignZGF0YS1vbGQnKSk7XHJcblxyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5jbHVlcycpLmhpZGUoKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcblxyXG4gICAgICAkKCcjdXNlckxvZ2luRW1haWwgLmVNYWlsQ29kZScpLmFkZENsYXNzKCdlTWFpbENvZGVIaWRlJyk7XHJcbiAgICAgICQoJyNzZWN1cml0eVBob25lIC5lTWFpbENvZGUnKS5hZGRDbGFzcygnZU1haWxDb2RlSGlkZScpO1xyXG4gICAgICAkKCcjTG9naW5FbWFpbENvZGUsICNzZWN1cml0eUNvZGUnKS5hZGRDbGFzcygnZU1haWxDb2RlSGlkZScpLmZpbmQoJy5jb25DZW4nKS52YWwoJycpO1xyXG5cclxuICAgICAgJCgnLmNsYXNzSW5mbycpLnNob3coKTtcclxuICAgICAgJCgnLmNsYXNzSW5mb1NlbGVjdCcpLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvL+acieS/ruaUueS/ruaUueaVsOaNrlxyXG4gICAgZnVuY3Rpb24gY2hhbmdlKCkge1xyXG4gICAgICBoYW5kbGVCaW5kZWQoKTtcclxuICAgICAgJCgnLmNvbkxlZnQgLm1vZE1hcmsnKS5yZW1vdmVDbGFzcygnaWNvbi1zdGFyLXBzZXVkbycpO1xyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5jZW5NYXJrJykucmVtb3ZlQ2xhc3MoJ2NvbkNoYW5nZScpLmF0dHIoeydyZWFkb25seSc6ICdyZWFkb25seScsICd1bnNlbGVjdGFibGUnOiAnb24nfSk7XHJcblxyXG4gICAgICAkKCcucGVyQ2VuQnRuIC5zYXZlQnRuLC5jYW5jZWxCdG4nKS5oaWRlKCk7XHJcbiAgICAgICQoJy5wZXJDZW5CdG4gLmVkaXRCdG4nKS5zaG93KCk7XHJcbiAgICAgICQoJyN1c2VyRHV0eSAubWJTZWxlY3QnKS5oaWRlKCk7XHJcbiAgICAgICQoJyN1c2VyRHV0eSAubWJTZWxlY3QraW5wdXQnKS5zaG93KCk7XHJcbiAgICAgICQoJyNzZXhFZGl0IC5tYlNlbGVjdCcpLmhpZGUoKTtcclxuICAgICAgJCgnI3NleEVkaXQgLm1iU2VsZWN0K2lucHV0Jykuc2hvdygpO1xyXG5cclxuICAgICAgJCgnLmluZm9yTGlzdCAuc3ViU2VsR2F0IC5tYlNlbGVjdCcpLmFkZENsYXNzKCdtYk5vU2VsZWN0Jyk7XHJcblxyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5lZGl0SW1nJykuaGlkZSgpO1xyXG5cclxuICAgICAgJCgnLmFkZEl0ZW0sLmRlbGV0ZUl0ZW0nKS5oaWRlKCk7XHJcblxyXG4gICAgICAkKCcjc2V4RWRpdCBpbnB1dCcpLnZhbCgkKCcjc2V4RWRpdCAuc2VsU2hvdycpLmh0bWwoKSk7XHJcbiAgICAgICQoJyN1c2VyRHV0eSBpbnB1dCcpLnZhbCgkKCcjdXNlckR1dHkgLnNlbFNob3cnKS5odG1sKCkpO1xyXG4gICAgICAkKCcjdXNlck5hbWVkIGlucHV0JykudmFsKCQoJyN1c2VyTmFtZWQgLnNlbFNob3cnKS5odG1sKCkpO1xyXG5cclxuICAgICAgJCgnI3VzZXJTdWJqZWN0JykuZmluZCgnLmN1clN1YlNlbEdhdCcpLnJlbW92ZUNsYXNzKCdjdXJTdWJTZWxHYXQnKTtcclxuXHJcbiAgICAgICQoJyNiaXJ0aGRheVNob3cnKS5hdHRyKCd2YWx1ZScsICQoJyNiaXJ0aGRheVNlbCcpLnZhbCgpKTtcclxuICAgICAgJCgnI2JpcnRoZGF5U2VsJykuaGlkZSgpO1xyXG4gICAgICAkKCcjYmlydGhkYXlTaG93Jykuc2hvdygpO1xyXG4gICAgICAkKCcuY2VuTWFyaycpLmVhY2goZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAvLyB0b29scy5sb2coaSk7XHJcbiAgICAgICAgJCgnLmNlbk1hcmsnKS5lcShpKS5hdHRyKCdkYXRhLW9sZCcsICQodGhpcykudmFsKCkpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnLnNldEJhbm5lckJnIGltZycpLmF0dHIoJ2RhdGEtb2xkJywgJCgnLnNldEJhbm5lckJnIGltZycpLmF0dHIoJ3NyYycpKTtcclxuICAgICAgJCgnLnNldFVzZXJQaWMgaW1nJykuYXR0cignZGF0YS1vbGQnLCAkKCcuc2V0VXNlclBpYyBpbWcnKS5hdHRyKCdzcmMnKSk7XHJcblxyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5jbHVlcycpLmhpZGUoKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcblxyXG4gICAgICAkKCcjdXNlckxvZ2luRW1haWwgLmVNYWlsQ29kZScpLmFkZENsYXNzKCdlTWFpbENvZGVIaWRlJyk7XHJcbiAgICAgICQoJyNzZWN1cml0eVBob25lIC5lTWFpbENvZGUnKS5hZGRDbGFzcygnZU1haWxDb2RlSGlkZScpO1xyXG4gICAgICAkKCcjTG9naW5FbWFpbENvZGUsICNzZWN1cml0eUNvZGUnKS5hZGRDbGFzcygnZU1haWxDb2RlSGlkZScpLmZpbmQoJy5jb25DZW4nKS52YWwoJycpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhhbmRsZUJpbmRlZCgpIHtcclxuICAgICAgJC5lYWNoKCQoJy5iaW5kZWQnKSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgaWYgKCQoaXRlbSkuYXR0cignZGF0YS1zaG93JykgPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgaWYgKCQoaXRlbSkucGFyZW50KCkuYXR0cignaWQnKSA9PSAnc2VjdXJpdHlQaG9uZScpIHtcclxuICAgICAgICAgICAgJChpdGVtKS5zaWJsaW5ncygnaW5wdXQnKS5jc3MoJ3dpZHRoJywgJ2F1dG8nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICQoaXRlbSkuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGl0ZW0pLmhpZGUoKTtcclxuICAgICAgICAgICQoaXRlbSkuc2libGluZ3MoJ2lucHV0JykuY3NzKCd3aWR0aCcsICcyMzNweCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlU2VsZWN0KHRleHQsIGNsYXNzU3VmZml4KSB7XHJcbiAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cIm1iU2VsZWN0IG1iU2VsZWN0U21haWxsXCIgcmVhZG9ubHk+JyArXHJcbiAgICAgICAgJzxwIGNsYXNzPVwic2VsU2hvd1wiPicgKyB0ZXh0ICsgJzwvcD4nICtcclxuICAgICAgICAnPHVsIGNsYXNzPVwibWJTZWwgc2VsZWN0XycgKyBjbGFzc1N1ZmZpeCArICdcIj4nICtcclxuICAgICAgICAnPC91bD4nICtcclxuICAgICAgICAnPC9kaXY+J1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZldGNoUGhhc2UoaWQsIHN1YmplY3QpIHtcclxuICAgICAgJC5nZXRKU09OKHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9tZXRhL29yZ1BoYXNlP29yZ0lkPScgKyBwZXJzVXNlclsnb3JnSWQnXSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgIGlmIChyZXNbJ2NvZGUnXSA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICB2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgdmFyIHNlbGVjdGVkID0gcmVzWydkYXRhJ11bMF07XHJcbiAgICAgICAgICAkLmVhY2gocmVzWydkYXRhJ10sIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbVsnbmFtZSddID09PSBzdWJqZWN0LnBhaHNlKSBzZWxlY3RlZCA9IGl0ZW07XHJcbiAgICAgICAgICAgIGh0bWwgKz0gJzxsaSBjbGFzcz1cInRyaWdnZXJcIiBkYXRhLWlkPVwiJyArIGl0ZW1bJ2lkJ10gKyAnXCI+PHAgY2xhc3M9XCJzZWxlY3RcIj4nICsgaXRlbVsnbmFtZSddICsgJzwvcD48L2xpPic7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICQoJyMnICsgaWQgKyAnIC5zZWxlY3RfcGhhc2UnKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgJCgnIycgKyBpZCArICcgLnNlbGVjdF9waGFzZScpLnBhcmVudCgpLmF0dHIoJ2RhdGEtaWQnLCBzZWxlY3RlZFsnaWQnXSk7XHJcbiAgICAgICAgICBmZXRjaEdyYWRlKGlkLCBzZWxlY3RlZFsnaWQnXSwgc3ViamVjdC5ncmFkZSk7XHJcbiAgICAgICAgICBmZXRjaFN1YmplY3QoaWQsIHNlbGVjdGVkWydpZCddLCBzdWJqZWN0LnN1YmplY3QpO1xyXG4gICAgICAgIH0gZWxzZSBoYW5kbGVFcnIoJ+WtpuauteaVsOaNruivt+axgumUmeivr++8jOivt+WIt+aWsOmHjeivlScpO1xyXG4gICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgaGFuZGxlRXJyKCflrabmrrXmlbDmja7or7fmsYLplJnor6/vvIzor7fliLfmlrDph43or5UnKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmZXRjaEdyYWRlKGlkLCBwaGFzZUlkLCB0ZXh0KSB7XHJcbiAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvbWV0YS9vcmdHcmFkZT9vcmdJZD0nICsgcGVyc1VzZXJbJ29yZ0lkJ10gKyAnJnBoYXNlSWQ9JyArIHBoYXNlSWQsXHJcbiAgICAgICAgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgaWYgKHJlc1snY29kZSddID09PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgdmFyIGh0bWwgPSAnJztcclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gcmVzWydkYXRhJ11bMF07XHJcbiAgICAgICAgICAgICQuZWFjaChyZXNbJ2RhdGEnXSwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGl0ZW1bJ25hbWUnXSA9PT0gdGV4dCkgc2VsZWN0ZWQgPSBpdGVtO1xyXG4gICAgICAgICAgICAgIGh0bWwgKz0gJzxsaSBkYXRhLWlkPVwiJyArIGl0ZW1bJ2lkJ10gKyAnXCI+PHAgY2xhc3M9XCJzZWxlY3RcIj4nICsgaXRlbVsnbmFtZSddICsgJzwvcD48L2xpPic7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcjJyArIGlkICsgJyAuc2VsZWN0X2dyYWRlJykuaHRtbChodG1sKTtcclxuICAgICAgICAgICAgJCgnIycgKyBpZCArICcgLnNlbGVjdF9ncmFkZScpLnBhcmVudCgpLmF0dHIoJ2RhdGEtaWQnLCBzZWxlY3RlZFsnaWQnXSk7XHJcbiAgICAgICAgICB9IGVsc2UgaGFuZGxlRXJyKCflubTnuqfmlbDmja7or7fmsYLplJnor6/vvIzor7fliLfmlrDph43or5UnKTtcclxuICAgICAgICB9XHJcbiAgICAgICkuZXJyb3IoZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgIGhhbmRsZUVycign5bm057qn5pWw5o2u6K+35rGC6ZSZ6K+v77yM6K+35Yi35paw6YeN6K+VJylcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmV0Y2hTdWJqZWN0KGlkLCBwaGFzZUlkLCB0ZXh0KSB7XHJcbiAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvbWV0YS9vcmdTdWJqZWN0P29yZ0lkPScgKyBwZXJzVXNlclsnb3JnSWQnXSArICcmcGhhc2VJZD0nICsgcGhhc2VJZCxcclxuICAgICAgICBmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICBpZiAocmVzWydjb2RlJ10gPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSByZXNbJ2RhdGEnXVswXTtcclxuICAgICAgICAgICAgJC5lYWNoKHJlc1snZGF0YSddLCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICBpZiAoaXRlbVsnbmFtZSddID09PSB0ZXh0KSBzZWxlY3RlZCA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgaHRtbCArPSAnPGxpIGRhdGEtaWQ9XCInICsgaXRlbVsnaWQnXSArICdcIj48cCBjbGFzcz1cInNlbGVjdFwiPicgKyBpdGVtWyduYW1lJ10gKyAnPC9wPjwvbGk+JztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoJyMnICsgaWQgKyAnIC5zZWxlY3Rfc3ViamVjdCcpLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICQoJyMnICsgaWQgKyAnIC5zZWxlY3Rfc3ViamVjdCcpLnBhcmVudCgpLmF0dHIoJ2RhdGEtaWQnLCBzZWxlY3RlZFsnaWQnXSk7XHJcbiAgICAgICAgICB9IGVsc2UgaGFuZGxlRXJyKCflrabnp5HmlbDmja7or7fmsYLplJnor6/vvIzor7fliLfmlrDph43or5UnKTtcclxuICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgaGFuZGxlRXJyKCflrabnp5HmlbDmja7or7fmsYLplJnor6/vvIzor7fliLfmlrDph43or5UnKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBoYW5kbGVFcnIobXNnKSB7XHJcbiAgICAgIGxheWVyLmFsZXJ0KG1zZywge2ljb246IDB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL+iHquWumueUqOaIt+exu+Wei1xyXG4gICAgdmFyIFVTRVJUWVBFID0ge1xyXG4gICAgICBOT05FOiAwLFxyXG4gICAgICBESVNUUklDVDogMSxcclxuICAgICAgVEVBQ0hFUjogMixcclxuICAgICAgU1RVREVOVDogMyxcclxuICAgICAgUEFSRU5UOiA0XHJcbiAgICB9O1xyXG4gICAgLy/nlKjmiLfkv6Hmga/lrZjlgqhcclxuICAgIHZhciBwZXJzVXNlciA9IG5ldyBPYmplY3QoKTtcclxuICAgIC8v6L6T5YWl54q25oCBOuWOn+Wni+WvhueggeOAgeaWsOWvhueggeOAgeWGjeWvhueggeOAgeWnk+WQjeOAgeiBlOezu+eUteivneOAgemqjOivgeeUteWtkOmCrueuseOAgeWutumVv+eUteivneOAgeagoemqjOeggeOAgeaJi+acuuWPt+e7keWumueahOaJi+acuuWPt1xyXG4gICAgdmFyIHB3ZEN1ciA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcclxuICAgIC8v57yW6L6R5oCB5Yik5patXHJcbiAgICB2YXIgY2hhbmdlQ3VyID0gZmFsc2U7XHJcbiAgICAvL+mAiemhuem7mOiupGJhc2ljSW5mb3JcclxuICAgIHZhciBzZWxlY3RUeXBlID0gJ2Jhc2ljSW5mb3InO1xyXG4gICAgLy/liJ3lp4vljJbkuIvmi4nmoYZcclxuICAgIG1iU2VsZWN0KCk7XHJcblxyXG4gICAgLy/mlbDmja7liJ3lp4vljJZcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHR5cGU6IFwiZ2V0XCIsXHJcbiAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvaW5mbycsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgIGRhdGEgPSBkYXRhLmRhdGE7XHJcbiAgICAgICAgICBwZXJzVXNlci5vcmdJZCA9IGRhdGEuYWNjb3VudC5vcmdJZDtcclxuICAgICAgICAgIC8v6YCa55SoXHJcbiAgICAgICAgICBwZXJzVXNlci51c2VyVHlwZSA9IGluZm9Vc2VyVHlwZShkYXRhLmFjY291bnQudXNlclR5cGUpO1xyXG4gICAgICAgICAgLy8gZGF0YS5hY2NvdW50LnVzZXJJbmZvLnBob3RvPWRhdGEuYWNjb3VudC51c2VySW5mby5waG90b3x8Jyc7XHJcbiAgICAgICAgICBpZiAocGVyc1VzZXIudXNlclR5cGUgPT0gVVNFUlRZUEUuU1RVREVOVCkge1xyXG4gICAgICAgICAgICBwZXJzVXNlci5waG90byA9IGRhdGEuYWNjb3VudC51c2VySW5mby5waG90byA/IGdldFBpY1BhdGgoZGF0YS5hY2NvdW50LnVzZXJJbmZvLnBob3RvKSA6ICdpbWFnZXMvc3R1ZGVudFBpYy5wbmcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGVyc1VzZXIucGhvdG8gPSBkYXRhLmFjY291bnQudXNlckluZm8ucGhvdG8gPyBnZXRQaWNQYXRoKGRhdGEuYWNjb3VudC51c2VySW5mby5waG90bykgOiAnaW1hZ2VzL3RlYWNoZXJQaWMucG5nJztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBwZXJzVXNlci5uYW1lID0gZGF0YS5hY2NvdW50LnVzZXJJbmZvLm5hbWUgfHwgJyc7XHJcbiAgICAgICAgICBwd2RDdXJbM10gPSBwZXJzVXNlci5uYW1lID8gMSA6IDA7XHJcbiAgICAgICAgICBwZXJzVXNlci5hY2NvdW50ID0gZGF0YS5hY2NvdW50LmFjY291bnQ7XHJcbiAgICAgICAgICBwZXJzVXNlci5zZXggPSBkYXRhLmFjY291bnQudXNlckluZm8uc2V4ID09IDEgPyAn55S3JyA6ICflpbMnO1xyXG4gICAgICAgICAgcGVyc1VzZXIudGVsZXBob25lID0gZGF0YS5hY2NvdW50LnVzZXJJbmZvLnRlbGVwaG9uZSB8fCAnJztcclxuICAgICAgICAgIHB3ZEN1cls0XSA9IHBlcnNVc2VyLnRlbGVwaG9uZSA/IDEgOiAwO1xyXG4gICAgICAgICAgZGF0YS5hY2NvdW50LmVtYWlsID0gZGF0YS5hY2NvdW50LmVtYWlsIHx8ICcnO1xyXG4gICAgICAgICAgcGVyc1VzZXIuZW1haWwgPSBkYXRhLmFjY291bnQuZW1haWwgfHwgZGF0YS5hY2NvdW50LnVzZXJJbmZvLmVtYWlsO1xyXG4gICAgICAgICAgcGVyc1VzZXIuYm91bmRFbWFpbCA9IGRhdGEuYWNjb3VudC5lbWFpbDtcclxuICAgICAgICAgIHBlcnNVc2VyLmJvdW5kUGhvbmUgPSAoZGF0YS5hY2NvdW50LmNlbGxwaG9uZSAmJiBkYXRhLmFjY291bnQuY2VsbHBob25lICE9IC0xKSA/IGRhdGEuYWNjb3VudC5jZWxscGhvbmUgOiAnJztcclxuICAgICAgICAgIHB3ZEN1cls1XSA9IHBlcnNVc2VyLmJvdW5kRW1haWwgPyAxIDogMDtcclxuICAgICAgICAgIHB3ZEN1cls4XSA9IHBlcnNVc2VyLmJvdW5kUGhvbmUgPyAxIDogMDtcclxuXHJcbiAgICAgICAgICBpZiAocGVyc1VzZXIuYm91bmRFbWFpbCkge1xyXG4gICAgICAgICAgICAkKCcjdXNlckVtYWlsJykuZmluZCgnLmNvbkNlbicpLnJlbW92ZUNsYXNzKCdjZW5NYXJrJyk7XHJcbiAgICAgICAgICAgICQoJyN1c2VyRW1haWwnKS5maW5kKCcuY2x1ZXMnKS5odG1sKCflpoLpnIDkv67mlLnor7fliLDjgJDnu5Hlrprkv6Hmga/jgJHkuK3ov5vooYzkv67mlLknKS5hZGRDbGFzcygnYnVsZScpO1xyXG4gICAgICAgICAgICAkKCcjdXNlckxvZ2luRW1haWwgLmJpbmRlZCcpLmF0dHIoJ2RhdGEtc2hvdycsICd0cnVlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAocGVyc1VzZXIuYm91bmRQaG9uZSkge1xyXG4gICAgICAgICAgICAkKCcjc2VjdXJpdHlQaG9uZSAuYmluZGVkJykuYXR0cignZGF0YS1zaG93JywgJ3RydWUnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkKCcucGVyQ2VuU2VsZWN0IC51c2VyTG9nb0NlbiAubG9nb0ltZycpLmF0dHIoJ3NyYycsIHBlcnNVc2VyLnBob3RvKTtcclxuICAgICAgICAgICQoJy5wZXJDZW5TZWxlY3QgLnVzZXJMb2dvIC51c2VyTmFtZScpLmh0bWwocGVyc1VzZXIubmFtZSk7XHJcbiAgICAgICAgICAkKCcjdXNlckxvZ28gLlVzZXJQaWNJbWcgaW1nJykuYXR0cih7J3NyYyc6IHBlcnNVc2VyLnBob3RvLCAnZGF0YS1vbGQnOiBwZXJzVXNlci5waG90b30pO1xyXG4gICAgICAgICAgJCgnI3VzZXJOYW1lJykuZmluZCgnLmNvbkNlbicpLmF0dHIoeydkYXRhLW9sZCc6IHBlcnNVc2VyLm5hbWUsICd2YWx1ZSc6IHBlcnNVc2VyLm5hbWV9KTtcclxuICAgICAgICAgICQoJyN1c2VyTnVtJykuZmluZCgnLmNvbkNlbicpLmF0dHIoeyd2YWx1ZSc6IHBlcnNVc2VyLmFjY291bnR9KTtcclxuICAgICAgICAgICQoJyNzZXhFZGl0JykuZmluZCgnLmNvbkNlbicpLmF0dHIoeydkYXRhLW9sZCc6IHBlcnNVc2VyLnNleCwgJ3ZhbHVlJzogcGVyc1VzZXIuc2V4fSk7XHJcbiAgICAgICAgICAkKCcjc2V4RWRpdCcpLmZpbmQoJy5zZWxTaG93JykuaHRtbChwZXJzVXNlci5zZXgpO1xyXG4gICAgICAgICAgJCgnI3VzZXJQaG9uZScpLmZpbmQoJy5jb25DZW4nKS5hdHRyKHsnZGF0YS1vbGQnOiBwZXJzVXNlci50ZWxlcGhvbmUsICd2YWx1ZSc6IHBlcnNVc2VyLnRlbGVwaG9uZX0pO1xyXG4gICAgICAgICAgJCgnI3VzZXJFbWFpbCcpLmZpbmQoJy5jb25DZW4nKS5hdHRyKHsnZGF0YS1vbGQnOiBwZXJzVXNlci5lbWFpbCwgJ3ZhbHVlJzogcGVyc1VzZXIuZW1haWx9KTtcclxuICAgICAgICAgIGlmICghcGVyc1VzZXIuYm91bmRFbWFpbCkge1xyXG4gICAgICAgICAgICAkKCcucGVyQ2VuQ29uIC5pbmZvckNoYW5nZSAucGVyQ2VuQnRuIC5lZGl0QnRuJykuaHRtbCgn57uR5a6a6YKu566xJylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICghcGVyc1VzZXIuYm91bmRQaG9uZSkge1xyXG4gICAgICAgICAgICAkKCcucGVyQ2VuQ29uIC5zZWN1cml0eVZlcmlmaWNhdGlvbiAucGVyQ2VuQnRuIC5lZGl0QnRuJykuaHRtbCgn57uR5a6a5omL5py65Y+3JylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICQoJyN1c2VyTG9naW5FbWFpbCcpLmZpbmQoJy5jb25DZW4nKS5hdHRyKHtcclxuICAgICAgICAgICAgJ2RhdGEtb2xkJzogcGVyc1VzZXIuYm91bmRFbWFpbCxcclxuICAgICAgICAgICAgJ3ZhbHVlJzogcGVyc1VzZXIuYm91bmRFbWFpbFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkKCcjc2VjdXJpdHlQaG9uZScpLmZpbmQoJy5jb25DZW4nKS5hdHRyKHtcclxuICAgICAgICAgICAgJ2RhdGEtb2xkJzogcGVyc1VzZXIuYm91bmRQaG9uZSxcclxuICAgICAgICAgICAgJ3ZhbHVlJzogcGVyc1VzZXIuYm91bmRQaG9uZVxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaWYgKHBlcnNVc2VyLnVzZXJUeXBlID09IFVTRVJUWVBFLkRJU1RSSUNUKSB7XHJcbiAgICAgICAgICAgICQoJy5iYXNpY0luZm9yJykuZmluZCgnI3N0dUdyYWRlLCNzdHVDbGFzcywjc3R1U2NoTnVtLCNwZXJOYW1lLCNwZXJQaG9uZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgcGVyc1VzZXIub3JnTmFtZSA9IGRhdGEuYWNjb3VudC51c2VySW5mby5vcmdOYW1lIHx8ICcnO1xyXG4gICAgICAgICAgICBwZXJzVXNlci51c2VyU3ViamVjdCA9IGRhdGEucm9sZXMgfHwgJyc7XHJcbiAgICAgICAgICAgICQoJyN1c2VyVW5pdCcpLmZpbmQoJy5jb25DZW4nKS5hdHRyKHsnZGF0YS1vbGQnOiBwZXJzVXNlci5vcmdOYW1lLCAndmFsdWUnOiBwZXJzVXNlci5vcmdOYW1lfSk7XHJcbiAgICAgICAgICAgIHBlcnNVc2VyLnN1YmplY3RTdHIgPSAnJztcclxuICAgICAgICAgICAgJC5lYWNoKHBlcnNVc2VyLnVzZXJTdWJqZWN0LCBmdW5jdGlvbiAoaW5kZXgsIHN1YmplY3QpIHtcclxuICAgICAgICAgICAgICBzdWJqZWN0LnBoYXNlID0gc3ViamVjdC5waGFzZSB8fCAnJztcclxuICAgICAgICAgICAgICBzdWJqZWN0LnN1YmplY3QgPSBzdWJqZWN0LnN1YmplY3QgfHwgJyc7XHJcbiAgICAgICAgICAgICAgc3ViamVjdC5yb2xlID0gc3ViamVjdC5yb2xlIHx8ICcnO1xyXG4gICAgICAgICAgICAgIHBlcnNVc2VyLnN1YmplY3RTdHIgKz0gJzxsaSBjbGFzcz1cImNsZWFyRml4XCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPHNwYW4+JyArIHN1YmplY3Qucm9sZSArICc8L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAnPHNwYW4+JyArIHN1YmplY3QucGhhc2UgKyAnPC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgJzxzcGFuPicgKyBzdWJqZWN0LnN1YmplY3QgKyAnPC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgJzwvbGk+J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnI3VzZXJTdWJqZWN0JykuZmluZCgnLmNsYXNzSW5mbycpLmh0bWwocGVyc1VzZXIuc3ViamVjdFN0cik7XHJcblxyXG4gICAgICAgICAgfSBlbHNlIGlmIChwZXJzVXNlci51c2VyVHlwZSA9PSBVU0VSVFlQRS5URUFDSEVSKSB7XHJcbiAgICAgICAgICAgICQoJy5iYXNpY0luZm9yJykuZmluZCgnI3N0dUdyYWRlLCNzdHVDbGFzcywjc3R1U2NoTnVtLCNwZXJOYW1lLCNwZXJQaG9uZScpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgcGVyc1VzZXIub3JnTmFtZSA9IGRhdGEuYWNjb3VudC51c2VySW5mby5vcmdOYW1lIHx8ICcnO1xyXG4gICAgICAgICAgICBwZXJzVXNlci51c2VyU3ViamVjdCA9IGRhdGEucm9sZXMgfHwgJyc7XHJcbiAgICAgICAgICAgICQoJyN1c2VyVW5pdCcpLmZpbmQoJy5jb25DZW4nKS5hdHRyKHsnZGF0YS1vbGQnOiBwZXJzVXNlci5vcmdOYW1lLCAndmFsdWUnOiBwZXJzVXNlci5vcmdOYW1lfSk7XHJcbiAgICAgICAgICAgIHBlcnNVc2VyLnN1YmplY3RTdHIgPSAnJztcclxuICAgICAgICAgICAgcGVyc1VzZXIuc3ViamVjdFN0clNlbGVjdCA9ICcnO1xyXG4gICAgICAgICAgICAkLmVhY2gocGVyc1VzZXIudXNlclN1YmplY3QsIGZ1bmN0aW9uIChpbmRleCwgc3ViamVjdCkge1xyXG4gICAgICAgICAgICAgIHN1YmplY3QucGhhc2UgPSBzdWJqZWN0LnBoYXNlIHx8ICcnO1xyXG4gICAgICAgICAgICAgIHN1YmplY3QuZ3JhZGUgPSBzdWJqZWN0LmdyYWRlIHx8ICcnO1xyXG4gICAgICAgICAgICAgIHN1YmplY3Quc3ViamVjdCA9IHN1YmplY3Quc3ViamVjdCB8fCAnJztcclxuICAgICAgICAgICAgICBzdWJqZWN0LnJvbGUgPSBzdWJqZWN0LnJvbGUgfHwgJyc7XHJcbiAgICAgICAgICAgICAgcGVyc1VzZXIuc3ViamVjdFN0ciArPSAnPGxpIGNsYXNzPVwiY2xlYXJGaXhcIj4nICtcclxuICAgICAgICAgICAgICAgICc8c3Bhbj4nICsgc3ViamVjdC5yb2xlICsgJzwvc3Bhbj4nICtcclxuICAgICAgICAgICAgICAgICc8c3Bhbj4nICsgc3ViamVjdC5waGFzZSArICc8L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAnPHNwYW4+JyArIHN1YmplY3QuZ3JhZGUgKyAnPC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgJzxzcGFuPicgKyBzdWJqZWN0LnN1YmplY3QgKyAnPC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgJzwvbGk+J1xyXG4gICAgICAgICAgICAgIHBlcnNVc2VyLnN1YmplY3RTdHJTZWxlY3QgKz0gJzxsaSBjbGFzcz1cImNsZWFyRml4XCIgZGF0YS1yb2xlPVwiJyArIHN1YmplY3RbJ2lkJ10gKyAnXCIgaWQ9XCJzZWxlY3QnICsgaW5kZXggKyAnXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPHNwYW4+JyArIHN1YmplY3Qucm9sZSArICc8L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAoc3ViamVjdC5yb2xlSW5mby5zaG93UGhhc2UgPyBjcmVhdGVTZWxlY3Qoc3ViamVjdC5waGFzZSwgJ3BoYXNlJykgOiAnJykgK1xyXG4gICAgICAgICAgICAgICAgKHN1YmplY3Qucm9sZUluZm8uc2hvd0dyYWRlID8gY3JlYXRlU2VsZWN0KHN1YmplY3QuZ3JhZGUsICdncmFkZScpIDogJycpICtcclxuICAgICAgICAgICAgICAgIChzdWJqZWN0LnJvbGVJbmZvLnNob3dTdWJqZWN0ID8gY3JlYXRlU2VsZWN0KHN1YmplY3Quc3ViamVjdCwgJ3N1YmplY3QnKSA6ICcnKSArXHJcbiAgICAgICAgICAgICAgICAnPC9saT4nO1xyXG4gICAgICAgICAgICAgIGZldGNoUGhhc2UoJ3NlbGVjdCcgKyBpbmRleCwgc3ViamVjdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcjdXNlclN1YmplY3QnKS5maW5kKCcuY2xhc3NJbmZvJykuaHRtbChwZXJzVXNlci5zdWJqZWN0U3RyKVxyXG4gICAgICAgICAgICAkKCcjdXNlclN1YmplY3QnKS5maW5kKCcuY2xhc3NJbmZvU2VsZWN0JykuaHRtbChwZXJzVXNlci5zdWJqZWN0U3RyU2VsZWN0KVxyXG5cclxuICAgICAgICAgIH0gZWxzZSBpZiAocGVyc1VzZXIudXNlclR5cGUgPT0gVVNFUlRZUEUuU1RVREVOVCkge1xyXG4gICAgICAgICAgICAkKCcuYmFzaWNJbmZvcicpLmZpbmQoJyN1c2VyVW5pdCwjdXNlckR1dHksI3VzZXJTdWJqZWN0LCNzdHVDbGFzcycpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgcGVyc1VzZXIuc3R1ZGVudENvZGUgPSBkYXRhLmFjY291bnQudXNlckluZm8uc3R1ZGVudENvZGU7XHJcbiAgICAgICAgICAgIHBlcnNVc2VyLnBhcmVudHNOYW1lID0gZGF0YS5hY2NvdW50LnVzZXJJbmZvLnBhcmVudHNOYW1lO1xyXG4gICAgICAgICAgICBwZXJzVXNlci5wYXJlbnRzUGhvbmUgPSBkYXRhLmFjY291bnQudXNlckluZm8ucGFyZW50c1Bob25lO1xyXG4gICAgICAgICAgICAkKCcjc3R1U2NoTnVtJykuZmluZCgnLmNvbkNlbicpLmF0dHIoeyd2YWx1ZSc6IHBlcnNVc2VyLnN0dWRlbnRDb2RlfSk7XHJcbiAgICAgICAgICAgICQoJyNwZXJOYW1lJykuZmluZCgnLmNvbkNlbicpLmF0dHIoeyd2YWx1ZSc6IHBlcnNVc2VyLnBhcmVudHNOYW1lfSk7XHJcbiAgICAgICAgICAgICQoJyNwZXJQaG9uZScpLmZpbmQoJy5jb25DZW4nKS5hdHRyKHtcclxuICAgICAgICAgICAgICAnZGF0YS1vbGQnOiBwZXJzVXNlci5wYXJlbnRzUGhvbmUsXHJcbiAgICAgICAgICAgICAgJ3ZhbHVlJzogcGVyc1VzZXIucGFyZW50c1Bob25lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBwd2RDdXJbNl0gPSBwZXJzVXNlci5wYXJlbnRzUGhvbmUgPyAxIDogMDtcclxuICAgICAgICAgIH0gZWxzZSBpZiAocGVyc1VzZXIudXNlclR5cGUgPT0gVVNFUlRZUEUuUEFSRU5UKSB7XHJcbiAgICAgICAgICAgICQoJy5iYXNpY0luZm9yJykuZmluZCgnI3VzZXJVbml0LCN1c2VyRHV0eSwjdXNlclN1YmplY3QsI3N0dUdyYWRlLCNzdHVDbGFzcywjc3R1U2NoTnVtLCNwZXJOYW1lLCNwZXJQaG9uZScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICQoJy5wZXJDZW5Db24gLmJhc2ljSW5mb3InKS5yZW1vdmVDbGFzcygnZU1haWxDb2RlSGlkZScpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRhdGEuY29kZSA9PSAnbG9naW5fZXJyb3InKSB7XHJcbiAgICAgICAgICBsYXllci5hbGVydCgn55So5oi35bey6L+H5pyf77yM6K+36YeN5paw55m75b2VJywge2ljb246IDB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG9hdXRoTG9naW4oKVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxheWVyLmFsZXJ0KCfkv6Hmga/liJ3lp4vljJblpLHotKXvvIzor7fliLfmlrDpobXpnaLph43or5XvvIEnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgbGF5ZXIuYWxlcnQoJ+S/oeaBr+WIneWni+WMluWksei0pe+8jOivt+WIt+aWsOmhtemdoumHjeivle+8gScsIHtpY29uOiAwfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8v6LWE5paZ57yW6L6RL+S/neWtmC/lj5bmtojnirbmgIHliIfmjaJcclxuICAgICQoJy5lZGl0QnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY2hhbmdlQ3VyID0gdHJ1ZTtcclxuICAgICAgJCgnLmJpbmRlZCcpLmhpZGUoKTtcclxuICAgICAgJCgnLmJpbmRlZCcpLnNpYmxpbmdzKCdpbnB1dCcpLmNzcygnd2lkdGgnLCAnMjMzcHgnKTtcclxuICAgICAgJCgnLmluZm9yTGlzdCAubW9kTWFyaycpLmFkZENsYXNzKCdpY29uLXN0YXItcHNldWRvJyk7XHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmNlbk1hcmsnKS5hZGRDbGFzcygnY29uQ2hhbmdlJykucmVtb3ZlQXR0cigncmVhZG9ubHkgdW5zZWxlY3RhYmxlJyk7XHJcblxyXG4gICAgICAkKCcucGVyQ2VuQnRuIC5zYXZlQnRuLC5jYW5jZWxCdG4nKS5jc3MoJ2Rpc3BsYXknLCAnaW5saW5lLWJsb2NrJyk7XHJcbiAgICAgICQoJy5wZXJDZW5CdG4gLmVkaXRCdG4nKS5oaWRlKCk7XHJcblxyXG4gICAgICAkKCcuaW5mb3JMaXN0IC5tYlNlbGVjdCcpLnNob3coKTtcclxuICAgICAgJCgnLmluZm9yTGlzdCAubWJTZWxlY3QraW5wdXQnKS5oaWRlKCk7XHJcblxyXG5cclxuICAgICAgJCgnLmluZm9yTGlzdCAuZWRpdEltZycpLnNob3coKTtcclxuXHJcbiAgICAgICQoJy5pbmZvckxpc3QgLmNsdWVzJykuc2hvdygpO1xyXG5cclxuICAgICAgJCgnI2VkaXRJbWcyJykuZmluZCgnZGl2JykuZXEoMSkuY3NzKHsnd2lkdGgnOiAnMTAwJScsICdoZWlnaHQnOiAnMTAwJSd9KTtcclxuXHJcbiAgICAgIC8vIOiBjOWKoeS/oeaBr1xyXG4gICAgICAkKCcuY2xhc3NJbmZvJykuaGlkZSgpO1xyXG4gICAgICAkKCcuY2xhc3NJbmZvU2VsZWN0Jykuc2hvdygpO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdFR5cGUgPT0gJ2luZm9yQ2hhbmdlJykge1xyXG4gICAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuZU1haWxDb2RlJykucmVtb3ZlQ2xhc3MoJ2VNYWlsQ29kZUhpZGUgZU1haWxDb2RlRm9yYmlkJyk7XHJcbiAgICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmVNYWlsQ29kZScpLnJlbW92ZUNsYXNzKCdlTWFpbENvZGVIaWRlIGVNYWlsQ29kZUZvcmJpZCcpO1xyXG4gICAgICAgICQoJyNMb2dpbkVtYWlsQ29kZSwgI3NlY3VyaXR5Q29kZScpLnJlbW92ZUNsYXNzKCdlTWFpbENvZGVIaWRlJykuZmluZCgnLmNvbkNlbicpLnZhbCgnJyk7XHJcbiAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5jbHVlcycpLmh0bWwoJycpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHNlbGVjdFR5cGUgPT09ICdzZWN1cml0eVZlcmlmaWNhdGlvbicpIHtcclxuICAgICAgICAkKCcjc2VjdXJpdHlDb2RlIC5lTWFpbENvZGUnKS5yZW1vdmVDbGFzcygnZU1haWxDb2RlSGlkZSBlTWFpbENvZGVGb3JiaWQnKTtcclxuICAgICAgICAkKCcjc2VjdXJpdHlQaG9uZSAuZU1haWxDb2RlJykucmVtb3ZlQ2xhc3MoJ2VNYWlsQ29kZUhpZGUgZU1haWxDb2RlRm9yYmlkJyk7XHJcbiAgICAgICAgJCgnI3NlY3VyaXR5Q29kZScpLnJlbW92ZUNsYXNzKCdlTWFpbENvZGVIaWRlJykuZmluZCgnLmNvbkNlbicpLnZhbCgnJyk7XHJcbiAgICAgICAgJCgnI3NlY3VyaXR5Q29kZSAuY2x1ZXMnKS5odG1sKCcnKS5jc3MoJ2NvbG9yJywgJyNmZmYnKVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICQoJy5jYW5jZWxCdG4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBub0NoYW5nZSgpO1xyXG4gICAgICAvLyAkKCcjc2V4RWRpdCBpbnB1dCcpLnZhbCgkKCcjc2V4RWRpdCAuc2VsU2hvdycpLmh0bWwoKSlcclxuICAgIH0pO1xyXG4gICAgJCgnLnNhdmVCdG4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBpZiAoc2VsZWN0VHlwZSAhPSAnaW5mb3JDaGFuZ2UnKSB7XHJcbiAgICAgICAgJCgnLmluZm9yTGlzdCAuY2x1ZXMnKS5oaWRlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8v5Z+65pys5L+h5oGv5L+d5a2YXHJcbiAgICAgIGlmIChzZWxlY3RUeXBlID09ICdiYXNpY0luZm9yJykge1xyXG4gICAgICAgIGlmIChwd2RDdXJbM10gPT0gMCkge1xyXG4gICAgICAgICAgJCgnI3VzZXJOYW1lJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaCqOeahOWnk+WQjScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHB3ZEN1cls0XSA9PSAwKSB7XHJcbiAgICAgICAgICAkKCcjdXNlclBob25lJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaCqOeahOiBlOezu+eUteivnScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHB3ZEN1cls2XSA9PSAwICYmIHBlcnNVc2VyLnVzZXJUeXBlID09IFVTRVJUWVBFLlNUVURFTlQpIHtcclxuICAgICAgICAgICQoJyNwZXJQaG9uZScpLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXlrrbplb/nmoTogZTns7vnlLXor50nKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICgkKCcjdXNlckVtYWlsJykuZmluZCgnLmNsdWVzJykuaGFzQ2xhc3MoJ3JlZCcpKSB7XHJcbiAgICAgICAgICAkKCcjdXNlckVtYWlsJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+aCqOi+k+WFpeeahOeUteWtkOmCrueuseS4jeato+ehricpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHVwSW5mb09iaiA9IHt9O1xyXG4gICAgICAgICAgdXBJbmZvT2JqLm5hbWUgPSAkKCcjdXNlck5hbWUnKS5maW5kKCcuY29uQ2VuJykudmFsKCk7XHJcbiAgICAgICAgICB1cEluZm9PYmouc2V4ID0gJCgnI3NleEVkaXQnKS5maW5kKCcuc2VsU2hvdycpLmh0bWwoKSA9PSAn55S3JyA/IDEgOiAyO1xyXG4gICAgICAgICAgdXBJbmZvT2JqLnRlbGVwaG9uZSA9ICQoJyN1c2VyUGhvbmUnKS5maW5kKCcuY29uQ2VuJykudmFsKCk7XHJcbiAgICAgICAgICB1cEluZm9PYmouZW1haWwgPSAkKCcjdXNlckVtYWlsJykuZmluZCgnLmNvbkNlbicpLnZhbCgpO1xyXG4gICAgICAgICAgaWYgKHBlcnNVc2VyLnVzZXJUeXBlID09IFVTRVJUWVBFLlNUVURFTlQpIHtcclxuICAgICAgICAgICAgdXBJbmZvT2JqLnBhcGVyc051bWJlciA9ICQoJyNwZXJQaG9uZScpLmZpbmQoJy5jb25DZW4nKS52YWwoKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIOiBjOWKoeS/oeaBr1xyXG4gICAgICAgICAgdXBJbmZvT2JqLnVzZXJSb2xlcyA9IFtdO1xyXG4gICAgICAgICAgJC5lYWNoKCQoJyN1c2VyU3ViamVjdCcpLmZpbmQoJy5jbGFzc0luZm9TZWxlY3QgLmNsZWFyRml4JyksIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgcm9sZUlkID0gJChpdGVtKS5hdHRyKCdkYXRhLXJvbGUnKTtcclxuICAgICAgICAgICAgdmFyIHBoYXNlSWQgPSAkKGl0ZW0pLmZpbmQoJy5zZWxlY3RfcGhhc2UnKS5wYXJlbnQoKS5hdHRyKCdkYXRhLWlkJyksXHJcbiAgICAgICAgICAgICAgZ3JhZGVJZCA9ICQoaXRlbSkuZmluZCgnLnNlbGVjdF9ncmFkZScpLnBhcmVudCgpLmF0dHIoJ2RhdGEtaWQnKSxcclxuICAgICAgICAgICAgICBzdWJqZWN0SWQgPSAkKGl0ZW0pLmZpbmQoJy5zZWxlY3Rfc3ViamVjdCcpLnBhcmVudCgpLmF0dHIoJ2RhdGEtaWQnKTtcclxuICAgICAgICAgICAgdXBJbmZvT2JqW1widXNlclJvbGVzW1wiICsgaW5kZXggKyBcIl0uaWRcIl0gPSByb2xlSWQ7XHJcbiAgICAgICAgICAgIHVwSW5mb09ialtcInVzZXJSb2xlc1tcIiArIGluZGV4ICsgXCJdLnBoYXNlSWRcIl0gPSBwaGFzZUlkO1xyXG4gICAgICAgICAgICB1cEluZm9PYmpbXCJ1c2VyUm9sZXNbXCIgKyBpbmRleCArIFwiXS5ncmFkZUlkXCJdID0gZ3JhZGVJZDtcclxuICAgICAgICAgICAgdXBJbmZvT2JqW1widXNlclJvbGVzW1wiICsgaW5kZXggKyBcIl0uc3ViamVjdElkXCJdID0gc3ViamVjdElkO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvdXBJbmZvJyxcclxuICAgICAgICAgICAgZGF0YTogdXBJbmZvT2JqLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgPT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydCgn5Z+65pys6LWE5paZ5L+u5pS55oiQ5YqfJywge2ljb246IDB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkKCcucGVyQ2VuU2VsZWN0IC51c2VyTG9nbyAudXNlck5hbWUnKS5odG1sKHVwSW5mb09iai5uYW1lKTtcclxuICAgICAgICAgICAgICAgICQoJyNsb2dpbl9tZXNzYWdlIC5sb2dpbl91c2VybmFtZScpLmh0bWwodXBJbmZvT2JqLm5hbWUgKyAnPHNwYW4gY2xhc3M9XCJhcnJvd1wiPjwvc3Bhbj4nKTtcclxuICAgICAgICAgICAgICAgIGNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn5Z+65pys6LWE5paZ5L+u5pS55aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIOWuieWFqOmqjOivgVxyXG4gICAgICBlbHNlIGlmIChzZWxlY3RUeXBlID09ICdzZWN1cml0eVZlcmlmaWNhdGlvbicpIHtcclxuICAgICAgICBpZiAocHdkQ3VyWzddID09IDApICQoJyNzZWN1cml0eUNvZGUnKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl6aqM6K+B56CBJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxyXG4gICAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL3VjL3ZlcmlmeU1vYmlsZScsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICBtb2JpbGU6ICQoJyNzZWN1cml0eVBob25lIGlucHV0JykudmFsKCkudHJpbSgpLFxyXG4gICAgICAgICAgICAgIGNvZGU6ICQoJyNzZWN1cml0eUNvZGUgaW5wdXQnKS52YWwoKS50cmltKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgIGlmIChyZXNbJ2NvZGUnXSA9PT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydCgn5omL5py65Y+357uR5a6a5oiQ5YqfJywge2ljb246IDB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGxheWVyLmFsZXJ0KCfmiYvmnLrlj7fnu5HlrprlpLHotKXvvIzor7fliLfmlrDpobXpnaLlkI7ph43or5XvvIEnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfmiYvmnLrlj7fnu5HlrprlpLHotKXvvIzor7fliLfmlrDpobXpnaLlkI7ph43or5XvvIEnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIC8v5aS05YOP5L+d5a2YXHJcbiAgICAgIGVsc2UgaWYgKHNlbGVjdFR5cGUgPT0gJ3NldFVzZXJMb2dvJykge1xyXG4gICAgICAgIGlmICh3aW5kb3cucGljVXJsQ3VyKSB7XHJcbiAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi91Yy91cGRhdGVQaG90bycsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAncGhvdG8nOiB3aW5kb3cucGljVXJsSWRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+WktOWDj+S/ruaUueaIkOWKnycsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgICAkKCcucGVyQ2VuU2VsZWN0IC51c2VyTG9nb0NlbiAubG9nb0ltZycpLmF0dHIoJ3NyYycsICQoJyN1c2VyTG9nbyAuVXNlclBpY0ltZyBpbWcnKS5hdHRyKCdzcmMnKSk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2UoKVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn5aS05YOP5L+u5pS55aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5vQ2hhbmdlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9XHJcbiAgICAgIC8v57uR5a6a5L+h5oGv5L+d5a2YXHJcbiAgICAgIGVsc2UgaWYgKHNlbGVjdFR5cGUgPT0gJ2luZm9yQ2hhbmdlJykge1xyXG4gICAgICAgIGlmIChwd2RDdXJbNV0gIT0gMSkge1xyXG4gICAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5jbHVlcycpLnNob3coKS5odG1sKCfmgqjovpPlhaXnmoTnlLXlrZDpgq7nrrHkuI3mraPnoa4nKS5hZGRDbGFzcygncmVkJylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvdmVyaWZ5TWFpbCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAnbWFpbEFkZHJlc3MnOiAkKCcjdXNlckxvZ2luRW1haWwgaW5wdXQnKS52YWwoKSxcclxuICAgICAgICAgICAgICAnY29kZSc6ICQoJyNMb2dpbkVtYWlsQ29kZSBpbnB1dCcpLnZhbCgpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAnc3VjY2VzcycpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnu5Hlrprpgq7nrrHkv67mlLnmiJDlip8nLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgICAgJCgnLnBlckNlbkNvbiAuaW5mb3JDaGFuZ2UgLnBlckNlbkJ0biAuZWRpdEJ0bicpLmh0bWwoJ+abtOaNoumCrueusScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3VzZXJFbWFpbCcpLmZpbmQoJy5jb25DZW4nKS5yZW1vdmVDbGFzcygnY2VuTWFyayBjb25DaGFuZ2UnKS52YWwoJCgnI3VzZXJMb2dpbkVtYWlsIGlucHV0JykudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3VzZXJFbWFpbCcpLmZpbmQoJy5jbHVlcycpLmh0bWwoJ+WmgumcgOS/ruaUueivt+WIsOOAkOe7keWumuS/oeaBr+OAkeS4rei/m+ihjOS/ruaUuScpLmFkZENsYXNzKCdidWxlJyk7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIC8vICQoJyN1c2VyTG9naW5FbWFpbCAuY2x1ZXMnKS5odG1sKCfpqozor4HnoIHlt7Llj5HpgIHvvIzor7fnmbvlvZXpgq7nrrHmn6XnnIsnKS5jc3MoJ2NvbG9yJywnIzFjZDY3NycpXHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNvZGUgPT0gJ2ZhaWxlZCcpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfpqozor4HnoIHplJnor68nLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+e7keWumumCrueuseS/ruaUueWksei0pScsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn57uR5a6a6YKu566x5L+u5pS55aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gICAgLy/lr4bnoIHkv67mlLlcclxuICAgICQoJy5wYXNzV29yZCAucHdkU2F2ZUJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGlmIChwd2RDdXJbMF0gPT0gMSAmJiBwd2RDdXJbMV0gPT0gMSAmJiBwd2RDdXJbMl0gPT0gMSkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvdXBkYXRlUGFzJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgJ29sZFBhcyc6ICQoJyNwcmlDb2RlIGlucHV0JykudmFsKCksXHJcbiAgICAgICAgICAgICduZXdQYXMnOiAkKCcjbmV3UHdkIGlucHV0JykudmFsKClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCflr4bnoIHkv67mlLnmiJDlip8nLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgIC8v5L+u5pS55oiQ5Yqf5ZCO5omn6KGMXHJcbiAgICAgICAgICAgICAgJCgnLnBlckNlbkNvbiAucGFzc1dvcmQgLmNvbkNlbicpLmF0dHIoJ3ZhbHVlJywgJycpLnZhbCgnJyk7XHJcbiAgICAgICAgICAgICAgJCgnLnBlckNlbkNvbiAucGFzc1dvcmQgLmNsdWVzJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuY29kZSA9PSAnbG9naW5fZXJyb3InKSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+eUqOaIt+W3sui/h+acn++8jOivt+mHjeaWsOeZu+W9lScsIHtpY29uOiAwfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+WvhueggeS/ruaUueWksei0pe+8jOivt+WIt+aWsOmhtemdouWQjumHjeivle+8gScsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocHdkQ3VyWzBdICE9IDEpIHtcclxuICAgICAgICAkKCcjcHJpQ29kZScpLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXljp/lr4bnoIEnKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAocHdkQ3VyWzFdICE9IDEpIHtcclxuICAgICAgICAvLyAkKCcjbmV3UHdkJykuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaWsOWvhueggScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgfSBlbHNlIGlmIChwd2RDdXJbMl0gIT0gMSkge1xyXG4gICAgICAgIGlmICgkKCcjYWdhaW5OZXdQd2QgaW5wdXQnKS52YWwoKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAkKCcjYWdhaW5OZXdQd2QnKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5Lik5qyh6L6T5YWl5a+G56CB5LiN5LiA6Ie0JykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKCcjYWdhaW5OZXdQd2QnKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl56Gu6K6k5a+G56CBJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvL+mCrueusemqjOivgeeggeWPkemAgVxyXG4gICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5lTWFpbENvZGUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xyXG4gICAgICB2YXIgdGFyID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG4gICAgICBpZiAocHdkQ3VyWzVdID09IDEpIHtcclxuICAgICAgICBpZiAoISQodGFyKS5oYXNDbGFzcygnZU1haWxDb2RlRm9yYmlkJykpIHtcclxuICAgICAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuY2x1ZXMnKS5odG1sKCfpgq7ku7bmraPlnKjlj5HpgIHkuK0uLi4nKS5zaG93KCkuY3NzKCdjb2xvcicsICcjMWNkNjc3Jyk7XHJcbiAgICAgICAgICAkKCcjdXNlckxvZ2luRW1haWwgLmNvbkNlbicpLmF0dHIoeydyZWFkb25seSc6ICdyZWFkb25seScsICd1bnNlbGVjdGFibGUnOiAnb24nfSk7XHJcbiAgICAgICAgICAkKHRhcikuYWRkQ2xhc3MoJ2VNYWlsQ29kZUZvcmJpZCcpO1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvbWFpbFNlbmQnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgJ21haWxBZGRyZXNzJzogJCgnI3VzZXJMb2dpbkVtYWlsIGlucHV0JykudmFsKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5jbHVlcycpLmh0bWwoJ+mqjOivgeeggeW3suWPkemAge+8jOivt+eZu+W9lemCrueuseafpeeciycpLnNob3coKS5jc3MoJ2NvbG9yJywgJyMxY2Q2NzcnKVxyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoJyN1c2VyTG9naW5FbWFpbCAuY2x1ZXMnKS5odG1sKCfpqozor4HnoIHlj5HpgIHlpLHotKUnKS5zaG93KCkuY3NzKCdjb2xvcicsICdyZWQnKVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydCgn6aqM6K+B56CB5Y+R6YCB5aSx6LSlJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgICAgICQodGFyKS5yZW1vdmVDbGFzcygnZU1haWxDb2RlRm9yYmlkJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcjdXNlckxvZ2luRW1haWwgLmNvbkNlbicpLnJlbW92ZUF0dHIoJ3JlYWRvbmx5IHVuc2VsZWN0YWJsZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI3VzZXJMb2dpbkVtYWlsIC5jbHVlcycpLmh0bWwoZGF0YS5tc2cgfHwgJ+mqjOivgeeggeWPkemAgeWksei0pScpLnNob3coKS5jc3MoJ2NvbG9yJywgJ3JlZCcpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydCgn6aqM6K+B56CB5Y+R6YCB5aSx6LSl77yM6K+35Yi35paw6aG16Z2i5ZCO6YeN6K+V77yBJywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG1haWxWYWxpZGF0ZSgkKFwiI3VzZXJMb2dpbkVtYWlsIC5jb25DZW5cIikudmFsKCkudHJpbSgpLCAkKFwiI3VzZXJMb2dpbkVtYWlsXCIpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvLyDmiYvmnLrpqozor4HnoIHlj5HpgIFcclxuICAgICQoJy5zZWN1cml0eVZlcmlmaWNhdGlvbiAuZU1haWxDb2RlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcclxuICAgICAgdmFyIHRhciA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuICAgICAgdmFyIG1vYmlsZSA9ICQoJyNzZWN1cml0eVBob25lIGlucHV0JykudmFsKCkudHJpbSgpO1xyXG4gICAgICBpZiAocHdkQ3VyWzhdID09IDEpIHtcclxuICAgICAgICBpZiAoISQodGFyKS5oYXNDbGFzcygnZU1haWxDb2RlRm9yYmlkJykpIHtcclxuICAgICAgICAgICQoJyNzZWN1cml0eVBob25lIC5jbHVlcycpLmh0bWwoJ+mqjOivgeeggeato+WcqOWPkemAgeS4rS4uLicpLnNob3coKS5jc3MoJ2NvbG9yJywgJyMxY2Q2NzcnKTtcclxuICAgICAgICAgICQoJyNzZWN1cml0eVBob25lIC5jb25DZW4nKS5hdHRyKHsncmVhZG9ubHknOiAncmVhZG9ubHknLCAndW5zZWxlY3RhYmxlJzogJ29uJ30pO1xyXG4gICAgICAgICAgJCh0YXIpLmFkZENsYXNzKCdlTWFpbENvZGVGb3JiaWQnKTtcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL3VjL3NlbmRNb2JpbGVDb2RlJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICdtb2JpbGUnOiBtb2JpbGVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI3NlY3VyaXR5UGhvbmUgLmNsdWVzJykuaHRtbCgn6aqM6K+B56CB5bey5Y+R6YCB77yM6K+35rOo5oSP5p+l5pS2Jykuc2hvdygpLmNzcygnY29sb3InLCAnIzFjZDY3NycpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09ICdsb2dpbl9lcnJvcicpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfnlKjmiLflt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZUnLCB7aWNvbjogMH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgb2F1dGhMb2dpbigpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoJyNzZWN1cml0eVBob25lIC5jbHVlcycpLmh0bWwoJ+mqjOivgeeggeWPkemAgeWksei0pScpLnNob3coKS5jc3MoJ2NvbG9yJywgJ3JlZCcpXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfpqozor4HnoIHlj5HpgIHlpLHotKUnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgICAgJCh0YXIpLnJlbW92ZUNsYXNzKCdlTWFpbENvZGVGb3JiaWQnKTtcclxuICAgICAgICAgICAgICAgICQoJyNzZWN1cml0eVBob25lIC5jbHVlcycpLmh0bWwoJ+mqjOivgeeggeWPkemAgeWksei0pScpLnNob3coKS5jc3MoJ2NvbG9yJywgJ3JlZCcpXHJcbiAgICAgICAgICAgICAgICAkKCcjc2VjdXJpdHlQaG9uZSAuY29uQ2VuJykucmVtb3ZlQXR0cigncmVhZG9ubHkgdW5zZWxlY3RhYmxlJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAkKCcjc2VjdXJpdHlQaG9uZSAuY2x1ZXMnKS5odG1sKCfpqozor4HnoIHlj5HpgIHlpLHotKUnKS5zaG93KCkuY3NzKCdjb2xvcicsICdyZWQnKVxyXG4gICAgICAgICAgICAgICQodGFyKS5yZW1vdmVDbGFzcygnZU1haWxDb2RlRm9yYmlkJyk7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+mqjOivgeeggeWPkemAgeWksei0pe+8jOivt+WIt+aWsOmhtemdouWQjumHjeivle+8gScsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgbXNnID0gJ+ivt+i+k+WFpeaCqOeahOaJi+acuuWPtyc7XHJcbiAgICAgICAgaWYgKG1vYmlsZSAhPSAnJyAmJiAhL14xWzM0NTc4XVxcZHs5fSQvLnRlc3QobW9iaWxlKSkge1xyXG4gICAgICAgICAgbXNnID0gJ+aJi+acuuWPt+eggeagvOW8j+S4jeato+ehric7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQodGFyKS5wYXJlbnQoKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbChtc2cpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIC8v6YCJ6aG55Y2h5YiH5o2iXHJcbiAgICAkKCcucGVyQ2VuU2VsZWN0IC5zZWxMaXN0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcclxuICAgICAgdmFyIHRhciA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuICAgICAgdmFyIHRhclAgPSAkKHRhcikuaGFzQ2xhc3MoJ3NlbExpc3QnKSA/ICQodGFyKSA6ICQodGFyKS5wYXJlbnQoKTtcclxuICAgICAgc2VsZWN0VHlwZSA9ICQodGFyUCkuYXR0cignZGF0YV90eXBlJyk7XHJcbiAgICAgIHRhclAuYWRkQ2xhc3MoJ3NlbGVjdCcpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdCcpO1xyXG4gICAgICAkKCcucGVyQ2VuQ29uIC5iYXNpY0luZm9yLCAuc2VjdXJpdHlWZXJpZmljYXRpb24sIC5zZXRVc2VyTG9nbywgLnBhc3NXb3JkLCAuaW5mb3JDaGFuZ2UnKS5oaWRlKCk7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLmNlbkNvblRpdGxlJykuaHRtbCgkKHRhclApLmZpbmQoJ3AnKS5odG1sKCkpO1xyXG4gICAgICAkKCcucGVyQ2VuQ29uIC4nICsgc2VsZWN0VHlwZSkuc2hvdygpO1xyXG4gICAgICBub0NoYW5nZSgpO1xyXG4gICAgICBpZiAoc2VsZWN0VHlwZSA9PSAncGFzc1dvcmQnKSB7XHJcbiAgICAgICAgY2hhbmdlQ3VyID0gdHJ1ZTtcclxuICAgICAgICAkKCcucGVyQ2VuQ29uIC5wYXNzV29yZCAuY29uQ2VuJykudmFsKCcnKTtcclxuICAgICAgICBwd2RDdXJbMF0gPSAwO1xyXG4gICAgICAgIHB3ZEN1clsxXSA9IDA7XHJcbiAgICAgICAgcHdkQ3VyWzJdID0gMDtcclxuICAgICAgfVxyXG4gICAgICAkKCcucGVyQ2VuQ29uIC5zdWJUaXRsZScpLmhpZGUoKS5yZW1vdmVDbGFzcygnY3VycicpO1xyXG4gICAgICBpZiAoc2VsZWN0VHlwZSA9PT0gJ2luZm9yQ2hhbmdlJykge1xyXG4gICAgICAgICQoJy5wZXJDZW5Db24gLmNlbkNvblRpdGxlJykuaHRtbCgn6YKu566x57uR5a6aJyk7XHJcbiAgICAgICAgJCgnLnBlckNlbkNvbiAuY2VuQ29uVGl0bGUnKS5hZGRDbGFzcygnY2VuQ29uVGl0bGUxJyk7XHJcbiAgICAgICAgJCgnLnBlckNlbkNvbiAuc3ViVGl0bGUnKS5zaG93KCk7XHJcbiAgICAgICAgLy8g6YCJ5a6a57uR5a6a6YKu566xXHJcbiAgICAgICAgJCgnLnBlckNlbkNvbiAuY2VuQ29uVGl0bGUnKS5hZGRDbGFzcygnY3VycicpO1xyXG4gICAgICAgICQoJy5wZXJDZW5Db24gLmluZm9yQ2hhbmdlJykuc2hvdygpO1xyXG4gICAgICAgICQoJy5wZXJDZW5Db24gLnNlY3VyaXR5VmVyaWZpY2F0aW9uJykuaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDnu5Hlrprkv6Hmga90YWLliIfmjaJcclxuICAgICQoJy5wZXJDZW5Db24nKS5vbignY2xpY2snLCAnLmNlbkNvblRpdGxlMSwgLnN1YlRpdGxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBub0NoYW5nZSgpO1xyXG4gICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2N1cnInKTtcclxuICAgICAgJCh0aGlzKS5hZGRDbGFzcygnY3VycicpO1xyXG5cclxuICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2NlbkNvblRpdGxlJykpIHtcclxuICAgICAgICBzZWxlY3RUeXBlID0gJ2luZm9yQ2hhbmdlJztcclxuICAgICAgICAkKCcucGVyQ2VuQ29uIC5pbmZvckNoYW5nZScpLnNob3coKTtcclxuICAgICAgICAkKCcucGVyQ2VuQ29uIC5zZWN1cml0eVZlcmlmaWNhdGlvbicpLmhpZGUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoIXBlcnNVc2VyLmJvdW5kUGhvbmUpICQoJy5zZWN1cml0eVZlcmlmaWNhdGlvbiAuZWRpdEJ0bicpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcbiAgICAgICAgc2VsZWN0VHlwZSA9ICdzZWN1cml0eVZlcmlmaWNhdGlvbic7XHJcbiAgICAgICAgJCgnLnBlckNlbkNvbiAuaW5mb3JDaGFuZ2UnKS5oaWRlKCk7XHJcbiAgICAgICAgJCgnLnBlckNlbkNvbiAuc2VjdXJpdHlWZXJpZmljYXRpb24nKS5zaG93KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S65a6J5YWo6aqM6K+BXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNob3dTZWN1cml0eSgpIHtcclxuICAgICAgc2VsZWN0VHlwZSA9ICdzZWN1cml0eVZlcmlmaWNhdGlvbic7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLmNlbkNvblRpdGxlJykuaHRtbCgn5a6J5YWo6aqM6K+BJyk7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLmJhc2ljSW5mb3InKS5oaWRlKCk7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLnNlY3VyaXR5VmVyaWZpY2F0aW9uJykuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWuieWFqOmqjOivgeWPlua2iFxyXG4gICAgJCgnLmNhbmNlbEJ0bjEnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGVjdFR5cGUgPSAnYmFzaWNJbmZvcic7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLmNlbkNvblRpdGxlJykuaHRtbCgn5Z+65pys6LWE5paZJyk7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLmJhc2ljSW5mb3InKS5zaG93KCk7XHJcbiAgICAgICQoJy5wZXJDZW5Db24gLnNlY3VyaXR5VmVyaWZpY2F0aW9uJykuaGlkZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy9pbnB1dOaTjeS9nFxyXG4gICAgJChkb2N1bWVudCkub24oJ2JsdXInLCAnLnBlckNlbkNvbiAuY29uQ2VuJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcclxuICAgICAgdmFyIHRhciA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuICAgICAgdmFyIHRhclAgPSAkKHRhcikucGFyZW50KCk7XHJcbiAgICAgIHZhciB0YXJWYWwgPSAkKHRhcikudmFsKCkudHJpbSgpO1xyXG4gICAgICBpZiAoY2hhbmdlQ3VyKSB7XHJcbiAgICAgICAgaWYgKHRhclAuYXR0cignaWQnKSA9PSAndXNlck5hbWUnKSB7XHJcbiAgICAgICAgICBpZiAodGFyVmFsLm1hdGNoKCdeW0EtWmEtejAtOVxcdTRlMDAtXFx1OWZhNV0rJCcpKSB7XHJcbiAgICAgICAgICAgIHB3ZEN1clszXSA9IDE7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuaGlkZSgpLmh0bWwoJ+ivt+i+k+WFpeaCqOeahOWnk+WQjScpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGFyVmFsID09ICcnKSB7XHJcbiAgICAgICAgICAgIHB3ZEN1clszXSA9IDA7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaCqOeahOWnk+WQjScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHB3ZEN1clszXSA9IDA7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+aCqOi+k+WFpeeahOWnk+WQjeS4jeato+ehricpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRhclAuYXR0cignaWQnKSA9PT0gJ3NlY3VyaXR5UGhvbmUnKSB7XHJcbiAgICAgICAgICBpZiAoL14xWzM0NTc4XVxcZHs5fSQvLnRlc3QodGFyVmFsKSkge1xyXG4gICAgICAgICAgICBwd2RDdXJbOF0gPSAxO1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLmhpZGUoKS5odG1sKCfmiYvmnLrlj7fnoIHmoLzlvI/kuI3mraPnoa4nKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRhclZhbCA9PSAnJykge1xyXG4gICAgICAgICAgICBwd2RDdXJbOF0gPSAwO1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXmgqjnmoTmiYvmnLrlj7cnKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwd2RDdXJbOF0gPSAwO1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfmiYvmnLrlj7fnoIHmoLzlvI/kuI3mraPnoa4nKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJQLmF0dHIoJ2lkJykgPT0gJ3NlY3VyaXR5Q29kZScpIHtcclxuICAgICAgICAgIGlmICh0YXJWYWwpIHtcclxuICAgICAgICAgICAgcHdkQ3VyWzddID0gMTtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5oaWRlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwd2RDdXJbN10gPSAwO1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXpqozor4HnoIEnKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJQLmF0dHIoJ2lkJykgPT0gJ3VzZXJQaG9uZScpIHtcclxuICAgICAgICAgIGlmICgvXihcXChcXGR7Myw0fVxcKXxcXGR7Myw0fS18XFxzKT9cXGR7NywxNH0kLy50ZXN0KHRhclZhbCkgfHwgL14xWzM0NTc4XVxcZHs5fSQvLnRlc3QodGFyVmFsKSkge1xyXG4gICAgICAgICAgICBwd2RDdXJbNF0gPSAxO1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLmhpZGUoKS5odG1sKCfor7fovpPlhaXogZTns7vnlLXor50nKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRhclZhbCA9PSAnJykge1xyXG4gICAgICAgICAgICBwd2RDdXJbNF0gPSAxO1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLmhpZGUoKS5odG1sKCfor7fovpPlhaXogZTns7vnlLXor50nKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwd2RDdXJbNF0gPSAwO1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfmgqjovpPlhaXnmoTogZTns7vnlLXor53kuI3mraPnoa4nKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJQLmF0dHIoJ2lkJykgPT0gJ3BlclBob25lJykge1xyXG4gICAgICAgICAgaWYgKC9eKFxcKFxcZHszLDR9XFwpfFxcZHszLDR9LXxcXHMpP1xcZHs3LDE0fSQvLnRlc3QodGFyVmFsKSB8fCAvXjFbMzQ1NzhdXFxkezl9JC8udGVzdCh0YXJWYWwpKSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls2XSA9IDE7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuaGlkZSgpLmh0bWwoJ+ivt+i+k+WFpeiBlOezu+eUteivnScpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGFyVmFsID09ICcnKSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls2XSA9IDA7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeiBlOezu+eUteivnScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHB3ZEN1cls2XSA9IDA7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+aCqOi+k+WFpeeahOiBlOezu+eUteivneS4jeato+ehricpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRhclAuYXR0cignaWQnKSA9PSAndXNlckVtYWlsJyB8fCB0YXJQLmF0dHIoJ2lkJykgPT0gJ3VzZXJMb2dpbkVtYWlsJykge1xyXG4gICAgICAgICAgaWYgKCQoJyN1c2VyTG9naW5FbWFpbCAuZU1haWxDb2RlJykuaGFzQ2xhc3MoJ2VNYWlsQ29kZUZvcmJpZCcpICYmIHNlbGVjdFR5cGUgPT0gJ2luZm9yQ2hhbmdlJykge1xyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1haWxWYWxpZGF0ZSh0YXJWYWwsIHRhclApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHRhclAuYXR0cignaWQnKSA9PSAncHJpQ29kZScpIHtcclxuICAgICAgICAgIGlmICh0YXJWYWwubWF0Y2goJ15cXFxcU3s2LDIwfSQnKSkge1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLmhpZGUoKS5odG1sKCfor7fovpPlhaXmgqjnmoTljp/lp4vlr4bnoIEnKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgIHB3ZEN1clswXSA9IDE7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRhclZhbCA9PSAnJykge1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfor7fovpPlhaXljp/lr4bnoIEnKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgIHB3ZEN1clswXSA9IDA7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfmgqjovpPlhaXnmoTljp/lr4bnoIHkuI3mraPnoa4nKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgIHB3ZEN1clswXSA9IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJQLmF0dHIoJ2lkJykgPT0gJ25ld1B3ZCcpIHtcclxuICAgICAgICAgIGlmICh0YXJWYWwubWF0Y2goJ15cXFxcU3s2LDIwfSQnKSkge1xyXG4gICAgICAgICAgICBpZiAodGFyVmFsICE9ICQoJyNhZ2Fpbk5ld1B3ZCcpLmZpbmQoJ2lucHV0JykudmFsKCkgJiYgcHdkQ3VyWzJdID09IDEpIHtcclxuICAgICAgICAgICAgICAkKCcjYWdhaW5OZXdQd2QnKS5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5Lik5qyh6L6T5YWl5a+G56CB5LiN5LiA6Ie0JykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICAgIHB3ZEN1clsyXSA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGFyVmFsID09ICQoJyNhZ2Fpbk5ld1B3ZCcpLmZpbmQoJ2lucHV0JykudmFsKCkpIHtcclxuICAgICAgICAgICAgICAkKCcjYWdhaW5OZXdQd2QnKS5maW5kKCcuY2x1ZXMnKS5oaWRlKCkuaHRtbCgn5Lik5qyh6L6T5YWl5a+G56CB5LiN5LiA6Ie0JykucmVtb3ZlQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICAgIHB3ZEN1clsyXSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5oaWRlKCkuaHRtbCgnNi0yMOS9jeWtl+espu+8jOW7uuiuruaVsOWtl+OAgeWtl+avjeOAgeagh+eCueespuWPt+e7hOWQiCcpLnJlbW92ZUNsYXNzKCdyZWQnKTtcclxuICAgICAgICAgICAgcHdkQ3VyWzFdID0gMTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodGFyVmFsID09ICcnKSB7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJ+ivt+i+k+WFpeaWsOWvhueggScpLmFkZENsYXNzKCdyZWQnKTtcclxuICAgICAgICAgICAgcHdkQ3VyWzFdID0gMDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhclAuZmluZCgnLmNsdWVzJykuc2hvdygpLmh0bWwoJzYtMjDkvY3lrZfnrKbvvIzlu7rorq7mlbDlrZfjgIHlrZfmr43jgIHmoIfngrnnrKblj7fnu4TlkIgnKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgIHB3ZEN1clsxXSA9IDA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJQLmF0dHIoJ2lkJykgPT0gJ2FnYWluTmV3UHdkJykge1xyXG4gICAgICAgICAgaWYgKHRhclZhbC5tYXRjaCgnXlxcXFxTezYsMjB9JCcpKSB7XHJcbiAgICAgICAgICAgIGlmICh0YXJWYWwgIT0gJCgnI25ld1B3ZCcpLmZpbmQoJ2lucHV0JykudmFsKCkpIHtcclxuICAgICAgICAgICAgICB0YXJQLmZpbmQoJy5jbHVlcycpLnNob3coKS5odG1sKCfkuKTmrKHovpPlhaXlr4bnoIHkuI3kuIDoh7QnKS5hZGRDbGFzcygncmVkJyk7XHJcbiAgICAgICAgICAgICAgaWYgKHB3ZEN1clsxXSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBwd2RDdXJbMl0gPSAwO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwd2RDdXJbMl0gPSAxO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5oaWRlKCkuaHRtbCgn6K+36L6T5YWl56Gu6K6k5a+G56CBJykucmVtb3ZlQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICAgIHB3ZEN1clsyXSA9IDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmICh0YXJWYWwgPT0gJycpIHtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl5YaN5qyh6L6T5YWl5paw5a+G56CBJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICBwd2RDdXJbMl0gPSAwO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5Lik5qyh6L6T5YWl5a+G56CB5LiN5LiA6Ie0JykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgICAgICBwd2RDdXJbMl0gPSAwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkKGRvY3VtZW50KS5vbignZm9jdXMnLCAnLnBlckNlbkNvbiAuY29uQ2VuJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcclxuICAgICAgdmFyIHRhciA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuICAgICAgdmFyIHRhclAgPSAkKHRhcikucGFyZW50KCk7XHJcbiAgICAgIGlmIChzZWxlY3RUeXBlICE9ICdpbmZvckNoYW5nZScpIHtcclxuICAgICAgICAkKHRhclApLmZpbmQoJy5jbHVlcycpLmhpZGUoKS5yZW1vdmVDbGFzcygncmVkJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBtYWlsVmFsaWRhdGUodGFyVmFsLCB0YXJQKSB7XHJcbiAgICAgIGlmICh0YXJWYWwubWF0Y2goJ15bMC05YS16QS1aXStAKChbMC05YS16QS1aXSspWy5dKStbYS16XXsyLDR9JCcpKSB7XHJcbiAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5oaWRlKCkuaHRtbCgnJykucmVtb3ZlQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIHB3ZEN1cls1XSA9IDE7XHJcbiAgICAgIH0gZWxzZSBpZiAodGFyVmFsICE9ICcnKSB7XHJcbiAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn5oKo6L6T5YWl55qE55S15a2Q6YKu566x5LiN5q2j56GuJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIHB3ZEN1cls1XSA9IDA7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGFyUC5maW5kKCcuY2x1ZXMnKS5zaG93KCkuaHRtbCgn6K+36L6T5YWl5oKo55qE55S15a2Q6YKu566xJykuYWRkQ2xhc3MoJ3JlZCcpO1xyXG4gICAgICAgIHB3ZEN1cls1XSA9IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufSlcclxuXHJcbiJdfQ==
