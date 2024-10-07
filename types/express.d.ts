import { Request } from 'express'; // Import the original Request type

declare global {
  namespace Express {
    interface Request {
      file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
      };
      files?: Array<{
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
      }>;
    }
  }
}

// Ensure this file is treated as a module
export {}