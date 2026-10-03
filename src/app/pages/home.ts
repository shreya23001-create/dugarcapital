import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOGS, HOME_TESTIMONIALS, SERVICES, WHY_CHOOSE } from '../site-data';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="hero" style="background-image: url('images/hero/hero-fallback-consultation.jpg')">
      <div class="hero-video" aria-hidden="true"><div #player></div></div>
      <div class="hero-inner">
        <p class="eyebrow">Your Partner in Strategic Financial Growth</p>
        <h1>Expert IPO Advisory, Equity Placements, and Business Solutions for a Thriving Future</h1>
        <a routerLink="/contact" class="btn btn-orange">Book an Appointment</a>
      </div>
    </section>

    <section class="home-about">
      <div class="about-card">
        <div class="about-card-text">
          <span class="eyebrow-teal">About Us</span>
          <h2>Your Trusted Partner in Financial Excellence</h2>
          <p>
            Dugar Capital is a leading financial advisory firm specializing in IPO advisory, SME IPO advisory,
            equity placements, corporate structuring, and valuation services. Our team of experts is dedicated to
            delivering customized, strategic solutions that empower businesses to achieve sustainable growth. With
            a focus on transparency, innovation, and client-centricity, we guide you through complex financial
            landscapes, ensuring your business reaches its full potential. At Dugar Capital, we build partnerships
            rooted in trust and drive success through expert guidance and insightful decision-making. Let us help
            you turn your financial goals into reality.
          </p>
        </div>
        <div class="zoom-img">
          <img src="images/about/home-about-whiteboard.jpg" alt="Advisor presenting growth charts on a whiteboard" loading="lazy" />
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container">
        <h2 class="center">Comprehensive Financial Solutions for Your Business Needs</h2>
        <div class="grid grid-3">
          @for (s of services; track s.num) {
            <article class="card">
              <span class="num">{{ s.num }}</span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.summary }}</p>
            </article>
          }
        </div>
        <p class="center"><a routerLink="/services" class="btn">View All Services</a></p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="center">Why Choose Dugar Capital</h2>
        <div class="grid grid-3">
          @for (w of why; track w.title) {
            <article class="card plain">
              <h3>{{ w.title }}</h3>
              <p>{{ w.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container">
        <h2 class="center">Our Testimonials</h2>
        <div class="grid grid-3">
          @for (t of testimonials; track t.name) {
            <figure class="card quote">
              <blockquote>&ldquo;{{ t.quote }}&rdquo;</blockquote>
              <figcaption><strong>{{ t.name }}</strong><br />{{ t.role }}</figcaption>
            </figure>
          }
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="center">Read our Latest Blogs</h2>
        <div class="grid grid-3">
          @for (b of blogs; track b.slug) {
            <article class="card blog">
              <img [src]="b.image" [alt]="b.title" />
              <div class="card-body">
                <time>{{ b.date }}</time>
                <h3><a [routerLink]="'/' + b.slug">{{ b.title }}</a></h3>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class Home {
  private static readonly VIDEO_ID = 'WO3tnsfMNf0';
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('player');
  private player?: { destroy(): void };
  private destroyed = false;

  constructor() {
    afterNextRender(() => this.initVideo());
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.player?.destroy();
    });
  }

  // YouTube IFrame API: loops the video without playlist mode, which would show prev/next/pause buttons
  private async initVideo() {
    const w = window as any;
    if (!w.YT?.Player) {
      await new Promise<void>(resolve => {
        w.onYouTubeIframeAPIReady = () => resolve();
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      });
    }
    if (this.destroyed) return;
    this.player = new w.YT.Player(this.host().nativeElement, {
      videoId: Home.VIDEO_ID,
      playerVars: { autoplay: 1, mute: 1, controls: 0, rel: 0, playsinline: 1, modestbranding: 1, disablekb: 1, iv_load_policy: 3, fs: 0 },
      events: {
        onReady: (e: any) => { e.target.mute(); e.target.playVideo(); },
        onStateChange: (e: any) => { if (e.data === 0) e.target.playVideo(); },
      },
    });
  }
  protected readonly services = SERVICES;
  protected readonly why = WHY_CHOOSE;
  protected readonly testimonials = HOME_TESTIMONIALS;
  protected readonly blogs = BLOGS;
}
