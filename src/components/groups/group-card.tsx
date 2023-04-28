import 'react'
import {FC, useEffect} from "react";
import {Group} from "../../types/group";
import {Avatar, Box, Card, Paper, Stack, styled, SvgIcon, Tooltip, Typography} from "@mui/material";
import {LockUnlocked01} from "@untitled-ui/icons-react";
import {Link, useNavigate} from "react-router-dom";
import EventIcon from '@mui/icons-material/EventOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import FolderIcon from '@mui/icons-material/FolderOutlined';

interface GroupCardProps {
    group: Group;
}

export const HoverGrowthCard = styled(Card)`
  transition: transform 0.3s;
  padding-bottom: 10px;
  &:hover {
    transform: scale(1.025); /* Adjust the scale value for desired growth effect */
  }
`;

const cacheImages = async (srcArray: string[]) => {
    const promises = srcArray.map((src) => {
        return new Promise<void>(function (resolve, reject) {
            const img = new Image();
            img.src = src;
            // @ts-ignore
            img.onload = resolve();
            // @ts-ignore
            img.onerror = reject();
        })
    });
    await Promise.all(promises);
};

export const GroupCard: FC<GroupCardProps> = (props) => {
    const {group} = props;
    const navigate = useNavigate();

    useEffect(() => {
        cacheImages([group.backgroundImageURL!, group.profileImageURL!]);
    }, [group]);

    return (
        <Link to={'/groups/' + group.id} style={{textDecoration: 'none'}}>
            <HoverGrowthCard>
                <img
                    width={'100%'}
                    height={'120px'}
                    style={
                        {
                            objectFit: 'cover',
                        }
                    }
                    src={group.backgroundImageURL!}
                />
                <Box
                    sx={{
                        pt: 2,
                        px: 2,
                        pb: 1
                    }}
                >
                    <Avatar
                        sx={{
                            width: '75px',
                            height: '75px',
                            mt: '-70px',
                            border: '1px solid #E5E5E5',
                            mb: 2,
                        }}
                        src={group.profileImageURL!}
                    />
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-end"
                        width="100%"
                        sx={{
                            mt: -4,
                        }}
                    >
                        <Paper
                            variant={'outlined'}
                            sx={{
                                borderColor: "#e5e5e5",
                                alignContent: 'end',
                                justifyContent: 'end',
                                display: 'inline-block',
                                alignItems: 'end',
                                px: 1,
                                py: 0.25,
                            }}
                        >
                            <Typography variant={'body2'}>
                                {group.type}
                            </Typography>
                        </Paper>
                    </Box>
                    <Typography
                        variant={'h5'}
                        sx={{mb: 0.5}}
                    >
                        {group.name}
                    </Typography>
                    <Stack direction={"row"} alignItems={'center'}>
                        {/* @ts-ignore */}
                        <SvgIcon fontSize={"xs"} sx={{color:"text.secondary", mr: 0.5}}>
                            <LockUnlocked01/>
                        </SvgIcon>
                        <Typography
                            variant={'subtitle2'}
                            color={'text.secondary'}
                        >
                            {group.isPrivate ? 'Private' : 'Public'}
                        </Typography>
                        <Typography sx={{mx: 0.5}} color={'text.secondary'}>•</Typography>
                        <Typography
                            variant={'subtitle2'}
                            color={'text.secondary'}
                        >
                            {group.memberCount} {group.memberCount == 1 ? 'member' : 'members'}
                        </Typography>
                    </Stack>

                    <Stack direction={'row'} spacing={1} sx={{mt: 2}}>
                        <Tooltip title={'Events'}>
                            <Paper
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate('/groups/' + group.id + '/events')
                                }}
                                variant={'outlined'}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 1,
                                    py: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    },
                                }}
                            >
                                <EventIcon sx={{color: 'text.secondary'}}/>
                            </Paper>
                        </Tooltip>
                        <Tooltip title={'Members'}>
                            <Paper
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate('/groups/' + group.id + '/members')
                                }}
                                variant={'outlined'}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 1,
                                    py: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    },
                                }}
                            >
                                <GroupIcon sx={{color: 'text.secondary'}}/>
                            </Paper>
                        </Tooltip>
                        <Tooltip title= {'Files'}>
                            <Paper
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate('/groups/' + group.id + '/files')
                                }}
                                variant={'outlined'}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    px: 1,
                                    py: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    },
                                }}
                            >
                                <FolderIcon sx={{color: 'text.secondary'}}/>
                            </Paper>
                        </Tooltip>
                    </Stack>

                    {/*<Typography*/}
                    {/*    variant={'subtitle2'}*/}
                    {/*    color={'text.secondary'}*/}
                    {/*    sx={{*/}
                    {/*        display: '-webkit-box',*/}
                    {/*        overflow: 'hidden',*/}
                    {/*        WebkitBoxOrient: 'vertical',*/}
                    {/*        WebkitLineClamp: 2,*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    {group.description}*/}
                    {/*</Typography>*/}
                </Box>

            </HoverGrowthCard>
        </Link>
    )
}
