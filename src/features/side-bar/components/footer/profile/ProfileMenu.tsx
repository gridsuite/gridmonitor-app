import {
    CustomNestedMenuItem,
    PARAM_DEVELOPER_MODE,
    UserInformationDialog,
    UserSettingsDialog,
} from '@gridsuite/commons-ui';
import { Badge, ManageAccounts } from '@mui/icons-material';
import { useState } from 'react';
import { MinimizedSubMenuHeader } from '../common/MinimizedSubMenuHeader';
import { ProfileInfos } from './ProfileInfos';
import { UserProfile } from '../../../../authentication/store/authentication.type';
import { UserAvatarIcon } from './UserIcon';
import { SidebarMenuItem } from '../common/SideBarMenuItem';
import { useAppParameterState } from '../../../../app-parameters/hooks/use-app-parameter-state';
import { useStableUserProfile } from '../../../../authentication/hooks/use-stable-user-profile';
import { submenuFooterStyle } from '../common/submenuFooterStyle';

interface ProfileMenuProps {
    isMinimized: boolean;
    userProfile?: UserProfile;
}

export function ProfileMenu({ isMinimized }: Readonly<ProfileMenuProps>) {
    const userProfile = useStableUserProfile() ?? undefined;

    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isProfileSettingsDialogOpen, setIsProfileSettingsDialogOpen] = useState(false);
    const [isDeveloperMode, handleChangeDeveloperMode] = useAppParameterState(PARAM_DEVELOPER_MODE);

    const openProfileDialog = () => setIsProfileDialogOpen(true);
    const openProfileSettingsDialog = () => setIsProfileSettingsDialogOpen(true);

    const profileLabel = 'Profil';

    return (
        <>
            <CustomNestedMenuItem
                label={!isMinimized ? profileLabel : ''}
                leftIcon={<UserAvatarIcon label={userProfile?.name ?? ''} />}
                sx={submenuFooterStyle.subMenu}
            >
                {isMinimized && <MinimizedSubMenuHeader label={profileLabel} />}

                <ProfileInfos userProfile={userProfile} />

                <SidebarMenuItem label="Informations utilisateur" icon={<Badge />} onClick={openProfileDialog} />

                <SidebarMenuItem
                    label="Paramètres utilisateurs"
                    icon={<ManageAccounts />}
                    onClick={openProfileSettingsDialog}
                />
            </CustomNestedMenuItem>
            <UserInformationDialog
                openDialog={isProfileDialogOpen}
                onClose={() => setIsProfileDialogOpen(false)}
                userProfile={userProfile ?? undefined}
            />
            <UserSettingsDialog
                openDialog={isProfileSettingsDialogOpen}
                onClose={() => setIsProfileSettingsDialogOpen(false)}
                developerMode={isDeveloperMode}
                onDeveloperModeClick={handleChangeDeveloperMode}
            />
        </>
    );
}
