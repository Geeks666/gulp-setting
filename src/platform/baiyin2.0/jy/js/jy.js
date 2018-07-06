require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);
  define('', ['jquery', 'template', 'echarts', 'service', 'footer', 'header', 'tool'],
    function ($, template, echarts, service, footer, header, tools) {
      /* 加载教研成果 */
      loadDynamic(0);
      /* 加载教研动态 */
      loadResults();
      /* 加载教研成果 */
      loadDynamiCount()
      //教研成果
      teachingLW();

      function teachingLW() {
        var ulli = $('.teachingLeft ul li');
        var ulWidth = $('.teachingLeft').width() / ulli.length;
        ulli.width(ulWidth - 1);
        ulli.last().css("border-right", 'none');
        ulli.find('a').click(function () {
          $(this).addClass('liact').parent().siblings().children().removeClass('liact');
          loadDynamic($(this).attr('data-type'))
        })
      }

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

      function initteaAchSta(data, id) {
        var teachingA = echarts.init(document.getElementById('teaAchSta'));
        var teaching_personal = {
          color: ["#56b1f0", "#ff666e"],
          textStyle: {
            color: '#2f2f2f',
            fontSize: 12
          },
          grid: {
            top: '15%',
            left: '1%',
            right: '1%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            cneter: 10,
            width: 400,
            itemWidth: 30,
            itemHeight: 20,
            textStyle: {
              color: "#2f2f2f"
            },
            data: ["备课资源", "专业成长"]
          },
          xAxis: [{
            type: 'category',
            axisLabel: {
              textStyle: {
                fontSize: 14
              },
              formatter: function (name) {
                return tools.hideTextByLen(name, 12);
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c9c9c9'
              }
            },
            axisTick: {
              show: false
            },
            data: (function () {
              var newstr = [];
              for (var i = 0; i < data.length; i++) {
                newstr.push(data[i].orgName)
              }
              return newstr;
            })()
          }],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                lineStyle: {
                  color: '#c9c9c9',
                  fontSize: 14
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#c9c9c9'
                }
              }
            }
          ],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          series: [{
            name: '备课资源',
            type: 'bar',
            barWidth: 24,
            data: (function(){
              var newdatas = [];
              for (var i = 0; i < data.length; i++) {
                newdatas.push(data[i].bkzy)
              }
              return newdatas
            })()
          }, {
            name: '专业成长',
            type: 'bar',
            barWidth: 24,
            data: (function(){
              var newdatas = [];
              for (var i = 0; i < data.length; i++) {
                newdatas.push(data[i].zycz)
              }
              return newdatas;
            })()
          }]
        };
        teachingA.setOption(teaching_personal);
      }

      function loadDynamic(type) {
        $.ajax({
          url: service.prefix + '/pf/api/direct/jypt_resultList',
          type: 'GET',
          data:{limit:8,type:type},
          success: function (data) {
            if (data.code == 1){
              var DynamicHTML = '';
              if(data.data && data.data.length > 0){
                for ( var i = 0;i<data.data.length; i++ ){
                  if(type != 5){
                    DynamicHTML +=
                      '<li>'+
                      '<img src="'+getImgUrl(data.data[i].resExt)+'" alt="">'+
                      '<span title="'+ data.data[i].planName +'">['+ tools.hideTextByLen(data.data[i].planName,16) +']</span>'+
                      '<strong><a href="'+getPicPath(data.data[i].resId)+'">'+ data.data[i].resName + '.' + data.data[i].resExt + '</a></strong>'+
                      '<b>'+ getTimes(data.data[i].crtDttm) +'</b>'+
                      '<u>'+ data.data[i].userName +'</u>'+
                      '</li>'
                  }else{
                    DynamicHTML +=
                      '<li>'+
                      '<img src="'+getImgUrl(data.data[i].resExt)+'" alt="">'+
                      '<span title="'+ data.data[i].planName +'">['+ tools.hideTextByLen(data.data[i].planName,16) +']</span>'+
                      '<b>'+ getTimes(data.data[i].crtDttm) +'</b>'+
                      '<u>'+ data.data[i].userName +'</u>'+
                      '</li>'
                  }

                }
              } else{
                DynamicHTML = showprompt();
              }

              $('.teachingAchievements ol').html(DynamicHTML)
            }else{
              layer.alert("获取检验成果数据失败！",{icon:0})
            }
          },
          error:function(){
            layer.alert("获取检验成果数据失败！",{icon:0})
          }
        })
      }
      /**
       * 公用没有内容方法
       * @returns {string}
       */
      function showprompt() {
        return "<p id='no-content'>没有您查看的内容</p>";
      }


      function loadResults(type){
        $.ajax({
          url: service.prefix + '/pf/api/direct/jypt_sortList',
          type: 'GET',
          data:{limit:6},
          success: function (data) {
            if(data.code ==1){
              var resultsHTML = "";
              if(data.data && data.data.length > 0){
                for (var i = 0; i<data.data.length; i++){
                  resultsHTML +=
                    '<li class="dyn-li">'+
                    '<div class="time">'+getTimes(data.data[i].crtDttm)+'</div>'+
                    '<div class="dyn-li-innerbox">'+
                    '<a class="member-pic" target="_blank">'+
                    '<img src='+getImgUrl(data.data[i].resExt)+' alt="" >'+
                    '</a>'+
                    '<div>'+
                    '<a class="dyn-name" target="_blank"> '+data.data[i].userName +'</a>'+
                    '<p class="message clearFix"> <span>'+data.data[i].resName+'</span>.'+data.data[i].resExt+'</p>'+
                    '</div>'+
                    '</div>'+
                    '</li>'
                }
              }else{
                resultsHTML = showprompt();
              }
              $('#dynamic_list').html(resultsHTML);
              new DoMove($('#dynamic_list'), 89, 0);
            }
          },
          error:function(){
            layer.alert('获取教研动态数据失败！',{icon:0})
          }
        })
      }

      function loadDynamiCount() {
        $.ajax({
          url: service.prefix + '/pf/api/direct/jypt_chartsList',
          type: 'GET',
          data:{limit:8},
          success: function (data) {
            if (data.code == 1){
              initteaAchSta(data.data,$('#teaAchSta'))
            }else{
              layer.alert("获取检验成果统计数据失败！",{icon:0})
            }
          },
          error:function(){
            layer.alert("获取检验成果统计数据失败！",{icon:0})
          }
        })
      }

      /*截取时间字段*/
      function getTimes(data){
        var indx = data.indexOf(" ");
        data = data.slice(0,indx)
        return data;
      };

      /**
       * 根据图片ID返回图片路径
       * @param id 图片ID
       * @returns {string} 图片路径
       */
      function getPicPath(id) {
        return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
      }

      function getImgUrl(type){
        switch (type){
          case "doc" : return '../../www/public/images/base/doc.png'
          case "excel" : return '../../www/public/images/base/excel.png'
          case "docx" : return '../../www/public/images/base/docx.png'
          case "flv" : return '../../www/public/images/base/flv.png'
          case "gif" : return '../../www/public/images/base/gif.png'
          case "html" : return '../../www/public/images/base/html.png'
          case "jpeg" : return '../../www/public/images/base/jpeg.png'
          case "jpg" : return '../../www/public/images/base/jpg.png'
          case "mp3" : return '../../www/public/images/base/mp3.png'
          case "mp4" : return '../../www/public/images/base/mp4.png'
          case "pdf" : return '../../www/public/images/base/pdf.png'
          case "png" : return '../../www/public/images/base/png.png'
          case "ppt" : return '../../www/public/images/base/ppt.png'
          case "pptx" : return '../../www/public/images/base/pptx.png'
          case "rar" : return '../../www/public/images/base/rar.png'
          case "rm" : return '../../www/public/images/base/rm.png'
          case "swf" : return '../../www/public/images/base/swf.png'
          case "txt" : return '../../www/public/images/base/txt.png'
          case "wav" : return '../../www/public/images/base/wav.png'
          case "word" : return '../../www/public/images/base/word.png'
          case "xhtml" : return '../../www/public/images/base/xhtml.png'
          case "xls" : return '../../www/public/images/base/xls.png'
          case "xlsx" : return '../../www/public/images/base/xlsx.png'
          case "zip" : return '../../www/public/images/base/zip.png'
          case "bmp" : return '../../www/public/images/base/bmp.png'
        }
      }
    });
});



