// The Forensic Data Lab - Landing Page JavaScript

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  initializeAnimations();
});

// Event Listeners
function initializeEventListeners() {
  // Free audit form
  const auditForm = document.getElementById("free-audit-form");
  if (auditForm) {
    auditForm.addEventListener("submit", handleFreeAudit);
  }

  // Pricing plan selection
  const planButtons = document.querySelectorAll(".select-plan");
  planButtons.forEach((button) => {
    button.addEventListener("click", handlePlanSelection);
  });

  // Impact calculator
  const calculateButton = document.querySelector(".calculator-form button");
  if (calculateButton) {
    calculateButton.addEventListener("click", calculateLoss);
  }

  // Smooth scrolling for navigation
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", smoothScroll);
  });

  // CTA buttons
  const ctaButtons = document.querySelectorAll('[onclick="startAudit()"]');
  ctaButtons.forEach((button) => {
    button.addEventListener("click", startAudit);
  });
}

// Free Audit Handler
async function handleFreeAudit(event) {
  event.preventDefault();

  const websiteUrl = document.getElementById("website-url").value;
  const resultsDiv = document.getElementById("scan-results");
  const submitButton = event.target.querySelector("button");

  // Validate URL
  if (!isValidUrl(websiteUrl)) {
    showError("Please enter a valid website URL");
    return;
  }

  // Show loading state
  submitButton.innerHTML = "Scanning...";
  submitButton.disabled = true;

  try {
    // Simulate audit scan (replace with actual API call)
    const results = await performQuickAudit(websiteUrl);
    displayAuditResults(results, resultsDiv);
  } catch (error) {
    console.error("Audit error:", error);
    showError("Unable to scan website. Please try again or contact support.");
  } finally {
    // Reset button
    submitButton.innerHTML = "Scan My Tracking";
    submitButton.disabled = false;
  }
}

// Quick Audit Simulation (replace with actual backend API)
async function performQuickAudit(url) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Simulate audit results
  const issues = [
    "GA4 property configuration needs review",
    "Missing e-commerce tracking events",
    "GTM container optimization needed",
    "Cross-domain tracking issues detected",
  ];

  const score = Math.floor(Math.random() * 40) + 20; // Random score 20-60%

  return {
    url: url,
    score: score,
    issues: issues.slice(0, Math.floor(Math.random() * 4) + 1),
    recommendations: [
      "Update GA4 measurement ID",
      "Implement e-commerce event tracking",
      "Optimize GTM container configuration",
      "Fix cross-domain tracking setup",
    ],
  };
}

// Display Audit Results
function displayAuditResults(results, container) {
  const scoreColor =
    results.score >= 80 ? "success" : results.score >= 60 ? "warning" : "error";

  container.innerHTML = `
        <div class="scan-results-header">
            <h3>Quick Audit Results for ${results.url}</h3>
            <div class="score-display">
                <div class="score-circle text-${scoreColor}">
                    <span class="score-number">${results.score}%</span>
                    <span class="score-label">Tracking Health</span>
                </div>
            </div>
        </div>
        
        <div class="issues-found">
            <h4>Issues Found (${results.issues.length})</h4>
            <ul class="issues-list">
                ${results.issues.map((issue) => `<li>- ${issue}</li>`).join("")}
            </ul>
        </div>
        
        <div class="recommendations">
            <h4>Quick Recommendations</h4>
            <ul class="recommendations-list">
                ${results.recommendations
                  .slice(0, 3)
                  .map((rec) => `<li>- ${rec}</li>`)
                  .join("")}
            </ul>
        </div>
        
        <div class="next-steps">
            <h4>Get Complete Fix</h4>
            <p>This quick scan found ${
              results.issues.length
            } issues. Our full Automated Verification Loop audit finds 10-15+ issues on average and fixes them all.</p>
            <div class="cta-buttons">
                <button class="cta-primary" onclick="selectPlan('surgeon')">
                    Get Complete Fix ($1,497)
                </button>
                <button class="cta-secondary" onclick="selectPlan('detective')">
                    DIY Guide ($497)
                </button>
            </div>
        </div>
    `;

  container.classList.remove("hidden");
  container.scrollIntoView({ behavior: "smooth" });
}

// Plan Selection Handler
function handlePlanSelection(event) {
  const plan = event.target.dataset.plan;
  selectPlan(plan);
}

function selectPlan(plan) {
  // Track plan selection
  if (typeof gtag !== "undefined") {
    gtag("event", "plan_selected", {
      plan_type: plan,
      event_category: "conversion",
    });
  }

  // Redirect to appropriate action based on plan
  switch (plan) {
    case "detective":
      window.open(
        "https://calendly.com/forensic-data-lab/detective-consultation",
        "_blank"
      );
      break;
    case "surgeon":
      window.open(
        "https://calendly.com/forensic-data-lab/surgeon-consultation",
        "_blank"
      );
      break;
    case "architect":
      window.open(
        "https://calendly.com/forensic-data-lab/architect-consultation",
        "_blank"
      );
      break;
    default:
      startAudit();
  }
}

