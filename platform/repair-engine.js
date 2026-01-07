/**
 * The Forensic Data Lab - Automated Repair Engine
 * Generates actual code fixes for tracking issues found during audit
 */

class TrackingRepairEngine {
    constructor(auditResults, config = {}) {
        this.auditResults = auditResults;
        this.config = {
            platform: 'shopify', // shopify, woocommerce, custom
            outputFormat: 'liquid', // liquid, html, js
            ...config
        };
        
        this.repairs = {
            gtmFixes: [],
            ga4Fixes: [],
            ecommerceFixes: [],
            generatedCode: {},
            installationInstructions: []
        };
    }

    async generateAllRepairs() {
        console.log('🔧 REPAIR ENGINE: Generating code fixes...');
        
        // Analyze issues and generate fixes
        await this.generateGTMFixes();
        await this.generateGA4Fixes();
        await this.generateEcommerceFixes();
        await this.generateInstallationInstructions();
        
        console.log('✅ Generated fixes for all detected issues');
        return this.repairs;
    }

    async generateGTMFixes() {
        const issues = this.auditResults.signalFailures || [];
        const gtmIssues = issues.filter(issue => 
            issue.category === 'infrastructure_failure' || 
            (issue.title && issue.title.toLowerCase().includes('gtm'))
        );

        if (gtmIssues.length === 0) return;

        console.log('🏷️  Generating GTM fixes...');

        // Fix: Missing GTM Container
        const missingGTM = gtmIssues.find(issue => issue.title.includes('No GTM Container'));
        if (missingGTM) {
            this.repairs.gtmFixes.push({
                issue: 'Missing GTM Container',
                fix: 'Install GTM container code',
                code: this.generateGTMInstallCode()
            });
        }

        // Fix: Multiple GTM Containers
        const multipleGTM = gtmIssues.find(issue => issue.title.includes('Multiple GTM'));
        if (multipleGTM) {
            this.repairs.gtmFixes.push({
                issue: 'Multiple GTM Containers',
                fix: 'Remove duplicate GTM containers',
                code: this.generateGTMCleanupCode()
            });
        }

        // Fix: Wrong GTM Container
        const wrongContainer = this.detectWrongGTMContainer();
        if (wrongContainer) {
            this.repairs.gtmFixes.push({
                issue: 'Wrong GTM Container ID',
                fix: `Update to correct container: ${wrongContainer.correct}`,
                code: this.generateGTMUpdateCode(wrongContainer.current, wrongContainer.correct)
            });
        }
    }

    async generateGA4Fixes() {
        const issues = this.auditResults.signalFailures || [];
        const ga4Issues = issues.filter(issue => 
            issue.category === 'infrastructure_failure' || 
            (issue.title && issue.title.toLowerCase().includes('ga4'))
        );

        if (ga4Issues.length === 0) return;

        console.log('📊 Generating GA4 fixes...');

        // Fix: Missing GA4 Property
        const missingGA4 = ga4Issues.find(issue => issue.title.includes('No GA4 Property'));
        if (missingGA4) {
            this.repairs.ga4Fixes.push({
                issue: 'Missing GA4 Property',
                fix: 'Install GA4 tracking code',
                code: this.generateGA4InstallCode()
            });
        }

        // Fix: Wrong GA4 Property
        const wrongProperty = this.detectWrongGA4Property();
        if (wrongProperty) {
            this.repairs.ga4Fixes.push({
                issue: 'Wrong GA4 Property ID',
                fix: `Update to correct property: ${wrongProperty.correct}`,
                code: this.generateGA4UpdateCode(wrongProperty.current, wrongProperty.correct)
            });
        }

        // Fix: Deprecated Universal Analytics
        const deprecatedUA = ga4Issues.find(issue => issue.title.includes('Universal Analytics'));
        if (deprecatedUA) {
            this.repairs.ga4Fixes.push({
                issue: 'Deprecated Universal Analytics',
                fix: 'Replace UA with GA4',
                code: this.generateUAToGA4Migration()
            });
        }
    }

