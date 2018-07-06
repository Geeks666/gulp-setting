# 指南

## 引用
1. jPlayer/css/jplayer.blue.monday.css
2. jPlayer/js/jquery.jplayer.min.js 
3. filePreview.js 

## 依赖环境

1. jquery
2. idoc可访问的网络环境

## 初始化

> 
   
    filePreview.init(obj, previewUrl, fileType,callback);
    
### 参数说明

- obj:jquery对象
- previewUrl:预览地址
- fileType:文件类型
- (可选)callback：回调函数

### 获取文件类型范例函数

> 
    function getFileType (fileext) {   //fileext:文件后缀名
	    switch (fileext) {
		    case 'png':
		    case 'jpg':
		    case 'bmp':
		    case 'gif':
		    case 'tif':
			return 'images';
		    case 'pdf':
		    case 'doc':
		    case 'docx':
		    case 'xls':
		    case 'xlsx':
		    case 'docx':
		    case 'ppt':
		    case 'pptx':
		    case 'txt':
			    return 'doc';
		    case "mp4":
			    return "video";
		    case "mp3":
			    return "audio";
		    default:
			    return 'else';
	    }
    };
    
    
## 样式调整

* 根据页面的需求调整filePreview.init函数下相关设定css宽高的代码即可

    


    


