import { store } from 'app/store/store';
import { selectAuthentication } from 'features/authentication/store/authentication.selectors';

export function getToken(): string | null {
    const state = store.getState();
    return selectAuthentication(state).user?.id_token ?? null;
}

export function buildWebSocketBaseUrl(): string {
    return document.baseURI.replace(/^http:\/\//, 'ws://').replace(/^https:\/\//, 'wss://');
}
