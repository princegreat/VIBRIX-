import { Controller, Get, Req } from '@nestjs/common';
import { Scopes } from './scopes.decorator';

@Controller('whoami')
export class WhoAmIController {
  @Get()
  @Scopes('read')
  whoami(@Req() req: { apiScopes?: string[] }) {
    return { authenticated: true, scopes: req.apiScopes ?? [] };
  }
}
