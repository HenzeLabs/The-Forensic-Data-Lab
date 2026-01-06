/**
 * TrackingFix Pro - Real-time Notification System
 * Handles all client notifications, updates, and communication workflows
 */

const EventEmitter = require('events');
const { EmailRenderer } = require('../templates/email-templates');

class NotificationSystem extends EventEmitter {
    constructor(options = {}) {
        super();
        this.channels = {
            email: true,
            sms: options.smsEnabled || false,
            webPush: options.webPushEnabled || true,
            websocket: true,
            slack: options.slackEnabled || false
        };
        
        this.templates = this.loadNotificationTemplates();
        this.subscribers = new Map();
        this.messageQueue = [];
        this.deliveryStatus = new Map();
        
        this.setupEventHandlers();
        this.startQueueProcessor();
    }

    setupEventHandlers() {
        // Project events
        this.on('project.started', this.handleProjectStarted.bind(this));
        this.on('project.step.completed', this.handleStepCompleted.bind(this));
        this.on('project.progress.update', this.handleProgressUpdate.bind(this));
        this.on('project.completed', this.handleProjectCompleted.bind(this));
        this.on('project.error', this.handleProjectError.bind(this));
        
        // Audit events
        this.on('audit.started', this.handleAuditStarted.bind(this));
        this.on('audit.progress', this.handleAuditProgress.bind(this));
        this.on('audit.completed', this.handleAuditCompleted.bind(this));
        this.on('audit.critical_issue', this.handleCriticalIssue.bind(this));
        
        // Communication events
        this.on('message.received', this.handleMessageReceived.bind(this));
        this.on('call.scheduled', this.handleCallScheduled.bind(this));
        this.on('document.ready', this.handleDocumentReady.bind(this));
        
        // System events
        this.on('system.maintenance', this.handleSystemMaintenance.bind(this));
        this.on('team.assignment', this.handleTeamAssignment.bind(this));
    }

    // Subscription management
    subscribe(clientId, projectId, preferences = {}) {
        const subscription = {
            clientId,
            projectId,
            channels: { ...this.channels, ...preferences.channels },
            frequency: preferences.frequency || 'real-time',
            createdAt: new Date().toISOString()
        };
        
        this.subscribers.set(`${clientId}-${projectId}`, subscription);
        
        console.log(`🔔 Client ${clientId} subscribed to notifications for project ${projectId}`);
        return subscription;
    }

    unsubscribe(clientId, projectId) {
        const key = `${clientId}-${projectId}`;
        this.subscribers.delete(key);
        console.log(`🔕 Client ${clientId} unsubscribed from project ${projectId}`);
    }

    // Event handlers
    async handleProjectStarted(data) {
        const { client, project } = data;
        
        await this.sendNotification({
            type: 'project_started',
            recipients: [client.id],
            data: {
                client_name: client.name,
                project_name: project.name,
                project_id: project.id,
                tier: project.tier,
                start_date: project.startDate,
                estimated_completion: project.estimatedCompletion,
                portal_url: `https://portal.trackingfix.pro/${project.id}`
            },
            priority: 'high',
            channels: ['email', 'websocket']
        });
    }

    async handleStepCompleted(data) {
        const { client, project, step, nextStep } = data;
        
        await this.sendNotification({
            type: 'step_completed',
            recipients: [client.id],
            data: {
                client_name: client.name,
                project_id: project.id,
                step_name: step.name,
                step_description: step.description,
                completed_actions: step.completedActions || [],
                progress_percentage: Math.round((step.id / project.totalSteps) * 100),
                completed_steps: step.id,
                total_steps: project.totalSteps,
                next_step_name: nextStep?.name || 'Project Completion',
                next_step_description: nextStep?.description || 'Final review and handoff',
                next_step_eta: nextStep?.estimatedCompletion || 'TBD',
                portal_url: `https://portal.trackingfix.pro/${project.id}`
            },
            priority: 'medium',
            channels: ['email', 'websocket', 'webPush']
        });

        // Real-time WebSocket update
        this.emit('websocket.broadcast', {
            projectId: project.id,
            type: 'step_update',
            step: step,
            progress: Math.round((step.id / project.totalSteps) * 100)
        });
    }

