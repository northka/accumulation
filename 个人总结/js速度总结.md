## js一些执行速度总结
1.同类型数组操作快五到十倍左右(因为弱语言会对同类型做优化,可以减少装包拆包的时间)
2.forEach 速度会比for慢100倍
3.typeof a === 'undefined' 要比 a === undefiend慢八倍左右