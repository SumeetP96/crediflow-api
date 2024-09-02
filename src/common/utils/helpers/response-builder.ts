export interface ResponseBuilderBody {
  success: boolean;
  data: unknown;
  message?: string;
}

export const success = (
  data: unknown,
  message?: string,
): ResponseBuilderBody => {
  return {
    success: true,
    data,
    message,
  };
};

export const error = (data: unknown, message?: string): ResponseBuilderBody => {
  return {
    success: false,
    data,
    message,
  };
};
