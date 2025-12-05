// ============================================
// src/common/utils/date.util.ts
// ============================================
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateUtil {
  /**
   * Get current date
   */
  static now(): Date {
    return new Date();
  }

  /**
   * Add days to date
   */
  static addDays(date: Date, days: number): Date {
    return dayjs(date).add(days, 'day').toDate();
  }

  /**
   * Add hours to date
   */
  static addHours(date: Date, hours: number): Date {
    return dayjs(date).add(hours, 'hour').toDate();
  }

  /**
   * Add minutes to date
   */
  static addMinutes(date: Date, minutes: number): Date {
    return dayjs(date).add(minutes, 'minute').toDate();
  }

  /**
   * Format date
   */
  static format(date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return dayjs(date).format(format);
  }

  /**
   * Check if date is past
   */
  static isPast(date: Date): boolean {
    return dayjs(date).isBefore(dayjs());
  }

  /**
   * Check if date is future
   */
  static isFuture(date: Date): boolean {
    return dayjs(date).isAfter(dayjs());
  }

  /**
   * Get difference in days
   */
  static diffInDays(date1: Date, date2: Date): number {
    return dayjs(date1).diff(dayjs(date2), 'day');
  }

  /**
   * Convert to timezone
   */
  static toTimezone(date: Date, tz: string): Date {
    return dayjs(date).tz(tz).toDate();
  }

  /**
   * Start of day
   */
  static startOfDay(date: Date): Date {
    return dayjs(date).startOf('day').toDate();
  }

  /**
   * End of day
   */
  static endOfDay(date: Date): Date {
    return dayjs(date).endOf('day').toDate();
  }
}