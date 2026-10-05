import { Component } from '@angular/core';
import { TEAM } from '../site-data';

@Component({
  selector: 'app-about',
  template: `
    <section class="page-title hero-xl" style="--hero: url('images/about/business-charts-review.jpg')">
      <div class="container">
        <p class="eyebrow">About Us</p>
        <h1>Leading the Way in Financial Growth and Innovation with you</h1>
      </div>
    </section>

    <section class="about-section">
      <div class="founder-wrap">
        <div class="founder-grid">
          <div class="founder-left">
            <h2>A note from the founder</h2>
            <figure class="founder-quote">
              <span class="quote-mark" aria-hidden="true">&ldquo;</span>
              <blockquote>
                As a Chartered Accountant, I founded Dugar Capital to be more than advisors &mdash; we are your
                partners in unlocking growth, guiding businesses from vision to victory in the financial markets
              </blockquote>
              <figcaption><strong>Virendra</strong><span>Founder &amp; MD</span></figcaption>
            </figure>
          </div>

          <div class="founder-story">
            <h3>Founded five years ago by a seasoned Chartered Accountant</h3>
            <p>
              Founded five years ago by a seasoned Chartered Accountant, Dugar Capital has quickly emerged as a
              trusted name in financial advisory services in India. Leveraging over a decade of experience, the
              founder launched the company to address the growing demand for expert guidance in SME IPOs, helping
              numerous small and medium enterprises access capital markets and achieve successful public listings.
            </p>
            <p>
              From its inception, Dugar Capital expanded its offerings to include comprehensive services such as
              equity placements, corporate structuring, valuation, and business advisory.
            </p>
            <p>
              Driven by a client-centric approach and a commitment to excellence, the firm has built a reputation
              for delivering tailored financial solutions that empower businesses to thrive in a competitive
              landscape. Today, Dugar Capital continues to guide companies across various sectors, fostering
              sustainable growth and long-term success.
            </p>
          </div>
        </div>
      </div>

      <div class="container-wide team-grid">
        @for (m of team; track m.name) {
          <article class="team-card">
            <img [src]="m.image" [alt]="m.name" />
            <div class="team-info">
              <h3>{{ m.name }}</h3>
              <p>{{ m.bio }}</p>
              <a class="linkedin-btn" [href]="m.linkedin" target="_blank" rel="noopener noreferrer" [attr.aria-label]="m.name + ' on LinkedIn'">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class About {
  protected readonly team = TEAM;
}
