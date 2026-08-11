import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../utils/upload.js';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getUserPosts
} from '../controllers/postController.js';

const router = express.Router();

// Validation rules for posts
const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('slug')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Slug must be between 1 and 100 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'draft'])
    .withMessage('Status must be active, inactive, or draft')
];

// Protected routes (require authentication)
router.get('/', authenticate, getPosts);
router.get('/user/me', authenticate, getUserPosts);
router.get('/:slug', authenticate, getPost);
router.post('/', authenticate, uploadSingle, postValidation, createPost);
router.put('/:id', authenticate, uploadSingle, postValidation, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;