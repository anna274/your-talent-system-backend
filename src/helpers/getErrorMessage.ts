const ERRORS_MAP = {
  'login must be unique': 'Такой логин уже существует'
}

export const getErrorMessage = (e) => {
  return ERRORS_MAP[e.errors[0].message] || 'Упс, ошибка сервера. Обратитесь в службу поддержки.'
}