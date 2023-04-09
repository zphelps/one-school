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
                path: 'alerts',
                children: [
                    {
                        index: true,
                        element: <div>Alerts</div>
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
            // {
            //     path: 'conversations',
            //     children: [
            //         {
            //             index: true,
            //             element: <div>Conversations</div>
            //         }
            //     ]
            // },
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
            }
        ]
    }
];
