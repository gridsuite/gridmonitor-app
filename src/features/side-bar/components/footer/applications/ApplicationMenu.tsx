import { CustomNestedMenuItem, MuiStyles } from '@gridsuite/commons-ui';
import { Apps } from '@mui/icons-material';
import GridexploreLogo from 'assets/images/gridexplore_logo.svg?react';
import { OtherAppRedirection } from './OtherAppRedirection';
import { MinimizedSubMenuHeader } from '../utils/MinimizedSubMenuHeader';
import { submenuFooterStyle } from '../utils/submenuFooterStyle';

export function ApplicationMenu({ isMinimized }: { isMinimized: boolean }) {
    const applicationLabel = 'Mes applications';
    return (
        <CustomNestedMenuItem
            label={!isMinimized ? applicationLabel : ''}
            leftIcon={<Apps />}
            sx={submenuFooterStyle.subMenu}
        >
            {isMinimized && <MinimizedSubMenuHeader label={applicationLabel} />}
            <OtherAppRedirection AppLogo={GridexploreLogo} appName="GridExplore" />
        </CustomNestedMenuItem>
    );
}
