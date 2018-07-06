'use strict';

define(function () {
  return {
    paths: {
      // 相对目录为版本目录 standard|baiyin|baiyin2.0 www
      'jquery': '../../lib/jquery/jquery-1-397754ba49.9.1.js',
      'service': '../../base/js/service-5ba6dc5529.js',
      'tools': '../../base/js/requiretools-f6e18a13fc.js',
      'layer': '../../lib/layer/layer-b0abd8f830.js',
      'template': '../../lib/arTtemplate/template-dd622e58c9.js',
      'footer': '../../public/footer/js/logout-2108dd64a4.js',
      'header': '../../public/header/js/header-c9ea744b67.js',

      'jqueryUI': '../../lib/jquery/jquery-ui-1-fd25541583.10.3.min.js',
      'jqueryUIB': '../../lib/jquery/jquery-ui-1-ef706831f2.11.0.min.js',
      'fullPage': '../../lib/jquery/jquery-ca74486fba.fullPage.min.js',

      'tool': 'home/js/tools-46e348efc9.js',
      'app': 'home/js/app-3f596fd404.js',

      'banner': 'home/js/banner-e3677689d8.js',
      'textScroll': 'home/js/textScroll-2a3af53d64.js',
      'scrollNav': 'home/js/scroll-03edf03a59.js',
      'center': 'home/js/center-1e8958a5b2.js',
      'main': 'home/js/main-5709998f12.js',
      'indexApp': 'home/js/indexApp-3df7affce0.js',

      'page': '../../lib/component/pagingSimple/paging-0d69ce3f70.js',

      "webuploader": "../../lib/component/upload/js/webuploader-155819aa04.js",
      'dialog': 'persCenter/js/appDialog-896dc133da.js',
      'ajaxhelper': 'persCenter/js/ajaxhelper-4c8b4c9856.js',

      'orgConfig': '../../config/orgConfig.js',

      'tab': 'home/js/tab-43c98f5de4.js',
      'ajaxBanner': 'home/js/ajaxBanner-d350e36181.js',
      'secondNav': 'home/js/secondNav-3c0fe18764.js',
      'appVerify': '../../public/header/js/appVerify-a48f01e5f5.js',
      'album': 'home/js/album-f34581f126.js',

      'NProgress': '../../lib/nprogress/nprogress-34ddfea0de.min.js',

      'echarts': '../../lib/echarts/echarts-d52b3a5ab2.min.js',
      'addFav': '../../public/header/js/addFav-98ac8fb349.js'

    },
    shim: {
      'jquery': {
        exports: 'jQuery'
      },
      'common': {
        deps: ['jquery']
      },
      'layer': {
        deps: ['jquery']
      },
      'fullPage': {
        deps: ['jquery']
      },
      'jqueryUI': {
        deps: ['jquery']
      },
      'jqueryUIB': {
        deps: ['jquery']
      },
      'tab': {
        deps: ['jquery']
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB1YmxpYy9qcy9wbGF0Zm9ybUNvbmYuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicGF0aHMiLCJzaGltIiwiZXhwb3J0cyIsImRlcHMiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU8sWUFBWTtBQUNqQixTQUFPO0FBQ0xDLFdBQU87QUFDTDtBQUNBLGdCQUFVLGtDQUZMO0FBR0wsaUJBQVcsMEJBSE47QUFJTCxlQUFTLCtCQUpKO0FBS0wsZUFBUywwQkFMSjtBQU1MLGtCQUFZLG1DQU5QO0FBT0wsZ0JBQVUsa0NBUEw7QUFRTCxnQkFBVSxrQ0FSTDs7QUFVTCxrQkFBWSwwQ0FWUDtBQVdMLG1CQUFhLDBDQVhSO0FBWUwsa0JBQVkseUNBWlA7O0FBY0wsY0FBUSxrQkFkSDtBQWVMLGFBQU8sZ0JBZkY7O0FBaUJMLGdCQUFVLG1CQWpCTDtBQWtCTCxvQkFBYyx1QkFsQlQ7QUFtQkwsbUJBQWEsbUJBbkJSO0FBb0JMLGdCQUFVLG1CQXBCTDtBQXFCTCxjQUFRLGlCQXJCSDtBQXNCTCxrQkFBWSxxQkF0QlA7O0FBd0JMLGNBQVEsNENBeEJIOztBQTBCTCxxQkFBZSw4Q0ExQlY7QUEyQkwsZ0JBQVUsNEJBM0JMO0FBNEJMLG9CQUFjLDZCQTVCVDs7QUE4QkwsbUJBQWEsMkJBOUJSOztBQWdDTCxhQUFPLGdCQWhDRjtBQWlDTCxvQkFBYyx1QkFqQ1Q7QUFrQ0wsbUJBQWEsc0JBbENSO0FBbUNMLG1CQUFhLHFDQW5DUjtBQW9DTCxlQUFTLGtCQXBDSjs7QUFzQ0wsbUJBQWEsc0NBdENSOztBQXdDTCxpQkFBVyxrQ0F4Q047QUF5Q0wsZ0JBQVU7O0FBekNMLEtBREY7QUE2Q0xDLFVBQU07QUFDSixnQkFBVTtBQUNSQyxpQkFBUztBQURELE9BRE47QUFJSixnQkFBVTtBQUNSQyxjQUFNLENBQUMsUUFBRDtBQURFLE9BSk47QUFPSixlQUFTO0FBQ1BBLGNBQU0sQ0FBQyxRQUFEO0FBREMsT0FQTDtBQVVKLGtCQUFZO0FBQ1ZBLGNBQU0sQ0FBQyxRQUFEO0FBREksT0FWUjtBQWFKLGtCQUFZO0FBQ1ZBLGNBQU0sQ0FBQyxRQUFEO0FBREksT0FiUjtBQWdCSixtQkFBYTtBQUNYQSxjQUFNLENBQUMsUUFBRDtBQURLLE9BaEJUO0FBbUJKLGFBQU87QUFDTEEsY0FBTSxDQUFDLFFBQUQ7QUFERDtBQW5CSDtBQTdDRCxHQUFQO0FBcUVELENBdEVEIiwiZmlsZSI6InB1YmxpYy9qcy9wbGF0Zm9ybUNvbmYtNTQxZTNmYjFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZShmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHBhdGhzOiB7XHJcbiAgICAgIC8vIOebuOWvueebruW9leS4uueJiOacrOebruW9lSBzdGFuZGFyZHxiYWl5aW58YmFpeWluMi4wIHd3d1xyXG4gICAgICAnanF1ZXJ5JzogJy4uLy4uL2xpYi9qcXVlcnkvanF1ZXJ5LTEuOS4xLmpzJyxcclxuICAgICAgJ3NlcnZpY2UnOiAnLi4vLi4vYmFzZS9qcy9zZXJ2aWNlLmpzJyxcclxuICAgICAgJ3Rvb2xzJzogJy4uLy4uL2Jhc2UvanMvcmVxdWlyZXRvb2xzLmpzJyxcclxuICAgICAgJ2xheWVyJzogJy4uLy4uL2xpYi9sYXllci9sYXllci5qcycsXHJcbiAgICAgICd0ZW1wbGF0ZSc6ICcuLi8uLi9saWIvYXJUdGVtcGxhdGUvdGVtcGxhdGUuanMnLFxyXG4gICAgICAnZm9vdGVyJzogJy4uLy4uL3B1YmxpYy9mb290ZXIvanMvbG9nb3V0LmpzJyxcclxuICAgICAgJ2hlYWRlcic6ICcuLi8uLi9wdWJsaWMvaGVhZGVyL2pzL2hlYWRlci5qcycsXHJcblxyXG4gICAgICAnanF1ZXJ5VUknOiAnLi4vLi4vbGliL2pxdWVyeS9qcXVlcnktdWktMS4xMC4zLm1pbi5qcycsXHJcbiAgICAgICdqcXVlcnlVSUInOiAnLi4vLi4vbGliL2pxdWVyeS9qcXVlcnktdWktMS4xMS4wLm1pbi5qcycsXHJcbiAgICAgICdmdWxsUGFnZSc6ICcuLi8uLi9saWIvanF1ZXJ5L2pxdWVyeS5mdWxsUGFnZS5taW4uanMnLFxyXG5cclxuICAgICAgJ3Rvb2wnOiAnaG9tZS9qcy90b29scy5qcycsXHJcbiAgICAgICdhcHAnOiAnaG9tZS9qcy9hcHAuanMnLFxyXG5cclxuICAgICAgJ2Jhbm5lcic6ICdob21lL2pzL2Jhbm5lci5qcycsXHJcbiAgICAgICd0ZXh0U2Nyb2xsJzogJ2hvbWUvanMvdGV4dFNjcm9sbC5qcycsXHJcbiAgICAgICdzY3JvbGxOYXYnOiAnaG9tZS9qcy9zY3JvbGwuanMnLFxyXG4gICAgICAnY2VudGVyJzogJ2hvbWUvanMvY2VudGVyLmpzJyxcclxuICAgICAgJ21haW4nOiAnaG9tZS9qcy9tYWluLmpzJyxcclxuICAgICAgJ2luZGV4QXBwJzogJ2hvbWUvanMvaW5kZXhBcHAuanMnLFxyXG5cclxuICAgICAgJ3BhZ2UnOiAnLi4vLi4vbGliL2NvbXBvbmVudC9wYWdpbmdTaW1wbGUvcGFnaW5nLmpzJyxcclxuXHJcbiAgICAgIFwid2VidXBsb2FkZXJcIjogXCIuLi8uLi9saWIvY29tcG9uZW50L3VwbG9hZC9qcy93ZWJ1cGxvYWRlci5qc1wiLFxyXG4gICAgICAnZGlhbG9nJzogJ3BlcnNDZW50ZXIvanMvYXBwRGlhbG9nLmpzJyxcclxuICAgICAgJ2FqYXhoZWxwZXInOiAncGVyc0NlbnRlci9qcy9hamF4aGVscGVyLmpzJyxcclxuXHJcbiAgICAgICdvcmdDb25maWcnOiAnLi4vLi4vY29uZmlnL29yZ0NvbmZpZy5qcycsXHJcblxyXG4gICAgICAndGFiJzogJ2hvbWUvanMvdGFiLmpzJyxcclxuICAgICAgJ2FqYXhCYW5uZXInOiAnaG9tZS9qcy9hamF4QmFubmVyLmpzJyxcclxuICAgICAgJ3NlY29uZE5hdic6ICdob21lL2pzL3NlY29uZE5hdi5qcycsXHJcbiAgICAgICdhcHBWZXJpZnknOiAnLi4vLi4vcHVibGljL2hlYWRlci9qcy9hcHBWZXJpZnkuanMnLFxyXG4gICAgICAnYWxidW0nOiAnaG9tZS9qcy9hbGJ1bS5qcycsXHJcblxyXG4gICAgICAnTlByb2dyZXNzJzogJy4uLy4uL2xpYi9ucHJvZ3Jlc3MvbnByb2dyZXNzLm1pbi5qcycsXHJcblxyXG4gICAgICAnZWNoYXJ0cyc6ICcuLi8uLi9saWIvZWNoYXJ0cy9lY2hhcnRzLm1pbi5qcycsXHJcbiAgICAgICdhZGRGYXYnOiAnLi4vLi4vcHVibGljL2hlYWRlci9qcy9hZGRGYXYuanMnLFxyXG5cclxuICAgIH0sXHJcbiAgICBzaGltOiB7XHJcbiAgICAgICdqcXVlcnknOiB7XHJcbiAgICAgICAgZXhwb3J0czogJ2pRdWVyeSdcclxuICAgICAgfSxcclxuICAgICAgJ2NvbW1vbic6IHtcclxuICAgICAgICBkZXBzOiBbJ2pxdWVyeSddXHJcbiAgICAgIH0sXHJcbiAgICAgICdsYXllcic6IHtcclxuICAgICAgICBkZXBzOiBbJ2pxdWVyeSddXHJcbiAgICAgIH0sXHJcbiAgICAgICdmdWxsUGFnZSc6IHtcclxuICAgICAgICBkZXBzOiBbJ2pxdWVyeSddXHJcbiAgICAgIH0sXHJcbiAgICAgICdqcXVlcnlVSSc6IHtcclxuICAgICAgICBkZXBzOiBbJ2pxdWVyeSddXHJcbiAgICAgIH0sXHJcbiAgICAgICdqcXVlcnlVSUInOiB7XHJcbiAgICAgICAgZGVwczogWydqcXVlcnknXVxyXG4gICAgICB9LFxyXG4gICAgICAndGFiJzoge1xyXG4gICAgICAgIGRlcHM6IFsnanF1ZXJ5J11cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSk7Il19
