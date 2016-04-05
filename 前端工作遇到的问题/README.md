# accumulation
==============
  问题：设置字体图标位置时有时设计出的svg 和字体放一起位置会发生偏移 ？
  解答： 将图标符号被i标签包围，在i标签中设置display：float 可以避免受inline-height影响；display：inline-height:设置为inline-block后，该对象仍然是内联对象，但其中的内容会变成块级，从而高宽设置会有效
  问题：什么时候absolute以视窗为框架
  解答： 在它的父级或祖先dom没有设置position：relative的时候
  问题： 当使用redux时，redux内部的state变化了，而组件不发生相应变化
  解答：  React-Redux does a lot of work to make sure that a component's mapStateToProps function only runs when it absolutely has to