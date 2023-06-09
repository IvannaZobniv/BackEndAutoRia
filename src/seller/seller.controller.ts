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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { buildPath } from '../common/helpers/helper';
import UpdateCarDto from '../car/updateCar.dto';
import { SellerService } from './seller.service';
import {
  editFileName,
  imageFileFilter,
} from '../common/file-upload/file.upload';
import CreateCarDto from '../car/createCar.dto';
import { S3Service } from '../s3/s3.service';
import { diskStorage } from 'multer';
import { Car, Seller } from '@prisma/client';
import UpdateSellerDto from './dto/updateSeller.dto';
import CreateSellerDto from './dto/createSeller.dto';
@ApiTags('Seller')
@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    @Inject(forwardRef(() => S3Service))
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: 'Create a new seller' })
  @ApiOkResponse({ type: CreateSellerDto })
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
  async createSeller(
    @Req() req: Request,
    @Body() sellerData: CreateSellerDto,
    @Res() res: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateSellerDto> {
    if (file) {
      const filePath = buildPath(file.filename, 'seller');
      await this.s3Service.uploadPhoto(file, filePath);
      sellerData.avatar = filePath;
    }
    return res
      .status(HttpStatus.CREATED)
      .json(await this.sellerService.createSeller(sellerData));
  }

  @ApiOperation({ summary: 'Update a seller' })
  @ApiParam({ name: 'idSeller', required: true })
  @Patch('/:idSeller')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateSeller(
    @Param('idSeller') idSeller: string,
    @Body() sellerData: UpdateSellerDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Seller> {
    if (file) {
      const filePath = buildPath(file.filename, 'seller');
      await this.s3Service.uploadPhoto(file, filePath);
      sellerData.avatar = filePath;
    }
    return this.sellerService.updateSeller(idSeller, sellerData);
  }

  @ApiOperation({ summary: 'Get seller by ID' })
  @ApiParam({ name: 'idSeller', type: 'string', description: 'Seller ID' })
  @Get('/:idSeller')
  async getSellerById(
    @Req() req: Request,
    @Res() res: any,
    @Param('idSeller') idSeller: string,
  ): Promise<Seller> {
    return res
      .status(HttpStatus.OK)
      .json(await this.sellerService.getSellerById(idSeller));
  }

  @ApiOperation({ summary: 'Find a seller by name' })
  @ApiParam({ name: 'firstName', required: true })
  @Get('/:firstName')
  async getSellerByFirstName(
    @Req() req: Request,
    @Res() res: any,
    @Param('firstName') firstName: string,
  ): Promise<Seller> {
    try {
      const seller = await this.sellerService.getSellerByName(firstName);
      return res.status(HttpStatus.OK).json(seller);
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

  @ApiOperation({ summary: 'Get a list of sellers' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  async getSellerList(@Req() reg: Request, @Res() res: any): Promise<Seller[]> {
    return res
      .status(HttpStatus.OK)
      .json(await this.sellerService.getSellerList());
  }

  @ApiOperation({ summary: 'Remove seller' })
  @ApiParam({ name: 'idSeller', required: true })
  @Delete('/:idSeller')
  async deleteSeller(
    @Param('idSeller') idSeller: string,
    @Res() res: any,
  ): Promise<void> {
    await this.sellerService.deleteSeller(idSeller);
    res.sendStatus(HttpStatus.OK);
  }

  @ApiOperation({ summary: 'Creation of a new car by the seller' })
  @ApiCreatedResponse({ type: CreateCarDto })
  @Post('/:idSeller/car')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 8 }], {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const filePath = buildPath(file.originalname, 'cars');
          cb(null, filePath);
        },
      }),
    }),
  )
  async createCar(
    @Req() req: Request,
    @Param('idSeller') idSeller: string,
    @Body() carData: CreateCarDto,
    @Res() res: any,
    @UploadedFile() files: { image?: Express.Multer.File[] },
  ): Promise<CreateCarDto> {
    if (files?.image) {
      const uploadedFile = files.image[0];
      const filePath = buildPath(uploadedFile.originalname, 'cars');
      await this.s3Service.uploadPhoto(uploadedFile, 'cars');
      carData.image = filePath;
    }

    const createdCar = await this.sellerService.createCar(idSeller, carData);

    return res.status(HttpStatus.CREATED).json(createdCar);
  }

  @ApiOperation({ summary: 'Update of the car by the seller' })
  @ApiParam({ name: 'idSeller', type: 'string', description: 'Seller ID' })
  @Patch('/:idSeller/car/:idCar')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'image', maxCount: 8 }], {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const filePath = buildPath(file.originalname, 'cars');
          cb(null, filePath);
        },
      }),
    }),
  )
  async updateCar(
    @Param('idSeller') idSeller: string,
    @Param('idCar') idCar: string,
    @Body() carData: UpdateCarDto,
    @UploadedFile() files: { image?: Express.Multer.File[] },
  ): Promise<CreateCarDto> {
    if (files?.image) {
      const uploadedFile = files.image[0];
      const filePath = buildPath(uploadedFile.originalname, 'cars');
      await this.s3Service.uploadPhoto(uploadedFile, 'cars');
      carData.image = filePath;
    }
    return this.sellerService.updateCar(idSeller, idCar, carData);
  }

  @ApiOperation({ summary: 'Get the whole car by the seller' })
  @ApiParam({ name: 'idSeller', type: 'string', description: 'Seller ID' })
  @Get('/:idSeller/car')
  async getCars(
    @Req() req: Request,
    @Res() res: any,
    @Param('idSeller') idSeller: string,
  ): Promise<Car[]> {
    return res
      .status(HttpStatus.OK)
      .json(await this.sellerService.getCars(idSeller));
  }

  @ApiOperation({ summary: 'Get the car by the seller' })
  @ApiParam({ name: 'idSeller', type: 'string', description: 'Seller ID' })
  @Get('/:idSeller/car/:idCar')
  async getCar(
    @Req() req: Request,
    @Res() res: any,
    @Param('idSeller') idSeller: string,
    @Param('idCar') idCar: string,
  ): Promise<Car> {
    return res
      .status(HttpStatus.OK)
      .json(await this.sellerService.getCar(idSeller, idCar));
  }

  @ApiOperation({ summary: 'Removal of the car by the seller' })
  @ApiParam({ name: 'idSeller', type: 'string', description: 'Seller ID' })
  @ApiParam({ name: 'idCar', type: 'string', description: 'Car ID' })
  @Delete('/:idSeller/car/:idCar')
  async deleteCar(
    @Param('idSeller') idSeller: string,
    @Param('idCar') idCar: string,
    @Res() res: any,
  ): Promise<void> {
    await this.sellerService.deleteCar(idSeller, idCar);
    res.sendStatus(HttpStatus.OK);
  }
}
