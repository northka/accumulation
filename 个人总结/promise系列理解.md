#  promise 系列理解 #

------

1.  **JavaScript回调产生的原因**
    在别的语言里很少出现回调地狱的情况，在JavaScript中却经常碰见，第一是因为JavaScript的函数可以变成变量在函数之间传递（类似于c++里的类函数），同时这也导致函数的作用域之间的混乱，正如我在[作用域和this的理解](https://github.com/northka/accumulation/blob/master/%E4%B8%AA%E4%BA%BA%E6%80%BB%E7%BB%93/js%20%E4%BD%9C%E7%94%A8%E5%9F%9F%E5%92%8Cthis%E7%9A%84%E7%90%86%E8%A7%A3.md)所说的，作用域为静态，而函数却可以带着它原先的作用域到处运行，这是很危险的一种行为。第二是JavaScript运行的环境一般都是异步的，例如在浏览器和node中，都得去监听一个事件，然后把回调函数传给它，当要监听多个事件出现时，不同的事件发生关系会造成很多回调。

2.  **回调的危害**
   回调在复杂的情况下导致了两大危害，第一，当你函数里面套着函数时，就相当于作用域里面包含着其他作用域，而当你回调时，你的数据来源来自于你所在的作用域，当回调复杂时你只有通过空格缩进去判断函数所在作用域。
```javascript
 queryTheDatabase(query, function(error, result) { 
  request(url, function(error, response) {            //这个作用域的response在回调函数
    doSomethingElse(response, function(error, result) {
      doAnotherThing(result, function(error, result) {
        request(anotherUrl, function(error, response) {
          ...
        });
      });
    });
  });
});
```
   第二，一般回调复杂后，函数可能少则几百行多则几千行。这时，后面看代码的人根本无法快速理清代码逻辑，你也理不清是谁调用了谁。

3. **解决回调的方法**
   解决回调危害的第一点--作用域的嵌套。每个要调用的函数的作用域只放在它定义的地方，然后回调函数所需要的值由调用方return回来，然后以参数的形式给回调函数，使函数不再从作用域中获得值。解决回调危害第二点--回调复杂无法理清逻辑步骤。
```javascript
     promise(queryTheDatabase)
        .then(request)
        .then(doSomethingElse)
        .then(doAnotherThing)...
```
这样代码的逻辑步奏都一目了然

4. **promise**的实现方式
