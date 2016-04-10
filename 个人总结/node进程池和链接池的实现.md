1. node的进程池
    由于node为单线程的所以在多任务，大量cpu计算的情况下，我们需要利用cluster来做进程池
        1. 设置并启动进程池
        
            ```javascript
                //集群执行work.js
                cluster.setupMaster({
                    exec: path.resolve(__dirname, './worker.js'),
                    silent :  true
                });
            ```
        
       在worker.js做进程的初始化，为后期父进程发送监听和分配任务做准备,例如：
           
           ```javascript
               process
                   .on('message', msgHandler)
                   .on('uncaughtException', function(err) {
                       log.error('worker crashed with error', err);
                   });
           ```
       我们在msghandler接收从父进程发送来的命令，然后执行相应的代码。
       对于进程池我们还可以使用两个linux命令进行简单优化：
       @see http://www.searchtb.com/2012/12/%E7%8E%A9%E8%BD%ACcpu-topology.html
       绑定单进程在一个cpu上
       
           ```javascript 
              var cp = require('child_process');
              var worker = cluster.fork();
              var p = worker.process;
              cp.spawn('taskset', ['-cp', cpu, p.pid]);
           ```
           
       在大量使用内存的情况下,取消cpu cache绑定单一cpu
       
           ```javascript
              var cp = require('child_process');
              cp.exec("numactl --interleave=all");
           ```
       小内存的访问可以使用
           ```javascript
              var cp =require('child_process');
              cp.exec("numactl --interleave=all");
           ```
        2. 心跳包
          虽然父进程可以通过pm2守护进程，但子进程无法保障，我们可以通过每10秒，父进程向子进程发送信息，子进程发挥心跳包，如果没发会，杀死子进程，重创新的子进程放入进程池。
       
           ```javascript
                   var workers = cluster.workers;
                    _.each(workers, function(worker, id) {
                    var cpu = worker.process.cpu;
                    var now = Date.now();
                    var beatTime = worker.beatTime || now;
                    var pid = worker.process.pid;
            
                    if(now - beatTime > 10000 && cpuWorkerIdMap[cpu] !== undefined) {
                        log.error('worker:%d pid:%d has no response in 10s, kill it.', cpu, pid);
                        worker.kill();
                    }
                   });
            
                   cluster.on('exit', function(worker, code, signal) {
                       var p = worker.process;
                       var cpu = p.cpu;
                       logger.error('worker:%d pid:%d died suicide:%s',
                          worker.id, p.pid, worker.suicide);
                       delete cpuWorkerIdMap[cpu];
                       addWorker(cpu);
                      });
           ```

