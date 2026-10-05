import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMPANY } from '../site-data';

// Posts to the Node mail server in /server (SMTP credentials stay there, never in the browser)
const CONTACT_ENDPOINT = '/api/contact';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  template: `
    <section class="page-title tall" style="--hero: url('images/hero/hero-fallback-consultation.jpg')">
      <div class="container"><h1>Lets connect</h1></div>
    </section>

    <section class="contact-section">
      <div class="container contact-grid">
        <ul class="contact-info">
          <li>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2a6 6 0 0 0-2 11.660V22l2 1 2-1v-8.340A6 6 0 0 0 12 2z"/></svg>
            <span>{{ company.address }}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M6.600 10.800a15.100 15.100 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.25 11.400 11.400 0 0 0 3.600.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.250.2 2.450.57 3.570a1 1 0 0 1-.25 1z"/></svg>
            <a href="tel:{{ company.phone }}">{{ company.phoneIntl }}</a>
          </li>
          <li>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/></svg>
            <a href="mailto:{{ company.email }}">{{ company.email }}</a>
          </li>
        </ul>

        <form [formGroup]="form" (ngSubmit)="submit()" class="contact-card" novalidate>
          <h2>Reach out to us</h2>

          <div class="field">
            <input type="text" formControlName="name" placeholder="Your Name" aria-label="Your Name" autocomplete="name"
                   [class.invalid]="invalid('name')" />
            @if (invalid('name')) { <span class="field-error">Please enter your name.</span> }
          </div>

          <div class="field">
            <input type="email" formControlName="email" placeholder="Your Email" aria-label="Your Email" autocomplete="email"
                   [class.invalid]="invalid('email')" />
            @if (invalid('email')) { <span class="field-error">Please enter a valid email address.</span> }
          </div>

          <div class="field">
            <input type="tel" formControlName="mobile" placeholder="Mobile Number" aria-label="Mobile Number" autocomplete="tel"
                   [class.invalid]="invalid('mobile')" />
            @if (invalid('mobile')) { <span class="field-error">Please enter a valid mobile number.</span> }
          </div>

          <div class="field">
            <input type="text" formControlName="company" placeholder="Company Name" aria-label="Company Name" autocomplete="organization" />
          </div>

          <div class="field">
            <textarea rows="4" formControlName="message" placeholder="Your Message" aria-label="Your Message"
                      [class.invalid]="invalid('message')"></textarea>
            @if (invalid('message')) { <span class="field-error">Please enter your message.</span> }
          </div>

          <!-- honeypot: hidden from people, bots fill it in -->
          <input type="text" formControlName="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />

          <button class="btn btn-orange btn-sm" type="submit" [disabled]="sending()">
            @if (sending()) { <span class="spinner"></span> }
            Submit
          </button>
          @if (sent()) { <p class="success" role="status">Thank you! We will get back to you shortly.</p> }
          @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
        </form>
      </div>
    </section>
  `,
})
export class Contact {
  protected readonly company = COMPANY;
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');

  private readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(/^[+()\-\s\d]{7,20}$/)]],
    company: ['', Validators.maxLength(150)],
    message: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(3000)]],
    website: [''],
  });

  protected invalid(control: 'name' | 'email' | 'mobile' | 'message') {
    const c = this.form.controls[control];
    return c.invalid && c.touched;
  }

  protected async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    this.sent.set(false);
    this.error.set('');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form.getRawValue()),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        throw new Error(body.message ?? (body.errors ? 'Please check the form and try again.' : ''));
      }
      this.sent.set(true);
      this.form.reset();
    } catch (err) {
      this.error.set((err as Error).message || 'Sorry, your message could not be sent. Please try again or email us directly.');
    } finally {
      this.sending.set(false);
    }
  }
}
