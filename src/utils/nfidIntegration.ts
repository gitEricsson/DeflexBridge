
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
    // async getIdentity(): Promise<{ principal: string; email?: string }> {

    if (!this.authClient) {
      throw new Error("AuthClient not initialized");
    }

    const identity = this.authClient.getIdentity();

    // const email = await this.getUserEmail(identity);
    // return { principal: identity.getPrincipal().toString(), email };
    return this.authClient.getIdentity();
  }

  async getUserEmail(identity: Identity): Promise<string | undefined> {
    // Placeholder; Will Integrate MongoDB to store user data later
    return "user@example.com";
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
