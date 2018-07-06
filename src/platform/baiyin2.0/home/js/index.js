require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  define('', ['jquery', 'fullPage', 'template', 'layer', 'textScroll', 'tab', 'service', 'orgConfig', 'tools', 'banner', 'ajaxBanner', 'secondNav', 'footer', 'header', 'appVerify', 'album'],
    function ($, fullPage, template, layer, textScroll, tab, service, orgConfig, tools, banner, ajaxBanner, secondNav, footer, header, appVerify, album) {
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
          success: function (data) {
            if (data && data.code == "success") {
              var html = template(temId, data);
              $obj.html(html);
            } else {
              layer.alert("获取公告异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取公告异常。", {icon: 0});
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
          success: function (data) {
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
                    data.data[index].orgid = "&orgId=" + orgid
                  } else {
                    data.data[index].orgid = '';
                  }
                });
                html = template(id + "_", data);
              } else {
                html = showprompt();
              }
              $("#" + id).html(html);//填充新闻

            } else {
              layer.alert("获取新闻异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取新闻异常。", {icon: 0});
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
          url=service.htmlHost + '/pf/api/qtapp/ktsl_recList?school_name='+ school_name;
        } else {
          url= service.htmlHost + '/pf/api/qtapp/ktsl_recList';
        }
        $.ajax({
          url: url,
          type: 'GET',
          success: function (data) {
            if (data && data.code == "success") {
              var html;
              if (data.data && data.data.result && data.data.result.data && data.data.result.data.length > 0) {
                html = template(temId, data);
              } else {
                html = showprompt();
              }
              $obj.html(html);
            } else {
              layer.alert("获取课堂实录异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取课堂实录异常。", {icon: 0});
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
            success: function (data) {
              if (data && data.code == "success") {
                allData.loginedTeaNums[key] = data.data;
                $(".teacher_ranked .teacherNum .num").text(data.data);
              } else {
                layer.alert(data.msg, {icon: 0});
              }
            },
            error: function (data) {
              layer.alert("获取在线用户数异常。", {icon: 0});
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
            success: function (data) {
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
                  $obj.width($obj.find('ul.listPage').length * (parseInt($obj.find('ul.listPage').width())));
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
                layer.alert(data.msg, {icon: 0});
              }
            },
            error: function (data) {
              layer.alert("获取老师排行异常。", {icon: 0});
            }
          });
        } else {
          $obj.html(template(temId, allData.teaSorts[key]));
          $obj.css('margin-left', '0px');
          teaSortNum = 0;
          if ($obj.find('ul.listPage').length > 0) {
            $obj.width($obj.find('ul.listPage').length * (parseInt($obj.find('ul.listPage').width())));
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
          success: function (data) {
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
              layer.alert("获取友情链接异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取友情链接异常。", {icon: 0});
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
            success: function (data) {
              if (data && data.code == "success") {
                var html = "";
                if (data.data && data.data.data && data.data.data.length > 0) {
                  handleData(type);

                  function handleData(type) {
                    if (type == '2' || type == '3' || type == '5' || type == '6') {
                      $.each(data.data.data, function (index) {
                        data.data.data[index].spaceUrl = data.msg + '/' + data.data.data[index].spaceUrl + '&requireLogin=false';
                        /*data.data.data[index].icon = data.data.data[index].icon ? getPicPath(data.data.data[index].icon) : getDefaultAvatar(type)*/
                        data.data.data[index].icon = data.data.data[index].icon ?  data.data.data[index].icon : getDefaultAvatar(type);
                        data.data.data[index].name = (data.data.data[index].label).length > 10 ? (data.data.data[index].name).substring(0, 9) + '...' : data.data.data[index].name;
                        data.data.data[index].label = (data.data.data[index].label).length > 12 ? (data.data.data[index].label).substring(0, 11) + '...' : data.data.data[index].label;
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
                        data.data.data[index].icon = (data.data.data[index].icon ? data.data.data[index].icon : getDefaultAvatar('subject') );
                      });
                    }
                  }

                  html = "<li class=\"album_big\"><span href=\"javascript:;\" id=\"you_logo\">教师空间</span></li>" + template(temId, data.data);
                  $obj.html(html);
                  $obj.find('p').remove();
                } else {
                  html = "<li class=\"album_big\"><span href=\"javascript:;\" id=\"you_logo\">教师空间</span></li>" + showprompt();
                  $obj.html(html);
                }
                // $obj.append(html);
              } else {
                layer.alert(data.msg, {icon: 0});
              }
            },
            error: function (data) {
              var errorInfo = {
                'other': '热门空间',
                'subject': '热门学科空间',
                'school': '热门学校空间'
              }
              layer.alert("获取" + (errorInfo[type] ? errorInfo[type] : errorInfo['other']) + "异常", {icon: 0});
            }
          });
        } else {
          $obj.html(template(temId, allData.hotspaces[key][type]));
          $obj.css('margin-left', '0px');
        }
      };


      //初始化页面部分按钮链接
      function initLink() {
        $(".icon-resource").attr('href', service.sourcePlatformBase + '/syncTeaching/index');//资源
        $(".icon-rank").attr("href", service.htmlHost + "/dist/platform/www/rank/allRank.html");//排行版
        $("#teacherRanked").attr("href", service.htmlHost + "/dist/platform/www/rank/teacherRank.html");//教师排行版
        $(".icon-yk").attr("href", service.htmlHost + "/dist/platform/www/home/feitianUclass.html");//飞天课堂
        $("body").delegate('.icon-activity', 'click', function () {
          $.ajax({
            url: service.activityHost + '/anonymous/activityIndex',
            type: 'GET',
            dataType: "jsonp",
            jsonp: "callback",
            success: function (data) {
              if (data.code == "success") {
                window.open(service.activityHost + data.data + ( header.getUser() ? '?login=true' : '?login=false' ), '_target');
              } else {
                layer.alert(data.msg, {icon: 0});
              }
            },
            error: function (data) {
              layer.alert('服务器异常', {icon: 0});
            }
          });
        });//专题活动
        $("#applistMore>a").attr("href", service.htmlHost + "/dist/platform/www/app/app.html");//更多应用
      }

      /**
       * 第三方 更多 入口地址
       */
      initMoreLink();
      function initMoreLink() {
        $.ajax({
          url: service.htmlHost + '/pf/api/header/more',
          type: 'GET',
          success: function (data) {
            if (data && data.code == "success") {
              $(".icon-studio").attr("href", data.data.msgzs_more);
            } else {
              alert("初始化数据异常")
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
        return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
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
        this.target.css({'position': 'relative'});
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
          },
          this.speed,
          function () {
            setTimeout(function () {
              _this.move(_this.starNum)
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
          layer.alert("请输入搜索内容", {icon: 0});
          return false;
        }
        window.location.href = service.sourcePlatformBase + '/syncTeaching/index?title=' + encodeURIComponent($.trim($(this).siblings(".searchText").val())) + "&requireLogin=false"
      });

      //判断当前用户是否有权限进入该APP,
      $("body .wrap").delegate('.verify_app_enter', 'click', function () {
        if (header.getUser()) {
          appVerify.verifyApp(service.appIds[$(this).attr('type')], '2')
        } else {
          layer.alert("请登录后操作。", {icon: 0});
          return;
        }
      });

      $("body").delegate('#activityRegister,#reviewEnter', 'click', function () {
        var url = service.activityHost + '/anonymous/activityIndex';
        if ($(this).attr("id") == 'reviewEnter') {
          if (!header.getUser()) {
            layer.alert("请登录后再试", {icon: 0});
            return;
          }
          if (header.getUserRole() == "3001" || header.getUserRole() == "3002" || header.getUserRole() == "3003") {
            window.location.href = service.activityHost + '/temp/activity/www/background/index.html';
            return;
          } else {
            layer.alert("您没有权限", {icon: 0});
            return;
          }
        }
        $.ajax({
          url: url,
          type: 'GET',
          dataType: "jsonp",
          jsonp: "callback",
          success: function (data) {
            if (data.code == "success") {
              window.location.href = service.activityHost + data.data + ( header.getUser() ? '?login=true' : '?login=false' );
            } else {
              layer.alert(data.msg, {icon: 0});
            }
          },
          error: function (data) {
            layer.alert('服务器异常', {icon: 0});
          }
        });
      });
      $("body").delegate("#jxds,#ftyk", 'click', function () {
        if (header.getUser()) {
          window.open($(this).find("a").attr("data-href"), '_blank');
        } else {
          layer.alert("请登录后操作。", {icon: 0});
          return;
        }
      });


      var onOff = true;
      var $teaSort = $('#teaSort>div');
      var teaSortNum = 0;

      function move(n, $obj, width) {

        $obj.animate(
          {
            'margin-left': width * -n
          },
          800,
          function () {
            onOff = true;
          }
        );
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
        $("html,body").animate({scrollTop: 0}, 500);
      });
//    教师照片墙效果
      var album1 = new album('#Album');
//    新闻图片轮播

      loadNews();

      function loadNews(orgid) {
        var newsTitle = [];
        var newsImg = [], ids = [], categorys = [];
        var num = 0, listr = "", prevImg;
        if (orgid) {
          url = service.htmlHost + 'pf/api/news/getLimit?isImg=1&limit=5' + '&orgId=' + orgid;
        } else {
          url = service.htmlHost + 'pf/api/news/getLimit?isImg=1&limit=5';
        }
        $.ajax({
          url: url,
          type: 'GET',
          success: function (data) {
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
            $(".pictureBlock img").attr({"src": newsImg[num]});
            $(".pictureBlock a").attr({"href": "../news/sitenewsDetail.html?id=" + ids[num] + "&index=" + num + "&category=" + categorys[num] + "&isImg=" + 1 + a});
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
            })
            $(".pictureBlock .imgtab li").on("click", function (e) {
              num = $(this).index();
              Carousel();
            })
          }
          else {
            $('.pictureBlock').find('a').attr('href', 'javascript:void(0)');
            $('.pictureBlock').find('img').attr('src', 'images/default_news.jpg');
            $(".pictureBlock .imgTitle").hide().html('');
            $(".pictureBlock").unbind("mouseenter").unbind("mouseleave");
          }
        }, function (err) {
          console.log(err);
        })
      }


//    新闻和成果的切换
      $(".tabNewsAndResult a").on("click", function (e) {
        $(this).addClass("active").siblings().removeClass("active");
        $(".news").eq($(this).index()).show().siblings(".news").hide();
      })

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
          $('.schoolList .schoolListBox').css({'top': '-20px',});
          $('.schoolBlockBox .next').css('display', 'none')
          $('.schoolBlockBox .prev').css('display', 'none')
        } else {
          ulwrap.css("width", liwidth * len);
          $('.schoolList .schoolListBox').css({'top': '0px',});
          $('.schoolBlockBox .next').show()
          $('.schoolBlockBox .prev').show()
        }
        var prev = left;
        var next = right;
        var ul = ulwrap;
        var width = ul.find('li').outerWidth(true);
        next.click(function () {
          ul.stop().animate({'margin-left': -width}, 300, function () {
            ul.find('li').eq(0).appendTo(ul);
            ul.css({'margin-left': 0});
          });
        });
        prev.click(function () {
          ul.find('li:last').prependTo(ul);
          ul.css({'margin-left': -width});
          ul.stop().animate({'margin-left': 0}, 300);
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
          success: function (data) {

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
              if($('.schoolListBox').children('.no-content')){
                $('.schoolListBox').css('position','initial');
              }
              //调用首页图片新闻
              carousel($('.schoolListBox'), $('.schoolBlockBox .prev'), $('.schoolBlockBox .next'), 240);
              //调用弹出框图片新闻
              carousel($('#picImg'), $('.picImgLeft'), $('.picImgRight'), 797);
            } else {
              layer.alert("获取校园风采异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取校园风采异常。", {icon: 0});
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
        if ($(".schoolChoose #schoolList li.list>span").length - 1 == header.getSchoolList().length && $(This).attr('data-id') == orgConfig.orgIds.baiyinAreaId) {//点击白银区

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

          $("#schoolList").html(template('school_list', {data: header.getSchoolList()}));

        } else {//非白银区
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
          getVideoList($("#videoList"), "videoList_",encodeURIComponent(schoolName));

          campusMien($("#picImg"), "pictureList1", orgid);
          campusMien($(".schoolListBox"), "schoolShow_", orgid);
          // $(".hotSpace a.more").attr("href", service.newSpaceBase + '/JCenterHome/www/home/index.html?spaceId='+$(This).attr('data-id')+'&spaceType=school');

          if ($(".schoolChoose #schoolList li.list>span").length == header.getSchoolList().length) {//第一次点击非白银区，拼接白银区数据
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
})



