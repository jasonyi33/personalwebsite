/**
 * Standalone preview of an alternative homepage design.
 *
 * Served verbatim as raw HTML at exactly `/preview-ai`, bypassing the site's
 * root layout, nav, fonts, and sitemap. Marked `noindex` and not linked from
 * anywhere, so it is reachable only by directly visiting the slug.
 */

export const dynamic = 'force-static';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Jason Yi | AI Product Engineer</title>

  <style>
    :root {
      --navy: #07182f;
      --blue: #244d8f;
      --text: #14213d;
      --muted: #667085;
      --light: #f7f9fc;
      --line: #e6eaf0;
      --card: #ffffff;
      --accent: #eef4ff;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background: white;
      line-height: 1.6;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .container {
      width: min(1120px, 92%);
      margin: 0 auto;
    }

    header {
      position: sticky;
      top: 0;
      z-index: 20;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--line);
    }

    .nav {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--navy);
      font-size: 20px;
    }

    .nav-links {
      display: flex;
      gap: 28px;
      font-size: 15px;
      color: var(--muted);
    }

    .nav-links a:hover {
      color: var(--navy);
    }

    .hero {
      padding: 96px 0 80px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 64px;
      align-items: center;
    }

    .eyebrow {
      color: var(--blue);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    h1 {
      font-size: clamp(48px, 7vw, 82px);
      line-height: 0.95;
      letter-spacing: -0.06em;
      color: var(--navy);
      margin-bottom: 28px;
    }

    .hero p {
      font-size: 21px;
      color: var(--muted);
      max-width: 620px;
      margin-bottom: 32px;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 14px 22px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 15px;
      border: 1px solid var(--line);
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .btn-primary {
      background: var(--navy);
      color: white;
      border-color: var(--navy);
    }

    .btn-secondary {
      background: white;
      color: var(--navy);
    }

    .hero-card {
      background: linear-gradient(180deg, #ffffff, #f6f8fc);
      border: 1px solid var(--line);
      border-radius: 32px;
      padding: 28px;
      box-shadow: 0 30px 80px rgba(7,24,47,0.10);
    }

    .hero-photo {
      width: 100%;
      height: 420px;
      object-fit: cover;
      object-position: center 22%;
      border-radius: 24px;
      display: block;
    }

    .stats {
      padding: 36px 0 80px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }

    .stat {
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 26px;
      background: var(--card);
    }

    .stat strong {
      display: block;
      font-size: 34px;
      color: var(--navy);
      letter-spacing: -0.04em;
      margin-bottom: 4px;
    }

    .stat span {
      color: var(--muted);
      font-size: 15px;
    }

    section {
      padding: 84px 0;
      border-top: 1px solid var(--line);
    }

    .section-head {
      max-width: 720px;
      margin-bottom: 42px;
    }

    h2 {
      font-size: clamp(36px, 5vw, 56px);
      line-height: 1;
      letter-spacing: -0.055em;
      color: var(--navy);
      margin-bottom: 18px;
    }

    .section-head p {
      color: var(--muted);
      font-size: 19px;
    }

    .work-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }

    .work-card {
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 28px;
      background: white;
      transition: transform .2s ease, box-shadow .2s ease;
    }

    .work-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 24px 60px rgba(7,24,47,0.08);
    }

    .tag {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      background: var(--accent);
      color: var(--blue);
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 18px;
    }

    .work-card h3 {
      font-size: 24px;
      color: var(--navy);
      line-height: 1.15;
      margin-bottom: 14px;
      letter-spacing: -0.03em;
    }

    .work-card p {
      color: var(--muted);
      margin-bottom: 20px;
    }

    .meta {
      font-size: 14px;
      color: var(--text);
      font-weight: 650;
    }

    .case {
      background: var(--light);
    }

    .case-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 40px;
      align-items: center;
    }

    .case-panel {
      background: white;
      border: 1px solid var(--line);
      border-radius: 30px;
      padding: 34px;
    }

    .case-panel h3 {
      font-size: 32px;
      line-height: 1.1;
      letter-spacing: -0.04em;
      color: var(--navy);
      margin-bottom: 16px;
    }

    .case-panel p {
      color: var(--muted);
      font-size: 18px;
      margin-bottom: 22px;
    }

    .flow {
      display: grid;
      gap: 12px;
    }

    .flow div {
      background: white;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 14px 16px;
      font-weight: 650;
      color: var(--navy);
    }

    .about-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 48px;
      align-items: start;
    }

    .about-photo {
      height: 360px;
      border-radius: 28px;
      border: 1px dashed #bcc7d8;
      background: #f3f6fb;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      font-weight: 600;
    }

    .about-text p {
      color: var(--muted);
      font-size: 19px;
      margin-bottom: 22px;
    }

    .pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 24px;
    }

    .pill {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 14px;
      color: var(--navy);
      background: white;
      font-weight: 650;
    }

    .contact {
      text-align: center;
      padding-bottom: 100px;
    }

    .contact p {
      color: var(--muted);
      font-size: 19px;
      margin-bottom: 28px;
    }

    footer {
      border-top: 1px solid var(--line);
      padding: 28px 0;
      color: var(--muted);
      font-size: 14px;
    }

    @media (max-width: 900px) {
      .hero-grid,
      .case-grid,
      .about-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid,
      .work-grid {
        grid-template-columns: 1fr 1fr;
      }

      .nav-links {
        display: none;
      }

      .hero {
        padding-top: 64px;
      }
    }

    @media (max-width: 580px) {
      .stats-grid,
      .work-grid {
        grid-template-columns: 1fr;
      }

      .hero-photo {
        height: 320px;
      }

      .hero-actions {
        flex-direction: column;
      }

      .btn {
        justify-content: center;
      }
    }
  </style>
