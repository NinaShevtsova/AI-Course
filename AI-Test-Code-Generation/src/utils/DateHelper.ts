
export class DateHelper {
  static formatLocalDate(date?: Date, locale = 'en-GB'): string {
    if (!date) {
      return '';
    }
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
