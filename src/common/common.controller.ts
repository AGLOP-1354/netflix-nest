import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('common')
export class CommonController {
  @Post('video')
  @UseInterceptors(
    FileInterceptor('video', {
      limits: {
        fileSize: 20000000,
      },
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'video/mp4') {
          return callback(
            new BadRequestException('Only mp4 files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  createVideo(@UploadedFile() video: Express.Multer.File) {
    console.log(video);
    return {
      fileName: video.filename,
    };
  }
}
