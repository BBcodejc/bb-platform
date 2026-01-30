'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'shooting';
  const name = searchParams.get('name') || '';

  const content = {
    shooting: {
      title: 'Payment Received!',
      subtitle: `Thanks${name ? `, ${name}` : ''}! Your BB Shooting Evaluation is confirmed.`,
      description: 'You\'ll receive an email with instructions for submitting your shooting videos within the next few minutes.',
      icon: Target,
      nextSteps: [
        { icon: Mail, text: 'Check your email for video submission instructions' },
        { icon: Calendar, text: 'Submit your videos within 48 hours for fastest turnaround' },
        { icon: Target, text: 'Your personalized BB Profile will be delivered within 5 business days' },
      ],
      cta: null,
    },
    'full-assessment': {
      title: 'Application Received!',
      subtitle: `Thanks${name ? `, ${name}` : ''}! We\'ve received your BB Full Assessment application.`,
      description: 'We\'ll review your submission and reach out within 48 hours to discuss next steps.',
      icon: CheckCircle,
      nextSteps: [
        { icon: Mail, text: 'Watch for an email from jake@basketballbiomechanics.com' },
        { icon: Calendar, text: 'We\'ll schedule a brief call to learn more about your game' },
        { icon: Target, text: 'If it\'s a fit, we\'ll discuss the full assessment process' },
      ],
      cta: {
        text: 'Want to start with shooting?',
        link: '/start/shooting',
        label: 'Get BB Shooting Evaluation ($250)',
      },
    },
    coach: {
      title: 'Application Received!',
      subtitle: `Thanks${name ? `, ${name}` : ''}! We\'ve received your Coach Certification application.`,
      description: 'We\'re excited to potentially have you join the BB coaching network.',
      icon: CheckCircle,
      nextSteps: [
        { icon: Mail, text: 'Watch for an email from jake@basketballbiomechanics.com' },
        { icon: Calendar, text: 'We\'ll schedule a call to discuss your coaching background' },
        { icon: Target, text: 'Learn about the BB certification process and what\'s involved' },
      ],
      cta: {
        text: 'Want to experience BB as a player first?',
        link: '/start/shooting',
        label: 'Get Your Own BB Evaluation ($250)',
      },
    },
    organization: {
      title: 'Inquiry Received!',
      subtitle: `Thanks${name ? `, ${name}` : ''}! We\'ve received your organization inquiry.`,
      description: 'We\'ll review your needs and reach out to discuss how BB can support your program.',
      icon: CheckCircle,
      nextSteps: [
        { icon: Mail, text: 'Watch for an email from jake@basketballbiomechanics.com' },
        { icon: Calendar, text: 'We\'ll schedule a discovery call to understand your program' },
        { icon: Target, text: 'We\'ll prepare a customized proposal based on your needs' },
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
    <main className="min-h-screen bg-bb-black">
      {/* Header */}
      <header className="border-b border-bb-border bg-bb-dark/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-gold-500 font-bold tracking-wider text-sm">
            BASKETBALL BIOMECHANICS
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <IconComponent className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            {currentContent.subtitle}
          </p>
          <p className="text-gray-400">
            {currentContent.description}
          </p>
        </div>

        {/* Next Steps */}
        <Card variant="glass" className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">What happens next:</h2>
            <div className="space-y-4">
              {currentContent.nextSteps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                      <StepIcon className="w-5 h-5 text-gold-500" />
                    </div>
                    <p className="text-gray-300 pt-2">{step.text}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA for non-shooting flows */}
        {currentContent.cta && (
          <div className="text-center p-6 bg-bb-card border border-bb-border rounded-xl mb-8">
            <p className="text-gray-400 mb-4">{currentContent.cta.text}</p>
            <Link href={currentContent.cta.link}>
              <Button variant="outline" className="gap-2">
                {currentContent.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Back to home */}
        <div className="text-center">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