    async generateEcommerceFixes() {
        const issues = this.auditResults.signalFailures || [];
        const ecommerceIssues = issues.filter(issue => 
            issue.category === 'revenue_signal_failure'
        );

        if (ecommerceIssues.length === 0) return;

        console.log('🛍️  Generating E-commerce fixes...');

        // Generate missing event fixes
        const missingEvents = this.auditResults.ecommerceJourney || {};
        
        if (!missingEvents.view_item) {
            this.repairs.ecommerceFixes.push({
                event: 'view_item',
                fix: 'Add product view tracking',
                code: this.generateViewItemCode()
            });
        }

        if (!missingEvents.add_to_cart) {
            this.repairs.ecommerceFixes.push({
                event: 'add_to_cart',
                fix: 'Add cart tracking',
                code: this.generateAddToCartCode()
            });
        }

        if (!missingEvents.view_cart) {
            this.repairs.ecommerceFixes.push({
                event: 'view_cart',
                fix: 'Add cart page tracking',
                code: this.generateViewCartCode()
            });
        }

        if (!missingEvents.begin_checkout) {
            this.repairs.ecommerceFixes.push({
                event: 'begin_checkout',
                fix: 'Add checkout tracking',
                code: this.generateBeginCheckoutCode()
            });
        }

        if (!missingEvents.purchase) {
            this.repairs.ecommerceFixes.push({
                event: 'purchase',
                fix: 'Add purchase tracking',
                code: this.generatePurchaseCode()
            });
        }
    }

    generateGTMInstallCode() {
        const containerID = this.getCorrectGTMContainer();
        
        return {
            headCode: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${containerID}');</script>
<!-- End Google Tag Manager -->`,
            
            bodyCode: `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`,
            
            liquidVersion: this.config.platform === 'shopify' ? `
{%- comment -%} Google Tag Manager - Add to theme.liquid {%- endcomment -%}
{% unless settings.gtm_container_id == blank %}
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{{ settings.gtm_container_id }}');
</script>
{% endunless %}` : null,

            installLocation: 'Add to <head> section of theme.liquid',
            testingSteps: [
                'Install code in theme.liquid',
                'Open GTM in preview mode',
                'Navigate to your site',
                'Verify container loads in preview',
                'Publish GTM container when confirmed working'
            ]
        };
    }

    generateGA4InstallCode() {
        const propertyID = this.getCorrectGA4Property();
        
        return {
            gtagCode: `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${propertyID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${propertyID}');
</script>
<!-- End Google Analytics 4 -->`,

            gtmConfiguration: {
                tagName: 'GA4 Configuration',
                tagType: 'Google Analytics: GA4 Configuration',
                measurementID: propertyID,
                triggers: ['All Pages'],
                settings: {
                    enhanced_measurement: true,
                    page_view: true,
                    scroll_tracking: true,
                    outbound_clicks: true,
                    site_search: true,
                    video_engagement: true,
                    file_downloads: true
                }
            },

            installLocation: 'Add via GTM or directly to <head>',
            testingSteps: [
                'Install GA4 configuration',
                'Open GA4 DebugView',
                'Navigate to your site',
                'Verify page_view events appear',
                'Check Real-time reports show traffic'
            ]
        };
    }

    generateViewItemCode() {
        if (this.config.platform === 'shopify') {
            return {
                liquidCode: `{%- comment -%} Product View Tracking {%- endcomment -%}
{% if template contains 'product' %}
<script>
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'view_item',
  'ecommerce': {
    'currency': '{{ cart.currency.iso_code }}',
    'value': {{ product.price | money_without_currency | remove: ',' }},
    'items': [{
      'item_id': '{{ product.id }}',
      'item_name': {{ product.title | json }},
      'item_category': '{{ product.type }}',
      'item_variant': '{{ product.selected_or_first_available_variant.title }}',
      'price': {{ product.selected_or_first_available_variant.price | money_without_currency | remove: ',' }},
      'quantity': 1
    }]
  }
});
</script>
{% endif %}`,

                installLocation: 'Add to product.liquid template',
                triggerCondition: 'When product page loads'
            };
        }

        return {
            genericCode: `<script>
// Product View Tracking
function trackProductView(product) {
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    'event': 'view_item',
    'ecommerce': {
      'currency': 'USD',
      'value': product.price,
      'items': [{
        'item_id': product.id,
        'item_name': product.name,
        'item_category': product.category,
        'price': product.price,
        'quantity': 1
      }]
    }
  });
}

