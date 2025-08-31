export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

export function mapValidationErrors(messages: string[]): ApiError[] {
  return messages.map((msg) => ({ message: msg }));
}
