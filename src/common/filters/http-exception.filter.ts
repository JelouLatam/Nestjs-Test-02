import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();
            let message = 'Error';

            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res !== null) {
                // for ValidationPipe errors, res has message and error details
                // prefer message property or stringify
                message = (res as any).message || JSON.stringify(res);
            }

            response.status(status).json({
                status: 'error',
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
            return;
        }

        // Fallback for unknown errors
        // Log details when not in production to help debug
        try {
            if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.error('[ExceptionFilter] unhandled error:', exception);
            }
        } catch (_e) { }

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: 'error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
