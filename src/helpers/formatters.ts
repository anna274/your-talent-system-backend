export const formatDate = (date = new Date()) =>
  new Intl.DateTimeFormat('ru', {}).format(new Date(date));
