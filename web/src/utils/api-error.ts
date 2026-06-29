/**
 * Handles API response errors consistently across the application
 * @param response - The fetch Response object
 * @param defaultMessage - Default error message if none is provided by the API
 * @throws Error with the API error message or default message
 */
export async function handleApiError(
  response: Response,
  defaultMessage: string
): Promise<never> {
  const errorData = await response.json().catch(() => ({}));
  const errorMessage = errorData.error?.message || errorData.error || defaultMessage;
  throw new Error(errorMessage);
}

/**
 * Safely extracts error message from unknown error types
 * @param error - The error object (could be Error, string, or unknown)
 * @param fallback - Fallback message if error can't be extracted
 * @returns The error message string
 */
export function getErrorMessage(error: unknown, fallback = 'Erro desconhecido'): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
}

/**
 * Type guard to check if error has a message property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}
