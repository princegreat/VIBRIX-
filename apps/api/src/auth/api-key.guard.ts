import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SCOPES_KEY } from './scopes.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    const key = auth?.startsWith('Bearer ')
      ? auth.slice(7)
      : (req.headers['x-api-key'] as string | undefined);
    if (!key) throw new UnauthorizedException('Missing API key');

    const keys = this.config.get<Record<string, string[]>>('auth.apiKeys') ?? {};
    if (!Object.prototype.hasOwnProperty.call(keys, key)) {
      throw new UnauthorizedException('Invalid API key');
    }
    const granted = keys[key];
    if (!required.every((s) => granted.includes(s))) {
      throw new ForbiddenException('Insufficient scope');
    }
    req.apiScopes = granted;
    return true;
  }
}