</head>

<body>

<header>
  <div class="container nav">
    <div class="logo">Jason Yi</div>
    <nav class="nav-links">
      <a href="#work">Work</a>
      <a href="#case-studies">Case Studies</a>
      <a href="#about">About</a>
      <a href="/resume.pdf">Resume</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
</header>

<main>

  <!-- Hero -->
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <div class="eyebrow">Berkeley EECS · AI Product Engineer</div>
        <h1>I build AI products people actually use.</h1>
        <p>
          I design and ship production AI systems that turn customer feedback,
          documents, voice, and workflows into real business decisions.
        </p>

        <div class="hero-actions">
          <a class="btn btn-primary" href="#work">View Work →</a>
          <a class="btn btn-secondary" href="/resume.pdf">Download Resume</a>
        </div>
      </div>

      <div class="hero-card">
        <img class="hero-photo" src="/preview-ai-photo.jpg" alt="Jason Yi" />
      </div>
    </div>
  </section>

  <!-- Metrics -->
  <div class="stats">
    <div class="container stats-grid">
      <div class="stat">
        <strong>200K+</strong>
        <span>customer reviews analyzed</span>
      </div>
      <div class="stat">
        <strong>500+</strong>
        <span>enterprise documents processed</span>
      </div>
      <div class="stat">
        <strong>3</strong>
        <span>production AI systems shipped</span>
      </div>
      <div class="stat">
        <strong>$5K</strong>
        <span>OpenAI startup grant</span>
      </div>
    </div>
  </div>

  <!-- Work -->
  <section id="work">
    <div class="container">
      <div class="section-head">
        <div class="eyebrow">Selected Work</div>
        <h2>Production systems, not just demos.</h2>
        <p>
          A focused collection of products and systems built for real users,
          real workflows, and measurable outcomes.
        </p>
      </div>

      <div class="work-grid">
        <article class="work-card">
          <span class="tag">AI SaaS</span>
          <h3>Leadrin</h3>
          <p>
            AI-powered customer engagement platform for automotive dealerships,
            helping sales teams convert inbound leads faster with personalized buyer pages.
          </p>
          <div class="meta">Next.js · CRM Workflow · Engagement Signals</div>
        </article>

        <article class="work-card">
          <span class="tag">Customer Intelligence</span>
          <h3>VOC Intelligence Platform</h3>
          <p>
            Internal AI platform that analyzes Amazon reviews and customer feedback
            to identify product issues, listing gaps, and user guide improvements.
          </p>
          <div class="meta">LLM Analysis · Review Mining · Product Insights</div>
        </article>

        <article class="work-card">
          <span class="tag">Automation</span>
          <h3>Amazon Review → Zendesk</h3>
          <p>
            Automated pipeline that brings daily Amazon reviews into Zendesk,
            making customer feedback visible and actionable for product and support teams.
          </p>
          <div class="meta">Data Pipeline · Zendesk · Classification</div>
        </article>

        <article class="work-card">
          <span class="tag">Voice AI</span>
          <h3>VoiceReach</h3>
          <p>
            Voice-first field documentation app for NGOs, using transcription and structured extraction
            to turn field notes into searchable reports.
          </p>
          <div class="meta">React Native · Whisper · GPT-4o</div>
        </article>

        <article class="work-card">
          <span class="tag">Graph RAG</span>
          <h3>Enterprise Document RAG</h3>
          <p>
            Knowledge graph RAG system processing hundreds of PDFs with hierarchical ingestion,
            entity extraction, and multi-hop retrieval.
          </p>
          <div class="meta">Graph RAG · Retrieval · Evaluation</div>
        </article>

        <article class="work-card">
          <span class="tag">Hackathon</span>
          <h3>Prereq</h3>
          <p>
            Live AI lecture copilot with personalized knowledge graphs, built for real-time
            transcription, concept extraction, and mastery tracking.
          </p>
          <div class="meta">TreeHacks · 2nd Place · WebSockets</div>
        </article>
      </div>
    </div>
  </section>

  <!-- Case Study Highlight -->
  <section class="case" id="case-studies">
    <div class="container case-grid">
      <div class="case-panel">
        <div class="eyebrow">Featured Case Study</div>
        <h3>Turning customer feedback into product decisions.</h3>
        <p>
          Product teams often spend hours reading reviews, tickets, and VOC data manually.
          I built an AI system that helps identify recurring issues, summarize customer pain points,
          and suggest improvements to listings, documentation, and product design.
        </p>
        <a class="btn btn-primary" href="/case-studies/voc-intelligence.html">Read Case Study →</a>
      </div>

      <div class="flow">
        <div>Amazon Reviews</div>
        <div>Zendesk Tickets</div>
        <div>VOC Data</div>
        <div>AI Clustering & Analysis</div>
        <div>Product / Listing / IUG Recommendations</div>
      </div>
    </div>
  </section>

  <!-- About -->
  <section id="about">
    <div class="container about-grid">
      <div class="about-photo">
        Portrait photo placeholder
      </div>

      <div class="about-text">
        <div class="eyebrow">About</div>
        <h2>Builder first. Student second.</h2>
        <p>
          I’m studying Electrical Engineering and Computer Sciences at UC Berkeley,
          with a focus on AI systems, full-stack product development, and workflow automation.
        </p>
        <p>
          My work sits at the intersection of product, engineering, and business operations:
          building systems that are not only technically interesting, but useful enough for real teams to adopt.
        </p>

        <div class="pill-row">
          <span class="pill">AI Automation</span>
          <span class="pill">LLM Systems</span>
          <span class="pill">Product Engineering</span>
          <span class="pill">Customer Intelligence</span>
          <span class="pill">Voice AI</span>
          <span class="pill">Knowledge Graphs</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="contact" id="contact">
    <div class="container">
      <div class="eyebrow">Contact</div>
      <h2>Let’s build something useful.</h2>
      <p>
        Open to AI engineering internships, research-driven product teams,
        and selected AI automation projects.
      </p>

      <div class="hero-actions" style="justify-content:center;">
        <a class="btn btn-primary" href="mailto:jason@example.com">Email Jason</a>
        <a class="btn btn-secondary" href="https://www.linkedin.com/" target="_blank">LinkedIn</a>
        <a class="btn btn-secondary" href="https://github.com/" target="_blank">GitHub</a>
      </div>
    </div>
  </section>

</main>

<footer>
  <div class="container">
    © 2026 Jason Yi. Built with care.
  </div>
</footer>

</body>
</html>
`;

export function GET(): Response {
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
