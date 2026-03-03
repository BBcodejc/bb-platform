'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail, Calendar, Target } from 'lucide-react';
import { Suspense } from 'react';
import { BBHeader } from '@/components/bb-header';
import { BBFooter } from '@/components/bb-footer';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'shooting';
  const name = searchParams.get('name') || '';

  const content = {
    shooting: {
      title: 'Application Received!',
      subtitle: `Thanks${name ? `, ${name}` : ''}! Your BB Shooting Evaluation application has been submitted.`,
      description:
        "We'll review your application and reach out within 24 hours with film submission instructions.",
      icon: Target,
      nextSteps: [
        { icon: Mail, text: 'Check your email for film submission instructions' },
        { icon: Calendar, text: 'Submit your videos within 48 hours for fastest turnaround' },
        { icon: Target, text: 'Your personalized BB Profile will be delivered within 3-5 business days' },
      ],
      cta: null,
    },
    'full-assessment': {
      title: 'Application Received!',
      subtitle: `Thanks${name ? `, ${name}` : ''}! We've received your BB Full Assessment application.`,
      description:
        "We'll review your submission and reach out within 48 hours to discuss next steps.",
      icon: CheckCircle,
      nextSteps: [
        { icon: Mail, text: 'Watch for an email from Jake (jake@trainwjc.com)' },
        { icon: Calendar, text: "We'll schedule a brief call to learn more about your game" },
        { icon: Target, text: "If it's a fit, we'll discuss the full assessment process" },
      ],
      cta: {
        text: 'Want to start with shooting?',
        link: '/start/shooting',
        label: 'Get BB Shooting Evaluation ($250)',
      },
    },
    coach: {
      title: 'Application Received!',
      subtitle: `Thanks${name ? `, ${name}` : ''}! We've received your Coach Certification application.`,
      description:
        "We're excited to potentially have you join the BB coaching network.",
      icon: CheckCircle,
      nextSteps: [
        { icon: Mail, text: 'Watch for an email from Jake (jake@trainwjc.com)' },
        { icon: Calendar, text: "We'll schedule a call to discuss your coaching background" },
        { icon: Target, text: "Learn about the BB certification process and what's involved" },
      ],
      cta: {
        text: 'Want to experience BB as a player first?',
        link: '/start/shooting',
        label: 'Get Your Own BB Evaluation ($250)',
      },
    },
    organization: {
      title: 'Inquiry Received!',
      subtitle: `Thanks${name ? `, ${name}` : ''}! We've received your organization inquiry.`,
      description:
        "We'll review your needs and reach out to discuss how BB can support your program.",
      icon: CheckCircle,
      nextSteps: [
        { icon: Mail, text: 'Watch for an email from Jake (jake@trainwjc.com)' },
        { icon: Calendar, text: "We'll schedule a discovery call to understand your program" },
        { icon: Target, text: "We'll prepare a customized proposal based on your needs" },
      ],
      cta: {
        text: 'Want to see BB in action first?',
        link: '/start/shooting',
        label: 'Get a Player Evaluation ($250)',
      },
    },
  };

  const currentContent = content[type as keyof typeof content] || content.shooting;
  const IconComponent = currentContent.icon;

  return (
    <>
      <div className="max-w-xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <IconComponent className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-barlow font-bold text-white mb-3">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            {currentContent.subtitle}
          </p>
          <p className="text-site-muted">
            {currentContent.description}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-site-card border border-site-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">What happens next:</h2>
          <div className="space-y-4">
            {currentContent.nextSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-site-gold/20 flex items-center justify-center flex-shrink-0">
                    <StepIcon className="w-5 h-5 text-site-gold" />
                  </div>
                  <p className="text-gray-300 pt-2">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA for non-shooting flows */}
        {currentContent.cta && (
          <div className="text-center p-6 bg-site-card border border-site-border rounded-xl mb-8">
            <p className="text-site-muted mb-4">{currentContent.cta.text}</p>
            <Link
              href={currentContent.cta.link}
              className="inline-flex items-center gap-2 border border-site-border text-white hover:bg-site-secondary px-5 py-2.5 rounded-lg transition-colors text-sm font-medium"
            >
              {currentContent.cta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Back to home */}
        <div className="text-center">
          <Link href="/" className="text-site-dim hover:text-white transition-colors text-sm">
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-site-primary font-dm-sans flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </main>
      }
    >
      <main className="min-h-screen bg-site-primary font-dm-sans">
        <BBHeader transparent={false} />
        <div className="pt-24">
          <ThankYouContent />
        </div>
        <BBFooter />
      </main>
    </Suspense>
  );
}
