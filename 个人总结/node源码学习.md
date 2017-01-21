# node源码学习

## 入口函数
node的入口文件为src/node_main.cc,先判断操作系统,如果是windows 就执行wmain函数,linux就执行main函数.wmain将node输入参数转换成utf-8 然后执行node::Start函数,main函数直接将主程序的stdout和stderr输出关闭,然后也是执行node::Start函数

## Start函数
首先注册终止函数(即main执行结束后调用的函数), 然后是处理各平台的各种信号,例如自定义信号,ctrl+c的信号.然后设置V8的参数,再是看系统是否支持openssl.接着初始化V8的`Platform`(管理`isolate`),并绑定V8跟踪代理.,然后用libuv开始执行进程<br>
初始一个Isolate,并且把Buffer的初始化函数放入Params参数中
```C
  Isolate::CreateParams params;
  ArrayBufferAllocator allocator;
  params.array_buffer_allocator = &allocator;
#ifdef NODE_ENABLE_VTUNE_PROFILING
  params.code_event_handler = vTune::GetVtuneCodeEventHandler();
#endif

  Isolate* const isolate = Isolate::New(params);
```
接着是绑定Isolate的各种信号和错误退出的函数,然后进入isolate的互斥区,执行以下函数在isolate内
```c
 {
    Locker locker(isolate); //一定要locker住isolate才能开始执行,isolate只允许一个线程在其中执行
    Isolate::Scope isolate_scope(isolate);
    HandleScope handle_scope(isolate); //handleScope就是管理handle的,当v8::local没有handle指向它时,就说明它可以被回收啦
    IsolateData isolate_data(isolate, event_loop, allocator.zero_fill_field());
    exit_code = Start(isolate, &isolate_data, argc, argv, exec_argc, exec_argv);
  }
```
**Start**函数执行完后就会执行**isolate->Dispose()**销毁isolate.接着继续讲这个Start函数作用,
在Start函数内会创建一个`Context`,这个其实很像最外层的作用域,接着初始化一个Environment(还未去看里面的代码).
然后就是不断执行libuv的default loop啦,直到结束
```c
 {
    SealHandleScope seal(isolate);
    bool more;
    do {
      v8_platform.PumpMessageLoop(isolate);
      more = uv_run(env.event_loop(), UV_RUN_ONCE);

      if (more == false) {
        v8_platform.PumpMessageLoop(isolate);
        EmitBeforeExit(&env);

        // Emit `beforeExit` if the loop became alive either after emitting
        // event, or after running some callbacks.
        more = uv_loop_alive(env.event_loop());
        if (uv_run(env.event_loop(), UV_RUN_NOWAIT) != 0)
          more = true;
      }
    } while (more == true);
  }
```