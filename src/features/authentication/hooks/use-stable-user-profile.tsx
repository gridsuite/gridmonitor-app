/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { RootState, useAppSelector } from '../../../app/store/store';
import { selectAuthentication } from '../store/authentication.selectors';
import { UserProfile } from '../store/authentication.type';

const selectUserProfile = (state: RootState) => selectAuthentication(state).user?.profile ?? null;

/*
 * Ignore user profile changes caused by token refreshes.
 * A rerender is triggered only when one of the user identity fields changes:
 * sub, name, email or profile.
 */
const isSameUserProfileForRender = (a: UserProfile | null, b: UserProfile | null) =>
    a === b || (a?.sub === b?.sub && a?.name === b?.name && a?.email === b?.email && a?.profile === b?.profile);

export const useStableUserProfile = () => useAppSelector(selectUserProfile, isSameUserProfileForRender);
