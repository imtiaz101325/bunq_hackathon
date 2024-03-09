import fs from 'fs';
import util from 'util';

// // Define the model interface
// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// Convert fs.readFile into Promise version
const readFile = util.promisify(fs.readFile);

// Convert fs.writeFile into Promise version
const writeFile = util.promisify(fs.writeFile);

// Function to save data
export async function saveData<T>(data: T, filename: string): Promise<void> {
  try {
    await writeFile(filename, JSON.stringify(data));
    console.log(`Data saved to ${filename}`);
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// Function to load data
export async function loadData<T>(filename: string): Promise<T> {
  try {
    const data = await readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading data:', err);
    throw err;
  }
}

// // Usage:
// const user: User = {
//   id: 1,
//   name: 'John Doe',
//   email: 'john.doe@example.com',
// };

// saveData(user, 'user.json').then(() => {
//   loadData('user.json').then((data) => {
//     console.log(data);
//   });
// });
