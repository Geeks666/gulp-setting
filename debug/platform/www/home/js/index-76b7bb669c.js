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
  define('', ['jquery', 'fullPage', 'template', 'layer', 'textScroll', 'tab', 'service', 'orgConfig', 'tools', 'banner', 'ajaxBanner', 'secondNav', 'footer', 'header', 'appVerify', 'album'], function ($, fullPage, template, layer, textScroll, tab, service, orgConfig, tools, banner, ajaxBanner, secondNav, footer, header, appVerify, album) {
    var appId = orgConfig.orgIds.baiyinAreaId;
    var allData = {
      'loginedTeaNums': {},
      'schools': {},
      'dynamics': {},
      'teaSorts': {},
      'hotspaces': {}
    };
    var timers = null;
    /*getAppId('byqjyjID');*/
    //获取公告
    getNotice($(".notice_list"), 'noticeList');
    //获取新闻
    getNews("1", "newsShowBox");
    //获取成果
    getNews("2", "resultShowBox");
    //获取教师热门空间
    hotspace($("#Album"), 'Album_', "2", 26, orgConfig.orgIds.baiyinAreaId);
    getVideoList($("#videoList"), "videoList_");
    getloginedTeaNums(orgConfig.orgIds.baiyinAreaId);

    getTeaSort($("#teaSort>div"), 'teaSort_', 1, 30, orgConfig.orgIds.baiyinAreaId);

    //友情链接
    getFriendList($("#link_content"), 'linkContent', 0);
    initLink();

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
            var html = template(temId, data);
            $obj.html(html);
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
     * 教育新闻/成果展示
     * @param category 类别 1：教育新闻 2：成果展示
     * @param id 教育新闻和成果展示模块ID
     */
    function getNews(category, id, orgid) {
      if (orgid) {
        url = service.htmlHost + 'pf/api/news/getLimit?limit=7&category=' + category + '&orgId=' + orgid;
      } else {
        url = service.htmlHost + 'pf/api/news/getLimit?limit=7&category=' + category;
      }
      $.ajax({
        url: url,
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html = '';
            if (data.data && data.data.length > 0) {
              data.category = category;
              $.each(data.data, function (index) {
                data.data[index].showTitle = tools.hideTextByLen(data.data[index].title, 78);
                data.data[index].showBrief = tools.hideTextByLen(data.data[index].brief, 124);
                data.data[index].img = data.data[index].img ? getPicPath(data.data[index].img) : '';
                // orgid = 'jsdhfkhsadfkskdf';
                if (orgid) {
                  data.data[index].orgid = "&orgId=" + orgid;
                } else {
                  data.data[index].orgid = '';
                }
              });
              html = template(id + "_", data);
            } else {
              html = showprompt();
            }
            $("#" + id).html(html); //填充新闻
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
     * 获取课堂实录
     * @param $obj
     * @param temId 模板ID
     * @param school_name 学校名称
     */
    function getVideoList($obj, temId, school_name) {
      if (school_name) {
        url = service.htmlHost + '/pf/api/qtapp/ktsl_recList?school_name=' + school_name;
      } else {
        url = service.htmlHost + '/pf/api/qtapp/ktsl_recList';
      }
      $.ajax({
        url: url,
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            var html;
            if (data.data && data.data.result && data.data.result.data && data.data.result.data.length > 0) {
              html = template(temId, data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
          } else {
            layer.alert("获取课堂实录异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取课堂实录异常。", { icon: 0 });
        }
      });
    }

    function getloginedTeaNums(areaId, orgId) {
      var key = areaId ? areaId : orgId;
      if (allData.loginedTeaNums[key] == null) {
        var url = service.htmlHost + '/pf/api/schshow/loginedTeaNums';
        if (areaId) url += '?areaId=' + areaId;
        if (orgId) url += '?orgId=' + orgId;
        $.ajax({
          url: url,
          type: 'GET',
          success: function success(data) {
            if (data && data.code == "success") {
              allData.loginedTeaNums[key] = data.data;
              $(".teacher_ranked .teacherNum .num").text(data.data);
            } else {
              layer.alert(data.msg, { icon: 0 });
            }
          },
          error: function error(data) {
            layer.alert("获取在线用户数异常。", { icon: 0 });
          }
        });
      } else {
        $(".teacher_ranked .teacherNum .num").text(allData.loginedTeaNums[key]);
      }
    };

    function getTeaSort($obj, temId, pageNum, pageSize, areaId, orgId) {
      var key = areaId ? areaId : orgId;
      if (allData.teaSorts[key] == null) {
        var $data = {
          'page.currentPage': pageNum,
          'page.pageSize': pageSize
        };
        // if( areaId ) $data['areaId'] = areaId;
        if (orgId) $data['orgId'] = orgId;
        $.ajax({
          url: service.htmlHost + '/pf/api/by/teaSort',
          type: 'GET',
          data: $data,
          success: function success(data) {
            if (data && data.code == "success") {
              var html = "";
              if (data.data && data.data.length > 0) {
                allData.teaSorts[key] = data;
                html = template(temId, data);
              } else {
                html = showprompt();
              }
              $obj.html(html);

              $obj.css('margin-left', '0px');
              teaSortNum = 0;
              if ($obj.find('ul.listPage').length > 0) {
                $obj.width($obj.find('ul.listPage').length * parseInt($obj.find('ul.listPage').width()));
              } else {
                $obj.width($obj.parent().width());
              }
              $obj.parents('.box').find('a.prev').hide();
              if ($obj.find('ul.listPage').length <= 1) {
                $obj.parents('.box').find('a.next').hide();
              } else {
                $obj.parents('.box').find('a.next').show();
              }
            } else {
              layer.alert(data.msg, { icon: 0 });
            }
          },
          error: function error(data) {
            layer.alert("获取老师排行异常。", { icon: 0 });
          }
        });
      } else {
        $obj.html(template(temId, allData.teaSorts[key]));
        $obj.css('margin-left', '0px');
        teaSortNum = 0;
        if ($obj.find('ul.listPage').length > 0) {
          $obj.width($obj.find('ul.listPage').length * parseInt($obj.find('ul.listPage').width()));
        } else {
          $obj.width($obj.parent().width());
        }
        $obj.parents('.box').find('a.prev').hide();
        if ($obj.find('ul.listPage').length <= 1) {
          $obj.parents('.box').find('a.next').hide();
        } else {
          $obj.parents('.box').find('a.next').show();
        }
      }
    };

    /**
     * 友情链接
     * @param $obj : 内容容器
     * @param temId : 模板ID
     * @param type : 0：图片链接、1：和文字链接
     */
    function getFriendList($obj, temId, type) {
      $.ajax({
        url: service.htmlHost + '/pf/api/friend/list?type=' + type + '&limit=12',
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
     * 热门空间 热门学科空间 热门学校空间
     * @param $obj
     * @param temId 模板ID
     * @param type 用户类型 2：教师 3：学生 5：家长 6：教研员; class：班级 school：学校 subject：学科 area：区域
     * @param orgId
     */
    function hotspace($obj, temId, type, pageSize, areaId, orgId) {
      var key = areaId ? areaId : orgId;
      if (allData.hotspaces[key] == null) {
        allData.hotspaces[key] = {};
      }
      if (allData.hotspaces[key][type] == null) {
        var $data = {
          'type': type,
          'pageSize': pageSize,
          'currentPage': 1
        };
        if (areaId) $data['areaId'] = areaId;
        if (orgId) $data['orgId'] = orgId;
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
                      data.data.data[index].spaceUrl = data.msg + '/' + data.data.data[index].spaceUrl + '&requireLogin=false';
                      /*data.data.data[index].icon = data.data.data[index].icon ? getPicPath(data.data.data[index].icon) : getDefaultAvatar(type)*/
                      data.data.data[index].icon = data.data.data[index].icon ? data.data.data[index].icon : getDefaultAvatar(type);
                      data.data.data[index].name = data.data.data[index].label.length > 10 ? data.data.data[index].name.substring(0, 9) + '...' : data.data.data[index].name;
                      data.data.data[index].label = data.data.data[index].label.length > 12 ? data.data.data[index].label.substring(0, 11) + '...' : data.data.data[index].label;
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
                      subjects[index].spaceUrl = data.msg + '/' + subjects[index].spaceUrl;
                    });
                  } else if (type == 'school') {
                    $.each(data.data.data, function (index) {
                      data.data.data[index].spaceUrl = data.msg + '/' + data.data.data[index].spaceUrl;
                      data.data.data[index].icon = data.data.data[index].icon ? data.data.data[index].icon : getDefaultAvatar('subject');
                    });
                  }
                };

                handleData(type);

                html = "<li class=\"album_big\"><span href=\"javascript:;\" id=\"you_logo\">教师空间</span></li>" + template(temId, data.data);
                $obj.html(html);
                $obj.find('p').remove();
              } else {
                html = "<li class=\"album_big\"><span href=\"javascript:;\" id=\"you_logo\">教师空间</span></li>" + showprompt();
                $obj.html(html);
              }
              // $obj.append(html);
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
      } else {
        $obj.html(template(temId, allData.hotspaces[key][type]));
        $obj.css('margin-left', '0px');
      }
    };

    //初始化页面部分按钮链接
    function initLink() {
      $(".icon-resource").attr('href', service.sourcePlatformBase + '/syncTeaching/index'); //资源
      $(".icon-rank").attr("href", service.htmlHost + "/dist/platform/www/rank/allRank.html"); //排行版
      $("#teacherRanked").attr("href", service.htmlHost + "/dist/platform/www/rank/teacherRank.html"); //教师排行版
      $(".icon-yk").attr("href", service.htmlHost + "/dist/platform/www/home/feitianUclass.html"); //飞天课堂
      $("body").delegate('.icon-activity', 'click', function () {
        $.ajax({
          url: service.activityHost + '/anonymous/activityIndex',
          type: 'GET',
          dataType: "jsonp",
          jsonp: "callback",
          success: function success(data) {
            if (data.code == "success") {
              window.open(service.activityHost + data.data + (header.getUser() ? '?login=true' : '?login=false'), '_target');
            } else {
              layer.alert(data.msg, { icon: 0 });
            }
          },
          error: function error(data) {
            layer.alert('服务器异常', { icon: 0 });
          }
        });
      }); //专题活动
      $("#applistMore>a").attr("href", service.htmlHost + "/dist/platform/www/app/app.html"); //更多应用
    }

    /**
     * 第三方 更多 入口地址
     */
    initMoreLink();
    function initMoreLink() {
      $.ajax({
        url: service.htmlHost + '/pf/api/header/more',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            $(".icon-studio").attr("href", data.data.msgzs_more);
          } else {
            alert("初始化数据异常");
          }
        }
      });
    };

    /**
     * 根据图片ID返回图片路径
     * @param id 图片ID
     * @returns {string} 图片路径
     */
    function getPicPath(id) {
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    }

    /**
     * 公用没有内容方法
     * @returns {string}
     */
    function showprompt() {
      return "<p id='no-content'>没有您查看的内容</p>";
    };

    /**
     * 根据用户类型获取头像
     * @param spaceType 用户类型
     * @returns {*} 头像路径
     */
    function getDefaultAvatar(spaceType) {
      var spaceTypeList = {
        '3': "./images/studentPic.png",
        '2': "./images/teacherPic.png",
        '6': "./images/teacherPic.png",
        '5': "./images/teacherPic.png",
        'subject': "./images/orgPic.png",
        'school': "./images/orgPic.png",
        'class': "./images/classPic.png",
        'area': "./images/orgPic.png",
        'other': "./images/orgPic.png"
      };
      if (spaceType) {
        return spaceTypeList[spaceType] ? spaceTypeList[spaceType] : spaceTypeList['other'];
      } else {
        return spaceTypeList['other'];
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

    //新闻缩略图
    $('body').delegate('.listPic', 'click', function (e) {
      e.stopPropagation();
      $('.listPic').removeClass('active');
      $(this).addClass('active');
      $('.showPic', '.showBox').find('img').attr('src', $(this).find('img').attr('src'));
    });
    var newsSlideTimer = setInterval(function () {
      var index = 0;
      if ($(".listPic.active").index() < $(".listPic").length - 1) {
        index = parseInt($(".listPic.active").index()) + 1;
      }
      $(".listPic").eq(index).click();
    }, 5000);
    $("body").delegate(".searchBtn_wrap", "click", function (e) {
      e.stopPropagation();
      if ($.trim($(this).siblings(".searchText").val()) == "") {
        layer.alert("请输入搜索内容", { icon: 0 });
        return false;
      }
      window.location.href = service.sourcePlatformBase + '/syncTeaching/index?title=' + encodeURIComponent($.trim($(this).siblings(".searchText").val())) + "&requireLogin=false";
    });

    //判断当前用户是否有权限进入该APP,
    $("body .wrap").delegate('.verify_app_enter', 'click', function () {
      if (header.getUser()) {
        appVerify.verifyApp(service.appIds[$(this).attr('type')], '2');
      } else {
        layer.alert("请登录后操作。", { icon: 0 });
        return;
      }
    });

    $("body").delegate('#activityRegister,#reviewEnter', 'click', function () {
      var url = service.activityHost + '/anonymous/activityIndex';
      if ($(this).attr("id") == 'reviewEnter') {
        if (!header.getUser()) {
          layer.alert("请登录后再试", { icon: 0 });
          return;
        }
        if (header.getUserRole() == "3001" || header.getUserRole() == "3002" || header.getUserRole() == "3003") {
          window.location.href = service.activityHost + '/temp/activity/www/background/index.html';
          return;
        } else {
          layer.alert("您没有权限", { icon: 0 });
          return;
        }
      }
      $.ajax({
        url: url,
        type: 'GET',
        dataType: "jsonp",
        jsonp: "callback",
        success: function success(data) {
          if (data.code == "success") {
            window.location.href = service.activityHost + data.data + (header.getUser() ? '?login=true' : '?login=false');
          } else {
            layer.alert(data.msg, { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert('服务器异常', { icon: 0 });
        }
      });
    });
    $("body").delegate("#jxds,#ftyk", 'click', function () {
      if (header.getUser()) {
        window.open($(this).find("a").attr("data-href"), '_blank');
      } else {
        layer.alert("请登录后操作。", { icon: 0 });
        return;
      }
    });

    var onOff = true;
    var $teaSort = $('#teaSort>div');
    var teaSortNum = 0;

    function move(n, $obj, width) {

      $obj.animate({
        'margin-left': width * -n
      }, 800, function () {
        onOff = true;
      });
    }

    //下一个
    $("body").delegate('.teacher_ranked .next', 'click', function (e) {
      if (!onOff) return;
      teaSortNum++;
      onOff = false;
      move(teaSortNum, $teaSort, parseInt($teaSort.find('ul').width()));
      if ($teaSort.find('ul').length - 1 == teaSortNum) {
        $(this).hide();
      }
      $(this).parents('.teacher_ranked').find("a.prev").show();
    });
    //上一个
    $("body").delegate('.teacher_ranked .prev', 'click', function (e) {
      if (!onOff) return;
      teaSortNum--;
      onOff = false;
      move(teaSortNum, $teaSort, parseInt($teaSort.find('ul').width()));
      if (0 == teaSortNum) {
        $(this).hide();
      }
      $(this).parents('.teacher_ranked').find("a.next").show();
    });

    $('body').on('click', '.schoolTitle', function () {
      $('.schoolMenu').hide();
      $(this).next().show();
    });

    $(window).scroll(function () {
      if ($(window).scrollTop() >= $(window).height()) {
        $('#others').show();
      } else {
        $('#others').hide();
      }
    });
    $('#goTop').click(function () {
      $("html,body").animate({ scrollTop: 0 }, 500);
    });
    //    教师照片墙效果
    var album1 = new album('#Album');
    //    新闻图片轮播

    loadNews();

    function loadNews(orgid) {
      var newsTitle = [];
      var newsImg = [],
          ids = [],
          categorys = [];
      var num = 0,
          listr = "",
          prevImg;
      if (orgid) {
        url = service.htmlHost + 'pf/api/news/getLimit?isImg=1&limit=5' + '&orgId=' + orgid;
      } else {
        url = service.htmlHost + 'pf/api/news/getLimit?isImg=1&limit=5';
      }
      $.ajax({
        url: url,
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            if (data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                newsTitle.push(data.data[i].title);
                newsImg.push(getPicPath(data.data[i].img));
                ids.push(data.data[i].id);
                if (data.data[i].category == "教育新闻") {
                  categorys.push(1);
                } else if (data.data[i].category == "成果展示") {
                  categorys.push(2);
                }
                listr += "<li></li>";
              }
              if (newsTitle.length > 1) {
                $(".pictureBlock .imgtab").html(listr);
              }
              $(".pictureBlock .imgTitle").show();
            } else {
              $(".pictureBlock .imgtab").html('');
            }
          }
        }
      }).then(function (data) {
        var a = orgid ? "&orgId=" + orgid : '';
        Carousel();

        function Carousel() {
          $(".pictureBlock img").attr({ "src": newsImg[num] });
          $(".pictureBlock a").attr({ "href": "../news/sitenewsDetail.html?id=" + ids[num] + "&index=" + num + "&category=" + categorys[num] + "&isImg=" + 1 + a });
          $(".pictureBlock .imgTitle").html(newsTitle[num]).show();
          $(".pictureBlock .imgtab li").eq(num).addClass("active").siblings("li").removeClass("active");
          num++;
          if (num == newsTitle.length) {
            num = 0;
          }
        }

        if (newsTitle.length > 1) {
          timers = setInterval(Carousel, 3000);
          $(".pictureBlock").hover(function () {
            clearInterval(timers);
            timers = null;
          }, function () {
            if (newsTitle.length > 1) {
              clearInterval(timers);
              timers = setInterval(Carousel, 3000);
            }
          });
          $(".pictureBlock .imgtab li").on("click", function (e) {
            num = $(this).index();
            Carousel();
          });
        } else {
          $('.pictureBlock').find('a').attr('href', 'javascript:void(0)');
          $('.pictureBlock').find('img').attr('src', 'images/default_news.jpg');
          $(".pictureBlock .imgTitle").hide().html('');
          $(".pictureBlock").unbind("mouseenter").unbind("mouseleave");
        }
      }, function (err) {
        console.log(err);
      });
    }

    //    新闻和成果的切换
    $(".tabNewsAndResult a").on("click", function (e) {
      $(this).addClass("active").siblings().removeClass("active");
      $(".news").eq($(this).index()).show().siblings(".news").hide();
    });

    //    校园风采
    campusMien($("#picImg"), "pictureList1");
    campusMien($(".schoolListBox"), "schoolShow_");

    //点击大图查看可点击切换图片
    $('body').on('click', '.schoolListBox li', function () {
      var data_num = $(this).data('num');
      $('.mask').show();
      $('.picDialog').show();
      $('body').css('overflow-y', 'hidden');
      $('#picImg').append($('#picImg li:lt(' + $('#picImg li[data-num=' + data_num + ']').index() + ')'));
    });
    $('body').on('click', '.closeDialog', function () {
      $('.mask').hide();
      $('.picDialog').hide();
      $('body').css('overflow-y', 'auto');
    });

    //图片新闻
    function carousel(ulwrap, left, right, liwidth) {
      var len = ulwrap.find('li').length;
      if (liwidth * len < 1000) {
        ulwrap.css("width", '1000');
        $('.schoolList .schoolListBox').css({ 'top': '-20px' });
        $('.schoolBlockBox .next').css('display', 'none');
        $('.schoolBlockBox .prev').css('display', 'none');
      } else {
        ulwrap.css("width", liwidth * len);
        $('.schoolList .schoolListBox').css({ 'top': '0px' });
        $('.schoolBlockBox .next').show();
        $('.schoolBlockBox .prev').show();
      }
      var prev = left;
      var next = right;
      var ul = ulwrap;
      var width = ul.find('li').outerWidth(true);
      next.click(function () {
        ul.stop().animate({ 'margin-left': -width }, 300, function () {
          ul.find('li').eq(0).appendTo(ul);
          ul.css({ 'margin-left': 0 });
        });
      });
      prev.click(function () {
        ul.find('li:last').prependTo(ul);
        ul.css({ 'margin-left': -width });
        ul.stop().animate({ 'margin-left': 0 }, 300);
      });
    }

    /**
     * @description      校园风采
     * @param     $obj
     * @param     temId   模板ID
     */
    function campusMien($obj, temId, orgid) {
      if (orgid) {
        var url = service.prefix + 'renrentong/schoolpictures/100/1?orgId=' + orgid;
      } else {
        var url = service.prefix + '/renrentong/schoolpictures/100/1';
      }
      $.ajax({
        url: url,
        type: 'GET',
        success: function success(data) {

          if (data && data.code == "200") {
            var html = "";
            if (data.data.data && data.data.data.length > 0) {
              for (var i = 0; i < data.data.data.length; i++) {
                data.data.data[i].id = data.data.data[i].id == '' ? 'images/3.gif' : getPicPath(data.data.data[i].id);
                data.data.data[i].num = i;
              }
              html = template(temId, data.data);
            } else {
              html = showprompt();
            }
            $obj.html(html);
            if ($('.schoolListBox').children('.no-content')) {
              $('.schoolListBox').css('position', 'initial');
            }
            //调用首页图片新闻
            carousel($('.schoolListBox'), $('.schoolBlockBox .prev'), $('.schoolBlockBox .next'), 240);
            //调用弹出框图片新闻
            carousel($('#picImg'), $('.picImgLeft'), $('.picImgRight'), 797);
          } else {
            layer.alert("获取校园风采异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取校园风采异常。", { icon: 0 });
        }
      });
    }

    //    头部学校白银区切换
    $("body").delegate(".schoolChoose ul li.list>span", "click", function (e) {
      ;
      e.stopPropagation();
      var This = this;
      appId = $(This).attr('data-id');
      $(This).parents(".chooseArea").find(".scholl_name").text($(This).find('a').text()).attr("title", $(This).find('a').attr('title')).attr("data-id", $(This).attr('data-id'));
      $(This).parents(".chooseList").hide();
      $(This).parents(".chooseArea.tabchoose").find(".arrow").addClass("arrowDown").removeClass("arrowUp");
      if ($(".schoolChoose #schoolList li.list>span").length - 1 == header.getSchoolList().length && $(This).attr('data-id') == orgConfig.orgIds.baiyinAreaId) {
        //点击白银区

        // getDynamic( $("#dynamic_list") , 'dynamicList' , $(This).attr('data-id') );
        secondNav.getShareResourceCount(orgConfig.orgIds.baiyinAreaId);
        secondNav.getTotalUser(orgConfig.orgIds.baiyinAreaId);
        getloginedTeaNums(orgConfig.orgIds.baiyinAreaId);
        getTeaSort($("#teaSort>div"), 'teaSort_', 1, 30, orgConfig.orgIds.baiyinAreaId);
        // getSchoolOrTeacher( $(".schoolShow .schoolList") , "schoolList_" , $(This).attr('data-id') );
        // $(".hotSpace .hotNav>li").show();
        // hotspace( $("#goodspace_content") , 'goodspaceContent' , '2' , 30 , $(This).attr('data-id'));
        hotspace($("#Album"), 'Album_', "2", 26, $(This).attr('data-id'));
        new album("#Album");
        window.clearInterval(timers);
        timers = null;
        loadNews();
        //获取新闻
        getNews("1", "newsShowBox");
        //获取成果
        getNews("2", "resultShowBox");
        //课堂实录
        getVideoList($("#videoList"), "videoList_");
        campusMien($("#picImg"), "pictureList1");
        campusMien($(".schoolListBox"), "schoolShow_");
        // $(".hotSpace a.more").attr("href", service.newSpaceBase + '/JCenterHome/www/interspace/interspace.html');

        $("#schoolList").html(template('school_list', { data: header.getSchoolList() }));
      } else {
        //非白银区
        var orgid = $(This).attr('data-id');
        var schoolName = $(This).children().attr('title');
        // getDynamic( $("#dynamic_list") , 'dynamicList' , null , $(This).attr('data-id') );
        secondNav.getShareResourceCount(null, $(This).attr('data-id'));
        secondNav.getTotalUser(null, $(This).attr('data-id'));
        getloginedTeaNums(null, $(This).attr('data-id'));
        getTeaSort($("#teaSort>div"), 'teaSort_', 1, 30, null, $(This).attr('data-id'));
        // getSchoolOrTeacher( $(".schoolShow .schoolList") , "schoolList_" , null , $(This).attr('data-id') );
        // hotspace( $("#goodspace_content") , 'goodspaceContent' , '2' , 30 , null , $(This).attr('data-id'));
        hotspace($("#Album"), 'Album_', "2", 26, null, $(This).attr('data-id'));
        new album("#Album");
        window.clearInterval(timers);
        timers = null;
        loadNews(orgid);

        //获取新闻
        getNews("1", "newsShowBox", orgid);
        //获取成果
        getNews("2", "resultShowBox", orgid);
        //课堂实录
        getVideoList($("#videoList"), "videoList_", encodeURIComponent(schoolName));

        campusMien($("#picImg"), "pictureList1", orgid);
        campusMien($(".schoolListBox"), "schoolShow_", orgid);
        // $(".hotSpace a.more").attr("href", service.newSpaceBase + '/JCenterHome/www/home/index.html?spaceId='+$(This).attr('data-id')+'&spaceType=school');

        if ($(".schoolChoose #schoolList li.list>span").length == header.getSchoolList().length) {
          //第一次点击非白银区，拼接白银区数据
          $(".hotSpace .hotNav>li[type!='2']").hide();
          $("#schoolList").html(template('school_list', {
            data: [{
              'id': orgConfig.orgIds.baiyinAreaId,
              'name': '白银区',
              'showName': '白银区'
            }].concat(header.getSchoolList())
          }));
        }
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvaW5kZXguanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsImZ1bGxQYWdlIiwidGVtcGxhdGUiLCJsYXllciIsInRleHRTY3JvbGwiLCJ0YWIiLCJzZXJ2aWNlIiwib3JnQ29uZmlnIiwidG9vbHMiLCJiYW5uZXIiLCJhamF4QmFubmVyIiwic2Vjb25kTmF2IiwiZm9vdGVyIiwiaGVhZGVyIiwiYXBwVmVyaWZ5IiwiYWxidW0iLCJhcHBJZCIsIm9yZ0lkcyIsImJhaXlpbkFyZWFJZCIsImFsbERhdGEiLCJ0aW1lcnMiLCJnZXROb3RpY2UiLCJnZXROZXdzIiwiaG90c3BhY2UiLCJnZXRWaWRlb0xpc3QiLCJnZXRsb2dpbmVkVGVhTnVtcyIsImdldFRlYVNvcnQiLCJnZXRGcmllbmRMaXN0IiwiaW5pdExpbmsiLCIkb2JqIiwidGVtSWQiLCJhamF4IiwidXJsIiwiaHRtbEhvc3QiLCJ0eXBlIiwic3VjY2VzcyIsImRhdGEiLCJjb2RlIiwiaHRtbCIsImFsZXJ0IiwiaWNvbiIsImVycm9yIiwiY2F0ZWdvcnkiLCJpZCIsIm9yZ2lkIiwibGVuZ3RoIiwiZWFjaCIsImluZGV4Iiwic2hvd1RpdGxlIiwiaGlkZVRleHRCeUxlbiIsInRpdGxlIiwic2hvd0JyaWVmIiwiYnJpZWYiLCJpbWciLCJnZXRQaWNQYXRoIiwic2hvd3Byb21wdCIsInNjaG9vbF9uYW1lIiwicmVzdWx0IiwiYXJlYUlkIiwib3JnSWQiLCJrZXkiLCJsb2dpbmVkVGVhTnVtcyIsInRleHQiLCJtc2ciLCJwYWdlTnVtIiwicGFnZVNpemUiLCJ0ZWFTb3J0cyIsIiRkYXRhIiwiY3NzIiwidGVhU29ydE51bSIsImZpbmQiLCJ3aWR0aCIsInBhcnNlSW50IiwicGFyZW50IiwicGFyZW50cyIsImhpZGUiLCJzaG93IiwiaSIsInBpYyIsImhvdHNwYWNlcyIsImhhbmRsZURhdGEiLCJzcGFjZVVybCIsImdldERlZmF1bHRBdmF0YXIiLCJuYW1lIiwibGFiZWwiLCJzdWJzdHJpbmciLCJpZHMiLCJzdWJqZWN0cyIsImoiLCJuIiwiaXNFeGlzdCIsInN1YmplY3RpZCIsInNwbGl0IiwiZ2V0cGljdHVyZSIsInJlbW92ZSIsImVycm9ySW5mbyIsImF0dHIiLCJzb3VyY2VQbGF0Zm9ybUJhc2UiLCJkZWxlZ2F0ZSIsImFjdGl2aXR5SG9zdCIsImRhdGFUeXBlIiwianNvbnAiLCJ3aW5kb3ciLCJvcGVuIiwiZ2V0VXNlciIsImluaXRNb3JlTGluayIsIm1zZ3pzX21vcmUiLCJwYXRoX3VybCIsInJlcGxhY2UiLCJwcmVmaXgiLCJzcGFjZVR5cGUiLCJzcGFjZVR5cGVMaXN0IiwiYWN0aW9uIiwicmVzb3VyY2V0eXBlIiwiRG9Nb3ZlIiwiZSIsImhlaWdodCIsInQiLCJ0YXJnZXQiLCIkbGkiLCJjaGlsZHJlbiIsInNwZWVkIiwic3Rhck51bSIsIl90aGlzIiwic2V0VGltZW91dCIsIm1vdmUiLCJwcm90b3R5cGUiLCJhbmltYXRlIiwidG9wIiwic3RvcFByb3BhZ2F0aW9uIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsIm5ld3NTbGlkZVRpbWVyIiwic2V0SW50ZXJ2YWwiLCJlcSIsImNsaWNrIiwidHJpbSIsInNpYmxpbmdzIiwidmFsIiwibG9jYXRpb24iLCJocmVmIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwidmVyaWZ5QXBwIiwiYXBwSWRzIiwiZ2V0VXNlclJvbGUiLCJvbk9mZiIsIiR0ZWFTb3J0Iiwib24iLCJuZXh0Iiwic2Nyb2xsIiwic2Nyb2xsVG9wIiwiYWxidW0xIiwibG9hZE5ld3MiLCJuZXdzVGl0bGUiLCJuZXdzSW1nIiwiY2F0ZWdvcnlzIiwibnVtIiwibGlzdHIiLCJwcmV2SW1nIiwicHVzaCIsInRoZW4iLCJhIiwiQ2Fyb3VzZWwiLCJob3ZlciIsImNsZWFySW50ZXJ2YWwiLCJ1bmJpbmQiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiY2FtcHVzTWllbiIsImRhdGFfbnVtIiwiYXBwZW5kIiwiY2Fyb3VzZWwiLCJ1bHdyYXAiLCJsZWZ0IiwicmlnaHQiLCJsaXdpZHRoIiwibGVuIiwicHJldiIsInVsIiwib3V0ZXJXaWR0aCIsInN0b3AiLCJhcHBlbmRUbyIsInByZXBlbmRUbyIsIlRoaXMiLCJnZXRTY2hvb2xMaXN0IiwiZ2V0U2hhcmVSZXNvdXJjZUNvdW50IiwiZ2V0VG90YWxVc2VyIiwic2Nob29sTmFtZSIsImNvbmNhdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsb0JBQWdCO0FBRFg7QUFGTSxDQUFmO0FBTUFILFFBQVEsQ0FBQyxjQUFELENBQVIsRUFBMEIsVUFBVUksV0FBVixFQUF1QjtBQUMvQztBQUNBSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7QUFDQUMsU0FBTyxFQUFQLEVBQVcsQ0FBQyxRQUFELEVBQVcsVUFBWCxFQUF1QixVQUF2QixFQUFtQyxPQUFuQyxFQUE0QyxZQUE1QyxFQUEwRCxLQUExRCxFQUFpRSxTQUFqRSxFQUE0RSxXQUE1RSxFQUF5RixPQUF6RixFQUFrRyxRQUFsRyxFQUE0RyxZQUE1RyxFQUEwSCxXQUExSCxFQUF1SSxRQUF2SSxFQUFpSixRQUFqSixFQUEySixXQUEzSixFQUF3SyxPQUF4SyxDQUFYLEVBQ0UsVUFBVUMsQ0FBVixFQUFhQyxRQUFiLEVBQXVCQyxRQUF2QixFQUFpQ0MsS0FBakMsRUFBd0NDLFVBQXhDLEVBQW9EQyxHQUFwRCxFQUF5REMsT0FBekQsRUFBa0VDLFNBQWxFLEVBQTZFQyxLQUE3RSxFQUFvRkMsTUFBcEYsRUFBNEZDLFVBQTVGLEVBQXdHQyxTQUF4RyxFQUFtSEMsTUFBbkgsRUFBMkhDLE1BQTNILEVBQW1JQyxTQUFuSSxFQUE4SUMsS0FBOUksRUFBcUo7QUFDbkosUUFBSUMsUUFBUVQsVUFBVVUsTUFBVixDQUFpQkMsWUFBN0I7QUFDQSxRQUFJQyxVQUFVO0FBQ1osd0JBQWtCLEVBRE47QUFFWixpQkFBVyxFQUZDO0FBR1osa0JBQVks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ZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ3BsYXRmb3JtQ29uZic6ICdwdWJsaWMvanMvcGxhdGZvcm1Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydwbGF0Zm9ybUNvbmYnXSwgZnVuY3Rpb24gKGNvbmZpZ3BhdGhzKSB7XHJcbiAgLy8gY29uZmlncGF0aHMucGF0aHMuZGlhbG9nID0gXCJteXNwYWNlL2pzL2FwcERpYWxvZy5qc1wiO1xyXG4gIHJlcXVpcmUuY29uZmlnKGNvbmZpZ3BhdGhzKTtcclxuICBkZWZpbmUoJycsIFsnanF1ZXJ5JywgJ2Z1bGxQYWdlJywgJ3RlbXBsYXRlJywgJ2xheWVyJywgJ3RleHRTY3JvbGwnLCAndGFiJywgJ3NlcnZpY2UnLCAnb3JnQ29uZmlnJywgJ3Rvb2xzJywgJ2Jhbm5lcicsICdhamF4QmFubmVyJywgJ3NlY29uZE5hdicsICdmb290ZXInLCAnaGVhZGVyJywgJ2FwcFZlcmlmeScsICdhbGJ1bSddLFxyXG4gICAgZnVuY3Rpb24gKCQsIGZ1bGxQYWdlLCB0ZW1wbGF0ZSwgbGF5ZXIsIHRleHRTY3JvbGwsIHRhYiwgc2VydmljZSwgb3JnQ29uZmlnLCB0b29scywgYmFubmVyLCBhamF4QmFubmVyLCBzZWNvbmROYXYsIGZvb3RlciwgaGVhZGVyLCBhcHBWZXJpZnksIGFsYnVtKSB7XHJcbiAgICAgIHZhciBhcHBJZCA9IG9yZ0NvbmZpZy5vcmdJZHMuYmFpeWluQXJlYUlkO1xyXG4gICAgICB2YXIgYWxsRGF0YSA9IHtcclxuICAgICAgICAnbG9naW5lZFRlYU51bXMnOiB7fSxcclxuICAgICAgICAnc2Nob29scyc6IHt9LFxyXG4gICAgICAgICdkeW5hbWljcyc6IHt9LFxyXG4gICAgICAgICd0ZWFTb3J0cyc6IHt9LFxyXG4gICAgICAgICdob3RzcGFjZXMnOiB7fVxyXG4gICAgICB9O1xyXG4gICAgICB2YXIgdGltZXJzID0gbnVsbDtcclxuICAgICAgLypnZXRBcHBJZCgnYnlxanlqSUQnKTsqL1xyXG4gICAgICAvL+iOt+WPluWFrOWRilxyXG4gICAgICBnZXROb3RpY2UoJChcIi5ub3RpY2VfbGlzdFwiKSwgJ25vdGljZUxpc3QnKTtcclxuICAgICAgLy/ojrflj5bmlrDpl7tcclxuICAgICAgZ2V0TmV3cyhcIjFcIiwgXCJuZXdzU2hvd0JveFwiKTtcclxuICAgICAgLy/ojrflj5bmiJDmnpxcclxuICAgICAgZ2V0TmV3cyhcIjJcIiwgXCJyZXN1bHRTaG93Qm94XCIpO1xyXG4gICAgICAvL+iOt+WPluaVmeW4iOeDremXqOepuumXtFxyXG4gICAgICBob3RzcGFjZSgkKFwiI0FsYnVtXCIpLCAnQWxidW1fJywgXCIyXCIsIDI2LCBvcmdDb25maWcub3JnSWRzLmJhaXlpbkFyZWFJZCk7XHJcbiAgICAgIGdldFZpZGVvTGlzdCgkKFwiI3ZpZGVvTGlzdFwiKSwgXCJ2aWRlb0xpc3RfXCIpO1xyXG4gICAgICBnZXRsb2dpbmVkVGVhTnVtcyhvcmdDb25maWcub3JnSWRzLmJhaXlpbkFyZWFJZCk7XHJcblxyXG4gICAgICBnZXRUZWFTb3J0KCQoXCIjdGVhU29ydD5kaXZcIiksICd0ZWFTb3J0XycsIDEsIDMwLCBvcmdDb25maWcub3JnSWRzLmJhaXlpbkFyZWFJZCk7XHJcblxyXG5cclxuICAgICAgLy/lj4vmg4Xpk77mjqVcclxuICAgICAgZ2V0RnJpZW5kTGlzdCgkKFwiI2xpbmtfY29udGVudFwiKSwgJ2xpbmtDb250ZW50JywgMCk7XHJcbiAgICAgIGluaXRMaW5rKCk7XHJcblxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWhq+WFheWFrOWRilxyXG4gICAgICAgKiBAcGFyYW0gJG9ialxyXG4gICAgICAgKiBAcGFyYW0gdGVtSWQg5qih5p2/SURcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIGdldE5vdGljZSgkb2JqLCB0ZW1JZCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9ub3RpY2UvZ2V0TGltaXQ/bGltaXQ9MTAnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgaHRtbCA9IHRlbXBsYXRlKHRlbUlkLCBkYXRhKTtcclxuICAgICAgICAgICAgICAkb2JqLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blhazlkYrlvILluLhcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluWFrOWRiuW8guW4uOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOaVmeiCsuaWsOmXuy/miJDmnpzlsZXnpLpcclxuICAgICAgICogQHBhcmFtIGNhdGVnb3J5IOexu+WIqyAx77ya5pWZ6IKy5paw6Ze7IDLvvJrmiJDmnpzlsZXnpLpcclxuICAgICAgICogQHBhcmFtIGlkIOaVmeiCsuaWsOmXu+WSjOaIkOaenOWxleekuuaooeWdl0lEXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXROZXdzKGNhdGVnb3J5LCBpZCwgb3JnaWQpIHtcclxuICAgICAgICBpZiAob3JnaWQpIHtcclxuICAgICAgICAgIHVybCA9IHNlcnZpY2UuaHRtbEhvc3QgKyAncGYvYXBpL25ld3MvZ2V0TGltaXQ/bGltaXQ9NyZjYXRlZ29yeT0nICsgY2F0ZWdvcnkgKyAnJm9yZ0lkPScgKyBvcmdpZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXJsID0gc2VydmljZS5odG1sSG9zdCArICdwZi9hcGkvbmV3cy9nZXRMaW1pdD9saW1pdD03JmNhdGVnb3J5PScgKyBjYXRlZ29yeTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgaHRtbCA9ICcnO1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcclxuICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEsIGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaW5kZXhdLnNob3dUaXRsZSA9IHRvb2xzLmhpZGVUZXh0QnlMZW4oZGF0YS5kYXRhW2luZGV4XS50aXRsZSwgNzgpO1xyXG4gICAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaW5kZXhdLnNob3dCcmllZiA9IHRvb2xzLmhpZGVUZXh0QnlMZW4oZGF0YS5kYXRhW2luZGV4XS5icmllZiwgMTI0KTtcclxuICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhW2luZGV4XS5pbWcgPSBkYXRhLmRhdGFbaW5kZXhdLmltZyA/IGdldFBpY1BhdGgoZGF0YS5kYXRhW2luZGV4XS5pbWcpIDogJyc7XHJcbiAgICAgICAgICAgICAgICAgIC8vIG9yZ2lkID0gJ2pzZGhma2hzYWRma3NrZGYnO1xyXG4gICAgICAgICAgICAgICAgICBpZiAob3JnaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaW5kZXhdLm9yZ2lkID0gXCImb3JnSWQ9XCIgKyBvcmdpZFxyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YVtpbmRleF0ub3JnaWQgPSAnJztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gdGVtcGxhdGUoaWQgKyBcIl9cIiwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSBzaG93cHJvbXB0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICQoXCIjXCIgKyBpZCkuaHRtbChodG1sKTsvL+Whq+WFheaWsOmXu1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluaWsOmXu+W8guW4uFwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5paw6Ze75byC5bi444CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog6I635Y+W6K++5aCC5a6e5b2VXHJcbiAgICAgICAqIEBwYXJhbSAkb2JqXHJcbiAgICAgICAqIEBwYXJhbSB0ZW1JZCDmqKHmnb9JRFxyXG4gICAgICAgKiBAcGFyYW0gc2Nob29sX25hbWUg5a2m5qCh5ZCN56ewXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRWaWRlb0xpc3QoJG9iaiwgdGVtSWQsIHNjaG9vbF9uYW1lKSB7XHJcbiAgICAgICAgaWYgKHNjaG9vbF9uYW1lKSB7XHJcbiAgICAgICAgICB1cmw9c2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL3F0YXBwL2t0c2xfcmVjTGlzdD9zY2hvb2xfbmFtZT0nKyBzY2hvb2xfbmFtZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXJsPSBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvcXRhcHAva3RzbF9yZWNMaXN0JztcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgaHRtbDtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5yZXN1bHQgJiYgZGF0YS5kYXRhLnJlc3VsdC5kYXRhICYmIGRhdGEuZGF0YS5yZXN1bHQuZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gdGVtcGxhdGUodGVtSWQsIGRhdGEpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gc2hvd3Byb21wdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAkb2JqLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bor77loILlrp7lvZXlvILluLhcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluivvuWgguWunuW9leW8guW4uOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldGxvZ2luZWRUZWFOdW1zKGFyZWFJZCwgb3JnSWQpIHtcclxuICAgICAgICB2YXIga2V5ID0gYXJlYUlkID8gYXJlYUlkIDogb3JnSWQ7XHJcbiAgICAgICAgaWYgKGFsbERhdGEubG9naW5lZFRlYU51bXNba2V5XSA9PSBudWxsKSB7XHJcbiAgICAgICAgICB2YXIgdXJsID0gc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL3NjaHNob3cvbG9naW5lZFRlYU51bXMnO1xyXG4gICAgICAgICAgaWYgKGFyZWFJZCkgdXJsICs9ICc/YXJlYUlkPScgKyBhcmVhSWQ7XHJcbiAgICAgICAgICBpZiAob3JnSWQpIHVybCArPSAnP29yZ0lkPScgKyBvcmdJZDtcclxuICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAgIGFsbERhdGEubG9naW5lZFRlYU51bXNba2V5XSA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgICQoXCIudGVhY2hlcl9yYW5rZWQgLnRlYWNoZXJOdW0gLm51bVwiKS50ZXh0KGRhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KGRhdGEubXNnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blnKjnur/nlKjmiLfmlbDlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoXCIudGVhY2hlcl9yYW5rZWQgLnRlYWNoZXJOdW0gLm51bVwiKS50ZXh0KGFsbERhdGEubG9naW5lZFRlYU51bXNba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0VGVhU29ydCgkb2JqLCB0ZW1JZCwgcGFnZU51bSwgcGFnZVNpemUsIGFyZWFJZCwgb3JnSWQpIHtcclxuICAgICAgICB2YXIga2V5ID0gYXJlYUlkID8gYXJlYUlkIDogb3JnSWQ7XHJcbiAgICAgICAgaWYgKGFsbERhdGEudGVhU29ydHNba2V5XSA9PSBudWxsKSB7XHJcbiAgICAgICAgICB2YXIgJGRhdGEgPSB7XHJcbiAgICAgICAgICAgICdwYWdlLmN1cnJlbnRQYWdlJzogcGFnZU51bSxcclxuICAgICAgICAgICAgJ3BhZ2UucGFnZVNpemUnOiBwYWdlU2l6ZVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIC8vIGlmKCBhcmVhSWQgKSAkZGF0YVsnYXJlYUlkJ10gPSBhcmVhSWQ7XHJcbiAgICAgICAgICBpZiAob3JnSWQpICRkYXRhWydvcmdJZCddID0gb3JnSWQ7XHJcbiAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9ieS90ZWFTb3J0JyxcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIGRhdGE6ICRkYXRhLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICBhbGxEYXRhLnRlYVNvcnRzW2tleV0gPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICBodG1sID0gdGVtcGxhdGUodGVtSWQsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgaHRtbCA9IHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRvYmouaHRtbChodG1sKTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgJG9iai5jc3MoJ21hcmdpbi1sZWZ0JywgJzBweCcpO1xyXG4gICAgICAgICAgICAgICAgdGVhU29ydE51bSA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoJG9iai5maW5kKCd1bC5saXN0UGFnZScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgJG9iai53aWR0aCgkb2JqLmZpbmQoJ3VsLmxpc3RQYWdlJykubGVuZ3RoICogKHBhcnNlSW50KCRvYmouZmluZCgndWwubGlzdFBhZ2UnKS53aWR0aCgpKSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgJG9iai53aWR0aCgkb2JqLnBhcmVudCgpLndpZHRoKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJG9iai5wYXJlbnRzKCcuYm94JykuZmluZCgnYS5wcmV2JykuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRvYmouZmluZCgndWwubGlzdFBhZ2UnKS5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAkb2JqLnBhcmVudHMoJy5ib3gnKS5maW5kKCdhLm5leHQnKS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAkb2JqLnBhcmVudHMoJy5ib3gnKS5maW5kKCdhLm5leHQnKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydChkYXRhLm1zZywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W6ICB5biI5o6S6KGM5byC5bi444CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkb2JqLmh0bWwodGVtcGxhdGUodGVtSWQsIGFsbERhdGEudGVhU29ydHNba2V5XSkpO1xyXG4gICAgICAgICAgJG9iai5jc3MoJ21hcmdpbi1sZWZ0JywgJzBweCcpO1xyXG4gICAgICAgICAgdGVhU29ydE51bSA9IDA7XHJcbiAgICAgICAgICBpZiAoJG9iai5maW5kKCd1bC5saXN0UGFnZScpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJG9iai53aWR0aCgkb2JqLmZpbmQoJ3VsLmxpc3RQYWdlJykubGVuZ3RoICogKHBhcnNlSW50KCRvYmouZmluZCgndWwubGlzdFBhZ2UnKS53aWR0aCgpKSkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJG9iai53aWR0aCgkb2JqLnBhcmVudCgpLndpZHRoKCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJG9iai5wYXJlbnRzKCcuYm94JykuZmluZCgnYS5wcmV2JykuaGlkZSgpO1xyXG4gICAgICAgICAgaWYgKCRvYmouZmluZCgndWwubGlzdFBhZ2UnKS5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICAkb2JqLnBhcmVudHMoJy5ib3gnKS5maW5kKCdhLm5leHQnKS5oaWRlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkb2JqLnBhcmVudHMoJy5ib3gnKS5maW5kKCdhLm5leHQnKS5zaG93KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWPi+aDhemTvuaOpVxyXG4gICAgICAgKiBAcGFyYW0gJG9iaiA6IOWGheWuueWuueWZqFxyXG4gICAgICAgKiBAcGFyYW0gdGVtSWQgOiDmqKHmnb9JRFxyXG4gICAgICAgKiBAcGFyYW0gdHlwZSA6IDDvvJrlm77niYfpk77mjqXjgIEx77ya5ZKM5paH5a2X6ZO+5o6lXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRGcmllbmRMaXN0KCRvYmosIHRlbUlkLCB0eXBlKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL2ZyaWVuZC9saXN0P3R5cGU9JyArIHR5cGUgKyAnJmxpbWl0PTEyJyxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YVtpXS5waWMgPSBnZXRQaWNQYXRoKGRhdGEuZGF0YVtpXS5waWMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHRlbXBsYXRlKHRlbUlkLCBkYXRhKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJG9iai5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5Y+L5oOF6ZO+5o6l5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blj4vmg4Xpk77mjqXlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDng63pl6jnqbrpl7Qg54Ot6Zeo5a2m56eR56m66Ze0IOeDremXqOWtpuagoeepuumXtFxyXG4gICAgICAgKiBAcGFyYW0gJG9ialxyXG4gICAgICAgKiBAcGFyYW0gdGVtSWQg5qih5p2/SURcclxuICAgICAgICogQHBhcmFtIHR5cGUg55So5oi357G75Z6LIDLvvJrmlZnluIggM++8muWtpueUnyA177ya5a626ZW/IDbvvJrmlZnnoJTlkZg7IGNsYXNz77ya54+t57qnIHNjaG9vbO+8muWtpuagoSBzdWJqZWN077ya5a2m56eRIGFyZWHvvJrljLrln59cclxuICAgICAgICogQHBhcmFtIG9yZ0lkXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBob3RzcGFjZSgkb2JqLCB0ZW1JZCwgdHlwZSwgcGFnZVNpemUsIGFyZWFJZCwgb3JnSWQpIHtcclxuICAgICAgICB2YXIga2V5ID0gYXJlYUlkID8gYXJlYUlkIDogb3JnSWQ7XHJcbiAgICAgICAgaWYgKGFsbERhdGEuaG90c3BhY2VzW2tleV0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgYWxsRGF0YS5ob3RzcGFjZXNba2V5XSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYWxsRGF0YS5ob3RzcGFjZXNba2V5XVt0eXBlXSA9PSBudWxsKSB7XHJcbiAgICAgICAgICB2YXIgJGRhdGEgPSB7XHJcbiAgICAgICAgICAgICd0eXBlJzogdHlwZSxcclxuICAgICAgICAgICAgJ3BhZ2VTaXplJzogcGFnZVNpemUsXHJcbiAgICAgICAgICAgICdjdXJyZW50UGFnZSc6IDFcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBpZiAoYXJlYUlkKSAkZGF0YVsnYXJlYUlkJ10gPSBhcmVhSWQ7XHJcbiAgICAgICAgICBpZiAob3JnSWQpICRkYXRhWydvcmdJZCddID0gb3JnSWQ7XHJcbiAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9xdGFwcC9ycnRfaG90c3BhY2UnLFxyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YTogJGRhdGEsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgaGFuZGxlRGF0YSh0eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZURhdGEodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09ICcyJyB8fCB0eXBlID09ICczJyB8fCB0eXBlID09ICc1JyB8fCB0eXBlID09ICc2Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YS5kYXRhLCBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhLmRhdGFbaW5kZXhdLnNwYWNlVXJsID0gZGF0YS5tc2cgKyAnLycgKyBkYXRhLmRhdGEuZGF0YVtpbmRleF0uc3BhY2VVcmwgKyAnJnJlcXVpcmVMb2dpbj1mYWxzZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qZGF0YS5kYXRhLmRhdGFbaW5kZXhdLmljb24gPSBkYXRhLmRhdGEuZGF0YVtpbmRleF0uaWNvbiA/IGdldFBpY1BhdGgoZGF0YS5kYXRhLmRhdGFbaW5kZXhdLmljb24pIDogZ2V0RGVmYXVsdEF2YXRhcih0eXBlKSovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5kYXRhW2luZGV4XS5pY29uID0gZGF0YS5kYXRhLmRhdGFbaW5kZXhdLmljb24gPyAgZGF0YS5kYXRhLmRhdGFbaW5kZXhdLmljb24gOiBnZXREZWZhdWx0QXZhdGFyKHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEuZGF0YVtpbmRleF0ubmFtZSA9IChkYXRhLmRhdGEuZGF0YVtpbmRleF0ubGFiZWwpLmxlbmd0aCA+IDEwID8gKGRhdGEuZGF0YS5kYXRhW2luZGV4XS5uYW1lKS5zdWJzdHJpbmcoMCwgOSkgKyAnLi4uJyA6IGRhdGEuZGF0YS5kYXRhW2luZGV4XS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEuZGF0YVtpbmRleF0ubGFiZWwgPSAoZGF0YS5kYXRhLmRhdGFbaW5kZXhdLmxhYmVsKS5sZW5ndGggPiAxMiA/IChkYXRhLmRhdGEuZGF0YVtpbmRleF0ubGFiZWwpLnN1YnN0cmluZygwLCAxMSkgKyAnLi4uJyA6IGRhdGEuZGF0YS5kYXRhW2luZGV4XS5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnc3ViamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciBpZHMgPSBbMTAwLCAxMDMsIDEwNCwgMTA2LCAxMDcsIDE2NSwgMjY1LCAxNjYsIDE3MiwgMTczLCAxNzQsIDkzMywgMTcxLCAxNzAsIDE2N107XHJcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ViamVjdHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciBqID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmRhdGEuZGF0YSwgZnVuY3Rpb24gKGksIG4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzRXhpc3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1YmplY3RpZCA9IG4uc3BhY2VVcmwuc3BsaXQoXCImXCIpWzJdLnNwbGl0KFwiPVwiKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoc3ViamVjdGlkKSA9PSBpZHNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG4uaWNvbiA9IGdldHBpY3R1cmUocGFyc2VJbnQoc3ViamVjdGlkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0V4aXN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRXhpc3QpIG4uaWNvbiA9IGdldHBpY3R1cmUoJ290aGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3RzW2pdID0gbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goc3ViamVjdHMsIGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0c1tpbmRleF0uc3BhY2VVcmwgPSBkYXRhLm1zZyArICcvJyArIHN1YmplY3RzW2luZGV4XS5zcGFjZVVybDtcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnc2Nob29sJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YS5kYXRhLCBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhLmRhdGFbaW5kZXhdLnNwYWNlVXJsID0gZGF0YS5tc2cgKyAnLycgKyBkYXRhLmRhdGEuZGF0YVtpbmRleF0uc3BhY2VVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5kYXRhW2luZGV4XS5pY29uID0gKGRhdGEuZGF0YS5kYXRhW2luZGV4XS5pY29uID8gZGF0YS5kYXRhLmRhdGFbaW5kZXhdLmljb24gOiBnZXREZWZhdWx0QXZhdGFyKCdzdWJqZWN0JykgKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgaHRtbCA9IFwiPGxpIGNsYXNzPVxcXCJhbGJ1bV9iaWdcXFwiPjxzcGFuIGhyZWY9XFxcImphdmFzY3JpcHQ6O1xcXCIgaWQ9XFxcInlvdV9sb2dvXFxcIj7mlZnluIjnqbrpl7Q8L3NwYW4+PC9saT5cIiArIHRlbXBsYXRlKHRlbUlkLCBkYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAkb2JqLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICRvYmouZmluZCgncCcpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgaHRtbCA9IFwiPGxpIGNsYXNzPVxcXCJhbGJ1bV9iaWdcXFwiPjxzcGFuIGhyZWY9XFxcImphdmFzY3JpcHQ6O1xcXCIgaWQ9XFxcInlvdV9sb2dvXFxcIj7mlZnluIjnqbrpl7Q8L3NwYW4+PC9saT5cIiArIHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICAgICAgJG9iai5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gJG9iai5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KGRhdGEubXNnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGVycm9ySW5mbyA9IHtcclxuICAgICAgICAgICAgICAgICdvdGhlcic6ICfng63pl6jnqbrpl7QnLFxyXG4gICAgICAgICAgICAgICAgJ3N1YmplY3QnOiAn54Ot6Zeo5a2m56eR56m66Ze0JyxcclxuICAgICAgICAgICAgICAgICdzY2hvb2wnOiAn54Ot6Zeo5a2m5qCh56m66Ze0J1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPllwiICsgKGVycm9ySW5mb1t0eXBlXSA/IGVycm9ySW5mb1t0eXBlXSA6IGVycm9ySW5mb1snb3RoZXInXSkgKyBcIuW8guW4uFwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJG9iai5odG1sKHRlbXBsYXRlKHRlbUlkLCBhbGxEYXRhLmhvdHNwYWNlc1trZXldW3R5cGVdKSk7XHJcbiAgICAgICAgICAkb2JqLmNzcygnbWFyZ2luLWxlZnQnLCAnMHB4Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgIC8v5Yid5aeL5YyW6aG16Z2i6YOo5YiG5oyJ6ZKu6ZO+5o6lXHJcbiAgICAgIGZ1bmN0aW9uIGluaXRMaW5rKCkge1xyXG4gICAgICAgICQoXCIuaWNvbi1yZXNvdXJjZVwiKS5hdHRyKCdocmVmJywgc2VydmljZS5zb3VyY2VQbGF0Zm9ybUJhc2UgKyAnL3N5bmNUZWFjaGluZy9pbmRleCcpOy8v6LWE5rqQXHJcbiAgICAgICAgJChcIi5pY29uLXJhbmtcIikuYXR0cihcImhyZWZcIiwgc2VydmljZS5odG1sSG9zdCArIFwiL2Rpc3QvcGxhdGZvcm0vd3d3L3JhbmsvYWxsUmFuay5odG1sXCIpOy8v5o6S6KGM54mIXHJcbiAgICAgICAgJChcIiN0ZWFjaGVyUmFua2VkXCIpLmF0dHIoXCJocmVmXCIsIHNlcnZpY2UuaHRtbEhvc3QgKyBcIi9kaXN0L3BsYXRmb3JtL3d3dy9yYW5rL3RlYWNoZXJSYW5rLmh0bWxcIik7Ly/mlZnluIjmjpLooYzniYhcclxuICAgICAgICAkKFwiLmljb24teWtcIikuYXR0cihcImhyZWZcIiwgc2VydmljZS5odG1sSG9zdCArIFwiL2Rpc3QvcGxhdGZvcm0vd3d3L2hvbWUvZmVpdGlhblVjbGFzcy5odG1sXCIpOy8v6aOe5aSp6K++5aCCXHJcbiAgICAgICAgJChcImJvZHlcIikuZGVsZWdhdGUoJy5pY29uLWFjdGl2aXR5JywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiBzZXJ2aWNlLmFjdGl2aXR5SG9zdCArICcvYW5vbnltb3VzL2FjdGl2aXR5SW5kZXgnLFxyXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvbnBcIixcclxuICAgICAgICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihzZXJ2aWNlLmFjdGl2aXR5SG9zdCArIGRhdGEuZGF0YSArICggaGVhZGVyLmdldFVzZXIoKSA/ICc/bG9naW49dHJ1ZScgOiAnP2xvZ2luPWZhbHNlJyApLCAnX3RhcmdldCcpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydChkYXRhLm1zZywge2ljb246IDB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KCfmnI3liqHlmajlvILluLgnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTsvL+S4k+mimOa0u+WKqFxyXG4gICAgICAgICQoXCIjYXBwbGlzdE1vcmU+YVwiKS5hdHRyKFwiaHJlZlwiLCBzZXJ2aWNlLmh0bWxIb3N0ICsgXCIvZGlzdC9wbGF0Zm9ybS93d3cvYXBwL2FwcC5odG1sXCIpOy8v5pu05aSa5bqU55SoXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDnrKzkuInmlrkg5pu05aSaIOWFpeWPo+WcsOWdgFxyXG4gICAgICAgKi9cclxuICAgICAgaW5pdE1vcmVMaW5rKCk7XHJcbiAgICAgIGZ1bmN0aW9uIGluaXRNb3JlTGluaygpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvaGVhZGVyL21vcmUnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAkKFwiLmljb24tc3R1ZGlvXCIpLmF0dHIoXCJocmVmXCIsIGRhdGEuZGF0YS5tc2d6c19tb3JlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydChcIuWIneWni+WMluaVsOaNruW8guW4uFwiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5qC55o2u5Zu+54mHSUTov5Tlm57lm77niYfot6/lvoRcclxuICAgICAgICogQHBhcmFtIGlkIOWbvueJh0lEXHJcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IOWbvueJh+i3r+W+hFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZ2V0UGljUGF0aChpZCkge1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5zdWJzdHJpbmcoMCwgNCkgPT09ICdodHRwJyA/IHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkgOiAoc2VydmljZS5wcmVmaXggKyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5yZXBsYWNlKCcjcmVzaWQjJywgaWQpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWFrOeUqOayoeacieWGheWuueaWueazlVxyXG4gICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gc2hvd3Byb21wdCgpIHtcclxuICAgICAgICByZXR1cm4gXCI8cCBpZD0nbm8tY29udGVudCc+5rKh5pyJ5oKo5p+l55yL55qE5YaF5a65PC9wPlwiO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOagueaNrueUqOaIt+exu+Wei+iOt+WPluWktOWDj1xyXG4gICAgICAgKiBAcGFyYW0gc3BhY2VUeXBlIOeUqOaIt+exu+Wei1xyXG4gICAgICAgKiBAcmV0dXJucyB7Kn0g5aS05YOP6Lev5b6EXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXREZWZhdWx0QXZhdGFyKHNwYWNlVHlwZSkge1xyXG4gICAgICAgIHZhciBzcGFjZVR5cGVMaXN0ID0ge1xyXG4gICAgICAgICAgJzMnOiBcIi4vaW1hZ2VzL3N0dWRlbnRQaWMucG5nXCIsXHJcbiAgICAgICAgICAnMic6IFwiLi9pbWFnZXMvdGVhY2hlclBpYy5wbmdcIixcclxuICAgICAgICAgICc2JzogXCIuL2ltYWdlcy90ZWFjaGVyUGljLnBuZ1wiLFxyXG4gICAgICAgICAgJzUnOiBcIi4vaW1hZ2VzL3RlYWNoZXJQaWMucG5nXCIsXHJcbiAgICAgICAgICAnc3ViamVjdCc6IFwiLi9pbWFnZXMvb3JnUGljLnBuZ1wiLFxyXG4gICAgICAgICAgJ3NjaG9vbCc6IFwiLi9pbWFnZXMvb3JnUGljLnBuZ1wiLFxyXG4gICAgICAgICAgJ2NsYXNzJzogXCIuL2ltYWdlcy9jbGFzc1BpYy5wbmdcIixcclxuICAgICAgICAgICdhcmVhJzogXCIuL2ltYWdlcy9vcmdQaWMucG5nXCIsXHJcbiAgICAgICAgICAnb3RoZXInOiBcIi4vaW1hZ2VzL29yZ1BpYy5wbmdcIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHNwYWNlVHlwZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHNwYWNlVHlwZUxpc3Rbc3BhY2VUeXBlXSA/IHNwYWNlVHlwZUxpc3Rbc3BhY2VUeXBlXSA6IHNwYWNlVHlwZUxpc3RbJ290aGVyJ107XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBzcGFjZVR5cGVMaXN0WydvdGhlciddO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGFjdGlvbihhY3Rpb24pIHtcclxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xyXG4gICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLmlrDlu7rkuoYgIFwiO1xyXG4gICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLliIbkuqvkuoYgIFwiO1xyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLkv67mlLnkuoYgIFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vMC0t5oiR55qE5oiQ5p6c44CBMS0t6K+d6aKY56CU6K6o44CBMi0t5Liq5Lq655u454mH44CBMjEtLeePree6p+ebuOeJh+OAgTIyLS3lrabmoKHnm7jniYfjgIEyMy0t5Yy65Z+f55u454mH44CBMy0t6ZqP56yU44CBNC0t576k57uE56m66Ze05YWs5ZGK44CBNS0t576k57uE56m66Ze05YWx5Lqr44CBNi0t5L2c5LiaXHJcbiAgICAgIGZ1bmN0aW9uIHJlc291cmNldHlwZShyZXNvdXJjZXR5cGUpIHtcclxuICAgICAgICBzd2l0Y2ggKHJlc291cmNldHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLmiJHnmoTmiJDmnpxcIjtcclxuICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgcmV0dXJuIFwi6K+d6aKY56CU6K6oXCI7XHJcbiAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS4quS6uuebuOeJh1wiO1xyXG4gICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLpmo/nrJRcIjtcclxuICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgcmV0dXJuIFwi576k57uE56m66Ze05YWs5ZGKXCI7XHJcbiAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgIHJldHVybiBcIue+pOe7hOepuumXtOWFseS6q1wiO1xyXG4gICAgICAgICAgY2FzZSA2OlxyXG4gICAgICAgICAgICByZXR1cm4gXCLkvZzkuJpcIjtcclxuICAgICAgICAgIGNhc2UgMjE6XHJcbiAgICAgICAgICAgIHJldHVybiBcIuePree6p+ebuOeJh1wiO1xyXG4gICAgICAgICAgY2FzZSAyMjpcclxuICAgICAgICAgICAgcmV0dXJuIFwi5a2m5qCh55u454mHXCI7XHJcbiAgICAgICAgICBjYXNlIDIzOlxyXG4gICAgICAgICAgICByZXR1cm4gXCLljLrln5/nm7jniYdcIjtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvL+WIl+ihqOW+queOr1xyXG4gICAgICBmdW5jdGlvbiBEb01vdmUoZSwgaGVpZ2h0LCB0KSB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBlO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmNzcyh7J3Bvc2l0aW9uJzogJ3JlbGF0aXZlJ30pO1xyXG4gICAgICAgIHRoaXMuJGxpID0gZS5jaGlsZHJlbigpO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy4kbGkubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IDUwO1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAxMDAwO1xyXG4gICAgICAgIHRoaXMuc3Rhck51bSA9IDA7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5sZW5ndGggPj0gNCkge1xyXG4gICAgICAgICAgdGhpcy50YXJnZXQuaHRtbCh0aGlzLnRhcmdldC5odG1sKCkgKyB0aGlzLnRhcmdldC5odG1sKCkpO1xyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLm1vdmUoKTtcclxuICAgICAgICAgIH0sIHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgRG9Nb3ZlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zdGFyTnVtKys7XHJcbiAgICAgICAgaWYgKHRoaXMuc3Rhck51bSA+IHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGlzLnN0YXJOdW0gPSAxO1xyXG4gICAgICAgICAgdGhpcy50YXJnZXQuY3NzKCd0b3AnLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIHRvcDogJy0nICsgdGhpcy5zdGFyTnVtICogdGhpcy5oZWlnaHQgKyAncHgnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdGhpcy5zcGVlZCxcclxuICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgX3RoaXMubW92ZShfdGhpcy5zdGFyTnVtKVxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy/mlrDpl7vnvKnnlaXlm75cclxuICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCcubGlzdFBpYycsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAkKCcubGlzdFBpYycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAkKCcuc2hvd1BpYycsICcuc2hvd0JveCcpLmZpbmQoJ2ltZycpLmF0dHIoJ3NyYycsICQodGhpcykuZmluZCgnaW1nJykuYXR0cignc3JjJykpO1xyXG4gICAgICB9KTtcclxuICAgICAgdmFyIG5ld3NTbGlkZVRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgaWYgKCQoXCIubGlzdFBpYy5hY3RpdmVcIikuaW5kZXgoKSA8ICQoXCIubGlzdFBpY1wiKS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBpbmRleCA9IHBhcnNlSW50KCQoXCIubGlzdFBpYy5hY3RpdmVcIikuaW5kZXgoKSkgKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKFwiLmxpc3RQaWNcIikuZXEoaW5kZXgpLmNsaWNrKCk7XHJcbiAgICAgIH0sIDUwMDApO1xyXG4gICAgICAkKFwiYm9keVwiKS5kZWxlZ2F0ZShcIi5zZWFyY2hCdG5fd3JhcFwiLCBcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBpZiAoJC50cmltKCQodGhpcykuc2libGluZ3MoXCIuc2VhcmNoVGV4dFwiKS52YWwoKSkgPT0gXCJcIikge1xyXG4gICAgICAgICAgbGF5ZXIuYWxlcnQoXCLor7fovpPlhaXmkJzntKLlhoXlrrlcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBzZXJ2aWNlLnNvdXJjZVBsYXRmb3JtQmFzZSArICcvc3luY1RlYWNoaW5nL2luZGV4P3RpdGxlPScgKyBlbmNvZGVVUklDb21wb25lbnQoJC50cmltKCQodGhpcykuc2libGluZ3MoXCIuc2VhcmNoVGV4dFwiKS52YWwoKSkpICsgXCImcmVxdWlyZUxvZ2luPWZhbHNlXCJcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL+WIpOaWreW9k+WJjeeUqOaIt+aYr+WQpuacieadg+mZkOi/m+WFpeivpUFQUCxcclxuICAgICAgJChcImJvZHkgLndyYXBcIikuZGVsZWdhdGUoJy52ZXJpZnlfYXBwX2VudGVyJywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChoZWFkZXIuZ2V0VXNlcigpKSB7XHJcbiAgICAgICAgICBhcHBWZXJpZnkudmVyaWZ5QXBwKHNlcnZpY2UuYXBwSWRzWyQodGhpcykuYXR0cigndHlwZScpXSwgJzInKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsYXllci5hbGVydChcIuivt+eZu+W9leWQjuaTjeS9nOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkKFwiYm9keVwiKS5kZWxlZ2F0ZSgnI2FjdGl2aXR5UmVnaXN0ZXIsI3Jldmlld0VudGVyJywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB1cmwgPSBzZXJ2aWNlLmFjdGl2aXR5SG9zdCArICcvYW5vbnltb3VzL2FjdGl2aXR5SW5kZXgnO1xyXG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJpZFwiKSA9PSAncmV2aWV3RW50ZXInKSB7XHJcbiAgICAgICAgICBpZiAoIWhlYWRlci5nZXRVc2VyKCkpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLor7fnmbvlvZXlkI7lho3or5VcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGhlYWRlci5nZXRVc2VyUm9sZSgpID09IFwiMzAwMVwiIHx8IGhlYWRlci5nZXRVc2VyUm9sZSgpID09IFwiMzAwMlwiIHx8IGhlYWRlci5nZXRVc2VyUm9sZSgpID09IFwiMzAwM1wiKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2VydmljZS5hY3Rpdml0eUhvc3QgKyAnL3RlbXAvYWN0aXZpdHkvd3d3L2JhY2tncm91bmQvaW5kZXguaHRtbCc7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi5oKo5rKh5pyJ5p2D6ZmQXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxyXG4gICAgICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNlcnZpY2UuYWN0aXZpdHlIb3N0ICsgZGF0YS5kYXRhICsgKCBoZWFkZXIuZ2V0VXNlcigpID8gJz9sb2dpbj10cnVlJyA6ICc/bG9naW49ZmFsc2UnICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoJ+acjeWKoeWZqOW8guW4uCcsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKFwiYm9keVwiKS5kZWxlZ2F0ZShcIiNqeGRzLCNmdHlrXCIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoaGVhZGVyLmdldFVzZXIoKSkge1xyXG4gICAgICAgICAgd2luZG93Lm9wZW4oJCh0aGlzKS5maW5kKFwiYVwiKS5hdHRyKFwiZGF0YS1ocmVmXCIpLCAnX2JsYW5rJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6K+355m75b2V5ZCO5pON5L2c44CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICB2YXIgb25PZmYgPSB0cnVlO1xyXG4gICAgICB2YXIgJHRlYVNvcnQgPSAkKCcjdGVhU29ydD5kaXYnKTtcclxuICAgICAgdmFyIHRlYVNvcnROdW0gPSAwO1xyXG5cclxuICAgICAgZnVuY3Rpb24gbW92ZShuLCAkb2JqLCB3aWR0aCkge1xyXG5cclxuICAgICAgICAkb2JqLmFuaW1hdGUoXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICdtYXJnaW4tbGVmdCc6IHdpZHRoICogLW5cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICA4MDAsXHJcbiAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG9uT2ZmID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL+S4i+S4gOS4qlxyXG4gICAgICAkKFwiYm9keVwiKS5kZWxlZ2F0ZSgnLnRlYWNoZXJfcmFua2VkIC5uZXh0JywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoIW9uT2ZmKSByZXR1cm47XHJcbiAgICAgICAgdGVhU29ydE51bSsrO1xyXG4gICAgICAgIG9uT2ZmID0gZmFsc2U7XHJcbiAgICAgICAgbW92ZSh0ZWFTb3J0TnVtLCAkdGVhU29ydCwgcGFyc2VJbnQoJHRlYVNvcnQuZmluZCgndWwnKS53aWR0aCgpKSk7XHJcbiAgICAgICAgaWYgKCR0ZWFTb3J0LmZpbmQoJ3VsJykubGVuZ3RoIC0gMSA9PSB0ZWFTb3J0TnVtKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcudGVhY2hlcl9yYW5rZWQnKS5maW5kKFwiYS5wcmV2XCIpLnNob3coKTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8v5LiK5LiA5LiqXHJcbiAgICAgICQoXCJib2R5XCIpLmRlbGVnYXRlKCcudGVhY2hlcl9yYW5rZWQgLnByZXYnLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICghb25PZmYpIHJldHVybjtcclxuICAgICAgICB0ZWFTb3J0TnVtLS07XHJcbiAgICAgICAgb25PZmYgPSBmYWxzZTtcclxuICAgICAgICBtb3ZlKHRlYVNvcnROdW0sICR0ZWFTb3J0LCBwYXJzZUludCgkdGVhU29ydC5maW5kKCd1bCcpLndpZHRoKCkpKTtcclxuICAgICAgICBpZiAoMCA9PSB0ZWFTb3J0TnVtKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcudGVhY2hlcl9yYW5rZWQnKS5maW5kKFwiYS5uZXh0XCIpLnNob3coKTtcclxuICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuc2Nob29sVGl0bGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLnNjaG9vbE1lbnUnKS5oaWRlKCk7XHJcbiAgICAgICAgJCh0aGlzKS5uZXh0KCkuc2hvdygpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gJCh3aW5kb3cpLmhlaWdodCgpKSB7XHJcbiAgICAgICAgICAkKCcjb3RoZXJzJykuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKCcjb3RoZXJzJykuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgICQoJyNnb1RvcCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiaHRtbCxib2R5XCIpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDUwMCk7XHJcbiAgICAgIH0pO1xyXG4vLyAgICDmlZnluIjnhafniYflopnmlYjmnpxcclxuICAgICAgdmFyIGFsYnVtMSA9IG5ldyBhbGJ1bSgnI0FsYnVtJyk7XHJcbi8vICAgIOaWsOmXu+WbvueJh+i9ruaSrVxyXG5cclxuICAgICAgbG9hZE5ld3MoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGxvYWROZXdzKG9yZ2lkKSB7XHJcbiAgICAgICAgdmFyIG5ld3NUaXRsZSA9IFtdO1xyXG4gICAgICAgIHZhciBuZXdzSW1nID0gW10sIGlkcyA9IFtdLCBjYXRlZ29yeXMgPSBbXTtcclxuICAgICAgICB2YXIgbnVtID0gMCwgbGlzdHIgPSBcIlwiLCBwcmV2SW1nO1xyXG4gICAgICAgIGlmIChvcmdpZCkge1xyXG4gICAgICAgICAgdXJsID0gc2VydmljZS5odG1sSG9zdCArICdwZi9hcGkvbmV3cy9nZXRMaW1pdD9pc0ltZz0xJmxpbWl0PTUnICsgJyZvcmdJZD0nICsgb3JnaWQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVybCA9IHNlcnZpY2UuaHRtbEhvc3QgKyAncGYvYXBpL25ld3MvZ2V0TGltaXQ/aXNJbWc9MSZsaW1pdD01JztcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5ld3NUaXRsZS5wdXNoKGRhdGEuZGF0YVtpXS50aXRsZSk7XHJcbiAgICAgICAgICAgICAgICAgIG5ld3NJbWcucHVzaChnZXRQaWNQYXRoKGRhdGEuZGF0YVtpXS5pbWcpKTtcclxuICAgICAgICAgICAgICAgICAgaWRzLnB1c2goZGF0YS5kYXRhW2ldLmlkKTtcclxuICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YVtpXS5jYXRlZ29yeSA9PSBcIuaVmeiCsuaWsOmXu1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlzLnB1c2goMSk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5kYXRhW2ldLmNhdGVnb3J5ID09IFwi5oiQ5p6c5bGV56S6XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeXMucHVzaCgyKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBsaXN0ciArPSBcIjxsaT48L2xpPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5ld3NUaXRsZS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICQoXCIucGljdHVyZUJsb2NrIC5pbWd0YWJcIikuaHRtbChsaXN0cik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkKFwiLnBpY3R1cmVCbG9jayAuaW1nVGl0bGVcIikuc2hvdygpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnBpY3R1cmVCbG9jayAuaW1ndGFiXCIpLmh0bWwoJycpO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgYSA9IG9yZ2lkID8gXCImb3JnSWQ9XCIgKyBvcmdpZCA6ICcnO1xyXG4gICAgICAgICAgQ2Fyb3VzZWwoKTtcclxuXHJcbiAgICAgICAgICBmdW5jdGlvbiBDYXJvdXNlbCgpIHtcclxuICAgICAgICAgICAgJChcIi5waWN0dXJlQmxvY2sgaW1nXCIpLmF0dHIoe1wic3JjXCI6IG5ld3NJbWdbbnVtXX0pO1xyXG4gICAgICAgICAgICAkKFwiLnBpY3R1cmVCbG9jayBhXCIpLmF0dHIoe1wiaHJlZlwiOiBcIi4uL25ld3Mvc2l0ZW5ld3NEZXRhaWwuaHRtbD9pZD1cIiArIGlkc1tudW1dICsgXCImaW5kZXg9XCIgKyBudW0gKyBcIiZjYXRlZ29yeT1cIiArIGNhdGVnb3J5c1tudW1dICsgXCImaXNJbWc9XCIgKyAxICsgYX0pO1xyXG4gICAgICAgICAgICAkKFwiLnBpY3R1cmVCbG9jayAuaW1nVGl0bGVcIikuaHRtbChuZXdzVGl0bGVbbnVtXSkuc2hvdygpO1xyXG4gICAgICAgICAgICAkKFwiLnBpY3R1cmVCbG9jayAuaW1ndGFiIGxpXCIpLmVxKG51bSkuYWRkQ2xhc3MoXCJhY3RpdmVcIikuc2libGluZ3MoXCJsaVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgbnVtKys7XHJcbiAgICAgICAgICAgIGlmIChudW0gPT0gbmV3c1RpdGxlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIG51bSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAobmV3c1RpdGxlLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgdGltZXJzID0gc2V0SW50ZXJ2YWwoQ2Fyb3VzZWwsIDMwMDApO1xyXG4gICAgICAgICAgICAkKFwiLnBpY3R1cmVCbG9ja1wiKS5ob3ZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcnMpO1xyXG4gICAgICAgICAgICAgIHRpbWVycyA9IG51bGw7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICBpZiAobmV3c1RpdGxlLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXJzKTtcclxuICAgICAgICAgICAgICAgIHRpbWVycyA9IHNldEludGVydmFsKENhcm91c2VsLCAzMDAwKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICQoXCIucGljdHVyZUJsb2NrIC5pbWd0YWIgbGlcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgIG51bSA9ICQodGhpcykuaW5kZXgoKTtcclxuICAgICAgICAgICAgICBDYXJvdXNlbCgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5waWN0dXJlQmxvY2snKS5maW5kKCdhJykuYXR0cignaHJlZicsICdqYXZhc2NyaXB0OnZvaWQoMCknKTtcclxuICAgICAgICAgICAgJCgnLnBpY3R1cmVCbG9jaycpLmZpbmQoJ2ltZycpLmF0dHIoJ3NyYycsICdpbWFnZXMvZGVmYXVsdF9uZXdzLmpwZycpO1xyXG4gICAgICAgICAgICAkKFwiLnBpY3R1cmVCbG9jayAuaW1nVGl0bGVcIikuaGlkZSgpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAkKFwiLnBpY3R1cmVCbG9ja1wiKS51bmJpbmQoXCJtb3VzZWVudGVyXCIpLnVuYmluZChcIm1vdXNlbGVhdmVcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG5cclxuLy8gICAg5paw6Ze75ZKM5oiQ5p6c55qE5YiH5o2iXHJcbiAgICAgICQoXCIudGFiTmV3c0FuZFJlc3VsdCBhXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgJChcIi5uZXdzXCIpLmVxKCQodGhpcykuaW5kZXgoKSkuc2hvdygpLnNpYmxpbmdzKFwiLm5ld3NcIikuaGlkZSgpO1xyXG4gICAgICB9KVxyXG5cclxuLy8gICAg5qCh5Zut6aOO6YeHXHJcbiAgICAgIGNhbXB1c01pZW4oJChcIiNwaWNJbWdcIiksIFwicGljdHVyZUxpc3QxXCIpO1xyXG4gICAgICBjYW1wdXNNaWVuKCQoXCIuc2Nob29sTGlzdEJveFwiKSwgXCJzY2hvb2xTaG93X1wiKTtcclxuXHJcbiAgICAgIC8v54K55Ye75aSn5Zu+5p+l55yL5Y+v54K55Ye75YiH5o2i5Zu+54mHXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnNjaG9vbExpc3RCb3ggbGknLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGFfbnVtID0gJCh0aGlzKS5kYXRhKCdudW0nKTtcclxuICAgICAgICAkKCcubWFzaycpLnNob3coKTtcclxuICAgICAgICAkKCcucGljRGlhbG9nJykuc2hvdygpO1xyXG4gICAgICAgICQoJ2JvZHknKS5jc3MoJ292ZXJmbG93LXknLCAnaGlkZGVuJyk7XHJcbiAgICAgICAgJCgnI3BpY0ltZycpLmFwcGVuZCgkKCcjcGljSW1nIGxpOmx0KCcgKyAkKCcjcGljSW1nIGxpW2RhdGEtbnVtPScgKyBkYXRhX251bSArICddJykuaW5kZXgoKSArICcpJykpO1xyXG4gICAgICB9KTtcclxuICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuY2xvc2VEaWFsb2cnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLm1hc2snKS5oaWRlKCk7XHJcbiAgICAgICAgJCgnLnBpY0RpYWxvZycpLmhpZGUoKTtcclxuICAgICAgICAkKCdib2R5JykuY3NzKCdvdmVyZmxvdy15JywgJ2F1dG8nKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL+WbvueJh+aWsOmXu1xyXG4gICAgICBmdW5jdGlvbiBjYXJvdXNlbCh1bHdyYXAsIGxlZnQsIHJpZ2h0LCBsaXdpZHRoKSB7XHJcbiAgICAgICAgdmFyIGxlbiA9IHVsd3JhcC5maW5kKCdsaScpLmxlbmd0aDtcclxuICAgICAgICBpZiAobGl3aWR0aCAqIGxlbiA8IDEwMDApIHtcclxuICAgICAgICAgIHVsd3JhcC5jc3MoXCJ3aWR0aFwiLCAnMTAwMCcpO1xyXG4gICAgICAgICAgJCgnLnNjaG9vbExpc3QgLnNjaG9vbExpc3RCb3gnKS5jc3Moeyd0b3AnOiAnLTIwcHgnLH0pO1xyXG4gICAgICAgICAgJCgnLnNjaG9vbEJsb2NrQm94IC5uZXh0JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxyXG4gICAgICAgICAgJCgnLnNjaG9vbEJsb2NrQm94IC5wcmV2JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1bHdyYXAuY3NzKFwid2lkdGhcIiwgbGl3aWR0aCAqIGxlbik7XHJcbiAgICAgICAgICAkKCcuc2Nob29sTGlzdCAuc2Nob29sTGlzdEJveCcpLmNzcyh7J3RvcCc6ICcwcHgnLH0pO1xyXG4gICAgICAgICAgJCgnLnNjaG9vbEJsb2NrQm94IC5uZXh0Jykuc2hvdygpXHJcbiAgICAgICAgICAkKCcuc2Nob29sQmxvY2tCb3ggLnByZXYnKS5zaG93KClcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByZXYgPSBsZWZ0O1xyXG4gICAgICAgIHZhciBuZXh0ID0gcmlnaHQ7XHJcbiAgICAgICAgdmFyIHVsID0gdWx3cmFwO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IHVsLmZpbmQoJ2xpJykub3V0ZXJXaWR0aCh0cnVlKTtcclxuICAgICAgICBuZXh0LmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHVsLnN0b3AoKS5hbmltYXRlKHsnbWFyZ2luLWxlZnQnOiAtd2lkdGh9LCAzMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdWwuZmluZCgnbGknKS5lcSgwKS5hcHBlbmRUbyh1bCk7XHJcbiAgICAgICAgICAgIHVsLmNzcyh7J21hcmdpbi1sZWZ0JzogMH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcHJldi5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB1bC5maW5kKCdsaTpsYXN0JykucHJlcGVuZFRvKHVsKTtcclxuICAgICAgICAgIHVsLmNzcyh7J21hcmdpbi1sZWZ0JzogLXdpZHRofSk7XHJcbiAgICAgICAgICB1bC5zdG9wKCkuYW5pbWF0ZSh7J21hcmdpbi1sZWZ0JzogMH0sIDMwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gICAgICDmoKHlm63po47ph4dcclxuICAgICAgICogQHBhcmFtICAgICAkb2JqXHJcbiAgICAgICAqIEBwYXJhbSAgICAgdGVtSWQgICDmqKHmnb9JRFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gY2FtcHVzTWllbigkb2JqLCB0ZW1JZCwgb3JnaWQpIHtcclxuICAgICAgICBpZiAob3JnaWQpIHtcclxuICAgICAgICAgIHZhciB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICdyZW5yZW50b25nL3NjaG9vbHBpY3R1cmVzLzEwMC8xP29yZ0lkPScgKyBvcmdpZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHVybCA9IHNlcnZpY2UucHJlZml4ICsgJy9yZW5yZW50b25nL3NjaG9vbHBpY3R1cmVzLzEwMC8xJztcclxuICAgICAgICB9XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwiMjAwXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgZGF0YS5kYXRhLmRhdGFbaV0uaWQgPSBkYXRhLmRhdGEuZGF0YVtpXS5pZCA9PSAnJyA/ICdpbWFnZXMvMy5naWYnIDogZ2V0UGljUGF0aChkYXRhLmRhdGEuZGF0YVtpXS5pZCk7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5kYXRhW2ldLm51bSA9IGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBodG1sID0gdGVtcGxhdGUodGVtSWQsIGRhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSBzaG93cHJvbXB0KCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICRvYmouaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICBpZigkKCcuc2Nob29sTGlzdEJveCcpLmNoaWxkcmVuKCcubm8tY29udGVudCcpKXtcclxuICAgICAgICAgICAgICAgICQoJy5zY2hvb2xMaXN0Qm94JykuY3NzKCdwb3NpdGlvbicsJ2luaXRpYWwnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgLy/osIPnlKjpppbpobXlm77niYfmlrDpl7tcclxuICAgICAgICAgICAgICBjYXJvdXNlbCgkKCcuc2Nob29sTGlzdEJveCcpLCAkKCcuc2Nob29sQmxvY2tCb3ggLnByZXYnKSwgJCgnLnNjaG9vbEJsb2NrQm94IC5uZXh0JyksIDI0MCk7XHJcbiAgICAgICAgICAgICAgLy/osIPnlKjlvLnlh7rmoYblm77niYfmlrDpl7tcclxuICAgICAgICAgICAgICBjYXJvdXNlbCgkKCcjcGljSW1nJyksICQoJy5waWNJbWdMZWZ0JyksICQoJy5waWNJbWdSaWdodCcpLCA3OTcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5qCh5Zut6aOO6YeH5byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bmoKHlm63po47ph4flvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuLy8gICAg5aS06YOo5a2m5qCh55m96ZO25Yy65YiH5o2iXHJcbiAgICAgICQoXCJib2R5XCIpLmRlbGVnYXRlKFwiLnNjaG9vbENob29zZSB1bCBsaS5saXN0PnNwYW5cIiwgXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIDtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHZhciBUaGlzID0gdGhpcztcclxuICAgICAgICBhcHBJZCA9ICQoVGhpcykuYXR0cignZGF0YS1pZCcpO1xyXG4gICAgICAgICQoVGhpcykucGFyZW50cyhcIi5jaG9vc2VBcmVhXCIpLmZpbmQoXCIuc2Nob2xsX25hbWVcIikudGV4dCgkKFRoaXMpLmZpbmQoJ2EnKS50ZXh0KCkpLmF0dHIoXCJ0aXRsZVwiLCAkKFRoaXMpLmZpbmQoJ2EnKS5hdHRyKCd0aXRsZScpKS5hdHRyKFwiZGF0YS1pZFwiLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgJChUaGlzKS5wYXJlbnRzKFwiLmNob29zZUxpc3RcIikuaGlkZSgpO1xyXG4gICAgICAgICQoVGhpcykucGFyZW50cyhcIi5jaG9vc2VBcmVhLnRhYmNob29zZVwiKS5maW5kKFwiLmFycm93XCIpLmFkZENsYXNzKFwiYXJyb3dEb3duXCIpLnJlbW92ZUNsYXNzKFwiYXJyb3dVcFwiKTtcclxuICAgICAgICBpZiAoJChcIi5zY2hvb2xDaG9vc2UgI3NjaG9vbExpc3QgbGkubGlzdD5zcGFuXCIpLmxlbmd0aCAtIDEgPT0gaGVhZGVyLmdldFNjaG9vbExpc3QoKS5sZW5ndGggJiYgJChUaGlzKS5hdHRyKCdkYXRhLWlkJykgPT0gb3JnQ29uZmlnLm9yZ0lkcy5iYWl5aW5BcmVhSWQpIHsvL+eCueWHu+eZvemTtuWMulxyXG5cclxuICAgICAgICAgIC8vIGdldER5bmFtaWMoICQoXCIjZHluYW1pY19saXN0XCIpICwgJ2R5bmFtaWNMaXN0JyAsICQoVGhpcykuYXR0cignZGF0YS1pZCcpICk7XHJcbiAgICAgICAgICBzZWNvbmROYXYuZ2V0U2hhcmVSZXNvdXJjZUNvdW50KG9yZ0NvbmZpZy5vcmdJZHMuYmFpeWluQXJlYUlkKTtcclxuICAgICAgICAgIHNlY29uZE5hdi5nZXRUb3RhbFVzZXIob3JnQ29uZmlnLm9yZ0lkcy5iYWl5aW5BcmVhSWQpO1xyXG4gICAgICAgICAgZ2V0bG9naW5lZFRlYU51bXMob3JnQ29uZmlnLm9yZ0lkcy5iYWl5aW5BcmVhSWQpO1xyXG4gICAgICAgICAgZ2V0VGVhU29ydCgkKFwiI3RlYVNvcnQ+ZGl2XCIpLCAndGVhU29ydF8nLCAxLCAzMCwgb3JnQ29uZmlnLm9yZ0lkcy5iYWl5aW5BcmVhSWQpO1xyXG4gICAgICAgICAgLy8gZ2V0U2Nob29sT3JUZWFjaGVyKCAkKFwiLnNjaG9vbFNob3cgLnNjaG9vbExpc3RcIikgLCBcInNjaG9vbExpc3RfXCIgLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSApO1xyXG4gICAgICAgICAgLy8gJChcIi5ob3RTcGFjZSAuaG90TmF2PmxpXCIpLnNob3coKTtcclxuICAgICAgICAgIC8vIGhvdHNwYWNlKCAkKFwiI2dvb2RzcGFjZV9jb250ZW50XCIpICwgJ2dvb2RzcGFjZUNvbnRlbnQnICwgJzInICwgMzAgLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgICBob3RzcGFjZSgkKFwiI0FsYnVtXCIpLCAnQWxidW1fJywgXCIyXCIsIDI2LCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgICBuZXcgYWxidW0oXCIjQWxidW1cIik7XHJcbiAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aW1lcnMpO1xyXG4gICAgICAgICAgdGltZXJzID0gbnVsbDtcclxuICAgICAgICAgIGxvYWROZXdzKCk7XHJcbiAgICAgICAgICAvL+iOt+WPluaWsOmXu1xyXG4gICAgICAgICAgZ2V0TmV3cyhcIjFcIiwgXCJuZXdzU2hvd0JveFwiKTtcclxuICAgICAgICAgIC8v6I635Y+W5oiQ5p6cXHJcbiAgICAgICAgICBnZXROZXdzKFwiMlwiLCBcInJlc3VsdFNob3dCb3hcIik7XHJcbiAgICAgICAgICAvL+ivvuWgguWunuW9lVxyXG4gICAgICAgICAgZ2V0VmlkZW9MaXN0KCQoXCIjdmlkZW9MaXN0XCIpLCBcInZpZGVvTGlzdF9cIik7XHJcbiAgICAgICAgICBjYW1wdXNNaWVuKCQoXCIjcGljSW1nXCIpLCBcInBpY3R1cmVMaXN0MVwiKTtcclxuICAgICAgICAgIGNhbXB1c01pZW4oJChcIi5zY2hvb2xMaXN0Qm94XCIpLCBcInNjaG9vbFNob3dfXCIpO1xyXG4gICAgICAgICAgLy8gJChcIi5ob3RTcGFjZSBhLm1vcmVcIikuYXR0cihcImhyZWZcIiwgc2VydmljZS5uZXdTcGFjZUJhc2UgKyAnL0pDZW50ZXJIb21lL3d3dy9pbnRlcnNwYWNlL2ludGVyc3BhY2UuaHRtbCcpO1xyXG5cclxuICAgICAgICAgICQoXCIjc2Nob29sTGlzdFwiKS5odG1sKHRlbXBsYXRlKCdzY2hvb2xfbGlzdCcsIHtkYXRhOiBoZWFkZXIuZ2V0U2Nob29sTGlzdCgpfSkpO1xyXG5cclxuICAgICAgICB9IGVsc2Ugey8v6Z2e55m96ZO25Yy6XHJcbiAgICAgICAgICB2YXIgb3JnaWQgPSAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKTtcclxuICAgICAgICAgIHZhciBzY2hvb2xOYW1lID0gJChUaGlzKS5jaGlsZHJlbigpLmF0dHIoJ3RpdGxlJyk7XHJcbiAgICAgICAgICAvLyBnZXREeW5hbWljKCAkKFwiI2R5bmFtaWNfbGlzdFwiKSAsICdkeW5hbWljTGlzdCcgLCBudWxsICwgJChUaGlzKS5hdHRyKCdkYXRhLWlkJykgKTtcclxuICAgICAgICAgIHNlY29uZE5hdi5nZXRTaGFyZVJlc291cmNlQ291bnQobnVsbCwgJChUaGlzKS5hdHRyKCdkYXRhLWlkJykpO1xyXG4gICAgICAgICAgc2Vjb25kTmF2LmdldFRvdGFsVXNlcihudWxsLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgICBnZXRsb2dpbmVkVGVhTnVtcyhudWxsLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgICBnZXRUZWFTb3J0KCQoXCIjdGVhU29ydD5kaXZcIiksICd0ZWFTb3J0XycsIDEsIDMwLCBudWxsLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgICAvLyBnZXRTY2hvb2xPclRlYWNoZXIoICQoXCIuc2Nob29sU2hvdyAuc2Nob29sTGlzdFwiKSAsIFwic2Nob29sTGlzdF9cIiAsIG51bGwgLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSApO1xyXG4gICAgICAgICAgLy8gaG90c3BhY2UoICQoXCIjZ29vZHNwYWNlX2NvbnRlbnRcIikgLCAnZ29vZHNwYWNlQ29udGVudCcgLCAnMicgLCAzMCAsIG51bGwgLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgICBob3RzcGFjZSgkKFwiI0FsYnVtXCIpLCAnQWxidW1fJywgXCIyXCIsIDI2LCBudWxsLCAkKFRoaXMpLmF0dHIoJ2RhdGEtaWQnKSk7XHJcbiAgICAgICAgICBuZXcgYWxidW0oXCIjQWxidW1cIik7XHJcbiAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aW1lcnMpO1xyXG4gICAgICAgICAgdGltZXJzID0gbnVsbDtcclxuICAgICAgICAgIGxvYWROZXdzKG9yZ2lkKTtcclxuXHJcbiAgICAgICAgICAvL+iOt+WPluaWsOmXu1xyXG4gICAgICAgICAgZ2V0TmV3cyhcIjFcIiwgXCJuZXdzU2hvd0JveFwiLCBvcmdpZCk7XHJcbiAgICAgICAgICAvL+iOt+WPluaIkOaenFxyXG4gICAgICAgICAgZ2V0TmV3cyhcIjJcIiwgXCJyZXN1bHRTaG93Qm94XCIsIG9yZ2lkKTtcclxuICAgICAgICAgIC8v6K++5aCC5a6e5b2VXHJcbiAgICAgICAgICBnZXRWaWRlb0xpc3QoJChcIiN2aWRlb0xpc3RcIiksIFwidmlkZW9MaXN0X1wiLGVuY29kZVVSSUNvbXBvbmVudChzY2hvb2xOYW1lKSk7XHJcblxyXG4gICAgICAgICAgY2FtcHVzTWllbigkKFwiI3BpY0ltZ1wiKSwgXCJwaWN0dXJlTGlzdDFcIiwgb3JnaWQpO1xyXG4gICAgICAgICAgY2FtcHVzTWllbigkKFwiLnNjaG9vbExpc3RCb3hcIiksIFwic2Nob29sU2hvd19cIiwgb3JnaWQpO1xyXG4gICAgICAgICAgLy8gJChcIi5ob3RTcGFjZSBhLm1vcmVcIikuYXR0cihcImhyZWZcIiwgc2VydmljZS5uZXdTcGFjZUJhc2UgKyAnL0pDZW50ZXJIb21lL3d3dy9ob21lL2luZGV4Lmh0bWw/c3BhY2VJZD0nKyQoVGhpcykuYXR0cignZGF0YS1pZCcpKycmc3BhY2VUeXBlPXNjaG9vbCcpO1xyXG5cclxuICAgICAgICAgIGlmICgkKFwiLnNjaG9vbENob29zZSAjc2Nob29sTGlzdCBsaS5saXN0PnNwYW5cIikubGVuZ3RoID09IGhlYWRlci5nZXRTY2hvb2xMaXN0KCkubGVuZ3RoKSB7Ly/nrKzkuIDmrKHngrnlh7vpnZ7nmb3pk7bljLrvvIzmi7zmjqXnmb3pk7bljLrmlbDmja5cclxuICAgICAgICAgICAgJChcIi5ob3RTcGFjZSAuaG90TmF2PmxpW3R5cGUhPScyJ11cIikuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKFwiI3NjaG9vbExpc3RcIikuaHRtbCh0ZW1wbGF0ZSgnc2Nob29sX2xpc3QnLCB7XHJcbiAgICAgICAgICAgICAgZGF0YTogW3tcclxuICAgICAgICAgICAgICAgICdpZCc6IG9yZ0NvbmZpZy5vcmdJZHMuYmFpeWluQXJlYUlkLFxyXG4gICAgICAgICAgICAgICAgJ25hbWUnOiAn55m96ZO25Yy6JyxcclxuICAgICAgICAgICAgICAgICdzaG93TmFtZSc6ICfnmb3pk7bljLonXHJcbiAgICAgICAgICAgICAgfV0uY29uY2F0KGhlYWRlci5nZXRTY2hvb2xMaXN0KCkpXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pXHJcblxyXG5cclxuXHJcbiJdfQ==
