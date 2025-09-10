import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function filenameFactory(req: unknown, file: Express.Multer.File, cb: Function) {
  const safe = file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
  const uniq = `${Date.now()}-${Math.round(Math.random() * 1e9)}`; // corrigido
  cb(null, `${uniq}${extname(safe)}`);
}

@Controller('api/uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads',
      filename: filenameFactory,
    }),
  }))
  upload(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }
}