// 只支持单个文件的上传
define('upload', ['jquery', 'webuploader', 'ajax', 'JCenterHelper', 'rrtconfig', 'tools'], function ($, WebUploader, ajax, JCenterHelper, rrtconfig, tools) {
  window.uploadFileBtn = '#uploadFileBtn';
  $(function () {
    var $ = jQuery,
      $list = $('#thelist'),
      $btn = $('#ctlBtn');

    var state = 'pending',
      uploader;
    //当前没有文件隐藏开始及清空按钮
    $btn.hide();
    uploader = WebUploader.create({

      // 不压缩image
      resize: false,
      compress: false,

      // swf文件路径
      swf: '../../../lib/component/upload/file-js/Uploader.swf',

      setbutton: 'uploadFileBtn',
      //文件数量
      fileNumLimit: 50,

      // 开启切片上传
      chunked: true,
      // chunkSize: 1024,

      // 文件接收服务端。
      server: uploadServer,

      // 选择文件的按钮。可选。
      // 内部根据当前运行是创建，可能是input元素，也可能是flash.
      pick: {
        id: '#picker',
      },
      fileSizeLimit: 20 * 1024 * 1024 * 1024,    // 20G
      fileSingleSizeLimit: 5 * 1024 * 1024 * 1024    // 5G
    });

    //判断文件大小
    function setSize(number) {
      var fileSize;
      if (number > 1024 * 1024 * 1024) {
        fileSize = (number / 1024 / 1024 / 1024).toFixed(2) + 'G';
      } else if (number > 1024 * 1024 && 1024 * 1024 * 1024 > number) {
        fileSize = (number / 1024 / 1024).toFixed(2) + 'M';
      } else {
        fileSize = (number / 1024).toFixed(2) + 'KB';
      }
      return fileSize;
    }

    // 当有文件添加进来的时候
    var fileData = [];
    var successFileData = [];
    uploader.on('fileQueued', function (file) {
      fileData.push(file);
      $('#uploader').removeClass('min-uploader-box');
      $('#uploader').removeClass('hide-uploader-box');
      $('#uploader .min').html('-');
      var iconClass = JCenterHelper.getFileTypeIconSmall(file.ext);
      $list.append('<div id="' + file.id + '" class="item clearFix">' +
        '<span class="icon ' + iconClass + '"></span>' +
        '<p class="info" title="' + file.name + '">' + file.name + '</p>' +
        '<p class="size">' + setSize(file.size) + '</p>' +
        '<p class="state">等待上传...</p>' +
        '<span class="remove">X</span>' +
        '<div class="progress progress-striped active">' +
        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
        '</div>' +
        '</div>' +
        '</div>');
      //加载文件后显示按钮
      $btn.show();
      $('#' + file.id).find('.remove').on('click', function () {
        uploader.removeFile(file);
        $('#' + file.id).remove();

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
              uploader.removeFile(file);
            } else {
              $('#' + file.id).data("uploadId", res['uploadId']);
              uploader.options.formData.uploadId = res['uploadId'];
              uploader.upload(file);
            }
          });
        });
    });


    $('#uploader .min').click(function () {
      if ($('#uploader').hasClass('min-uploader-box')) {
        $('#uploader').removeClass('min-uploader-box');
        $(this).html('-');
      } else {
        $('#uploader').addClass('min-uploader-box');
        $(this).html('<span class="max-box"></span><span class="max-box1"></span>');
      }
    });
    $('#uploader .delete').click(function () {
      var onOff = true;
      $('#thelist .state').each(function () {
        if (!$(this).attr('isupload')) {
          onOff = false;
          return false;
        }
      });
      if (!onOff) {
        JCenterHelper.unUploadDialog(function () {
          deleteFile();
        });
        return;
      } else {
        deleteFile();
      }

    });

    function deleteFile() {
      $('#uploader').addClass('hide-uploader-box');
      $('#thelist .item').remove();
      for (var i = 0; i < fileData.length; i++) {
        uploader.removeFile(fileData[i]);
      }
    }

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
        url: JCenterHomeHost + 'resourceManager/upload/1',
        data: params,
        dataType: 'json'
      })
        .done(function (res) {
          if (res['success']) {
            successFileData.push(file);
            $('#' + file.id).find('.remove').show();
            $('#' + file.id).find('p.state').text('已上传');
            $('#' + file.id).find('p.state').attr('isUpload', '1');
            var $li = $('#' + file.id),
              $percent = $li.find('.progress .progress-bar');
            $percent.css('width', '100%');
            $('#' + file.id).data("resourceId", key);
            if (successFileData.length === fileData.length) {
              setTimeout(function () {
                deleteFile();
                getFileList();
              }, 1500);
            }
          } else $('#' + file.id).find('p.state').text('服务器出错，请稍后重试');
        })
        .fail(function () {
          $('#' + file.id).find('p.state').text('服务器出错，请稍后重试');
        });
    }

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
    uploader.on('uploadSuccess', function (file) {
      var params = $.extend({}, options);
      params.uploadId = $('#' + file.id).data('uploadId');
      params.partNum = Math.ceil(file.size / uploader.options.chunkSize);
      $.support.cors = true;
      $.ajax({
        type: 'post',
        url: completeServer,
        data: params,
        dataType: "jsonp",
        jsonp: "callback"
      }).done(function (res) {
        if (res['key']) {
          setComplete(file, res['key']);
        } else {
          $('#' + file.id).find('p.state').text('服务器出错，请稍后重试');
        }
      }).fail(function () {
        $('#' + file.id).find('p.state').text('服务器出错，请稍后重试');
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
      data.appKey = options.appKey;
      data.expires = options.expires;
      data.signature = options.signature;
      data.uploadId = $('#' + object.file.id).data('uploadId');
      data.partSeq = object.chunk;
    });

    uploader.on('uploadFinished', function () {
      setTimeout(function () {
        deleteFile();
        getFileList();
      }, 1500);
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
    var spaceId = $("#spaceId").val();
    $btn.on('click', function () {
      // uploader.options.server = '';
      if (state === 'uploading') {
        uploader.stop(true);
      } else {
        uploader.upload();
      }
    });
  })
})