import { ApiError } from './api-error.model';
export interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  details?: ApiError[];
  timestamp?: string;
  path?: string;
}
