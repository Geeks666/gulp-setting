[TOC]
### 平台数据监控
* 所有页面共用一个css `main.css`
* `sass/_*.scss` 不编译，供 `main.scss` 引用
* `view` 该目录存放公共的 `ejs` 模块，`view/_*.ejs` 不编译，供其他 `ejs` 文件引用
* `js/common.js` 该文件处理页面的跳转，角色权限的控制，控件的事件注册
* `js/module_detail.js` 该文件处理所有 `数据明细` 页面
* 请求接口的url后统一添加参数 `errorDomId`，当接口请求错误时，统一处理， 该参数为希望展示错误信息的元素的ID，而不一定是该接口渲染图表的元素ID

### 关于角色的权限
* 市管理员 `city`
* 区县管理员 `county`
* 学校管理员 `school`

### 关于不同角色元素的显示和隐藏
* 隐藏所有角色独有的元素
    * 元素类名 `role-` 开头的都会隐藏，这些元素被认为是不同管理员所独有的
* 显示该角色独有的元素
    * 元素类名包含 `role-county` 的都会显示（假设当前为 `区县管理员`）
    
### 控件——单选框radio
#### dom结构
```html
<div class="radio" data-value="collection">
  <div class="item-wrap active" data-value="collection">
    <span class="icon icon-radio"></span>
    <span class="item">收藏量</span>
  </div>
  <div class="item-wrap" data-value="downloads">
    <span class="icon icon-radio"></span>
    <span class="item">下载量</span>
  </div>
</div>
```
#### 注册 `radioChange` 事件
```javascript
$('body').on('click', '.radio .item-wrap', function () {
  $(this).parents('.radio').find('.item-wrap').removeClass('active');
  $(this).addClass('active');
  $(this).parent().attr('data-value', $(this).attr('data-value'));
  $(this).parent().trigger('radioChange');
});
```
#### 监听 `radioChange` 事件
```javascript
$('body').on('radioChange', '.radio', function () {
  var value = $(this).attr('data-value');
  // code here
});
// 默认触发一次 `radioChange` 事件
$('.radio').trigger('radioChange');
```

### 控件——tab切换
#### dom结构
```html
<ul class="tab ulli-wrap" data-value="num">
  <li class="ulli liAct" data-value="num">按使用人数排名</li>
  <li class="ulli" data-value="rank">按使用次数排名</li>
</ul>
```
#### 注册 `tabChange` 事件
```javascript
$('body').on('click', '.tab .ulli', function () {
  $(this).siblings().removeClass('liAct');
  $(this).addClass('liAct');
  $(this).parent().attr('data-value', $(this).attr('data-value'));
  $(this).parent().trigger('tabChange');
});
```
#### 监听 `tabChange` 事件
```javascript
$('body').on('tabChange', '.tab', function () {
  var value = $(this).attr('data-value');
  // code here
});
```

### 控件——下拉框
#### dom结构
```html
<div class="selectWrap">
  <div class="label">统计时段：</div>
  <div class="selectTop selectTopAct">
    <span>昨天</span>
    <strong></strong>
  </div>
  <div class="selectBottom">
    <ol>
      <li data-value="yesterday">昨天</li>
      <li data-value="lastseven">最近七天</li>
      <li data-value="lastthirty">最近30天</li>
    </ol>
  </div>
</div>
```
#### 监听 `selectChange` 事件
```javascript
// todo selectChange 绑定到 selectWrap 上更合适
$('body').on('selectChange', '.selectTop', function () {
  var value = $(this).attr('data-value');
  // code here
});
```
