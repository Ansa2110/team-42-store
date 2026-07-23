export interface GoogleCredentialResponse {
  credential?: string;
}

export interface GooglePromptMomentNotification {
  isDismissedMoment(): boolean;
  isSkippedMoment(): boolean;
}

export interface GoogleIdentity {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        callback(
          response: GoogleCredentialResponse,
        ): void;
      }): void;

      prompt(
        listener?: (
          notification: GooglePromptMomentNotification,
        ) => void,
      ): void;
    };
  };
}

export interface PendingCredentialRequest {
  resolve(credential: string): void;
  reject(error: Error): void;
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

export {};
