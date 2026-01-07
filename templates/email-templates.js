/**
 * The Forensic Data Lab - Email Templates
 * Automated email templates for all client communications
 */

// Professional Email Signature Configuration
const EmailSignatures = {
  // Company-wide signature settings
  company: {
    name: "The Forensic Data Lab",
    tagline: "Revenue Signal Recovery for Shopify Brands",
    website: "https://forensicdatalab.pro",
    supportEmail: "support@forensicdatalab.pro",
    phone: "(555) 724-4625",
    address: "123 Analytics Way, Suite 400, San Francisco, CA 94102",
  },

  // Team member signatures
  team: {
    founder: {
      name: "Lauren Mitchell",
      title: "Founder & Chief Revenue Analyst",
      email: "lauren@forensicdatalab.pro",
      linkedin: "https://linkedin.com/in/laurenmitchell",
      calendly: "https://calendly.com/forensicdatalab/lauren",
    },
    support: {
      name: "The Forensic Data Lab Team",
      title: "Revenue Signal Recovery Specialists",
      email: "support@forensicdatalab.pro",
    },
    technical: {
      name: "Technical Support Team",
      title: "Signal Restoration Engineers",
      email: "tech@forensicdatalab.pro",
    },
  },

  // Generate HTML signature for a team member
  generateSignature(memberKey, options = {}) {
    const member = this.team[memberKey] || this.team.support;
    const {
      includeCalendly = false,
      includeLinkedin = true,
      compact = false,
    } = options;

    if (compact) {
      return `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #374151; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-weight: 600; color: #1f2937;">${
            member.name
          }</p>
          <p style="margin: 2px 0 0; color: #6b7280; font-size: 13px;">${
            member.title
          }</p>
          <p style="margin: 8px 0 0; font-size: 13px;">
            <a href="mailto:${
              member.email
            }" style="color: #14b8a6; text-decoration: none;">${
        member.email
      }</a>
            ${
              this.company.phone
                ? ` | <span style="color: #6b7280;">${this.company.phone}</span>`
                : ""
            }
          </p>
        </div>
      `;
    }

    return `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #374151; margin-top: 32px; padding-top: 24px; border-top: 2px solid #14b8a6;">
        <table cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
          <tr>
            <td style="padding-right: 16px; vertical-align: top;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #14b8a6, #0d9488); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 32px; font-weight: bold; line-height: 80px; text-align: center; display: block; width: 100%;">${member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}</span>
              </div>
            </td>
            <td style="vertical-align: top;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${
                member.name
              }</p>
              <p style="margin: 2px 0 0; color: #14b8a6; font-size: 13px; font-weight: 500;">${
                member.title
              }</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #6b7280;">
                <a href="mailto:${
                  member.email
                }" style="color: #14b8a6; text-decoration: none;">${
      member.email
    }</a>
              </p>
              ${
                this.company.phone
                  ? `<p style="margin: 2px 0 0; font-size: 13px; color: #6b7280;">${this.company.phone}</p>`
                  : ""
              }
              <p style="margin: 8px 0 0; font-size: 13px;">
                ${
                  member.linkedin && includeLinkedin
                    ? `<a href="${member.linkedin}" style="color: #14b8a6; text-decoration: none; margin-right: 12px;">LinkedIn</a>`
                    : ""
                }
                ${
                  member.calendly && includeCalendly
                    ? `<a href="${member.calendly}" style="color: #14b8a6; text-decoration: none;">Schedule a Call</a>`
                    : ""
                }
              </p>
            </td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 13px; color: #6b7280;">
            <strong style="color: #1f2937;">${this.company.name}</strong> | ${
      this.company.tagline
    }
          </p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af;">
            <a href="${
              this.company.website
            }" style="color: #14b8a6; text-decoration: none;">${this.company.website.replace(
      "https://",
      ""
    )}</a>
          </p>
        </div>
      </div>
    `;
  },

  // Generate plain text signature for non-HTML emails
  generatePlainTextSignature(memberKey) {
    const member = this.team[memberKey] || this.team.support;
    return `
--
${member.name}
${member.title}
${member.email}
${this.company.phone}

${this.company.name}
${this.company.tagline}
${this.company.website}
    `.trim();
  },
};

