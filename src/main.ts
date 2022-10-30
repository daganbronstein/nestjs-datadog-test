import './datadog-tracer'
import 'universal-dotenv/register';
import * as SourceMap from 'source-map-support';
import { NestFactory } from '@nestjs/core';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './service';

SourceMap.install();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            noAck: false,
            queue: 'test',
            queueOptions: { durable: true },
            urls: [process.env.AMQP_URL],
        } as ClientOptions,
    });
    await app.startAllMicroservicesAsync();
    console.log(`Starting.......`);
    await app.listen(process.env.SERVICE_PORT);
    console.log(`===> Datadog test service is up on ${process.env.SERVICE_PORT}`);
}
bootstrap();
