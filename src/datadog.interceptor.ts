import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import tracer, { Span, SpanContext } from 'dd-trace';

@Injectable()
export class DatadogInterceptorDebug implements NestInterceptor {
  constructor() {}

  intercept( context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType();
    const name = `${context.getClass().name}.${context.getHandler().name || (context.getHandler() as any).originalName}`;
    return tracer.trace('gpevent.handle', {resource: `${contextType} ${name}`}, ((span, done) => {
      return next
          .handle()
          .pipe(
              tap(done, done),
          );
    }));
  }
}
