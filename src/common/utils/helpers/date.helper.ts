import DayJs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

DayJs.extend(customParseFormat);

export const dayjs = DayJs;
