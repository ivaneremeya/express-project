import { body } from 'express-validator';

export const registerValidator = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Неверная длинна пароля').isLength({ min: 5 }),
  body('fullName', 'Слишком коротко').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватар').optional().isURL(),
];
export const loginValidator = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Неверная длинна пароля').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
