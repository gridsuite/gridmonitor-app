import ReconnectingWebSocket from 'reconnecting-websocket';
import { buildWebSocketBaseUrl, getToken } from './ws.utils';

export type CreateWsOptions = {
    path: string;
    queryParams?: Record<string, string>;
    name?: string;
};

export function createReconnectingWebSocket({ path, queryParams = {}, name }: CreateWsOptions) {
    const ws = new ReconnectingWebSocket(() => {
        const url = new URL(path, buildWebSocketBaseUrl());

        Object.entries(queryParams).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        const token = getToken();
        if (token) {
            url.searchParams.set('access_token', token);
        }

        return url.toString();
    });

    ws.onopen = () => {
        const url = new URL(path, buildWebSocketBaseUrl());
        console.info(`Connected WebSocket ${name ?? path}: ${url.toString()}`);
    };

    return ws;
}
