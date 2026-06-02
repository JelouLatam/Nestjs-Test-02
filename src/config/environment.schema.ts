import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

export class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsString()
    @IsNotEmpty()
    DB_HOST: string;

    @IsNumber()
    DB_PORT: number;

    @IsString()
    @IsNotEmpty()
    DB_USERNAME: string;

    @IsString()
    DB_PASSWORD?: string;

    @IsString()
    @IsNotEmpty()
    DB_DATABASE: string;
}