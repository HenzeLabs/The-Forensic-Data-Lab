/**
 * The Forensic Data Lab - Social Media Campaign Content
 * Ready-to-use social media posts, ads, and campaign content for multiple platforms
 */

class SocialMediaCampaigns {
  constructor() {
    this.platforms = {
      linkedin: this.createLinkedInCampaigns(),
      twitter: this.createTwitterCampaigns(),
      facebook: this.createFacebookCampaigns(),
      instagram: this.createInstagramCampaigns(),
      tiktok: this.createTikTokCampaigns(),
      youtube: this.createYouTubeCampaigns(),
    };

    this.contentThemes = {
      problem_awareness: "Highlighting tracking issues",
      solution_focused: "Showcasing our solution",
      social_proof: "Client success stories",
      educational: "Teaching about tracking",
      behind_the_scenes: "Team and process content",
      urgency: "Time-sensitive offers",
    };
  }

  createLinkedInCampaigns() {
    return {
      platform: "LinkedIn",
      audience: "Business owners, CMOs, Marketing Directors",

      campaigns: {
        awareness: {
          name: "GA4 Tracking Problems Awareness",
          objective: "Brand awareness and lead generation",
          posts: [
            {
              type: "text_post",
              theme: "problem_awareness",
              content: `REALITY CHECK: 80% of businesses have broken GA4 tracking.

That means 4 out of 5 companies are making marketing decisions based on incomplete (or wrong) data.

Here's what I see every day:
→ Facebook ads getting blamed when the tracking is broken
→ "Best performing" campaigns that aren't actually working  
→ Marketing budgets cut because ROI "looks bad"
→ Successful channels getting paused by mistake

The worst part? Most businesses don't even know their tracking is broken.

We just audited a $5M company. Their tracking was so bad, they were about to fire their entire marketing team. 

Plot twist: The marketing was working. The tracking wasn't.

Don't let broken tracking kill your growth.

#GA4 #MarketingAnalytics #DataDriven #MarketingROI`,
              hashtags: [
                "#GA4",
                "#MarketingAnalytics",
                "#DataDriven",
                "#MarketingROI",
                "#ConversionTracking",
              ],
              cta: "What's your tracking health score? Find out in 5 minutes: [link]",
            },
            {
              type: "carousel_post",
              theme: "educational",
              content:
                "5 Signs Your GA4 Tracking Is Broken (And Costing You Money)",
              slides: [
                {
                  title: "Sign #1: Your conversion numbers don't add up",
                  description:
                    "GA4 shows 100 purchases, but Shopify shows 150. Sound familiar?",
                },
                {
                  title: "Sign #2: Facebook says 'No conversions'",
                  description:
                    "Your ads are working, but Facebook can't see the conversions",
                },
                {
                  title: "Sign #3: Your best traffic source is 'Direct'",
                  description:
                    "If most traffic shows as 'direct', attribution is broken",
                },
                {
                  title: "Sign #4: E-commerce events are at 0%",
                  description:
                    "No view_item, add_to_cart, or purchase events firing",
                },
                {
                  title: "Sign #5: Cross-domain tracking issues",
                  description:
                    "Sessions break when users go from site to checkout",
                },
              ],
              cta: "Get your free tracking audit: [link]",
            },
            {
              type: "video_post",
              theme: "social_proof",
              content: `Client spotlight: How we saved TechCorp $89K/month in 6 days.

The problem: Their tracking was so broken, they couldn't tell which marketing channels were working.

The solution: Our "Automated Verification Loop" methodology that doesn't stop until tracking is 100% perfect.

The result: 22% → 100% tracking accuracy in less than a week.

"The Forensic Data Lab didn't just fix our tracking - they gave us back visibility into our entire funnel." - Marcus Thompson, CEO

Ready to fix your tracking?

#ClientSuccess #GA4Fix #MarketingROI`,
              video_script: [
                "Hook: $89,000 per month. That's how much one tracking error was costing TechCorp.",
                "Problem: Show broken GA4 dashboard with missing data",
                "Solution: Quick overview of our audit process",
                "Results: Before/after comparison of tracking accuracy",
                "CTA: Get your free audit at Forensic Data Lab.pro",
              ],
            },
          ],
        },

        conversion: {
          name: "Free Audit Lead Generation",
          objective: "Generate qualified leads",
          posts: [
            {
              type: "text_post",
              theme: "urgency",
              content: `Free audit spots for this week: 3 remaining

I'm personally reviewing tracking setups for the next 3 businesses that book a free audit.

What you'll get:
✓ Complete tracking health score
✓ List of all issues found (usually 10-20)
✓ Estimated monthly revenue impact
✓ Priority-ranked fix roadmap

Takes 5 minutes to book, 48 hours to complete.

Last week's audits found an average of $47K/month in lost revenue per business.

Don't be next week's "what if" story.

Book below 👇`,
              cta: "Book your free audit (3 spots left)",
            },
          ],
        },

        nurture: {
          name: "Educational Content Series",
          objective: "Build trust and authority",
          posts: [
            {
              type: "text_post",
              theme: "educational",
              content: `Why the GA4 migration broke everyone's tracking (and how to fix it)

When Universal Analytics shut down, most businesses just "flipped the switch" to GA4.

Big mistake.

GA4 works completely differently:
→ Event-based instead of pageview-based
→ Requires proper e-commerce setup
→ Needs enhanced conversion tracking
→ Different attribution models

The businesses that are winning right now? They rebuilt their tracking from scratch.

The ones struggling? They assumed GA4 would "just work."

Which camp are you in?

#GA4Migration #WebTracking #MarketingAnalytics`,
              cta: "Not sure if your GA4 is set up correctly? Get a free audit: [link]",
            },
          ],
        },
      },
    };
  }

