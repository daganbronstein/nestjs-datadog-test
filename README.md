<h1>Installation</h1>
<hr>
<h2>RabbitMQ</h2>
You need to run a RabbitMQ server.

`docker run -d --name rabbit -p 15672:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -e RABBITMQ_DEFAULT_VHOST=local rabbitmq:3.8.7-management`

<h2>Environment</h2>
Run both the server and test with `NODE_ENV=test`. If you have
different configuration than what is in `.env.test`, then create
a new `.env.[..]` file and set `NODE_ENV=[..]` to whatever it
is, e.g. local.

<h2>Node.js</h2>
Node.js 16.10.0, with TypeScript4.5.4 and NPM.

<h1>Running</h1>
<hr>
To debug the Datadog Tracer, you will need to run a server,
and then run a test which will stimulate the server with some
message.

<h2>Server</h2>
Run the server with `npm run start`.

<h2>Test</h2>
To send a message to the server, run `npm run test`.
This message will not be acknowledged.

<h2>Debugging</h2>
Set a breakpoint on service.ts line 14, on the print.

There, you will be able to inspect the span.

Inside `span._spanContext._trace.started` is an array of 3 spans.

The first should be `amqp.command`, the second `gpevent.handle`,
the third `test.arbitrary`.

You will note that the spanID of `amqp.command` is the
`parentId` of `gpevent.handle` and `test.arbitrary`.

The expectation is that `gpevent.handle` will be the parent of
`test.arbitrary`. 

The explanation for why this bug happens is probably best explored,
as I mentioned in my email, in these two locations:

https://github.com/nestjs/nest/blob/master/packages/microservices/context/rpc-context-creator.ts#L58
https://github.com/nestjs/nest/blob/master/packages/core/interceptors/interceptors-consumer.ts#L13
