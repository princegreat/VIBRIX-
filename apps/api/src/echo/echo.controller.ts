import { Body, Controller, Post } from '@nestjs/common';
import { Scopes } from '../auth/scopes.decorator';

@Controller('echo')
export class EchoController {
  @Post()
  @Scopes('write')
  echo(@Body() body: unknown) {
    return { received: body };
  }
}
