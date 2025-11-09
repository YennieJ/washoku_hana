import type {
  EmailTemplateType,
  EmailTemplate,
  EmailTemplateData,
} from '@/types/email-templates';
import { createAwaitingDepositTemplate } from './awaiting-deposit';
import { createCancelledTemplate } from './cancelled';
import { createConfirmedTemplate } from './confirmed';
import { createCustomTemplate } from './custom';
import { createDeclinedTemplate } from './declined';
import { createDefaultTemplate } from './default';
import { createPendingUpdateTemplate } from './pending-update';

export function getEmailTemplate(
  type: EmailTemplateType,
  data: EmailTemplateData
): EmailTemplate {
  switch (type) {
    case 'AWAITING_DEPOSIT':
      return createAwaitingDepositTemplate(data);
    case 'CONFIRMED':
      return createConfirmedTemplate(data);
    case 'PENDING_UPDATE':
      return createPendingUpdateTemplate(data);
    case 'CANCELLED':
      return createCancelledTemplate(data);
    case 'DECLINED':
      return createDeclinedTemplate(data);
    case 'CUSTOM':
      return createCustomTemplate(data);
    default:
      return createDefaultTemplate(data);
  }
}
