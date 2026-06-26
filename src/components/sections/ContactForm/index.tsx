'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const createContactSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('form.validation.nameRequired')),
    email: z
      .string()
      .min(1, t('form.validation.emailRequired'))
      .email(t('form.validation.emailInvalid')),
    phone: z.string().optional(),
    company: z.string().optional(),
    subject: z.string().min(1, t('form.validation.subjectRequired')),
    message: z
      .string()
      .min(1, t('form.validation.messageRequired'))
      .min(10, t('form.validation.messageMinLength')),
  });

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('contact');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const schema = createContactSchema((key) => t(key as Parameters<typeof t>[0]));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed');

      setSubmitState('success');
      reset();
    } catch {
      setSubmitState('error');
    }
  };

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full bg-transparent border-b py-3 px-0',
      'font-body text-sm text-dark placeholder-muted',
      'focus:outline-none transition-colors duration-300',
      hasError
        ? 'border-red-400 focus:border-red-400'
        : 'border-border-light focus:border-gold'
    );

  if (submitState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="w-12 h-12 text-gold mb-4" aria-hidden="true" />
        <h3 className="font-display text-2xl font-normal text-dark mb-2">
          {t('form.success.title')}
        </h3>
        <p className="font-body text-muted">{t('form.success.description')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <h2 className="font-display text-2xl font-normal text-dark">{t('form.title')}</h2>

      {submitState === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200" role="alert">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />
          <p className="font-body text-sm text-red-700">{t('form.error.description')}</p>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className="sr-only">{t('form.fields.name.label')}</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t('form.fields.name.placeholder')}
            className={inputClass(!!errors.name)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 font-body text-xs text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="sr-only">{t('form.fields.email.label')}</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t('form.fields.email.placeholder')}
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 font-body text-xs text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="phone" className="sr-only">{t('form.fields.phone.label')}</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t('form.fields.phone.placeholder')}
            className={inputClass(false)}
            {...register('phone')}
          />
        </div>
        <div>
          <label htmlFor="company" className="sr-only">{t('form.fields.company.label')}</label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder={t('form.fields.company.placeholder')}
            className={inputClass(false)}
            {...register('company')}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="sr-only">{t('form.fields.subject.label')}</label>
        <input
          id="subject"
          type="text"
          placeholder={t('form.fields.subject.placeholder')}
          className={inputClass(!!errors.subject)}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          {...register('subject')}
        />
        {errors.subject && (
          <p id="subject-error" className="mt-1 font-body text-xs text-red-500" role="alert">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="sr-only">{t('form.fields.message.label')}</label>
        <textarea
          id="message"
          rows={5}
          placeholder={t('form.fields.message.placeholder')}
          className={cn(inputClass(!!errors.message), 'resize-none')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 font-body text-xs text-red-500" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={submitState === 'loading'}
        className="w-full sm:w-auto"
      >
        {submitState === 'loading' ? t('form.sending') : t('form.submit')}
      </Button>
    </form>
  );
}
