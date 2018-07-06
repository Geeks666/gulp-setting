require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('',['jquery', 'template', 'service', 'tool', 'banner', 'textScroll', 'scrollNav', 'center', 'main', 'footer', 'header', 'layer', 'indexApp'],
    function ($, template, service, tools, banner, textScroll, scrollNav, center, main, footer, header, layer, indexApp) {
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
        if (!header.getUser()) layer.alert('请登录后操作。', {icon: 0});
        else location.href = service.newSpaceBase + '/home?requireLogin=true';
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
          success: function (data) {
            if (data && data.code == "success") {
              $obj.html(template(temId, data));
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
       * 获取应用列表
       * @param $obj
       * @param temId 模板ID
       */
      function getAppList($obj, temId) {
        $.ajax({
          url: service.htmlHost + '/pf/api/app/list?isRecommend=1',
          type: 'GET',
          success: function (data) {
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
              layer.alert("获取应用异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取应用异常。", {icon: 0});
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
          success: function (data) {
            if (data && data.code == "success") {
              data.host = service.sourcePlatformBase;
              $obj.append(template(temId, data));
              $obj.find(".discipline_list:odd").attr("style", "background: rgb(237, 237, 237);");
            } else {
              layer.alert("获取学科信息异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取学科信息异常。", {icon: 0});
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
          success: function (data) {
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
              layer.alert("获取新闻异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取新闻异常。", {icon: 0});
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
          success: function (data) {
            if (data && data.code == "success") {
              var html = "";
              if (data.data && data.data.data && data.data.data.length > 0) {
                handleData(type);

                function handleData(type) {
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
                      data.data.data[index].icon = (data.data.data[index].icon ? data.data.data[index].icon : getDefaultAvatar('subject') );
                    });
                  }
                }

                html = template(temId, data.data);
              } else {
                html = showprompt();
              }
              $obj.html(html);
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
          success: function (data) {
            if (data && data.code == "success") {
              var html = "";
              if (data.data && data.data.length > 0) {
                $.each(data.data, function (index) {
                  var dynamic = data.data[index];
                  data.data[index].memberInfo.spaceUrl = data.msg + dynamic.memberInfo.spaceUrl + '&requireLogin=false';
                  data.data[index].memberInfo.picurl = (dynamic.memberInfo.picurl ? dynamic.memberInfo.picurl : (getDefaultAvatar(dynamic.memberInfo.usertype)) );
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
              layer.alert("获取个人空间动态异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取个人空间动态异常。", {icon: 0});
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
          success: function (data) {
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
              layer.alert("获取热门名师工作室异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取热门名师工作室异常。", {icon: 0});
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
          success: function (data) {
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
              layer.alert("获取名师工作室动态异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取名师工作室动态异常。", {icon: 0});
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
          success: function (data) {
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
              layer.alert("获取数字图书馆异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取数字图书馆异常。", {icon: 0});
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
       * 初始化banner
       * @param bannerList 如果请求不到banner图片，则显示bannerList
       */
      function initBanner(bannerList) {
        $.ajax({
          url: service.htmlHost + '/pf/api/friend/banner?limit=3',
          type: 'GET',
          success: function (data) {
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
              layer.alert("初始化banner异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("初始化banner异常。", {icon: 0});
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
          success: function (data) {
            if (data && data.code == "success") {
              $("#subject_section .title a").attr("href", data.data.res_more);
              $(".resources .title a").attr("href", data.data.res_more);
              $(".hot-studio .title a").attr("href", data.data.msgzs_more);
            } else {
              alert("初始化banner异常")
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
        return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
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
    }
  );
})

