require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  },
  enforeDefine: true
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  require(['jquery', 'tools', 'header', 'footer', 'service', 'webuploader', 'layer', 'template'], function ($, tools, header, footer, service, WebUploader, layer, template) {
    function getPicPath(id) {
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'] : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
      ;
    }

    $(function () {
      var uploadUrl = service.path_url['upload_url'].substring(0, 4) === 'http' ? service.path_url['upload_url'] : (service.htmlHost + service.path_url['upload_url']);
      var uploader = WebUploader.create({
        // swf文件路径
        swf: '../../../../lib/component/upload/image-js/Uploader.swf',
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
        fileSizeLimit: 20 * 1024 * 1024 * 1024,    // 20G
        fileSingleSizeLimit: 5 * 1024 * 1024 * 1024    // 5G
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
        console.log(ret)
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
    })


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
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
    }

    //无修改恢复数据
    function noChange() {
      changeCur = false;
      handleBinded();
      $('.conLeft .modMark').removeClass('icon-star-pseudo');
      $('.inforList .cenMark').removeClass('conChange').attr({'readonly': 'readonly', 'unselectable': 'on'});

      $('.perCenBtn .saveBtn,.cancelBtn').hide();
      $('.perCenBtn .editBtn').show();
      $('#userDuty .mbSelect').hide().find('.selShow').html($('#userDuty .mbSelect+input').val());
      $('#userDuty .mbSelect+input').show();
      $('#sexEdit .mbSelect').hide().find('.selShow').html($('#sexEdit .mbSelect+input').val());
      $('#sexEdit .mbSelect+input').show();

      $('.inforList .subSelGat .mbSelect').addClass('mbNoSelect');

      $('.cenMark').each(function (i) {
        $('.cenMark').eq(i).attr('value', $(this).attr('data-old')).val($(this).attr('data-old'))
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
      $('.inforList .cenMark').removeClass('conChange').attr({'readonly': 'readonly', 'unselectable': 'on'});

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
      return '<div class="mbSelect mbSelectSmaill" readonly>' +
        '<p class="selShow">' + text + '</p>' +
        '<ul class="mbSel select_' + classSuffix + '">' +
        '</ul>' +
        '</div>'
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
        handleErr('学段数据请求错误，请刷新重试')
      });
    }

    function fetchGrade(id, phaseId, text) {
      $.getJSON(service.htmlHost + '/pf/api/meta/orgGrade?orgId=' + persUser['orgId'] + '&phaseId=' + phaseId,
        function (res) {
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
        }
      ).error(function (err) {
        handleErr('年级数据请求错误，请刷新重试')
      });
    }

    function fetchSubject(id, phaseId, text) {
      $.getJSON(service.htmlHost + '/pf/api/meta/orgSubject?orgId=' + persUser['orgId'] + '&phaseId=' + phaseId,
        function (res) {
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
        handleErr('学科数据请求错误，请刷新重试')
      });
    }

    function handleErr(msg) {
      layer.alert(msg, {icon: 0});
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
      success: function (data) {
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
          persUser.boundPhone = (data.account.cellphone && data.account.cellphone != -1) ? data.account.cellphone : '';
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
          $('#userLogo .UserPicImg img').attr({'src': persUser.photo, 'data-old': persUser.photo});
          $('#userName').find('.conCen').attr({'data-old': persUser.name, 'value': persUser.name});
          $('#userNum').find('.conCen').attr({'value': persUser.account});
          $('#sexEdit').find('.conCen').attr({'data-old': persUser.sex, 'value': persUser.sex});
          $('#sexEdit').find('.selShow').html(persUser.sex);
          $('#userPhone').find('.conCen').attr({'data-old': persUser.telephone, 'value': persUser.telephone});
          $('#userEmail').find('.conCen').attr({'data-old': persUser.email, 'value': persUser.email});
          if (!persUser.boundEmail) {
            $('.perCenCon .inforChange .perCenBtn .editBtn').html('绑定邮箱')
          }
          if (!persUser.boundPhone) {
            $('.perCenCon .securityVerification .perCenBtn .editBtn').html('绑定手机号')
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
            $('#userUnit').find('.conCen').attr({'data-old': persUser.orgName, 'value': persUser.orgName});
            persUser.subjectStr = '';
            $.each(persUser.userSubject, function (index, subject) {
              subject.phase = subject.phase || '';
              subject.subject = subject.subject || '';
              subject.role = subject.role || '';
              persUser.subjectStr += '<li class="clearFix">' +
                '<span>' + subject.role + '</span>' +
                '<span>' + subject.phase + '</span>' +
                '<span>' + subject.subject + '</span>' +
                '</li>'
            });
            $('#userSubject').find('.classInfo').html(persUser.subjectStr);

          } else if (persUser.userType == USERTYPE.TEACHER) {
            $('.basicInfor').find('#stuGrade,#stuClass,#stuSchNum,#perName,#perPhone').remove();

            persUser.orgName = data.account.userInfo.orgName || '';
            persUser.userSubject = data.roles || '';
            $('#userUnit').find('.conCen').attr({'data-old': persUser.orgName, 'value': persUser.orgName});
            persUser.subjectStr = '';
            persUser.subjectStrSelect = '';
            $.each(persUser.userSubject, function (index, subject) {
              subject.phase = subject.phase || '';
              subject.grade = subject.grade || '';
              subject.subject = subject.subject || '';
              subject.role = subject.role || '';
              persUser.subjectStr += '<li class="clearFix">' +
                '<span>' + subject.role + '</span>' +
                '<span>' + subject.phase + '</span>' +
                '<span>' + subject.grade + '</span>' +
                '<span>' + subject.subject + '</span>' +
                '</li>'
              persUser.subjectStrSelect += '<li class="clearFix" data-role="' + subject['id'] + '" id="select' + index + '">' +
                '<span>' + subject.role + '</span>' +
                (subject.roleInfo.showPhase ? createSelect(subject.phase, 'phase') : '') +
                (subject.roleInfo.showGrade ? createSelect(subject.grade, 'grade') : '') +
                (subject.roleInfo.showSubject ? createSelect(subject.subject, 'subject') : '') +
                '</li>';
              /*fetchPhase('select' + index, subject);*/
            });
            $('#userSubject').find('.classInfo').html(persUser.subjectStr)
            $('#userSubject').find('.classInfoSelect').html(persUser.subjectStrSelect)

          } else if (persUser.userType == USERTYPE.STUDENT) {
            $('.basicInfor').find('#userUnit,#userDuty,#userSubject,#stuClass').remove();

            persUser.studentCode = data.account.userInfo.studentCode;
            persUser.parentsName = data.account.userInfo.parentsName;
            persUser.parentsPhone = data.account.userInfo.parentsPhone;
            $('#stuSchNum').find('.conCen').attr({'value': persUser.studentCode});
            $('#perName').find('.conCen').attr({'value': persUser.parentsName});
            $('#perPhone').find('.conCen').attr({
              'data-old': persUser.parentsPhone,
              'value': persUser.parentsPhone
            });
            pwdCur[6] = persUser.parentsPhone ? 1 : 0;
          } else if (persUser.userType == USERTYPE.PARENT) {
            $('.basicInfor').find('#userUnit,#userDuty,#userSubject,#stuGrade,#stuClass,#stuSchNum,#perName,#perPhone').remove();
          }

          $('.perCenCon .basicInfor').removeClass('eMailCodeHide')
        }
        else if (data.code == 'login_error') {
          layer.alert('用户已过期，请重新登录', {icon: 0}, function () {
            oauthLogin()
          });
        } else {
          layer.alert('信息初始化失败，请刷新页面重试！', {icon: 0});
        }
      },
      error: function (data) {
        layer.alert('信息初始化失败，请刷新页面重试！', {icon: 0});
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

      $('#editImg2').find('div').eq(1).css({'width': '100%', 'height': '100%'});

      // 职务信息
      $('.classInfo').hide();
      $('.classInfoSelect').show();

      if (selectType == 'inforChange') {
        $('#userLoginEmail .eMailCode').removeClass('eMailCodeHide eMailCodeForbid');
        $('#securityPhone .eMailCode').removeClass('eMailCodeHide eMailCodeForbid');
        $('#LoginEmailCode, #securityCode').removeClass('eMailCodeHide').find('.conCen').val('');
        $('#userLoginEmail .clues').html('').css('color', '#fff')
      }
      if (selectType === 'securityVerification') {
        $('#securityCode .eMailCode').removeClass('eMailCodeHide eMailCodeForbid');
        $('#securityPhone .eMailCode').removeClass('eMailCodeHide eMailCodeForbid');
        $('#securityCode').removeClass('eMailCodeHide').find('.conCen').val('');
        $('#securityCode .clues').html('').css('color', '#fff')
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
            upInfoObj.papersNumber = $('#perPhone').find('.conCen').val()
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
            success: function (data) {
              if (data.code == 'success') {
                layer.alert('基本资料修改成功', {icon: 0}, function () {
                  location.reload();
                });
                $('.perCenSelect .userLogo .userName').html(upInfoObj.name);
                $('#login_message .login_username').html(upInfoObj.name + '<span class="arrow"></span>');
                change();
              } else if (data.code == 'login_error') {
                layer.alert('用户已过期，请重新登录', {icon: 0}, function () {
                  oauthLogin()
                });
              } else {
                layer.alert(data.msg, {icon: 0});
              }
            },
            error: function (data) {
              layer.alert('基本资料修改失败，请刷新页面后重试！', {icon: 0});
            }
          });
        }
      }
      // 安全验证
      else if (selectType == 'securityVerification') {
        if (pwdCur[7] == 0) $('#securityCode').find('.clues').show().html('请输入验证码').addClass('red');
        else {
          $.ajax({
            type: 'post',
            url: service.htmlHost + '/pf/uc/verifyMobile',
            data: {
              mobile: $('#securityPhone input').val().trim(),
              code: $('#securityCode input').val().trim()
            },
            success: function (res) {
              if (res['code'] === 'success') {
                layer.alert('手机号绑定成功', {icon: 0}, function () {
                  location.reload();
                });
              } else layer.alert('手机号绑定失败，请刷新页面后重试！', {icon: 0});
            },
            error: function (err) {
              layer.alert('手机号绑定失败，请刷新页面后重试！', {icon: 0});
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
            success: function (data) {
              if (data.code == 'success') {
                layer.alert('头像修改成功', {icon: 0});
                $('.perCenSelect .userLogoCen .logoImg').attr('src', $('#userLogo .UserPicImg img').attr('src'));
                change()
              } else if (data.code == 'login_error') {
                layer.alert('用户已过期，请重新登录', {icon: 0}, function () {
                  oauthLogin()
                });
              } else {
                layer.alert(data.msg, {icon: 0});
              }
            },
            error: function (data) {
              layer.alert('头像修改失败，请刷新页面后重试！', {icon: 0});
            }
          });
        } else {
          noChange()
        }

      }
      //绑定信息保存
      else if (selectType == 'inforChange') {
        if (pwdCur[5] != 1) {
          $('#userLoginEmail .clues').show().html('您输入的电子邮箱不正确').addClass('red')
        } else {
          $.ajax({
            type: "post",
            url: service.htmlHost + '/pf/uc/verifyMail',
            data: {
              'mailAddress': $('#userLoginEmail input').val(),
              'code': $('#LoginEmailCode input').val()
            },
            success: function (data) {
              if (data.code == 'success') {
                layer.alert('绑定邮箱修改成功', {icon: 0});
                $('.perCenCon .inforChange .perCenBtn .editBtn').html('更换邮箱');
                $('#userEmail').find('.conCen').removeClass('cenMark conChange').val($('#userLoginEmail input').val());
                $('#userEmail').find('.clues').html('如需修改请到【绑定信息】中进行修改').addClass('bule');
                change();
                // $('#userLoginEmail .clues').html('验证码已发送，请登录邮箱查看').css('color','#1cd677')
              } else if (data.code == 'failed') {
                layer.alert('验证码错误', {icon: 0});
              } else if (data.code == 'login_error') {
                layer.alert('用户已过期，请重新登录', {icon: 0}, function () {
                  oauthLogin()
                });
              } else {
                layer.alert('绑定邮箱修改失败', {icon: 0});
              }
            },
            error: function (data) {
              layer.alert('绑定邮箱修改失败，请刷新页面后重试！', {icon: 0});
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
          success: function (data) {
            if (data.code == 'success') {
              layer.alert('密码修改成功', {icon: 0});
              //修改成功后执行
              $('.perCenCon .passWord .conCen').attr('value', '').val('');
              $('.perCenCon .passWord .clues').hide();
            } else if (data.code == 'login_error') {
              layer.alert('用户已过期，请重新登录', {icon: 0}, function () {
                oauthLogin()
              });
            } else {
              layer.alert(data.msg, {icon: 0});
            }
          },
          error: function (data) {
            layer.alert('密码修改失败，请刷新页面后重试！', {icon: 0});
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
          $('#userLoginEmail .conCen').attr({'readonly': 'readonly', 'unselectable': 'on'});
          $(tar).addClass('eMailCodeForbid');
          $.ajax({
            type: "post",
            url: service.htmlHost + '/pf/uc/mailSend',
            data: {
              'mailAddress': $('#userLoginEmail input').val()
            },
            success: function (data) {
              if (data.code == 'success') {
                $('#userLoginEmail .clues').html('验证码已发送，请登录邮箱查看').show().css('color', '#1cd677')
              } else if (data.code == 'login_error') {
                layer.alert('用户已过期，请重新登录', {icon: 0}, function () {
                  oauthLogin()
                });
                $('#userLoginEmail .clues').html('验证码发送失败').show().css('color', 'red')
              } else {
                layer.alert('验证码发送失败', {icon: 0});
                $(tar).removeClass('eMailCodeForbid');
                $('#userLoginEmail .conCen').removeAttr('readonly unselectable');
                $('#userLoginEmail .clues').html(data.msg || '验证码发送失败').show().css('color', 'red')
              }
            },
            error: function (data) {
              layer.alert('验证码发送失败，请刷新页面后重试！', {icon: 0});
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
          $('#securityPhone .conCen').attr({'readonly': 'readonly', 'unselectable': 'on'});
          $(tar).addClass('eMailCodeForbid');
          $.ajax({
            type: "post",
            url: service.htmlHost + '/pf/uc/sendMobileCode',
            data: {
              'mobile': mobile
            },
            success: function (data) {
              if (data.code == 'success') {
                $('#securityPhone .clues').html('验证码已发送，请注意查收').show().css('color', '#1cd677');
              } else if (data.code == 'login_error') {
                layer.alert('用户已过期，请重新登录', {icon: 0}, function () {
                  oauthLogin()
                });
                $('#securityPhone .clues').html('验证码发送失败').show().css('color', 'red')
              } else {
                layer.alert('验证码发送失败', {icon: 0});
                $(tar).removeClass('eMailCodeForbid');
                $('#securityPhone .clues').html('验证码发送失败').show().css('color', 'red')
                $('#securityPhone .conCen').removeAttr('readonly unselectable');
              }
            },
            error: function (data) {
              $('#securityPhone .clues').html('验证码发送失败').show().css('color', 'red')
              $(tar).removeClass('eMailCodeForbid');
              layer.alert('验证码发送失败，请刷新页面后重试！', {icon: 0});
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
          if (tarVal.match('^[A-Za-z0-9\u4e00-\u9fa5]+$')) {
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
          if ($('#userLoginEmail .eMailCode').hasClass('eMailCodeForbid') && selectType == 'inforChange') {

          } else {
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
              pwdCur[2] = 1
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
})

