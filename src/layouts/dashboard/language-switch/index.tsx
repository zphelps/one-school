import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Tooltip } from '@mui/material';
import { LanguagePopover } from './language-popover';
import {usePopover} from "../../../hooks/use-popover";

type Language = 'en' | 'de' | 'es';

const languages: Record<Language, string> = {
  en: '/assets/flags/flag-uk.svg',
  de: '/assets/flags/flag-de.svg',
  es: '/assets/flags/flag-es.svg'
};

export const LanguageSwitch: FC = () => {
  const { i18n } = useTranslation();
  const popover = usePopover<HTMLButtonElement>();

  const flag = languages[i18n.language as Language];

  return (
    <>
      <Tooltip title="Language">
        <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
        >
          <Box
            sx={{
              width: 28,
              '& img': {
                width: '100%'
              }
            }}
          >
            <img src={flag} />
          </Box>
        </IconButton>
      </Tooltip>
      <LanguagePopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
