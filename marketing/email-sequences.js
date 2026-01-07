/**
 * The Forensic Data Lab - Email Marketing Sequences
 * Automated email campaigns for lead nurturing and client conversion
 */

class EmailSequences {
  constructor() {
    this.sequences = {
      lead_nurture: this.createLeadNurtureSequence(),
      audit_follow_up: this.createAuditFollowUpSequence(),
      client_onboarding: this.createClientOnboardingSequence(),
      success_stories: this.createSuccessStoriesSequence(),
      abandoned_audit: this.createAbandonedAuditSequence(),
      referral_campaign: this.createReferralCampaignSequence(),
    };
  }

  createLeadNurtureSequence() {
    return {
      name: "Lead Nurture - 7-Day Educational Series",
      trigger: "email_signup",
      description: "Educates leads about tracking problems and builds trust",

      emails: [
        {
          day: 0,
          subject:
            "Your GA4 audit results are ready (and it's not good news...)",
          template: "lead_nurture_1_audit_results",
          type: "educational",
          data: {
            preview_text:
              "Many businesses have significant revenue visibility gaps...",
            content_blocks: [
              {
                type: "hero",
                title: "Your Free Audit Results Are In",
                subtitle:
                  "And unfortunately, there are some critical issues we need to discuss...",
              },
              {
                type: "audit_preview",
                overall_score: "{{audit_score}}",
                critical_issues: "{{critical_issues}}",
                revenue_impact: "{{revenue_impact}}",
              },
              {
                type: "value_prop",
                description:
                  "Our comprehensive audit identifies tracking issues that may be affecting your revenue visibility and marketing attribution.",
              },
              {
                type: "cta",
                button_text: "View My Full Report",
                url: "{{full_report_url}}",
              },
            ],
          },
        },
        {
          day: 2,
          subject: "Common tracking mistakes that cost real money",
          template: "lead_nurture_2_cost_of_broken_tracking",
          type: "educational",
          data: {
            preview_text:
              "These tracking errors may be costing your business money...",
            content_blocks: [
              {
                type: "story",
                title: "A Common Scenario",
                story:
                  "Many businesses think their Facebook ads aren't working when the real issue is tracking. When conversions aren't being attributed properly, you might be cutting your most profitable channels without knowing it.",
              },
              {
                type: "lesson",
                title: "Why This Happens",
                points: [
                  "iOS 14.5+ changed everything",
                  "GA4 migration broke most setups",
                  "E-commerce events are notoriously complex",
                  "Most agencies don't audit properly",
                ],
              },
              {
                type: "soft_cta",
                message: "Want to see what's broken in your setup?",
                button_text: "Get My Detailed Audit",
                url: "{{audit_url}}",
              },
            ],
          },
        },
        {
          day: 4,
          subject: "How our Automated Verification Loop process works",
          template: "lead_nurture_3_process",
          type: "educational",
          data: {
            preview_text: "Our systematic approach to signal restoration...",
            content_blocks: [
              {
                type: "process_intro",
                title: "The Automated Verification Loop Process",
                description:
                  "Our systematic approach to identifying and fixing tracking issues across your GA4, GTM, and Shopify setup.",
              },
              {
                type: "process_breakdown",
                title: "How We Work",
                steps: [
                  "Day 1: Comprehensive audit identifies all tracking issues",
                  "Day 2-3: Fix GA4 property configuration and GTM setup",
                  "Day 4-5: Implement proper e-commerce event tracking",
                  "Day 6-7: Verify success with thorough testing",
                ],
              },
              {
                type: "value_prop",
                description:
                  "We keep iterating until your tracking meets our quality standards. Real testimonials will be added as we complete client engagements.",
              },
            ],
          },
        },
        {
          day: 6,
          subject: 'The "Automated Verification Loop" methodology',
          template: "lead_nurture_4_methodology",
          type: "educational",
          data: {
            preview_text: "Our systematic approach to signal restoration...",
            content_blocks: [
              {
                type: "methodology_intro",
                title: "Why We're Different",
                description:
                  "Most agencies 'fix' tracking once and call it done. We use the 'Automated Verification Loop' - a systematic approach that keeps testing until your tracking meets our quality standards.",
              },
              {
                type: "loop_visualization",
                steps: [
                  {
                    name: "AUDIT",
                    description: "Scan every tracking event automatically",
                    icon: "search",
                  },
                  {
                    name: "DIAGNOSE",
                    description: "Identify root causes, not symptoms",
                    icon: "diagnose",
                  },
                  {
                    name: "REPAIR",
                    description: "Implement enterprise-grade fixes",
                    icon: "repair",
                  },
                  {
                    name: "VERIFY",
                    description: "Test every single event works correctly",
                    icon: "verify",
                  },
                  {
                    name: "REPEAT",
                    description: "Loop until quality standards met",
                    icon: "repeat",
                  },
                ],
              },
              {
                type: "guarantee",
                title: "Satisfaction Guarantee",
                description:
                  "We stand behind our work. If you're not satisfied, we'll work with you to make it right.",
              },
            ],
          },
        },
        {
          day: 7,
          subject: "FINAL NOTICE: Your tracking is bleeding money",
          template: "lead_nurture_5_urgency",
          type: "conversion",
          data: {
            preview_text: "Every day you wait costs you money. Let's fix this.",
            content_blocks: [
              {
                type: "urgency_header",
                title: "This Email Ends Tomorrow",
                subtitle:
                  "Your tracking problems aren't going away on their own",
              },
              {
                type: "cost_calculator",
                title: "What signal loss Is Costing You",
                examples: [
                  { revenue: "$50K/mo", loss: "$15,000/mo" },
                  { revenue: "$200K/mo", loss: "$60,000/mo" },
                  { revenue: "$1M/mo", loss: "$300,000/mo" },
                ],
              },
              {
                type: "risk_reversal",
                title: "Why Work With Us",
                guarantees: [
                  "Satisfaction guarantee",
                  "48-hour turnaround",
                  "Fixed price, no surprises",
                  "30-day support included",
                ],
              },
              {
                type: "strong_cta",
                title: "Stop the Revenue Bleeding",
                button_text: "Fix My Tracking Now →",
                url: "{{booking_url}}",
                urgency_text: "Only 3 spots left this week",
              },
            ],
          },
        },
      ],
    };
  }

