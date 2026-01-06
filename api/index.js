/**
 * Vercel Serverless Function for The Forensic Data Lab API
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'The Forensic Data Lab API',
        timestamp: new Date().toISOString() 
    });
});

// Mock audit endpoint
app.post('/api/audit/quick', (req, res) => {
    const { website } = req.body;
    
    if (!website) {
        return res.status(400).json({ error: 'Website URL required' });
    }
    
    // Mock audit results
    const mockResults = {
        audit_id: 'AUDIT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        website: website,
        overall_score: Math.floor(Math.random() * 40) + 15, // 15-55% (realistic broken range)
        total_issues: Math.floor(Math.random() * 20) + 8, // 8-28 issues
        critical_issues: Math.floor(Math.random() * 8) + 2, // 2-10 critical
        estimated_monthly_loss: Math.floor(Math.random() * 50000) + 10000, // $10K-$60K
        timestamp: new Date().toISOString(),
        issues: [
            { title: "Missing E-commerce Events", severity: "critical", impact: "High" },
            { title: "Broken Cross-domain Tracking", severity: "high", impact: "Medium" },
            { title: "GA4 Property Misconfiguration", severity: "critical", impact: "High" },
            { title: "GTM Container Errors", severity: "medium", impact: "Low" }
        ]
    };
    
    // Simulate processing time
    setTimeout(() => {
        res.json({
            success: true,
            audit: mockResults,
            message: "Audit completed successfully",
            next_steps: {
                full_report: `/api/audit/${mockResults.audit_id}/report`,
                book_call: "/sales#contact",
                get_quote: "/sales#pricing"
            }
        });
    }, 2000);
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, company, message, phone } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email required' });
    }
    
    // In production, save to database and send notifications
    console.log('📧 New contact form submission:', { name, email, company });
    
    res.json({
        success: true,
        message: 'Thank you for your inquiry! We\'ll be in touch within 2 hours.',
        next_steps: {
            calendar: 'https://calendly.com/forensic-data-lab',
            audit: '/api/audit/quick'
        }
    });
});

// Lead capture endpoint
app.post('/api/leads', (req, res) => {
    const { email, website, source = 'website' } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email required' });
    }
    
    const leadId = 'LEAD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // In production, save to CRM and trigger email sequence
    console.log('🎯 New lead captured:', { leadId, email, website, source });
    
    res.json({
        success: true,
        lead_id: leadId,
        message: 'Welcome to The Forensic Data Lab! Check your email for next steps.',
        redirect: '/sales'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        available_endpoints: [
            'GET /api/health',
            'POST /api/audit/quick',
            'POST /api/contact',
            'POST /api/leads'
        ]
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;