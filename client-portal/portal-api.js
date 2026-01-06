/**
 * The Forensic Data Lab - Client Portal API
 * Real-time project updates, reporting, and client communication
 */

const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { TrackingAuditEngine } = require('../platform/audit-engine');
const { ClientOnboardingSystem } = require('./onboarding-system');
const { EmailRenderer } = require('../templates/email-templates');

class PortalAPI {
    constructor(options = {}) {
        this.app = express();
        this.port = options.port || 3001;
        this.wsPort = options.wsPort || 3002;
        this.clients = new Map(); // In production, use database
        this.activeProjects = new Map();
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.startPeriodicTasks();
    }

    setupMiddleware() {
        // Security and rate limiting
        this.app.use(cors({
            origin: ['http://localhost:3000', 'https://forensicdatalab.com'],
            credentials: true
        }));
        
        this.app.use(express.json());
        
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        });
        
        this.app.use('/api/', limiter);
        
        // Authentication middleware
        this.app.use('/api/protected', this.authenticateClient.bind(this));
    }

    setupRoutes() {
        // Public routes
        this.app.get('/api/health', (req, res) => {
            res.json({ status: 'healthy', timestamp: new Date().toISOString() });
        });

        // Client authentication
        this.app.post('/api/auth/login', this.login.bind(this));

        // Protected client routes
        this.app.get('/api/protected/dashboard/:clientId', this.getDashboard.bind(this));
        this.app.get('/api/protected/project/:projectId', this.getProject.bind(this));
        this.app.get('/api/protected/reports/:projectId', this.getReports.bind(this));
        this.app.get('/api/protected/timeline/:projectId', this.getTimeline.bind(this));
        this.app.post('/api/protected/message', this.sendMessage.bind(this));
        this.app.get('/api/protected/communications/:projectId', this.getCommunications.bind(this));

        // Real-time audit endpoints
        this.app.post('/api/protected/audit/start', this.startLiveAudit.bind(this));
        this.app.get('/api/protected/audit/status/:auditId', this.getAuditStatus.bind(this));
        this.app.get('/api/protected/audit/results/:auditId', this.getAuditResults.bind(this));

        // File downloads
        this.app.get('/api/protected/download/report/:projectId', this.downloadReport.bind(this));
        this.app.get('/api/protected/download/guide/:projectId', this.downloadGuide.bind(this));

        // Team communication
        this.app.get('/api/protected/team/:projectId', this.getTeamInfo.bind(this));
        this.app.post('/api/protected/schedule-call', this.scheduleCall.bind(this));
        
        // Admin routes for team
        this.app.post('/api/admin/project/:projectId/update', this.updateProject.bind(this));
        this.app.post('/api/admin/client/:clientId/notify', this.notifyClient.bind(this));
    }

    setupWebSocket() {
        this.wss = new WebSocket.Server({ port: this.wsPort });
        
        this.wss.on('connection', (ws, req) => {
            console.log('🔌 Client connected to WebSocket');
            
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleWebSocketMessage(ws, data);
                } catch (error) {
                    ws.send(JSON.stringify({ error: 'Invalid message format' }));
                }
            });

            ws.on('close', () => {
                console.log('🔌 Client disconnected from WebSocket');
            });
        });

        console.log(`📡 WebSocket server running on port ${this.wsPort}`);
    }

    async handleWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'subscribe_project':
                ws.projectId = data.projectId;
                ws.send(JSON.stringify({
                    type: 'subscription_confirmed',
                    projectId: data.projectId
                }));
                break;
                
            case 'ping':
                ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
                break;
        }
    }

    broadcastToProject(projectId, message) {
        this.wss.clients.forEach(client => {
            if (client.projectId === projectId && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    // Authentication
    async authenticateClient(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No valid authentication token' });
        }
        
        const token = authHeader.split(' ')[1];
        // In production, verify JWT token
        const clientId = token; // Simplified for demo
        
        req.clientId = clientId;
        next();
    }

    async login(req, res) {
        const { email, projectId } = req.body;
        
        // In production, verify credentials against database
        const client = this.mockGetClient(email);
        if (!client) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate session token (in production, use JWT)
        const token = client.id;
        
        res.json({
            token,
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                projects: client.projects || []
            }
        });
    }

    // Dashboard data
    async getDashboard(req, res) {
        const { clientId } = req.params;
        
        try {
            const client = this.mockGetClient(null, clientId);
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            const dashboard = await this.generateDashboardData(client);
            res.json(dashboard);
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).json({ error: 'Failed to load dashboard' });
        }
    }

    async generateDashboardData(client) {
        const projects = client.projects || [this.mockGenerateProject(client)];
        const activeProject = projects.find(p => p.status === 'active') || projects[0];
        
        return {
            client: {
                name: client.name,
                email: client.email,
                tier: client.tier,
                avatar: client.name.split(' ').map(n => n[0]).join('')
            },
            activeProject: {
                id: activeProject.id,
                name: activeProject.name,
                status: activeProject.status,
                progress: activeProject.progress,
                startDate: activeProject.startDate,
                estimatedCompletion: activeProject.estimatedCompletion,
                currentStep: activeProject.currentStep,
                totalSteps: activeProject.totalSteps
            },
            metrics: {
                overallScore: activeProject.auditResults?.overallScore || 22,
                issuesFound: activeProject.auditResults?.totalIssues || 15,
                issuesFixed: activeProject.auditResults?.fixedIssues || 6,
                currentScore: activeProject.auditResults?.currentScore || 72
            },
            recentActivity: this.generateRecentActivity(activeProject),
            team: this.getProjectTeam(activeProject),
            quickActions: this.getQuickActions(activeProject)
        };
    }

    async getProject(req, res) {
        const { projectId } = req.params;
        
        try {
            const project = this.mockGetProject(projectId);
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }

            res.json(project);
        } catch (error) {
            res.status(500).json({ error: 'Failed to load project' });
        }
    }

    async getTimeline(req, res) {
        const { projectId } = req.params;
        
        try {
            const project = this.mockGetProject(projectId);
            const timeline = this.generateTimeline(project);
            res.json(timeline);
        } catch (error) {
            res.status(500).json({ error: 'Failed to load timeline' });
        }
    }

    generateTimeline(project) {
        const baseSteps = [
            { id: 1, name: "Project Kickoff", status: "completed", date: "2024-12-15", duration: "1h" },
            { id: 2, name: "Kickoff Call", status: "completed", date: "2024-12-16", duration: "1h" },
            { id: 3, name: "Comprehensive Audit", status: "completed", date: "2024-12-17", duration: "2h" },
            { id: 4, name: "Implementation Phase 1", status: "completed", date: "2024-12-18", duration: "4h" },
            { id: 5, name: "Implementation Phase 2", status: "completed", date: "2024-12-19", duration: "6h" },
            { id: 6, name: "E-commerce Setup", status: "active", date: "2024-12-20", duration: "6h" },
            { id: 7, name: "Testing & Verification", status: "pending", date: "2024-12-21", duration: "2h" },
            { id: 8, name: "Client Review", status: "pending", date: "2024-12-22", duration: "1h" },
            { id: 9, name: "Go Live", status: "pending", date: "2024-12-23", duration: "1h" },
            { id: 10, name: "30-Day Support", status: "pending", date: "2024-12-23", duration: "ongoing" }
        ];

        return {
            steps: baseSteps,
            currentStep: 6,
            completedSteps: 5,
            totalSteps: baseSteps.length,
            progressPercentage: (5 / baseSteps.length) * 100
        };
    }

    // Real-time audit functionality
    async startLiveAudit(req, res) {
        const { website, options = {} } = req.body;
        
        try {
            const auditEngine = new TrackingAuditEngine();
            const auditId = this.generateAuditId();
            
            // Start audit asynchronously
            this.runAuditWithUpdates(auditId, website, options, req.clientId);
            
            res.json({
                auditId,
                status: 'started',
                estimatedDuration: '2-5 minutes'
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to start audit' });
        }
    }

    async runAuditWithUpdates(auditId, website, options, clientId) {
        const auditEngine = new TrackingAuditEngine();
        
        try {
            // Emit progress updates
            this.emitAuditUpdate(auditId, {
                status: 'running',
                phase: 'initialization',
                progress: 0
            });

            const results = await auditEngine.performFullAudit(website, {
                ...options,
                onProgress: (progress) => {
                    this.emitAuditUpdate(auditId, {
                        status: 'running',
                        phase: progress.phase,
                        progress: progress.percentage,
                        currentAction: progress.action
                    });
                }
            });

            // Store results
            this.activeProjects.set(auditId, {
                status: 'completed',
                results,
                completedAt: new Date().toISOString()
            });

            this.emitAuditUpdate(auditId, {
                status: 'completed',
                progress: 100,
                results: {
                    overallScore: results.overallScore,
                    totalIssues: results.issues.length,
                    criticalIssues: results.issues.filter(i => i.severity === 'critical').length
                }
            });

        } catch (error) {
            console.error('Audit failed:', error);
            
            this.emitAuditUpdate(auditId, {
                status: 'failed',
                error: error.message
            });
        }
    }

    emitAuditUpdate(auditId, update) {
        const message = {
            type: 'audit_update',
            auditId,
            ...update,
            timestamp: new Date().toISOString()
        };

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }

    async getAuditStatus(req, res) {
        const { auditId } = req.params;
        
        const audit = this.activeProjects.get(auditId) || { status: 'not_found' };
        res.json(audit);
    }

    // Communication endpoints
    async sendMessage(req, res) {
        const { projectId, message, type = 'client_message' } = req.body;
        
        try {
            const timestamp = new Date().toISOString();
            const messageData = {
                id: this.generateMessageId(),
                projectId,
                from: 'client',
                type,
                content: message,
                timestamp,
                read: false
            };

            // In production, save to database
            console.log(`💬 Message from client: ${message}`);

            // Notify team via WebSocket
            this.broadcastToProject(projectId, {
                type: 'new_message',
                message: messageData
            });

            // Auto-respond during business hours
            setTimeout(() => {
                const response = this.generateAutoResponse(message);
                if (response) {
                    this.broadcastToProject(projectId, {
                        type: 'team_response',
                        message: {
                            id: this.generateMessageId(),
                            from: 'team',
                            content: response,
                            timestamp: new Date().toISOString()
                        }
                    });
                }
            }, 2000);

            res.json({ success: true, messageId: messageData.id });
        } catch (error) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    }

    generateAutoResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('status') || lowerMessage.includes('progress')) {
            return "Thanks for checking in! Your project is progressing well. Sarah from our team will provide a detailed update within 2 hours. 🎯";
        }
        
        if (lowerMessage.includes('urgent') || lowerMessage.includes('asap')) {
            return "We've marked this as urgent and notified your account manager. Expect a response within 30 minutes. 🚨";
        }
        
        if (lowerMessage.includes('thank')) {
            return "You're very welcome! We're excited to help you achieve perfect tracking. 😊";
        }
        
        return "Thanks for your message! Our team will respond within 4 hours during business hours. 💬";
    }

    // File download endpoints
    async downloadReport(req, res) {
        const { projectId } = req.params;
        
        try {
            const report = await this.generateProjectReport(projectId);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="Forensic Data Lab-Report-${projectId}.pdf"`);
            res.send(report);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate report' });
        }
    }

    async generateProjectReport(projectId) {
        // In production, generate actual PDF
        return Buffer.from(`Mock PDF report for project ${projectId}`, 'utf8');
    }

    // Mock data generators for development
    mockGetClient(email, clientId) {
        return {
            id: clientId || 'TFP-ABC123XYZ',
            name: 'John Doe',
            email: email || 'john@example.com',
            tier: 'surgeon',
            projects: []
        };
    }

    mockGetProject(projectId) {
        return {
            id: projectId,
            name: 'Tracking Surgeon - example.com',
            status: 'active',
            progress: 60,
            startDate: '2024-12-15',
            estimatedCompletion: '2024-12-22',
            currentStep: 6,
            totalSteps: 10,
            auditResults: {
                overallScore: 22,
                currentScore: 72,
                totalIssues: 15,
                fixedIssues: 6,
                criticalIssues: 3,
                highIssues: 5,
                mediumIssues: 7
            }
        };
    }

    mockGenerateProject(client) {
        return {
            id: 'TFP-' + Math.random().toString(36).substr(2, 9),
            name: `${client.tier.toUpperCase()} - example.com`,
            status: 'active',
            progress: Math.floor(Math.random() * 80) + 10,
            startDate: new Date().toISOString().split('T')[0]
        };
    }

    generateRecentActivity(project) {
        return [
            {
                type: 'progress_update',
                title: 'E-commerce events implementation in progress',
                description: 'Adding view_item, add_to_cart, and purchase events',
                timestamp: '2 hours ago',
                icon: '🛒'
            },
            {
                type: 'fix_completed',
                title: 'GTM container configuration updated',
                description: 'Fixed duplicate tags and optimized firing conditions',
                timestamp: '1 day ago',
                icon: '✅'
            },
            {
                type: 'audit_completed',
                title: 'Comprehensive audit finished',
                description: '15 issues identified, implementation roadmap created',
                timestamp: '2 days ago',
                icon: '🔍'
            }
        ];
    }

    getProjectTeam(project) {
        return [
            {
                name: 'Sarah Martinez',
                role: 'Implementation Specialist',
                avatar: 'SM',
                status: 'online'
            },
            {
                name: 'James Chen',
                role: 'Quality Assurance',
                avatar: 'JC',
                status: 'online'
            }
        ];
    }

    getQuickActions(project) {
        return [
            { id: 'download_report', label: 'Download Report', icon: '📊' },
            { id: 'view_live_site', label: 'View Live Site', icon: '🔍' },
            { id: 'implementation_guide', label: 'Implementation Guide', icon: '📋' },
            { id: 'schedule_call', label: 'Schedule Call', icon: '📅' }
        ];
    }

    startPeriodicTasks() {
        // Simulate project updates every minute
        setInterval(() => {
            this.activeProjects.forEach((project, projectId) => {
                if (project.status === 'active' && Math.random() > 0.8) {
                    this.broadcastToProject(projectId, {
                        type: 'progress_update',
                        update: {
                            progress: Math.min(project.progress + 1, 100),
                            timestamp: new Date().toISOString()
                        }
                    });
                }
            });
        }, 60000); // 1 minute
    }

    generateAuditId() {
        return 'AUDIT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    generateMessageId() {
        return 'MSG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    async start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 The Forensic Data Lab Portal API running on port ${this.port}`);
            console.log(`📡 WebSocket server running on port ${this.wsPort}`);
            console.log(`🔗 Dashboard: http://localhost:${this.port}/api/health`);
        });
    }
}

module.exports = { PortalAPI };

// Start server if run directly
if (require.main === module) {
    const api = new PortalAPI();
    api.start();
}