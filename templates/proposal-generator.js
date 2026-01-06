/**
 * The Forensic Data Lab - Proposal Generator
 * Automated proposal generation with dynamic pricing and customization
 */

class ProposalGenerator {
  constructor() {
    this.serviceTiers = {
      forensicDiagnostic: {
        name: "Forensic Diagnostic",
        basePrice: 1450,
        description: "Diagnostic scan for revenue leakage",
        deliveryTime: "48 hours",
        features: [
          "48-hour automated diagnostic scan",
          "Comprehensive revenue leakage report",
          "Priority-ranked signal restoration roadmap",
          "DIY implementation guide",
          "1-hour consultation call",
          "Network request analysis",
          "GA4 property verification",
          "Email support",
        ],
        limitations: [
          "DIY implementation required",
          "Limited direct support",
          "No team training included",
        ],
      },
      signalRestoration: {
        name: "Signal Restoration",
        basePrice: 2950,
        description: "Comprehensive forensic repair",
        deliveryTime: "1 week",
        features: [
          "Everything in Forensic Diagnostic",
          "Complete professional implementation",
          "Automated Verification Loop until 100% success",
          "All e-commerce events setup",
          "30-day monitoring & adjustments",
          "Team training session (1 hour)",
          "Before/after performance report",
          "100% success guarantee",
          "Priority support",
        ],
        limitations: ["Single website only", "Standard compliance review"],
      },
      agencyAssurance: {
        name: "Agency Assurance",
        basePrice: "Custom",
        description: "White-label data integrity for SEO/CRO firms",
        deliveryTime: "Varies",
        features: [
          "Everything in Signal Restoration",
          "Custom tracking architecture design",
          "Multi-property management setup",
          "Compliance review (GDPR, CCPA)",
          "Server-side tracking implementation",
          "Quarterly re-audits (1 year)",
          "Dedicated account manager",
          "Priority support & direct access",
          "Advanced integrations",
          "Team training (multiple sessions)",
        ],
        limitations: [],
      },
      shadowMonitoring: {
        name: "Shadow Monitoring",
        basePrice: 350,
        description: "Automated health alerts and signal maintenance",
        deliveryTime: "Ongoing",
        recurring: true,
        features: [
          "Automated health alerts",
          "Signal degradation detection",
          "Monthly performance reports",
          "Theme update monitoring",
          "Email support",
        ],
        limitations: [],
      },
    };

    this.addOns = {
      rush_delivery: {
        name: "Rush Delivery (24-48h)",
        price: 500,
        applicableTiers: ["forensicDiagnostic", "signalRestoration"],
      },
      additional_sites: {
        name: "Additional Website",
        price: 750,
        applicableTiers: ["signalRestoration", "agencyAssurance"],
      },
      mobile_app_tracking: {
        name: "Mobile App Tracking Setup",
        price: 1200,
        applicableTiers: ["signalRestoration", "agencyAssurance"],
      },
      server_side_tracking: {
        name: "Server-Side Tracking Setup",
        price: 800,
        applicableTiers: ["forensicDiagnostic", "signalRestoration"],
      },
      compliance_audit: {
        name: "GDPR/CCPA Compliance Audit",
        price: 600,
        applicableTiers: ["forensicDiagnostic", "signalRestoration"],
      },
      team_training: {
        name: "Extended Team Training (3 hours)",
        price: 450,
        applicableTiers: ["forensicDiagnostic", "signalRestoration"],
      },
    };

    this.discounts = {
      volume: {
        "3_sites": {
          threshold: 3,
          discount: 0.1,
          description: "10% off for 3+ websites",
        },
        "5_sites": {
          threshold: 5,
          discount: 0.15,
          description: "15% off for 5+ websites",
        },
        "10_sites": {
          threshold: 10,
          discount: 0.2,
          description: "20% off for 10+ websites",
        },
      },
      seasonal: {
        new_year: {
          discount: 0.15,
          description: "New Year Special - 15% off",
          validUntil: "2025-01-31",
        },
        summer: {
          discount: 0.1,
          description: "Summer Promo - 10% off",
          validUntil: "2025-08-31",
        },
      },
      loyalty: {
        returning_client: {
          discount: 0.12,
          description: "Returning Client - 12% off",
        },
        referral: { discount: 0.1, description: "Referral Discount - 10% off" },
      },
    };
  }