// Call on product page load
if (typeof productData !== 'undefined') {
  trackProductView(productData);
}
</script>`,
            installLocation: 'Add to product page template'
        };
    }

    generateAddToCartCode() {
        if (this.config.platform === 'shopify') {
            return {
                liquidCode: `{%- comment -%} Add to Cart Tracking {%- endcomment -%}
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Track add to cart
  document.querySelector('form[action*="/cart/add"]').addEventListener('submit', function(e) {
    const formData = new FormData(e.target);
    const variantId = formData.get('id');
    const quantity = formData.get('quantity') || 1;
    
    // Get variant data
    fetch('/products/{{ product.handle }}.js')
      .then(response => response.json())
      .then(product => {
        const variant = product.variants.find(v => v.id == variantId);
        
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
          'event': 'add_to_cart',
          'ecommerce': {
            'currency': '{{ cart.currency.iso_code }}',
            'value': (variant.price / 100) * quantity,
            'items': [{
              'item_id': variant.id,
              'item_name': product.title,
              'item_category': product.product_type,
              'item_variant': variant.title,
              'price': variant.price / 100,
              'quantity': parseInt(quantity)
            }]
          }
        });
      });
  });
});
</script>`,

                installLocation: 'Add to product.liquid template',
                triggerCondition: 'When add to cart form is submitted'
            };
        }

        return {
            genericCode: `<script>
// Add to Cart Tracking
function trackAddToCart(item) {
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    'event': 'add_to_cart',
    'ecommerce': {
      'currency': 'USD',
      'value': item.price * item.quantity,
      'items': [{
        'item_id': item.id,
        'item_name': item.name,
        'item_category': item.category,
        'price': item.price,
        'quantity': item.quantity
      }]
    }
  });
}

// Attach to add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function() {
    // Extract product data and call trackAddToCart(productData)
  });
});
</script>`,
            installLocation: 'Add to product page or global script'
        };
    }

    generateViewCartCode() {
        if (this.config.platform === 'shopify') {
            return {
                liquidCode: `{%- comment -%} Cart View Tracking {%- endcomment -%}
{% if template == 'cart' %}
<script>
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'view_cart',
  'ecommerce': {
    'currency': '{{ cart.currency.iso_code }}',
    'value': {{ cart.total_price | money_without_currency | remove: ',' }},
    'items': [
      {% for item in cart.items %}
      {
        'item_id': '{{ item.variant.id }}',
        'item_name': {{ item.product.title | json }},
        'item_category': '{{ item.product.type }}',
        'item_variant': '{{ item.variant.title }}',
        'price': {{ item.price | money_without_currency | remove: ',' }},
        'quantity': {{ item.quantity }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  }
});
</script>
{% endif %}`,

                installLocation: 'Add to cart.liquid template',
                triggerCondition: 'When cart page loads'
            };
        }

        return {
            genericCode: `<script>
// Cart View Tracking
function trackViewCart(cartItems) {
  const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    'event': 'view_cart',
    'ecommerce': {
      'currency': 'USD',
      'value': totalValue,
      'items': cartItems
    }
  });
}

// Call on cart page load
if (window.location.pathname.includes('/cart')) {
  // Extract cart data and call trackViewCart(cartData)
}
</script>`,
            installLocation: 'Add to cart page template'
        };
    }

    generateBeginCheckoutCode() {
        if (this.config.platform === 'shopify') {
            return {
                liquidCode: `{%- comment -%} Checkout Begin Tracking {%- endcomment -%}
{% if first_time_accessed %}
<script>
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'begin_checkout',
  'ecommerce': {
    'currency': '{{ checkout.currency }}',
    'value': {{ checkout.total_price | money_without_currency | remove: ',' }},
    'items': [
      {% for line_item in checkout.line_items %}
      {
        'item_id': '{{ line_item.variant.id }}',
        'item_name': {{ line_item.title | json }},
        'item_category': '{{ line_item.product.type }}',
        'item_variant': '{{ line_item.variant.title }}',
        'price': {{ line_item.price | money_without_currency | remove: ',' }},
        'quantity': {{ line_item.quantity }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  }
});
</script>
{% endif %}`,

                installLocation: 'Add to checkout.liquid template',
                triggerCondition: 'When checkout process begins'
            };
        }

        return {
            genericCode: `<script>
// Begin Checkout Tracking
function trackBeginCheckout(cartItems) {
  const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    'event': 'begin_checkout',
    'ecommerce': {
      'currency': 'USD',
      'value': totalValue,
      'items': cartItems
    }
  });
}

