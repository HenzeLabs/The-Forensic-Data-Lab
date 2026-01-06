/**
 * The Forensic Data Lab - API Server
 * RESTful API for the audit platform
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { TrackingAuditEngine } = require('./audit-engine');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../website')));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many audit requests, please try again later.'
});

const auditLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 full audits per hour
    message: 'Audit limit reached. Please wait before requesting another audit.'
});

// In-memory storage (replace with database in production)
const auditResults = new Map();
const leads = [];

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Quick audit endpoint (free tier)
app.post('/api/quick-audit', limiter, async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url || !isValidUrl(url)) {
            return res.status(400).json({ error: 'Valid URL is required' });
        }
        
        console.log(`🔍 Quick audit requested for: ${url}`);
        
        // Perform lightweight audit
        const engine = new TrackingAuditEngine({ 
            timeout: 15000, 
            headless: true 
        });
        
        const results = await engine.performQuickAudit(url);
        
        // Store results with expiration
        const auditId = generateAuditId();
        auditResults.set(auditId, {
            ...results,
            type: 'quick',
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        });
        
        res.json({
            auditId,
            score: results.overallScore,
            issuesCount: results.issues.length,
            url: results.url,
            summary: generateQuickSummary(results)
        });
        
    } catch (error) {
        console.error('Quick audit error:', error);
        res.status(500).json({ error: 'Audit failed. Please try again.' });
    }
});

// Full audit endpoint (paid tiers)
app.post('/api/full-audit', auditLimiter, async (req, res) => {
    try {
        const { url, tier = 'detective', email } = req.body;
        
        if (!url || !isValidUrl(url)) {
            return res.status(400).json({ error: 'Valid URL is required' });
        }
        
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required for full audit' });
        }
        
        console.log(`🔄 Full audit requested for: ${url} (${tier})`);
        
        // Perform comprehensive audit
        const engine = new TrackingAuditEngine({ 
            timeout: 30000, 
            headless: true 
        });
        
        const results = await engine.performFullAudit(url);
        
        // Store results
        const auditId = generateAuditId();
        auditResults.set(auditId, {
            ...results,
            type: 'full',
            tier,
            email,
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        });
        
        // Capture lead
        leads.push({
            email,
            tier,
            auditId,
            url,
            score: results.overallScore,
            issuesCount: results.issues.length,
            timestamp: new Date().toISOString()
        });
        
        res.json({
            auditId,
            score: results.overallScore,
            issuesCount: results.issues.length,
            url: results.url,
            downloadUrl: `/api/audit/${auditId}/report`,
            nextSteps: generateNextSteps(tier, results)
        });
        
    } catch (error) {
        console.error('Full audit error:', error);
        res.status(500).json({ error: 'Audit failed. Please try again.' });
    }
});

// Get audit results
app.get('/api/audit/:id', (req, res) => {
    const { id } = req.params;
    const audit = auditResults.get(id);
    
    if (!audit) {
        return res.status(404).json({ error: 'Audit not found' });
    }
    
    if (Date.now() > audit.expiresAt) {
        auditResults.delete(id);
        return res.status(410).json({ error: 'Audit expired' });
    }
    
    res.json(audit);
});

// Download audit report
app.get('/api/audit/:id/report', (req, res) => {
    const { id } = req.params;
    const { format = 'json' } = req.query;
    const audit = auditResults.get(id);
    
    if (!audit) {
        return res.status(404).json({ error: 'Audit not found' });
    }
    
    if (Date.now() > audit.expiresAt) {
        auditResults.delete(id);
        return res.status(410).json({ error: 'Audit expired' });
    }
    
    if (format === 'pdf') {
        // Generate PDF report (implement with puppeteer)
        return res.status(501).json({ error: 'PDF format not yet implemented' });
    }
    
    if (format === 'html') {
        const engine = new TrackingAuditEngine();
        engine.auditResults = audit;
        engine.generateHTMLReport().then(html => {
            res.set('Content-Type', 'text/html');
            res.send(html);
        });
    } else {
        res.set('Content-Type', 'application/json');
        res.set('Content-Disposition', `attachment; filename="audit-report-${id}.json"`);
        res.json(audit);
    }
});

// Lead capture endpoint
app.post('/api/leads', (req, res) => {
    try {
        const { email, plan, source, utm_campaign, utm_source, utm_medium } = req.body;
        
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }
        
        const lead = {
            email,
            plan,
            source,
            utm_campaign,
            utm_source,
            utm_medium,
            timestamp: new Date().toISOString(),
            ip: req.ip
        };
        
        leads.push(lead);
        
        // Send to CRM/email service (implement integration)
        console.log('New lead captured:', lead);
        
        res.json({ status: 'success', message: 'Lead captured successfully' });
        
    } catch (error) {
        console.error('Lead capture error:', error);
        res.status(500).json({ error: 'Failed to capture lead' });
    }
});

// Calendar booking endpoint
app.post('/api/book-consultation', (req, res) => {
    try {
        const { email, plan, preferredTime, message } = req.body;
        
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }
        
        const booking = {
            email,
            plan,
            preferredTime,
            message,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Send to calendar system (implement Calendly integration)
        console.log('Consultation booking:', booking);
        
        // Generate calendar links based on plan
        const calendarLinks = {
            detective: 'https://calendly.com/forensic-data-lab/detective-consultation',
            surgeon: 'https://calendly.com/forensic-data-lab/surgeon-consultation',
            architect: 'https://calendly.com/forensic-data-lab/architect-consultation'
        };
        
        res.json({ 
            status: 'success', 
            message: 'Consultation request received',
            calendarLink: calendarLinks[plan] || calendarLinks.detective
        });
        
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Failed to book consultation' });
    }
});

// Analytics endpoint
app.get('/api/analytics/dashboard', (req, res) => {
    try {
        const stats = {
            totalAudits: auditResults.size,
            totalLeads: leads.length,
            averageScore: calculateAverageScore(),
            commonIssues: getCommonIssues(),
            conversionRate: calculateConversionRate(),
            recentActivity: getRecentActivity()
        };
        
        res.json(stats);
        
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to get analytics' });
    }
});

// Admin endpoints (implement authentication in production)
app.get('/admin/audits', (req, res) => {
    const audits = Array.from(auditResults.values()).map(audit => ({
        url: audit.url,
        score: audit.overallScore,
        issuesCount: audit.issues.length,
        type: audit.type,
        tier: audit.tier,
        timestamp: audit.timestamp
    }));
    
    res.json(audits);
});

app.get('/admin/leads', (req, res) => {
    res.json(leads);
});

// Utility functions
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generateAuditId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function generateQuickSummary(results) {
    const criticalIssues = results.issues.filter(issue => issue.severity === 'critical').length;
    const highIssues = results.issues.filter(issue => issue.severity === 'high').length;
    
    if (results.overallScore >= 80) {
        return "Your tracking is in good shape! Minor optimizations recommended.";
    } else if (results.overallScore >= 60) {
        return `${criticalIssues + highIssues} priority issues found. Tracking improvements needed.`;
    } else {
        return `${criticalIssues} critical issues detected. Immediate attention required.`;
    }
}

function generateNextSteps(tier, results) {
    const steps = [];
    
    if (tier === 'detective') {
        steps.push("Download your comprehensive audit report");
        steps.push("Review the priority-ranked fix list");
        steps.push("Follow the DIY implementation guide");
        steps.push("Schedule optional 1-hour consultation call");
    } else if (tier === 'surgeon') {
        steps.push("Our team will implement all fixes within 1 week");
        steps.push("You'll receive daily progress updates");
        steps.push("Complete verification testing included");
        steps.push("30-day monitoring and adjustments");
    } else if (tier === 'architect') {
        steps.push("Dedicated account manager assigned");
        steps.push("Custom tracking architecture design");
        steps.push("Enterprise implementation timeline");
        steps.push("Quarterly re-audits scheduled");
    }
    
    return steps;
}

function calculateAverageScore() {
    const audits = Array.from(auditResults.values());
    if (audits.length === 0) return 0;
    
    const total = audits.reduce((sum, audit) => sum + audit.overallScore, 0);
    return Math.round(total / audits.length);
}

function getCommonIssues() {
    const issueCount = {};
    
    Array.from(auditResults.values()).forEach(audit => {
        audit.issues.forEach(issue => {
            issueCount[issue.title] = (issueCount[issue.title] || 0) + 1;
        });
    });
    
    return Object.entries(issueCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([title, count]) => ({ title, count }));
}

function calculateConversionRate() {
    const totalAudits = auditResults.size;
    const totalLeads = leads.length;
    
    if (totalAudits === 0) return 0;
    return Math.round((totalLeads / totalAudits) * 100);
}

function getRecentActivity() {
    const recent = Array.from(auditResults.values())
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
        .map(audit => ({
            url: audit.url,
            score: audit.overallScore,
            timestamp: audit.timestamp
        }));
    
    return recent;
}

// Cleanup expired audits
setInterval(() => {
    const now = Date.now();
    for (const [id, audit] of auditResults.entries()) {
        if (now > audit.expiresAt) {
            auditResults.delete(id);
        }
    }
}, 60 * 60 * 1000); // Every hour

// Error handling
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 The Forensic Data Lab API server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔍 API docs: http://localhost:${PORT}/api/health`);
});

module.exports = app;