  // Generate complete proposal
  generateProposal(clientData, customizations = {}) {
    const proposal = {
      id: this.generateProposalId(),
      timestamp: new Date().toISOString(),
      client: clientData,
      services: [],
      addOns: [],
      pricing: {},
      timeline: {},
      terms: {},
    };

    // Add primary service
    const primaryService = this.buildServicePackage(
      clientData.tier,
      clientData.websites || 1,
      customizations
    );
    proposal.services.push(primaryService);

    // Add selected add-ons
    if (customizations.addOns) {
      customizations.addOns.forEach((addOnId) => {
        const addOn = this.buildAddOnPackage(addOnId, clientData.tier);
        if (addOn) {
          proposal.addOns.push(addOn);
        }
      });
    }

    // Calculate pricing
    proposal.pricing = this.calculatePricing(
      proposal,
      customizations.discounts
    );

    // Generate timeline
    proposal.timeline = this.generateTimeline(clientData.tier, customizations);

    // Add terms and conditions
    proposal.terms = this.generateTerms(clientData.tier);

    return proposal;
  }

  buildServicePackage(tier, websiteCount = 1, customizations = {}) {
    const service = { ...this.serviceTiers[tier] };

    // Adjust pricing for multiple websites
    if (websiteCount > 1) {
      const additionalSites = websiteCount - 1;
      const additionalCost = additionalSites * (service.basePrice * 0.5); // 50% for each additional site
      service.adjustedPrice = service.basePrice + additionalCost;
      service.priceBreakdown = {
        basePrice: service.basePrice,
        additionalSites: additionalSites,
        additionalCost: additionalCost,
        totalPrice: service.adjustedPrice,
      };
    } else {
      service.adjustedPrice = service.basePrice;
    }

    // Add custom features if requested
    if (customizations.customFeatures) {
      service.customFeatures = customizations.customFeatures;
    }

    service.websiteCount = websiteCount;
    return service;
  }

  buildAddOnPackage(addOnId, tier) {
    const addOn = this.addOns[addOnId];
    if (!addOn || !addOn.applicableTiers.includes(tier)) {
      return null;
    }

    return {
      id: addOnId,
      ...addOn,
    };
  }

  calculatePricing(proposal, discountCodes = []) {
    let subtotal = 0;
    let recurringTotal = 0;

    // Calculate service costs
    proposal.services.forEach((service) => {
      subtotal += service.adjustedPrice || service.basePrice;
    });

    // Calculate add-on costs
    proposal.addOns.forEach((addOn) => {
      if (addOn.recurring) {
        recurringTotal += addOn.price;
      } else {
        subtotal += addOn.price;
      }
    });

    // Apply discounts
    let totalDiscount = 0;
    let appliedDiscounts = [];

    discountCodes.forEach((code) => {
      const discount = this.findDiscount(code, proposal);
      if (discount) {
        const discountAmount = subtotal * discount.discount;
        totalDiscount += discountAmount;
        appliedDiscounts.push({
          code: code,
          description: discount.description,
          amount: discountAmount,
          percentage: discount.discount * 100,
        });
      }
    });

    const finalTotal = subtotal - totalDiscount;

    return {
      subtotal: subtotal,
      discounts: appliedDiscounts,
      totalDiscount: totalDiscount,
      oneTimeTotal: finalTotal,
      recurringMonthly: recurringTotal,
      recurringAnnual: recurringTotal * 12,
      savings: totalDiscount > 0 ? totalDiscount : null,
    };
  }

  findDiscount(code, proposal) {
    // Check volume discounts
    const websiteCount = proposal.services[0].websiteCount || 1;
    for (const [key, discount] of Object.entries(this.discounts.volume)) {
      if (websiteCount >= discount.threshold) {
        return discount;
      }
    }

    // Check seasonal discounts
    if (this.discounts.seasonal[code]) {
      const discount = this.discounts.seasonal[code];
      if (new Date() <= new Date(discount.validUntil)) {
        return discount;
      }
    }

    // Check loyalty discounts
    if (this.discounts.loyalty[code]) {
      return this.discounts.loyalty[code];
    }

    return null;
  }

