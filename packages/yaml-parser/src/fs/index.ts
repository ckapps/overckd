import * as fs from 'fs';
import { promisify } from 'util';

export const readFile = promisify(fs.readFile);
export const readDir = promisify(fs.readdir);
export const writeFile = promisify(fs.writeFile);
