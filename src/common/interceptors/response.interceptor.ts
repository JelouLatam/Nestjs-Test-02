import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map((data) => {
                // If the response code is 204 No Content, do not wrap
                const statusCode = response?.statusCode ?? HttpStatus.OK;
                if (statusCode === HttpStatus.NO_CONTENT) {
                    return null;
                }

                // If paginated shape, return items + meta
                if (data && typeof data === 'object' && 'items' in data && 'meta' in data) {
                    return { status: 'success', data: data.items, meta: data.meta };
                }

                return { status: 'success', data };
            }),
        );
    }
}
