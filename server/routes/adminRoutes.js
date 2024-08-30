import express from 'express';
import multer from 'multer';
import { importUsersFromCSV } from '../utils/csvImporter.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer to save files in the 'uploads' directory

// Admin route to import users via CSV
router.post('/import-users', upload.single('file'), async (req, res) => {
  try {
    const message = await importUsersFromCSV(req.file.path);
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