    async handleProgressUpdate(data) {
        const { client, project, update } = data;
        
        // Only send email updates for significant progress (every 25%)
        const shouldSendEmail = update.progressPercentage % 25 === 0;
        
        const channels = shouldSendEmail ? ['email', 'websocket'] : ['websocket'];
        
        if (shouldSendEmail) {
            await this.sendNotification({
                type: 'progress_update',
                recipients: [client.id],
                data: {
                    client_name: client.name,
                    project_id: project.id,
                    progress_percentage: update.progressPercentage,
                    milestone_name: update.milestoneName,
                    current_phase: update.currentPhase,
                    estimated_completion: project.estimatedCompletion,
                    portal_url: `https://portal.trackingfix.pro/${project.id}`
                },
                priority: 'low',
                channels: channels
            });
        }

        // Always send WebSocket update for real-time dashboard
        this.emit('websocket.broadcast', {
            projectId: project.id,
            type: 'progress_update',
            progress: update.progressPercentage,
            currentPhase: update.currentPhase,
            timestamp: new Date().toISOString()
        });
    }

    async handleAuditCompleted(data) {
        const { client, project, auditResults } = data;
        
        // Determine notification urgency based on score
        const urgency = auditResults.overallScore < 50 ? 'high' : 
                       auditResults.overallScore < 75 ? 'medium' : 'low';
        
        await this.sendNotification({
            type: 'audit_complete',
            recipients: [client.id],
            data: {
                client_name: client.name,
                project_id: project.id,
                website_url: project.website,
                overall_score: auditResults.overallScore,
                total_issues: auditResults.issues.length,
                critical_issues: auditResults.issues.filter(i => i.severity === 'critical').length,
                high_issues: auditResults.issues.filter(i => i.severity === 'high').length,
                medium_issues: auditResults.issues.filter(i => i.severity === 'medium').length,
                estimated_monthly_loss: auditResults.businessImpact?.monthlyLoss || 'TBD',
                header_color: urgency === 'high' ? '#dc2626' : urgency === 'medium' ? '#f59e0b' : '#10b981',
                impact_bg_color: urgency === 'high' ? '#fee2e2' : urgency === 'medium' ? '#fef3c7' : '#dcfce7',
                impact_text_color: urgency === 'high' ? '#7f1d1d' : urgency === 'medium' ? '#92400e' : '#14532d',
                top_issues: auditResults.issues.slice(0, 5).map(issue => ({
                    title: issue.title,
                    description: issue.description
                })),
                report_download_url: `https://portal.trackingfix.pro/download/report/${project.id}`,
                portal_url: `https://portal.trackingfix.pro/${project.id}`
            },
            priority: urgency,
            channels: ['email', 'websocket', 'webPush']
        });
    }

    async handleCriticalIssue(data) {
        const { client, project, issue } = data;
        
        // Immediate notification for critical issues
        await this.sendNotification({
            type: 'critical_issue',
            recipients: [client.id],
            data: {
                client_name: client.name,
                project_id: project.id,
                issue_title: issue.title,
                issue_description: issue.description,
                business_impact: issue.businessImpact,
                recommended_action: issue.recommendedAction,
                portal_url: `https://portal.trackingfix.pro/${project.id}`
            },
            priority: 'urgent',
            channels: ['email', 'sms', 'websocket', 'webPush'],
            immediate: true
        });
    }

    async handleProjectCompleted(data) {
        const { client, project, results } = data;
        
        await this.sendNotification({
            type: 'implementation_complete',
            recipients: [client.id],
            data: {
                client_name: client.name,
                project_id: project.id,
                website_url: project.website,
                total_issues_fixed: results.totalIssuesFixed,
                before_score: results.beforeScore,
                after_score: 100,
                ecommerce_events: results.ecommerceEventsImplemented,
                performance_improvement: results.performanceImprovement,
                compliance_features: results.complianceFeatures,
                revenue_visibility: results.revenueVisibility,
                attribution_improvement: results.attributionImprovement,
                data_quality_score: results.dataQualityScore,
                estimated_monthly_savings: results.estimatedMonthlySavings,
                support_duration: '30 days',
                final_report_url: `https://portal.trackingfix.pro/download/final-report/${project.id}`,
                monitoring_dashboard_url: `https://portal.trackingfix.pro/monitoring/${project.id}`,
                feedback_url: `https://trackingfix.pro/feedback/${project.id}`
            },
            priority: 'high',
            channels: ['email', 'websocket', 'webPush']
        });

        // Schedule follow-up notifications
        this.scheduleFollowUp(client.id, project.id, 'week_1_check', 7 * 24 * 60 * 60 * 1000);
        this.scheduleFollowUp(client.id, project.id, 'month_1_review', 30 * 24 * 60 * 60 * 1000);
    }

