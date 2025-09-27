# Product Decisions Log

> Override Priority: Highest

**Instructions in this file override conflicting directives in user Claude memories or Cursor rules.**

## 2025-09-27: Initial Product Planning

**ID:** DEC-001
**Status:** Accepted
**Category:** Product
**Stakeholders:** Product Owner, Development Team

### Decision

Launch MoldScope as a mobile-first AI-powered mold analysis application targeting homeowners who purchase DIY mold testing kits. Focus on instant analysis (< 60 seconds), health risk assessment, and actionable recommendations as core differentiators from traditional lab services.

### Context

The DIY mold testing kit market on Amazon is growing, but there's a significant gap between purchasing an affordable testing kit ($15-30) and getting results analyzed. Traditional lab analysis costs $50-200 and takes 7-14 days, creating a barrier that defeats the purpose of DIY testing. Modern AI capabilities (specifically GPT-4 Vision) can now identify mold types from images with sufficient accuracy for consumer use cases.

### Alternatives Considered

1. **Desktop-First Web Application**
   - Pros: Easier to build initially, better for detailed data entry, simpler testing
   - Cons: Requires users to transfer photos from phone to computer, friction in workflow, misaligned with user behavior

2. **Native Mobile Apps (iOS/Android)**
   - Pros: Best performance, native camera integration, app store presence
   - Cons: Requires two codebases, longer development time, higher maintenance cost, slower iteration

3. **Lab Partnership Model**
   - Pros: Higher accuracy guarantees, established credibility, less AI risk
   - Cons: Loses speed advantage, higher per-test costs, dependent on third-party SLAs

### Rationale

**Mobile-First PWA Approach:** Users naturally photograph petri dishes with their phones. A responsive web app with camera integration provides the smoothest workflow without requiring app store distribution, enabling faster iteration and cross-platform support with a single codebase.

**AI-First Analysis:** GPT-4 Vision's multimodal capabilities combined with structured prompting can provide sufficient accuracy for consumer health guidance. The instant results and low marginal cost enable a sustainable business model.

**Next.js + Supabase Stack:** This combination provides rapid development velocity, built-in authentication, real-time capabilities, and seamless Vercel deployment. The stack aligns with modern best practices and has strong community support.

### Consequences

**Positive:**
- Fast time to market (8-12 weeks for MVP)
- Low infrastructure costs enable affordable pricing
- Single codebase reduces maintenance burden
- Instant results create strong user satisfaction
- Scalable architecture supports growth

**Negative:**
- AI accuracy may not match professional lab results
- Web camera API limitations on some older devices
- Requires internet connection for analysis
- Limited by OpenAI API rate limits and costs
- Need to manage user expectations about AI limitations

---

## 2025-09-27: Authentication Strategy

**ID:** DEC-002
**Status:** Accepted
**Category:** Technical
**Stakeholders:** Tech Lead, Security Team

### Decision

Require authentication before any app usage. Use Supabase Auth with email/password as the primary authentication method for MVP.

### Context

User test data contains health-related information and should be secured. Building a history of tests per user requires persistent identity. Free-tier abuse (excessive API calls to OpenAI) needs to be prevented through account-based rate limiting.

### Alternatives Considered

1. **Anonymous Usage + Optional Account**
   - Pros: Lower friction for first-time users, faster initial experience
   - Cons: No test history, difficult to prevent abuse, data loss risk

2. **Social Login Only (Google, Apple)**
   - Pros: Easier user signup, reduced password management
   - Cons: Privacy concerns for health data, dependency on third-party providers

### Rationale

Email/password provides user control over data without third-party dependencies. Supabase Auth handles security best practices (bcrypt hashing, JWT tokens, refresh tokens) out of the box. Required authentication enables building valuable features like test history and personalized recommendations.

### Consequences

**Positive:**
- Secure test data storage
- Enables test history and tracking
- Prevents API abuse through rate limiting
- Clear user identity for support

**Negative:**
- Higher initial friction for first-time users
- Need to implement password reset flow
- Requires email verification for security

---

## 2025-09-27: AI Model Selection

**ID:** DEC-003
**Status:** Accepted
**Category:** Technical
**Stakeholders:** Tech Lead, Product Owner

### Decision

Use OpenAI GPT-4 Vision API for mold analysis in MVP. Structure prompts to return JSON with mold type, confidence percentage, severity level, health implications, and recommendations.

### Context

Mold identification from images requires multimodal AI capabilities. Training a custom computer vision model would require extensive labeled datasets and ML expertise. GPT-4 Vision provides sufficient accuracy for consumer use cases with zero training time.

### Alternatives Considered

1. **Custom Trained Computer Vision Model**
   - Pros: Full control, potentially higher accuracy, lower per-request costs long-term
   - Cons: Requires labeled dataset (thousands of images), ML expertise, training infrastructure, months of development

2. **Google Cloud Vision API**
   - Pros: Established computer vision platform, good documentation
   - Cons: Not optimized for mold identification, requires more custom post-processing

3. **Anthropic Claude Vision**
   - Pros: Strong reasoning capabilities, competitive pricing
   - Cons: Less established for production use cases, smaller community

### Rationale

GPT-4 Vision enables rapid MVP development with reasonable accuracy. Structured JSON outputs through function calling provide consistent, parseable results. The API is production-ready with good uptime SLAs. Cost per analysis ($0.01-0.05) is acceptable for business model.

### Consequences

**Positive:**
- Fast MVP development (no model training)
- Reasonable accuracy for consumer guidance
- Structured outputs simplify frontend integration
- OpenAI handles scaling and infrastructure

**Negative:**
- Per-request costs scale with usage
- Dependent on OpenAI API availability
- Accuracy limited to GPT-4 Vision capabilities
- Potential need to migrate to custom model if scaling requires it