  createTwitterCampaigns() {
    return {
      platform: "Twitter",
      audience: "Tech-savvy marketers, startup founders, agencies",

      campaigns: {
        awareness: {
          name: "Quick Hit Problem Posts",
          posts: [
            {
              type: "thread",
              theme: "problem_awareness",
              tweets: [
                "Thread: Why Shopify brands lose 11-20% of revenue visibility (proven by data)",
                "1/ Your Facebook ads aren't working? Maybe. Or maybe your tracking is broken and you can't see the conversions.",
                "2/ We audited 500+ businesses this year. Average tracking accuracy: 34%. That means 66% of conversions are invisible.",
                "3/ The worst part? Most tracking breaks during the GA4 migration and never gets fixed.",
                "4/ Red flags your tracking is broken:\n→ Facebook shows 'no conversions'\n→ Best traffic source is 'direct' \n→ GA4 ≠ Shopify numbers\n→ E-commerce events at 0%",
                "5/ Good news: It's fixable. We use the 'Automated Verification Loop' - audit, diagnose, repair, verify, repeat until perfect.",
                "6/ Ready to see what's broken? Free 5-minute audit: [link]",
              ],
            },
            {
              type: "single_tweet",
              theme: "social_proof",
              content:
                "Client just texted: 'Holy crap, we can finally see which ads are working'\n\n22% → 100% tracking accuracy in 4 days.\n\nThe Automated Verification Loop strikes again.\n\nWhat's your tracking health score? Find out: [link]",
            },
            {
              type: "single_tweet",
              theme: "urgency",
              content:
                "Your tracking is bleeding money while you sleep\n\nEvery broken event = lost attribution = bad decisions = wasted budget\n\nStop the bleeding. Free audit: [link]",
            },
          ],
        },

        educational: {
          name: "Quick Tips and Insights",
          posts: [
            {
              type: "single_tweet",
              theme: "educational",
              content:
                "GA4 tip: If your 'Direct' traffic is >30%, your attribution is broken.\n\nDirect traffic should be 10-15% max for most businesses.\n\nHigh direct = referrer info is getting lost = you can't optimize properly.",
            },
            {
              type: "single_tweet",
              theme: "educational",
              content:
                "Quick test: Go to your GA4 → Events → See if these fire:\n\n✓ view_item\n✓ add_to_cart  \n✓ begin_checkout\n✓ purchase\n\nIf any are missing/broken, you're flying blind.\n\nNeed help? Free audit: [link]",
            },
          ],
        },
      },
    };
  }