  createAuditFollowUpSequence() {
    return {
      name: "Post-Audit Follow Up",
      trigger: "audit_completed",
      description: "Converts audit leads into paying customers",

      emails: [
        {
          day: 0,
          subject: "Your audit results: {{overall_score}}% (Action required)",
          template: "audit_followup_1_results",
          type: "immediate_conversion",
          data: {
            content_blocks: [
              {
                type: "audit_summary",
                score: "{{overall_score}}",
                issues_found: "{{total_issues}}",
                critical_issues: "{{critical_issues}}",
                estimated_loss: "{{monthly_loss}}",
              },
              {
                type: "top_issues",
                issues: "{{top_3_issues}}",
              },
              {
                type: "next_steps",
                options: [
                  {
                    name: "Self-service with our guide",
                    price: "$497",
                    best_for: "Technical teams",
                  },
                  {
                    name: "we restore everything",
                    price: "$1,497",
                    best_for: "Busy businesses",
                    recommended: true,
                  },
                  {
                    name: "Enterprise solution",
                    price: "$2,997",
                    best_for: "Multi-site companies",
                  },
                ],
              },
            ],
          },
        },
        {
          day: 3,
          subject:
            "Still thinking about your {{critical_issues}} critical issues?",
          template: "audit_followup_2_reminder",
          type: "nurture",
          data: {
            content_blocks: [
              {
                type: "reminder",
                title: "Quick Reminder",
                message:
                  "A few days ago, our audit found {{critical_issues}} critical tracking issues on {{website}}. Each day these remain unfixed costs you money.",
              },
              {
                type: "objection_handling",
                objections: [
                  {
                    objection: "Too expensive",
                    response:
                      "The average client saves 10x our fee in the first month from better attribution.",
                  },
                  {
                    objection: "Too complex",
                    response:
                      "We handle everything. You literally don't have to do anything except approve the plan.",
                  },
                  {
                    objection: "Not sure it will work",
                    response:
                      "We offer a satisfaction guarantee. If you're not happy with our work, we'll make it right.",
                  },
                ],
              },
            ],
          },
        },
        {
          day: 7,
          subject: " Final chance to restore your signals (closing soon)",
          template: "audit_followup_3_last_chance",
          type: "final_conversion",
          data: {
            content_blocks: [
              {
                type: "scarcity",
                message:
                  "This is the last email about your audit results. After today, we'll assume you're handling the issues internally.",
              },
              {
                type: "bonus_offer",
                title: "Final Offer: Free Bonus Worth $500",
                bonus: "6-month performance monitoring dashboard",
                condition: "If you book by midnight tonight",
              },
              {
                type: "final_cta",
                button_text: "Claim My Bonus & Fix My Tracking",
                url: "{{booking_url_with_bonus}}",
              },
            ],
          },
        },
      ],
    };
  }

