import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/createBuyer.dto';
import { UpdateBuyerDto } from './dto/updateBuyer.dto';
import { buildPath } from '../common/helpers/helper';
import { Buyer } from '@prisma/client';
import {
  editFileName,
  imageFileFilter,
} from '../common/file-upload/file.upload';
import { S3Service } from '../s3/s3.service';

@ApiTags('Buyer')
@Controller('Buyer')
export class BuyerController {
  constructor(
    private readonly buyerService: BuyerService,
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @ApiOkResponse({ type: CreateBuyerDto })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createBuyer(
    @Req() req: Request,
    @Body() buyerData: CreateBuyerDto,
    @Res() res: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateBuyerDto> {
    if (file) {
      const filePath = buildPath(file.filename, 'buyer');
      await this.s3Service.uploadPhoto(file, filePath);
      buyerData.avatar = filePath;
    }
    return res
      .status(HttpStatus.CREATED)
      .json(await this.buyerService.createBuyer(buyerData));
  }

  @ApiOperation({ summary: 'Update the buyer' })
  @ApiParam({ name: 'idBuyer', required: true })
  @Patch('/:idBuyer')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateBuyer(
    @Param('idBuyer') idBuyer: string,
    @Body() buyerData: UpdateBuyerDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Buyer> {
    if (file) {
      const filePath = buildPath(file.filename, 'buyer');
      await this.s3Service.uploadPhoto(file, filePath);
      buyerData.avatar = filePath;
    }
    return this.buyerService.updateBuyer(idBuyer, buyerData);
  }

  @ApiOperation({ summary: 'Get buyer by ID' })
  @ApiParam({ name: 'idBuyer', type: 'string', description: 'Buyer ID' })
  @Get('/:idBuyer')
  async getBuyerById(
    @Req() req: Request,
    @Res() res: any,
    @Param('idBuyer') idBuyer: string,
  ): Promise<Buyer> {
    return res
      .status(HttpStatus.OK)
      .json(await this.buyerService.getBuyerById(idBuyer));
  }

  @ApiOperation({ summary: 'Find a buyer by name' })
  @ApiParam({ name: 'firstName', required: true })
  @Get('/:firstName')
  async getBuyerByFirstName(
    @Req() req: Request,
    @Res() res: any,
    @Param('firstName') firstName: string,
  ): Promise<Buyer> {
    try {
      const buyer = await this.buyerService.getBuyerByFirstName(firstName);
      return res.status(HttpStatus.OK).json(buyer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Get a list of buyers' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  async getBuyerList(@Req() reg: Request, @Res() res: any): Promise<Buyer[]> {
    return res
      .status(HttpStatus.OK)
      .json(await this.buyerService.getBuyerList());
  }

  @ApiOperation({ summary: 'Remove buyer' })
  @ApiParam({ name: 'idBuyer', required: true })
  @Delete('/:idBuyer')
  async deleteBuyer(
    @Param('idBuyer') idBuyer: string,
    @Res() res: any,
  ): Promise<void> {
    await this.buyerService.deleteBuyer(idBuyer);
    res.sendStatus(HttpStatus.OK);
  }
}
