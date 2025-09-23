class DatePipe implements PipeTransform {
  constructor(
    locale: string,
    defaultTimezone?: string | null | undefined,
    defaultOptions?: DatePipeConfig | null | undefined
  ): DatePipe;
  transform(
    value: string | number | Date,
    format?: string | undefined,
    timezone?: string | undefined,
    locale?: string | undefined
  ): string | null;
  transform(
    value: null | undefined,
    format?: string | undefined,
    timezone?: string | undefined,
    locale?: string | undefined
  ): null;
  transform(
    value: string | number | Date | null | undefined,
    format?: string | undefined,
    timezone?: string | undefined,
    locale?: string | undefined
  ): string | null;
}
