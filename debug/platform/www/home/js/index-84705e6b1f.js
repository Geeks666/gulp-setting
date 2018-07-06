'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'template', 'service', 'tool', 'banner', 'textScroll', 'scrollNav', 'center', 'main', 'footer', 'header', 'layer', 'indexApp'], function ($, template, service, tools, banner, textScroll, scrollNav, center, main, footer, header, layer, indexApp) {
    var bannerList = [{
      'id': 1,
      'name': 'banner1',
      'pic': 'images/banner1.jpg'
    }, {
      'id': 2,
      'name': 'banner2',
      'pic': 'images/banner2.jpg'
    }, {
      'id': 3,
      'name': 'banner3',
      'pic': 'images/banner3.jpg'
    }];
    $(function () {
      //通告
      getNotice($(".notice .notice_list"), 'noticeList');
      //获取应用列表
      getAppList($("#application_list ul"), 'applicationList');
      //学科资源
      getSubjectInfo($("#subject_section"), 'subjectSection');
      //教育新闻
      getNews("1", "newscontent_box");
      //成果展示
      getNews("2", "result_list");
      //热门空间
      //getSpace( $("#goodspace_content ul") , 'goodspaceContent' , "6" );
      hotspace($("#goodspace_content ul"), 'goodspaceContent', "6", 6);
      //个人空间动态
      getDynamic($("#dynamic_list"), 'dynamicList');
      //热门名师工作室
      getStudio($(".studio-list"), 'studioList');
      //获取名师工作室动态
      getStudioDynamic($("#studio_dynamic_list"), 'studioDynamicList');
      //获取热门学科空间
      //getSubjectSpace( $("#subject_space") , 'subjectSpace' );
      hotspace($("#subject_space"), 'subjectSpace', 'subject', 4);
      //热门学校空间
      //getSchoolSpace( $("#school_space") , 'schoolSpace' );
      hotspace($("#school_space"), 'schoolSpace', 'school', 5);
      //获取数字图书馆
      getEbookResource($(".numberlibrary_content ul"), 'numberlibraryContent');
      //友情链接
      getFriendList($(".link_content ul"), 'linkContent', 0);
      //初始化banner
      initBanner(bannerList);
      //初始化更多
      initMoreLink();
      //资源学段切换
      $(".wrap").delegate(".resources .min-nav li", "click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        getResource($("#resource_list"), 'resourceList', $(this).attr("id"));
      });
      //空间角色切换
      $(".wrap").delegate("#goodspace_type li", "click", function () {
        $(this).addClass("goodspace_active").siblings().removeClass("goodspace_active");
        //getSpace( $("#goodspace_content ul") , 'goodspaceContent' ,  $(this).attr("type") );
        hotspace($("#goodspace_content ul"), 'goodspaceContent', $(this).attr("type"), 6);
      });
      // 获取统计数据
      fetchStatistics();
      // 进入我的空间
      $('.btn-myspace').on('click', entryMySpace);
    });

    function fetchStatistics() {
      $.getJSON(service.htmlHost + '/pf/api/header/statistics', function (result) {
        if (result['code'] === 'success') {
          $.each(result['data'], function (key, val) {
            $('#count_' + key).html(val);
          });
        } else {
          setStatistics();
        }
      }).fail(function (err) {
        setStatistics();
      });
    }

    function setStatistics() {
      $('#count_users').html(322);
      $('#count_resources').html(48315);
      $('#count_spaces').html(336);
    }

    function entryMySpace() {
      if (!header.getUser()) layer.alert('请登录后操作。', { icon: 0 });else location.href = service.newSpaceBase + '/home?requireLogin=true';
    }

    /**
     * 填充公告
     * @param $obj
     * @param temId 模板ID
     */
    function getNotice($obj, temId) {
      $.ajax({
        url: service.htmlHost + '/pf/api/notice/getLimit?limit=10',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            $obj.html(template(temId, data));
          } else {
            layer.alert("获取公告异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取公告异常。", { icon: 0 });
        }
      });
    };

    /**
     * 获取应用列表
     * @param $obj
     * @param temId 模板ID
     */
    function getAppList($obj, temId) {
      $.ajax({
        url: service.htmlHost + '/pf/api/app/list?isRecommend=1',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html = "";
            if (data.data && data.data.length > 0) {
              $.each(data.data, function (i) {
                data.data[i].isDetail = false;
                data.data[i].logo = data.data[i].logo && data.data[i].logo != '' ? getPicPath(data.data[i].logo) : '';
              });
              html = template(temId, data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
            if ($('li', '.small_banner_list').length > 11) {
              $('.left_button').show();
              $('.right_button').show();
              scrollNav();
            }
          } else {
            layer.alert("获取应用异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取应用异常。", { icon: 0 });
        }
      });
    }

    /**
     * 获取学科资源
     * @param $obj
     * @param temId 模板ID
     */
    function getSubjectInfo($obj, temId) {
      $.ajax({
        url: service.htmlHost + '/pf/api/meta/homeSubject',
        type: "GET",
        dataType: 'JSON',
        success: function success(data) {
          if (data && data.code == "success") {
            data.host = service.sourcePlatformBase;
            $obj.append(template(temId, data));
            $obj.find(".discipline_list:odd").attr("style", "background: rgb(237, 237, 237);");
          } else {
            layer.alert("获取学科信息异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取学科信息异常。", { icon: 0 });
        }
      });
    }

    /**
     * 教育新闻/成果展示
     * @param category 类别 1：教育新闻 2：成果展示
     * @param id 教育新闻和成果展示模块ID
     */
    function getNews(category, id) {
      $.ajax({
        url: service.htmlHost + '/pf/api/news/getLimit?limit=7&isComm=1&category=' + category,
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html = '';
            if (data.data && data.data.length > 0) {
              data.category = category;
              html = template(id + '_', data);
            } else {
              html = showprompt();
            }
            $("#" + id).html(html);
          } else {
            layer.alert("获取新闻异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取新闻异常。", { icon: 0 });
        }
      });
    };

    /**
     * 热门空间 热门学科空间 热门学校空间
     * @param $obj
     * @param temId 模板ID
     * @param type 用户类型 2：教师 3：学生 5：家长 6：教研员; class：班级 school：学校 subject：学科 area：区域
     * @param orgId
     */
    function hotspace($obj, temId, type, pageSize, orgId) {
      var $data = {
        'type': type,
        'pageSize': pageSize,
        'currentPage': 1
      };
      if (orgId) {
        $data['orgId'] = orgId;
      }
      $.ajax({
        url: service.htmlHost + '/pf/api/qtapp/rrt_hotspace',
        type: 'GET',
        data: $data,
        success: function success(data) {
          if (data && data.code == "success") {
            var html = "";
            if (data.data && data.data.data && data.data.data.length > 0) {
              var handleData = function handleData(type) {
                if (type == '2' || type == '3' || type == '5' || type == '6') {
                  $.each(data.data.data, function (index) {
                    data.data.data[index].spaceUrl = data.msg + data.data.data[index].spaceUrl + '&requireLogin=false';
                    data.data.data[index].icon = data.data.data[index].icon ? data.data.data[index].icon : getDefaultAvatar(type);
                  });
                } else if (type == 'subject') {
                  var ids = [100, 103, 104, 106, 107, 165, 265, 166, 172, 173, 174, 933, 171, 170, 167];
                  var subjects = [];
                  var j = 0;
                  $.each(data.data.data, function (i, n) {
                    var isExist = false;
                    var subjectid = n.spaceUrl.split("&")[2].split("=")[1];
                    for (var i = 0; i < ids.length; i++) {
                      if (parseInt(subjectid) == ids[i]) {
                        n.icon = getpicture(parseInt(subjectid));
                        isExist = true;
                        break;
                      }
                    }
                    if (!isExist) n.icon = getpicture('other');
                    subjects[j] = n;
                    j++;
                  });
                  $.each(subjects, function (index) {
                    subjects[index].spaceUrl = data.msg + subjects[index].spaceUrl;
                  });
                } else if (type == 'school') {
                  $.each(data.data.data, function (index) {
                    data.data.data[index].spaceUrl = data.msg + data.data.data[index].spaceUrl;
                    data.data.data[index].icon = data.data.data[index].icon ? data.data.data[index].icon : getDefaultAvatar('subject');
                  });
                }
              };

              handleData(type);

              html = template(temId, data.data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
          } else {
            layer.alert(data.msg, { icon: 0 });
          }
        },
        error: function error(data) {
          var errorInfo = {
            'other': '热门空间',
            'subject': '热门学科空间',
            'school': '热门学校空间'
          };
          layer.alert("获取" + (errorInfo[type] ? errorInfo[type] : errorInfo['other']) + "异常", { icon: 0 });
        }
      });
    };

    /**
     * 获取个人空间动态
     * @param $obj
     * @param temId 模板ID
     */
    function getDynamic($obj, temId) {
      $.ajax({
        url: service.htmlHost + '/pf/api/qtapp/rrt_dynamicInfo?count=' + 100,
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html = "";
            if (data.data && data.data.length > 0) {
              $.each(data.data, function (index) {
                var dynamic = data.data[index];
                data.data[index].memberInfo.spaceUrl = data.msg + dynamic.memberInfo.spaceUrl + '&requireLogin=false';
                data.data[index].memberInfo.picurl = dynamic.memberInfo.picurl ? dynamic.memberInfo.picurl : getDefaultAvatar(dynamic.memberInfo.usertype);
                data.data[index].memberInfo.action = action(dynamic.action);
                data.data[index].memberInfo.resourceType = resourcetype(dynamic.resourceType);
                data.data[index].memberInfo.createTime = dynamic.createTime.split(" ")[0];
              });
              html = template(temId, data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
            new DoMove($obj, 80, 0);
          } else {
            layer.alert("获取个人空间动态异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取个人空间动态异常。", { icon: 0 });
        }
      });
    };

    /**
     * 获取热门名师工作室
     * @param $obj
     * @param temId 模板ID
     */
    function getStudio($obj, temId) {
      $.ajax({
        url: service.htmlHost + '/pf/api/qtapp/msgzs_studio?count=6',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html = "";
            if (data.data && data.data && data.data.datalist.length > 0) {
              $.each(data.data.datalist, function (index) {
                data.data.datalist[index].studioUrl = data.msg + data.data.datalist[index].studioUrl;
              });
              html = template(temId, data.data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
          } else {
            layer.alert("获取热门名师工作室异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取热门名师工作室异常。", { icon: 0 });
        }
      });
    };

    /**
     * 获取名师工作室动态
     * @param $obj
     * @param temId 模板ID
     */
    function getStudioDynamic($obj, temId) {
      $.ajax({
        url: service.htmlHost + '/pf/api/qtapp/msgzs_studioDynamic?count=' + 100,
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html = "";
            if (data.data && data.data.length > 0) {
              $.each(data.data, function (index) {
                data.data[index].detailUrl = data.msg + data.data[index].detailUrl;
                data.data[index].type = studiotype(data.data[index].type);
              });
              html = template(temId, data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
            new DoMove($obj, 80, 0);
          } else {
            layer.alert("获取名师工作室动态异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取名师工作室动态异常。", { icon: 0 });
        }
      });
    };

    /**
     * 获取数字图书馆
     * @param $obj
     * @param temId 模板ID
     */
    function getEbookResource($obj, temId) {
      $.ajax({
        url: service.htmlHost + '/pf/api/tbook/books',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html = "";
            if (data.data && data.data.length > 0) {
              data.host = service.ebookResourceHost;
              html = template(temId, data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
          } else {
            layer.alert("获取数字图书馆异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取数字图书馆异常。", { icon: 0 });
        }
      });
    };

    /**
     * 友情链接
     * type : 0：图片链接、1：和文字链接
     * temId : 模板ID
     * $obj : 内容容器
     * */
    function getFriendList($obj, temId, type) {
      $.ajax({
        url: service.htmlHost + '/pf/api/friend/list?type=0&limit=6',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html = "";
            if (data.data && data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                data.data[i].pic = getPicPath(data.data[i].pic);
              }
              html = template(temId, data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
          } else {
            layer.alert("获取友情链接异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取友情链接异常。", { icon: 0 });
        }
      });
    };

    /**
     * 初始化banner
     * @param bannerList 如果请求不到banner图片，则显示bannerList
     */
    function initBanner(bannerList) {
      $.ajax({
        url: service.htmlHost + '/pf/api/friend/banner?limit=3',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            if (data.data && data.data.length > 0) {
              $.each(data.data, function (index) {
                data.data[index].pic = getPicPath(data.data[index].pic);
              });
            } else {
              data.data = bannerList;
            }
            $(".slide-pic").html(template('slidePic', data));
            $(".slide-li").html(template('slideLi', data));
            banner();
          } else {
            layer.alert("初始化banner异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("初始化banner异常。", { icon: 0 });
        }
      });
    };

    /**
     * 第三方 更多 入口地址
     */
    function initMoreLink() {
      $.ajax({
        url: service.htmlHost + '/pf/api/header/more',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            $("#subject_section .title a").attr("href", data.data.res_more);
            $(".resources .title a").attr("href", data.data.res_more);
            $(".hot-studio .title a").attr("href", data.data.msgzs_more);
          } else {
            alert("初始化banner异常");
          }
        }
      });
    };

    /**
     * 根据用户类型获取头像
     * @param spaceType 用户类型
     * @returns {*} 头像路径
     */
    function getDefaultAvatar(spaceType) {
      if (spaceType === "class") {
        spaceType = "classPic";
      }
      var spaceTypeList = {
        '3': "./images/studentPic.png",
        '2': "./images/teacherPic.png",
        '6': "./images/teacherPic.png",
        '5': "./images/teacherPic.png",
        'subject': "./images/orgPic.png",
        'school': "./images/orgPic.png",
        'classPic': "./images/classPic.png",
        'area': "./images/orgPic.png",
        'other': "./images/orgPic.png"
      };
      if (spaceType) {
        return spaceTypeList[spaceType] ? spaceTypeList[spaceType] : spaceTypeList['other'];
      } else {
        return spaceTypeList['other'];
      }
    };

    /**
     * 学科空间默认图片
     * @param subjectid 100,103,104,106,107,165,265,166,172,173,174,933,171,170,167,1903
     *                  语文,数学,英语,物理,化学,生物,历史,地理,音乐,美术,体育,艺术,科学,信息技术,思品,综合实践
     * @returns {string} 返回学科空间图片路径
     */
    function getpicture(subjectid) {
      if (subjectid) {
        return "./images/subject/" + subjectid + ".png";
      }
    };

    //动态类型；1--发表了文章、2--上传了教学资源、3--发表了课题、4--上传了名师课堂、5--发起了教学研讨
    function studiotype(type) {
      switch (type) {
        case 1:
          return "发表了文章";
        case 2:
          return "上传了教学资源";
        case 3:
          return "发表了课题";
        case 4:
          return "上传了名师课堂";
        case 5:
          return "发起了教学研讨";
      }
    };

    function action(action) {
      switch (action) {
        case 1:
          return "新建了  ";
        case 2:
          return "分享了  ";
        case 3:
          return "修改了  ";
      }
    };

    //0--我的成果、1--话题研讨、2--个人相片、21--班级相片、22--学校相片、23--区域相片、3--随笔、4--群组空间公告、5--群组空间共享、6--作业
    function resourcetype(resourcetype) {
      switch (resourcetype) {
        case 0:
          return "我的成果";
        case 1:
          return "话题研讨";
        case 2:
          return "个人相片";
        case 3:
          return "随笔";
        case 4:
          return "群组空间公告";
        case 5:
          return "群组空间共享";
        case 6:
          return "作业";
        case 21:
          return "班级相片";
        case 22:
          return "学校相片";
        case 23:
          return "区域相片";
      }
    };

    /**
     * 根据图片ID返回图片路径
     * @param id 图片ID
     * @returns {string} 图片路径
     */
    function getPicPath(id) {
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    };

    /**
     * 公用没有内容方法
     * @returns {string}
     */
    function showprompt() {
      return "<p id='no-content'>没有您查看的内容</p>";
    };

    //列表循环
    function DoMove(e, height, t) {
      this.target = e;
      this.target.css({ 'position': 'relative' });
      this.$li = e.children();
      this.length = this.$li.length;
      this.height = height || 50;
      this.speed = 1000;
      this.starNum = 0;
      var _this = this;
      if (this.length >= 4) {
        this.target.html(this.target.html() + this.target.html());
        setTimeout(function () {
          _this.move();
        }, t);
      }
    }

    DoMove.prototype.move = function () {
      var _this = this;
      this.starNum++;
      if (this.starNum > this.length) {
        this.starNum = 1;
        this.target.css('top', 0);
      }
      this.target.animate({
        top: '-' + this.starNum * this.height + 'px'
      }, this.speed, function () {
        setTimeout(function () {
          _this.move(_this.starNum);
        }, 1000);
      });
    };
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvaW5kZXguanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInRlbXBsYXRlIiwic2VydmljZSIsInRvb2xzIiwiYmFubmVyIiwidGV4dFNjcm9sbCIsInNjcm9sbE5hdiIsImNlbnRlciIsIm1haW4iLCJmb290ZXIiLCJoZWFkZXIiLCJsYXllciIsImluZGV4QXBwIiwiYmFubmVyTGlzdCIsImdldE5vdGljZSIsImdldEFwcExpc3QiLCJnZXRTdWJqZWN0SW5mbyIsImdldE5ld3MiLCJob3RzcGFjZSIsImdldER5bmFtaWMiLCJnZXRTdHVkaW8iLCJnZXRTdHVkaW9EeW5hbWljIiwiZ2V0RWJvb2tSZXNvdXJjZSIsImdldEZyaWVuZExpc3QiLCJpbml0QmFubmVyIiwiaW5pdE1vcmVMaW5rIiwiZGVsZWdhdGUiLCJhZGRDbGFzcyIsInNpYmxpbmdzIiwicmVtb3ZlQ2xhc3MiLCJnZXRSZXNvdXJjZSIsImF0dHIiLCJmZXRjaFN0YXRpc3RpY3MiLCJvbiIsImVudHJ5TXlTcGFjZSIsImdldEpTT04iLCJodG1sSG9zdCIsInJlc3VsdCIsImVhY2giLCJrZXkiLCJ2YWwiLCJodG1sIiwic2V0U3RhdGlzdGljcyIsImZhaWwiLCJlcnIiLCJnZXRVc2VyIiwiYWxlcnQiLCJpY29uIiwibG9jYXRpb24iLCJocmVmIiwibmV3U3BhY2VCYXNlIiwiJG9iaiIsInRlbUlkIiwiYWpheCIsInVybCIsInR5cGUiLCJzdWNjZXNzIiwiZGF0YSIsImNvZGUiLCJlcnJvciIsImxlbmd0aCIsImkiLCJpc0RldGFpbCIsImxvZ28iLCJnZXRQaWNQYXRoIiwic2hvd3Byb21wdCIsInNob3ciLCJkYXRhVHlwZSIsImhvc3QiLCJzb3VyY2VQbGF0Zm9ybUJhc2UiLCJhcHBlbmQiLCJmaW5kIiwiY2F0ZWdvcnkiLCJpZCIsInBhZ2VTaXplIiwib3JnSWQiLCIkZGF0YSIsImhhbmRsZURhdGEiLCJpbmRleCIsInNwYWNlVXJsIiwibXNnIiwiZ2V0RGVmYXVsdEF2YXRhciIsImlkcyIsInN1YmplY3RzIiwiaiIsIm4iLCJpc0V4aXN0Iiwic3ViamVjdGlkIiwic3BsaXQiLCJwYXJzZUludCIsImdldHBpY3R1cmUiLCJlcnJvckluZm8iLCJkeW5hbWljIiwibWVtYmVySW5mbyIsInBpY3VybCIsInVzZXJ0eXBlIiwiYWN0aW9uIiwicmVzb3VyY2VUeXBlIiwicmVzb3VyY2V0eXBlIiwiY3JlYXRlVGltZSIsIkRvTW92ZSIsImRhdGFsaXN0Iiwic3R1ZGlvVXJsIiwiZGV0YWlsVXJsIiwic3R1ZGlvdHlwZSIsImVib29rUmVzb3VyY2VIb3N0IiwicGljIiwicmVzX21vcmUiLCJtc2d6c19tb3JlIiwic3BhY2VUeXBlIiwic3BhY2VUeXBlTGlzdCIsInBhdGhfdXJsIiwic3Vic3RyaW5nIiwicmVwbGFjZSIsInByZWZpeCIsImUiLCJoZWlnaHQiLCJ0IiwidGFyZ2V0IiwiY3NzIiwiJGxpIiwiY2hpbGRyZW4iLCJzcGVlZCIsInN0YXJOdW0iLCJfdGhpcyIsInNldFRpbWVvdXQiLCJtb3ZlIiwicHJvdG90eXBlIiwiYW5pbWF0ZSIsInRvcCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsb0JBQWdCO0FBRFg7QUFGTSxDQUFmO0FBTUFILFFBQVEsQ0FBQyxjQUFELENBQVIsRUFBMEIsVUFBVUksV0FBVixFQUF1QjtBQUMvQztBQUNBSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7O0FBRUFDLFNBQU8sRUFBUCxFQUFVLENBQUMsUUFBRCxFQUFXLFVBQVgsRUFBdUIsU0FBdkIsRUFBa0MsTUFBbEMsRUFBMEMsUUFBMUMsRUFBb0QsWUFBcEQsRUFBa0UsV0FBbEUsRUFBK0UsUUFBL0UsRUFBeUYsTUFBekYsRUFBaUcsUUFBakcsRUFBMkcsUUFBM0csRUFBcUgsT0FBckgsRUFBOEgsVUFBOUgsQ0FBVixFQUNFLFVBQVVD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YyxLQUFLNEQsR0FBTCxDQUFTNUQsTUFBdkI7QUFDQSxXQUFLd0QsTUFBTCxHQUFjQSxVQUFVLEVBQXhCO0FBQ0EsV0FBS00sS0FBTCxHQUFhLElBQWI7QUFDQSxXQUFLQyxPQUFMLEdBQWUsQ0FBZjtBQUNBLFVBQUlDLFFBQVEsSUFBWjtBQUNBLFVBQUksS0FBS2hFLE1BQUwsSUFBZSxDQUFuQixFQUFzQjtBQUNwQixhQUFLMEQsTUFBTCxDQUFZN0UsSUFBWixDQUFpQixLQUFLNkUsTUFBTCxDQUFZN0UsSUFBWixLQUFxQixLQUFLNkUsTUFBTCxDQUFZN0UsSUFBWixFQUF0QztBQUNBb0YsbUJBQVcsWUFBWTtBQUNyQkQsZ0JBQU1FLElBQU47QUFDRCxTQUZELEVBRUdULENBRkg7QUFHRDtBQUNGOztBQUVEakIsV0FBTzJCLFNBQVAsQ0FBaUJELElBQWpCLEdBQXdCLFlBQVk7QUFDbEMsVUFBSUYsUUFBUSxJQUFaO0FBQ0EsV0FBS0QsT0FBTDtBQUNBLFVBQUksS0FBS0EsT0FBTCxHQUFlLEtBQUsvRCxNQUF4QixFQUFnQztBQUM5QixhQUFLK0QsT0FBTCxHQUFlLENBQWY7QUFDQSxhQUFLTCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsS0FBaEIsRUFBdUIsQ0FBdkI7QUFDRDtBQUNELFdBQUtELE1BQUwsQ0FBWVUsT0FBWixDQUFvQjtBQUNoQkMsYUFBSyxNQUFNLEtBQUtOLE9BQUwsR0FBZSxLQUFLUCxNQUExQixHQUFtQztBQUR4QixPQUFwQixFQUdFLEtBQUtNLEtBSFAsRUFJRSxZQUFZO0FBQ1ZHLG1CQUFXLFlBQVk7QUFDckJELGdCQUFNRSxJQUFOLENBQVdGLE1BQU1ELE9BQWpCO0FBQ0QsU0FGRCxFQUVHLElBRkg7QUFHRCxPQVJIO0FBU0QsS0FoQkQ7QUFpQkQsR0Fqb0JIO0FBbW9CRCxDQXZvQkQiLCJmaWxlIjoiaG9tZS9qcy9pbmRleC04NDcwNWU2YjFmLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZS5jb25maWcoe1xyXG4gIGJhc2VVcmw6ICcuLi8nLFxyXG4gIHBhdGhzOiB7XHJcbiAgICAncGxhdGZvcm1Db25mJzogJ3B1YmxpYy9qcy9wbGF0Zm9ybUNvbmYuanMnXHJcbiAgfVxyXG59KTtcclxucmVxdWlyZShbJ3BsYXRmb3JtQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICAvLyBjb25maWdwYXRocy5wYXRocy5kaWFsb2cgPSBcIm15c3BhY2UvanMvYXBwRGlhbG9nLmpzXCI7XHJcbiAgcmVxdWlyZS5jb25maWcoY29uZmlncGF0aHMpO1xyXG5cclxuICBkZWZpbmUoJycsWydqcXVlcnknLCAndGVtcGxhdGUnLCAnc2VydmljZScsICd0b29sJywgJ2Jhbm5lcicsICd0ZXh0U2Nyb2xsJywgJ3Njcm9sbE5hdicsICdjZW50ZXInLCAnbWFpbicsICdmb290ZXInLCAnaGVhZGVyJywgJ2xheWVyJywgJ2luZGV4QXBwJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgdGVtcGxhdGUsIHNlcnZpY2UsIHRvb2xzLCBiYW5uZXIsIHRleHRTY3JvbGwsIHNjcm9sbE5hdiwgY2VudGVyLCBtYWluLCBmb290ZXIsIGhlYWRlciwgbGF5ZXIsIGluZGV4QXBwKSB7XHJcbiAgICAgIHZhciBiYW5uZXJMaXN0ID0gW3tcclxuICAgICAgICAnaWQnOiAxLFxyXG4gICAgICAgICduYW1lJzogJ2Jhbm5lcjEnLFxyXG4gICAgICAgICdwaWMnOiAnaW1hZ2VzL2Jhbm5lcjEuanBnJ1xyXG4gICAgICB9LCB7XHJcbiAgICAgICAgJ2lkJzogMixcclxuICAgICAgICAnbmFtZSc6ICdiYW5uZXIyJyxcclxuICAgICAgICAncGljJzogJ2ltYWdlcy9iYW5uZXIyLmpwZydcclxuICAgICAgfSwge1xyXG4gICAgICAgICdpZCc6IDMsXHJcbiAgICAgICAgJ25hbWUnOiAnYmFubmVyMycsXHJcbiAgICAgICAgJ3BpYyc6ICdpbWFnZXMvYmFubmVyMy5qcGcnXHJcbiAgICAgIH1dO1xyXG4gICAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL+mAmuWRilxyXG4gICAgICAgIGdldE5vdGljZSgkKFwiLm5vdGljZSAubm90aWNlX2xpc3RcIiksICdub3RpY2VMaXN0Jyk7XHJcbiAgICAgICAgLy/ojrflj5blupTnlKjliJfooahcclxuICAgICAgICBnZXRBcHBMaXN0KCQoXCIjYXBwbGljYXRpb25fbGlzdCB1bFwiKSwgJ2FwcGxpY2F0aW9uTGlzdCcpO1xyXG4gICAgICAgIC8v5a2m56eR6LWE5rqQXHJcbiAgICAgICAgZ2V0U3ViamVjdEluZm8oJChcIiNzdWJqZWN0X3NlY3Rpb25cIiksICdzdWJqZWN0U2VjdGlvbicpO1xyXG4gICAgICAgIC8v5pWZ6IKy5paw6Ze7XHJcbiAgICAgICAgZ2V0TmV3cyhcIjFcIiwgXCJuZXdzY29udGVudF9ib3hcIik7XHJcbiAgICAgICAgLy/miJDmnpzlsZXnpLpcclxuICAgICAgICBnZXROZXdzKFwiMlwiLCBcInJlc3VsdF9saXN0XCIpO1xyXG4gICAgICAgIC8v54Ot6Zeo56m66Ze0XHJcbiAgICAgICAgLy9nZXRTcGFjZSggJChcIiNnb29kc3BhY2VfY29udGVudCB1bFwiKSAsICdnb29kc3BhY2VDb250ZW50JyAsIFwiNlwiICk7XHJcbiAgICAgICAgaG90c3BhY2UoJChcIiNnb29kc3BhY2VfY29udGVudCB1bFwiKSwgJ2dvb2RzcGFjZUNvbnRlbnQnLCBcIjZcIiwgNik7XHJcbiAgICAgICAgLy/kuKrkurrnqbrpl7TliqjmgIFcclxuICAgICAgICBnZXREeW5hbWljKCQoXCIjZHluYW1pY19saXN0XCIpLCAnZHluYW1pY0xpc3QnKTtcclxuICAgICAgICAvL+eDremXqOWQjeW4iOW3peS9nOWupFxyXG4gICAgICAgIGdldFN0dWRpbygkKFwiLnN0dWRpby1saXN0XCIpLCAnc3R1ZGlvTGlzdCcpO1xyXG4gICAgICAgIC8v6I635Y+W5ZCN5biI5bel5L2c5a6k5Yqo5oCBXHJcbiAgICAgICAgZ2V0U3R1ZGlvRHluYW1pYygkKFwiI3N0dWRpb19keW5hbWljX2xpc3RcIiksICdzdHVkaW9EeW5hbWljTGlzdCcpO1xyXG4gICAgICAgIC8v6I635Y+W54Ot6Zeo5a2m56eR56m66Ze0XHJcbiAgICAgICAgLy9nZXRTdWJqZWN0U3BhY2UoICQoXCIjc3ViamVjdF9zcGFjZVwiKSAsICdzdWJqZWN0U3BhY2UnICk7XHJcbiAgICAgICAgaG90c3BhY2UoJChcIiNzdWJqZWN0X3NwYWNlXCIpLCAnc3ViamVjdFNwYWNlJywgJ3N1YmplY3QnLCA0KTtcclxuICAgICAgICAvL+eDremXqOWtpuagoeepuumXtFxyXG4gICAgICAgIC8vZ2V0U2Nob29sU3BhY2UoICQoXCIjc2Nob29sX3NwYWNlXCIpICwgJ3NjaG9vbFNwYWNlJyApO1xyXG4gICAgICAgIGhvdHNwYWNlKCQoXCIjc2Nob29sX3NwYWNlXCIpLCAnc2Nob29sU3BhY2UnLCAnc2Nob29sJywgNSk7XHJcbiAgICAgICAgLy/ojrflj5bmlbDlrZflm77kuabppoZcclxuICAgICAgICBnZXRFYm9va1Jlc291cmNlKCQoXCIubnVtYmVybGlicmFyeV9jb250ZW50IHVsXCIpLCAnbnVtYmVybGlicmFyeUNvbnRlbnQnKTtcclxuICAgICAgICAvL+WPi+aDhemTvuaOpVxyXG4gICAgICAgIGdldEZyaWVuZExpc3QoJChcIi5saW5rX2NvbnRlbnQgdWxcIiksICdsaW5rQ29udGVudCcsIDApO1xyXG4gICAgICAgIC8v5Yid5aeL5YyWYmFubmVyXHJcbiAgICAgICAgaW5pdEJhbm5lcihiYW5uZXJMaXN0KTtcclxuICAgICAgICAvL+WIneWni+WMluabtOWkmlxyXG4gICAgICAgIGluaXRNb3JlTGluaygpO1xyXG4gICAgICAgIC8v6LWE5rqQ5a2m5q615YiH5o2iXHJcbiAgICAgICAgJChcIi53cmFwXCIpLmRlbGVnYXRlKFwiLnJlc291cmNlcyAubWluLW5hdiBsaVwiLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIikuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICAgIGdldFJlc291cmNlKCQoXCIjcmVzb3VyY2VfbGlzdFwiKSwgJ3Jlc291cmNlTGlzdCcsICQodGhpcykuYXR0cihcImlkXCIpKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL+epuumXtOinkuiJsuWIh+aNolxyXG4gICAgICAgICQoXCIud3JhcFwiKS5kZWxlZ2F0ZShcIiNnb29kc3BhY2VfdHlwZSBsaVwiLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJnb29kc3BhY2VfYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJnb29kc3BhY2VfYWN0aXZlXCIpO1xyXG4gICAgICAgICAgLy9nZXRTcGFjZSggJChcIiNnb29kc3BhY2VfY29udGVudCB1bFwiKSAsICdnb29kc3BhY2VDb250ZW50JyAsICAkKHRoaXMpLmF0dHIoXCJ0eXBlXCIpICk7XHJcbiAgICAgICAgICBob3RzcGFjZSgkKFwiI2dvb2RzcGFjZV9jb250ZW50IHVsXCIpLCAnZ29vZHNwYWNlQ29udGVudCcsICQodGhpcykuYXR0cihcInR5cGVcIiksIDYpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIOiOt+WPlue7n+iuoeaVsOaNrlxyXG4gICAgICAgIGZldGNoU3RhdGlzdGljcygpO1xyXG4gICAgICAgIC8vIOi/m+WFpeaIkeeahOepuumXtFxyXG4gICAgICAgICQoJy5idG4tbXlzcGFjZScpLm9uKCdjbGljaycsIGVudHJ5TXlTcGFjZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZmV0Y2hTdGF0aXN0aWNzKCkge1xyXG4gICAgICAgICQuZ2V0SlNPTihzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvaGVhZGVyL3N0YXRpc3RpY3MnLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAkLmVhY2gocmVzdWx0WydkYXRhJ10sIGZ1bmN0aW9uIChrZXksIHZhbCkge1xyXG4gICAgICAgICAgICAgICQoJyNjb3VudF8nICsga2V5KS5odG1sKHZhbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2V0U3RhdGlzdGljcygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgc2V0U3RhdGlzdGljcygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzZXRTdGF0aXN0aWNzKCkge1xyXG4gICAgICAgICQoJyNjb3VudF91c2VycycpLmh0bWwoMzIyKTtcclxuICAgICAgICAkKCcjY291bnRfcmVzb3VyY2VzJykuaHRtbCg0ODMxNSk7XHJcbiAgICAgICAgJCgnI2NvdW50X3NwYWNlcycpLmh0bWwoMzM2KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZW50cnlNeVNwYWNlKCkge1xyXG4gICAgICAgIGlmICghaGVhZGVyLmdldFVzZXIoKSkgbGF5ZXIuYWxlcnQoJ+ivt+eZu+W9leWQjuaTjeS9nOOAgicsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgZWxzZSBsb2NhdGlvbi5ocmVmID0gc2VydmljZS5uZXdTcGFjZUJhc2UgKyAnL2hvbWU/cmVxdWlyZUxvZ2luPXRydWUnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5aGr5YWF5YWs5ZGKXHJcbiAgICAgICAqIEBwYXJhbSAkb2JqXHJcbiAgICAgICAqIEBwYXJhbSB0ZW1JZCDmqKHmnb9JRFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZ2V0Tm90aWNlKCRvYmosIHRlbUlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL25vdGljZS9nZXRMaW1pdD9saW1pdD0xMCcsXHJcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgICRvYmouaHRtbCh0ZW1wbGF0ZSh0ZW1JZCwgZGF0YSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5YWs5ZGK5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blhazlkYrlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDojrflj5blupTnlKjliJfooahcclxuICAgICAgICogQHBhcmFtICRvYmpcclxuICAgICAgICogQHBhcmFtIHRlbUlkIOaooeadv0lEXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRBcHBMaXN0KCRvYmosIHRlbUlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL2FwcC9saXN0P2lzUmVjb21tZW5kPTEnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YSwgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhW2ldLmlzRGV0YWlsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YVtpXS5sb2dvID0gZGF0YS5kYXRhW2ldLmxvZ28gJiYgZGF0YS5kYXRhW2ldLmxvZ28gIT0gJycgPyBnZXRQaWNQYXRoKGRhdGEuZGF0YVtpXS5sb2dvKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gdGVtcGxhdGUodGVtSWQsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gc2hvd3Byb21wdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAkb2JqLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgaWYgKCQoJ2xpJywgJy5zbWFsbF9iYW5uZXJfbGlzdCcpLmxlbmd0aCA+IDExKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubGVmdF9idXR0b24nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAkKCcucmlnaHRfYnV0dG9uJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsTmF2KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5bqU55So5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blupTnlKjlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOiOt+WPluWtpuenkei1hOa6kFxyXG4gICAgICAgKiBAcGFyYW0gJG9ialxyXG4gICAgICAgKiBAcGFyYW0gdGVtSWQg5qih5p2/SURcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGdldFN1YmplY3RJbmZvKCRvYmosIHRlbUlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL21ldGEvaG9tZVN1YmplY3QnLFxyXG4gICAgICAgICAgdHlwZTogXCJHRVRcIixcclxuICAgICAgICAgIGRhdGFUeXBlOiAnSlNPTicsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICBkYXRhLmhvc3QgPSBzZXJ2aWNlLnNvdXJjZVBsYXRmb3JtQmFzZTtcclxuICAgICAgICAgICAgICAkb2JqLmFwcGVuZCh0ZW1wbGF0ZSh0ZW1JZCwgZGF0YSkpO1xyXG4gICAgICAgICAgICAgICRvYmouZmluZChcIi5kaXNjaXBsaW5lX2xpc3Q6b2RkXCIpLmF0dHIoXCJzdHlsZVwiLCBcImJhY2tncm91bmQ6IHJnYigyMzcsIDIzNywgMjM3KTtcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blrabnp5Hkv6Hmga/lvILluLhcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluWtpuenkeS/oeaBr+W8guW4uOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5pWZ6IKy5paw6Ze7L+aIkOaenOWxleekulxyXG4gICAgICAgKiBAcGFyYW0gY2F0ZWdvcnkg57G75YirIDHvvJrmlZnogrLmlrDpl7sgMu+8muaIkOaenOWxleekulxyXG4gICAgICAgKiBAcGFyYW0gaWQg5pWZ6IKy5paw6Ze75ZKM5oiQ5p6c5bGV56S65qih5Z2XSURcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGdldE5ld3MoY2F0ZWdvcnksIGlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL25ld3MvZ2V0TGltaXQ/bGltaXQ9NyZpc0NvbW09MSZjYXRlZ29yeT0nICsgY2F0ZWdvcnksXHJcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5jYXRlZ29yeSA9IGNhdGVnb3J5O1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHRlbXBsYXRlKGlkICsgJ18nLCBkYXRhKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJChcIiNcIiArIGlkKS5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5paw6Ze75byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bmlrDpl7vlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDng63pl6jnqbrpl7Qg54Ot6Zeo5a2m56eR56m66Ze0IOeDremXqOWtpuagoeepuumXtFxyXG4gICAgICAgKiBAcGFyYW0gJG9ialxyXG4gICAgICAgKiBAcGFyYW0gdGVtSWQg5qih5p2/SURcclxuICAgICAgICogQHBhcmFtIHR5cGUg55So5oi357G75Z6LIDLvvJrmlZnluIggM++8muWtpueUnyA177ya5a626ZW/IDbvvJrmlZnnoJTlkZg7IGNsYXNz77ya54+t57qnIHNjaG9vbO+8muWtpuagoSBzdWJqZWN077ya5a2m56eRIGFyZWHvvJrljLrln59cclxuICAgICAgICogQHBhcmFtIG9yZ0lkXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBob3RzcGFjZSgkb2JqLCB0ZW1JZCwgdHlwZSwgcGFnZVNpemUsIG9yZ0lkKSB7XHJcbiAgICAgICAgdmFyICRkYXRhID0ge1xyXG4gICAgICAgICAgJ3R5cGUnOiB0eXBlLFxyXG4gICAgICAgICAgJ3BhZ2VTaXplJzogcGFnZVNpemUsXHJcbiAgICAgICAgICAnY3VycmVudFBhZ2UnOiAxXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAob3JnSWQpIHtcclxuICAgICAgICAgICRkYXRhWydvcmdJZCddID0gb3JnSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9xdGFwcC9ycnRfaG90c3BhY2UnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBkYXRhOiAkZGF0YSxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZURhdGEodHlwZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaGFuZGxlRGF0YSh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09ICcyJyB8fCB0eXBlID09ICczJyB8fCB0eXBlID09ICc1JyB8fCB0eXBlID09ICc2Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuZGF0YSwgZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEuZGF0YVtpbmRleF0uc3BhY2VVcmwgPSBkYXRhLm1zZyArIGRhdGEuZGF0YS5kYXRhW2luZGV4XS5zcGFjZVVybCArICcmcmVxdWlyZUxvZ2luPWZhbHNlJztcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5kYXRhW2luZGV4XS5pY29uID0gZGF0YS5kYXRhLmRhdGFbaW5kZXhdLmljb24gPyBkYXRhLmRhdGEuZGF0YVtpbmRleF0uaWNvbiA6IGdldERlZmF1bHRBdmF0YXIodHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnc3ViamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWRzID0gWzEwMCwgMTAzLCAxMDQsIDEwNiwgMTA3LCAxNjUsIDI2NSwgMTY2LCAxNzIsIDE3MywgMTc0LCA5MzMsIDE3MSwgMTcwLCAxNjddO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdWJqZWN0cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmRhdGEsIGZ1bmN0aW9uIChpLCBuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNFeGlzdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHN1YmplY3RpZCA9IG4uc3BhY2VVcmwuc3BsaXQoXCImXCIpWzJdLnNwbGl0KFwiPVwiKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUludChzdWJqZWN0aWQpID09IGlkc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG4uaWNvbiA9IGdldHBpY3R1cmUocGFyc2VJbnQoc3ViamVjdGlkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFeGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNFeGlzdCkgbi5pY29uID0gZ2V0cGljdHVyZSgnb3RoZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3RzW2pdID0gbjtcclxuICAgICAgICAgICAgICAgICAgICAgIGorKztcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAkLmVhY2goc3ViamVjdHMsIGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgc3ViamVjdHNbaW5kZXhdLnNwYWNlVXJsID0gZGF0YS5tc2cgKyBzdWJqZWN0c1tpbmRleF0uc3BhY2VVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnc2Nob29sJykge1xyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuZGF0YSwgZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEuZGF0YVtpbmRleF0uc3BhY2VVcmwgPSBkYXRhLm1zZyArIGRhdGEuZGF0YS5kYXRhW2luZGV4XS5zcGFjZVVybDtcclxuICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5kYXRhW2luZGV4XS5pY29uID0gKGRhdGEuZGF0YS5kYXRhW2luZGV4XS5pY29uID8gZGF0YS5kYXRhLmRhdGFbaW5kZXhdLmljb24gOiBnZXREZWZhdWx0QXZhdGFyKCdzdWJqZWN0JykgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGh0bWwgPSB0ZW1wbGF0ZSh0ZW1JZCwgZGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJG9iai5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KGRhdGEubXNnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvckluZm8gPSB7XHJcbiAgICAgICAgICAgICAgJ290aGVyJzogJ+eDremXqOepuumXtCcsXHJcbiAgICAgICAgICAgICAgJ3N1YmplY3QnOiAn54Ot6Zeo5a2m56eR56m66Ze0JyxcclxuICAgICAgICAgICAgICAnc2Nob29sJzogJ+eDremXqOWtpuagoeepuumXtCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPllwiICsgKGVycm9ySW5mb1t0eXBlXSA/IGVycm9ySW5mb1t0eXBlXSA6IGVycm9ySW5mb1snb3RoZXInXSkgKyBcIuW8guW4uFwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOiOt+WPluS4quS6uuepuumXtOWKqOaAgVxyXG4gICAgICAgKiBAcGFyYW0gJG9ialxyXG4gICAgICAgKiBAcGFyYW0gdGVtSWQg5qih5p2/SURcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGdldER5bmFtaWMoJG9iaiwgdGVtSWQpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvcXRhcHAvcnJ0X2R5bmFtaWNJbmZvP2NvdW50PScgKyAxMDAsXHJcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS5kYXRhLCBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIGR5bmFtaWMgPSBkYXRhLmRhdGFbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaW5kZXhdLm1lbWJlckluZm8uc3BhY2VVcmwgPSBkYXRhLm1zZyArIGR5bmFtaWMubWVtYmVySW5mby5zcGFjZVVybCArICcmcmVxdWlyZUxvZ2luPWZhbHNlJztcclxuICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhW2luZGV4XS5tZW1iZXJJbmZvLnBpY3VybCA9IChkeW5hbWljLm1lbWJlckluZm8ucGljdXJsID8gZHluYW1pYy5tZW1iZXJJbmZvLnBpY3VybCA6IChnZXREZWZhdWx0QXZhdGFyKGR5bmFtaWMubWVtYmVySW5mby51c2VydHlwZSkpICk7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YVtpbmRleF0ubWVtYmVySW5mby5hY3Rpb24gPSBhY3Rpb24oZHluYW1pYy5hY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaW5kZXhdLm1lbWJlckluZm8ucmVzb3VyY2VUeXBlID0gcmVzb3VyY2V0eXBlKGR5bmFtaWMucmVzb3VyY2VUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhW2luZGV4XS5tZW1iZXJJbmZvLmNyZWF0ZVRpbWUgPSBkeW5hbWljLmNyZWF0ZVRpbWUuc3BsaXQoXCIgXCIpWzBdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gdGVtcGxhdGUodGVtSWQsIGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJG9iai5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgIG5ldyBEb01vdmUoJG9iaiwgODAsIDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5Liq5Lq656m66Ze05Yqo5oCB5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bkuKrkurrnqbrpl7TliqjmgIHlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDojrflj5bng63pl6jlkI3luIjlt6XkvZzlrqRcclxuICAgICAgICogQHBhcmFtICRvYmpcclxuICAgICAgICogQHBhcmFtIHRlbUlkIOaooeadv0lEXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRTdHVkaW8oJG9iaiwgdGVtSWQpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvcXRhcHAvbXNnenNfc3R1ZGlvP2NvdW50PTYnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmRhdGFsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuZGF0YWxpc3QsIGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLmRhdGEuZGF0YWxpc3RbaW5kZXhdLnN0dWRpb1VybCA9IGRhdGEubXNnICsgZGF0YS5kYXRhLmRhdGFsaXN0W2luZGV4XS5zdHVkaW9Vcmw7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSB0ZW1wbGF0ZSh0ZW1JZCwgZGF0YS5kYXRhKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJG9iai5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W54Ot6Zeo5ZCN5biI5bel5L2c5a6k5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bng63pl6jlkI3luIjlt6XkvZzlrqTlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDojrflj5blkI3luIjlt6XkvZzlrqTliqjmgIFcclxuICAgICAgICogQHBhcmFtICRvYmpcclxuICAgICAgICogQHBhcmFtIHRlbUlkIOaooeadv0lEXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRTdHVkaW9EeW5hbWljKCRvYmosIHRlbUlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL3F0YXBwL21zZ3pzX3N0dWRpb0R5bmFtaWM/Y291bnQ9JyArIDEwMCxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEsIGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaW5kZXhdLmRldGFpbFVybCA9IGRhdGEubXNnICsgZGF0YS5kYXRhW2luZGV4XS5kZXRhaWxVcmw7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YVtpbmRleF0udHlwZSA9IHN0dWRpb3R5cGUoZGF0YS5kYXRhW2luZGV4XS50eXBlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHRlbXBsYXRlKHRlbUlkLCBkYXRhKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJG9iai5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgIG5ldyBEb01vdmUoJG9iaiwgODAsIDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5ZCN5biI5bel5L2c5a6k5Yqo5oCB5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blkI3luIjlt6XkvZzlrqTliqjmgIHlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDojrflj5bmlbDlrZflm77kuabppoZcclxuICAgICAgICogQHBhcmFtICRvYmpcclxuICAgICAgICogQHBhcmFtIHRlbUlkIOaooeadv0lEXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRFYm9va1Jlc291cmNlKCRvYmosIHRlbUlkKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL3Rib29rL2Jvb2tzJyxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuaG9zdCA9IHNlcnZpY2UuZWJvb2tSZXNvdXJjZUhvc3Q7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gdGVtcGxhdGUodGVtSWQsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gc2hvd3Byb21wdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAkb2JqLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bmlbDlrZflm77kuabppoblvILluLhcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluaVsOWtl+WbvuS5pummhuW8guW4uOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWPi+aDhemTvuaOpVxyXG4gICAgICAgKiB0eXBlIDogMO+8muWbvueJh+mTvuaOpeOAgTHvvJrlkozmloflrZfpk77mjqVcclxuICAgICAgICogdGVtSWQgOiDmqKHmnb9JRFxyXG4gICAgICAgKiAkb2JqIDog5YaF5a655a655ZmoXHJcbiAgICAgICAqICovXHJcbiAgICAgIGZ1bmN0aW9uIGdldEZyaWVuZExpc3QoJG9iaiwgdGVtSWQsIHR5cGUpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvZnJpZW5kL2xpc3Q/dHlwZT0wJmxpbWl0PTYnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhW2ldLnBpYyA9IGdldFBpY1BhdGgoZGF0YS5kYXRhW2ldLnBpYyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBodG1sID0gdGVtcGxhdGUodGVtSWQsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gc2hvd3Byb21wdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAkb2JqLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blj4vmg4Xpk77mjqXlvILluLhcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluWPi+aDhemTvuaOpeW8guW4uOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWIneWni+WMlmJhbm5lclxyXG4gICAgICAgKiBAcGFyYW0gYmFubmVyTGlzdCDlpoLmnpzor7fmsYLkuI3liLBiYW5uZXLlm77niYfvvIzliJnmmL7npLpiYW5uZXJMaXN0XHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBpbml0QmFubmVyKGJhbm5lckxpc3QpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvZnJpZW5kL2Jhbm5lcj9saW1pdD0zJyxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YSwgZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YVtpbmRleF0ucGljID0gZ2V0UGljUGF0aChkYXRhLmRhdGFbaW5kZXhdLnBpYyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGF0YS5kYXRhID0gYmFubmVyTGlzdDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJChcIi5zbGlkZS1waWNcIikuaHRtbCh0ZW1wbGF0ZSgnc2xpZGVQaWMnLCBkYXRhKSk7XHJcbiAgICAgICAgICAgICAgJChcIi5zbGlkZS1saVwiKS5odG1sKHRlbXBsYXRlKCdzbGlkZUxpJywgZGF0YSkpO1xyXG4gICAgICAgICAgICAgIGJhbm5lcigpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi5Yid5aeL5YyWYmFubmVy5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLliJ3lp4vljJZiYW5uZXLlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDnrKzkuInmlrkg5pu05aSaIOWFpeWPo+WcsOWdgFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gaW5pdE1vcmVMaW5rKCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9oZWFkZXIvbW9yZScsXHJcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgICQoXCIjc3ViamVjdF9zZWN0aW9uIC50aXRsZSBhXCIpLmF0dHIoXCJocmVmXCIsIGRhdGEuZGF0YS5yZXNfbW9yZSk7XHJcbiAgICAgICAgICAgICAgJChcIi5yZXNvdXJjZXMgLnRpdGxlIGFcIikuYXR0cihcImhyZWZcIiwgZGF0YS5kYXRhLnJlc19tb3JlKTtcclxuICAgICAgICAgICAgICAkKFwiLmhvdC1zdHVkaW8gLnRpdGxlIGFcIikuYXR0cihcImhyZWZcIiwgZGF0YS5kYXRhLm1zZ3pzX21vcmUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KFwi5Yid5aeL5YyWYmFubmVy5byC5bi4XCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDmoLnmja7nlKjmiLfnsbvlnovojrflj5blpLTlg49cclxuICAgICAgICogQHBhcmFtIHNwYWNlVHlwZSDnlKjmiLfnsbvlnotcclxuICAgICAgICogQHJldHVybnMgeyp9IOWktOWDj+i3r+W+hFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZ2V0RGVmYXVsdEF2YXRhcihzcGFjZVR5cGUpIHtcclxuICAgICAgICBpZiAoc3BhY2VUeXBlID09PSBcImNsYXNzXCIpIHtcclxuICAgICAgICAgIHNwYWNlVHlwZSA9IFwiY2xhc3NQaWNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNwYWNlVHlwZUxpc3QgPSB7XHJcbiAgICAgICAgICAnMyc6IFwiLi9pbWFnZXMvc3R1ZGVudFBpYy5wbmdcIixcclxuICAgICAgICAgICcyJzogXCIuL2ltYWdlcy90ZWFjaGVyUGljLnBuZ1wiLFxyXG4gICAgICAgICAgJzYnOiBcIi4vaW1hZ2VzL3RlYWNoZXJQaWMucG5nXCIsXHJcbiAgICAgICAgICAnNSc6IFwiLi9pbWFnZXMvdGVhY2hlclBpYy5wbmdcIixcclxuICAgICAgICAgICdzdWJqZWN0JzogXCIuL2ltYWdlcy9vcmdQaWMucG5nXCIsXHJcbiAgICAgICAgICAnc2Nob29sJzogXCIuL2ltYWdlcy9vcmdQaWMucG5nXCIsXHJcbiAgICAgICAgICAnY2xhc3NQaWMnOiBcIi4vaW1hZ2VzL2NsYXNzUGljLnBuZ1wiLFxyXG4gICAgICAgICAgJ2FyZWEnOiBcIi4vaW1hZ2VzL29yZ1BpYy5wbmdcIixcclxuICAgICAgICAgICdvdGhlcic6IFwiLi9pbWFnZXMvb3JnUGljLnBuZ1wiXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoc3BhY2VUeXBlKSB7XHJcbiAgICAgICAgICByZXR1cm4gc3BhY2VUeXBlTGlzdFtzcGFjZVR5cGVdID8gc3BhY2VUeXBlTGlzdFtzcGFjZVR5cGVdIDogc3BhY2VUeXBlTGlzdFsnb3RoZXInXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHNwYWNlVHlwZUxpc3RbJ290aGVyJ107XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWtpuenkeepuumXtOm7mOiupOWbvueJh1xyXG4gICAgICAgKiBAcGFyYW0gc3ViamVjdGlkIDEwMCwxMDMsMTA0LDEwNiwxMDcsMTY1LDI2NSwxNjYsMTcyLDE3MywxNzQsOTMzLDE3MSwxNzAsMTY3LDE5MDNcclxuICAgICAgICogICAgICAgICAgICAgICAgICDor63mlocs5pWw5a2mLOiLseivrSzniannkIYs5YyW5a2mLOeUn+eJqSzljoblj7Is5Zyw55CGLOmfs+S5kCznvo7mnK8s5L2T6IKyLOiJuuacryznp5HlraYs5L+h5oGv5oqA5pyvLOaAneWTgSznu7zlkIjlrp7ot7VcclxuICAgICAgICogQHJldHVybnMge3N0cmluZ30g6L+U5Zue5a2m56eR56m66Ze05Zu+54mH6Lev5b6EXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRwaWN0dXJlKHN1YmplY3RpZCkge1xyXG4gICAgICAgIGlmIChzdWJqZWN0aWQpIHtcclxuICAgICAgICAgIHJldHVybiBcIi4vaW1hZ2VzL3N1YmplY3QvXCIgKyBzdWJqZWN0aWQgKyBcIi5wbmdcIjtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvL+WKqOaAgeexu+Wei++8mzEtLeWPkeihqOS6huaWh+eroOOAgTItLeS4iuS8oOS6huaVmeWtpui1hOa6kOOAgTMtLeWPkeihqOS6huivvumimOOAgTQtLeS4iuS8oOS6huWQjeW4iOivvuWgguOAgTUtLeWPkei1t+S6huaVmeWtpueglOiuqFxyXG4gICAgICBmdW5jdGlvbiBzdHVkaW90eXBlKHR5cGUpIHtcclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgcmV0dXJuIFwi5Y+R6KGo5LqG5paH56ugXCI7XHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS4iuS8oOS6huaVmeWtpui1hOa6kFwiO1xyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLlj5Hooajkuobor77pophcIjtcclxuICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmV0dXJuIFwi5LiK5Lyg5LqG5ZCN5biI6K++5aCCXCI7XHJcbiAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWPkei1t+S6huaVmeWtpueglOiuqFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFjdGlvbihhY3Rpb24pIHtcclxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xyXG4gICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLmlrDlu7rkuoYgIFwiO1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLliIbkuqvkuoYgIFwiO1xyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLkv67mlLnkuoYgIFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vMC0t5oiR55qE5oiQ5p6c44CBMS0t6K+d6aKY56CU6K6o44CBMi0t5Liq5Lq655u454mH44CBMjEtLeePree6p+ebuOeJh+OAgTIyLS3lrabmoKHnm7jniYfjgIEyMy0t5Yy65Z+f55u454mH44CBMy0t6ZqP56yU44CBNC0t576k57uE56m66Ze05YWs5ZGK44CBNS0t576k57uE56m66Ze05YWx5Lqr44CBNi0t5L2c5LiaXHJcbiAgICAgIGZ1bmN0aW9uIHJlc291cmNldHlwZShyZXNvdXJjZXR5cGUpIHtcclxuICAgICAgICBzd2l0Y2ggKHJlc291cmNldHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLmiJHnmoTmiJDmnpxcIjtcclxuICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgcmV0dXJuIFwi6K+d6aKY56CU6K6oXCI7XHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS4quS6uuebuOeJh1wiO1xyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLpmo/nrJRcIjtcclxuICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmV0dXJuIFwi576k57uE56m66Ze05YWs5ZGKXCI7XHJcbiAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgIHJldHVybiBcIue+pOe7hOepuumXtOWFseS6q1wiO1xyXG4gICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICByZXR1cm4gXCLkvZzkuJpcIjtcclxuICAgICAgICAgIGNhc2UgMjE6XHJcbiAgICAgICAgICAgIHJldHVybiBcIuePree6p+ebuOeJh1wiO1xyXG4gICAgICAgICAgY2FzZSAyMjpcclxuICAgICAgICAgICAgcmV0dXJuIFwi5a2m5qCh55u454mHXCI7XHJcbiAgICAgICAgICBjYXNlIDIzOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLljLrln5/nm7jniYdcIjtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5qC55o2u5Zu+54mHSUTov5Tlm57lm77niYfot6/lvoRcclxuICAgICAgICogQHBhcmFtIGlkIOWbvueJh0lEXHJcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IOWbvueJh+i3r+W+hFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZ2V0UGljUGF0aChpZCkge1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5zdWJzdHJpbmcoMCwgNCkgPT09ICdodHRwJyA/IHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkgOiAoc2VydmljZS5wcmVmaXggKyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5yZXBsYWNlKCcjcmVzaWQjJywgaWQpKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDlhaznlKjmsqHmnInlhoXlrrnmlrnms5VcclxuICAgICAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHNob3dwcm9tcHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiPHAgaWQ9J25vLWNvbnRlbnQnPuayoeacieaCqOafpeeci+eahOWGheWuuTwvcD5cIjtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8v5YiX6KGo5b6q546vXHJcbiAgICAgIGZ1bmN0aW9uIERvTW92ZShlLCBoZWlnaHQsIHQpIHtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IGU7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuY3NzKHsncG9zaXRpb24nOiAncmVsYXRpdmUnfSk7XHJcbiAgICAgICAgdGhpcy4kbGkgPSBlLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLiRsaS5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgNTA7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IDEwMDA7XHJcbiAgICAgICAgdGhpcy5zdGFyTnVtID0gMDtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA+PSA0KSB7XHJcbiAgICAgICAgICB0aGlzLnRhcmdldC5odG1sKHRoaXMudGFyZ2V0Lmh0bWwoKSArIHRoaXMudGFyZ2V0Lmh0bWwoKSk7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMubW92ZSgpO1xyXG4gICAgICAgICAgfSwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBEb01vdmUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLnN0YXJOdW0rKztcclxuICAgICAgICBpZiAodGhpcy5zdGFyTnVtID4gdGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgIHRoaXMuc3Rhck51bSA9IDE7XHJcbiAgICAgICAgICB0aGlzLnRhcmdldC5jc3MoJ3RvcCcsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRhcmdldC5hbmltYXRlKHtcclxuICAgICAgICAgICAgdG9wOiAnLScgKyB0aGlzLnN0YXJOdW0gKiB0aGlzLmhlaWdodCArICdweCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzLnNwZWVkLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBfdGhpcy5tb3ZlKF90aGlzLnN0YXJOdW0pXHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgKTtcclxufSlcclxuXHJcbiJdfQ==
