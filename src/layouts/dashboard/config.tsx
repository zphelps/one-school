import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, SvgIcon } from '@mui/material';
import BarChartSquare02Icon from '../../icons/untitled-ui/duocolor/bar-chart-square-02';
import CurrencyBitcoinCircleIcon from '../../icons/untitled-ui/duocolor/currency-bitcoin-circle';
import HomeSmileIcon from '../../icons/untitled-ui/duocolor/home-smile';
import {
  Announcement01,
  Calendar,
  CurrencyDollar,
  File01,
  File02, Folder,
  Users01,
  Users02,
  Users03
} from "@untitled-ui/icons-react";
import { paths } from '../../paths';
import MessageChatSquareIcon from "@untitled-ui/icons-react/build/esm/MessageChatSquare";

export interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
}

export interface Section {
  items: Item[];
  subheader?: string;
}

export const useSections = () => {
  const { t } = useTranslation();

  return useMemo(
    () => {
      return [
        {
          items: [
            {
              title: 'Home',
              path: paths.index,
              icon: (
                <SvgIcon fontSize="small">
                  <HomeSmileIcon />
                </SvgIcon>
              )
            },
            {
              title: 'Alerts',
              path: paths.alerts.index,
              icon: (
                <SvgIcon fontSize="small">
                  <Announcement01 />
                </SvgIcon>
              )
            },
            {
              title: 'Calendar',
              path: paths.calendar,
              icon: (
                <SvgIcon fontSize="small">
                  <Calendar />
                </SvgIcon>
              )
            },
            {
              title: 'Groups',
              path: paths.groups.index,
              icon: (
                <SvgIcon fontSize="small">
                  <Users03 />
                </SvgIcon>
              ),
            },
            {
              title: 'Conversations',
              path: paths.conversations.index,
              icon: (
                <SvgIcon fontSize="small">
                  <MessageChatSquareIcon />
                </SvgIcon>
              )
            },
            {
              title: 'Forms',
              path: paths.forms,
              icon: (
                  <SvgIcon fontSize="small">
                    < File02 />
                  </SvgIcon>
              )
            },
            {
              title: 'Payments',
              path: paths.payments,
              icon: (
                  <SvgIcon fontSize="small">
                    <CurrencyDollar />
                  </SvgIcon>
              )
            },
            {
              title: 'Files',
              path: paths.files,
              icon: (
                  <SvgIcon fontSize="small">
                    <Folder />
                  </SvgIcon>
              )
            }
          ]
        },
      ];
    },
    [t]
  );
};