// Call when checkout process starts
document.querySelector('.checkout-button').addEventListener('click', function() {
  // Extract cart data and call trackBeginCheckout(cartData)
});
</script>`,
            installLocation: 'Add to checkout initiation'
        };
    }

    generatePurchaseCode() {
        if (this.config.platform === 'shopify') {
            return {
                liquidCode: `{%- comment -%} Purchase Tracking {%- endcomment -%}
{% if template == 'customers/order' or checkout.id %}
<script>
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': '{{ order.order_number | default: checkout.id }}',
    'currency': '{{ order.currency | default: checkout.currency }}',
    'value': {{ order.total_price | default: checkout.total_price | money_without_currency | remove: ',' }},
    'shipping': {{ order.shipping_price | default: checkout.shipping_price | money_without_currency | remove: ',' }},
    'tax': {{ order.tax_price | default: checkout.tax_price | money_without_currency | remove: ',' }},
    'items': [
      {% assign line_items = order.line_items | default: checkout.line_items %}
      {% for line_item in line_items %}
      {
        'item_id': '{{ line_item.variant.id }}',
        'item_name': {{ line_item.title | json }},
        'item_category': '{{ line_item.product.type }}',
        'item_variant': '{{ line_item.variant.title }}',
        'price': {{ line_item.price | money_without_currency | remove: ',' }},
        'quantity': {{ line_item.quantity }}
      }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    ]
  }
});
</script>
{% endif %}`,

                installLocation: 'Add to order confirmation page',
                triggerCondition: 'When purchase is completed'
            };
        }

        return {
            genericCode: `<script>
// Purchase Tracking
function trackPurchase(orderData) {
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({
    'event': 'purchase',
    'ecommerce': {
      'transaction_id': orderData.id,
      'currency': 'USD',
      'value': orderData.total,
      'shipping': orderData.shipping,
      'tax': orderData.tax,
      'items': orderData.items
    }
  });
}

