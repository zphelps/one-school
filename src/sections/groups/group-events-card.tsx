import type {ChangeEvent, FC, MouseEvent} from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import Download01Icon from "@untitled-ui/icons-react/build/esm/Download01";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import {
    Box,
    Button,
    Card,
    Container,
    Divider,
    Grid,
    Hidden,
    Stack,
    SvgIcon,
    Tab,
    Tabs,
    Typography
} from "@mui/material";
import {Seo} from "../../components/seo";
import {useSelector} from "react-redux";
import useGroupEvents from "../../hooks/events/use-group-events";
import {Event} from "../../types/calendar";
import {EventListTile} from "../../components/events/event-list-tile";

type TabValue = 'upcoming' | 'past';

interface TabOption {
    label: string;
    value: TabValue;
}

const tabs: TabOption[] = [
    {
        label: 'Upcoming',
        value: 'upcoming'
    },
    {
        label: 'Past',
        value: 'past'
    },
];

interface GroupEventsCardProps {
    groupID: string;
}

export const GroupEventsCard: FC<GroupEventsCardProps> = (props) => {
    const {groupID} = props;
    const [currentTab, setCurrentTab] = useState<TabValue>('upcoming');

    // @ts-ignore
    const eventsSelector = useSelector((state) => state.groupEvents.data);
    const events = eventsSelector[groupID];

    useGroupEvents(groupID);

    const handleTabsChange = useCallback(
        (event: ChangeEvent<{}>, value: TabValue): void => {
            setCurrentTab(value);
        },
        []
    );

    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime();

    const upcomingEvents = useMemo(() => {
        if (events) {
            return events.filter((event: Event) => event.end >= today);
        }
        return [];
    }, [events]);

    const pastEvents = useMemo(() => {
        if (events) {
            return events.filter((event: Event) => event.end < today);
        }
        return [];
    }, [events]);


    return (
        <>
            <Seo title={`Events | OneSchool`}/>
            <Card>
                <Box
                    sx={{
                        px: 3,
                        pt: 3,
                        pb: 1
                    }}
                >
                    <Typography
                        variant={'h5'}
                    >
                        Events
                    </Typography>
                </Box>

                <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    sx={{ px: 3 }}
                    textColor="primary"
                    value={currentTab}
                    variant="scrollable"
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.value}
                            label={tab.label}
                            value={tab.value}
                        />
                    ))}
                </Tabs>
                <Divider />
                <Box sx={{mt: 3}}>
                    {currentTab === 'upcoming' && (
                        upcomingEvents.map((event: Event) => (
                            <EventListTile key={event.id} event={event}/>
                        ))
                    )}
                    {currentTab === 'past' && (
                        pastEvents.map((event: Event) => (
                            <EventListTile key={event.id} event={event}/>
                        ))
                    )}
                </Box>
            </Card>
        </>
    );
};
