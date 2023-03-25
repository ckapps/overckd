import { createContextToken } from '@marblejs/core';
import { RxDatabase } from 'rxdb';

// ----------------------------------------------------------------------------
// Tokens
// ----------------------------------------------------------------------------
/**
 * DI token for database
 */
export const DbToken = createContextToken<RxDatabase>('DB');