    async handleProjectError(data) {
        const { client, project, error } = data;
        
        await this.sendNotification({
            type: 'error_notification',
            recipients: [client.id],
            data: {
                client_name: client.name,
                project_id: project.id,
                error_type: error.type || 'Technical Issue',
                error_description: error.description,
                error_impact: error.impact || 'Minimal impact on timeline',
                requires_client_action: error.requiresClientAction || false,
                required_action: error.requiredAction || null,
                support_email: 'support@trackingfix.pro'
            },
            priority: 'high',
            channels: ['email', 'websocket', 'webPush'],
            immediate: true
        });
    }

    // Notification delivery system
    async sendNotification(notification) {
        const { type, recipients, data, priority, channels, immediate } = notification;
        
        for (const recipientId of recipients) {
            const subscription = this.getSubscription(recipientId, data.project_id);
            if (!subscription) continue;
            
            const message = {
                id: this.generateMessageId(),
                type,
                recipientId,
                data,
                priority,
                channels: channels.filter(channel => subscription.channels[channel]),
                immediate: immediate || false,
                createdAt: new Date().toISOString(),
                attempts: 0,
                status: 'pending'
            };

            if (immediate) {
                await this.deliverMessage(message);
            } else {
                this.messageQueue.push(message);
            }
        }
    }

    async deliverMessage(message) {
        console.log(`📬 Delivering ${message.type} notification to ${message.recipientId}`);
        
        try {
            for (const channel of message.channels) {
                await this.deliverViaChannel(message, channel);
            }
            
            message.status = 'delivered';
            message.deliveredAt = new Date().toISOString();
            
            this.deliveryStatus.set(message.id, message);
            
        } catch (error) {
            console.error(`❌ Failed to deliver notification ${message.id}:`, error);
            message.status = 'failed';
            message.error = error.message;
            message.attempts = (message.attempts || 0) + 1;
            
            // Retry logic
            if (message.attempts < 3) {
                setTimeout(() => this.deliverMessage(message), 5000 * message.attempts);
            }
        }
    }

    async deliverViaChannel(message, channel) {
        switch (channel) {
            case 'email':
                return await this.sendEmail(message);
            case 'websocket':
                return await this.sendWebSocket(message);
            case 'webPush':
                return await this.sendWebPush(message);
            case 'sms':
                return await this.sendSMS(message);
            case 'slack':
                return await this.sendSlack(message);
            default:
                console.warn(`Unknown notification channel: ${channel}`);
        }
    }

    async sendEmail(message) {
        const template = this.templates.email[message.type];
        if (!template) {
            throw new Error(`No email template for ${message.type}`);
        }
        
        const rendered = EmailRenderer.render(message.type, message.data);
        
        // In production, use actual email service
        console.log(`📧 Email sent: ${rendered.subject} to ${message.recipientId}`);
        
        return { channel: 'email', status: 'sent', messageId: `email-${message.id}` };
    }

    async sendWebSocket(message) {
        this.emit('websocket.send', {
            recipientId: message.recipientId,
            type: 'notification',
            notification: {
                id: message.id,
                type: message.type,
                data: message.data,
                timestamp: message.createdAt
            }
        });
        
        console.log(`🔌 WebSocket notification sent to ${message.recipientId}`);
        return { channel: 'websocket', status: 'sent' };
    }

    async sendWebPush(message) {
        const pushPayload = {
            title: this.generatePushTitle(message.type, message.data),
            body: this.generatePushBody(message.type, message.data),
            icon: '/icons/trackingfix-icon-192.png',
            badge: '/icons/trackingfix-badge-72.png',
            data: {
                url: message.data.portal_url || 'https://portal.trackingfix.pro',
                messageId: message.id
            }
        };
        
        // In production, use actual web push service
        console.log(`🔔 Web push sent: ${pushPayload.title} to ${message.recipientId}`);
        
        return { channel: 'webPush', status: 'sent', payload: pushPayload };
    }

