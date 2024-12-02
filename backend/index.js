import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import {
  registerValidator,
  postCreateValidation,
  loginValidator,
} from './validations/validations.js';
import { handleValidationErrors, checAuth } from './util/index.js';
import { PostController, UseController } from './controller/index.js';

mongoose
  .connect(
    'mongodb+srv://admin:228228@cluster0.rtvq4s1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then(() => {
    console.log('DB OK');
  })
  .catch((err) => {
    console.log('err', err);
  });
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const port = 3000;
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello111 World!');
});

app.post('/upload', checAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/auth/login', loginValidator, handleValidationErrors, UseController.login);
app.get('/auth/me', checAuth, UseController.getMe);
app.post('/auth/register', registerValidator, handleValidationErrors, UseController.register);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);

app.get('/posts/:id', PostController.getOne);
app.post('/posts', checAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`Example app listening on pnmport ${port}`);
});
