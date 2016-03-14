##JavaScript 的作用域和上下文对象this##

 - ###从几个有意思的js问题开始###

    1. **为什么输出的不是f2？**
      `var scope = 'top';
        var f1 = function() { 
            console.log(scope);
        };
        f1(); // 输出 top
        var f2 = function() { 
            var scope = 'f2'; 
            f1();
        };
         f2(); // 输出 top`
    2. **我还能访问closure，但this值改变**
      `function closure(arg){
         var a ="closure";
         console.log(a);//(1) closure
         console.log(this);//(2) obj对象
           return function(){
                console.log(a);//(4) closure
                console.log(arg); // (5) arg
                console.log(this);//(6) windowd对象
                }
           }
       var obj ={
        func:closure
          }
       function func () {
        setTimeout(obj.func("arg"),100);
        console.log("funcEnd");// (3)funcEnd
          }
       func()`
    3. **this会被绑定在某个对象上**
      `var b = "window.b"
       var funcFactory = function(){
        var b ="func.b";
        var obj ={
            a:"obj.a",
            func:function(){
              console.log(b)
              console.log(this.a);
            }
          }
        return obj;
       }
       var temp =funcFactory()
          var func = temp.func;
          temp.func();// 先出现 func.b 后出现obj.a
          func();// 先出现func.b 后出现 undefined`
   4.**函数执行完了，this绑定在window上**
      `function func(){
        var a=1;
        setTimeout(function(){
          console.log(a)
        },100);
        }
        func();// 1`

*******

 - ###深度理解js静态作用域###
  1. **js静态作用域**
 
    - 在第一段代码中很多人会理所当然的认为会打印出f2来，会说f2是个function，js是个以function为作用域划分，然而事情往往事与愿违---最后打印出的是出乎意料的top。人人都知道js在执行之前会进行预处理（V8处理js还会先把它编程字节码），很多人只知道在预处理的时候会出现var变量的提升（es6的let就不会啦）和function一等公民的预先处理。然而却忽略了作用域的处理--- 函数作用域的嵌套关系是定义时决定的,而不是调用时决定的,也就 是说,JavaScript 的作用域是静态作用域,又叫词法作用域,这是因为作用域的嵌套关系可 以在语法分析时确定,而不必等到运行时确定。  
  2. **this与作用域的谁在变化**
    - 首先让我们来理解下<a href="https://en.wikipedia.org/wiki/Scope_(computer_science)">scope的概念</a>---一段程序代码中所用到的名字并不总是有效/可用的，而限定这个名字的可用性的代码范围就是这个名字的作用域。在网上总是有什么前端面试题问setTimeout或者setInterval里面的变量为什么会改变，给出的答案永远是千篇一律的作用域发生了变化，然而我们从第一段代码中我们就知道js是一个在语法分析时作用域就已经确定了的。那到底是什么发生了变化了呢？是this（学名**上下文对象**），this这个值在js中是很诡异的，等我有时间专门要拿出来讲一讲，this这个值是会在运行时动态的发生变化的，比如call，apply，bind。至于setTimeout和setInterval一对兄弟，我想再分享一段代码来解释下
    ```
     function func(){
      var a=1;
      setTimeout(function(){
        console.log(a)
      },100);
      while（true）{
        a=2;
      }
    }
    func();
    ```
  四段代码中你可以看见1，但在这段代码中你永远也不会再控制台上发现1       的影子，因为只要没执行完func这个函数，js永远不会去事件队列里面查询是否有事件发生。同时js的变量回收也是在执行完一个函数后才执行的。
  3. **this和作用域的汇总介绍**
   - 第三段代码的汇总使用啦，temp会从function中发挥obj对象，在我们调用temp.func的时候，this值会被绑定在obj这个对象上，显示console.log（b）,因为b是从作用域中拿到的，所以在语法分析时就已经给设定好啦，所以在控制台上打印出“func.b”,在调用this.a时，因为this被运行时绑定在obj对象上，所以会直接在obj上找（如果对象没有可以继续向上找原形链），当变量func去得到obj.func时，他只得到的是函数（不带包含它的对象），this自动会绑在window上，所以只能打印出b来（在语法分析时就已经注定了访问哪个变量），所以在window上找不到a这个属性，就导致了undefined的出现。

-----
- ###总结###

  1. 总而言之，作用域在语法分析时就已经处理完啦，JavaScript 的作用域是静态作用域，在运行时只是this（**上下文对象**）在一直发生变化。也就是一个在运行前就完成划分（词法作用域Lexical Scope），一个是在运行中改变（类似于动态作用域Dynamic Scope），严格意义上说JavaScript只是词法作用域。
  2. js只有function来划分作用域。this的改变方式就大概有三种,第一种call，apply，bind方法（有点类似于c++的组合型配接器）this会被绑定在第一个参数对象，第二种事件方法，setTimeout和setInterval会被绑定在全局对象上，像点击事件之类的会被绑定在dom对象上，第三种obj.func访问对象里的function会被绑定在最里面的对象上，例如obj1.obj2.obj3.func会绑定在obj3上（有人会说function里面也可以写this的属性，对呀function也是继承自Object的呀，它自己本身就带上下文对象的）
  3. 作用域可以访问嵌套它的作用域值，而this是按着原形链去访问它父级对象，注意啦就如上例obj1.obj2.obj3.func，obj3虽然是obj2的属性，但不是继承于obj2的，它继承是通过它prototype属性来继承的，所以在obj3.func中this并不会去访问obj2的属性

*****
- ###后记###
    不希望以后有人会拿以上代码来面试或以以上代码去面试企业，这些知识知道就好了，实战能力和对业务的把控才是程序猿技术的关键。

[1]（http://www.cnblogs.com/bennman/archive/2013/09/08/3309024.html）