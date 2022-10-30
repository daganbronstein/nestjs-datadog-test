import 'universal-dotenv/register';
import { Test } from '@nestjs/testing';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';


describe('Service Test', () => {
    let app;
    let clientProxy: ClientProxy;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ClientsModule.register([
                    {
                        name: 'TEST_SERVICE_RMQ',
                        transport: Transport.RMQ,
                        options: {
                            queue: 'test',
                            urls: [process.env.AMQP_URL],
                        },
                    },
                ]),
            ]
        }).compile();
        clientProxy = module.get<ClientProxy>('TEST_SERVICE_RMQ');
        app = module.createNestApplication();
        await app.init();
    });

    it('will insert message into queue: test', async () => {
        await new Promise((resolve, err) => setTimeout(resolve, 1000));
        clientProxy.emit('A', {})
    });
});
