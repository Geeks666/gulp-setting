'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by lsmtty on 2017/4/19.
 */
define("dialog", ['jquery', 'tools', 'service'], function ($, tools, service) {
    var dialogClick = function dialogClick(callBack, obj) {
        if (!callBack && !obj) {
            callBack = function callBack() {};
            obj = {};
        }
        $('#mask').on({
            'mousewheel': function mousewheel() {
                return false;
            },
            'click': function click() {
                return false;
            }
        });
        //删除确定按钮
        $('#confirm').click(function () {
            if (!obj.output) {
                if (obj.appId) {
                    tools.textTip('您还未选择应用');
                } else {
                    if (obj.hintText) {
                        tools.textTip(obj.hintText);
                    } else {
                        tools.textTip('请输入完整内容');
                    }
                }
                return false;
            }
            if (typeof callBack == 'function') {
                if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object') {
                    callBack(obj);
                } else {
                    callBack();
                }
            }
            $('#mask').remove();
            $('.dialog-box').remove();
            return false;
        });
        $('#cancel').click(closeDialog);
        $('.close-dialog').click(closeDialog);
        function closeDialog() {
            $('#mask').remove();
            $('.dialog-box').remove();
            return false;
        }
    };

    /*
     * 添加app
     * */
    var addAppDialog = function addAppDialog(data, callBack) {
        var dataObj = {
            appId: [],
            output: false
        };
        var apps = '';
        var style = '';
        data = data.data;
        for (var i = 0; i < data.length; i++) {

            if (data[i].isShow) continue;
            apps += '<li class="app-li" key="1" appid="' + data[i].id + '">' + '<span class="checkbox"></span>' + '<img class="app-pic" src="' + getPicPath(data[i].logo) + '">' + '<div class="app-msg">' + '<p><a class="app-name" href="javascript:;">' + data[i].name + '</a></p>' + '</div>' + '</li>';
        }
        var chooseAll = '';
        if (apps !== '') {
            chooseAll = '<p class="clearFix"><span id="choose-all" key="1"><span class="checkbox"></span>全选</span></p>';
        }
        if (apps == '') {
            style = 'style="overflow: hidden;"';
            apps = noContent('暂无可添加应用');
            dataObj.output = true;
        }
        $('body').append('<div id="mask"></div>');
        $('body').append('<div id="addAppDialog" class="dialog-box">' + '<h2 class="box-header">添加应用</h2>' + chooseAll + '<ul class="app-boxs clearFix" ' + style + '>' + apps + '</ul>' + '<p class="clearFix btns">' + '<a id="confirm" href="javascript:;">确定</a>' + '<a id="cancel" href="javascript:;">取消</a>' + '</p>' + '<span class="close-dialog icon-close-small"></span>' + '</div>');
        if (data.length > 6) {
            $('#addAppDialog .app-boxs').css({
                'width': '666px',
                'left': '-7px'
            });
        }
        $('#choose-all').on('click', function () {
            if ($(this).attr('key') == 1) {
                $(this).attr('key', 2);
                $(this).addClass('choose-active');
                $('#addAppDialog li').each(function () {
                    $(this).attr('key', 2);
                    $(this).addClass('active');
                    dataObj.appId.push($(this).attr('appid'));
                });
                dataObj.output = true;
            } else {
                $(this).attr('key', 1);
                $(this).removeClass('choose-active');
                $('#addAppDialog li').each(function () {
                    $(this).attr('key', 1);
                    $(this).removeClass('active');
                });
                dataObj.appId.length = 0;
                dataObj.output = false;
            }
        });
        $('#addAppDialog').on('click', 'li', function () {
            if ($(this).attr('key') == 1) {
                $(this).attr('key', 2);
                $(this).addClass('active');
                dataObj.appId.push($(this).attr('appid'));
            } else {
                $(this).attr('key', 1);
                for (var i = 0; i < dataObj.appId.length; i++) {
                    if (dataObj.appId[i] == $(this).attr('appid')) {
                        dataObj.appId.splice(i, 1);
                        break;
                    }
                }
                $('#choose-all').removeClass('choose-active');
                $(this).removeClass('active');
            }
            if (dataObj.appId.length) {
                dataObj.output = true;
            } else {
                dataObj.output = false;
                $('#choose-all').removeClass('choose-active');
            }
        });
        dialogClick(callBack, dataObj);
    };
    var noContent = function noContent(text) {
        return '<div id="hint-content" class="no-content">' + text + '</div>';
    };

    var getPicPath = function getPicPath(id) {
        return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    };
    return {
        "addAppDialog": addAppDialog,
        "noContent": noContent
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlcnNDZW50ZXIvanMvYXBwRGlhbG9nLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsIiQiLCJ0b29scyIsInNlcnZpY2UiLCJkaWFsb2dDbGljayIsImNhbGxCYWNrIiwib2JqIiwib24iLCJjbGljayIsIm91dHB1dCIsImFwcElkIiwidGV4dFRpcCIsImhpbnRUZXh0IiwicmVtb3ZlIiwiY2xvc2VEaWFsb2ciLCJhZGRBcHBEaWFsb2ciLCJkYXRhIiwiZGF0YU9iaiIsImFwcHMiLCJzdHlsZSIsImkiLCJsZW5ndGgiLCJpc1Nob3ciLCJpZCIsImdldFBpY1BhdGgiLCJsb2dvIiwibmFtZSIsImNob29zZUFsbCIsIm5vQ29udGVudCIsImFwcGVuZCIsImNzcyIsImF0dHIiLCJhZGRDbGFzcyIsImVhY2giLCJwdXNoIiwicmVtb3ZlQ2xhc3MiLCJzcGxpY2UiLCJ0ZXh0IiwicGF0aF91cmwiLCJzdWJzdHJpbmciLCJyZXBsYWNlIiwicHJlZml4Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7OztBQUdBQSxPQUFPLFFBQVAsRUFBZ0IsQ0FBQyxRQUFELEVBQVUsT0FBVixFQUFrQixTQUFsQixDQUFoQixFQUE2QyxVQUFVQyxDQUFWLEVBQVlDLEtBQVosRUFBa0JDLE9BQWxCLEVBQTJCO0FBQ3BFLFFBQUlDLGNBQWMsU0FBZEEsV0FBYyxDQUFTQyxRQUFULEVBQWtCQyxHQUFsQixFQUFzQjtBQUNwQyxZQUFJLENBQUNELFFBQUQsSUFBYSxDQUFDQyxHQUFsQixFQUF1QjtBQUNuQkQsdUJBQVcsb0JBQVUsQ0FBRSxDQUF2QjtBQUNBQyxrQkFBTSxFQUFOO0FBQ0g7QUFDREwsVUFBRSxPQUFGLEVBQVdNLEVBQVgsQ0FBYztBQUNWLDBCQUFhLHNCQUFZO0FBQUUsdUJBQU8sS0FBUDtBQUFlLGFBRGhDO0FBRVYscUJBQVEsaUJBQVk7QUFBRSx1QkFBTyxLQUFQO0FBQWU7QUFGM0IsU0FBZDtBQUlBO0FBQ0FOLFVBQUUsVUFBRixFQUFjTyxLQUFkLENBQW9CLFlBQVk7QUFD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QUFSLENBQWlCLGNBQWpCLEVBQWlDQyxTQUFqQyxDQUEyQyxDQUEzQyxFQUE2QyxDQUE3QyxNQUFvRCxNQUFwRCxHQUE2RHBDLFFBQVFtQyxRQUFSLENBQWlCLGNBQWpCLEVBQWlDRSxPQUFqQyxDQUF5QyxTQUF6QyxFQUFtRGpCLEVBQW5ELENBQTdELEdBQXVIcEIsUUFBUXNDLE1BQVIsR0FBaUJ0QyxRQUFRbUMsUUFBUixDQUFpQixjQUFqQixFQUFpQ0UsT0FBakMsQ0FBeUMsU0FBekMsRUFBbURqQixFQUFuRCxDQUEvSTtBQUNELEtBRkQ7QUFHQSxXQUFPO0FBQ0gsd0JBQWVSLFlBRFo7QUFFSCxxQkFBWWE7QUFGVCxLQUFQO0FBSUgsQ0FwSkQiLCJmaWxlIjoicGVyc0NlbnRlci9qcy9hcHBEaWFsb2ctODk2ZGMxMzNkYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGxzbXR0eSBvbiAyMDE3LzQvMTkuXHJcbiAqL1xyXG5kZWZpbmUoXCJkaWFsb2dcIixbJ2pxdWVyeScsJ3Rvb2xzJywnc2VydmljZSddLGZ1bmN0aW9uICgkLHRvb2xzLHNlcnZpY2UpIHtcclxuICAgIHZhciBkaWFsb2dDbGljayA9IGZ1bmN0aW9uKGNhbGxCYWNrLG9iail7XHJcbiAgICAgICAgaWYoICFjYWxsQmFjayAmJiAhb2JqICl7XHJcbiAgICAgICAgICAgIGNhbGxCYWNrID0gZnVuY3Rpb24oKXt9O1xyXG4gICAgICAgICAgICBvYmogPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnI21hc2snKS5vbih7XHJcbiAgICAgICAgICAgICdtb3VzZXdoZWVsJzpmdW5jdGlvbiAoKSB7IHJldHVybiBmYWxzZTsgfSxcclxuICAgICAgICAgICAgJ2NsaWNrJzpmdW5jdGlvbiAoKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8v5Yig6Zmk56Gu5a6a5oyJ6ZKuXHJcbiAgICAgICAgJCgnI2NvbmZpcm0nKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmKCAhb2JqLm91dHB1dCApe1xyXG4gICAgICAgICAgICAgICAgaWYoIG9iai5hcHBJZCApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRvb2xzLnRleHRUaXAoJ+aCqOi/mOacqumAieaLqeW6lOeUqCcpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9iai5oaW50VGV4dCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29scy50ZXh0VGlwKG9iai5oaW50VGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xzLnRleHRUaXAoJ+ivt+i+k+WFpeWujOaVtOWGheWuuScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxCYWNrID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGlmKCB0eXBlb2Ygb2JqID09ICdvYmplY3QnICl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbEJhY2sob2JqKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxCYWNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJCgnI21hc2snKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgJCgnLmRpYWxvZy1ib3gnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJyNjYW5jZWwnKS5jbGljayhjbG9zZURpYWxvZyk7XHJcbiAgICAgICAgJCgnLmNsb3NlLWRpYWxvZycpLmNsaWNrKGNsb3NlRGlhbG9nKTtcclxuICAgICAgICBmdW5jdGlvbiBjbG9zZURpYWxvZygpIHtcclxuICAgICAgICAgICAgJCgnI21hc2snKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgJCgnLmRpYWxvZy1ib3gnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICog5re75YqgYXBwXHJcbiAgICAgKiAqL1xyXG4gICAgdmFyIGFkZEFwcERpYWxvZyA9IGZ1bmN0aW9uKGRhdGEsY2FsbEJhY2spe1xyXG4gICAgICAgIHZhciBkYXRhT2JqID0ge1xyXG4gICAgICAgICAgICBhcHBJZDpbXSxcclxuICAgICAgICAgICAgb3V0cHV0OmZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhcHBzID0gJyc7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gJyc7XHJcbiAgICAgICAgZGF0YSA9IGRhdGEuZGF0YTtcclxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8IGRhdGEubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgaWYoIGRhdGFbaV0uaXNTaG93KSBjb250aW51ZTtcclxuICAgICAgICAgICAgYXBwcyArPSAnPGxpIGNsYXNzPVwiYXBwLWxpXCIga2V5PVwiMVwiIGFwcGlkPVwiJysgZGF0YVtpXS5pZCArICdcIj4nICtcclxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNoZWNrYm94XCI+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgJzxpbWcgY2xhc3M9XCJhcHAtcGljXCIgc3JjPVwiJyArIGdldFBpY1BhdGgoZGF0YVtpXS5sb2dvKSAgKyAnXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImFwcC1tc2dcIj4nICtcclxuICAgICAgICAgICAgICAgICc8cD48YSBjbGFzcz1cImFwcC1uYW1lXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPicgKyBkYXRhW2ldLm5hbWUgKyAnPC9hPjwvcD4nICtcclxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICc8L2xpPic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjaG9vc2VBbGwgPSAnJztcclxuICAgICAgICBpZiggYXBwcyAhPT0gJycpe1xyXG4gICAgICAgICAgICBjaG9vc2VBbGwgPSAnPHAgY2xhc3M9XCJjbGVhckZpeFwiPjxzcGFuIGlkPVwiY2hvb3NlLWFsbFwiIGtleT1cIjFcIj48c3BhbiBjbGFzcz1cImNoZWNrYm94XCI+PC9zcGFuPuWFqOmAiTwvc3Bhbj48L3A+JztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIGFwcHMgPT0gJycgKXtcclxuICAgICAgICAgICAgc3R5bGUgPSAnc3R5bGU9XCJvdmVyZmxvdzogaGlkZGVuO1wiJztcclxuICAgICAgICAgICAgYXBwcyA9IG5vQ29udGVudCgn5pqC5peg5Y+v5re75Yqg5bqU55SoJyk7XHJcbiAgICAgICAgICAgIGRhdGFPYmoub3V0cHV0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZCgnPGRpdiBpZD1cIm1hc2tcIj48L2Rpdj4nKTtcclxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKCc8ZGl2IGlkPVwiYWRkQXBwRGlhbG9nXCIgY2xhc3M9XCJkaWFsb2ctYm94XCI+JyArXHJcbiAgICAgICAgICAgICc8aDIgY2xhc3M9XCJib3gtaGVhZGVyXCI+5re75Yqg5bqU55SoPC9oMj4nICsgY2hvb3NlQWxsICtcclxuICAgICAgICAgICAgJzx1bCBjbGFzcz1cImFwcC1ib3hzIGNsZWFyRml4XCIgJyArIHN0eWxlICsgJz4nICsgYXBwcyArJzwvdWw+JyArXHJcbiAgICAgICAgICAgICc8cCBjbGFzcz1cImNsZWFyRml4IGJ0bnNcIj4nICtcclxuICAgICAgICAgICAgJzxhIGlkPVwiY29uZmlybVwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj7noa7lrpo8L2E+JyArXHJcbiAgICAgICAgICAgICc8YSBpZD1cImNhbmNlbFwiIGhyZWY9XCJqYXZhc2NyaXB0OjtcIj7lj5bmtog8L2E+JyArXHJcbiAgICAgICAgICAgICc8L3A+JyArXHJcbiAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNsb3NlLWRpYWxvZyBpY29uLWNsb3NlLXNtYWxsXCI+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAnPC9kaXY+Jyk7XHJcbiAgICAgICAgaWYoIGRhdGEubGVuZ3RoID4gNiApe1xyXG4gICAgICAgICAgICAkKCcjYWRkQXBwRGlhbG9nIC5hcHAtYm94cycpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAnd2lkdGgnOic2NjZweCcsXHJcbiAgICAgICAgICAgICAgICAnbGVmdCc6Jy03cHgnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKCcjY2hvb3NlLWFsbCcpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoJCh0aGlzKS5hdHRyKCdrZXknKSA9PSAxKXtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cigna2V5JywyKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2Nob29zZS1hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQoJyNhZGRBcHBEaWFsb2cgbGknKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdrZXknLDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFPYmouYXBwSWQucHVzaCgkKHRoaXMpLmF0dHIoJ2FwcGlkJykpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqLm91dHB1dCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdrZXknLDEpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2hvb3NlLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnI2FkZEFwcERpYWxvZyBsaScpLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2tleScsMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmouYXBwSWQubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmoub3V0cHV0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcjYWRkQXBwRGlhbG9nJykub24oJ2NsaWNrJywnbGknLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCAkKHRoaXMpLmF0dHIoJ2tleScpID09IDEgKXtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cigna2V5JywyKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgZGF0YU9iai5hcHBJZC5wdXNoKCQodGhpcykuYXR0cignYXBwaWQnKSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdrZXknLDEpO1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxkYXRhT2JqLmFwcElkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCBkYXRhT2JqLmFwcElkW2ldID09ICQodGhpcykuYXR0cignYXBwaWQnKSApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhT2JqLmFwcElkLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkKCcjY2hvb3NlLWFsbCcpLnJlbW92ZUNsYXNzKCdjaG9vc2UtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiggZGF0YU9iai5hcHBJZC5sZW5ndGggKXtcclxuICAgICAgICAgICAgICAgIGRhdGFPYmoub3V0cHV0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqLm91dHB1dCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJCgnI2Nob29zZS1hbGwnKS5yZW1vdmVDbGFzcygnY2hvb3NlLWFjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGlhbG9nQ2xpY2soY2FsbEJhY2ssZGF0YU9iaik7XHJcbiAgICB9XHJcbiAgICB2YXIgbm9Db250ZW50ICA9IGZ1bmN0aW9uICh0ZXh0KXtcclxuICAgICAgICByZXR1cm4gJzxkaXYgaWQ9XCJoaW50LWNvbnRlbnRcIiBjbGFzcz1cIm5vLWNvbnRlbnRcIj4nICsgdGV4dCArICc8L2Rpdj4nO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBnZXRQaWNQYXRoID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICByZXR1cm4gc2VydmljZS5wYXRoX3VybFsnZG93bmxvYWRfdXJsJ10uc3Vic3RyaW5nKDAsNCkgPT09ICdodHRwJyA/IHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLGlkKSA6IChzZXJ2aWNlLnByZWZpeCArIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLGlkKSkgO1xyXG4gICAgfTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgXCJhZGRBcHBEaWFsb2dcIjphZGRBcHBEaWFsb2csXHJcbiAgICAgICAgXCJub0NvbnRlbnRcIjpub0NvbnRlbnRcclxuICAgIH1cclxufSk7Il19
