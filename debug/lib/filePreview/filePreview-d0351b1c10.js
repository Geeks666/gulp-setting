
    var filePreview = {};
    filePreview.videoStr = function () {
        return '<div id="jp_container_1" class="jp-video jp-video-360p" role="application" aria-label="media player">' +
            '<div class="jp-type-single">' +
            '<div id="jquery_jplayer_1" class="jp-jplayer"></div>' +
            '<div class="jp-gui">' +
            '<div class="jp-video-play">' +
            '<button class="jp-video-play-icon" role="button" tabindex="0">play</button>' +
            '</div>' +
            '<div class="jp-interface">' +
            '<div class="jp-progress">' +
            '<div class="jp-seek-bar">' +
            '<div class="jp-play-bar"></div>' +
            '</div>' +
            '</div>' +
            '<div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>' +
            '<div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>' +
            '<div class="jp-controls-holder">' +
            '<div class="jp-controls">' +
            '<button class="jp-play" role="button" tabindex="0">play</button>' +
            '<button class="jp-stop" role="button" tabindex="0">stop</button>' +
            '</div>' +
            '<div class="jp-volume-controls">' +
            '<button class="jp-mute" role="button" tabindex="0">mute</button>' +
            '<button class="jp-volume-max" role="button" tabindex="0">max volume</button>' +
            '<div class="jp-volume-bar">' +
            '<div class="jp-volume-bar-value"></div>' +
            '</div>' +
            '</div>' +
            '<div class="jp-toggles">' +
            '<button class="jp-repeat" role="button" tabindex="0">repeat</button>' +
            '<button class="jp-full-screen" role="button" tabindex="0">full screen</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div></div>';
    };
    filePreview.audioStr = function () {
        return '<div class="jquery-audio-Bg"></div>' +
            '<div id="jquery_jplayer_2" class="jp-jplayer"></div>' +
            '<div id="jp_container_2" class="jp-audio" role="application" aria-label="media player">' +
            '<div class="jp-type-single">' +
            '<div class="jp-gui jp-interface">' +
            '<div class="jp-controls">' +
            '<button class="jp-play" role="button" tabindex="0">play</button>' +
            '<button class="jp-stop" role="button" tabindex="0">stop</button>' +
            '</div>' +
            '<div class="jp-progress">' +
            '<div class="jp-seek-bar">' +
            '<div class="jp-play-bar"></div>' +
            '</div>' +
            '</div>' +
            '<div class="jp-volume-controls">' +
            '<button class="jp-mute" role="button" tabindex="0">mute</button>' +
            '<button class="jp-volume-max" role="button" tabindex="0">max volume</button>' +
            '<div class="jp-volume-bar">' +
            '<div class="jp-volume-bar-value"></div>' +
            '</div>' +
            '</div>' +
            '<div class="jp-time-holder">' +
            '<div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>' +
            '<div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>' +
            '<div class="jp-toggles">' +
            '<button class="jp-repeat" role="button" tabindex="0">repeat</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    };
    filePreview.docStr = function () {
        return "<iframe id='myDoc' frameborder='0' style='width:100%;height: 100%' src=''></iframe>";
    };
    filePreview.FINSStr = function () {
        return '<div class="noSupport" style="height: 100%;text-align: center;padding-top: 50px;"> <img src="../static/images/nosupport.png"><p style="font-size: 16px;color: #383838;">抱歉，该格式不支持预览！</p> </div>'
    };
    /**
     * filePreview初始化
     * @param ele jquery元素
     * @param url 预览地址
     * @param type 文件类型
     * @param callback 回调函数
     */
    filePreview.init = function (ele, url, type, callback) {
        if (type == 'doc') {
            $(ele).css("height", "750px");
            $(ele).html(filePreview.docStr());
            $('#myDoc').attr('src', 'http://idocv.myuclass.com/view/url?url=' + url);
        } else if (type == 'video') {
            $(ele).css("height", "632px");
            $("#jquery_jplayer_2").jPlayer("clearMedia");
            $(ele).html(filePreview.videoStr());
            $("#jquery_jplayer_1").jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        m4v: url,
                        // poster: "http://www.jplayer.org/video/poster/Big_Buck_Bunny_Trailer_480x270.png"
                    });
                },
                swfPath: "../../base/component/jPlayer/js",
                supplied: "m4v",
                size: {
                    width: "853px",
                    height: "563px",
                    cssClass: "jp-video-360p"
                },
                autohide: {
                    // restored:true
                },
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                keyEnabled: true,
                remainingDuration: true,
                toggleDuration: true
            });
        } else if (type == 'audio') {
            $(ele).css("height", "632px");
            $("#jquery_jplayer_1").jPlayer("clearMedia");
            $(ele).html(filePreview.audioStr());
            $("#jquery_jplayer_2").jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        mp3: url
                    });
                },
                swfPath: "../../base/component/jPlayer/js",
                supplied: "mp3",
                cssSelectorAncestor: "#jp_container_2",
                wmode: "window",
                globalVolume: true,
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                keyEnabled: true
            });
        } else if (type == 'images') {
            $(ele).css("height", "563px");
            $(ele).html(filePreview.docStr());
            if(url.indexOf("?") != -1){
                url = url.substring(0, url.indexOf("?"));
            }
            $('#myDoc').attr('src', 'http://idocv.myuclass.com/view/url?url=' + url);
        } else {
            $(ele).css("height", "563px");
            $(ele).html(filePreview.FINSStr());
        }
        if (typeof callback == 'function') {
            callback()
        }
    };
