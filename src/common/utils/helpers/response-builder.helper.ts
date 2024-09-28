export interface ResponseBuilderBody<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export const success = <T>(
  data: T,
  message?: string,
): ResponseBuilderBody<T> => {
  return {
    success: true,
    data,
    message,
  };
};

export const error = <T>(data: T, message?: string): ResponseBuilderBody<T> => {
  return {
    success: false,
    data,
    message,
  };
};
