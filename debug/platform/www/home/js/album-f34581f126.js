'use strict';

define(['jquery'], function ($) {

  function album(o) {
    this.int(o);
  };
  album.prototype = {
    int: function int(o) {
      var that = this;
      this.aImg = $(o).find('img');
      this._css = null;
      this.iLoad = 0;
      this.zoom = 1.1;
      this.i = 0;
      this.ok = false;
      this.aEm = $(o).find('em');
      this.tLayer = null;
      this.aImg.each(function () {
        $(this).load(function () {
          that.iLoad++;
          if (that.iLoad == that.aImg.length && !that.ok) {
            that.pos(o);
          }
        });
      });
      setTimeout(function () {
        if (!that.ok) {
          that.pos(o);
        }
      }, 2000);
    },
    pos: function pos(o) {
      var that = this;
      that.ok = true;
      $('a', $(o)).each(function () {
        var oP = $(this).parent();
        var oS = $(this).siblings('.Album_info');
        oP.css({ 'width': $('img', this).width(), 'height': $('img', this).height() });
        $(this).css({ 'top': oP.position().top, 'left': oP.position().left });
        $('em', this).css({ 'height': oP.height(), 'filter': 'alpha(opacity=50)' });
        if ($(o).width() - oP.position().left >= $(this).width() * 3) {
          oS.css({ 'height': Math.round($(this).height() * that.zoom) + 4, 'left': oP.position().left - 2, 'right': 'auto', 'padding-left': Math.round($(this).width() * that.zoom) });
        } else {
          oS.css({ 'height': $(this).height() * that.zoom + 4, 'right': $(o).width() - oP.position().left - $(this).width() - 2, 'left': 'auto', 'padding-right': Math.round($(this).width() * that.zoom), 'text-align': 'right' });
        }
        if (oP.position().top >= Math.round($(this).height() * (that.zoom - 1) / 2) && $(o).height() - oP.position().top - $(this).height() >= Math.round($(this).height() * (that.zoom - 1) / 2)) {
          oS.css('top', oP.position().top - Math.round($(this).height() * (that.zoom - 1) / 2) - 2);
        } else if (oP.position().top < Math.round($(this).height() * (that.zoom - 1) / 2)) {
          oS.css('top', $(this).parent().position().top - 2);
        } else {
          oS.css('top', $(this).parent().position().top - Math.round($(this).height() * (that.zoom - 1) + 2));
        }
      });
      this.showImg(o);
    },
    showImg: function showImg(o) {
      var that = this;
      $('li', $(o)).each(function () {
        $('a', this).css({ 'visibility': 'visible', 'display': 'none' }).fadeIn(1000);
      });
      setTimeout(function () {
        $(o).css({ 'background': 'none' });
        that.hover(o);
      }, 1000);
    },
    hover: function hover(o) {
      var that = this;
      $('a', $(o)).hover(function () {
        var oP = $(this).parent();
        var oS = $(this).siblings('.Album_info');
        $('em', this).hide();
        if (that.tLayer) {
          clearTimeout(that.tLayer);that.tLayer = null;
        }
        $(o).find('em').not($('em', this)).each(function () {
          if (!$(this).is(':visible')) {
            $(this).fadeIn(200);
          }
        });
        oS.show().animate({ width: $(this).width() * 3 - Math.round($(this).width() * that.zoom) + 7 }, 300);
        that._css = { 'top': oP.position().top, 'z-index': $(this).css('z-index'), 'width': $(this).width(), 'height': $(this).height(), 'left': $(this).css('left'), 'right': $(this).css('right') };
        if ($(o).width() - oP.position().left >= $(this).width() * 3) {
          $(this).css({ 'right': 'auto', 'left': parseInt(oS.css('left')) + 2 });
        } else {
          $(this).css({ 'right': parseInt(oS.css('right')) + 2, 'left': 'auto' });
        }
        $(this).css({ 'top': parseInt(oS.css('top')) + 2, 'width': $(this).width() * that.zoom, 'height': $(this).height() * that.zoom, 'z-index': $(this).css('z-index') + 100 });
        $(this).children('img').css({ 'width': $(this).width(), 'height': $(this).height() });
      }, function () {
        $('.Album_info').hide().css({ 'width': '0px' }).stop();
        $(this).css(that._css);
        $(this).children('img').css({ 'width': that._css.width, 'height': that._css.height });
        that.tLayer = setTimeout(function () {
          $(o).find('em').not($('em', this)).fadeOut(200);
        }, 200);
      });
    }
  };
  return album;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvYWxidW0uanMiXSwibmFtZXMiOlsiZGVmaW5lIiwiJCIsImFsYnVtIiwibyIsImludCIsInByb3RvdHlwZSIsInRoYXQiLCJhSW1nIiwiZmluZCIsIl9jc3MiLCJpTG9hZCIsInpvb20iLCJpIiwib2siLCJhRW0iLCJ0TGF5ZXIiLCJlYWNoIiwibG9hZCIsImxlbmd0aCIsInBvcyIsInNldFRpbWVvdXQiLCJvUCIsInBhcmVudCIsIm9TIiwic2libGluZ3MiLCJjc3MiLCJ3aWR0aCIsImhlaWdodCIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsIk1hdGgiLCJyb3VuZCIsInNob3dJbWciLCJmYWRlSW4iLCJob3ZlciIsImhpZGUiLCJjbGVhclRpbWVvdXQiLCJub3QiLCJpcyIsInNob3ciLCJhbmltYXRlIiwicGFyc2VJbnQiLCJjaGlsZHJlbiIsInN0b3AiLCJmYWRlT3V0Il0sIm1hcHBpbmdzIjoiOztBQUNBQSxPQUFPLENBQUMsUUFBRCxDQUFQLEVBQWtCLFVBQVNDLENBQVQsRUFBVzs7QUFFekIsV0FBU0MsS0FBVCxDQUFlQyxDQUFmLEVBQWlCO0FBQ2YsU0FBS0MsR0FBTCxDQUFTRCxDQUFUO0FBQ0Q7QUFDREQsUUFBTUcsU0FBTixHQUFrQjtBQUNoQkQsU0FBSyxhQUFTRCxDQUFULEVBQVc7QUFDZCxVQUFJRyxPQUFPLElBQVg7QUFDQSxXQUFLQyxJQUFMLEdBQVlOLEVBQUVFLENBQUYsRUFBS0ssSUFBTCxDQUFVLEtBQVYsQ0FBWjtBQUNBLFdBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsV0FBS0MsS0FBTCxHQUFhLENBQWI7QUFDQSxXQUFLQyxJQUFMLEdBQVksR0FBWjtBQUNBLFdBQUtDLENBQUwsR0FBTyxDQUFQO0FBQ0EsV0FBS0MsRUFBTCxHQUFVLEtBQVY7QUFDQSxXQUFLQyxHQUFMLEdBQVdiLEVBQUVFLENBQUYsRUFBS0ssSUFBTCxDQUFVLElBQVYsQ0FBWDtBQUNBLFdBQUtPLE1BQUwsR0FBYyxJQUFkO0FBQ0EsV0FBS1IsSUFBTCxDQUFVUyxJQUFWLENBQWUsWUFBVTtBQUN2QmYsVUFBRSxJQUFGLEVBQVFnQixJQUFSLENBQWEsWUFBVTtBQUNyQlgsZUFBS0ksS0FBTDtBQUNBLGNBQUdKLEtBQUtJLEtBQUwsSUFBWUosS0FBS0MsSUFBTCxDQUFVVyxNQUF0QixJQUE4QixDQUFDWixLQUFLTyxFQUF2QyxFQUEwQztBQUN4Q1AsaUJBQUthLEdBQUwsQ0FBU2hCLENBQVQ7QUFDRDtBQUNGLFNBTEQ7QUFNRCxPQVBEO0FBUUFpQixpQkFBVyxZQUFVO0FBQ25CLFlBQUcsQ0FBQ2QsS0FBS08sRUFBVCxFQUFZO0FBQUNQLGVBQUthLEdBQUwsQ0FBU2hCLENBQVQ7QUFBYTtBQUMzQixPQUZELEVBRUUsSUFGRjtBQUdELEtBdEJlO0FBdUJoQmdCLFNBQUksYUFBU2hCLENBQVQsRUFBVztBQUNiLFVBQUlHLE9BQU8sSUFBWDtBQUNBQSxXQUFLTyxFQUFMLEdBQVUsSUFBVjtBQUNBWixRQUFFLEdBQUYsRUFBTUEsRUFBRUUsQ0FBRixDQUFOLEVBQVlhLElBQVosQ0FBaUIsWUFBVTtBQUN6QixZQUFJSyxLQUFLcEIsRUFBRSxJQUFGLEVBQVFxQixNQUFSLEVBQVQ7QUFDQSxZQUFJQyxLQUFLdEIsRUFBRSxJQUFGLEVBQVF1QixRQUFSLENBQWlCLGFBQWpCLENBQVQ7QUFDQUgsV0FBR0ksR0FBSCxDQUFPLEVBQUMsU0FBUXhCLEVBQUUsS0FBRixFQUFRLElBQVIsRUFBY3lCLEtBQWQsRUFBVCxFQUErQixVQUFTekIsRUFBRSxLQUFGLEVBQVEsSUFBUixFQUFjMEIsTUFBZCxFQUF4QyxFQUFQO0FBQ0ExQixVQUFFLElBQUYsRUFBUXdCLEdBQVIsQ0FBWSxFQUFDLE9BQU1KLEdBQUdPLFFBQUgsR0FBY0MsR0FBckIsRUFBeUIsUUFBT1IsR0FBR08sUUFBSCxHQUFjRSxJQUE5QyxFQUFaO0FBQ0E3QixVQUFFLElBQUYsRUFBTyxJQUFQLEVBQWF3QixHQUFiLENBQWlCLEVBQUMsVUFBU0osR0FBR00sTUFBSCxFQUFWLEVBQXNCLFVBQVUsbUJBQWhDLEVBQWpCO0FBQ0EsWUFBRzFCLEVBQUVFLENBQUYsRUFBS3VCLEtBQUwsS0FBYUwsR0FBR08sUUFBSCxHQUFjRSxJQUEzQixJQUFpQzdCLEVBQUUsSUFBRixFQUFReUIsS0FBUixLQUFnQixDQUFwRCxFQUFzRDtBQUNwREgsYUFBR0UsR0FBSCxDQUFPLEVBQUMsVUFBU00sS0FBS0MsS0FBTCxDQUFXL0IsRUFBRSxJQUFGLEVBQVEwQixNQUFSLEtBQWlCckIsS0FBS0ssSUFBakMsSUFBdUMsQ0FBakQsRUFBbUQsUUFBT1UsR0FBR08sUUFBSCxHQUFjRSxJQUFkLEdBQW1CLENBQTdFLEVBQStFLFNBQVEsTUFBdkYsRUFBOEYsZ0JBQWVDLEtBQUtDLEtBQUwsQ0FBVy9CLEVBQUUsSUFBRixFQUFReUIsS0FBUixLQUFnQnBCLEtBQUtLLElBQWhDLENBQTdHLEVBQVA7QUFDRCxTQUZELE1BRUs7QUFDSFksYUFBR0UsR0FBSCxDQUFPLEVBQUMsVUFBU3hCLEVBQUUsSUFBRixFQUFRMEIsTUFBUixLQUFpQnJCLEtBQUtLLElBQXRCLEdBQTJCLENBQXJDLEVBQXVDLFNBQVFWLEVBQUVFLENBQUYsRUFBS3VCLEtBQUwsS0FBYUwsR0FBR08sUUFBSCxHQUFjRSxJQUEzQixHQUFnQzdCLEVBQUUsSUFBRixFQUFReUIsS0FBUixFQUFoQyxHQUFnRCxDQUEvRixFQUFpRyxRQUFPLE1BQXhHLEVBQStHLGlCQUFnQkssS0FBS0MsS0FBTCxDQUFXL0IsRUFBRSxJQUFGLEVBQVF5QixLQUFSLEtBQWdCcEIsS0FBS0ssSUFBaEMsQ0FBL0gsRUFBcUssY0FBYSxPQUFsTCxFQUFQO0FBQ0Q7QUFDRCxZQUFHVSxHQUFHTyxRQUFILEdBQWNDLEdBQWQsSUFBbUJFLEtBQUtDLEtBQUwsQ0FBVy9CLEVBQUUsSUFBRixFQUFRMEIsTUFBUixNQUFrQnJCLEtBQUtLLElBQUwsR0FBVSxDQUE1QixJQUErQixDQUExQyxDQUFuQixJQUFpRVYsRUFBRUUsQ0FBRixFQUFLd0IsTUFBTCxLQUFjTixHQUFHTyxRQUFILEdBQWNDLEdBQTVCLEdBQWdDNUIsRUFBRSxJQUFGLEVBQVEwQixNQUFSLEVBQWhDLElBQWtESSxLQUFLQyxLQUFMLENBQVcvQixFQUFFLElBQUYsRUFBUTBCLE1BQVIsTUFBa0JyQixLQUFLSyxJQUFMLEdBQVUsQ0FBNUIsSUFBK0IsQ0FBMUMsQ0FBdEgsRUFBbUs7QUFDaktZLGFBQUdFLEdBQUgsQ0FBTyxLQUFQLEVBQWFKLEdBQUdPLFFBQUgsR0FBY0MsR0FBZCxHQUFrQkUsS0FBS0MsS0FBTCxDQUFXL0IsRUFBRSxJQUFGLEVBQVEwQixNQUFSLE1BQWtCckIsS0FBS0ssSUFBTCxHQUFVLENBQTVCLElBQStCLENBQTFDLENBQWxCLEdBQStELENBQTVFO0FBQ0QsU0FGRCxNQUVNLElBQUdVLEdBQUdPLFFBQUgsR0FBY0MsR0FBZCxHQUFrQkUsS0FBS0MsS0FBTCxDQUFXL0IsRUFBRSxJQUFGLEVBQVEwQixNQUFSLE1BQWtCckIsS0FBS0ssSUFBTCxHQUFVLENBQTVCLElBQStCLENBQTFDLENBQXJCLEVBQWtFO0FBQ3RFWSxhQUFHRSxHQUFILENBQU8sS0FBUCxFQUFheEIsRUFBRSxJQUFGLEVBQVFxQixNQUFSLEdBQWlCTSxRQUFqQixHQUE0QkMsR0FBNUIsR0FBZ0MsQ0FBN0M7QUFDRCxTQUZLLE1BRUQ7QUFDSE4sYUFBR0UsR0FBSCxDQUFPLEtBQVAsRUFBYXhCLEVBQUUsSUFBRixFQUFRcUIsTUFBUixHQUFpQk0sUUFBakIsR0FBNEJDLEdBQTVCLEdBQWdDRSxLQUFLQyxLQUFMLENBQVcvQixFQUFFLElBQUYsRUFBUTBCLE1BQVIsTUFBa0JyQixLQUFLSyxJQUFMLEdBQVUsQ0FBNUIsSUFBK0IsQ0FBMUMsQ0FBN0M7QUFDRDtBQUNGLE9BbEJEO0FBbUJBLFdBQUtzQixPQUFMLENBQWE5QixDQUFiO0FBQ0QsS0E5Q2U7QUErQ2hCOEIsYUFBUyxpQkFBUzlCLENBQVQsRUFBVztBQUNsQixVQUFJRyxPQUFPLElBQVg7QUFDQUwsUUFBRSxJQUFGLEVBQU9BLEVBQUVFLENBQUYsQ0FBUCxFQUFhYSxJQUFiLENBQWtCLFlBQVU7QUFDMUJmLFVBQUUsR0FBRixFQUFNLElBQU4sRUFBWXdCLEdBQVosQ0FBZ0IsRUFBQyxjQUFhLFNBQWQsRUFBd0IsV0FBVSxNQUFsQyxFQUFoQixFQUEyRFMsTUFBM0QsQ0FBa0UsSUFBbEU7QUFDRCxPQUZEO0FBR0FkLGlCQUFXLFlBQVU7QUFDbkJuQixVQUFFRSxDQUFGLEVBQUtzQixHQUFMLENBQVMsRUFBQyxjQUFhLE1BQWQsRUFBVDtBQUNBbkIsYUFBSzZCLEtBQUwsQ0FBV2hDLENBQVg7QUFDRCxPQUhELEVBR0UsSUFIRjtBQUlELEtBeERlO0FBeURoQmdDLFdBQU8sZUFBU2hDLENBQVQsRUFBVztBQUNoQixVQUFJRyxPQUFPLElBQVg7QUFDQUwsUUFBRSxHQUFGLEVBQU1BLEVBQUVFLENBQUYsQ0FBTixFQUFZZ0MsS0FBWixDQUFrQixZQUFVO0FBQzFCLFlBQUlkLEtBQUtwQixFQUFFLElBQUYsRUFBUXFCLE1BQVIsRUFBVDtBQUNBLFlBQUlDLEtBQUt0QixFQUFFLElBQUYsRUFBUXVCLFFBQVIsQ0FBaUIsYUFBakIsQ0FBVDtBQUNBdkIsVUFBRSxJQUFGLEVBQU8sSUFBUCxFQUFhbUMsSUFBYjtBQUNBLFlBQUc5QixLQUFLUyxNQUFSLEVBQWU7QUFBQ3NCLHVCQUFhL0IsS0FBS1MsTUFBbEIsRUFBMEJULEtBQUtTLE1BQUwsR0FBYyxJQUFkO0FBQW1CO0FBQzdEZCxVQUFFRSxDQUFGLEVBQUtLLElBQUwsQ0FBVSxJQUFWLEVBQWdCOEIsR0FBaEIsQ0FBb0JyQyxFQUFFLElBQUYsRUFBTyxJQUFQLENBQXBCLEVBQWtDZSxJQUFsQyxDQUF1QyxZQUFVO0FBQy9DLGNBQUcsQ0FBQ2YsRUFBRSxJQUFGLEVBQVFzQyxFQUFSLENBQVcsVUFBWCxDQUFKLEVBQTJCO0FBQ3pCdEMsY0FBRSxJQUFGLEVBQVFpQyxNQUFSLENBQWUsR0FBZjtBQUNEO0FBQ0YsU0FKRDtBQUtBWCxXQUFHaUIsSUFBSCxHQUFVQyxPQUFWLENBQWtCLEVBQUNmLE9BQU16QixFQUFFLElBQUYsRUFBUXlCLEtBQVIsS0FBZ0IsQ0FBaEIsR0FBa0JLLEtBQUtDLEtBQUwsQ0FBVy9CLEVBQUUsSUFBRixFQUFReUIsS0FBUixLQUFnQnBCLEtBQUtLLElBQWhDLENBQWxCLEdBQXdELENBQS9ELEVBQWxCLEVBQW9GLEdBQXBGO0FBQ0FMLGFBQUtHLElBQUwsR0FBWSxFQUFDLE9BQU1ZLEdBQUdPLFFBQUgsR0FBY0MsR0FBckIsRUFBeUIsV0FBVTVCLEVBQUUsSUFBRixFQUFRd0IsR0FBUixDQUFZLFNBQVosQ0FBbkMsRUFBMEQsU0FBUXhCLEVBQUUsSUFBRixFQUFReUIsS0FBUixFQUFsRSxFQUFrRixVQUFTekIsRUFBRSxJQUFGLEVBQVEwQixNQUFSLEVBQTNGLEVBQTRHLFFBQU8xQixFQUFFLElBQUYsRUFBUXdCLEdBQVIsQ0FBWSxNQUFaLENBQW5ILEVBQXVJLFNBQVF4QixFQUFFLElBQUYsRUFBUXdCLEdBQVIsQ0FBWSxPQUFaLENBQS9JLEVBQVo7QUFDQSxZQUFHeEIsRUFBRUUsQ0FBRixFQUFLdUIsS0FBTCxLQUFhTCxHQUFHTyxRQUFILEdBQWNFLElBQTNCLElBQWlDN0IsRUFBRSxJQUFGLEVBQVF5QixLQUFSLEtBQWdCLENBQXBELEVBQXNEO0FBQ3BEekIsWUFBRSxJQUFGLEVBQVF3QixHQUFSLENBQVksRUFBQyxTQUFRLE1BQVQsRUFBZ0IsUUFBT2lCLFNBQVNuQixHQUFHRSxHQUFILENBQU8sTUFBUCxDQUFULElBQXlCLENBQWhELEVBQVo7QUFDRCxTQUZELE1BRUs7QUFDSHhCLFlBQUUsSUFBRixFQUFRd0IsR0FBUixDQUFZLEVBQUMsU0FBUWlCLFNBQVNuQixHQUFHRSxHQUFILENBQU8sT0FBUCxDQUFULElBQTBCLENBQW5DLEVBQXFDLFFBQU8sTUFBNUMsRUFBWjtBQUNEO0FBQ0R4QixVQUFFLElBQUYsRUFBUXdCLEdBQVIsQ0FBWSxFQUFDLE9BQU1pQixTQUFTbkIsR0FBR0UsR0FBSCxDQUFPLEtBQVAsQ0FBVCxJQUF3QixDQUEvQixFQUFpQyxTQUFReEIsRUFBRSxJQUFGLEVBQVF5QixLQUFSLEtBQWdCcEIsS0FBS0ssSUFBOUQsRUFBbUUsVUFBU1YsRUFBRSxJQUFGLEVBQVEwQixNQUFSLEtBQWlCckIsS0FBS0ssSUFBbEcsRUFBdUcsV0FBVVYsRUFBRSxJQUFGLEVBQVF3QixHQUFSLENBQVksU0FBWixJQUF1QixHQUF4SSxFQUFaO0FBQ0F4QixVQUFFLElBQUYsRUFBUTBDLFFBQVIsQ0FBaUIsS0FBakIsRUFBd0JsQixHQUF4QixDQUE0QixFQUFDLFNBQVF4QixFQUFFLElBQUYsRUFBUXlCLEtBQVIsRUFBVCxFQUF5QixVQUFTekIsRUFBRSxJQUFGLEVBQVEwQixNQUFSLEVBQWxDLEVBQTVCO0FBRUQsT0FwQkQsRUFvQkUsWUFBVTtBQUNWMUIsVUFBRSxhQUFGLEVBQWlCbUMsSUFBakIsR0FBd0JYLEdBQXhCLENBQTRCLEVBQUMsU0FBUSxLQUFULEVBQTVCLEVBQTZDbUIsSUFBN0M7QUFDQTNDLFVBQUUsSUFBRixFQUFRd0IsR0FBUixDQUFZbkIsS0FBS0csSUFBakI7QUFDQVIsVUFBRSxJQUFGLEVBQVEwQyxRQUFSLENBQWlCLEtBQWpCLEVBQXdCbEIsR0FBeEIsQ0FBNEIsRUFBQyxTQUFRbkIsS0FBS0csSUFBTCxDQUFVaUIsS0FBbkIsRUFBeUIsVUFBU3BCLEtBQUtHLElBQUwsQ0FBVWtCLE1BQTVDLEVBQTVCO0FBQ0FyQixhQUFLUyxNQUFMLEdBQWNLLFdBQVcsWUFBVTtBQUNqQ25CLFlBQUVFLENBQUYsRUFBS0ssSUFBTCxDQUFVLElBQVYsRUFBZ0I4QixHQUFoQixDQUFvQnJDLEVBQUUsSUFBRixFQUFPLElBQVAsQ0FBcEIsRUFBa0M0QyxPQUFsQyxDQUEwQyxHQUExQztBQUNELFNBRmEsRUFFWixHQUZZLENBQWQ7QUFHRCxPQTNCRDtBQTRCRDtBQXZGZSxHQUFsQjtBQXlGRixTQUFPM0MsS0FBUDtBQUNELENBL0ZEIiwiZmlsZSI6ImhvbWUvanMvYWxidW0tZjM0NTgxZjEyNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5kZWZpbmUoWydqcXVlcnknXSxmdW5jdGlvbigkKXtcclxuXHJcbiAgICBmdW5jdGlvbiBhbGJ1bShvKXtcclxuICAgICAgdGhpcy5pbnQobylcclxuICAgIH07XHJcbiAgICBhbGJ1bS5wcm90b3R5cGUgPSB7XHJcbiAgICAgIGludDogZnVuY3Rpb24obyl7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYUltZyA9ICQobykuZmluZCgnaW1nJyk7XHJcbiAgICAgICAgdGhpcy5fY3NzID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlMb2FkID0gMDtcclxuICAgICAgICB0aGlzLnpvb20gPSAxLjE7XHJcbiAgICAgICAgdGhpcy5pPTA7XHJcbiAgICAgICAgdGhpcy5vayA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYUVtID0gJChvKS5maW5kKCdlbScpO1xyXG4gICAgICAgIHRoaXMudExheWVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmFJbWcuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgJCh0aGlzKS5sb2FkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHRoYXQuaUxvYWQrKztcclxuICAgICAgICAgICAgaWYodGhhdC5pTG9hZD09dGhhdC5hSW1nLmxlbmd0aCYmIXRoYXQub2spe1xyXG4gICAgICAgICAgICAgIHRoYXQucG9zKG8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGlmKCF0aGF0Lm9rKXt0aGF0LnBvcyhvKTt9XHJcbiAgICAgICAgfSwyMDAwKTtcclxuICAgICAgfSxcclxuICAgICAgcG9zOmZ1bmN0aW9uKG8pe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGF0Lm9rID0gdHJ1ZTtcclxuICAgICAgICAkKCdhJywkKG8pKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICB2YXIgb1AgPSAkKHRoaXMpLnBhcmVudCgpO1xyXG4gICAgICAgICAgdmFyIG9TID0gJCh0aGlzKS5zaWJsaW5ncygnLkFsYnVtX2luZm8nKTtcclxuICAgICAgICAgIG9QLmNzcyh7J3dpZHRoJzokKCdpbWcnLHRoaXMpLndpZHRoKCksJ2hlaWdodCc6JCgnaW1nJyx0aGlzKS5oZWlnaHQoKX0pXHJcbiAgICAgICAgICAkKHRoaXMpLmNzcyh7J3RvcCc6b1AucG9zaXRpb24oKS50b3AsJ2xlZnQnOm9QLnBvc2l0aW9uKCkubGVmdH0pO1xyXG4gICAgICAgICAgJCgnZW0nLHRoaXMpLmNzcyh7J2hlaWdodCc6b1AuaGVpZ2h0KCksJ2ZpbHRlcic6ICdhbHBoYShvcGFjaXR5PTUwKSd9KTtcclxuICAgICAgICAgIGlmKCQobykud2lkdGgoKS1vUC5wb3NpdGlvbigpLmxlZnQ+PSQodGhpcykud2lkdGgoKSozKXtcclxuICAgICAgICAgICAgb1MuY3NzKHsnaGVpZ2h0JzpNYXRoLnJvdW5kKCQodGhpcykuaGVpZ2h0KCkqdGhhdC56b29tKSs0LCdsZWZ0JzpvUC5wb3NpdGlvbigpLmxlZnQtMiwncmlnaHQnOidhdXRvJywncGFkZGluZy1sZWZ0JzpNYXRoLnJvdW5kKCQodGhpcykud2lkdGgoKSp0aGF0Lnpvb20pfSlcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBvUy5jc3MoeydoZWlnaHQnOiQodGhpcykuaGVpZ2h0KCkqdGhhdC56b29tKzQsJ3JpZ2h0JzokKG8pLndpZHRoKCktb1AucG9zaXRpb24oKS5sZWZ0LSQodGhpcykud2lkdGgoKS0yLCdsZWZ0JzonYXV0bycsJ3BhZGRpbmctcmlnaHQnOk1hdGgucm91bmQoJCh0aGlzKS53aWR0aCgpKnRoYXQuem9vbSksJ3RleHQtYWxpZ24nOidyaWdodCd9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYob1AucG9zaXRpb24oKS50b3A+PU1hdGgucm91bmQoJCh0aGlzKS5oZWlnaHQoKSoodGhhdC56b29tLTEpLzIpJiYkKG8pLmhlaWdodCgpLW9QLnBvc2l0aW9uKCkudG9wLSQodGhpcykuaGVpZ2h0KCk+PU1hdGgucm91bmQoJCh0aGlzKS5oZWlnaHQoKSoodGhhdC56b29tLTEpLzIpKXtcclxuICAgICAgICAgICAgb1MuY3NzKCd0b3AnLG9QLnBvc2l0aW9uKCkudG9wLU1hdGgucm91bmQoJCh0aGlzKS5oZWlnaHQoKSoodGhhdC56b29tLTEpLzIpLTIpXHJcbiAgICAgICAgICB9ZWxzZSBpZihvUC5wb3NpdGlvbigpLnRvcDxNYXRoLnJvdW5kKCQodGhpcykuaGVpZ2h0KCkqKHRoYXQuem9vbS0xKS8yKSl7XHJcbiAgICAgICAgICAgIG9TLmNzcygndG9wJywkKHRoaXMpLnBhcmVudCgpLnBvc2l0aW9uKCkudG9wLTIpXHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgb1MuY3NzKCd0b3AnLCQodGhpcykucGFyZW50KCkucG9zaXRpb24oKS50b3AtTWF0aC5yb3VuZCgkKHRoaXMpLmhlaWdodCgpKih0aGF0Lnpvb20tMSkrMikpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zaG93SW1nKG8pXHJcbiAgICAgIH0sXHJcbiAgICAgIHNob3dJbWc6IGZ1bmN0aW9uKG8pe1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICAkKCdsaScsJChvKSkuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgJCgnYScsdGhpcykuY3NzKHsndmlzaWJpbGl0eSc6J3Zpc2libGUnLCdkaXNwbGF5Jzonbm9uZSd9KS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAkKG8pLmNzcyh7J2JhY2tncm91bmQnOidub25lJ30pO1xyXG4gICAgICAgICAgdGhhdC5ob3ZlcihvKTtcclxuICAgICAgICB9LDEwMDApXHJcbiAgICAgIH0sXHJcbiAgICAgIGhvdmVyOiBmdW5jdGlvbihvKXtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgJCgnYScsJChvKSkuaG92ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHZhciBvUCA9ICQodGhpcykucGFyZW50KCk7XHJcbiAgICAgICAgICB2YXIgb1MgPSAkKHRoaXMpLnNpYmxpbmdzKCcuQWxidW1faW5mbycpO1xyXG4gICAgICAgICAgJCgnZW0nLHRoaXMpLmhpZGUoKTtcclxuICAgICAgICAgIGlmKHRoYXQudExheWVyKXtjbGVhclRpbWVvdXQodGhhdC50TGF5ZXIpO3RoYXQudExheWVyID0gbnVsbH1cclxuICAgICAgICAgICQobykuZmluZCgnZW0nKS5ub3QoJCgnZW0nLHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCEkKHRoaXMpLmlzKCc6dmlzaWJsZScpKXtcclxuICAgICAgICAgICAgICAkKHRoaXMpLmZhZGVJbigyMDApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgb1Muc2hvdygpLmFuaW1hdGUoe3dpZHRoOiQodGhpcykud2lkdGgoKSozLU1hdGgucm91bmQoJCh0aGlzKS53aWR0aCgpKnRoYXQuem9vbSkrN30sMzAwKTtcclxuICAgICAgICAgIHRoYXQuX2NzcyA9IHsndG9wJzpvUC5wb3NpdGlvbigpLnRvcCwnei1pbmRleCc6JCh0aGlzKS5jc3MoJ3otaW5kZXgnKSwnd2lkdGgnOiQodGhpcykud2lkdGgoKSwnaGVpZ2h0JzokKHRoaXMpLmhlaWdodCgpLCdsZWZ0JzokKHRoaXMpLmNzcygnbGVmdCcpLCdyaWdodCc6JCh0aGlzKS5jc3MoJ3JpZ2h0Jyl9O1xyXG4gICAgICAgICAgaWYoJChvKS53aWR0aCgpLW9QLnBvc2l0aW9uKCkubGVmdD49JCh0aGlzKS53aWR0aCgpKjMpe1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNzcyh7J3JpZ2h0JzonYXV0bycsJ2xlZnQnOnBhcnNlSW50KG9TLmNzcygnbGVmdCcpKSsyfSlcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNzcyh7J3JpZ2h0JzpwYXJzZUludChvUy5jc3MoJ3JpZ2h0JykpKzIsJ2xlZnQnOidhdXRvJ30pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkKHRoaXMpLmNzcyh7J3RvcCc6cGFyc2VJbnQob1MuY3NzKCd0b3AnKSkrMiwnd2lkdGgnOiQodGhpcykud2lkdGgoKSp0aGF0Lnpvb20sJ2hlaWdodCc6JCh0aGlzKS5oZWlnaHQoKSp0aGF0Lnpvb20sJ3otaW5kZXgnOiQodGhpcykuY3NzKCd6LWluZGV4JykrMTAwfSlcclxuICAgICAgICAgICQodGhpcykuY2hpbGRyZW4oJ2ltZycpLmNzcyh7J3dpZHRoJzokKHRoaXMpLndpZHRoKCksJ2hlaWdodCc6JCh0aGlzKS5oZWlnaHQoKX0pXHJcblxyXG4gICAgICAgIH0sZnVuY3Rpb24oKXtcclxuICAgICAgICAgICQoJy5BbGJ1bV9pbmZvJykuaGlkZSgpLmNzcyh7J3dpZHRoJzonMHB4J30pLnN0b3AoKTtcclxuICAgICAgICAgICQodGhpcykuY3NzKHRoYXQuX2Nzcyk7XHJcbiAgICAgICAgICAkKHRoaXMpLmNoaWxkcmVuKCdpbWcnKS5jc3Moeyd3aWR0aCc6dGhhdC5fY3NzLndpZHRoLCdoZWlnaHQnOnRoYXQuX2Nzcy5oZWlnaHR9KVxyXG4gICAgICAgICAgdGhhdC50TGF5ZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQobykuZmluZCgnZW0nKS5ub3QoJCgnZW0nLHRoaXMpKS5mYWRlT3V0KDIwMClcclxuICAgICAgICAgIH0sMjAwKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICByZXR1cm4gYWxidW07XHJcbn0pIl19
