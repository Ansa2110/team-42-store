export interface Advantage {
  readonly iconName: string;
  readonly titleKey: string;
  readonly subtitleKey: string;
}

export const advantages: readonly Advantage[] = [
  {
    iconName: 'local_shipping',
    titleKey: 'main.advantages.freeDelivery.title',
    subtitleKey: 'main.advantages.freeDelivery.subtitle',
  },
  {
    iconName: 'gpp_good',
    titleKey: 'main.advantages.qualityGuarantee.title',
    subtitleKey: 'main.advantages.qualityGuarantee.subtitle',
  },
  {
    iconName: 'loop',
    titleKey: 'main.advantages.return.title',
    subtitleKey: 'main.advantages.return.subtitle',
  },
  {
    iconName: 'headset_mic',
    titleKey: 'main.advantages.support.title',
    subtitleKey: 'main.advantages.support.subtitle',
  },
  {
    iconName: 'credit_score',
    titleKey: 'main.advantages.securePayment.title',
    subtitleKey: 'main.advantages.securePayment.subtitle',
  },
];
