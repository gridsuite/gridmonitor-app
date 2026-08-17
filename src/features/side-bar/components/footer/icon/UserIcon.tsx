import { mergeSx } from '@gridsuite/commons-ui';
import { Avatar, Tooltip } from '@mui/material';

function getAbbreviationFromUserName(name: string) {
    // notice : == null means null or undefined
    if (name == null || name.trim() === '') {
        return '';
    }
    const splittedName = name.split(' ');
    if (splittedName.length > 1) {
        return `${splittedName[0][0]}${splittedName[splittedName.length - 1][0]}`;
    }
    return `${splittedName[0][0]}`;
}

export function UserAvatarIcon({ label }: Readonly<{ label: string }>) {
    return (
        <Tooltip title={label}>
            <Avatar
                sx={(theme) => ({
                    height: '24px',
                    width: '24px',
                    fontSize: theme.typography.pxToRem(11),
                    textTransform: 'capitalize',
                })}
            >
                {getAbbreviationFromUserName(label)}
            </Avatar>
        </Tooltip>
    );
}
