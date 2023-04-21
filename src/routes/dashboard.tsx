import {lazy, Suspense} from 'react';
import type {RouteObject} from 'react-router';
import {Outlet} from 'react-router-dom';
import {Layout as DashboardLayout} from '../layouts/dashboard';
import {Home} from "../pages/home/home";
import {EventsCalendar} from "../pages/calendar/calendar";
import {EventDetails} from "../pages/events/event-details";
import {Groups} from "../pages/groups/list";
import {GroupProfile} from "../pages/groups/profile";
import {Conversations} from "../pages/conversations/conversations";
import {Account} from "../pages/account";
import {Announcements} from "../pages/announcements/list";
import {AnnouncementDetails} from "../components/announcements/announcement-details";

export const dashboardRoutes: RouteObject[] = [
    {
        path: '/',
        element: (
            <DashboardLayout>
                <Suspense>
                    <Outlet/>
                </Suspense>
            </DashboardLayout>
        ),
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'announcements',
                children: [
                    {
                        index: true,
                        element: <Announcements />
                    },
                    {
                        path: ':announcementId',
                        element: <AnnouncementDetails />
                    }
                ]
            },
            {
               path: 'events/:eventId',
                children: [
                    {
                        index: true,
                        element: <EventDetails />
                    }
                ]
            },
            {
                path: 'calendar',
                children: [
                    {
                        index: true,
                        element: <EventsCalendar/>
                    }
                ]
            },
            {
                path: 'groups',
                children: [
                    {
                        index: true,
                        element: <Groups/>
                    },
                    {
                        path: ':groupId/:tab',
                        element: <GroupProfile />
                    },
                    {
                        path: ':groupId',
                        element: <GroupProfile />
                    },
                ]
            },
            {
                path: 'conversations',
                element: <Conversations />
            },
            {
                path: 'forms',
                children: [
                    {
                        index: true,
                        element: <div>Forms</div>
                    }
                ]
            },
            {
                path: 'payments',
                children: [
                    {
                        index: true,
                        element: <div>Payments</div>
                    }
                ]
            },
            {
                path: 'files',
                children: [
                    {
                        index: true,
                        element: <div>Files</div>
                    }
                ]
            },
            {
                path: 'settings',
                element: <Account />
            },
        ]
    }
];
