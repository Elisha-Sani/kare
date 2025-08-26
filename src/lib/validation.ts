// Input validation utilities for forms and API endpoints

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateEventRequest = (data: {
  firstName: string;
  lastName: string;
  email: string;
  eventType: string;
  details?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required field validations
  if (!data.firstName?.trim()) {
    errors.push({ field: "firstName", message: "First name is required" });
  }

  if (!data.lastName?.trim()) {
    errors.push({ field: "lastName", message: "Last name is required" });
  }

  if (!data.email?.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address",
    });
  }

  if (!data.eventType?.trim()) {
    errors.push({ field: "eventType", message: "Event type is required" });
  }

  // Length validations
  if (data.firstName && data.firstName.length > 50) {
    errors.push({
      field: "firstName",
      message: "First name must be less than 50 characters",
    });
  }

  if (data.lastName && data.lastName.length > 50) {
    errors.push({
      field: "lastName",
      message: "Last name must be less than 50 characters",
    });
  }

  if (data.eventType && data.eventType.length > 100) {
    errors.push({
      field: "eventType",
      message: "Event type must be less than 100 characters",
    });
  }

  if (data.details && data.details.length > 1000) {
    errors.push({
      field: "details",
      message: "Message must be less than 1000 characters",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTestimonial = (data: {
  name: string;
  email: string;
  comment: string;
  rating: number;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  // Required field validations
  if (!data.name?.trim()) {
    errors.push({ field: "name", message: "Name is required" });
  }

  if (!data.email?.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address",
    });
  }

  if (!data.comment?.trim()) {
    errors.push({ field: "comment", message: "Comment is required" });
  }

  // Length validations
  if (data.name && data.name.length > 100) {
    errors.push({
      field: "name",
      message: "Name must be less than 100 characters",
    });
  }

  if (data.comment && data.comment.length > 500) {
    errors.push({
      field: "comment",
      message: "Comment must be less than 500 characters",
    });
  }

  // Rating validation
  if (data.rating < 1 || data.rating > 5) {
    errors.push({ field: "rating", message: "Rating must be between 1 and 5" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAdminLogin = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.email?.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(data.email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address",
    });
  }

  if (!data.password?.trim()) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Sanitize user input to prevent XSS
export const sanitizeString = (input: string): string => {
  if (!input) return "";

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .slice(0, 1000); // Limit length
};

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
};
