import { Component, Input, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';

@Component({
  selector: 'app-promo-countdown-banner',
  imports: [],
  templateUrl: './promo-countdown-banner.html',
  styleUrl: './promo-countdown-banner.css',
})
export class PromoCountdownBanner implements OnInit, OnDestroy {

  @Input() title = 'Summer Sale ends in';
  @Input() buttonText = 'Shop Now';
  @Input() endDate: Date = new Date(Date.now() + 6 * 60 * 60 * 1000);

  @Output() bannerClicked = new EventEmitter<void>();
  @Output() expired = new EventEmitter<void>();

  timeLeft = signal('00:00:00');

  private intervalId?: ReturnType<typeof setInterval>;
  private expiredEmitted = false;

  ngOnInit(): void {
    this.updateTimeLeft();

    this.intervalId = setInterval(() => {
      this.updateTimeLeft();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onBannerClick(): void {
    this.bannerClicked.emit();
  }

  private updateTimeLeft(): void {
    const now = Date.now();
    const end = new Date(this.endDate).getTime();
    const diff = end - now;

    if (diff <= 0) {
      this.timeLeft.set('00:00:00');

      if (!this.expiredEmitted) {
        this.expired.emit();
        this.expiredEmitted = true;
      }

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    this.timeLeft.set(
      `${this.format(hours)}:${this.format(minutes)}:${this.format(seconds)}`
    );
  }

  private format(value: number): string {
    return value.toString().padStart(2, '0');
  }

}
