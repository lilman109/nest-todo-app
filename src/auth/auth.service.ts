import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { AuthenticatedUser, JwtPayload } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService, // JWTサービスをインジェクト
    ) {}

    async register(registerDto: RegisterDto): Promise<{ access_token: string; user: { id: number; email: string } }> {
        const existingUser = await this.prismaService.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

        const newUser = await this.prismaService.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
            },
        });

        const payload = { email: newUser.email, sub: newUser.id };
        const access_token = this.jwtService.sign(payload); // JWTトークンを生成
        return {
            access_token,
            user: {
                id: newUser.id,
                email: newUser.email,
            },
        };
    }

    async login(loginDto: LoginDto): Promise<{ access_token: string; user: { id: number; email: string } }> {
        const user = await this.prismaService.user.findUnique({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { email: user.email, sub: user.id };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }

    async validateUser(jwtPayload: JwtPayload): Promise<AuthenticatedUser> {
        const user = await this.prismaService.user.findUnique({
            where: { id: jwtPayload.sub },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
}