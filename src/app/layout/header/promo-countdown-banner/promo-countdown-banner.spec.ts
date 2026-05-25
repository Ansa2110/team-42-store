import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCountdownBanner } from './promo-countdown-banner';

describe('PromoCountdownBanner', () => {
  let component: PromoCountdownBanner;
  let fixture: ComponentFixture<PromoCountdownBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoCountdownBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoCountdownBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
