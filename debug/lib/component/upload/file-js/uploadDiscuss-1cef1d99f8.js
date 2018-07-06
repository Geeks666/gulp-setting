// 文件上传
define('upload', ['jquery', 'webuploader', 'JCenterHelper', 'rrtconfig', 'tools'],
  function ($, WebUploader, JCenterHelper, rrtconfig, tools) {
    $(function () {
      var $ = jQuery,
        $list = $('#thelist'),
        $btn = $('#ctlBtn');

      var state = 'pending', uploader;
      //当前没有文件隐藏开始及清空按钮
      $btn.hide();
      uploader = WebUploader.create({

        // 不压缩image
        resize: false,
        compress: false,

        // swf文件路径
        swf: '../../../lib/component/upload/file-js/Uploader.swf',

        // 文件接收服务端。
        server: uploadServer,
        formData: {},
        //文件数量
        fileNumLimit: 50,

        chunked: true,
        // chunkSize: 1024,

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
          id: '#picker',
          multiple: false
        },
        accept: {
          title: '所有文件',
          extensions: '*'
        },
        fileSizeLimit: 20 * 1024 * 1024 * 1024,    // 20G
        fileSingleSizeLimit: 5 * 1024 * 1024 * 1024    // 5G
      });

      // 当有文件添加进来的时候
      uploader.on('fileQueued', function (file) {
        console.log(uploader.getFiles().length);
        var iconClass = JCenterHelper.getFileTypeIconSmall(file.ext);
        $list.append('<div id="' + file.id + '" class="item">' +
          '<span class="icon ' + iconClass + '"></span>' +
          '<p class="info" title="' + file.name + '">' + file.name + '</p>' +
          '<p class="state">等待上传...</p>' +
          '<span class="remove">X</span>' +
          '</div>');
        //加载文件后显示按钮
        $btn.show();
        $('#' + file.id).find('.remove').on('click', function () {
          var key = $('#' + file.id).attr('data-resourceid');
          if (key) {
            var params = '?appKey=' + options.appKey + '&expires=' + options.expires +
              '&signature=' + options.signature + '&key=' + key;
            $.ajax({
              type: 'delete',
              url: deleteServer + key + params
            }).done(function (res) {
              uploader.removeFile(file);
              $('#' + file.id).remove();
            });
          } else {
            uploader.removeFile(file);
            $('#' + file.id).remove();
          }
          //如果当前没有文件则隐藏上传和清空按钮
          /*if ($('.remove').length == 0) {
           $btn.hide();
           }*/
        });
        uploader.md5File(file)
          .then(function (val) {
            var params = $.extend({}, options);
            params.dataLength = file.size;
            params.md5Digest = val;
            params.fileName = file.name;
            $.support.cors = true;
            $.ajax({
              type: 'GET',
              url: uploadServer,
              data: params,
              dataType: "jsonp",
              jsonp: "callback"
            }).done(function (res) {
              if (res['key']) {
                setComplete(file, res['key']);
              } else {
                $('#' + file.id).data('uploadId', res['uploadId']);
                uploader.options.formData = params;
                uploader.options.formData.uploadId = res['uploadId'];
                uploader.options.formData.partSeq = 0;
                uploader.upload();
              }
            }).fail(function (err) {
              setError(file);
            });
          });
      });

      // 文件上传过程中创建进度条实时显示。
      uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
          $percent = $li.find('.progress .progress-bar');
        // 避免重复创建
        if (!$percent.length) {
          $percent = $('<div class="progress progress-striped active">' +
            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
            '</div>' +
            '</div>').appendTo($li).find('.progress-bar');
        }
        $li.find('p.state').text('上传中');
        // $li.find('.remove').hide();
        $percent.css('width', percentage * 100 + '%');
      });
      uploader.on('uploadSuccess', function (file, res) {
        var params = $.extend({}, options);
        params.uploadId = $('#' + file.id).data('uploadId');
        params.partNum = Math.ceil(file.size / uploader.options.chunkSize);
        $.support.cors = true;
        $.ajax({
          type: 'GET',
          url: completeServer,
          data: params,
          dataType: "jsonp",
          jsonp: "callback"
        }).done(function (res) {
          setComplete(file, res['key'])
        }).fail(function (err) {
          setError(file);
        });
      });

      uploader.on('uploadError', function (file) {
        //上传出错后显示清除按钮
        $('#' + file.id).find('.remove').show();
        // $clear.show();
        $('#' + file.id).find('p.state').text('上传出错，请重新上传');
      });

      uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();
      });

      uploader.on('uploadBeforeSend', function (object, data) {
        data.partSeq = object.chunk;
      });

      uploader.on('all', function (type) {
        if (type === 'startUpload') {
          state = 'uploading';
        } else if (type === 'stopUpload') {
          state = 'paused';
        } else if (type === 'uploadFinished') {
          state = 'done';
        }

        if (state === 'uploading') {
          $btn.text('暂停上传');
        } else {
          $btn.text('开始上传');
        }
      });

      function setComplete(file, key) {
        var params = {
          space_id: tools.getQueryObj().spaceId,
          space_type: tools.getQueryObj().spaceType,
          resource_id: key,
          file_name: file.name,
          file_size: file.size
        };
        $.ajax({
          type: 'post',
          url: JCenterHomeHost + 'resourceManager/upload/0',
          data: params,
          dataType: 'json'
        }).done(function (res) {
          uploader.removeFile(file);
          $('#' + file.id).attr('data-resourceid', key);
          //上传完成后显示清除按钮
          $('#' + file.id).find('.remove').show();
          $('#' + file.id).find('p.state').text('已上传');
        }).fail(function (err) {
          setError(file);
        });
      }

      function setError(file) {
        uploader.removeFile(file);
        $('#' + file.id).find('.remove').show();
        $('#' + file.id).find('p.state').text('上传出错，请重新上传');
      }

      var spaceId = $("#spaceId").val();
      $btn.on('click', function () {
        uploader.options.server = '';
        if (state === 'uploading') {
          uploader.stop(true);
        } else {
          uploader.upload();
        }
      });
    })
  });