/**
 * TrackingFix Pro - Automated Audit Engine
 * Core platform for performing comprehensive tracking audits
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class TrackingAuditEngine {
    constructor(config = {}) {
        this.config = {
            timeout: 30000,
            headless: true,
            retryAttempts: 3,
            reportFormat: 'json',
            ...config
        };
        
        this.auditResults = {
            timestamp: new Date().toISOString(),
            url: null,
            overallScore: 0,
            issues: [],
            recommendations: [],
            networkRequests: [],
            pageMetrics: {},
            gtmContainers: [],
            ga4Properties: [],
            ecommerceEvents: {},
            tests: {}
        };
    }

    async performFullAudit(url, options = {}) {
        console.log(`🔄 Starting Ralph Wiggum Loop Audit for: ${url}`);
        this.auditResults.url = url;
        
        try {
            // Initialize browser
            const browser = await chromium.launch({ 
                headless: this.config.headless,
                devtools: false 
            });
            const context = await browser.newContext();
            const page = await context.newPage();
            
            // Set up monitoring
            await this.setupNetworkMonitoring(page);
            await this.setupConsoleMonitoring(page);
            
            // Ralph Wiggum Loop: AUDIT
            await this.auditPhase(page, url);
            
            // Ralph Wiggum Loop: DIAGNOSE
            await this.diagnosePhase();
            
            await browser.close();
            
            // Ralph Wiggum Loop: REPAIR (recommendations)
            await this.repairPhase();
            
            // Calculate overall score
            this.calculateOverallScore();
            
            console.log(`✅ Audit completed with ${this.auditResults.overallScore}% success rate`);
            return this.auditResults;
            
        } catch (error) {
            console.error('❌ Audit failed:', error);
            this.auditResults.issues.push({
                severity: 'critical',
                category: 'audit_error',
                title: 'Audit Engine Error',
                description: error.message,
                impact: 'Unable to complete audit'
            });
            return this.auditResults;
        }
    }

    async auditPhase(page, url) {
        console.log('🔍 AUDIT Phase: Comprehensive site analysis...');
        
        // Test 1: Homepage Analysis
        await this.testHomepage(page, url);
        
        // Test 2: Product Page Analysis
        await this.testProductPage(page, url);
        
        // Test 3: Cart Analysis
        await this.testCartPage(page, url);
        
        // Test 4: Checkout Analysis
        await this.testCheckoutPage(page, url);
        
        // Test 5: GTM Configuration Analysis
        await this.analyzeGTMConfiguration(page);
        
        // Test 6: GA4 Setup Analysis
        await this.analyzeGA4Setup(page);
        
        // Test 7: E-commerce Event Testing
        await this.testEcommerceEvents(page);
        
        // Test 8: Network Request Analysis
        await this.analyzeNetworkRequests();
        
        // Test 9: Performance Impact
        await this.analyzePerformanceImpact(page);
    }

    async testHomepage(page, url) {
        try {
            console.log('📄 Testing homepage...');
            await page.goto(url, { waitUntil: 'networkidle', timeout: this.config.timeout });
            await page.waitForTimeout(3000);
            
            // Check for basic tracking elements
            const trackingElements = await page.evaluate(() => {
                return {
                    gtmPresent: typeof window.google_tag_manager !== 'undefined',
                    dataLayerPresent: typeof window.dataLayer !== 'undefined',
                    gtagPresent: typeof window.gtag !== 'undefined',
                    fbqPresent: typeof window.fbq !== 'undefined'
                };
            });
            
            this.auditResults.tests.homepage = {
                status: 'completed',
                trackingElements,
                url: page.url()
            };
            
            if (!trackingElements.gtmPresent && !trackingElements.gtagPresent) {
                this.auditResults.issues.push({
                    severity: 'critical',
                    category: 'tracking_setup',
                    title: 'No Google Analytics Tracking Detected',
                    description: 'Neither GTM nor gtag was found on the homepage',
                    impact: 'No analytics data being collected',
                    page: 'homepage'
                });
            }
            
        } catch (error) {
            this.auditResults.issues.push({
                severity: 'high',
                category: 'accessibility',
                title: 'Homepage Load Error',
                description: `Could not load homepage: ${error.message}`,
                impact: 'Unable to test homepage tracking'
            });
        }
    }

    async testProductPage(page, url) {
        try {
            console.log('🛍️  Testing product page...');
            
            // Try common product page patterns
            const productUrls = [
                `${url}/products/`,
                `${url}/shop/`,
                `${url}/product/`
            ];
            
            let productPageFound = false;
            for (const productUrl of productUrls) {
                try {
                    const response = await page.goto(productUrl, { timeout: 10000 });
                    if (response && response.status() === 200) {
                        productPageFound = true;
                        break;
                    }
                } catch (e) {
                    // Continue to next URL pattern
                }
            }
            
            if (!productPageFound) {
                // Try to find product links on homepage
                await page.goto(url, { waitUntil: 'networkidle' });
                const productLink = await page.$('a[href*="/product"], a[href*="/products/"]');
                if (productLink) {
                    await productLink.click();
                    await page.waitForTimeout(3000);
                    productPageFound = true;
                }
            }
            
            if (productPageFound) {
                // Test product page tracking
                const productData = await page.evaluate(() => {
                    return {
                        productInfo: typeof window.product !== 'undefined' ? window.product : null,
                        hasAddToCartButton: !!document.querySelector('input[name="add"], .add-to-cart, [data-add-to-cart]'),
                        hasProductSchema: !!document.querySelector('script[type="application/ld+json"]')
                    };
                });
                
                this.auditResults.tests.productPage = {
                    status: 'completed',
                    productData,
                    url: page.url()
                };
                
                // Check for view_item event
                const viewItemEvent = await this.checkDataLayerEvent(page, 'view_item');
                if (!viewItemEvent) {
                    this.auditResults.issues.push({
                        severity: 'high',
                        category: 'ecommerce_tracking',
                        title: 'Missing Product View Tracking',
                        description: 'view_item event not fired on product page',
                        impact: 'No product performance data',
                        page: 'product'
                    });
                }
                
            } else {
                this.auditResults.issues.push({
                    severity: 'medium',
                    category: 'site_structure',
                    title: 'No Product Page Found',
                    description: 'Could not locate a product page for testing',
                    impact: 'Unable to test product tracking'
                });
            }
            
        } catch (error) {
            console.error('Product page test error:', error);
        }
    }

    async testCartPage(page, url) {
        try {
            console.log('🛒 Testing cart page...');
            
            const cartUrl = `${url}/cart`;
            const response = await page.goto(cartUrl, { 
                waitUntil: 'networkidle', 
                timeout: 10000 
            });
            
            if (response && response.status() === 200) {
                await page.waitForTimeout(2000);
                
                // Check for cart tracking
                const cartData = await page.evaluate(() => {
                    return {
                        hasCartItems: !!document.querySelector('.cart-item, .line-item, .cart-product'),
                        hasCheckoutButton: !!document.querySelector('.checkout, [href*="checkout"], .btn-checkout'),
                        cartTotal: document.querySelector('.cart-total, .total-price, .subtotal')?.textContent
                    };
                });
                
                this.auditResults.tests.cartPage = {
                    status: 'completed',
                    cartData,
                    url: page.url()
                };
                
                // Check for view_cart event
                const viewCartEvent = await this.checkDataLayerEvent(page, 'view_cart');
                if (!viewCartEvent) {
                    this.auditResults.issues.push({
                        severity: 'high',
                        category: 'ecommerce_tracking',
                        title: 'Missing Cart View Tracking',
                        description: 'view_cart event not fired on cart page',
                        impact: 'No cart abandonment data',
                        page: 'cart'
                    });
                }
            }
            
        } catch (error) {
            console.log('Cart page not accessible or test failed');
        }
    }

    async testCheckoutPage(page, url) {
        try {
            console.log('🚀 Testing checkout page...');
            
            const checkoutUrl = `${url}/checkout`;
            const response = await page.goto(checkoutUrl, { 
                waitUntil: 'networkidle', 
                timeout: 10000 
            });
            
            if (response && response.status() === 200) {
                await page.waitForTimeout(2000);
                
                const checkoutData = await page.evaluate(() => {
                    return {
                        hasPaymentFields: !!document.querySelector('input[type="email"], input[name="email"], .payment-form'),
                        hasShippingForm: !!document.querySelector('.shipping, .address-form'),
                        requiresLogin: !!document.querySelector('.login, .sign-in')
                    };
                });
                
                this.auditResults.tests.checkoutPage = {
                    status: 'completed',
                    checkoutData,
                    url: page.url()
                };
                
                // Check for begin_checkout event
                const beginCheckoutEvent = await this.checkDataLayerEvent(page, 'begin_checkout');
                if (!beginCheckoutEvent) {
                    this.auditResults.issues.push({
                        severity: 'high',
                        category: 'ecommerce_tracking',
                        title: 'Missing Checkout Begin Tracking',
                        description: 'begin_checkout event not fired on checkout page',
                        impact: 'No checkout funnel analysis',
                        page: 'checkout'
                    });
                }
            }
            
        } catch (error) {
            console.log('Checkout page not accessible or test failed');
        }
    }

    async analyzeGTMConfiguration(page) {
        try {
            console.log('🏷️  Analyzing GTM configuration...');
            
            const gtmInfo = await page.evaluate(() => {
                const gtmContainers = [];
                const scripts = Array.from(document.scripts);
                
                scripts.forEach(script => {
                    if (script.src && script.src.includes('googletagmanager.com/gtm.js')) {
                        const match = script.src.match(/id=([^&]+)/);
                        if (match) {
                            gtmContainers.push(match[1]);
                        }
                    }
                });
                
                return {
                    containers: gtmContainers,
                    dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
                    gtmPresent: typeof window.google_tag_manager !== 'undefined'
                };
            });
            
            this.auditResults.gtmContainers = gtmInfo.containers;
            this.auditResults.tests.gtmConfiguration = {
                status: 'completed',
                gtmInfo
            };
            
            if (gtmInfo.containers.length === 0) {
                this.auditResults.issues.push({
                    severity: 'critical',
                    category: 'tracking_setup',
                    title: 'No GTM Container Found',
                    description: 'Google Tag Manager container not detected',
                    impact: 'No tag management system active'
                });
            } else if (gtmInfo.containers.length > 1) {
                this.auditResults.issues.push({
                    severity: 'medium',
                    category: 'tracking_setup',
                    title: 'Multiple GTM Containers',
                    description: `Found ${gtmInfo.containers.length} GTM containers: ${gtmInfo.containers.join(', ')}`,
                    impact: 'Potential duplicate tracking'
                });
            }
            
        } catch (error) {
            console.error('GTM analysis error:', error);
        }
    }

    async analyzeGA4Setup(page) {
        try {
            console.log('📊 Analyzing GA4 setup...');
            
            const ga4Info = await page.evaluate(() => {
                const ga4Properties = [];
                const scripts = Array.from(document.scripts);
                
                // Check for gtag scripts
                scripts.forEach(script => {
                    if (script.src && script.src.includes('gtag/js')) {
                        const match = script.src.match(/id=([^&]+)/);
                        if (match) {
                            ga4Properties.push(match[1]);
                        }
                    }
                });
                
                // Check dataLayer for config events
                if (window.dataLayer) {
                    window.dataLayer.forEach(event => {
                        if (event && (event.event === 'gtag.config' || event[0] === 'config')) {
                            const propertyId = event[1] || event.config_id;
                            if (propertyId && !ga4Properties.includes(propertyId)) {
                                ga4Properties.push(propertyId);
                            }
                        }
                    });
                }
                
                return {
                    properties: ga4Properties,
                    gtagPresent: typeof window.gtag !== 'undefined'
                };
            });
            
            this.auditResults.ga4Properties = ga4Info.properties;
            this.auditResults.tests.ga4Setup = {
                status: 'completed',
                ga4Info
            };
            
            if (ga4Info.properties.length === 0) {
                this.auditResults.issues.push({
                    severity: 'critical',
                    category: 'tracking_setup',
                    title: 'No GA4 Property Found',
                    description: 'Google Analytics 4 property not detected',
                    impact: 'No analytics data collection'
                });
            } else {
                // Check if using deprecated Universal Analytics IDs
                const hasUA = ga4Info.properties.some(prop => prop.startsWith('UA-'));
                if (hasUA) {
                    this.auditResults.issues.push({
                        severity: 'critical',
                        category: 'tracking_setup',
                        title: 'Deprecated Universal Analytics Detected',
                        description: 'Found Universal Analytics property (UA-) which is deprecated',
                        impact: 'Analytics will stop working in 2023'
                    });
                }
            }
            
        } catch (error) {
            console.error('GA4 analysis error:', error);
        }
    }

    async testEcommerceEvents(page) {
        console.log('🛍️  Testing e-commerce events...');
        
        const eventTests = {
            view_item: false,
            add_to_cart: false,
            view_cart: false,
            begin_checkout: false,
            purchase: false
        };
        
        // Check each event type
        for (const eventType of Object.keys(eventTests)) {
            eventTests[eventType] = await this.checkDataLayerEvent(page, eventType);
        }
        
        this.auditResults.ecommerceEvents = eventTests;
        this.auditResults.tests.ecommerceEvents = {
            status: 'completed',
            eventTests
        };
        
        // Generate issues for missing events
        const missingEvents = Object.entries(eventTests)
            .filter(([event, fired]) => !fired)
            .map(([event]) => event);
        
        if (missingEvents.length > 0) {
            this.auditResults.issues.push({
                severity: 'high',
                category: 'ecommerce_tracking',
                title: `Missing E-commerce Events (${missingEvents.length}/5)`,
                description: `Events not firing: ${missingEvents.join(', ')}`,
                impact: 'Incomplete conversion tracking'
            });
        }
    }

    async analyzeNetworkRequests() {
        console.log('🌐 Analyzing network requests...');
        
        const ga4Requests = this.auditResults.networkRequests.filter(req => 
            req.url.includes('google-analytics.com/g/collect')
        );
        
        const gtmRequests = this.auditResults.networkRequests.filter(req => 
            req.url.includes('googletagmanager.com')
        );
        
        this.auditResults.tests.networkAnalysis = {
            status: 'completed',
            ga4RequestCount: ga4Requests.length,
            gtmRequestCount: gtmRequests.length,
            totalTrackingRequests: ga4Requests.length + gtmRequests.length
        };
        
        if (ga4Requests.length === 0) {
            this.auditResults.issues.push({
                severity: 'critical',
                category: 'tracking_setup',
                title: 'No GA4 Network Requests',
                description: 'No network requests to Google Analytics detected',
                impact: 'Analytics data not being sent'
            });
        }
    }

    async analyzePerformanceImpact(page) {
        try {
            console.log('⚡ Analyzing performance impact...');
            
            const perfMetrics = await page.evaluate(() => {
                if (!window.performance) return null;
                
                const timing = performance.timing;
                return {
                    loadTime: timing.loadEventEnd - timing.navigationStart,
                    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                    firstPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || null
                };
            });
            
            this.auditResults.pageMetrics = perfMetrics;
            this.auditResults.tests.performance = {
                status: 'completed',
                perfMetrics
            };
            
            if (perfMetrics && perfMetrics.loadTime > 5000) {
                this.auditResults.issues.push({
                    severity: 'medium',
                    category: 'performance',
                    title: 'Slow Page Load Time',
                    description: `Page load time: ${(perfMetrics.loadTime / 1000).toFixed(2)}s`,
                    impact: 'May affect tracking accuracy and user experience'
                });
            }
            
        } catch (error) {
            console.error('Performance analysis error:', error);
        }
    }

    async setupNetworkMonitoring(page) {
        page.on('request', request => {
            const url = request.url();
            if (url.includes('google-analytics.com') || 
                url.includes('googletagmanager.com') ||
                url.includes('facebook.com/tr') ||
                url.includes('analytics.tiktok.com')) {
                
                this.auditResults.networkRequests.push({
                    url: url,
                    method: request.method(),
                    timestamp: new Date().toISOString(),
                    type: this.categorizeRequest(url)
                });
            }
        });
    }

    async setupConsoleMonitoring(page) {
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                if (text.includes('gtag') || text.includes('analytics') || text.includes('gtm')) {
                    this.auditResults.issues.push({
                        severity: 'medium',
                        category: 'javascript_errors',
                        title: 'Tracking JavaScript Error',
                        description: text,
                        impact: 'May prevent tracking from working properly'
                    });
                }
            }
        });
    }

    async checkDataLayerEvent(page, eventType) {
        try {
            return await page.evaluate((eventType) => {
                if (!window.dataLayer) return false;
                return window.dataLayer.some(event => 
                    event && event.event === eventType
                );
            }, eventType);
        } catch (error) {
            return false;
        }
    }

    categorizeRequest(url) {
        if (url.includes('google-analytics.com/g/collect')) return 'ga4';
        if (url.includes('googletagmanager.com/gtm.js')) return 'gtm_load';
        if (url.includes('googletagmanager.com/gtag/js')) return 'gtag_load';
        if (url.includes('facebook.com/tr')) return 'facebook_pixel';
        if (url.includes('analytics.tiktok.com')) return 'tiktok_pixel';
        return 'other';
    }

    async diagnosePhase() {
        console.log('🔍 DIAGNOSE Phase: Analyzing issues...');
        
        // Categorize issues by severity
        const criticalIssues = this.auditResults.issues.filter(issue => issue.severity === 'critical');
        const highIssues = this.auditResults.issues.filter(issue => issue.severity === 'high');
        const mediumIssues = this.auditResults.issues.filter(issue => issue.severity === 'medium');
        
        console.log(`Found ${criticalIssues.length} critical, ${highIssues.length} high, ${mediumIssues.length} medium priority issues`);
        
        // Calculate business impact
        await this.calculateBusinessImpact();
    }

    async calculateBusinessImpact() {
        const criticalIssues = this.auditResults.issues.filter(issue => issue.severity === 'critical').length;
        const highIssues = this.auditResults.issues.filter(issue => issue.severity === 'high').length;
        const mediumIssues = this.auditResults.issues.filter(issue => issue.severity === 'medium').length;
        
        // Estimate revenue impact (simplified calculation)
        const estimatedImpact = {
            dataLoss: criticalIssues * 25 + highIssues * 15 + mediumIssues * 5, // % of data lost
            optimizationLoss: criticalIssues * 30 + highIssues * 20 + mediumIssues * 10, // % optimization loss
            attributionLoss: criticalIssues * 20 + highIssues * 15 + mediumIssues * 5 // % attribution loss
        };
        
        this.auditResults.businessImpact = estimatedImpact;
    }

    async repairPhase() {
        console.log('🔧 REPAIR Phase: Generating recommendations...');
        
        // Generate specific recommendations based on issues found
        const recommendations = [];
        
        // GTM recommendations
        const gtmIssues = this.auditResults.issues.filter(issue => 
            issue.category === 'tracking_setup' && 
            (issue.title.includes('GTM') || issue.title.includes('Container'))
        );
        
        if (gtmIssues.length > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'gtm_setup',
                title: 'Fix Google Tag Manager Configuration',
                description: 'Implement proper GTM container setup with correct configuration',
                steps: [
                    'Verify GTM container ID is correct',
                    'Ensure GTM code is properly installed',
                    'Check for duplicate containers',
                    'Test GTM in preview mode'
                ],
                estimatedTime: '2-4 hours',
                businessValue: 'Restores tag management functionality'
            });
        }
        
        // GA4 recommendations
        const ga4Issues = this.auditResults.issues.filter(issue => 
            issue.category === 'tracking_setup' && 
            issue.title.includes('GA4')
        );
        
        if (ga4Issues.length > 0) {
            recommendations.push({
                priority: 'critical',
                category: 'ga4_setup',
                title: 'Fix Google Analytics 4 Configuration',
                description: 'Implement proper GA4 property setup with correct measurement ID',
                steps: [
                    'Verify GA4 property ID is correct',
                    'Ensure gtag or GTM GA4 config is properly set up',
                    'Test GA4 data flow in DebugView',
                    'Verify enhanced measurement settings'
                ],
                estimatedTime: '1-2 hours',
                businessValue: 'Restores analytics data collection'
            });
        }
        
        // E-commerce recommendations
        const ecommerceIssues = this.auditResults.issues.filter(issue => 
            issue.category === 'ecommerce_tracking'
        );
        
        if (ecommerceIssues.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'ecommerce_tracking',
                title: 'Implement E-commerce Event Tracking',
                description: 'Set up complete e-commerce event tracking for conversion analysis',
                steps: [
                    'Implement view_item events on product pages',
                    'Set up add_to_cart tracking',
                    'Configure view_cart events',
                    'Add begin_checkout tracking',
                    'Implement purchase event tracking',
                    'Set up enhanced e-commerce parameters'
                ],
                estimatedTime: '4-8 hours',
                businessValue: 'Enables conversion tracking and ROI analysis'
            });
        }
        
        this.auditResults.recommendations = recommendations;
    }

    calculateOverallScore() {
        const totalTests = Object.keys(this.auditResults.tests).length;
        const completedTests = Object.values(this.auditResults.tests)
            .filter(test => test.status === 'completed').length;
        
        const criticalIssues = this.auditResults.issues.filter(issue => issue.severity === 'critical').length;
        const highIssues = this.auditResults.issues.filter(issue => issue.severity === 'high').length;
        
        // Base score from completed tests
        let score = (completedTests / totalTests) * 100;
        
        // Deduct points for issues
        score -= criticalIssues * 25; // -25 points per critical issue
        score -= highIssues * 15;     // -15 points per high issue
        score -= this.auditResults.issues.filter(issue => issue.severity === 'medium').length * 5; // -5 points per medium issue
        
        // Ensure score is between 0 and 100
        this.auditResults.overallScore = Math.max(0, Math.min(100, Math.round(score)));
    }

    async generateReport(format = 'json') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `audit-report-${timestamp}`;
        
        if (format === 'json') {
            const reportPath = path.join(__dirname, 'reports', `${filename}.json`);
            await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
            await fs.promises.writeFile(reportPath, JSON.stringify(this.auditResults, null, 2));
            return reportPath;
        } else if (format === 'html') {
            const reportPath = path.join(__dirname, 'reports', `${filename}.html`);
            const htmlReport = await this.generateHTMLReport();
            await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
            await fs.promises.writeFile(reportPath, htmlReport);
            return reportPath;
        }
        
        return this.auditResults;
    }

    async generateHTMLReport() {
        const severityColors = {
            critical: '#ef4444',
            high: '#f59e0b',
            medium: '#10b981'
        };
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tracking Audit Report - ${this.auditResults.url}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .score { font-size: 48px; font-weight: bold; color: ${this.auditResults.overallScore >= 80 ? '#10b981' : this.auditResults.overallScore >= 60 ? '#f59e0b' : '#ef4444'}; }
                .issue { margin: 10px 0; padding: 15px; border-left: 4px solid #ccc; background: #f8f9fa; }
                .critical { border-left-color: ${severityColors.critical}; }
                .high { border-left-color: ${severityColors.high}; }
                .medium { border-left-color: ${severityColors.medium}; }
                .recommendation { margin: 15px 0; padding: 15px; background: #e7f3ff; border-radius: 8px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎯 TrackingFix Pro Audit Report</h1>
                <p><strong>URL:</strong> ${this.auditResults.url}</p>
                <p><strong>Date:</strong> ${new Date(this.auditResults.timestamp).toLocaleString()}</p>
                <div class="score">${this.auditResults.overallScore}%</div>
                <p>Tracking Health Score</p>
            </div>
            
            <h2>📋 Issues Found (${this.auditResults.issues.length})</h2>
            ${this.auditResults.issues.map(issue => `
                <div class="issue ${issue.severity}">
                    <h3>${issue.title}</h3>
                    <p><strong>Severity:</strong> ${issue.severity.toUpperCase()}</p>
                    <p><strong>Description:</strong> ${issue.description}</p>
                    <p><strong>Impact:</strong> ${issue.impact}</p>
                </div>
            `).join('')}
            
            <h2>💡 Recommendations (${this.auditResults.recommendations.length})</h2>
            ${this.auditResults.recommendations.map(rec => `
                <div class="recommendation">
                    <h3>${rec.title}</h3>
                    <p><strong>Priority:</strong> ${rec.priority.toUpperCase()}</p>
                    <p><strong>Description:</strong> ${rec.description}</p>
                    <p><strong>Estimated Time:</strong> ${rec.estimatedTime}</p>
                    <p><strong>Business Value:</strong> ${rec.businessValue}</p>
                </div>
            `).join('')}
            
            <h2>📊 Test Results</h2>
            <pre>${JSON.stringify(this.auditResults.tests, null, 2)}</pre>
        </body>
        </html>
        `;
    }
}

module.exports = { TrackingAuditEngine };

// CLI Usage
if (require.main === module) {
    const url = process.argv[2];
    if (!url) {
        console.log('Usage: node audit-engine.js <url>');
        process.exit(1);
    }
    
    const engine = new TrackingAuditEngine();
    engine.performFullAudit(url).then(results => {
        console.log('\n📊 AUDIT COMPLETE');
        console.log(`Overall Score: ${results.overallScore}%`);
        console.log(`Issues Found: ${results.issues.length}`);
        console.log(`Recommendations: ${results.recommendations.length}`);
        
        // Generate report
        engine.generateReport('json').then(reportPath => {
            console.log(`\n📄 Report saved: ${reportPath}`);
        });
    }).catch(error => {
        console.error('Audit failed:', error);
        process.exit(1);
    });
}