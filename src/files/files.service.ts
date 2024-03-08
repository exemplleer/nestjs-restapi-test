import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  private static readonly MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
  private static readonly ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
  private static readonly UPLOAD_DIRECTORY = path.resolve(
    __dirname,
    '..',
    'static',
  );

  private validateFile(file: any): void {
    const extname = path.extname(file.originalname);
    const size = file.buffer.length;

    if (size > FilesService.MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds the limit of 4MB`);
    }

    if (!FilesService.ALLOWED_EXTENSIONS.includes(extname)) {
      throw new BadRequestException(
        `File type "${extname}" is not supported. Supported types: ${FilesService.ALLOWED_EXTENSIONS.join(', ')}`,
      );
    }
  }

  async createFile(file): Promise<string> | null {
    this.validateFile(file);
    try {
      const extname = path.extname(file.originalname) || '.auto.jpeg';
      const filename = `${uuid.v4()}${extname}`;
      const uploadDirectory = FilesService.UPLOAD_DIRECTORY;
      const isUploadDirectoryExists = await fs.exists(uploadDirectory);

      if (!isUploadDirectoryExists) {
        await fs.mkdir(uploadDirectory, { recursive: true });
      }

      await fs.writeFile(path.join(uploadDirectory, filename), file.buffer);

      return filename;
    } catch (e) {
      console.log(Logger.error(`Create file error: ${e}`));
      return null;
    }
  }

  async updateFile(filename, file): Promise<string> | null {
    this.validateFile(file);
    const uploadDirectory = FilesService.UPLOAD_DIRECTORY;
    try {
      let fname = filename;
      if (!fname) {
        fname = await this.createFile(file);
      }
      await fs.access(path.resolve(uploadDirectory, fname));
      await fs.writeFile(path.resolve(uploadDirectory, fname), file.buffer);
      return fname;
    } catch (e) {
      console.log(Logger.error(`Update file error: ${e}`));
      return null;
    }
  }

  async deleteFile(filename): Promise<boolean> {
    if (!filename) return true;
    try {
      const filepath = path.resolve(FilesService.UPLOAD_DIRECTORY, filename);
      await fs.access(filepath);
      await fs.unlink(filepath);
      return true;
    } catch (e) {
      console.log(Logger.error(`Delete file error: ${e}`));
      return false;
    }
  }
}
