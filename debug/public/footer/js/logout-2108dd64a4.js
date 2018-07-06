'use strict';

// require.config({
//   paths: {
//     'jquery': '../../../../lib/jquery/jquery-1-5790ead7ad.11.2.min.js',
//     'service': '../../../../base/js/service-5ba6dc5529.js'
//   }
// });
define(['jquery', 'service'], function ($, service) {
  homepageJp();
  function homepageJp() {
    //跨域
    //请求获取
    $.support.cors = true;
    $.ajax({
      url: service.prefix + '/pf/api/header/homepage.jsonp',
      type: 'GET',
      async: false,
      dataType: "jsonp",
      jsonp: "callback",
      success: function success(data) {
        if (data.result.code == "success") {
          $("#mainbo_footer").html(data.result.data.portal_info_bottom);
          document.title = data.result.data.portal_info_name;
          if (data.result.data.portal_info_logo && data.result.data.portal_info_logo != "" && $(".logo img").length > 0) {
            $(".logo a").attr("href", service.htmlHost + '/dist/platform/www/home/index.html');
            $(".logo img").attr("src", getPicPath(data.result.data.portal_info_logo));
          }
        }
      }
    });
  }

  /**
   * 根据图片ID返回图片路径
   * @param id 图片ID
   * @returns {string} 图片路径
   */
  function getPicPath(id) {
    return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvb3Rlci9qcy9sb2dvdXQuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwiJCIsInNlcnZpY2UiLCJob21lcGFnZUpwIiwic3VwcG9ydCIsImNvcnMiLCJhamF4IiwidXJsIiwicHJlZml4IiwidHlwZSIsImFzeW5jIiwiZGF0YVR5cGUiLCJqc29ucCIsInN1Y2Nlc3MiLCJkYXRhIiwicmVzdWx0IiwiY29kZSIsImh0bWwiLCJwb3J0YWxfaW5mb19ib3R0b20iLCJkb2N1bWVudCIsInRpdGxlIiwicG9ydGFsX2luZm9fbmFtZSIsInBvcnRhbF9pbmZvX2xvZ28iLCJsZW5ndGgiLCJhdHRyIiwiaHRtbEhvc3QiLCJnZXRQaWNQYXRoIiwiaWQiLCJwYXRoX3VybCIsInN1YnN0cmluZyIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiI7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FBLE9BQU8sQ0FBQyxRQUFELEVBQVksU0FBWixDQUFQLEVBQWlDLFVBQVdDLENBQVgsRUFBZUMsT0FBZixFQUF5QjtBQUN4REM7QUFDQSxXQUFTQSxVQUFULEdBQXNCO0FBQUM7QUFDckI7QUFDQUYsTUFBRUcsT0FBRixDQUFVQyxJQUFWLEdBQWlCLElBQWpCO0FBQ0FKLE1BQUVLLElBQUYsQ0FBTztBQUNMQyxXQUFNTCxRQUFRTSxNQUFSLEdBQWlCLCtCQURsQjtBQUVMQyxZQUFNLEtBRkQ7QUFHTEMsYUFBTyxLQUhGO0FBSUxDLGdCQUFXLE9BSk47QUFLTEMsYUFBTyxVQUxGO0FBTUxDLGVBQVUsaUJBQVNDLElBQVQsRUFBYztBQUN0QixZQUFJQSxLQUFLQyxNQUFMLENBQVlDLElBQVosSUFBb0IsU0FBeEIsRUFBbUM7QUFDakNmLFlBQUUsZ0JBQUYsRUFBb0JnQixJQUFwQixDQUEwQkgsS0FBS0MsTUFBTCxDQUFZRCxJQUFaLENBQWlCSSxrQkFBM0M7QUFDQUMsbUJBQVNDLEtBQVQsR0FBZU4sS0FBS0MsTUFBTCxDQUFZRCxJQUFaLENBQWlCTyxnQkFBaEM7QUFDQSxjQUFJUCxLQUFLQyxNQUFMLENBQVlELElBQVosQ0FBaUJRLGdCQUFqQixJQUFxQ1IsS0FBS0MsTUFBTCxDQUFZRCxJQUFaLENBQWlCUSxnQkFBakIsSUFBcUMsRUFBMUUsSUFBZ0ZyQixFQUFFLFdBQUYsRUFBZXNCLE1BQWYsR0FBc0IsQ0FBMUcsRUFBNEc7QUFDMUd0QixjQUFFLFNBQUYsRUFBYXVCLElBQWIsQ0FBa0IsTUFBbEIsRUFBMkJ0QixRQUFRdUIsUUFBUixHQUFpQixvQ0FBNUM7QUFDQXhCLGNBQUUsV0FBRixFQUFldUIsSUFBZixDQUFvQixLQUFwQixFQUEyQkUsV0FBWVosS0FBS0MsTUFBTCxDQUFZRCxJQUFaLENBQWlCUSxnQkFBN0IsQ0FBM0I7QUFDRDtBQUNGO0FBQ0Y7QUFmSSxLQUFQO0FBaUJEOztBQUVEOzs7OztBQUtBLFdBQVNJLFVBQVQsQ0FBb0JDLEVBQXBCLEVBQXdCO0FBQ3RCLFdBQU96QixRQUFRMEIsUUFBUixDQUFpQixjQUFqQixFQUFpQ0MsU0FBakMsQ0FBMkMsQ0FBM0MsRUFBOEMsQ0FBOUMsTUFBcUQsTUFBckQsR0FBOEQzQixRQUFRMEIsUUFBUixDQUFpQixjQUFqQixFQUFpQ0UsT0FBakMsQ0FBeUMsU0FBekMsRUFBb0RILEVBQXBELENBQTlELEdBQXlIekIsUUFBUU0sTUFBUixHQUFpQk4sUUFBUTBCLFFBQVIsQ0FBaUIsY0FBakIsRUFBaUNFLE9BQWpDLENBQXlDLFNBQXpDLEVBQW9ESCxFQUFwRCxDQUFqSjtBQUNEO0FBQ0YsQ0FoQ0QiLCJmaWxlIjoiZm9vdGVyL2pzL2xvZ291dC0yMTA4ZGQ2NGE0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8vIHJlcXVpcmUuY29uZmlnKHtcclxuLy8gICBwYXRoczoge1xyXG4vLyAgICAgJ2pxdWVyeSc6ICcuLi8uLi8uLi8uLi9saWIvanF1ZXJ5L2pxdWVyeS0xLjExLjIubWluLmpzJyxcclxuLy8gICAgICdzZXJ2aWNlJzogJy4uLy4uLy4uLy4uL2Jhc2UvanMvc2VydmljZS5qcydcclxuLy8gICB9XHJcbi8vIH0pO1xyXG5kZWZpbmUoWydqcXVlcnknICwgJ3NlcnZpY2UnIF0gLCBmdW5jdGlvbiAoICQgLCBzZXJ2aWNlICkge1xyXG4gIGhvbWVwYWdlSnAoKTtcclxuICBmdW5jdGlvbiBob21lcGFnZUpwKCkgey8v6Leo5Z+fXHJcbiAgICAvL+ivt+axguiOt+WPllxyXG4gICAgJC5zdXBwb3J0LmNvcnMgPSB0cnVlO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsIDogc2VydmljZS5wcmVmaXggKyAnL3BmL2FwaS9oZWFkZXIvaG9tZXBhZ2UuanNvbnAnLFxyXG4gICAgICB0eXBlIDonR0VUJyxcclxuICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICBkYXRhVHlwZSA6IFwianNvbnBcIixcclxuICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcclxuICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgIGlmKCBkYXRhLnJlc3VsdC5jb2RlID09IFwic3VjY2Vzc1wiICl7XHJcbiAgICAgICAgICAkKFwiI21haW5ib19mb290ZXJcIikuaHRtbCggZGF0YS5yZXN1bHQuZGF0YS5wb3J0YWxfaW5mb19ib3R0b20gKTtcclxuICAgICAgICAgIGRvY3VtZW50LnRpdGxlPWRhdGEucmVzdWx0LmRhdGEucG9ydGFsX2luZm9fbmFtZTtcclxuICAgICAgICAgIGlmKCBkYXRhLnJlc3VsdC5kYXRhLnBvcnRhbF9pbmZvX2xvZ28gJiYgZGF0YS5yZXN1bHQuZGF0YS5wb3J0YWxfaW5mb19sb2dvICE9IFwiXCIgJiYgJChcIi5sb2dvIGltZ1wiKS5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICQoXCIubG9nbyBhXCIpLmF0dHIoXCJocmVmXCIsICBzZXJ2aWNlLmh0bWxIb3N0KycvZGlzdC9wbGF0Zm9ybS93d3cvaG9tZS9pbmRleC5odG1sJyApO1xyXG4gICAgICAgICAgICAkKFwiLmxvZ28gaW1nXCIpLmF0dHIoXCJzcmNcIiwgZ2V0UGljUGF0aCggZGF0YS5yZXN1bHQuZGF0YS5wb3J0YWxfaW5mb19sb2dvICkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDmoLnmja7lm77niYdJROi/lOWbnuWbvueJh+i3r+W+hFxyXG4gICAqIEBwYXJhbSBpZCDlm77niYdJRFxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IOWbvueJh+i3r+W+hFxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGdldFBpY1BhdGgoaWQpIHtcclxuICAgIHJldHVybiBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5zdWJzdHJpbmcoMCwgNCkgPT09ICdodHRwJyA/IHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkgOiAoc2VydmljZS5wcmVmaXggKyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5yZXBsYWNlKCcjcmVzaWQjJywgaWQpKTtcclxuICB9XHJcbn0pOyJdfQ==