  createSuccessStoriesSequence() {
    return {
      name: "Success Stories & Social Proof",
      trigger: "manual_or_scheduled",
      description: "Monthly newsletter featuring client success stories",

      emails: [
        {
          day: 0,
          subject:
            " How {{client_name}} increased revenue 300% with perfect tracking",
          template: "success_story_detailed",
          type: "social_proof",
          data: {
            content_blocks: [
              {
                type: "story_header",
                client: "{{client_name}}",
                industry: "{{industry}}",
                result: "300% revenue increase",
              },
              {
                type: "story_narrative",
                sections: [
                  {
                    title: "The Problem",
                    content: "{{problem_description}}",
                  },
                  {
                    title: "The Solution",
                    content: "{{solution_description}}",
                  },
                  {
                    title: "The Results",
                    content: "{{results_description}}",
                  },
                ],
              },
              {
                type: "metrics_showcase",
                before_after: "{{metrics_data}}",
              },
            ],
          },
        },
      ],
    };
  }

  createAbandonedAuditSequence() {
    return {
      name: "Abandoned Audit Recovery",
      trigger: "audit_started_not_completed",
      description: "Recovers users who started but didn't complete the audit",

      emails: [
        {
          day: 1,
          subject: "You left your audit half-finished (it takes 2 minutes)",
          template: "abandoned_audit_1",
          type: "recovery",
          data: {
            content_blocks: [
              {
                type: "gentle_reminder",
                title: "Quick Question",
                message:
                  "Did something go wrong with your tracking audit? I noticed you started it but didn't finish.",
              },
              {
                type: "completion_benefit",
                title: "What You'll Get in 2 Minutes",
                benefits: [
                  "Exact tracking health score",
                  "List of critical issues found",
                  "Estimated monthly revenue impact",
                  "Priority-ranked fix roadmap",
                ],
              },
              {
                type: "simple_cta",
                button_text: "Complete My Audit (2 mins)",
                url: "{{continue_audit_url}}",
              },
            ],
          },
        },
        {
          day: 3,
          subject:
            "Your competitors are fixing their tracking (you should too)",
          template: "abandoned_audit_2",
          type: "competitive",
          data: {
            content_blocks: [
              {
                type: "competitive_pressure",
                title: "While You Wait, Others Act",
                message:
                  "Many businesses in {{industry}} are proactively fixing their tracking to stay ahead. Don't let tracking issues hold you back.",
              },
              {
                type: "industry_insights",
                stats: [
                  "Many businesses in {{industry}} have tracking gaps",
                  "Common issues include GA4 migration problems",
                  "iOS 14+ privacy changes affect most setups",
                ],
              },
            ],
          },
        },
      ],
    };
  }

  createReferralCampaignSequence() {
    return {
      name: "Client Referral Campaign",
      trigger: "project_completed",
      description: "Encourages satisfied clients to refer new business",

      emails: [
        {
          day: 30,
          subject: "Earn $500 for each business you refer",
          template: "referral_invite",
          type: "referral",
          data: {
            content_blocks: [
              {
                type: "referral_offer",
                title: "Share the Love, Earn Cash",
                offer: "$500 for each successful referral",
                description:
                  "Know another business with tracking problems? Refer them and earn $500 when they become a client.",
              },
              {
                type: "referral_process",
                steps: [
                  "Send your unique referral link",
                  "They mention your name when booking",
                  "we restore their tracking successfully",
                  "You get $500 (they get 10% off)",
                ],
              },
              {
                type: "referral_link",
                link: "{{referral_url}}",
                code: "{{referral_code}}",
              },
            ],
          },
        },
      ],
    };
  }

  // Email template renderer
  renderEmail(sequenceName, emailIndex, personalizationData = {}) {
    const sequence = this.sequences[sequenceName];
    if (!sequence || !sequence.emails[emailIndex]) {
      throw new Error(`Email not found: ${sequenceName}[${emailIndex}]`);
    }

    const email = sequence.emails[emailIndex];
    let renderedEmail = {
      subject: this.personalize(email.subject, personalizationData),
      html: this.renderEmailTemplate(email, personalizationData),
      type: email.type,
      day: email.day,
    };

    return renderedEmail;
  }

