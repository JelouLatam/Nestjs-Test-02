export interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  details?: any;
  timestamp?: string;
  path?: string;
}
