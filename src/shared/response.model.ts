export class ResponseModel<T> {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: T,
  ) {}
}
