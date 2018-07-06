require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);

  define('',['jquery', 'template', 'service', 'footer', 'header', 'layer', 'page','jqueryUIB'],
    function ($, template, service, footer, header, layer, Page,jqueryUIB) {
      // $.getJSON(service.htmlHost + 'pf/api/information/list', function (result) {
      //    console.log(result)
      //  })
      var pageSize = 10;
      var currentPage = 1;

      getMessageList(currentPage, '');

      function getMessageList(currentPage, isPaging, appName) {
        var data = {
          'page.currentPage': currentPage,
          'page.pageSize': pageSize
        };
        if (!!appName && appName != '请选择') {
          data.appName = appName;
        }
        $.ajax({
          type: "get",
          url: service.htmlHost + 'pf/api/information/list.jsonp',
          dataType: 'jsonp',
          jsonp: "callback",
          data: data,
          cache: false,
          success: function (data) {
            var dataList = data.data.datalist;
            $('.message-list').html('');
            $.each(dataList, function (i, d) {
              var $listItem = $("<li>");
              if (d.isRead) {
                $listItem.addClass('read');
              } else {
                $listItem.addClass('not-read');
              }
              var $check = $('<div>');
              $check.addClass('form-check-box fl');
              $check.html('<div class="form-check"><span></span></div>');
              $check.find('.form-check').attr('data-id', d.id);
              $check.click(function (e) {
                if ($(this).find('.form-check').hasClass('checked')) {
                  $(this).find('.form-check').removeClass('checked');
                } else {
                  $(this).find('.form-check').addClass('checked');
                }
              });
              var $oA = $('<a>');
              $oA.click(function () {
                var id = d.id;
                clickMessage(id, d.url, d.appName, currentPage, appName);
                $listItem.attr('class', 'read');
              });
              var conStr = '<div class="mes-con' +
                ' fl"><span' +
                ' class="mr8">[' + d.appName + ']</span><span>' + d.title + '</span></div><span class="mes-date fr">' + d.sendDate + '</span>';

              $listItem.html($check);
              $oA.html(conStr);
              $listItem.append($oA);
              $('.message-list').append($listItem);
            })

            if (!isPaging) {
              $('#page').html('');
            }
            if (data['data']['totalPages'] > 1 && !isPaging) {
              renderPage('page', data['data']['totalCount'], appName, currentPage);
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
          }
        })
      }

      function jsoncallbackaa(data) {
        alert(data.status);
      }

      //翻页
      function renderPage(domId, total, appName, currentPage) {
        var p = new Page();
        p.init({
          target: '#' + domId,
          pagesize: pageSize,
          pageCount: 8,
          current: currentPage ? currentPage : 1,
          count: total,
          callback: function (current) {
            getMessageList(current, true, appName);
          }
        });
      }

      //checkebox
      $('.form-check').click(function () {
        if ($(this).hasClass('checked')) {
          if ($(this).hasClass('all')) {
            $('.form-check').removeClass('checked');
          } else {
            $(this).removeClass('checked');
          }
        } else {
          if ($(this).hasClass('all')) {
            $('.form-check').addClass('checked');
          } else {
            $(this).addClass('checked');
          }
        }
      })

      //删除请求
      function deleteMessage(ids) {
        if (ids.length > 0) {
          layer.confirm('您确定要删除这些消息么？', function () {
            layer.closeAll();
            $.ajax({
              type: "get",
              url: service.htmlHost + 'pf/api/information/delete',
              dataType: 'json',
              data: {
                ids: ids.join(',')
              },
              success: function (data) {
                if (data.code == "success") {
                  getMessageList(currentPage, '', $('.form-app .type').html());
                }
              },
              error: function (data) {
              }
            })
          })
        } else {
          layer.alert('您还没有选中的信息!!!');
        }
      }

      //删除
      $('.btn-del').click(function () {
        var ids = [];
        $('.message-list .checked').each(function (i, d) {
          ids.push($(this).attr('data-id'));
        })
        deleteMessage(ids);
      })

      //已读请求
      function readMessage(ids) {
        if (ids.length > 0) {
          $.ajax({
            type: "get",
            url: service.htmlHost + 'pf/api/information/mark',
            dataType: 'json',
            cache: false,
            data: {
              ids: ids.join(',')
            },
            success: function (data) {
              if (data.code == 'success') {
                layer.msg('已标记为已读');
                setTimeout(function () {
                  layer.closeAll();
                }, 1000)
                $('.checked').parents('.not-read').attr('class', 'read');
              }
            }
          })
        } else {
          layer.alert('您还没有选中的消息!!!');
        }
      }

      function clickMessage(id, url, selfappName, currentPage, searchappName) {
        if (selfappName != "人人通") {
          var url = service.htmlHost + 'pf/api/information/view/' + id;
          window.open(url, '_blank');
        } else {
          var url = service.htmlHost + 'pf/api/information/mark?ids=' + id;
          $.ajax({
            type: 'get',
            url: url,
            dataType: 'json',
            cache: false,
            success: function (data) {
              if (data.code == 'success') {
                getMessageList(currentPage, '', searchappName);
              }
            }
          })
        }
      }

      //标记为已读
      $('.btn-read').click(function () {
        var ids = [];
        $('.message-list .checked').each(function (i, d) {
          ids.push($(this).attr('data-id'));
        })
        readMessage(ids);
      })
      /*
  * 应用名称下拉选项*/
      $.ajax({
        type: "get",
        url: service.htmlHost + 'pf/api/information/getAppType',
        dataType: 'json',
        cache: false,
        success: function (data) {
          var appStr = '<li><p class="select" title="请选择" data-id="">请选择</p></li>';
          $.each(data.data, function (index, datas) {
            appStr += '<li><p class="select">' + datas.appName + '</p></li>';
          });
          $('.form-app .types').html(appStr);
          $('.form-app .type').html('请选择');
          mbSelect();
        },
        error: function (data) {
          // JCenterHelper.errorHandle(data);
        }
      });

      function mbSelect() {
        //选择项 隐藏下拉框
        $(".form-select").on("click", function (e) {
          var e = e || window.event;
          var tar = e.target || e.srcElement;
          if ($(tar).hasClass('select')) {
            $(".types").hide();
            $(tar).parents('.form-select').find('.type').html($(tar).html());
            if ($(tar).parents('.form-select').find('.type').html() == '请选择') {
              getMessageList(currentPage, '', '');
            } else {
              getMessageList(currentPage, '', $(tar).parents('.form-select').find('.type').html());
            }
          }
          if ($(tar).hasClass('type')) {
            if ($(tar).parent().find(".types").css('display') == 'none') {
              $(".types").hide();
              $(tar).parent().find(".types").show();
            } else {
              $(tar).parent().find(".types").hide();
            }
          }
        });
        //点击下空白处，下拉框消失
        $(document).on("click", function (e) {
          var e = e || window.event;
          var tar = e.target || e.srcElement;
          $(".types").hide();
        });
        //阻止冒泡
        $(".form-select").click(function (e) {
          // e.stopPropagation();
          return false;
        });
      }
    });
})