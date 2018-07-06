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

      // linzhou
      'appConfig': '../../../../../config/appConfig.js'

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInB1YmxpYy9qcy9wbGF0Zm9ybUNvbmYuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicGF0aHMiLCJzaGltIiwiZXhwb3J0cyIsImRlcHMiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU8sWUFBWTtBQUNqQixTQUFPO0FBQ0xDLFdBQU87QUFDTDtBQUNBLGdCQUFVLGtDQUZMO0FBR0wsaUJBQVcsMEJBSE47QUFJTCxlQUFTLCtCQUpKO0FBS0wsZUFBUywwQkFMSjtBQU1MLGtCQUFZLG1DQU5QO0FBT0wsZ0JBQVUsa0NBUEw7QUFRTCxnQkFBVSxrQ0FSTDtBQVNMLGtCQUFZLDBDQVRQO0FBVUwsbUJBQWEsMENBVlI7QUFXTCxrQkFBWSx5Q0FYUDtBQVlMLGNBQVEsa0JBWkg7QUFhTCxhQUFPLGdCQWJGO0FBY0wsZ0JBQVUsbUJBZEw7QUFlTCxvQkFBYyx1QkFmVDtBQWdCTCxtQkFBYSxtQkFoQlI7QUFpQkwsZ0JBQVUsbUJBakJMO0FBa0JMLGNBQVEsaUJBbEJIO0FBbUJMLGtCQUFZLHFCQW5CUDtBQW9CTCxjQUFRLDRDQXBCSDtBQXFCTCxxQkFBZSw4Q0FyQlY7QUFzQkwsZ0JBQVUsNEJBdEJMO0FBdUJMLG9CQUFjLDZCQXZCVDs7QUF5Qkw7QUFDQSxtQkFBYTs7QUExQlIsS0FERjtBQWdDTEMsVUFBTTtBQUNKLGdCQUFVO0FBQ1JDLGlCQUFTO0FBREQsT0FETjtBQUlKLGdCQUFVO0FBQ1JDLGNBQU0sQ0FBQyxRQUFEO0FBREUsT0FKTjtBQU9KLGVBQVM7QUFDUEEsY0FBTSxDQUFDLFFBQUQ7QUFEQyxPQVBMO0FBVUosa0JBQVk7QUFDVkEsY0FBTSxDQUFDLFFBQUQ7QUFESSxPQVZSO0FBYUosa0JBQVk7QUFDVkEsY0FBTSxDQUFDLFFBQUQ7QUFESSxPQWJSO0FBZ0JKLG1CQUFhO0FBQ1hBLGNBQU0sQ0FBQyxRQUFEO0FBREssT0FoQlQ7QUFtQkosYUFBTztBQUNMQSxjQUFNLENBQUMsUUFBRDtBQUREO0FBbkJIO0FBaENELEdBQVA7QUF3REQsQ0F6REQiLCJmaWxlIjoicHVibGljL2pzL3BsYXRmb3JtQ29uZi03ZDcxYmRjODk1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcGF0aHM6IHtcclxuICAgICAgLy8g55u45a+555uu5b2V5Li654mI5pys55uu5b2VIHN0YW5kYXJkfGJhaXlpbnxiYWl5aW4yLjAgd3d3XHJcbiAgICAgICdqcXVlcnknOiAnLi4vLi4vbGliL2pxdWVyeS9qcXVlcnktMS45LjEuanMnLFxyXG4gICAgICAnc2VydmljZSc6ICcuLi8uLi9iYXNlL2pzL3NlcnZpY2UuanMnLFxyXG4gICAgICAndG9vbHMnOiAnLi4vLi4vYmFzZS9qcy9yZXF1aXJldG9vbHMuanMnLFxyXG4gICAgICAnbGF5ZXInOiAnLi4vLi4vbGliL2xheWVyL2xheWVyLmpzJyxcclxuICAgICAgJ3RlbXBsYXRlJzogJy4uLy4uL2xpYi9hclR0ZW1wbGF0ZS90ZW1wbGF0ZS5qcycsXHJcbiAgICAgICdmb290ZXInOiAnLi4vLi4vcHVibGljL2Zvb3Rlci9qcy9sb2dvdXQuanMnLFxyXG4gICAgICAnaGVhZGVyJzogJy4uLy4uL3B1YmxpYy9oZWFkZXIvanMvaGVhZGVyLmpzJyxcclxuICAgICAgJ2pxdWVyeVVJJzogJy4uLy4uL2xpYi9qcXVlcnkvanF1ZXJ5LXVpLTEuMTAuMy5taW4uanMnLFxyXG4gICAgICAnanF1ZXJ5VUlCJzogJy4uLy4uL2xpYi9qcXVlcnkvanF1ZXJ5LXVpLTEuMTEuMC5taW4uanMnLFxyXG4gICAgICAnZnVsbFBhZ2UnOiAnLi4vLi4vbGliL2pxdWVyeS9qcXVlcnkuZnVsbFBhZ2UubWluLmpzJyxcclxuICAgICAgJ3Rvb2wnOiAnaG9tZS9qcy90b29scy5qcycsXHJcbiAgICAgICdhcHAnOiAnaG9tZS9qcy9hcHAuanMnLFxyXG4gICAgICAnYmFubmVyJzogJ2hvbWUvanMvYmFubmVyLmpzJyxcclxuICAgICAgJ3RleHRTY3JvbGwnOiAnaG9tZS9qcy90ZXh0U2Nyb2xsLmpzJyxcclxuICAgICAgJ3Njcm9sbE5hdic6ICdob21lL2pzL3Njcm9sbC5qcycsXHJcbiAgICAgICdjZW50ZXInOiAnaG9tZS9qcy9jZW50ZXIuanMnLFxyXG4gICAgICAnbWFpbic6ICdob21lL2pzL21haW4uanMnLFxyXG4gICAgICAnaW5kZXhBcHAnOiAnaG9tZS9qcy9pbmRleEFwcC5qcycsXHJcbiAgICAgICdwYWdlJzogJy4uLy4uL2xpYi9jb21wb25lbnQvcGFnaW5nU2ltcGxlL3BhZ2luZy5qcycsXHJcbiAgICAgIFwid2VidXBsb2FkZXJcIjogXCIuLi8uLi9saWIvY29tcG9uZW50L3VwbG9hZC9qcy93ZWJ1cGxvYWRlci5qc1wiLFxyXG4gICAgICAnZGlhbG9nJzogJ3BlcnNDZW50ZXIvanMvYXBwRGlhbG9nLmpzJyxcclxuICAgICAgJ2FqYXhoZWxwZXInOiAncGVyc0NlbnRlci9qcy9hamF4aGVscGVyLmpzJyxcclxuXHJcbiAgICAgIC8vIGxpbnpob3VcclxuICAgICAgJ2FwcENvbmZpZyc6ICcuLi8uLi8uLi8uLi8uLi9jb25maWcvYXBwQ29uZmlnLmpzJyxcclxuXHJcblxyXG5cclxuICAgIH0sXHJcbiAgICBzaGltOiB7XHJcbiAgICAgICdqcXVlcnknOiB7XHJcbiAgICAgICAgZXhwb3J0czogJ2pRdWVyeSdcclxuICAgICAgfSxcclxuICAgICAgJ2NvbW1vbic6IHtcclxuICAgICAgICBkZXBzOiBbJ2pxdWVyeSddXHJcbiAgICAgIH0sXHJcbiAgICAgICdsYXllcic6IHtcclxuICAgICAgICBkZXBzOiBbJ2pxdWVyeSddXHJcbiAgICAgIH0sXHJcbiAgICAgICdmdWxsUGFnZSc6IHtcclxuICAgICAgICBkZXBzOiBbJ2pxdWVyeSddXHJcbiAgICAgIH0sXHJcbiAgICAgICdqcXVlcnlVSSc6IHtcclxuICAgICAgICBkZXBzOiBbJ2pxdWVyeSddXHJcbiAgICAgIH0sXHJcbiAgICAgICdqcXVlcnlVSUInOiB7XHJcbiAgICAgICAgZGVwczogWydqcXVlcnknXVxyXG4gICAgICB9LFxyXG4gICAgICAndGFiJzoge1xyXG4gICAgICAgIGRlcHM6IFsnanF1ZXJ5J11cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSk7Il19