  generateTimeline(tier, customizations = {}) {
    const baseTimelines = {
      forensicDiagnostic: {
        totalDays: 2,
        milestones: [
          {
            name: "Project Setup",
            day: 0,
            description: "Onboarding and access setup",
          },
          {
            name: "Automated Audit",
            day: 1,
            description: "Comprehensive tracking analysis",
          },
          {
            name: "Report Delivery",
            day: 2,
            description: "Detailed report and consultation scheduling",
          },
        ],
      },
      signalRestoration: {
        totalDays: 7,
        milestones: [
          {
            name: "Project Kickoff",
            day: 1,
            description: "Alignment call and access setup",
          },
          {
            name: "Audit Complete",
            day: 2,
            description: "Issues identified and prioritized",
          },
          {
            name: "Implementation Start",
            day: 3,
            description: "Critical fixes begin",
          },
          {
            name: "E-commerce Setup",
            day: 5,
            description: "Event tracking implementation",
          },
          {
            name: "Testing & Verification",
            day: 6,
            description: "100% success validation",
          },
          {
            name: "Training & Handoff",
            day: 7,
            description: "Team training and project completion",
          },
        ],
      },
      agencyAssurance: {
        totalDays: 21,
        milestones: [
          {
            name: "Discovery & Planning",
            day: 3,
            description: "Requirements and architecture design",
          },
          {
            name: "Architecture Review",
            day: 7,
            description: "Stakeholder approval of design",
          },
          {
            name: "Implementation Phase 1",
            day: 14,
            description: "Core infrastructure setup",
          },
          {
            name: "Implementation Phase 2",
            day: 18,
            description: "Advanced features and integrations",
          },
          {
            name: "Testing & Training",
            day: 20,
            description: "Validation and team enablement",
          },
          {
            name: "Go Live",
            day: 21,
            description: "Production deployment and monitoring setup",
          },
        ],
      },
    };

    const timeline = { ...baseTimelines[tier] };

    // Adjust for rush delivery
    if (
      customizations.addOns &&
      customizations.addOns.includes("rush_delivery")
    ) {
      timeline.totalDays = Math.max(1, Math.floor(timeline.totalDays / 2));
      timeline.rushDelivery = true;
    }

    // Calculate actual dates
    const startDate = customizations.startDate
      ? new Date(customizations.startDate)
      : new Date();
    timeline.startDate = startDate.toISOString().split("T")[0];

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + timeline.totalDays);
    timeline.endDate = endDate.toISOString().split("T")[0];

    // Add business days calculation (excluding weekends)
    timeline.businessDays = this.calculateBusinessDays(startDate, endDate);

