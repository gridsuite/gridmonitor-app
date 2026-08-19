import {
    AppSideBar as CommonAppSideBar,
    PARAM_DEVELOPER_MODE,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '@gridsuite/commons-ui';
import { InvertedThemeProvider } from './InvertedThemeProvider';
import { useAppParameterState } from '../../app-parameters/hooks/use-app-parameter-state';
import { APP_NAME } from '../../../app/config/app-config';
import { useStableUserProfile } from '../../authentication/hooks/use-stable-user-profile';
import { fetchVersion } from '../../../shared/config/version';
import { getServersInfos } from '../../top-bar/api/get-servers-infos';
import AppPackage from '../../../../package.json';

type SidebarProps = {
    onLogoutClick?: () => void;
};

export function AppSideBar({ onLogoutClick }: Readonly<SidebarProps>) {
    const [theme, setTheme] = useAppParameterState(PARAM_THEME);
    const [selectedLanguage, setSelectedLanguage] = useAppParameterState(PARAM_LANGUAGE);
    const [isDeveloperMode, handleChangeDeveloperMode] = useAppParameterState(PARAM_DEVELOPER_MODE);
    const userProfile = useStableUserProfile() ?? undefined;
    return (
        <InvertedThemeProvider>
            <CommonAppSideBar
                isDeveloperMode={isDeveloperMode}
                handleChangeDeveloperMode={handleChangeDeveloperMode}
                currentTheme={theme}
                setTheme={setTheme}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                appName={APP_NAME}
                userProfile={userProfile}
                globalVersionPromise={() => fetchVersion().then((res) => res?.deployVersion ?? 'unknown')}
                additionalModulesPromise={getServersInfos}
                onLogoutClick={onLogoutClick}
                appVersion={AppPackage.version}
                appLicense={AppPackage.license}
            />
        </InvertedThemeProvider>
    );
}
