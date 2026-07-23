import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import type {
  GoogleCredentialResponse,
  GooglePromptMomentNotification,
  PendingCredentialRequest,
} from './google-identity.types';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private readonly scriptUrl =
    'https://accounts.google.com/gsi/client';

  private initialized = false;
  private scriptLoadPromise: Promise<void> | null = null;
  private pendingRequest: PendingCredentialRequest | null = null;

  async requestCredential(): Promise<string> {
    if (!environment.googleClientId) {
      throw new Error(
        'Google Client ID is not configured',
      );
    }

    if (this.pendingRequest) {
      throw new Error(
        'Google authorization is already in progress',
      );
    }

    await this.loadScript();

    const googleIdentity =
      window.google?.accounts.id;

    if (!googleIdentity) {
      throw new Error(
        'Google Identity Services is unavailable',
      );
    }

    if (!this.initialized) {
      googleIdentity.initialize({
        client_id: environment.googleClientId,
        callback: (
          response: GoogleCredentialResponse,
        ) => {
          const credential = response.credential;

          if (!credential) {
            this.rejectPendingRequest(
              new Error(
                'Google did not return a credential',
              ),
            );

            return;
          }

          this.pendingRequest?.resolve(credential);
          this.pendingRequest = null;
        },
      });

      this.initialized = true;
    }

    return new Promise<string>(
      (resolve, reject) => {
        this.pendingRequest = {
          resolve,
          reject,
        };

        googleIdentity.prompt(
          (
            notification: GooglePromptMomentNotification,
          ) => {
            if (
              notification.isDismissedMoment() ||
              notification.isSkippedMoment()
            ) {
              this.rejectPendingRequest(
                new Error(
                  'Google authorization was cancelled or unavailable',
                ),
              );
            }
          },
        );
      },
    );
  }

  private loadScript(): Promise<void> {
    if (window.google?.accounts.id) {
      return Promise.resolve();
    }

    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    this.scriptLoadPromise =
      this.createScriptLoadPromise();

    return this.scriptLoadPromise;
  }

  private createScriptLoadPromise(): Promise<void> {
    return new Promise<void>(
      (resolve, reject) => {
        const existingScript =
          document.querySelector<HTMLScriptElement>(
            `script[src="${this.scriptUrl}"]`,
          );

        if (existingScript) {
          if (window.google?.accounts.id) {
            resolve();
            return;
          }

          existingScript.addEventListener(
            'load',
            () => resolve(),
            {
              once: true,
            },
          );

          existingScript.addEventListener(
            'error',
            () => {
              this.scriptLoadPromise = null;

              reject(
                new Error(
                  'Failed to load Google Identity Services',
                ),
              );
            },
            {
              once: true,
            },
          );

          return;
        }

        const script =
          document.createElement('script');

        script.src = this.scriptUrl;
        script.async = true;
        script.defer = true;

        script.addEventListener(
          'load',
          () => resolve(),
          {
            once: true,
          },
        );

        script.addEventListener(
          'error',
          () => {
            this.scriptLoadPromise = null;

            reject(
              new Error(
                'Failed to load Google Identity Services',
              ),
            );
          },
          {
            once: true,
          },
        );

        document.head.appendChild(script);
      },
    );
  }

  private rejectPendingRequest(
    error: Error,
  ): void {
    this.pendingRequest?.reject(error);
    this.pendingRequest = null;
  }
}