  createFacebookCampaigns() {
    return {
      platform: "Facebook/Meta",
      audience: "Small business owners, e-commerce brands, marketing managers",

      ad_campaigns: {
        lead_generation: {
          name: "Free Audit Lead Gen",
          objective: "Lead generation",
          ads: [
            {
              type: "lead_ad",
              headline: "Is Your GA4 Stealing Your Revenue?",
              description:
                "80% of businesses have broken tracking. Find out what's wrong with yours in 5 minutes.",
              image_concept:
                "Split screen: broken tracking dashboard vs fixed dashboard",
              form_fields: ["email", "website", "monthly_revenue"],
              cta_button: "Get Free Audit",
            },
            {
              type: "traffic_ad",
              headline: "Stop Wasting Money on Ads You Can't Track",
              description:
                "Your revenue signals are degrading. Shopify brands lose 11-20% revenue visibility daily.",
              video_concept: "Screen recording of broken GA4 setup being fixed",
              cta_button: "Fix My Tracking",
            },
          ],
        },

        retargeting: {
          name: "Website Visitor Retargeting",
          objective: "Conversions",
          ads: [
            {
              type: "carousel_ad",
              headline: "Still Thinking About Your Tracking Issues?",
              description:
                "Don't let broken tracking cost you another month of revenue.",
              cards: [
                {
                  image_concept: "Audit results screenshot",
                  headline: "See What's Broken",
                  description: "Free 5-minute audit reveals all issues",
                },
                {
                  image_concept: "Before/after tracking scores",
                  headline: "Get It Fixed",
                  description: "We handle everything for you",
                },
                {
                  image_concept: "Happy client testimonial",
                  headline: "Join 500+ Happy Clients",
                  description: "100% success guarantee",
                },
              ],
            },
          ],
        },
      },

      organic_posts: [
        {
          type: "image_post",
          theme: "problem_awareness",
          content:
            "😱 This GA4 setup is costing them $50K/month\n\n❌ 0% e-commerce tracking\n❌ No conversion attribution \n❌ Facebook can't see purchases\n❌ Wasting 70% of ad budget\n\nThe scary part? They had no idea.\n\nIs your tracking broken too? Free audit below 👇",
          image_concept: "Screenshot of broken GA4 dashboard with red X's",
        },
        {
          type: "video_post",
          theme: "educational",
          content:
            "Quick test: Is your GA4 tracking working? ✅\n\n1️⃣ Check if purchase events are firing\n2️⃣ Compare GA4 vs Shopify numbers  \n3️⃣ Look at your attribution sources\n4️⃣ Test your conversion funnel\n\nIf anything looks off, you need help.\n\nGet your free audit: [link]",
          video_concept: "Screen recording showing how to check these 4 things",
        },
      ],
    };
  }

  createInstagramCampaigns() {
    return {
      platform: "Instagram",
      audience: "Visual-first business owners, lifestyle entrepreneurs",

      content: {
        posts: [
          {
            type: "carousel_post",
            theme: "behind_the_scenes",
            content:
              "Behind the scenes: Fixing a $2M company's broken tracking 🛠️\n\nSlide 1: The problem (22% tracking accuracy)\nSlide 2: Our team diving deep into GA4\nSlide 3: Testing every single event\nSlide 4: The result (100% accuracy) \nSlide 5: Happy client testimonial\n\nThis is what the Automated Verification Loop looks like in action.\n\nReady to fix yours? Link in bio 🎯\n\n#Forensic Data Lab #GA4 #MarketingAnalytics #SmallBusiness #Entrepreneur",
            visual_concept:
              "Behind-the-scenes photos of team working, screenshots of process",
          },
          {
            type: "reel",
            theme: "educational",
            content:
              "POV: You just realized your tracking has been broken for months 😅\n\n✅ Save this post\n✅ Tag a friend who needs to see this  \n✅ Get your free audit (link in bio)\n\n#MarketingTips #GA4 #TrackingProblems #SmallBusiness",
            video_concept:
              "Trending audio with text overlay showing tracking problems",
          },
        ],

        stories: [
          {
            type: "poll_story",
            theme: "engagement",
            content: "Quick poll: Do you trust your GA4 data?",
            options: ["Yes, completely", "Not really sure"],
            follow_up: "Swipe up for free audit if you voted 'not sure' 👆",
          },
          {
            type: "question_sticker",
            theme: "educational",
            content: "What's your biggest tracking challenge?",
            follow_up:
              "DM me your question + website and I'll audit it for free!",
          },
        ],
      },
    };
  }

  createTikTokCampaigns() {
    return {
      platform: "TikTok",
      audience: "Young entrepreneurs, e-commerce business owners",

      content: {
        videos: [
          {
            type: "educational",
            hook: "If your Facebook ads show 'no conversions', this might be why",
            script: [
              "Hook: Facebook ads not showing conversions? Here's the real problem",
              "Problem: Your tracking is broken, not your ads",
              "Solution: Show quick audit process",
              "Result: Before/after conversion data",
              "CTA: Link in bio for free audit",
            ],
            trending_sounds: ["Oh No (audio)", "Suspense audio"],
            hashtags: [
              "#FacebookAds",
              "#MarketingTips",
              "#SmallBusiness",
              "#TrackingProblems",
            ],
          },
          {
            type: "behind_the_scenes",
            hook: "POV: Client texts you at 2am because their tracking finally works",
            script: [
              "Show fake client text: 'HOLY CRAP THE TRACKING WORKS'",
              "Cut to: Team celebrating another successful fix",
              "Show: Before/after tracking dashboard",
              "End: 'This could be you' + CTA",
            ],
            visual_style: "Quick cuts, trending transitions",
          },
        ],
      },
    };
  }

