import { CustomNestedMenuItem, GsLang, MuiStyles } from '@gridsuite/commons-ui';
import { DisplaySettings } from '@mui/icons-material';
import { MinimizedSubMenuHeader } from '../utils/MinimizedSubMenuHeader';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSelection } from './LanguageSelection';
import { submenuFooterStyle } from '../utils/submenuFooterStyle';

export function SettingsMenu({ isMinimized }: { isMinimized: boolean }) {
    const settingsLabel = 'Réglages';
    const availableLanguages: GsLang[] = ['sys', 'fr', 'en'];

    return (
        <CustomNestedMenuItem
            label={!isMinimized ? settingsLabel : ''}
            leftIcon={<DisplaySettings />}
            sx={submenuFooterStyle.subMenu}
        >
            {isMinimized && <MinimizedSubMenuHeader label={settingsLabel} />}
            <DarkModeToggle />
            <CustomNestedMenuItem label="Langue" sx={submenuFooterStyle.nestedSubMenu}>
                {availableLanguages.map((language) => (
                    <LanguageSelection language={language} key={language} />
                ))}
            </CustomNestedMenuItem>
        </CustomNestedMenuItem>
    );
}
