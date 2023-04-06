import 'react'
import {FC} from "react";
import {Group} from "../../types/group";
import {Avatar, Box, Card, Paper, Stack, styled, SvgIcon, Typography} from "@mui/material";
import {LockUnlocked01} from "@untitled-ui/icons-react";
import {Link, useNavigate} from "react-router-dom";

interface GroupCardProps {
    group: Group;
}

const HoverGrowthCard = styled(Card)`
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.025); /* Adjust the scale value for desired growth effect */
  }
`;

export const GroupCard: FC<GroupCardProps> = (props) => {
    const {group} = props;

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
                        p: 2,
                    }}
                >
                    <Avatar
                        sx={{
                            width: '75px',
                            height: '75px',
                            mt: '-70px',
                            border: '1px solid #E5E5E5',
                            mb: 1.5,
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
