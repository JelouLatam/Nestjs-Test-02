import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../../config/config.module';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AppConfigService } from '../../config/config.service';

@Module({
    imports: [
        AppConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (cfg: AppConfigService) => ({
                secret: cfg.jwtSecret,
                signOptions: { expiresIn: cfg.jwtExpiresIn },
            }),
        }),
    ],
    providers: [AuthService, UsersService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService, UsersService],
})
export class AuthModule { }
