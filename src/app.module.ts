import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios/dist';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { PassportWrapperModule } from './auth/passport-wrapper.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { BuyerService } from './buyer/buyer.service';
import { BuyerController } from './buyer/buyer.controller';
import { BuyerModule } from './buyer/buyer.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { CarshowroomController } from './carshowroom/carshowroom.controller';
import { CarshowroomService } from './carshowroom/carshowroom.service';
import { CarshowroomModule } from './carshowroom/carshowroom.module';
import { CarshowroomAdminModule } from './carshowroom-admin/carshowroom-admin.module';
import { CarshowroomAutomechanicModule } from './carshowroom-automechanic/carshowroom-automechanic.module';
import { CarshowroomManagerModule } from './carshowroom-manager/carshowroom-manager.module';
import { CarshowroomSalesModule } from './carshowroom-sales/carshowroom-sales.module';
import { CarshowroomServiceManagerModule } from './carshowroom-service-manager/carshowroom-service-manager.module';
import { CarshowroomServiceManagerController } from './carshowroom-service-manager/carshowroom-service-manager.controller';
import { CarshowroomSalesController } from './carshowroom-sales/carshowroom-sales.controller';
import { CarshowroomAdminController } from './carshowroom-admin/carshowroom-admin.controller';
import { CarshowroomManagerController } from './carshowroom-manager/carshowroom-manager.controller';
import { CarshowroomManagerService } from './carshowroom-manager/carshowroom-manager.service';
import { CarshowroomSalesService } from './carshowroom-sales/carshowroom-sales.service';
import { CarshowroomAdminService } from './carshowroom-admin/carshowroom-admin.service';
import { CarshowroomAutomechanicController } from './carshowroom-automechanic/carshowroom-automechanic.controller';
import { CarshowroomAutomechanicService } from './carshowroom-automechanic/carshowroom-automechanic.service';
import { CommonModule } from './common/common.module';
import { MailModule } from './common/mail/mail.module';
import { PrismaModule } from './common/orm/prisma.module';
import { MailService } from './common/mail/mail.service';
import { PrismaService } from './common/orm/prisma.service';
import { CurrencyModule } from './currency/currency.module';
import { ManagerService } from './manager/manager.service';
import { ManagerController } from './manager/manager.controller';
import { ManagerModule } from './manager/manager.module';
import { CurrencyService } from './currency/currency.service';
import { PasswordModule } from './password/password.module';
import { S3Service } from './s3/s3.service';
import { S3Controller } from './s3/s3.controller';
import { S3Module } from './s3/s3.module';
import { SellerPremiumModule } from './seller-premium/seller-premium.module';
import { PasswordController } from './password/password.controller';
import { SellerPremiumService } from './seller-premium/seller-premium.service';
import { SellerPremiumController } from './seller-premium/seller-premium.controller';
import { PasswordService } from './password/password.service';
import { SellerService } from './seller/seller.service';
import { SellerController } from './seller/seller.controller';
import { SellerModule } from './seller/seller.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AdminCarshowroomService } from './admin-carshowroom/admin-carshowroom.service';
import { AdminCarshowroomController } from './admin-carshowroom/admin-carshowroom.controller';
import { AdminCarshowroomModule } from './admin-carshowroom/admin-carshowroom.module';
import { AdminCarshowroomAdminModule } from './admin-carshowroom-admin/admin-carshowroom-admin.module';
import { AdminCarshowroomManagerModule } from './admin-carshowroom-manager/admin-carshowroom-manager.module';
import { AdminCarshowroomAutoMechanicController } from './admin-carshowroom-auto-mechanic/admin-carshowroom-auto-mechanic.controller';
import { AdminCarshowroomAutoMechanicService } from './admin-carshowroom-auto-mechanic/admin-carshowroom-auto-mechanic.service';
import { AdminCarshowroomAutoMechanicModule } from './admin-carshowroom-auto-mechanic/admin-carshowroom-auto-mechanic.module';
import { AdminCarshowroomSalesModule } from './admin-carshowroom-sales/admin-carshowroom-sales.module';
import { AdminCarshowroomServiceManagerController } from './admin-carshowroom-service-manager/admin-carshowroom-service-manager.controller';
import { AdminCarshowroomServiceManagerService } from './admin-carshowroom-service-manager/admin-carshowroom-service-manager.service';
import { AdminCarshowroomServiceManagerModule } from './admin-carshowroom-service-manager/admin-carshowroom-service-manager.module';
import { AdminBuyerModule } from './admin-buyer/admin-buyer.module';
import { AdminManagerController } from './admin-manager/admin-manager.controller';
import { AdminManagerService } from './admin-manager/admin-manager.service';
import { AdminManagerModule } from './admin-manager/admin-manager.module';
import { AdminSellerModule } from './admin-seller/admin-seller.module';
import { AdminSellerPremiumController } from './admin-seller-premium/admin-seller-premium.controller';
import { AdminSellerPremiumService } from './admin-seller-premium/admin-seller-premium.service';
import { AdminSellerPremiumModule } from './admin-seller-premium/admin-seller-premium.module';


@Module({
  imports: [
    AdminModule,
    AuthModule,
    BuyerModule,
    CarshowroomModule,
    CarshowroomAdminModule,
    CarshowroomManagerModule,
    CarshowroomAutomechanicModule,
    CarshowroomSalesModule,
    CarshowroomServiceManagerModule,
    CurrencyModule,
    HttpModule,
    MailModule,
    ManagerModule,
    PasswordModule,
    PassportWrapperModule,
    PrismaModule,
    S3Module,
    SellerModule,
    SellerPremiumModule,
    UserModule,
    CarshowroomAutomechanicModule,
    CommonModule,
    AdminCarshowroomModule,
    AdminCarshowroomAdminModule,
    AdminCarshowroomManagerModule,
    AdminCarshowroomAutoMechanicModule,
    AdminCarshowroomSalesModule,
    AdminCarshowroomServiceManagerModule,
    AdminBuyerModule,
    AdminManagerModule,
    AdminSellerModule,
    AdminSellerPremiumModule,


  ],
  controllers: [
    AppController,
    AdminController,
    AuthController,
    BuyerController,
    CarshowroomController,
    CarshowroomAdminController,
    CarshowroomManagerController,
    CarshowroomSalesController,
    CarshowroomAutomechanicController,
    CarshowroomServiceManagerController,
    ManagerController,
    PasswordController,
    S3Controller,
    SellerController,
    SellerPremiumController,
    AdminCarshowroomController,
    AdminCarshowroomAutoMechanicController,
    AdminCarshowroomServiceManagerController,
    AdminManagerController,
    AdminSellerPremiumController,

  ],
  providers: [
    AppService,
    AdminService,
    AuthService,
    BuyerService,
    JwtService,
    CarshowroomService,
    CarshowroomAdminService,
    CarshowroomManagerService,
    CarshowroomAutomechanicService,
    CarshowroomSalesService,
    CurrencyService,
    MailService,
    ManagerService,
    PasswordService,
    PrismaService,
    SellerService,
    SellerPremiumService,
    S3Service,
    UserService,
    AdminCarshowroomService,
    AdminCarshowroomAutoMechanicService,
    AdminCarshowroomServiceManagerService,
    AdminManagerService,
    AdminSellerPremiumService,

  ],
})
export class AppModule {}