// Impact Calculator
function calculateLoss() {
  const monthlyRevenue = parseFloat(
    document.getElementById("monthly-revenue").value
  );
  const resultDiv = document.getElementById("loss-result");

  if (!monthlyRevenue || monthlyRevenue <= 0) {
    resultDiv.innerHTML = "Please enter a valid monthly revenue amount.";
    return;
  }

  // Calculate potential losses
  const optimizationLoss = monthlyRevenue * 0.2; // 20% optimization loss
  const attributionLoss = monthlyRevenue * 0.15; // 15% attribution loss
  const totalMonthlyLoss = optimizationLoss + attributionLoss;
  const annualLoss = totalMonthlyLoss * 12;

  resultDiv.innerHTML = `
        <h4>Your Estimated Revenue Loss</h4>
        <div class="loss-breakdown">
            <p><strong>Monthly Loss:</strong> $${totalMonthlyLoss.toLocaleString()}</p>
            <p><strong>Annual Loss:</strong> $${annualLoss.toLocaleString()}</p>
            <p class="loss-note">Based on 20% optimization loss + 15% attribution loss from broken tracking</p>
        </div>
        <button class="cta-primary" onclick="startAudit()" style="margin-top: 1rem;">
            Stop Losing Money - Get Audit
        </button>
    `;
}

// Start Audit Action
function startAudit() {
  // Track CTA click
  if (typeof gtag !== "undefined") {
    gtag("event", "start_audit_click", {
      event_category: "engagement",
    });
  }

  // Scroll to audit section
  const auditSection = document.getElementById("audit");
  if (auditSection) {
    auditSection.scrollIntoView({ behavior: "smooth" });

    // Focus on the URL input
    setTimeout(() => {
      const urlInput = document.getElementById("website-url");
      if (urlInput) {
        urlInput.focus();
      }
    }, 500);
  }
}

// Smooth Scrolling
function smoothScroll(event) {
  event.preventDefault();
  const targetId = event.target.getAttribute("href");
  const targetSection = document.querySelector(targetId);

  if (targetSection) {
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Animations
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fadeIn");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".problem-item, .process-step, .pricing-card"
  );
  animatedElements.forEach((el) => observer.observe(el));

  // Pulse animation for CTA buttons
  const ctaButtons = document.querySelectorAll(".cta-primary");
  setInterval(() => {
    ctaButtons.forEach((btn) => {
      btn.classList.add("pulse");
      setTimeout(() => btn.classList.remove("pulse"), 1000);
    });
  }, 5000);
}

// Utility Functions
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
        <div style="background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
            ${message}
        </div>
    `;

  // Insert after the form
  const form = document.getElementById("free-audit-form");
  if (form && form.nextSibling) {
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
  }

  // Remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 5000);
}

// Lead Capture
function captureLeadInfo(email, plan = null) {
  const leadData = {
    email: email,
    plan: plan,
    timestamp: new Date().toISOString(),
    source: "website",
    page: window.location.pathname,
  };

  // Send to backend (replace with actual endpoint)
  fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  }).catch((error) => {
    console.error("Lead capture error:", error);
  });

  // Track with analytics
  if (typeof gtag !== "undefined") {
    gtag("event", "lead_capture", {
      email: email,
      plan: plan,
      event_category: "conversion",
    });
  }
}

// Exit Intent Detection
document.addEventListener("mouseleave", function (event) {
  if (event.clientY <= 0) {
    // User is moving cursor to leave page
    showExitIntentModal();
  }
});

function showExitIntentModal() {
  // Only show once per session
  if (sessionStorage.getItem("exitIntentShown")) {
    return;
  }

  sessionStorage.setItem("exitIntentShown", "true");

  // Create modal (you can enhance this)
  const modal = document.createElement("div");
  modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; text-align: center;">
                <h3>Wait! Is Your Tracking Broken?</h3>
                <p>Get a free 5-minute audit before you leave. Most sites have 5+ critical tracking issues.</p>
                <button onclick="this.closest('div').remove(); startAudit();" style="background: #2563eb; color: white; border: none; padding: 1rem 2rem; border-radius: 0.5rem; margin: 0.5rem; cursor: pointer;">
                    Get Free Audit
                </button>
                <button onclick="this.closest('div').remove();" style="background: #6b7280; color: white; border: none; padding: 1rem 2rem; border-radius: 0.5rem; margin: 0.5rem; cursor: pointer;">
                    No Thanks
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
}

// Chat Widget Integration (placeholder)
function initializeChatWidget() {
  // Replace with your preferred chat solution (Intercom, Crisp, etc.)
  console.log("Chat widget would be initialized here");
}

// Analytics Integration
function initializeAnalytics() {
  // Google Analytics 4
  if (typeof gtag !== "undefined") {
    // Track page view
    gtag("config", "GA_MEASUREMENT_ID", {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener("scroll", () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          gtag("event", "scroll", {
            event_category: "engagement",
            event_label: `${scrollPercent}%`,
          });
        }
      }
    });
  }
}

// Initialize analytics when page loads
document.addEventListener("DOMContentLoaded", initializeAnalytics);

// Performance Monitoring
function trackPerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      const perfData = performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;

      if (typeof gtag !== "undefined") {
        gtag("event", "timing_complete", {
          name: "load_time",
          value: loadTime,
        });
      }
    });
  }
}

trackPerformance();
