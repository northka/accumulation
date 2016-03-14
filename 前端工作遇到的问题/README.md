# accumulation
==============
  问题：设置字体图标位置时有时设计出的svg 和字体放一起位置会发生偏移 ？
  解答： 将图标符号被i标签包围，在i标签中设置display：float 可以避免受inline-height影响；display：inline-height:设置为inline-block后，该对象仍然是内联对象，但其中的内容会变成块级，从而高宽设置会有效
  