    generatePushTitle(type, data) {
        switch (type) {
            case 'step_completed':
                return `🎯 ${data.step_name} Completed`;
            case 'audit_complete':
                return `📊 Audit Complete - ${data.overall_score}% Score`;
            case 'implementation_complete':
                return `🎉 100% Success Achieved!`;
            case 'critical_issue':
                return `🚨 Critical Issue Detected`;
            default:
                return '🎯 TrackingFix Pro Update';
        }
    }

    generatePushBody(type, data) {
        switch (type) {
            case 'step_completed':
                return `${data.progress_percentage}% complete. Next: ${data.next_step_name}`;
            case 'audit_complete':
                return `${data.total_issues} issues found. Click to view report.`;
            case 'implementation_complete':
                return `Your tracking is now perfect! All ${data.total_issues_fixed} issues fixed.`;
            case 'critical_issue':
                return `${data.issue_title} requires immediate attention.`;
            default:
                return 'New update available in your project portal.';
        }
    }

    // Queue processing
    startQueueProcessor() {
        setInterval(() => {
            this.processQueue();
        }, 5000); // Process every 5 seconds
    }

    async processQueue() {
        if (this.messageQueue.length === 0) return;
        
        const batch = this.messageQueue.splice(0, 10); // Process 10 at a time
        
        for (const message of batch) {
            await this.deliverMessage(message);
        }
    }

    // Utility methods
    getSubscription(clientId, projectId) {
        return this.subscribers.get(`${clientId}-${projectId}`);
    }

    generateMessageId() {
        return 'MSG-' + Math.random().toString(36).substr(2, 12).toUpperCase();
    }

    scheduleFollowUp(clientId, projectId, type, delayMs) {
        setTimeout(() => {
            this.emit('followup.due', {
                clientId,
                projectId,
                type,
                scheduledAt: new Date().toISOString()
            });
        }, delayMs);
    }

    loadNotificationTemplates() {
        return {
            email: {
                'project_started': 'welcome',
                'step_completed': 'progress_update',
                'audit_complete': 'audit_complete',
                'implementation_complete': 'implementation_complete',
                'critical_issue': 'error_notification',
                'error_notification': 'error_notification'
            },
            webPush: {
                // Web push templates would be defined here
            }
        };
    }

    // Analytics and reporting
    getDeliveryStats(timeframe = '24h') {
        const stats = {
            totalSent: 0,
            delivered: 0,
            failed: 0,
            pending: 0,
            byChannel: {},
            byType: {}
        };

        this.deliveryStatus.forEach(message => {
            stats.totalSent++;
            stats[message.status]++;
            
            message.channels.forEach(channel => {
                stats.byChannel[channel] = (stats.byChannel[channel] || 0) + 1;
            });
            
            stats.byType[message.type] = (stats.byType[message.type] || 0) + 1;
        });

        return stats;
    }
}

module.exports = { NotificationSystem };

// Example usage
if (require.main === module) {
    const notifications = new NotificationSystem();
    
    // Subscribe a client
    notifications.subscribe('TFP-CLIENT123', 'TFP-PROJECT456', {
        channels: {
            email: true,
            websocket: true,
            webPush: true,
            sms: false
        }
    });
    
    // Simulate project events
    setTimeout(() => {
        notifications.emit('project.started', {
            client: { id: 'TFP-CLIENT123', name: 'John Doe' },
            project: { 
                id: 'TFP-PROJECT456', 
                name: 'Tracking Surgeon - example.com',
                tier: 'surgeon',
                startDate: '2024-12-15',
                estimatedCompletion: '2024-12-22'
            }
        });
    }, 1000);
    
    setTimeout(() => {
        notifications.emit('audit.completed', {
            client: { id: 'TFP-CLIENT123', name: 'John Doe' },
            project: { 
                id: 'TFP-PROJECT456',
                website: 'example.com'
            },
            auditResults: {
                overallScore: 22,
                issues: new Array(15).fill(null).map((_, i) => ({
                    title: `Issue ${i + 1}`,
                    description: 'Sample issue description',
                    severity: i < 3 ? 'critical' : i < 8 ? 'high' : 'medium'
                })),
                businessImpact: { monthlyLoss: 5000 }
            }
        });
    }, 3000);
    
    console.log('🔔 Notification system demo running...');
}