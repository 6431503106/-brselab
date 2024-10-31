import csvParser from 'csv-parser';
import fs from 'fs';
import User from '../models/userModel.js';

export const importUsersFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const users = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        users.push({
          name: row.name,
          email: row.email,
          password: row.password, // Password should be hashed by User ($2a$10$gXHouNB7ejb9mu/BRhzQUOX5ALdQoJbwsyLNThCftTZ0hJkOg3yv2)123456
          isAdmin: row.isAdmin === 'true',
        });
      })
      .on('end', async () => {
        try {
          await User.insertMany(users);
          resolve('Users imported successfully');
        } catch (error) {
          reject(`Error importing users: ${error.message}`);
        } finally {
          fs.unlinkSync(filePath); // Clean up the uploaded file
        }
      })
      .on('error', (error) => {
        reject(`Error processing CSV file: ${error.message}`);
      });
  });
};
