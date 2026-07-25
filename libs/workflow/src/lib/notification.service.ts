import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async notify(
    investorId: string,
    companyName: string,
    status: string,
  ): Promise<{
    success: boolean;
    sentAt: string;
    message: string;
  }> {
    const message = `Investment for "${companyName}" has been ${status}.`;

    // Mock notification (Email / SMS / Push)
    this.logger.log(`Notification sent to investor ${investorId}`);
    this.logger.log(message);

    return {
      success: true,
      sentAt: new Date().toISOString(),
      message,
    };
  }
}
