import { Body, Controller, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Scopes } from '../auth/scopes.decorator';

@Controller('echo')
export class EchoController {
  @Post()
  @Scopes('write')
  echo(@Body() body: unknown) {
    return { id: randomUUID(), received: body };
  }
}
