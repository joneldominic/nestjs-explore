import { Controller, Get } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    Sentry.captureMessage(
      '[New 9] Hello Better Stack, this is a test message from Node.js!',
    );
    return this.appService.getHello();
  }
}
