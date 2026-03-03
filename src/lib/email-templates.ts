// ============================================
// BB EMAIL SEQUENCE TEMPLATES
// Plain text style — personal, not corporate
// Separate templates for players, coaches, organizations
// ============================================

export const EMAIL_SEQUENCE_CONFIG = {
  EMAIL_2_DELAY_HOURS: 24,
  EMAIL_3_DELAY_HOURS: 48, // 48h after Email 2 = 72h total from submission
  MAX_RETRIES: 3,
  CALENDLY_URL_PLAYER: 'https://calendly.com/basketballbiomechanics/bb-lens-assessment',
  CALENDLY_URL_COACH: 'https://calendly.com/basketballbiomechanics/bb-coach-qualification-call',
};

// Helper: get the correct Calendly URL based on application type
export function getCalendlyUrl(applicationType: ApplicationType): string {
  if (applicationType === 'coach_cert_application' || applicationType === 'organization_inquiry') {
    return EMAIL_SEQUENCE_CONFIG.CALENDLY_URL_COACH;
  }
  return EMAIL_SEQUENCE_CONFIG.CALENDLY_URL_PLAYER;
}

export type ApplicationType =
  | 'full_assessment_application'
  | 'coach_cert_application'
  | 'organization_inquiry';

interface TemplateContext {
  firstName: string;
  applicationType: ApplicationType;
  unsubscribeUrl: string;
}

// ─── EMAIL 1: IMMEDIATE CONFIRMATION ─────────────────────────────

export function getEmail1Template(ctx: TemplateContext): { subject: string; text: string } {
  const name = ctx.firstName || 'there';

  if (ctx.applicationType === 'coach_cert_application') {
    return getEmail1Coach(name, ctx.unsubscribeUrl);
  }

  // Players + Organizations use the general template
  return getEmail1Player(name, ctx.unsubscribeUrl);
}

function getEmail1Coach(name: string, unsubscribeUrl: string): { subject: string; text: string } {
  const subject = 'Coach Application Received - BB Team Review';

  const text = `Hey ${name},

Thanks for applying to the Basketball Biomechanics Coaching Program.

We're reviewing your application now to see if you're a fit for learning and implementing the BB system with your players.

Here's what happens next:

Within 24-48 hours, you'll hear from us regarding your application.

If accepted, we'll invite you to schedule a consultation call where we'll discuss:
- How BB licensing/certification works
- What protocols and support you'll have access to
- How this elevates your coaching business
- Investment levels and program structure

Quick note: We only work with coaches who are committed to mastering the BB methodology, not just adding a few drills to their toolbox.

If that's you, we'll be in touch soon.

Talk soon,

Coach Jake & Coach Tommy
Basketball Biomechanics

P.S. - Follow us on Instagram for daily BB coaching content: @basketballbiomechanics


---
If you'd prefer not to receive follow-up emails from us, unsubscribe here: ${unsubscribeUrl}`;

  return { subject, text };
}

function getEmail1Player(name: string, unsubscribeUrl: string): { subject: string; text: string } {
  const subject = 'Application Received - BB Team Review';

  const text = `Hey ${name},

We received your application to Basketball Biomechanics.

Our team is reviewing it now to determine if BB is the right fit for where you're at and what you're trying to accomplish.

Here's what happens next:

Within 24-48 hours, you'll hear from us with one of two outcomes:

1. Your application is accepted - We'll invite you to schedule a call
2. We need more information - We'll ask follow-up questions to better understand your situation

Quick reminder: We only work with those who are serious about transformation, not just improvement. If that's you, we'll be in touch soon.

Talk soon,
Coach Jake
Basketball Biomechanics

P.S. - While you wait, check out some of our transformations on Instagram: @basketballbiomechanics


---
If you'd prefer not to receive follow-up emails from us, unsubscribe here: ${unsubscribeUrl}`;

  return { subject, text };
}

// ─── EMAIL 2: ALIGNMENT / ACCEPTANCE CALL INVITE ─────────────────

export function getEmail2Template(ctx: TemplateContext): { subject: string; text: string } {
  const name = ctx.firstName || 'there';

  if (ctx.applicationType === 'coach_cert_application') {
    return getEmail2Coach(name, ctx.unsubscribeUrl);
  }
  if (ctx.applicationType === 'organization_inquiry') {
    return getEmail2Organization(name, ctx.unsubscribeUrl);
  }

  // Players keep the original acceptance-style template
  return getEmail2Player(name, ctx.unsubscribeUrl);
}