  renderEmailTemplate(email, data) {
    // This would integrate with the email template system
    // For now, returning a basic HTML structure
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${email.subject}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #14b8a6, #0d9488); color: white; padding: 2rem; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 2rem; }
                .cta-button { background: #ef4444; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
                .metric-box { background: white; padding: 1rem; margin: 1rem 0; border-radius: 5px; border-left: 4px solid #ef4444; }
                .footer { background: #1f2937; color: white; padding: 1rem; text-align: center; border-radius: 0 0 10px 10px; font-size: 0.875rem; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>The Forensic Data Lab</h1>
            </div>
            <div class="content">
        `;

    // Render content blocks
    email.data.content_blocks.forEach((block) => {
      html += this.renderContentBlock(block, data);
    });

    html += `
            </div>
            <div class="footer">
                <p>The Forensic Data Lab - We don't stop until your tracking is perfect</p>
                <p><a href="{{unsubscribe_url}}" style="color: #9ca3af;">Unsubscribe</a></p>
            </div>
        </body>
        </html>
        `;

    return this.personalize(html, data);
  }

  renderContentBlock(block, data) {
    switch (block.type) {
      case "hero":
        return `
                    <h2>${block.title}</h2>
                    <p style="font-size: 1.1rem; color: #6b7280;">${block.subtitle}</p>
                `;

      case "audit_summary":
        return `
                    <div class="metric-box">
                        <h3>Your Tracking Health Score</h3>
                        <div style="font-size: 2rem; font-weight: bold; color: #ef4444;">${
                          block.score || data.overall_score
                        }%</div>
                        <p><strong>${
                          block.issues_found || data.total_issues
                        }</strong> issues found, <strong>${
          block.critical_issues || data.critical_issues
        }</strong> critical</p>
                        <p>Estimated monthly loss: <strong>$${
                          block.estimated_loss || data.monthly_loss
                        }</strong></p>
                    </div>
                `;

      case "cta":
        return `
                    <div style="text-align: center; margin: 2rem 0;">
                        <a href="${block.url}" class="cta-button">${block.button_text}</a>
                    </div>
                `;

      case "story":
        return `
                    <h3>${block.title}</h3>
                    <p>${block.story}</p>
                `;

      case "case_study_header":
        return `
                    <div style="background: white; padding: 1.5rem; border-radius: 8px; margin: 1rem 0;">
                        <h3>Case Study: ${block.company}</h3>
                        <p><strong>Industry:</strong> ${block.industry}</p>
                        <p><strong>Revenue:</strong> ${block.revenue}</p>
                        <p><strong>Challenge:</strong> ${block.challenge}</p>
                    </div>
                `;

      default:
        return `<div>Content block type '${block.type}' not implemented</div>`;
    }
  }

  personalize(text, data) {
    if (!text || !data) return text;

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  // Sequence management methods
  getSequence(name) {
    return this.sequences[name];
  }

  getAllSequences() {
    return Object.keys(this.sequences).map((name) => ({
      name,
      ...this.sequences[name],
    }));
  }

  scheduleEmail(
    sequenceName,
    emailIndex,
    recipientEmail,
    personalizationData,
    delayDays = 0
  ) {
    const email = this.renderEmail(
      sequenceName,
      emailIndex,
      personalizationData
    );

    const scheduledFor = new Date();
    scheduledFor.setDate(scheduledFor.getDate() + delayDays);

    console.log(
      ` Scheduled email "${
        email.subject
      }" for ${recipientEmail} on ${scheduledFor.toLocaleDateString()}`
    );

    // In production, this would integrate with your email service
    return {
      id: `email_${Date.now()}`,
      sequence: sequenceName,
      email_index: emailIndex,
      recipient: recipientEmail,
      subject: email.subject,
      scheduled_for: scheduledFor.toISOString(),
      status: "scheduled",
    };
  }
}

module.exports = { EmailSequences };

// Example usage
if (require.main === module) {
  const sequences = new EmailSequences();

  // Test lead nurture sequence
  const testData = {
    audit_score: "22",
    critical_issues: "7",
    total_issues: "15",
    monthly_loss: "12,500",
    website: "example.com",
    industry: "E-commerce",
  };

  const email = sequences.renderEmail("lead_nurture", 0, testData);
  console.log("\n Sample Email Generated:");
  console.log("Subject:", email.subject);
  console.log("Type:", email.type);
  console.log("HTML length:", email.html.length, "characters");

  // List all sequences
  console.log("\n Available Email Sequences:");
  sequences.getAllSequences().forEach((seq) => {
    console.log(`- ${seq.name}: ${seq.emails.length} emails`);
  });
}
