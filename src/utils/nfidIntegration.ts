
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";

export class NFIDAuth {
  private authClient: AuthClient | null = null;

  async init() {
    this.authClient = await AuthClient.create();
    await this.authClient.login({
      identityProvider: "https://nfid.one" // NFID provider URL
    });
  }

  async getIdentity(): Promise<Identity | undefined> {
    if (!this.authClient) {
      throw new Error("AuthClient not initialized");
    }
    return this.authClient.getIdentity();
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      return false;
    }
    return await this.authClient.isAuthenticated();
  }

  async signOut() {
    if (!this.authClient) {
      return;
    }
    await this.authClient.logout();
  }
}
