'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Calendar, BookOpen, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const routingMessages: Record<string, { title: string; message: string; cta: string; icon: React.ReactNode }> = {
  shooting_masterclass: {
    title: 'Perfect Match: Shooting Calibration Masterclass',
    message: "Based on your answers, we think our self-paced Shooting Calibration Masterclass is the best fit. It includes our complete system, video breakdowns, and protocols you can follow on your own schedule.",
    cta: "We'll send you details shortly!",
    icon: <BookOpen className="w-8 h-8" />,
  },
  bb_lens_assessment: {
    title: 'Recommended: BB Lens Shot Assessment',
    message: "Based on your answers, a personal BB Lens Shot Assessment would give you exactly what you need - a detailed breakdown of your shooting profile with specific protocols for your situation.",
    cta: "We'll reach out to schedule your assessment!",
    icon: <Target className="w-8 h-8" />,
  },
  high_ticket_mentorship: {
    title: 'You Qualify: Premium BB Mentorship',
    message: "You're showing the commitment level and mindset we look for in our high-touch 3-month mentorship program. This includes weekly calls, personalized protocols, equipment, and direct access to our team.",
    cta: "We'll be in touch to discuss if this is right for you!",
    icon: <Users className="w-8 h-8" />,
  },
  coach_masterclass: {
    title: 'Recommended: Coach\'s Masterclass',
    message: "Our Coach's Masterclass will give you the motor learning framework and practical protocols to run BB methods with your players. Perfect for coaches who want to level up their methodology.",
    cta: "We'll send you access details!",
    icon: <BookOpen className="w-8 h-8" />,
  },
  coach_consultation: {
    title: 'Next Step: Consultation Call',
    message: "Based on your situation, we'd like to set up a consultation to discuss how BB methods can be integrated into your coaching practice. We'll review your current approach and create a customized plan.",
    cta: "We'll reach out to schedule a call!",
    icon: <Calendar className="w-8 h-8" />,
  },
  org_audit_consulting: {
    title: 'Next Step: Program Audit Discussion',
    message: "Your organization sounds like a great fit for our comprehensive BB Lens audit and consulting services. We'll analyze your current development model and create an implementation roadmap.",
    cta: "We'll be in touch to discuss your program!",
    icon: <Target className="w-8 h-8" />,
  },
  org_coach_education: {
    title: 'Next Step: Staff Education Package',
    message: "Coach education is a great starting point. We offer masterclass access combined with live Q&A sessions to get your entire staff aligned on modern shooting development methods.",
    cta: "We'll reach out with package options!",
    icon: <Users className="w-8 h-8" />,
  },
  org_consultation: {
    title: 'Next Step: Discovery Call',
    message: "We'd love to learn more about your organization's needs. Let's schedule a call to discuss how BB can support your player development goals.",
    cta: "We'll be in touch to schedule!",
    icon: <Calendar className="w-8 h-8" />,
  },
  general_inquiry: {
    title: 'Thanks for Reaching Out!',
    message: "We've received your information and will review your specific situation. Someone from our team will be in touch soon with personalized recommendations.",
    cta: "Expect to hear from us shortly!",
    icon: <CheckCircle2 className="w-8 h-8" />,
  },
};

function ThankYouContent() {
  const searchParams = useSearchParams();
  const routing = searchParams.get('routing') || 'general_inquiry';
  const role = searchParams.get('role') || 'player';

  const routingInfo = routingMessages[routing] || routingMessages.general_inquiry;

  return (
    <main className="min-h-screen bg-bb-black flex items-center justify-center py-12">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="animate-fade-in flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500">
            {routingInfo.icon}
          </div>
        </div>

        <div className="animate-fade-in">
          <div className="inline-block px-3 py-1 bg-gold-500/20 rounded-full text-gold-500 text-sm font-medium mb-4">
            Submission Received
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {routingInfo.title}
          </h1>

          <p className="text-gray-400 mb-6 leading-relaxed">
            {routingInfo.message}
          </p>

          <div className="bg-bb-card border border-bb-border rounded-xl p-4 mb-8">
            <p className="text-gold-500 font-medium flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" />
              {routingInfo.cta}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="secondary">Back to Home</Button>
            </Link>
            {(role === 'player' || role === 'parent') && (
              <Link href="/portal">
                <Button>Go to Test Portal</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bb-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
