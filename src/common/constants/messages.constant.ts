// ============================================
// src/common/constants/messages.constant.ts
// ============================================
export const MESSAGES = {
  // Success
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
  EMAIL_VERIFIED: 'Email verified successfully',
  
  // Errors
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'An internal error occurred',
  
  // User
  USER_NOT_FOUND: 'User not found',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  
  // Email
  EMAIL_SENT: 'Email sent successfully',
  EMAIL_FAILED: 'Failed to send email',
  INVALID_EMAIL: 'Invalid email address',
  
  // File
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
} as const;