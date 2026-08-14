import { MenuItem, Typography } from '@mui/material';
import { CustomMenuItem, GsLang, PARAM_LANGUAGE } from '@gridsuite/commons-ui';
import { Done } from '@mui/icons-material';
import { useAppParameterState } from '../../../../app-parameters/hooks/use-app-parameter-state';

interface LanguageSelectionProps {
    language: GsLang;
}
export function LanguageSelection({ language }: Readonly<LanguageSelectionProps>) {
    const [selectedLanguage, setSelectedLanguage] = useAppParameterState(PARAM_LANGUAGE);
    const isCurrentLanguageSelected = selectedLanguage === language;

    const onClick = () => {
        setSelectedLanguage(language) // TODO: improve error handling
            .catch((err) => console.error(err));
    };

    return (
        <CustomMenuItem sx={{ px: 2 }} onClick={onClick}>
            <Typography>{language}</Typography>
            {isCurrentLanguageSelected && <Done />}
        </CustomMenuItem>
    );
}
