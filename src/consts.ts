const TOKEN_EXPIRES_IN = 14000; // 4 hours in seconds
const REFRESH_TOKEN_EXPIRES_IN = 86400; // 1 day in seconds
const AUTH_STRATEGY = 'auth';
const REFRESH_STRATEGY = 'refresh';

export { TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, AUTH_STRATEGY, REFRESH_STRATEGY };

export const INCORRECT_PASSWORD_ERROR = "Старый пароль введён не верно";
export const SERVER_ERROR = "Server error";

export const STATISTICS_TYPES = {
  TECHNOLOGIES_STATS: 'Востребованные технологии',
  SKILLS_STATS: 'Состояние компетенций',
}
