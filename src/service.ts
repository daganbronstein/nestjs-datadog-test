import { EventEmitter } from 'events';
import { Controller, Module, UseInterceptors } from '@nestjs/common';
import { DatadogInterceptorDebug } from './datadog.interceptor';
import { EventPattern } from '@nestjs/microservices';
import tracer from 'dd-trace';

@Controller()
@UseInterceptors(DatadogInterceptorDebug)
export class ServiceController {

  @EventPattern('A')
  async endpointA() {
    return tracer.trace('test.arbitrary', {}, ((span, done) => {
      console.log('message received');
    }));
  }
}

@Module({
  imports: [

  ],
  controllers: [
      ServiceController,
  ],
  providers: [],
})
export class AppModule {}
