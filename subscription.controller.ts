import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}
  @Get()
  getSubscriptions() {
    return this.subscriptionService.getSubscriptions();
  }

  @Post('hook')
  stripeSubscriptionWebHook(@Body() body) {
    return this.subscriptionService.stripeSubscriptionWebHook(body);
  }
}
