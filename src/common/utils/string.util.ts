// ============================================
// src/common/utils/string.util.ts
// ============================================
export class StringUtil {
  /**
   * Generate slug from string
   */
  static slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  /**
   * Capitalize first letter
   */
  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Capitalize all words
   */
  static capitalizeWords(text: string): string {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /**
   * Truncate string
   */
  static truncate(text: string, length: number, suffix: string = '...'): string {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + suffix;
  }

  /**
   * Remove HTML tags
   */
  static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Generate random string
   */
  static random(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Mask email
   */
  static maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
    return `${maskedName}@${domain}`;
  }

  /**
   * Mask phone number
   */
  static maskPhone(phone: string): string {
    return phone.replace(/\d(?=\d{4})/g, '*');
  }

  /**
   * Check if string is valid email
   */
  static isEmail(text: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  }

  /**
   * Check if string is valid URL
   */
  static isUrl(text: string): boolean {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  }
}