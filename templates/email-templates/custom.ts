import type { EmailTemplate, EmailTemplateData } from '@/types/email-templates';

export function createCustomTemplate(data: EmailTemplateData): EmailTemplate {
  // 일반 메일은 빈 템플릿
  return { subject: '', content: '' };
}