    return timeline;
  }

  calculateBusinessDays(startDate, endDate) {
    let businessDays = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not weekend
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return businessDays;
  }

  generateTerms(tier) {
    const baseTerms = {
      payment: {
        structure: "50% upfront, 50% on completion",
        methods: ["Credit Card", "ACH Transfer", "Wire Transfer"],
        currency: "USD",
        invoiceTerms: "Net 15",
      },
      guarantees: [
        "100% success rate guarantee",
        "Complete implementation verification",
        "30-day support included",
      ],
      scope: [
        "Tracking audit and implementation for specified website(s)",
        "GA4 and GTM configuration optimization",
        "E-commerce event tracking setup",
        "Documentation and training materials",
      ],
      exclusions: [
        "Website development or design changes",
        "Third-party platform integrations beyond standard tracking",
        "Custom reporting or dashboard development",
        "Ongoing maintenance beyond included support period",
      ],
      cancellation: "48-hour cancellation policy before project start",
      liability: "Limited to project cost",
      confidentiality: "Full NDA coverage for all client data",
    };

    // Tier-specific terms
    if (tier === "agencyAssurance") {
      baseTerms.payment.structure =
        "33% upfront, 33% at midpoint, 34% on completion";
      baseTerms.guarantees.push("Quarterly re-audits for 12 months");
      baseTerms.guarantees.push("Dedicated account manager");
      baseTerms.scope.push("Custom tracking architecture design");
      baseTerms.scope.push("Compliance review and documentation");
    }

    return baseTerms;
  }

  // Generate proposal document (HTML)
  generateProposalDocument(proposal) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>The Forensic Data Lab Proposal - ${
              proposal.client.company || proposal.client.name
            }</title>
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 2rem; border-radius: 10px; text-align: center; margin-bottom: 2rem; }
                .section { margin-bottom: 2rem; }
                .pricing-table { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border: 2px solid #e9ecef; }
                .feature-list { list-style: none; padding: 0; }
                .feature-list li { padding: 0.5rem 0; border-bottom: 1px solid #eee; }
                .feature-list li:before { content: "✓"; color: #28a745; font-weight: bold; margin-right: 10px; }
                .timeline { background: #f0f9ff; padding: 1.5rem; border-radius: 8px; }
                .milestone { margin-bottom: 1rem; padding: 1rem; background: white; border-radius: 5px; border-left: 4px solid #2563eb; }
                .pricing-breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
                .price-item { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px dotted #ccc; }
                .total-price { font-size: 1.5rem; font-weight: bold; color: #2563eb; text-align: center; padding: 1rem; background: #f0f9ff; border-radius: 8px; margin: 1rem 0; }
                .cta-button { background: #28a745; color: white; padding: 1rem 2rem; border: none; border-radius: 5px; font-size: 1.1rem; text-decoration: none; display: inline-block; margin: 1rem 0; }
                .guarantee { background: #d4edda; padding: 1rem; border-radius: 5px; border: 1px solid #c3e6cb; margin: 1rem 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎯 The Forensic Data Lab Proposal</h1>
                <p>Professional Tracking Audit & Implementation</p>
                <p><strong>Proposal ID:</strong> ${proposal.id}</p>
            </div>

            <div class="section">
                <h2>Client Information</h2>
                <p><strong>Name:</strong> ${proposal.client.name}</p>
                ${
                  proposal.client.company
                    ? `<p><strong>Company:</strong> ${proposal.client.company}</p>`
                    : ""
                }
                <p><strong>Website:</strong> ${proposal.client.website}</p>
                <p><strong>Email:</strong> ${proposal.client.email}</p>
            </div>

            <div class="section">
                <h2>📋 Recommended Service Package</h2>
                ${this.renderServiceSection(proposal.services[0])}
            </div>

            ${
              proposal.addOns.length > 0
                ? `
            <div class="section">
                <h2>🚀 Additional Services</h2>
                ${proposal.addOns
                  .map((addOn) => this.renderAddOnSection(addOn))
                  .join("")}
            </div>
            `
                : ""
            }

            <div class="section">
                <h2>💰 Investment Summary</h2>
                <div class="pricing-table">
                    ${this.renderPricingBreakdown(proposal.pricing)}
                    <div class="total-price">
                        Total Investment: $${proposal.pricing.oneTimeTotal.toLocaleString()}
                        ${
                          proposal.pricing.recurringMonthly > 0
                            ? `<br><small>+ $${proposal.pricing.recurringMonthly}/month ongoing</small>`
                            : ""
                        }
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>📅 Project Timeline</h2>
                <div class="timeline">
                    <p><strong>Start Date:</strong> ${
                      proposal.timeline.startDate
                    }</p>
                    <p><strong>Completion:</strong> ${
                      proposal.timeline.endDate
                    } (${proposal.timeline.totalDays} days)</p>
                    
                    <h3>Key Milestones:</h3>
                    ${proposal.timeline.milestones
                      .map(
                        (milestone) => `
                        <div class="milestone">
                            <strong>Day ${milestone.day}: ${milestone.name}</strong><br>
                            ${milestone.description}
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>

            <div class="section guarantee">
                <h2>Our Revenue Recovery Guarantee</h2>
                <ul>
                    ${proposal.terms.guarantees
                      .map((guarantee) => `<li>${guarantee}</li>`)
                      .join("")}
                </ul>
            </div>

            <div class="section">
                <h2>📞 Next Steps</h2>
                <p>Ready to achieve 100% tracking accuracy? Here's how to get started:</p>
                <ol>
                    <li><strong>Review this proposal</strong> - Any questions? Just reply to discuss</li>
                    <li><strong>Accept & Sign</strong> - Click the button below to accept</li>
                    <li><strong>Project Kickoff</strong> - We'll schedule your kickoff call within 24 hours</li>
                </ol>
                
                <div style="text-align: center; margin: 2rem 0;">
                    <a href="${this.generateAcceptanceUrl(
                      proposal.id
                    )}" class="cta-button">
                        ✅ Accept Proposal & Get Started
                    </a>
                </div>
            </div>

            <div class="section">
                <h2>❓ Frequently Asked Questions</h2>
                <div>
                    <p><strong>Q: What if you can't fix all the tracking issues?</strong><br>
                    A: We guarantee 100% success. If we can't fix an issue, you don't pay for that portion of the work.</p>
                    
                    <p><strong>Q: How do I know the tracking is actually working?</strong><br>
                    A: We provide comprehensive before/after verification reports and live testing demonstrations.</p>
                    
                    <p><strong>Q: What happens if my tracking breaks after you fix it?</strong><br>
                    A: Our ${
                      proposal.services[0].name === "Tracking Detective"
                        ? "30-day"
                        : "30-day"
                    } support period covers any issues that arise post-implementation.</p>
                </div>
            </div>

            <div style="text-align: center; color: #6c757d; font-size: 0.9rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #eee;">
                <p>The Forensic Data Lab - We don't stop until your tracking is perfect</p>
                <p>Questions? Email ${
                  proposal.client.contactEmail || "hello@forensicdatalab.com"
                } | Call (555) TRACKING</p>
                <p>Proposal valid for 30 days from ${
                  proposal.timestamp.split("T")[0]
                }</p>
            </div>
        </body>
        </html>
        `;
  }

  renderServiceSection(service) {
    return `
        <div class="pricing-table">
            <h3>${service.name} - $${
      service.adjustedPrice
        ? service.adjustedPrice.toLocaleString()
        : service.basePrice.toLocaleString()
    }</h3>
            <p>${service.description}</p>
            <p><strong>Delivery Time:</strong> ${service.deliveryTime}</p>
            
            ${
              service.priceBreakdown
                ? `
            <h4>Price Breakdown:</h4>
            <div class="price-item">
                <span>Base Service (1 website)</span>
                <span>$${service.priceBreakdown.basePrice.toLocaleString()}</span>
            </div>
            <div class="price-item">
                <span>Additional Websites (${
                  service.priceBreakdown.additionalSites
                })</span>
                <span>$${service.priceBreakdown.additionalCost.toLocaleString()}</span>
            </div>
            <div class="price-item" style="font-weight: bold; border-top: 2px solid #ccc; margin-top: 0.5rem; padding-top: 0.5rem;">
                <span>Total</span>
                <span>$${service.priceBreakdown.totalPrice.toLocaleString()}</span>
            </div>
            `
                : ""
            }
            
            <h4>What's Included:</h4>
            <ul class="feature-list">
                ${service.features
                  .map((feature) => `<li>${feature}</li>`)
                  .join("")}
            </ul>
            
            ${
              service.customFeatures
                ? `
            <h4>Custom Features for Your Project:</h4>
            <ul class="feature-list">
                ${service.customFeatures
                  .map((feature) => `<li>${feature}</li>`)
                  .join("")}
            </ul>
            `
                : ""
            }
        </div>
        `;
  }

  renderAddOnSection(addOn) {
    return `
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
            <h4>${addOn.name} - $${addOn.price.toLocaleString()}${
      addOn.recurring ? "/month" : ""
    }</h4>
            <p>${addOn.description || "Additional service enhancement"}</p>
        </div>
        `;
  }

  renderPricingBreakdown(pricing) {
    let html = `
        <div class="price-item">
            <span>Service Package</span>
            <span>$${pricing.subtotal.toLocaleString()}</span>
        </div>
        `;

    if (pricing.discounts.length > 0) {
      pricing.discounts.forEach((discount) => {
        html += `
                <div class="price-item" style="color: #28a745;">
                    <span>${discount.description}</span>
                    <span>-$${discount.amount.toLocaleString()}</span>
                </div>
                `;
      });
    }

    if (pricing.recurringMonthly > 0) {
      html += `
            <div class="price-item">
                <span>Monthly Services</span>
                <span>$${pricing.recurringMonthly.toLocaleString()}/month</span>
            </div>
            `;
    }

    return html;
  }

  generateAcceptanceUrl(proposalId) {
    return `https://forensicdatalab.com/accept/${proposalId}`;
  }

  generateProposalId() {
    return (
      "PROP-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substr(2, 5).toUpperCase()
    );
  }

  // Proposal analytics and tracking
  trackProposalMetrics(proposal, event) {
    const metrics = {
      proposalId: proposal.id,
      event: event,
      timestamp: new Date().toISOString(),
      tier: proposal.services[0].name,
      value: proposal.pricing.oneTimeTotal,
      client: proposal.client.email,
    };

    console.log("Proposal metric tracked:", metrics);
    // In production, send to analytics service
  }
}

module.exports = { ProposalGenerator };

// Example usage
if (require.main === module) {
  const generator = new ProposalGenerator();

  const testClient = {
    name: "John Smith",
    company: "Example Corp",
    email: "john@example.com",
    website: "example.com",
    tier: "signalRestoration",
    websites: 2,
  };

  const customizations = {
    addOns: ["rush_delivery", "compliance_audit"],
    discounts: ["new_year"],
    startDate: "2024-12-20",
  };

  const proposal = generator.generateProposal(testClient, customizations);
  console.log("Generated proposal:", JSON.stringify(proposal, null, 2));

  const document = generator.generateProposalDocument(proposal);
  require("fs").writeFileSync("/tmp/sample-proposal.html", document);
  console.log("Sample proposal saved to /tmp/sample-proposal.html");
}