  createYouTubeCampaigns() {
    return {
      platform: "YouTube",
      audience:
        "Marketing professionals, business owners seeking in-depth content",

      content: {
        long_form: [
          {
            title: "Why 80% of GA4 Setups Are Broken (And How to Fix Yours)",
            description:
              "Complete guide to auditing and fixing your GA4 tracking setup",
            duration: "15-20 minutes",
            outline: [
              "Introduction: The tracking crisis",
              "Part 1: Common GA4 problems",
              "Part 2: How to audit your setup",
              "Part 3: Fixing critical issues",
              "Part 4: Verification and testing",
              "Conclusion: When to get professional help",
            ],
            cta: "Free audit link in description",
          },
        ],

        shorts: [
          {
            title: "Quick GA4 Health Check in 60 Seconds",
            script: [
              "0-5s: Hook - Is your GA4 broken?",
              "5-15s: Quick test #1 - Check purchase events",
              "15-25s: Quick test #2 - Compare to Shopify",
              "25-35s: Quick test #3 - Look at traffic sources",
              "35-50s: If any fail, you need help",
              "50-60s: CTA - Free audit link",
            ],
          },
        ],
      },
    };
  }

  // Campaign management methods
  getCampaignContent(platform, campaignType, postType = null) {
    const platformData = this.platforms[platform];
    if (!platformData) {
      throw new Error(`Platform ${platform} not found`);
    }

    if (postType) {
      return platformData.campaigns[campaignType].posts.filter(
        (post) => post.type === postType
      );
    }

    return platformData.campaigns[campaignType];
  }

  getAllPlatforms() {
    return Object.keys(this.platforms);
  }

  getContentByTheme(theme) {
    const results = {};

    Object.keys(this.platforms).forEach((platform) => {
      const platformData = this.platforms[platform];
      results[platform] = [];

      // Search through all campaigns and posts
      Object.values(platformData.campaigns || {}).forEach((campaign) => {
        campaign.posts?.forEach((post) => {
          if (post.theme === theme) {
            results[platform].push({
              ...post,
              campaign: campaign.name,
            });
          }
        });
      });

      // Search through organic posts if they exist
      if (platformData.organic_posts) {
        platformData.organic_posts.forEach((post) => {
          if (post.theme === theme) {
            results[platform].push(post);
          }
        });
      }
    });

    return results;
  }

  generateContentCalendar(startDate, duration = 30) {
    const calendar = [];
    const start = new Date(startDate);

    for (let i = 0; i < duration; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);

      // Rotate through themes and platforms
      const themes = Object.keys(this.contentThemes);
      const platforms = this.getAllPlatforms();

      const dayTheme = themes[i % themes.length];
      const dayPlatform = platforms[i % platforms.length];

      calendar.push({
        date: date.toISOString().split("T")[0],
        platform: dayPlatform,
        theme: dayTheme,
        content: this.generateDailyContent(dayPlatform, dayTheme),
      });
    }

    return calendar;
  }

  generateDailyContent(platform, theme) {
    // Get relevant content for the platform and theme
    const themeContent = this.getContentByTheme(theme);
    const platformContent = themeContent[platform];

    if (platformContent && platformContent.length > 0) {
      return platformContent[
        Math.floor(Math.random() * platformContent.length)
      ];
    }

    // Fallback: generate basic content
    return {
      type: "text_post",
      theme: theme,
      content: `Daily ${theme} content for ${platform}. Check your tracking health score today!`,
      cta: "Get your free audit: [link]",
    };
  }

  exportCampaign(platform, campaignName, format = "json") {
    const campaignData = this.getCampaignContent(platform, campaignName);

    if (format === "csv") {
      return this.convertToCSV(campaignData);
    }

    return JSON.stringify(campaignData, null, 2);
  }

  convertToCSV(data) {
    const posts = data.posts || [data];
    const headers = ["Type", "Theme", "Content", "CTA"];
    const rows = posts.map((post) => [
      post.type,
      post.theme,
      post.content?.replace(/\n/g, " ") || "",
      post.cta || "",
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }
}

module.exports = { SocialMediaCampaigns };

// Example usage
if (require.main === module) {
  const campaigns = new SocialMediaCampaigns();

  console.log("Social Media Campaigns Initialized\n");

  // Show available platforms
  console.log("Available Platforms:");
  campaigns.getAllPlatforms().forEach((platform) => {
    console.log(`- ${platform}`);
  });

  // Generate sample content calendar
  console.log("\n30-Day Content Calendar Sample:");
  const calendar = campaigns.generateContentCalendar("2024-12-01", 7);
  calendar.forEach((day) => {
    console.log(`${day.date} | ${day.platform} | ${day.theme}`);
  });

  // Show content by theme
  console.log("\nProblem Awareness Content:");
  const problemContent = campaigns.getContentByTheme("problem_awareness");
  Object.keys(problemContent).forEach((platform) => {
    if (problemContent[platform].length > 0) {
      console.log(`${platform}: ${problemContent[platform].length} posts`);
    }
  });
}
