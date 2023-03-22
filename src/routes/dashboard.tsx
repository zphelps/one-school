import {lazy, Suspense} from 'react';
import type {RouteObject} from 'react-router';
import {Outlet} from 'react-router-dom';
import {Layout as DashboardLayout} from '../layouts/dashboard';
import {Home} from "../pages/home";

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
                path: 'calendar',
                children: [
                    {
                        index: true,
                        element: <div>Calendar</div>
                    }
                ]
            },
            {
                path: 'groups',
                children: [
                    {
                        index: true,
                        element: <div>Groups</div>
                    }
                ]
            },
            {
                path: 'conversations',
                children: [
                    {
                        index: true,
                        element: <div>Conversations</div>
                    }
                ]
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
            }
        ]
    }
];