function getEmail2Coach(name: string, unsubscribeUrl: string): { subject: string; text: string } {
  const calendlyUrl = EMAIL_SEQUENCE_CONFIG.CALENDLY_URL_COACH;

  const subject = "Let's Talk - See If BB Is the Right Fit for Your Coaching";

  const text = `${name},

We reviewed your application and want to schedule a call to see if there's alignment.

Before we bring coaches into the BB system, we need to make sure:
- You're committed to learning the methodology, not just adding drills
- Your coaching philosophy aligns with how we approach player development
- You have the player base and structure to actually implement BB principles
- The investment makes sense for where you're at in your coaching business

This isn't an acceptance call. It's an alignment call.

We'll discuss:
- What you're currently doing with your players and where you see gaps
- How the BB system works and what it actually requires from coaches
- Whether our approach matches what you're trying to build
- What the commitment looks like (time, investment, implementation)

If there's mutual fit, we'll talk about next steps. If not, we'll be direct about that too.

Book your 30-minute alignment call here: ${calendlyUrl}

Come prepared to discuss:
- Your current player development process
- What you're trying to improve as a coach
- Why you think BB specifically is what you need (not just any training system)

We only work with coaches who are serious about mastering this methodology. This call determines if you're one of them.

Book your time,

Coach Jake & Coach Tommy
Basketball Biomechanics

P.S. - If you can't find a time that works, reply to this email and we'll figure it out.


---
If you'd prefer not to receive follow-up emails from us, unsubscribe here: ${unsubscribeUrl}`;

  return { subject, text };
}

function getEmail2Organization(name: string, unsubscribeUrl: string): { subject: string; text: string } {
  const calendlyUrl = EMAIL_SEQUENCE_CONFIG.CALENDLY_URL_COACH;

  const subject = "Let's Talk - See If BB Is the Right Fit for Your Program";

  const text = `${name},

We reviewed your inquiry and want to schedule a call to see if there's alignment between what you need and what BB provides.

Before we enter into organizational partnerships, we need to make sure:
- Your program is committed to real player development transformation, not surface-level add-ons
- Your structure can support BB integration (training time, staff buy-in, implementation capacity)
- There's budget and timeline alignment for what this actually requires
- The decision-makers are aligned on what success looks like

This isn't a sales call. It's an alignment call.

We'll discuss:
- Your current player development structure and where you see gaps
- How BB integrates into organizational programs and what that requires
- Whether our methodology matches your program's development philosophy
- What a partnership would actually look like (scope, timeline, investment, integration)

If there's mutual fit, we'll outline next steps. If not, we'll be direct about that.

Book your 45-minute alignment call here: ${calendlyUrl}

Who should be on this call:

Anyone involved in the final decision - athletic director, head coach, director of player development. We need alignment from all stakeholders before moving forward.

Come prepared to discuss:
- Number of players and current training structure
- Specific outcomes you're trying to achieve
- Budget range and timeline for implementation
- Why you think BB specifically is what your program needs

We only partner with programs that are serious about transformation. This call determines if yours is one of them.

Book your time,

Coach Jake & Coach Tommy
Basketball Biomechanics

P.S. - If scheduling is difficult with multiple stakeholders, reply to this email and we'll coordinate directly.


---
If you'd prefer not to receive follow-up emails from us, unsubscribe here: ${unsubscribeUrl}`;

  return { subject, text };
}

function getEmail2Player(name: string, unsubscribeUrl: string): { subject: string; text: string } {
  const calendlyUrl = EMAIL_SEQUENCE_CONFIG.CALENDLY_URL_PLAYER;

  const subject = "You're In - Schedule Your BB Call";

  const text = `${name},

Good news.

We reviewed your application and you're a fit for Basketball Biomechanics.

Based on what you shared in your application, we think we can help you break through the limitations you're facing.

Next step: Schedule your call.

This call is where we'll:
- Dig deeper into what's holding you back right now
- Explain how BB works and why it's different
- Determine which program makes the most sense for your situation

Book your call here: ${calendlyUrl}

A few things before we talk:

1. Come ready to be honest about where you're struggling
2. Have your schedule ready (we'll need to know when you can commit to training)
3. If others need to be involved in the final decision, make sure they're available for the call

We only have a limited number of spots available each month, so if you're serious about this, book your call now.

See you on the call,
Coach Jake
Basketball Biomechanics

P.S. - If you can't find a time that works, reply to this email and we'll figure it out.


---
If you'd prefer not to receive follow-up emails from us, unsubscribe here: ${unsubscribeUrl}`;

  return { subject, text };
}

// ─── EMAIL 3: REMINDER IF NO BOOKING ─────────────────────────────

export function getEmail3Template(ctx: TemplateContext): { subject: string; text: string } {
  const name = ctx.firstName || 'there';
  const calendlyUrl = getCalendlyUrl(ctx.applicationType);

  const subject = 'Did you see this? - BB Call Invitation';

  const text = `${name},

I sent you an invitation to schedule your BB call a couple days ago, but I haven't seen you book yet.

Not sure if you missed it or if you're still thinking it over.

Quick reminder: We only have a limited number of spots available each month. If you want one, you need to book your call.

Here's the link again: ${calendlyUrl}

If you're no longer interested, no worries, just let me know so we can free up your spot for someone else.

Otherwise, book your call and let's see if BB is the right fit.

Coach Jake
Basketball Biomechanics


---
If you'd prefer not to receive follow-up emails from us, unsubscribe here: ${ctx.unsubscribeUrl}`;

  return { subject, text };
}
