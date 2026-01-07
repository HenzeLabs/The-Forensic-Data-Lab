/**
 * Known Working Configurations Database
 * Pre-verified setups to avoid re-scanning
 */

const knownConfigurations = {
    'lwscientific.com': {
        lastVerified: '2026-01-07',
        signalHealth: 100,
        setup: {
            webContainer: 'GTM-KMKS7RMC',
            serverContainer: 'GTM-5VT8N6KP', 
            ga4Property: '382698683'
        },
        ecommerceJourney: {
            productView: true,
            addToCart: true,
            viewCart: true,
            beginCheckout: true,
            purchase: true
        },
        revenueLeakage: {
            monthlyLoss: 0,
            annualLoss: 0,
            signalLossPercentage: 0
        },
        status: 'VERIFIED_100_PERCENT'
    },
    'store.labessentials.com': {
        lastVerified: '2026-01-07',
        signalHealth: 70,
        setup: {
            webContainer: 'GTM-WNG6Z9ZD',
            ga4Property: '394300830',
            serverContainer: null, // No server-side setup
            issues: ['Missing add_to_cart event', 'Missing begin_checkout event']
        },
        ecommerceJourney: {
            productView: true,
            addToCart: false,
            viewCart: true,
            beginCheckout: false,
            purchase: true
        },
        revenueLeakage: {
            monthlyLoss: 0, // Store does basically $0 revenue - no actual revenue loss
            annualLoss: 0,
            signalLossPercentage: 30,
            note: 'Low-revenue store - tracking issues exist but minimal financial impact'
        },
        status: 'TRACKING_ISSUES_LOW_IMPACT'
    }
};

function getKnownConfiguration(url) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        console.log(`🔍 Looking for known config for domain: ${domain}`);
        const config = knownConfigurations[domain];
        if (config) {
            console.log(`✅ Found known configuration for ${domain}`);
        } else {
            console.log(`❌ No known configuration for ${domain}`);
        }
        return config || null;
    } catch (error) {
        console.log(`❌ Error parsing URL: ${error.message}`);
        return null;
    }
}

function isVerificationCurrent(config, maxAgeHours = 24) {
    if (!config || !config.lastVerified) {
        console.log('❌ No config or lastVerified date');
        return false;
    }
    
    const lastVerified = new Date(config.lastVerified);
    const now = new Date();
    const hoursSince = (now - lastVerified) / (1000 * 60 * 60);
    
    console.log(`🕒 Verification age: ${hoursSince.toFixed(1)} hours (max: ${maxAgeHours})`);
    
    return hoursSince < maxAgeHours;
}

module.exports = { 
    getKnownConfiguration, 
    isVerificationCurrent,
    knownConfigurations 
};