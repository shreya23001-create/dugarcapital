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
      <div class="container-wide about-intro">
        <div>
          <h2>A note from the founder</h2>
          <blockquote class="founder-note">
            &ldquo;As a Chartered Accountant, I founded Dugar Capital to be more than advisors &mdash; we are your
            partners in unlocking growth, guiding businesses from vision to victory in the financial markets&rdquo;
            - Virendra, Founder &amp; MD
          </blockquote>
        </div>
        <div class="about-story">
          <h3>Founded five years ago by a seasoned Chartered Accountant</h3>
          <p>
            Founded five years ago by a seasoned Chartered Accountant, Dugar Capital has quickly emerged as a
            trusted name in financial advisory services in India. Leveraging over a decade of experience, the
            founder launched the company to address the growing demand for expert guidance in SME IPOs, helping
            numerous small and medium enterprises access capital markets and achieve successful public listings.
            From its inception, Dugar Capital expanded its offerings to include comprehensive services such as
            equity placements, corporate structuring, valuation, and business advisory. Driven by a client-centric
            approach and a commitment to excellence, the firm has built a reputation for delivering tailored
            financial solutions that empower businesses to thrive in a competitive landscape. Today, Dugar Capital
            continues to guide companies across various sectors, fostering sustainable growth and long-term success.
          </p>
        </div>
      </div>

      <div class="container-wide team-grid">
        @for (m of team; track m.name) {
          <article class="team-card">
            <img [src]="m.image" [alt]="m.name" />
            <h3>{{ m.name }}</h3>
            <p>{{ m.bio }}</p>
          </article>
        }
      </div>
    </section>
  `,
})
export class About {
  protected readonly team = TEAM;
}
