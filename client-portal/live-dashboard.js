/**
 * The Forensic Data Lab - Live Dashboard Client
 * Real-time dashboard with WebSocket connections and interactive features
 */

class LiveDashboard {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || 'http://localhost:3001';
        this.wsUrl = options.wsUrl || 'ws://localhost:3002';
        this.projectId = options.projectId;
        this.clientId = options.clientId;
        this.authToken = localStorage.getItem('tfp_token');
        
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        
        this.chartInstances = new Map();
        this.lastUpdate = null;
        this.updateQueue = [];
        
        this.init();
    }

    async init() {
        try {
            await this.authenticate();
            await this.loadInitialData();
            this.setupWebSocket();
            this.setupEventListeners();
            this.startPeriodicUpdates();
            
            console.log('🎯 The Forensic Data Lab Dashboard initialized');
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Failed to load dashboard. Please refresh the page.');
        }
    }

    async authenticate() {
        if (!this.authToken) {
            window.location.href = '/login';
            return;
        }
        
        // Verify token is still valid
        const response = await this.apiCall('/api/protected/dashboard/' + this.clientId);
        if (!response.ok) {
            localStorage.removeItem('tfp_token');
            window.location.href = '/login';
            return;
        }
    }

    async loadInitialData() {
        this.showLoadingState();
        
        try {
            const [dashboard, timeline, communications] = await Promise.all([
                this.apiCall('/api/protected/dashboard/' + this.clientId).then(r => r.json()),
                this.apiCall('/api/protected/timeline/' + this.projectId).then(r => r.json()),
                this.apiCall('/api/protected/communications/' + this.projectId).then(r => r.json())
            ]);
            
            this.renderDashboard(dashboard);
            this.renderTimeline(timeline);
            this.renderCommunications(communications);
            this.renderMetricsCharts(dashboard.metrics);
            
            this.hideLoadingState();
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showError('Failed to load dashboard data.');
        }
    }

    setupWebSocket() {
        try {
            this.ws = new WebSocket(this.wsUrl);
            
            this.ws.onopen = () => {
                console.log('🔌 WebSocket connected');
                this.reconnectAttempts = 0;
                
                // Subscribe to project updates
                this.ws.send(JSON.stringify({
                    type: 'subscribe_project',
                    projectId: this.projectId,
                    clientId: this.clientId
                }));
                
                this.showConnectionStatus('connected');
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleWebSocketMessage(data);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.showConnectionStatus('disconnected');
                this.attemptReconnect();
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.showConnectionStatus('error');
            };
            
        } catch (error) {
            console.error('Failed to setup WebSocket:', error);
        }
    }

    handleWebSocketMessage(data) {
        console.log('📨 WebSocket message received:', data.type);
        
        switch (data.type) {
            case 'progress_update':
                this.updateProgress(data);
                this.showNotification('Progress Update', data.currentPhase, 'info');
                break;
                
            case 'step_update':
                this.updateTimeline(data);
                this.showNotification('Step Completed', `${data.step.name} has been completed`, 'success');
                break;
                
            case 'audit_update':
                this.updateAuditStatus(data);
                break;
                
            case 'team_response':
                this.addNewMessage(data.message, 'team');
                this.showNotification('Team Response', 'Your team has responded to your message', 'info');
                break;
                
            case 'critical_issue':
                this.handleCriticalIssue(data);
                this.showNotification('Critical Issue', data.issue.title, 'error');
                break;
                
            case 'notification':
                this.displayNotification(data.notification);
                break;
                
            case 'pong':
                // Keep-alive response
                break;
                
            default:
                console.log('Unknown WebSocket message type:', data.type);
        }
        
        this.lastUpdate = new Date();
        this.updateLastSeenTimestamp();
    }

    updateProgress(data) {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelectorAll('.progress-text span');
        
        if (progressBar) {
            progressBar.style.width = data.progress + '%';
            progressBar.style.transition = 'width 0.5s ease';
        }
        
        if (progressText[3]) {
            progressText[3].textContent = data.progress + '% complete';
        }
        
        // Update current phase
        const phaseElement = document.querySelector('.current-phase');
        if (phaseElement && data.currentPhase) {
            phaseElement.textContent = data.currentPhase;
        }
    }

    updateTimeline(data) {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;
        
        // Find and update the specific timeline item
        const timelineItems = timeline.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const marker = item.querySelector('.timeline-marker');
            if (marker && marker.textContent.includes(data.step.id)) {
                marker.className = 'timeline-marker completed';
                marker.innerHTML = '✓';
                
                const meta = item.querySelector('.timeline-meta span:last-child');
                if (meta) {
                    meta.textContent = '✓ Completed';
                    meta.style.color = '#10b981';
                }
            }
        });
        
        // Update next active step
        const nextStepId = data.step.id + 1;
        timelineItems.forEach(item => {
            const marker = item.querySelector('.timeline-marker');
            if (marker && marker.textContent.includes(nextStepId)) {
                marker.className = 'timeline-marker active';
                
                const meta = item.querySelector('.timeline-meta span:last-child');
                if (meta) {
                    meta.textContent = '🔄 In Progress';
                    meta.style.color = '#2563eb';
                }
            }
        });
    }

    updateAuditStatus(data) {
        const auditStatus = document.querySelector('.audit-status');
        if (!auditStatus) return;
        
        const statusContent = auditStatus.querySelector('.status-content');
        if (statusContent) {
            statusContent.innerHTML = `
                <div class="audit-progress">
                    <div class="audit-phase">${data.phase || 'Running'}</div>
                    <div class="audit-progress-bar">
                        <div class="progress-fill" style="width: ${data.progress || 0}%"></div>
                    </div>
                    <div class="audit-action">${data.currentAction || 'Analyzing...'}</div>
                </div>
            `;
        }
        
        if (data.status === 'completed' && data.results) {
            this.updateAuditResults(data.results);
        }
    }

    updateAuditResults(results) {
        const metricsCards = document.querySelectorAll('.metric-card');
        if (metricsCards.length >= 4) {
            // Update overall score
            metricsCards[0].querySelector('.metric-value').textContent = results.overallScore + '%';
            metricsCards[0].querySelector('.metric-value').className = 
                results.overallScore >= 75 ? 'metric-value metric-success' : 
                results.overallScore >= 50 ? 'metric-value metric-warning' : 
                'metric-value metric-error';
            
            // Update issues found
            metricsCards[1].querySelector('.metric-value').textContent = results.totalIssues;
            
            // Update critical issues
            metricsCards[2].querySelector('.metric-value').textContent = results.criticalIssues;
        }
    }

    renderDashboard(data) {
        // Update client info
        this.updateElement('.user-info span', data.client.email);
        this.updateElement('.avatar', data.client.avatar);
        
        // Update project header
        this.updateElement('.project-title h1', data.activeProject.name);
        this.updateElement('.project-meta', 
            `Project ID: ${data.activeProject.id} • Started: ${data.activeProject.startDate}`);
        
        // Update status badge
        const statusBadge = document.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.textContent = data.activeProject.status.charAt(0).toUpperCase() + 
                                     data.activeProject.status.slice(1);
            statusBadge.className = `status-badge status-${data.activeProject.status}`;
        }
        
        // Update progress
        this.updateProgress({
            progress: data.activeProject.progress,
            currentPhase: data.activeProject.currentStep
        });
        
        // Update metrics
        this.updateMetrics(data.metrics);
        
        // Update team info
        this.renderTeam(data.team);
        
        // Update recent activity
        this.renderRecentActivity(data.recentActivity);
    }

    renderTimeline(data) {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;
        
        timeline.innerHTML = '';
        
        data.steps.forEach(step => {
            const timelineItem = this.createTimelineItem(step);
            timeline.appendChild(timelineItem);
        });
    }

    createTimelineItem(step) {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        const markerClass = step.status === 'completed' ? 'completed' : 
                           step.status === 'active' ? 'active' : 'pending';
        
        const markerContent = step.status === 'completed' ? '✓' : step.id;
        
        const statusText = step.status === 'completed' ? '✓ Completed' :
                          step.status === 'active' ? '🔄 In Progress' : '⏳ Pending';
        
        item.innerHTML = `
            <div class="timeline-marker ${markerClass}">${markerContent}</div>
            <div class="timeline-content">
                <div class="timeline-title">${step.name}</div>
                <div class="timeline-description">${step.description || ''}</div>
                <div class="timeline-meta">
                    <span>${step.date}</span>
                    <span>${step.duration}</span>
                    <span style="color: ${step.status === 'completed' ? '#10b981' : step.status === 'active' ? '#2563eb' : '#6b7280'}">${statusText}</span>
                </div>
            </div>
        `;
        
        return item;
    }

    renderMetricsCharts(metrics) {
        // Progress chart
        this.createProgressChart(metrics);
        
        // Issues breakdown chart
        this.createIssuesChart(metrics);
        
        // Performance trend chart
        this.createTrendChart(metrics);
    }

    createProgressChart(metrics) {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [metrics.currentScore, 100 - metrics.currentScore],
                    backgroundColor: ['#10b981', '#e5e7eb'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false }
                }
            }
        });
        
        this.chartInstances.set('progress', chart);
    }

    createIssuesChart(metrics) {
        const ctx = document.getElementById('issuesChart');
        if (!ctx) return;
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Critical', 'High', 'Medium', 'Fixed'],
                datasets: [{
                    data: [
                        metrics.criticalIssues || 0,
                        metrics.highIssues || 0,
                        metrics.mediumIssues || 0,
                        metrics.issuesFixed || 0
                    ],
                    backgroundColor: ['#ef4444', '#f59e0b', '#06b6d4', '#10b981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
        
        this.chartInstances.set('issues', chart);
    }

    setupEventListeners() {
        // Message form
        const messageForm = document.getElementById('messageForm');
        if (messageForm) {
            messageForm.addEventListener('submit', this.handleSendMessage.bind(this));
        }
        
        // Action buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.action-button')) {
                this.handleActionButton(e.target);
            }
        });
        
        // Refresh button
        const refreshButton = document.querySelector('.refresh-button');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.loadInitialData());
        }
        
        // Notification close buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.notification-close')) {
                e.target.closest('.notification').remove();
            }
        });
        
        // Keep WebSocket alive
        setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);
    }

    async handleSendMessage(e) {
        e.preventDefault();
        
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;
        
        try {
            const response = await this.apiCall('/api/protected/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: this.projectId,
                    message: message
                })
            });
            
            if (response.ok) {
                messageInput.value = '';
                this.addNewMessage({
                    content: message,
                    from: 'client',
                    timestamp: new Date().toISOString()
                }, 'client');
                
                this.showNotification('Message Sent', 'Your message has been sent to the team', 'success');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            this.showNotification('Error', 'Failed to send message. Please try again.', 'error');
        }
    }

    handleActionButton(button) {
        const action = button.textContent.trim();
        
        switch (action) {
            case '📊 Download Report':
                this.downloadReport();
                break;
            case '🔍 View Live Site':
                this.viewLiveSite();
                break;
            case 'Get Support':
                window.open('/support', '_blank');
                break;
            case '💬 Message Team':
                this.focusMessageInput();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    async downloadReport() {
        try {
            const response = await this.apiCall('/api/protected/download/report/' + this.projectId);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Forensic Data Lab-Report-${this.projectId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                this.showNotification('Download Started', 'Your report is downloading', 'success');
            }
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification('Download Failed', 'Please try again later', 'error');
        }
    }

    showNotification(title, message, type = 'info') {
        const notificationContainer = document.getElementById('notifications') || 
                                     this.createNotificationContainer();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">×</button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    showConnectionStatus(status) {
        const statusElement = document.querySelector('.connection-status') || 
                             this.createConnectionStatus();
        
        statusElement.className = `connection-status status-${status}`;
        statusElement.textContent = status === 'connected' ? '🟢 Live' : 
                                  status === 'error' ? '🔴 Error' : '🟡 Connecting...';
    }

    createConnectionStatus() {
        const status = document.createElement('div');
        status.className = 'connection-status';
        document.querySelector('.header').appendChild(status);
        return status;
    }

    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.showNotification('Connection Lost', 'Unable to reconnect. Please refresh the page.', 'error');
            return;
        }
        
        this.reconnectAttempts++;
        this.showConnectionStatus('connecting');
        
        setTimeout(() => {
            console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            this.setupWebSocket();
        }, this.reconnectDelay * this.reconnectAttempts);
    }

    async apiCall(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
        
        return fetch(this.apiUrl + endpoint, { ...defaultOptions, ...options });
    }

    updateElement(selector, content) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = content;
        }
    }

    startPeriodicUpdates() {
        // Refresh data every 5 minutes
        setInterval(() => {
            this.loadInitialData();
        }, 5 * 60 * 1000);
    }

    showLoadingState() {
        document.body.classList.add('loading');
    }

    hideLoadingState() {
        document.body.classList.remove('loading');
    }

    showError(message) {
        this.showNotification('Error', message, 'error');
    }

    updateLastSeenTimestamp() {
        const timestamp = document.querySelector('.last-update');
        if (timestamp) {
            timestamp.textContent = `Last update: ${new Date().toLocaleTimeString()}`;
        }
    }
}

// Auto-initialize if we're in a browser environment
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Extract project info from URL or data attributes
        const projectId = document.body.dataset.projectId || 'TFP-ABC123XYZ';
        const clientId = document.body.dataset.clientId || 'TFP-CLIENT123';
        
        window.dashboard = new LiveDashboard({
            projectId,
            clientId
        });
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LiveDashboard };
}