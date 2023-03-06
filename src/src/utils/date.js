import dayjs from "dayjs";

const DATE_FORMAT_UI_DAYJS = "DD MMM YYYY";

export function formatDateUi(date) {
  return dayjs.utc(date).format(DATE_FORMAT_UI_DAYJS);
}
