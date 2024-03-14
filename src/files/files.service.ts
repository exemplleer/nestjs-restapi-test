import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  private readonly MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
  private readonly ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
  private readonly UPLOAD_DIRECTORY = path.resolve(__dirname, '..', 'static');

  private validateFile(file: Express.Multer.File): void {
    const extname = path.extname(file.originalname).toLowerCase();
    const size = file.buffer.length;

    if (size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds the limit of 4MB`);
    }

    if (!this.ALLOWED_EXTENSIONS.includes(extname)) {
      throw new BadRequestException(
        `File type "${extname}" is not supported. Supported types: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
      );
    }
  }

  async createFile(file: Express.Multer.File): Promise<string> | null {
    this.validateFile(file);
    try {
      const extname = path.extname(file.originalname) || '.auto.jpeg';
      const filename = `${uuid.v4()}${extname}`;
      const filepath = path.join(this.UPLOAD_DIRECTORY, filename);

      await fs.ensureDir(this.UPLOAD_DIRECTORY);
      await fs.writeFile(filepath, file.buffer);
      return filename;
    } catch (e) {
      console.log(Logger.error(`Create file error: ${e}`));
      return null;
    }
  }

  async updateFile(
    filename: string | null,
    file: Express.Multer.File,
  ): Promise<string> | null {
    this.validateFile(file);
    try {
      let fname = filename;
      if (!fname) fname = await this.createFile(file);
      const filepath = path.join(this.UPLOAD_DIRECTORY, fname);
      await fs.access(filepath);
      await fs.writeFile(filepath, file.buffer);
      return fname;
    } catch (e) {
      console.log(Logger.error(`Update file error: ${e}`));
      return null;
    }
  }

  async deleteFile(filename: string): Promise<boolean> {
    if (!filename) return true;
    try {
      const filepath = path.join(this.UPLOAD_DIRECTORY, filename);
      await fs.access(filepath);
      await fs.unlink(filepath);
      return true;
    } catch (e) {
      console.log(Logger.error(`Delete file error: ${e}`));
      return false;
    }
  }
}
