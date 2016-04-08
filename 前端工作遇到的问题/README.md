# accumulation
==============
  问题：设置字体图标位置时有时设计出的svg 和字体放一起位置会发生偏移 ？
  解答： 将图标符号被i标签包围，在i标签中设置display：float 可以避免受inline-height影响；display：inline-height:设置为inline-block后，该对象仍然是内联对象，但其中的内容会变成块级，从而高宽设置会有效
  问题： 什么时候absolute以视窗为框架
  解答： 在它的父级或祖先dom没有设置position：relative的时候
  问题： 当使用redux时，redux内部的state变化了，而组件不发生相应变化
  解答：  React-Redux does a lot of work to make sure that a component's mapStateToProps function only runs when it absolutely has to
  问题： yield + promise是如何实现异步的
  回答： yiled 后跟一个值，如果是promise，调用返回的值得value里的zhen里填入generator里的zhen函数进行回调。
  问题： UC屏蔽广告，特别是下载APP链接，当你把链接写在a标签内，UC会删除，当你把跳转写在js内，它会在跳转那不生效，不继续执行跳转那条语句后的js
  回答： 原先放这种屏蔽是写个随机的类，然而它现在可以根据你的链接判定你这个是否会去下载APP，所以原先的方式失效啦，现在比较好的方式是把跳转的js语句放入setTimeout的函数内，使这条语句触发不是在触碰事件回调发生的（原先做Android开发时，就知道如何监听webview点击触发事件，然后去屏蔽），跳转下载app链接后端别返回网页，直接一个302跳转iTunes或者下载页面，这样就不会导致用户点不下载，而页面已经跳转到别的页面的问题。
  问题： webpack当我在一个入口文件require另一个入口文件，它会报[Error: a dependency to an entry point is not allowed](https://github.com/webpack/webpack/issues/300)
  回答： 这与他生成chunk文件有关，如果能让你这样做的话就会导致a require b，b又require a，反复的相互require
  问题： retina屏幕，追求的设计会要求1各像素的border，如何实现？
  回答： 前人有很多总结比如：[前端头条](http://top.css88.com/archives/722),[百度fex](http://efe.baidu.com/blog/1px-on-retina/)。总结来说就是设置背景图为图片，设背景为渐变，1px伪元素缩小一倍，设置border-shadow，缩放viewport。然而这些方法都存在些缺陷，一是无法设置圆角，二是性能有问题，三是中间居中的dom有一px偏差。所以最简单无脑又实现最好的方法是把你要做的那dom放大一倍做，然后用transform缩小一倍。
  问题： 301，302，303，307之间的区别
  回答： 301是永久跳转，302，303，307是临时跳转，302在http1.1协议时拆分为303和307[301，302，303，307跳转](http://www.169it.com/article/3218595448.html)
  问题： 一个node进程如何充分利用cpu资源，并使资源与任务解耦
  回答： 常规的后端做法，生成一个进程池，在这个进程池中放入和cpu同样个数的进程数，维护这个进程池master进程每几秒向进程池中的变量发送心跳包，死掉的进程重新fork放入进程池，给进程池内的进程通过process.send发送任务
  问题： 如何实现前后端同构
  回答： 这是react提出的一种理念，可以使用[webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools）,react还提出在外层实现一个数据处理容器使展示和数据处理分离，就如同redux样，从父元素传递信息给子元素。