import { AccountService } from './account.service';
import { RefreshTokenService } from './refresh-token.service';

export const accountService = new AccountService();

export const refreshTokenService = new RefreshTokenService();
