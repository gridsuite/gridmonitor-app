/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function getFormattedDate(locale: string, value?: string): { fullDate: string; formattedDate: string } {
    let formattedDate = '-';
    let fullDate = '';
    if (value === undefined || value === null) {
        return { fullDate, formattedDate };
    }
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const dateValue = new Date(value);
    if (!Number.isNaN(dateValue.getDate())) {
        const cellMidnight = new Date(value).setHours(0, 0, 0, 0);

        const time = new Intl.DateTimeFormat(locale, {
            timeStyle: 'medium',
            hour12: false,
        }).format(dateValue);
        const displayedDate =
            locale === 'en' ? dateValue.toLocaleDateString('en-CA') : dateValue.toLocaleDateString(locale);
        formattedDate = todayStart === cellMidnight ? time : `${displayedDate} - ${time}`;
        fullDate = new Intl.DateTimeFormat(locale, {
            dateStyle: 'long',
            timeStyle: 'long',
            hour12: false,
        }).format(dateValue);
    }

    return { fullDate, formattedDate };
}

export function formatDuration(milliseconds: number) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

export function formatCompletedAt(date: Date | undefined) {
    if (!date) return '';

    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date));
}