const EmailTemplates = {
  // Welcome email for new clients
  welcome: {
    subject: "Welcome to The Forensic Data Lab - Your {{tier}} Service Begins!",
    template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #14b8a6, #0d9488); color: white; padding: 2rem; text-align: center;">
                <h1 style="margin: 0; font-size: 2rem;">Welcome to The Forensic Data Lab!</h1>
                <p style="margin: 1rem 0 0; font-size: 1.1rem;">Your {{tier}} service starts now</p>
            </div>
            
            <div style="padding: 2rem;">
                <h2 style="color: #1f2937;">Hello {{client_name}}!</h2>
                
                <p>Thank you for choosing The Forensic Data Lab to recover your revenue signals. We're excited to help you improve signal integrity for {{website_url}}.</p>
                
                <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #0d9488;">Your {{tier}} Service Includes:</h3>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        {{#each service_features}}
                        <li style="margin-bottom: 0.5rem;">{{this}}</li>
                        {{/each}}
                    </ul>
                </div>
                
                <h3 style="color: #1f2937;">What Happens Next:</h3>
                <ol style="padding-left: 1.5rem;">
                    <li style="margin-bottom: 0.75rem;"><strong>Revenue Signal Analysis:</strong> We'll scan {{website_url}} to identify all signal leaks</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Revenue Impact Analysis:</strong> Quantify and prioritize recovery opportunities</li>
                    {{#if is_selfService}}
                    <li style="margin-bottom: 0.75rem;"><strong>Implementation Guide:</strong> Receive detailed implementation instructions with code snippets</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Support Call:</strong> 1-hour consultation to walk through everything</li>
                    {{else}}
                    <li style="margin-bottom: 0.75rem;"><strong>Professional Implementation:</strong> Our team fixes everything for you</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Testing & Verification:</strong> Thorough verification before sign-off</li>
                    {{/if}}
                </ol>
                
                <div style="background: #ecfdf5; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #059669;"> Project Timeline:</h3>
                    <p style="margin: 0;"><strong>Start Date:</strong> {{start_date}}</p>
                    <p style="margin: 0.25rem 0 0;"><strong>Expected Completion:</strong> {{completion_date}}</p>
                    <p style="margin: 0.25rem 0 0;"><strong>Project ID:</strong> {{project_id}}</p>
                </div>
                
                <div style="text-align: center; margin: 2rem 0;">
                    <a href="{{portal_url}}" style="background: #14b8a6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block;">
                         View Project Portal
                    </a>
                </div>
                
                <h3 style="color: #1f2937;"> Your Support Team:</h3>
                {{#if account_manager}}
                <p><strong>Account Manager:</strong> {{account_manager_name}} ({{account_manager_email}})</p>
                {{/if}}
                <p><strong>Technical Support:</strong> {{support_email}}</p>
                <p><strong>Emergency Contact:</strong> (555) TRACKING</p>
                
                <p style="margin-top: 2rem;">Questions? Simply reply to this email or check your project portal for real-time updates.</p>
                
                <p style="color: #6b7280; font-style: italic;">We're here to ensure your tracking is perfect. Let's get started! </p>
            </div>
            
            <div style="background: #f9fafb; padding: 1rem 2rem; text-align: center; color: #6b7280; font-size: 0.875rem;">
                <p>The Forensic Data Lab - We don't stop until your tracking is perfect</p>
                <p>{{company_address}} | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
            </div>
        </div>
        `,
  },

  // Progress update email
  progress_update: {
    subject: " Progress Update: {{step_name}} Completed",
    template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: #f0f9ff; padding: 1.5rem; text-align: center; border-bottom: 1px solid #e5e7eb;">
                <h1 style="margin: 0; color: #0d9488;"> Project Progress Update</h1>
                <p style="margin: 0.5rem 0 0; color: #6b7280;">{{website_url}} - {{project_id}}</p>
            </div>
            
            <div style="padding: 2rem;">
                <h2 style="color: #059669; margin: 0 0 1rem;"> {{step_name}} Completed!</h2>
                
                <p>Great news! We've just completed <strong>{{step_name}}</strong> for your tracking implementation.</p>
                
                <div style="background: #ecfdf5; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #059669;">What We Accomplished:</h3>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        {{#each completed_actions}}
                        <li style="margin-bottom: 0.5rem;">{{this}}</li>
                        {{/each}}
                    </ul>
                </div>
                
                <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-weight: 600;">Project Progress</span>
                        <span style="font-weight: 600;">{{progress_percentage}}%</span>
                    </div>
                    <div style="background: #d1d5db; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="background: linear-gradient(90deg, #14b8a6, #059669); height: 100%; width: {{progress_percentage}}%;"></div>
                    </div>
                    <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
                        {{completed_steps}} of {{total_steps}} steps completed
                    </div>
                </div>
                
                <h3 style="color: #1f2937;"> Next Steps:</h3>
                <p><strong>{{next_step_name}}</strong></p>
                <p style="color: #6b7280;">{{next_step_description}}</p>
                <p><strong>Estimated completion:</strong> {{next_step_eta}}</p>
                
                {{#if requires_client_action}}
                <div style="background: #fef3c7; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #d97706;"> Action Required:</h3>
                    <p style="margin: 0;">{{client_action_needed}}</p>
                </div>
                {{/if}}
                
                <div style="text-align: center; margin: 2rem 0;">
                    <a href="{{portal_url}}" style="background: #14b8a6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block; margin-right: 1rem;">
                         View Portal
                    </a>
                    {{#if has_questions}}
                    <a href="mailto:{{support_email}}" style="background: #f3f4f6; color: #374151; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block;">
                         Ask Question
                    </a>
                    {{/if}}
                </div>
                
                <p style="color: #6b7280; font-style: italic;">Questions about this update? Simply reply to this email!</p>
            </div>
            
            <div style="background: #f9fafb; padding: 1rem 2rem; text-align: center; color: #6b7280; font-size: 0.875rem;">
                <p>The Forensic Data Lab - Real-time project updates</p>
            </div>
        </div>
        `,
  },

  // Audit completion email
  audit_complete: {
    subject:
      "Audit Complete: {{issues_found}} Issues Found ({{overall_score}}% Score)",
    template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: {{header_color}}; color: white; padding: 2rem; text-align: center;">
                <h1 style="margin: 0; font-size: 2rem;"> Audit Complete!</h1>
                <div style="font-size: 3rem; font-weight: bold; margin: 1rem 0;">{{overall_score}}%</div>
                <p style="margin: 0; font-size: 1.1rem;">Tracking Health Score</p>
            </div>
            
            <div style="padding: 2rem;">
                <h2 style="color: #1f2937;">Hello {{client_name}},</h2>
                
                <p>We've completed the comprehensive tracking audit for <strong>{{website_url}}</strong>. Here's what we found:</p>
                
                <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
                    <div style="flex: 1; background: #fee2e2; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #dc2626;">{{critical_issues}}</div>
                        <div style="font-size: 0.875rem; color: #7f1d1d;">Critical Issues</div>
                    </div>
                    <div style="flex: 1; background: #fef3c7; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #d97706;">{{high_issues}}</div>
                        <div style="font-size: 0.875rem; color: #92400e;">High Priority</div>
                    </div>
                    <div style="flex: 1; background: #dbeafe; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #1d4ed8;">{{medium_issues}}</div>
                        <div style="font-size: 0.875rem; color: #1e3a8a;">Medium Priority</div>
                    </div>
                </div>
                
                <div style="background: {{impact_bg_color}}; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: {{impact_text_color}};"> Business Impact</h3>
                    <p style="margin: 0; font-size: 1.1rem;"><strong>Estimated Monthly Revenue Loss: \${{monthly_loss}}</strong></p>
                    <p style="margin: 0.5rem 0 0; color: {{impact_text_color}};">{{impact_description}}</p>
                </div>
                
                <h3 style="color: #1f2937;">Top Issues Found:</h3>
                <ul style="padding-left: 1.5rem;">
                    {{#each top_issues}}
                    <li style="margin-bottom: 0.75rem;">
                        <strong>{{title}}</strong><br>
                        <span style="color: #6b7280;">{{description}}</span>
                    </li>
                    {{/each}}
                </ul>
                
                <h3 style="color: #1f2937;"> What's Included in Your Report:</h3>
                <ul style="padding-left: 1.5rem;">
                    <li style="margin-bottom: 0.5rem;">Detailed technical analysis of all {{total_issues}} issues</li>
                    <li style="margin-bottom: 0.5rem;">Business impact assessment and ROI calculations</li>
                    <li style="margin-bottom: 0.5rem;">Priority-ranked implementation roadmap</li>
                    <li style="margin-bottom: 0.5rem;">{{#if is_selfService}}Step-by-step Diagnostic implementation guide{{else}}Complete professional implementation plan{{/if}}</li>
                    <li style="margin-bottom: 0.5rem;">Testing and verification checklists</li>
                </ul>
                
                <div style="text-align: center; margin: 2rem 0;">
                    <a href="{{report_download_url}}" style="background: #dc2626; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block; margin-right: 1rem;">
                        Download Full Report
                    </a>
                    <a href="{{portal_url}}" style="background: #14b8a6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block;">
                         View Project Portal
                    </a>
                </div>
                
                {{#if is_selfService}}
                <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #0d9488;"> Your Self-Implementation:</h3>
                    <p style="margin: 0;">Your detailed implementation guide is ready! Download your report to access step-by-step instructions, code snippets, and verification checklists.</p>
                    <p style="margin: 1rem 0 0;"><strong>Don't forget:</strong> Schedule your included 1-hour consultation call to walk through the implementation with our experts.</p>
                </div>
                {{else}}
                <div style="background: #ecfdf5; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #059669;">Professional Implementation Starts Now:</h3>
                    <p style="margin: 0;">Our team is ready to implement all fixes for you. We'll keep you updated every step of the way and ensure thorough verification before sign-off.</p>
                    <p style="margin: 1rem 0 0;"><strong>Timeline:</strong> {{implementation_timeline}}</p>
                </div>
                {{/if}}
                
                <p>Questions about your audit results? Simply reply to this email or contact your support team.</p>
                
                <p style="color: #6b7280; font-style: italic;">Ready to improve your signal integrity? Let's recover your revenue!</p>
            </div>
            
            <div style="background: #f9fafb; padding: 1rem 2rem; text-align: center; color: #6b7280; font-size: 0.875rem;">
                <p>The Forensic Data Lab - Comprehensive tracking audits</p>
            </div>
        </div>
        `,
  },

  // Implementation complete email
  implementation_complete: {
    subject: "Implementation Complete: Tracking Restoration Achieved!",
    template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 2rem; text-align: center;">
                <h1 style="margin: 0; font-size: 2rem;"> Mission Accomplished!</h1>
                <div style="font-size: 3rem; margin: 1rem 0;">100%</div>
                <p style="margin: 0; font-size: 1.1rem;">Tracking Success Rate Achieved</p>
            </div>
            
            <div style="padding: 2rem;">
                <h2 style="color: #1f2937;">Congratulations {{client_name}}!</h2>
                
                <p>We're thrilled to announce that your tracking implementation for <strong>{{website_url}}</strong> is now <strong>complete and verified</strong>!</p>
                
                <div style="background: #ecfdf5; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #059669;"> What We Accomplished:</h3>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li style="margin-bottom: 0.5rem;">Restored all {{total_issues_fixed}} revenue signals</li>
                        <li style="margin-bottom: 0.5rem;">Implemented {{ecommerce_events}} e-commerce events</li>
                        <li style="margin-bottom: 0.5rem;">Achieved thorough data accuracy verification</li>
                        <li style="margin-bottom: 0.5rem;">Optimized {{performance_improvement}}% performance impact</li>
                        <li style="margin-bottom: 0.5rem;">{{compliance_features}} compliance features implemented</li>
                    </ul>
                </div>
                
                <div style="display: flex; gap: 1rem; margin: 1.5rem 0;">
                    <div style="flex: 1; background: #dbeafe; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #1d4ed8;">{{before_score}}%</div>
                        <div style="font-size: 0.875rem; color: #1e3a8a;">Before</div>
                    </div>
                    <div style="flex: 0 0 auto; display: flex; align-items: center; font-size: 1.5rem;">→</div>
                    <div style="flex: 1; background: #dcfce7; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #166534;">100%</div>
                        <div style="font-size: 0.875rem; color: #14532d;">After</div>
                    </div>
                </div>
                
                <h3 style="color: #1f2937;"> Business Impact:</h3>
                <ul style="padding-left: 1.5rem;">
                    <li style="margin-bottom: 0.5rem;"><strong>Revenue Visibility:</strong> Now tracking {{revenue_visibility}}% of conversions</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Marketing Attribution:</strong> {{attribution_improvement}}% improvement in campaign attribution</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Data Quality:</strong> {{data_quality_score}}/100 data quality score</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Estimated ROI:</strong> \${{estimated_monthly_savings}}/month in improved optimization</li>
                </ul>
                
                <h3 style="color: #1f2937;"> Your Implementation Package:</h3>
                <ul style="padding-left: 1.5rem;">
                    <li style="margin-bottom: 0.5rem;">Complete implementation documentation</li>
                    <li style="margin-bottom: 0.5rem;">Team training materials and recordings</li>
                    <li style="margin-bottom: 0.5rem;">Monitoring and maintenance guide</li>
                    <li style="margin-bottom: 0.5rem;">{{support_duration}} ongoing support included</li>
                </ul>
                
                <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #0d9488;"> {{support_duration}} Support Period:</h3>
                    <p style="margin: 0;">We'll continue monitoring your tracking setup and make any necessary adjustments. Our team is here to ensure everything continues working perfectly.</p>
                    <p style="margin: 1rem 0 0;"><strong>Support Contact:</strong> {{support_email}} | (555) TRACKING</p>
                </div>
                
                <div style="text-align: center; margin: 2rem 0;">
                    <a href="{{final_report_url}}" style="background: #059669; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block; margin-right: 1rem;">
                         Download Final Report
                    </a>
                    <a href="{{monitoring_dashboard_url}}" style="background: #14b8a6; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block;">
                         View Dashboard
                    </a>
                </div>
                
                <h3 style="color: #1f2937;"> What's Next:</h3>
                <ol style="padding-left: 1.5rem;">
                    <li style="margin-bottom: 0.75rem;"><strong>Monitor Performance:</strong> Track your improved analytics in GA4</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Optimize Campaigns:</strong> Use your new data for better marketing decisions</li>
                    <li style="margin-bottom: 0.75rem;"><strong>Quarterly Check-ups:</strong> We recommend quarterly audits to maintain optimal performance</li>
                </ol>
                
                {{#if feedback_request}}
                <div style="background: #fef3c7; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #d97706;">Help Us Improve:</h3>
                    <p style="margin: 0;">How was your The Forensic Data Lab experience? Your feedback helps us serve future clients better.</p>
                    <div style="text-align: center; margin-top: 1rem;">
                        <a href="{{feedback_url}}" style="background: #d97706; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">
                             Leave Feedback
                        </a>
                    </div>
                </div>
                {{/if}}
                
                <p>Thank you for trusting The Forensic Data Lab with your analytics. Your tracking is now enterprise-grade and ready to drive better business decisions!</p>
                
                <p style="color: #6b7280; font-style: italic;">Questions or need assistance? We're always here to help! </p>
            </div>
            
            <div style="background: #f9fafb; padding: 1rem 2rem; text-align: center; color: #6b7280; font-size: 0.875rem;">
                <p>The Forensic Data Lab - Mission accomplished! </p>
                <p>{{company_address}} | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
            </div>
        </div>
        `,
  },

  // Support and follow-up emails
  consultation_reminder: {
    subject: " Reminder: Your The Forensic Data Lab Consultation Tomorrow",
    template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: #f0f9ff; padding: 1.5rem; text-align: center;">
                <h1 style="margin: 0; color: #0d9488;"> Consultation Reminder</h1>
            </div>
            
            <div style="padding: 2rem;">
                <h2 style="color: #1f2937;">Hello {{client_name}},</h2>
                
                <p>This is a friendly reminder about your The Forensic Data Lab consultation call scheduled for tomorrow:</p>
                
                <div style="background: #dbeafe; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0; text-align: center;">
                    <h3 style="margin: 0 0 1rem; color: #0d9488;"> Call Details</h3>
                    <p style="margin: 0; font-size: 1.1rem;"><strong>Date:</strong> {{call_date}}</p>
                    <p style="margin: 0.5rem 0; font-size: 1.1rem;"><strong>Time:</strong> {{call_time}}</p>
                    <p style="margin: 0.5rem 0; font-size: 1.1rem;"><strong>Duration:</strong> {{call_duration}}</p>
                    <p style="margin: 1rem 0 0;"><strong>Join Link:</strong> <a href="{{meeting_url}}" style="color: #0d9488;">{{meeting_url}}</a></p>
                </div>
                
                <h3 style="color: #1f2937;"> What We'll Cover:</h3>
                <ul style="padding-left: 1.5rem;">
                    <li style="margin-bottom: 0.5rem;">Review your audit results and implementation plan</li>
                    <li style="margin-bottom: 0.5rem;">Walk through priority fixes and their business impact</li>
                    <li style="margin-bottom: 0.5rem;">Answer your technical and implementation questions</li>
                    <li style="margin-bottom: 0.5rem;">Discuss timeline and next steps</li>
                </ul>
                
                <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem;"> Come Prepared:</h3>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li style="margin-bottom: 0.5rem;">Review your audit report</li>
                        <li style="margin-bottom: 0.5rem;">Prepare any technical questions</li>
                        <li style="margin-bottom: 0.5rem;">Have access to your GA4 and GTM accounts</li>
                        <li style="margin-bottom: 0.5rem;">Bring relevant team members if needed</li>
                    </ul>
                </div>
                
                <p><strong>Need to reschedule?</strong> No problem! Just reply to this email or <a href="{{reschedule_url}}">click here</a> to choose a new time.</p>
                
                <p>Looking forward to helping you achieve perfect tracking! </p>
            </div>
        </div>
        `,
  },

  // Error notification email
  error_notification: {
    subject: "The Forensic Data Lab: Issue Detected - Action Required",
    template: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: #fee2e2; color: #dc2626; padding: 1.5rem; text-align: center;">
                <h1 style="margin: 0;"> Issue Detected</h1>
            </div>
            
            <div style="padding: 2rem;">
                <h2 style="color: #dc2626;">Hello {{client_name}},</h2>
                
                <p>We've detected an issue with your project that requires attention:</p>
                
                <div style="background: #fef2f2; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #dc2626; margin: 1.5rem 0;">
                    <h3 style="margin: 0 0 1rem; color: #dc2626;">Issue Details:</h3>
                    <p style="margin: 0;"><strong>Type:</strong> {{error_type}}</p>
                    <p style="margin: 0.5rem 0;"><strong>Description:</strong> {{error_description}}</p>
                    <p style="margin: 0.5rem 0 0;"><strong>Impact:</strong> {{error_impact}}</p>
                </div>
                
                {{#if requires_client_action}}
                <h3 style="color: #dc2626;">Action Required:</h3>
                <p>{{required_action}}</p>
                {{else}}
                <h3 style="color: #1f2937;">Our Response:</h3>
                <p>Our team has been notified and is working to resolve this issue. We'll keep you updated on our progress.</p>
                {{/if}}
                
                <div style="text-align: center; margin: 2rem 0;">
                    <a href="mailto:{{support_email}}" style="background: #dc2626; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; display: inline-block;">
                         Contact Support
                    </a>
                </div>
                
                <p>We apologize for any inconvenience and appreciate your patience as we resolve this matter.</p>
            </div>
        </div>
        `,
  },
};

// Email template renderer
class EmailRenderer {
  static render(templateName, data) {
    const template = EmailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template "${templateName}" not found`);
    }

    let subject = template.subject;
    let html = template.template;

    // Simple template replacement (in production, use a proper template engine like Handlebars)
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const regex = new RegExp(`{{${key}}}`, "g");
      subject = subject.replace(regex, value);
      html = html.replace(regex, value);
    });

    // Handle conditionals (simplified - use proper template engine for complex logic)
    html = this.handleConditionals(html, data);
    html = this.handleLoops(html, data);

    return {
      subject,
      html,
    };
  }

  static handleConditionals(html, data) {
    // Handle {{#if condition}} blocks
    const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
    return html.replace(ifRegex, (match, condition, content) => {
      return data[condition] ? content : "";
    });
  }

  static handleLoops(html, data) {
    // Handle {{#each array}} blocks
    const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
    return html.replace(eachRegex, (match, arrayName, content) => {
      const array = data[arrayName];
      if (!Array.isArray(array)) return "";

      return array
        .map((item, index) => {
          let itemContent = content;
          // Replace {{this}} with array item
          itemContent = itemContent.replace(/{{this}}/g, item);
          // Replace {{@index}} with index
          itemContent = itemContent.replace(/{{@index}}/g, index + 1);

          // If item is object, replace properties
          if (typeof item === "object") {
            Object.keys(item).forEach((key) => {
              const regex = new RegExp(`{{${key}}}`, "g");
              itemContent = itemContent.replace(regex, item[key]);
            });
          }

          return itemContent;
        })
        .join("");
    });
  }
}

module.exports = { EmailTemplates, EmailRenderer, EmailSignatures };

// Example usage and signature preview:
if (require.main === module) {
  console.log("=== Email Signature Examples ===\n");

  // Full signature (founder)
  console.log("--- Founder Signature (Full) ---");
  console.log(
    EmailSignatures.generateSignature("founder", { includeCalendly: true })
  );

  // Compact signature (support)
  console.log("\n--- Support Signature (Compact) ---");
  console.log(EmailSignatures.generateSignature("support", { compact: true }));

  // Plain text signature
  console.log("\n--- Plain Text Signature ---");
  console.log(EmailSignatures.generatePlainTextSignature("founder"));

  console.log("\n=== Email Template Example ===\n");

  const testData = {
    client_name: "John Doe",
    website_url: "example.com",
    tier: "Forensic Diagnostic",
    project_id: "FDL-ABC123",
    start_date: "January 15, 2026",
    completion_date: "January 22, 2026",
    portal_url: "https://portal.forensicdatalab.pro/FDL-ABC123",
    support_email: "support@forensicdatalab.pro",
    is_selfService: false,
    service_features: [
      "Complete automated revenue signal audit",
      "Professional implementation by our team",
      "Thorough verification testing",
      "30-day monitoring and support",
    ],
  };

  const email = EmailRenderer.render("welcome", testData);
  console.log("Subject:", email.subject);
  console.log("HTML length:", email.html.length);
}
