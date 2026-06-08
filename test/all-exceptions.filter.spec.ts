import { AllExceptionsFilter } from '../src/shared/filters/all-exceptions.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { ApiError } from '../src/shared/models/api-error.model';
import { HttpExceptionResponse } from '../src/shared/models/http-exception-response.model';
import { winstonLogger } from '../src/shared/utils/winston.logger';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    mockRequest = {
      method: 'GET',
      url: '/test',
    } as Partial<Request>;
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
    jest.spyOn(winstonLogger, 'error').mockImplementation(jest.fn());
  });

  it('should log error with winstonLogger', () => {
    const exception = new Error('Log error');
    const spy = jest.spyOn(winstonLogger, 'error');
    filter.catch(exception, mockHost);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('[GET] /test'),
      expect.objectContaining({
        method: 'GET',
        url: '/test',
        statusCode: 500,
        message: 'Log error',
        errors: [{ message: 'Log error' }],
      }),
    );
  });

  it('should handle HttpExceptionResponse with details', () => {
    const details: ApiError[] = [
      { message: 'Field error', field: 'title', code: 'ERR_FIELD' },
    ];
    const response: HttpExceptionResponse = {
      statusCode: 400,
      message: 'Validation failed',
      error: 'Bad Request',
      details,
    };
    const exception = new HttpException(response, 400);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Bad Request',
      }),
    );
  });

  it('should handle ThrottlerException', () => {
    const exception = new ThrottlerException();
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(exception.getStatus());
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: exception.getStatus(),
        message: exception.message,
        errors: [{ message: 'Too Many Requests' }],
      }),
    );
  });

  it('should handle HttpException with string response', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not Found',
      }),
    );
  });

  it('should handle HttpException with object response and array message', () => {
    const validationErrors = ['title must not be empty'];
    const exception = new HttpException(
      { error: 'Validation Error', message: validationErrors },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation Error',
        errors: expect.any(Array),
      }),
    );
  });

  it('should handle HttpException with object response and string message', () => {
    const exception = new HttpException(
      { error: 'Custom Error', message: 'Something went wrong' },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Custom Error',
        errors: [{ message: 'Something went wrong' }],
      }),
    );
  });

  it('should handle generic Error', () => {
    const exception = new Error('Generic error');
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Generic error',
        errors: [{ message: 'Generic error' }],
      }),
    );
  });

  it('should handle unknown exception', () => {
    filter.catch('unknown', mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
      }),
    );
  });

  it('should handle HttpException with object response and no valid message', () => {
    const exception = new HttpException(
      { error: 'Custom Error', message: undefined },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Custom Error',
      }),
    );
  });

  it('should handle HttpException with response not string or object', () => {
    const exception = new HttpException('12345', HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
      }),
    );
  });
});
