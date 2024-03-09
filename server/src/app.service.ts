import { Injectable } from '@nestjs/common';

const fs = require('fs').promises;

async function readJsonFile(filePath: string): Promise<any> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file from disk: ${filePath}`, err);
    throw err;
  }
}

async function readAndLogJsonFile(filePath: string): Promise<any> {
  try {
    const data = await readJsonFile(filePath);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    return await readAndLogJsonFile('./data/transactions.json');
  }
}
