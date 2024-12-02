import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../model/User.js';

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({
        message: 'пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      res.status(404).json({
        message: 'не верный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secter123',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userDate } = user._doc;
    res.json({ ...userDate, token });
  } catch {
    res.status(404).json({
      message: 'не удалось авторизоваться',
    });
  }
};
export const register = async (req, res) => {
  try {
    const passwords = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const Hash = await bcrypt.hash(passwords, salt);

    const doc = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: Hash,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secter123',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userDate } = user._doc;
    res.json({ ...userDate, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userDate } = user._doc;
    return res.json(userDate);
  } catch (err) {
    console.log(err);
  }
};
