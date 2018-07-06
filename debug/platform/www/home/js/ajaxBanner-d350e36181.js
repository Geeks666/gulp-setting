'use strict';

define(['jquery', 'template', 'layer', 'service', 'banner'], function ($, template, layer, service, banner) {
  /*service.htmlHost = 'http://172.16.1.141:8008';*/
  var bannerList = [{
    'id': 1,
    'name': 'banner1',
    'pic': '../home/images/banner1-34a1dc3ee1.jpg'
  }, {
    'id': 2,
    'name': 'banner2',
    'pic': '../home/images/banner2-e96c276919.jpg'
  }, {
    'id': 3,
    'name': 'banner3',
    'pic': '../home/images/banner3-2c4fbddd24.jpg'
  }];
  //初始化banner
  initBanner(bannerList);
  /**
   * 初始化banner
   * @param bannerList 如果请求不到banner图片，则显示bannerList
   */
  function initBanner(bannerList) {
    $.ajax({
      url: service.htmlHost + '/pf/api/friend/banner?limit=3',
      type: 'GET',
      success: function success(data) {
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
          layer.alert("初始化banner异常", { icon: 0 });
        }
      },
      error: function error(data) {
        layer.alert("初始化banner异常。", { icon: 0 });
      }
    });
  };

  /**
   * 根据图片ID返回图片路径
   * @param id 图片ID
   * @returns {string} 图片路径
   */
  function getPicPath(id) {
    return service.prefix + '/pf/res/download/' + id;
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvYWpheEJhbm5lci5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCIkIiwidGVtcGxhdGUiLCJsYXllciIsInNlcnZpY2UiLCJiYW5uZXIiLCJiYW5uZXJMaXN0IiwiaW5pdEJhbm5lciIsImFqYXgiLCJ1cmwiLCJodG1sSG9zdCIsInR5cGUiLCJzdWNjZXNzIiwiZGF0YSIsImNvZGUiLCJsZW5ndGgiLCJlYWNoIiwiaW5kZXgiLCJwaWMiLCJnZXRQaWNQYXRoIiwiaHRtbCIsImFsZXJ0IiwiaWNvbiIsImVycm9yIiwiaWQiLCJwcmVmaXgiXSwibWFwcGluZ3MiOiI7O0FBQ0FBLE9BQU8sQ0FBQyxRQUFELEVBQVksVUFBWixFQUF5QixPQUF6QixFQUFtQyxTQUFuQyxFQUErQyxRQUEvQyxDQUFQLEVBQ0UsVUFBVUMsQ0FBVixFQUFjQyxRQUFkLEVBQXlCQyxLQUF6QixFQUFpQ0MsT0FBakMsRUFBMkNDLE1BQTNDLEVBQW9EO0FBQ2xEO0FBQ0EsTUFBSUMsYUFBYSxDQUFDO0FBQ2hCLFVBQU8sQ0FEUztBQUVoQixZQUFTLFNBRk87QUFHaEIsV0FBUTtBQUhRLEdBQUQsRUFJZjtBQUNBLFVBQU8sQ0FEUDtBQUVBLFlBQVMsU0FGVDtBQUdBLFdBQVE7QUFIUixHQUplLEVBUWY7QUFDQSxVQUFPLENBRFA7QUFFQSxZQUFTLFNBRlQ7QUFHQSxXQUFRO0FBSFIsR0FSZSxDQUFqQjtBQWFBO0FBQ0FDLGFBQVlELFVBQVo7QUFDQTs7OztBQUlBLFdBQVNDLFVBQVQsQ0FBcUJELFVBQXJCLEVBQWlDO0FBQy9CTCxNQUFFTyxJQUFGLENBQU87QUFDTEMsV0FBTUwsUUFBUU0sUUFBUixHQUFtQiwrQkFEcEI7QUFFTEMsWUFBTSxLQUZEO0FBR0xDLGVBQVUsaUJBQVNDLElBQVQsRUFBYztBQUN0QixZQUFJQSxRQUFRQSxLQUFLQyxJQUFMLElBQWEsU0FBekIsRUFBb0M7QUFDbEMsY0FBSUQsS0FBS0EsSUFBTCxJQUFhQSxLQUFLQSxJQUFMLENBQVVFLE1BQVYsR0FBbUIsQ0FBcEMsRUFBdUM7QUFDckNkLGNBQUVlLElBQUYsQ0FBUUgsS0FBS0EsSUFBYixFQUFvQixVQUFVSSxLQUFWLEVBQWlCO0FBQ25DSixtQkFBS0EsSUFBTCxDQUFVSSxLQUFWLEVBQWlCQyxHQUFqQixHQUF1QkMsV0FBV04sS0FBS0EsSUFBTCxDQUFVSSxLQUFWLEVBQWlCQyxHQUE1QixDQUF2QjtBQUNELGFBRkQ7QUFHRCxXQUpELE1BSUs7QUFDSEwsaUJBQUtBLElBQUwsR0FBWVAsVUFBWjtBQUNEO0FBQ0RMLFlBQUUsWUFBRixFQUFnQm1CLElBQWhCLENBQXNCbEIsU0FBUyxVQUFULEVBQXFCVyxJQUFyQixDQUF0QjtBQUNBWixZQUFFLFdBQUYsRUFBZW1CLElBQWYsQ0FBcUJsQixTQUFTLFNBQVQsRUFBb0JXLElBQXBCLENBQXJCO0FBQ0FSO0FBQ0QsU0FYRCxNQVdLO0FBQ0hGLGdCQUFNa0IsS0FBTixDQUFZLGFBQVosRUFBMkIsRUFBQ0MsTUFBTSxDQUFQLEVBQTNCO0FBQ0Q7QUFDRixPQWxCSTtBQW1CTEMsYUFBUSxlQUFVVixJQUFWLEVBQWdCO0FBQ3RCVixjQUFNa0IsS0FBTixDQUFZLGNBQVosRUFBNEIsRUFBQ0MsTUFBTSxDQUFQLEVBQTVCO0FBQ0Q7QUFyQkksS0FBUDtBQXVCRDs7QUFFRDs7Ozs7QUFLQSxXQUFTSCxVQUFULENBQXFCSyxFQUFyQixFQUF5QjtBQUN2QixXQUFPcEIsUUFBUXFCLE1BQVIsR0FBaUIsbUJBQWpCLEdBQXFDRCxFQUE1QztBQUNEO0FBQ0osQ0F4REQiLCJmaWxlIjoiaG9tZS9qcy9hamF4QmFubmVyLWQzNTBlMzYxODEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZGVmaW5lKFsnanF1ZXJ5JyAsICd0ZW1wbGF0ZScgLCAnbGF5ZXInICwgJ3NlcnZpY2UnICwgJ2Jhbm5lciddLFxyXG4gIGZ1bmN0aW9uICgkICwgdGVtcGxhdGUgLCBsYXllciAsIHNlcnZpY2UgLCBiYW5uZXIgKSB7XHJcbiAgICAvKnNlcnZpY2UuaHRtbEhvc3QgPSAnaHR0cDovLzE3Mi4xNi4xLjE0MTo4MDA4JzsqL1xyXG4gICAgdmFyIGJhbm5lckxpc3QgPSBbe1xyXG4gICAgICAnaWQnIDogMSxcclxuICAgICAgJ25hbWUnIDogJ2Jhbm5lcjEnLFxyXG4gICAgICAncGljJyA6ICcuLi9ob21lL2ltYWdlcy9iYW5uZXIxLmpwZydcclxuICAgIH0se1xyXG4gICAgICAnaWQnIDogMixcclxuICAgICAgJ25hbWUnIDogJ2Jhbm5lcjInLFxyXG4gICAgICAncGljJyA6ICcuLi9ob21lL2ltYWdlcy9iYW5uZXIyLmpwZydcclxuICAgIH0se1xyXG4gICAgICAnaWQnIDogMyxcclxuICAgICAgJ25hbWUnIDogJ2Jhbm5lcjMnLFxyXG4gICAgICAncGljJyA6ICcuLi9ob21lL2ltYWdlcy9iYW5uZXIzLmpwZydcclxuICAgIH1dO1xyXG4gICAgLy/liJ3lp4vljJZiYW5uZXJcclxuICAgIGluaXRCYW5uZXIoIGJhbm5lckxpc3QgKTtcclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyWYmFubmVyXHJcbiAgICAgKiBAcGFyYW0gYmFubmVyTGlzdCDlpoLmnpzor7fmsYLkuI3liLBiYW5uZXLlm77niYfvvIzliJnmmL7npLpiYW5uZXJMaXN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXRCYW5uZXIoIGJhbm5lckxpc3QgKXtcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmwgOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvZnJpZW5kL2Jhbm5lcj9saW1pdD0zJyxcclxuICAgICAgICB0eXBlIDonR0VUJyxcclxuICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICBpZiggZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIgKXtcclxuICAgICAgICAgICAgaWYoIGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEubGVuZ3RoID4gMCApe1xyXG4gICAgICAgICAgICAgICQuZWFjaCggZGF0YS5kYXRhICwgZnVuY3Rpb24oIGluZGV4ICl7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaW5kZXhdLnBpYyA9IGdldFBpY1BhdGgoZGF0YS5kYXRhW2luZGV4XS5waWMpIDtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgZGF0YS5kYXRhID0gYmFubmVyTGlzdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKFwiLnNsaWRlLXBpY1wiKS5odG1sKCB0ZW1wbGF0ZSgnc2xpZGVQaWMnLCBkYXRhICkpO1xyXG4gICAgICAgICAgICAkKFwiLnNsaWRlLWxpXCIpLmh0bWwoIHRlbXBsYXRlKCdzbGlkZUxpJywgZGF0YSApKTtcclxuICAgICAgICAgICAgYmFubmVyKCk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLliJ3lp4vljJZiYW5uZXLlvILluLhcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yIDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIGxheWVyLmFsZXJ0KFwi5Yid5aeL5YyWYmFubmVy5byC5bi444CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7lm77niYdJROi/lOWbnuWbvueJh+i3r+W+hFxyXG4gICAgICogQHBhcmFtIGlkIOWbvueJh0lEXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSDlm77niYfot6/lvoRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0UGljUGF0aCggaWQgKXtcclxuICAgICAgcmV0dXJuIHNlcnZpY2UucHJlZml4ICsgJy9wZi9yZXMvZG93bmxvYWQvJytpZDtcclxuICAgIH07XHJcbn0pO1xyXG5cclxuXHJcblxyXG4iXX0=
