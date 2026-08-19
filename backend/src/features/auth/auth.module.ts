import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { SessionOrmEntity } from './data/orm/session.orm-entity';
import { TypeOrmSessionRepository } from './data/typeorm-session.repository';
import { SESSION_REPOSITORY } from './domain/session.repository';
import { BcryptPasswordHasher } from './data/bcrypt-password-hasher';
import { PASSWORD_HASHER } from './domain/password-hasher';
import { JwtTokenGenerator } from './data/jwt-token-generator';
import { TOKEN_GENERATOR } from './domain/token-generator';
import { AuthService } from './presentation/auth.service';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([SessionOrmEntity]),
        JwtModule.register({}),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [
        { provide: SESSION_REPOSITORY, useClass: TypeOrmSessionRepository },
        { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
        { provide: TOKEN_GENERATOR, useClass: JwtTokenGenerator },
        AuthService,
        JwtStrategy,
    ],
})
export class AuthModule {}