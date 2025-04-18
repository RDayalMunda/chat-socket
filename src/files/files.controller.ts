import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, join(__dirname, '..', '..', process.env.UPLOADS_LOCATION as string));
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          // const ext = extname(file.originalname); // not required for now !!
          const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `${uniqueSuffix}-${sanitized}`;
          callback(null, filename);
        },
      }),
    }),
  )
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      message: 'Files uploaded & saved',
      files: files,
    };
  }
}
