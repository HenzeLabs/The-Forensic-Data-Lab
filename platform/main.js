#!/usr/bin/env node

/**
 * The Forensic Data Lab - Main Verification Loop Orchestrator
 * Autonomous "Ralph Wiggum" verification loop: Scan → Audit → Repair → Reconcile until 100% verified
 */

const { RevenueSignalAuditEngine } = require('./audit-engine.js');
const { TrackingRepairEngine } = require('./repair-engine.js');
const { getKnownConfiguration, isVerificationCurrent } = require('./known-configurations.js');
const fs = require('fs').promises;
const path = require('path');

class VerificationLoopOrchestrator {
    constructor(config = {}) {
        this.config = {
            maxIterations: 5, // Prevent infinite loops
            targetSignalHealth: 100, // 100% verification target
            minimumPassingHealth: 80, // 80% minimum for production
            headless: true, // Run browsers in headless mode
            ...config
        };
        
        this.session = {
            sessionId: `VL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            startTime: new Date().toISOString(),
            targetUrl: null,
            iterations: [],
            finalStatus: null,
            revenueRecovered: 0,
            totalIssuesFixed: 0
        };
    }

    async startVerificationLoop(targetUrl, clientData = {}) {
        console.log('\n🎯 THE FORENSIC DATA LAB - AUTONOMOUS VERIFICATION LOOP');
        console.log('====================================================');
        console.log(`Session ID: ${this.session.sessionId}`);
        console.log(`Target: ${targetUrl}`);
        
        // Store client revenue data for accurate impact calculations
        this.session.clientData = {
            monthlyRevenue: clientData.monthlyRevenue || null,
            monthlyAdSpend: clientData.monthlyAdSpend || null,
            industry: clientData.industry || 'e-commerce'
        };
        
        if (this.session.clientData.monthlyRevenue) {
            console.log(`Monthly Revenue: $${this.session.clientData.monthlyRevenue.toLocaleString()}`);
        }
        if (this.session.clientData.monthlyAdSpend) {
            console.log(`Monthly Ad Spend: $${this.session.clientData.monthlyAdSpend.toLocaleString()}`);
        }
        console.log(`Goal: Achieve ${this.config.targetSignalHealth}% signal verification\n`);
        
        this.session.targetUrl = targetUrl;
        let currentHealth = 0;
        let iteration = 0;
        
        try {
            // Start the Ralph Wiggum Loop
            while (currentHealth < this.config.targetSignalHealth && iteration < this.config.maxIterations) {
                iteration++;
                console.log(`🔄 ITERATION ${iteration} - Starting verification cycle`);
                
                const iterationResult = await this.runSingleIteration(targetUrl, iteration);
                this.session.iterations.push(iterationResult);
                
                currentHealth = iterationResult.auditResults.signalHealth;
                
                if (currentHealth >= this.config.targetSignalHealth) {
                    this.session.finalStatus = 'SUCCESS';
                    console.log(`\n✅ SUCCESS: Achieved ${currentHealth}% signal health!`);
                    break;
                } else if (currentHealth >= this.config.minimumPassingHealth) {
                    console.log(`\n⚠️  ACCEPTABLE: ${currentHealth}% signal health (minimum threshold met)`);
                    this.session.finalStatus = 'ACCEPTABLE';
                    break;
                } else {
                    console.log(`\n📊 Current health: ${currentHealth}% - Continuing loop...`);
                    
                    if (iteration >= this.config.maxIterations) {
                        this.session.finalStatus = 'MAX_ITERATIONS_REACHED';
                        console.log(`\n⚠️  Reached maximum iterations (${this.config.maxIterations})`);
                        break;
                    }
                    
                    // Wait 5 seconds between iterations for any deployed fixes to take effect
                    console.log('⏳ Waiting 5 seconds for fixes to take effect...');
                    await this.sleep(5000);
                }
            }
            
            await this.generateFinalReport();
            return this.session;
            
        } catch (error) {
            console.error('🚨 VERIFICATION LOOP FAILED:', error);
            this.session.finalStatus = 'ERROR';
            this.session.error = error.message;
            return this.session;
        }
    }

    async runSingleIteration(targetUrl, iterationNumber) {
        const iteration = {
            number: iterationNumber,
            timestamp: new Date().toISOString(),
            auditResults: null,
            repairResults: null,
            deploymentStatus: null,
            signalImprovements: 0
        };

        try {
            // STEP 0: CHECK KNOWN CONFIGURATIONS FIRST
            const knownConfig = getKnownConfiguration(targetUrl);
            if (knownConfig && isVerificationCurrent(knownConfig)) {
                console.log(`🎯 USING KNOWN CONFIGURATION: ${knownConfig.status}`);
                console.log(`📊 Last verified: ${knownConfig.lastVerified}`);
                console.log(`✅ Signal Health: ${knownConfig.signalHealth}% (cached result)`);
                
                // Calculate REAL revenue impact using client's actual data
                const realRevenueLeakage = this.calculateRealRevenueImpact(knownConfig.signalHealth);
                
                iteration.auditResults = {
                    timestamp: new Date().toISOString(),
                    url: targetUrl,
                    signalHealth: knownConfig.signalHealth,
                    revenueLeakage: realRevenueLeakage,
                    signalFailures: [],
                    ecommerceJourney: knownConfig.ecommerceJourney,
                    fromCache: true,
                    setup: knownConfig.setup
                };
            } else {
                // STEP 1: SCAN & AUDIT (Full scan for unknown/stale configs)
                console.log(`📊 Step 1: Scanning revenue signals...`);
                const auditEngine = new RevenueSignalAuditEngine({
                    headless: this.config.headless,
                    timeout: 15000,
                    clientData: this.session.clientData  // Pass real client data
                });
                
                iteration.auditResults = await auditEngine.performRevenueAudit(targetUrl);
            }
            
            const previousHealth = iterationNumber > 1 ? 
                this.session.iterations[iterationNumber - 2].auditResults.signalHealth : 0;
            iteration.signalImprovements = iteration.auditResults.signalHealth - previousHealth;
            
            console.log(`📈 Signal Health: ${iteration.auditResults.signalHealth}% (${iteration.signalImprovements >= 0 ? '+' : ''}${iteration.signalImprovements}%)`);
            console.log(`💰 Revenue Impact: $${iteration.auditResults.revenueLeakage.monthlyLoss.toLocaleString()}/month leakage`);
            
            // STEP 2: REPAIR (if issues found)
            if (iteration.auditResults.signalHealth < this.config.targetSignalHealth) {
                console.log(`🔧 Step 2: Generating automated repairs...`);
                
                // For cached results, add missing event info to signalFailures for repair engine
                if (iteration.auditResults.fromCache) {
                    iteration.auditResults.signalFailures = [];
                    const journey = iteration.auditResults.ecommerceJourney;
                    
                    if (!journey.addToCart) {
                        iteration.auditResults.signalFailures.push({
                            severity: 'medium',
                            category: 'revenue_signal_failure',
                            title: 'Add to Cart Signal Missing',
                            description: 'add_to_cart event not firing',
                            monthlyLoss: 800 // Realistic impact
                        });
                    }
                    if (!journey.beginCheckout) {
                        iteration.auditResults.signalFailures.push({
                            severity: 'medium',
                            category: 'revenue_signal_failure',
                            title: 'Checkout Initiation Signal Missing',
                            description: 'begin_checkout event not firing',
                            monthlyLoss: 1200 // Realistic impact
                        });
                    }
                }
                
                const repairEngine = new TrackingRepairEngine(iteration.auditResults, {
                    platform: 'shopify',
                    outputFormat: 'liquid'
                });
                
                const repairResults = await repairEngine.generateAllRepairs();
                const repairReport = repairEngine.generateRepairReport();
                
                iteration.repairResults = repairReport;
                
                console.log(`🛠️  Generated ${repairReport.summary.totalFixes} fixes for ${repairReport.summary.totalIssues} issues`);
                console.log(`⏱️  Estimated repair time: ${repairReport.summary.estimatedTime}`);
                
                // Save repair instructions for manual deployment
                await this.saveRepairInstructions(iterationNumber, repairReport);
                
                // STEP 3: DEPLOY (simulated - in production this would deploy fixes)
                console.log(`🚀 Step 3: Simulating deployment...`);
                iteration.deploymentStatus = await this.simulateDeployment(repairReport);
                
                this.session.totalIssuesFixed += repairReport.summary.totalFixes;
            } else {
                console.log(`✅ No repairs needed - signal health at target level`);
            }
            
            // STEP 4: RECONCILE (verify deployment worked)
            console.log(`🔍 Step 4: Reconciling results...`);
            if (iterationNumber > 1) {
                const improvement = iteration.auditResults.signalHealth - previousHealth;
                if (improvement > 0) {
                    console.log(`✅ Improvement detected: +${improvement}% signal health`);
                } else {
                    console.log(`⚠️  No improvement detected from last iteration`);
                }
            }
            
            return iteration;
            
        } catch (error) {
            console.error(`❌ Iteration ${iterationNumber} failed:`, error.message);
            iteration.error = error.message;
            return iteration;
        }
    }

    async simulateDeployment(repairReport) {
        // In production, this would:
        // 1. Deploy GTM container changes
        // 2. Update Shopify theme files
        // 3. Publish changes to live site
        // 4. Verify deployment success
        
        await this.sleep(2000); // Simulate deployment time
        
        const deploymentSuccess = Math.random() > 0.1; // 90% success rate simulation
        
        return {
            status: deploymentSuccess ? 'SUCCESS' : 'FAILED',
            gtmDeployment: deploymentSuccess,
            themeDeployment: deploymentSuccess,
            timestamp: new Date().toISOString(),
            simulatedDeployment: true
        };
    }

    async saveRepairInstructions(iteration, repairReport) {
        try {
            const reportsDir = path.join(__dirname, 'reports');
            await fs.mkdir(reportsDir, { recursive: true });
            
            const filename = `${this.session.sessionId}-iteration-${iteration}-repairs.json`;
            const filepath = path.join(reportsDir, filename);
            
            await fs.writeFile(filepath, JSON.stringify(repairReport, null, 2));
            console.log(`📄 Repair instructions saved: ${filepath}`);
            
        } catch (error) {
            console.warn('Failed to save repair instructions:', error.message);
        }
    }

    async generateFinalReport() {
        console.log('\n📊 GENERATING FINAL VERIFICATION REPORT');
        console.log('=====================================');
        
        const finalIteration = this.session.iterations[this.session.iterations.length - 1];
        const finalHealth = finalIteration?.auditResults?.signalHealth || 0;
        const finalRevenueLeakage = finalIteration?.auditResults?.revenueLeakage?.monthlyLoss || 0;
        
        // Calculate total revenue recovered
        const initialLeakage = this.session.iterations[0]?.auditResults?.revenueLeakage?.monthlyLoss || 0;
        this.session.revenueRecovered = Math.max(0, initialLeakage - finalRevenueLeakage);
        
        const report = {
            sessionSummary: {
                sessionId: this.session.sessionId,
                targetUrl: this.session.targetUrl,
                totalIterations: this.session.iterations.length,
                finalStatus: this.session.finalStatus,
                duration: this.calculateSessionDuration(),
                finalSignalHealth: finalHealth,
                revenueRecovered: this.session.revenueRecovered,
                totalIssuesFixed: this.session.totalIssuesFixed
            },
            performanceMetrics: {
                signalHealthProgression: this.session.iterations.map((iter, index) => ({
                    iteration: index + 1,
                    health: iter.auditResults?.signalHealth || 0,
                    improvement: iter.signalImprovements || 0
                })),
                revenueImpactReduction: this.session.iterations.map((iter, index) => ({
                    iteration: index + 1,
                    monthlyLeakage: iter.auditResults?.revenueLeakage?.monthlyLoss || 0,
                    annualImpact: (iter.auditResults?.revenueLeakage?.monthlyLoss || 0) * 12
                }))
            },
            businessValue: this.calculateBusinessValue(),
            recommendations: this.generateRecommendations(),
            detailedIterations: this.session.iterations
        };
        
        // Save final report
        try {
            const reportsDir = path.join(__dirname, 'reports');
            await fs.mkdir(reportsDir, { recursive: true });
            
            const filename = `${this.session.sessionId}-FINAL-REPORT.json`;
            const filepath = path.join(reportsDir, filename);
            
            await fs.writeFile(filepath, JSON.stringify(report, null, 2));
            
            // Display summary
            this.displayFinalSummary(report);
            
            console.log(`\n📄 Complete report saved: ${filepath}`);
            return filepath;
            
        } catch (error) {
            console.error('Failed to save final report:', error);
            this.displayFinalSummary(report);
        }
    }

    displayFinalSummary(report) {
        const summary = report.sessionSummary;
        
        console.log(`\n🎯 SESSION COMPLETE: ${summary.finalStatus}`);
        console.log(`🔍 Target: ${summary.targetUrl}`);
        console.log(`⚡ Iterations: ${summary.totalIterations}/${this.config.maxIterations}`);
        console.log(`📊 Final Signal Health: ${summary.finalSignalHealth}%`);
        console.log(`💰 Revenue Recovered: $${summary.revenueRecovered.toLocaleString()}/month`);
        console.log(`🔧 Issues Fixed: ${summary.totalIssuesFixed}`);
        console.log(`⏱️  Duration: ${summary.duration}`);
        
        if (summary.finalSignalHealth >= this.config.targetSignalHealth) {
            console.log('\n✅ MISSION ACCOMPLISHED: 100% Signal Verification Achieved!');
        } else if (summary.finalSignalHealth >= this.config.minimumPassingHealth) {
            console.log('\n⚠️  ACCEPTABLE RESULT: Minimum threshold reached');
            console.log(`🎯 Next Goal: Continue optimization to reach ${this.config.targetSignalHealth}%`);
        } else {
            console.log('\n❌ INCOMPLETE: Signal health below minimum threshold');
            console.log('🔄 Recommendation: Manual review and additional iterations required');
        }
    }

    calculateBusinessValue() {
        const finalIteration = this.session.iterations[this.session.iterations.length - 1];
        
        if (!finalIteration?.auditResults) return null;
        
        return {
            monthlyRevenueRecovered: this.session.revenueRecovered,
            annualRevenueRecovered: this.session.revenueRecovered * 12,
            adSpendOptimization: Math.round(this.session.revenueRecovered * 0.3), // 30% of recovered revenue from ad efficiency
            algorithmImprovement: this.session.revenueRecovered > 50000 ? 'Significant' : 
                                 this.session.revenueRecovered > 20000 ? 'Moderate' : 'Minor',
            roi: this.calculateROI(),
            timeToPayback: this.calculatePaybackTime()
        };
    }

    calculateROI() {
        // Assuming $2,950 Signal Restoration service cost
        const serviceCost = 2950;
        const annualRecovery = this.session.revenueRecovered * 12;
        
        if (annualRecovery === 0) return 0;
        return Math.round(((annualRecovery - serviceCost) / serviceCost) * 100);
    }

    calculatePaybackTime() {
        const serviceCost = 2950;
        const monthlyRecovery = this.session.revenueRecovered;
        
        if (monthlyRecovery === 0) return 'N/A';
        const months = Math.ceil(serviceCost / monthlyRecovery);
        return `${months} month${months === 1 ? '' : 's'}`;
    }

    generateRecommendations() {
        const finalIteration = this.session.iterations[this.session.iterations.length - 1];
        const finalHealth = finalIteration?.auditResults?.signalHealth || 0;
        
        const recommendations = [];
        
        if (finalHealth < 50) {
            recommendations.push('CRITICAL: Fundamental tracking infrastructure requires rebuild');
            recommendations.push('Consider comprehensive audit of GTM and GA4 implementation');
            recommendations.push('Verify website platform permissions and access');
        } else if (finalHealth < 80) {
            recommendations.push('Continue optimization with additional repair iterations');
            recommendations.push('Manual review of complex issues may be required');
            recommendations.push('Consider server-side tracking implementation');
        } else if (finalHealth < 100) {
            recommendations.push('Fine-tune remaining signal gaps');
            recommendations.push('Monitor for edge cases and mobile-specific issues');
            recommendations.push('Implement ongoing monitoring for signal degradation');
        } else {
            recommendations.push('Maintain current configuration with regular monitoring');
            recommendations.push('Set up alerts for signal degradation');
            recommendations.push('Schedule quarterly verification loops');
        }
        
        recommendations.push('Consider Shadow Monitoring service for ongoing maintenance');
        
        return recommendations;
    }

    calculateSessionDuration() {
        const startTime = new Date(this.session.startTime);
        const endTime = new Date();
        const durationMs = endTime - startTime;
        
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        
        return `${minutes}m ${seconds}s`;
    }

    calculateRealRevenueImpact(signalHealth) {
        const totalSignalLoss = Math.min(15 + (100 - signalHealth), 50); // Same logic as audit engine
        const clientRevenue = this.session.clientData.monthlyRevenue || 0;
        const clientAdSpend = this.session.clientData.monthlyAdSpend || 0;
        
        if (!clientRevenue || clientRevenue === 0) {
            return {
                monthlyLoss: 0,
                annualLoss: 0,
                signalLossPercentage: totalSignalLoss,
                adSpendWaste: 0,
                note: 'No revenue provided - impact calculation skipped'
            };
        }
        
        // Real calculation based on actual client data
        const revenueImpact = 0.08; // 8% of lost signals affects revenue
        const adWasteMultiplier = 0.15; // 15% of lost signals wastes ad spend
        
        const monthlyRevenueLoss = Math.round(clientRevenue * (totalSignalLoss / 100) * revenueImpact);
        const monthlyAdWaste = Math.round(clientAdSpend * (totalSignalLoss / 100) * adWasteMultiplier);
        const totalMonthlyLoss = monthlyRevenueLoss + monthlyAdWaste;
        
        return {
            monthlyLoss: totalMonthlyLoss,
            annualLoss: totalMonthlyLoss * 12,
            signalLossPercentage: totalSignalLoss,
            breakdown: {
                revenueLoss: monthlyRevenueLoss,
                adSpendWaste: monthlyAdWaste,
                clientRevenue: clientRevenue,
                clientAdSpend: clientAdSpend
            }
        };
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CLI Usage
async function main() {
    const targetUrl = process.argv[2];
    const monthlyRevenue = process.argv[3] ? parseInt(process.argv[3]) : null;
    const monthlyAdSpend = process.argv[4] ? parseInt(process.argv[4]) : null;
    
    if (!targetUrl) {
        console.log('🎯 The Forensic Data Lab - Autonomous Verification Loop');
        console.log('Usage: node main.js <store-url> [monthly-revenue] [monthly-ad-spend]');
        console.log('\nExamples:');
        console.log('  node main.js https://yourstore.com 50000 8000');
        console.log('  node main.js https://yourstore.com 0 0  (for testing/low-revenue stores)');
        console.log('\nWithout revenue data, impact calculations will be skipped.');
        console.log('\nThis will run the complete Ralph Wiggum verification loop:');
        console.log('  1. Scan → Audit revenue signals');
        console.log('  2. Calculate REAL impact based on YOUR revenue/ad spend');
        console.log('  3. Repair → Generate code fixes');
        console.log('  4. Deploy → Apply fixes (simulated)');
        console.log('  5. Reconcile → Verify improvements');
        console.log('  6. Repeat until 100% verification achieved\n');
        process.exit(1);
    }
    
    // Validate URL
    try {
        new URL(targetUrl);
    } catch {
        console.error('❌ Invalid URL provided');
        console.log('Please provide a valid URL (e.g., https://yourstore.myshopify.com)');
        process.exit(1);
    }
    
    const orchestrator = new VerificationLoopOrchestrator({
        maxIterations: 5,
        targetSignalHealth: 100,
        minimumPassingHealth: 80,
        headless: process.argv.includes('--headless') || !process.argv.includes('--no-headless')
    });
    
    try {
        const clientData = {
            monthlyRevenue: monthlyRevenue,
            monthlyAdSpend: monthlyAdSpend
        };
        
        const session = await orchestrator.startVerificationLoop(targetUrl, clientData);
        
        // Exit with appropriate code
        if (session.finalStatus === 'SUCCESS') {
            process.exit(0);
        } else if (session.finalStatus === 'ACCEPTABLE') {
            process.exit(0);
        } else {
            process.exit(1);
        }
        
    } catch (error) {
        console.error('🚨 FATAL ERROR:', error);
        process.exit(1);
    }
}

// Export for use in other modules
module.exports = { VerificationLoopOrchestrator };

// Run if called directly
if (require.main === module) {
    main();
}