// Call on order confirmation page
if (window.location.pathname.includes('/order-complete')) {
  // Extract order data and call trackPurchase(orderData)
}
</script>`,
            installLocation: 'Add to order confirmation page'
        };
    }

    detectWrongGTMContainer() {
        // This would contain logic to detect wrong container IDs
        // For demo purposes, return null (no wrong container detected)
        return null;
    }

    detectWrongGA4Property() {
        // This would contain logic to detect wrong GA4 properties
        // For demo purposes, return null (no wrong property detected)
        return null;
    }

    getCorrectGTMContainer() {
        // This would contain logic to determine the correct GTM container
        // For demo, return a placeholder
        return 'GTM-XXXXXXX';
    }

    getCorrectGA4Property() {
        // This would contain logic to determine the correct GA4 property
        // For demo, return a placeholder
        return 'G-XXXXXXXXXX';
    }

    generateInstallationInstructions() {
        this.repairs.installationInstructions = [
            {
                step: 1,
                title: 'Backup Your Current Setup',
                description: 'Download a copy of your current theme before making changes',
                commands: ['Download theme files', 'Export current GTM container']
            },
            {
                step: 2,
                title: 'Install GTM Fixes',
                description: 'Apply Google Tag Manager configuration updates',
                files: this.repairs.gtmFixes.map(fix => ({
                    file: fix.code.installLocation,
                    changes: 'Add GTM container code'
                }))
            },
            {
                step: 3,
                title: 'Install GA4 Fixes', 
                description: 'Apply Google Analytics 4 configuration updates',
                files: this.repairs.ga4Fixes.map(fix => ({
                    file: fix.code.installLocation,
                    changes: 'Add GA4 tracking code'
                }))
            },
            {
                step: 4,
                title: 'Install E-commerce Tracking',
                description: 'Add enhanced e-commerce event tracking',
                files: this.repairs.ecommerceFixes.map(fix => ({
                    file: fix.code.installLocation,
                    changes: `Add ${fix.event} tracking`
                }))
            },
            {
                step: 5,
                title: 'Test Implementation',
                description: 'Verify all tracking is working correctly',
                commands: [
                    'Open GTM Preview mode',
                    'Open GA4 DebugView',
                    'Navigate through site',
                    'Verify events are firing',
                    'Check Real-time reports'
                ]
            },
            {
                step: 6,
                title: 'Go Live',
                description: 'Publish changes to production',
                commands: [
                    'Publish GTM container',
                    'Deploy theme changes',
                    'Monitor for 24 hours',
                    'Verify data in GA4 reports'
                ]
            }
        ];

        console.log('📋 Generated complete installation instructions');
    }

    generateRepairReport() {
        return {
            summary: {
                totalIssues: (this.auditResults.signalFailures || []).length,
                totalFixes: this.repairs.gtmFixes.length + this.repairs.ga4Fixes.length + this.repairs.ecommerceFixes.length,
                estimatedTime: this.calculateRepairTime(),
                businessValue: this.calculateBusinessValue()
            },
            fixes: {
                gtm: this.repairs.gtmFixes,
                ga4: this.repairs.ga4Fixes,
                ecommerce: this.repairs.ecommerceFixes
            },
            installation: this.repairs.installationInstructions,
            testing: {
                preDeployment: [
                    'GTM Preview mode verification',
                    'GA4 DebugView testing',
                    'Cross-browser testing',
                    'Mobile device testing'
                ],
                postDeployment: [
                    'Real-time report monitoring',
                    'Event tracking verification',
                    'Conversion tracking validation',
                    '24-hour data validation'
                ]
            }
        };
    }

    calculateRepairTime() {
        let totalHours = 0;
        
        this.repairs.gtmFixes.forEach(fix => {
            totalHours += 2; // Average 2 hours per GTM fix
        });
        
        this.repairs.ga4Fixes.forEach(fix => {
            totalHours += 1.5; // Average 1.5 hours per GA4 fix
        });
        
        this.repairs.ecommerceFixes.forEach(fix => {
            totalHours += 1; // Average 1 hour per ecommerce event fix
        });
        
        return `${totalHours}-${totalHours + 2} hours`;
    }

    calculateBusinessValue() {
        const issues = this.auditResults.signalFailures || [];
        const criticalIssues = issues.filter(i => i.severity === 'critical').length;
        const highIssues = issues.filter(i => i.severity === 'high').length;
        
        const estimatedRecovery = {
            dataAccuracy: Math.min(95, 70 + (criticalIssues * 15) + (highIssues * 10)),
            conversionTracking: this.repairs.ecommerceFixes.length > 0 ? 'Full restoration' : 'Partial improvement',
            adOptimization: criticalIssues > 0 ? 'Significant improvement' : 'Moderate improvement'
        };
        
        return estimatedRecovery;
    }
}

module.exports = { TrackingRepairEngine };

// CLI Usage
if (require.main === module) {
    const auditResultsPath = process.argv[2];
    if (!auditResultsPath) {
        console.log('Usage: node repair-engine.js <audit-results.json>');
        process.exit(1);
    }
    
    const fs = require('fs');
    const auditResults = JSON.parse(fs.readFileSync(auditResultsPath, 'utf8'));
    
    const repairEngine = new TrackingRepairEngine(auditResults, {
        platform: 'shopify',
        outputFormat: 'liquid'
    });
    
    repairEngine.generateAllRepairs().then(() => {
        const report = repairEngine.generateRepairReport();
        
        console.log('\n🔧 REPAIR ENGINE COMPLETE');
        console.log(`Generated ${report.summary.totalFixes} fixes for ${report.summary.totalIssues} issues`);
        console.log(`Estimated repair time: ${report.summary.estimatedTime}`);
        
        // Save repair report
        const outputPath = auditResultsPath.replace('.json', '-repairs.json');
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Repair instructions saved: ${outputPath}`);
    }).catch(console.error);
}