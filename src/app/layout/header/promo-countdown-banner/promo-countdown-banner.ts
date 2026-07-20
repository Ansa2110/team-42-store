import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';

const DEFAULT_DURATION_MS = 6 * 60 * 60 * 1000;
const DEFAULT_STORAGE_KEY = 'shopfront_promo_sale_end';

@Component({
  selector: 'app-promo-countdown-banner',
  imports: [],
  templateUrl: './promo-countdown-banner.html',
  styleUrl: './promo-countdown-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoCountdownBanner implements OnInit, OnDestroy {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) buttonText!: string;
  @Input() durationMs = DEFAULT_DURATION_MS;
  @Input() storageKey = DEFAULT_STORAGE_KEY;

  @Output() readonly bannerClicked = new EventEmitter<void>();
  @Output() readonly expired = new EventEmitter<void>();

  readonly timeLeft = signal('00:00:00');

  private intervalId?: ReturnType<typeof setInterval>;
  private endTimestamp = 0;

  ngOnInit(): void {
    this.endTimestamp = this.resolveEndTimestamp();
    this.updateTimeLeft();

    this.intervalId = setInterval(() => {
      this.updateTimeLeft();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  onBannerClick(): void {
    this.bannerClicked.emit();
  }

  private resolveEndTimestamp(): number {
    const storedValue = localStorage.getItem(this.storageKey);
    const storedTimestamp = Number(storedValue);

    if (Number.isFinite(storedTimestamp) && storedTimestamp > Date.now()) {
      return storedTimestamp;
    }

    return this.startNewCycle();
  }

  private startNewCycle(): number {
    const duration = this.durationMs > 0 ? this.durationMs : DEFAULT_DURATION_MS;
    const nextEndTimestamp = Date.now() + duration;

    localStorage.setItem(this.storageKey, String(nextEndTimestamp));

    return nextEndTimestamp;
  }

  private updateTimeLeft(): void {
    let diff = this.endTimestamp - Date.now();

    if (diff <= 0) {
      this.expired.emit();
      this.endTimestamp = this.startNewCycle();
      diff = this.endTimestamp - Date.now();
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    this.timeLeft.set(
      `${this.format(hours)}:${this.format(minutes)}:${this.format(seconds)}`,
    );
  }

  private clearTimer(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private format(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
