// 只支持单个文件的上传
define('upload', ['jquery', 'webuploader', 'JCenterHelper', 'rrtconfig'], function ($, WebUploader, JCenterHelper) {
  $(function () {
    var $ = jQuery, $list = $('#thelist'), $btn = $('#ctlBtn');
    var state = 'pending', uploader;
    //当前没有文件隐藏开始及清空按钮
    $btn.hide();
    //uploader = new WebUploader();
    uploader = WebUploader.create({

      // 不压缩image
      compress: false,

      // swf文件路径
      swf: '../../../lib/component/upload/file-js/Uploader.swf',

      // 文件接收服务端。
      server: uploadServer,
      method: 'post',
      // 选择文件的按钮。可选。
      // 内部根据当前运行是创建，可能是input元素，也可能是flash.
      pick: {
        id: '#picker',
        multiple: false,
        label: '点击上传文件'
      },
      // 分块上传设置
      chunked: true,
      // 在上传当前文件时，准备好下一个文件
      prepareNextFile: true
    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
      var iconClass = JCenterHelper.getFileTypeIconSmall(file.ext);
      $list.empty().append('<div id="' + file.id + '" class="item">' +
        '<span class="icon ' + iconClass + '"></span>' +
        '<p class="info" title="' + file.name + '">' + file.name + '</p>' +
        '<p class="state">等待上传...</p>' +
        '<span class="remove">X</span>' +
        '</div>');
      //加载文件后显示按钮
      //			$btn.show();
      // 添加“添加文件”的按钮，
      uploader.addButton({
        id: '#filePicker',
        label: '继续添加'
      });

      $('#' + file.id).find('.remove').on('click', function () {
        uploader.removeFile(file);
        $('#' + file.id).remove();

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
          }).done(function (data) {
            if (data.uploadId) {
              $('#' + file.id).data("uploadId", data.uploadId);
              uploader.options.formData = params;
              uploader.options.formData.uploadId = data['uploadId'];
              uploader.options.formData.partSeq = 0;
              uploader.upload();
            } else {
              setComplete(file, data.key);
            }
          });
        });
    });

    uploader.on('uploadBeforeSend', function (object, data) {
      data.partSeq = object.chunk;
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
    uploader.on('uploadSuccess', function (file, response) {
      $(".wu-example")[0].style.visibility = "visible";
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
        $('#' + file.id).find('.remove').show();
        $('#' + file.id).find('p.state').text('上传出错，请重新上传');
      });
    });

    uploader.on('uploadError', function (file) {
      //上传出错后显示清除按钮
      $('#' + file.id).find('.remove').show();
      $('#' + file.id).find('p.state').text('上传出错，请重新上传');
    });
    //  console.log($("#thelist .item").data("resourceId"))
    uploader.on('uploadComplete', function (file, ret) {
      $('#' + file.id).find('.progress').fadeOut();
    });

    function setComplete(file, key) {
      $.post(JCenterHomeHost + '/resourceManager/upload/0', {
          'resource_id': key,
          'file_name': file.name,
          'file_size': file.size
        },
        function (data) {
          $('#' + file.id).find('p.state').text('已上传');
          $('#' + file.id).data("resourceId", key);
        }, 'json')
    }

    //		uploader.on('all', function(type) {
    //			if(type === 'startUpload') {
    //				state = 'uploading';
    //			} else if(type === 'stopUpload') {
    //				state = 'paused';
    //			} else if(type === 'uploadFinished') {
    //				state = 'done';
    //			}
    //			if(state === 'uploading') {
    //				$btn.text('暂停上传');
    //			} else {
    //				$btn.text('开始上传');
    //			}
    //		});
    var spaceId = $("#spaceId").val();
    $btn.on('click', function () {
      uploader.options.server = '';
      if (state === 'uploading') {
        uploader.stop(true);
      } else {
        //      console.log("begin upload");
        uploader.upload();
        //      console.log("end upload");
      }
    });
  })
})