import 'react'
import {FC, useEffect} from "react";
import {Form} from "../../types/form";
import {Avatar, Box, Card, Paper, Stack, styled, SvgIcon, Tooltip, Typography} from "@mui/material";
import {LockUnlocked01} from "@untitled-ui/icons-react";
import {Link, useNavigate} from "react-router-dom";
import EventIcon from '@mui/icons-material/EventOutlined';
import GroupIcon from '@mui/icons-material/GroupOutlined';
import FolderIcon from '@mui/icons-material/FolderOutlined';
import {cacheImages} from "../../utils/cache-image";

interface FormCardProps {
    form: Form;
}

export const HoverGrowthCard = styled(Card)`
  transition: transform 0.3s;
  padding-bottom: 10px;
  &:hover {
    transform: scale(1.025); /* Adjust the scale value for desired growth effect */
  }
`;
export const FormCard: FC<FormCardProps> = (props) => {
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
                    src={'https://img.freepik.com/premium-vector/geometric-minimalistic-color-composition-template-with-shapes-scandinavian-abstract-pattern-web-banner-packaging-branding_110633-440.jpg'}
                />
                <Box
                    sx={{
                        pt: 2,
                        px: 2,
                        pb: 1
                    }}
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
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
                                alignItems: 'center',
                                px: 1,
                                py: 0.25,
                            }}
                        >
                            <Typography variant={'body2'}>
                                {group.group}
                            </Typography>
                        </Paper>
                    </Box>
                    <Typography
                        variant={'h5'}
                        sx={{mt: 1, mb: 0.5}}
                    >
                        {group.title}
                    </Typography>
                    <Stack direction={"row"} alignItems={'center'}>
                        {/* @ts-ignore */}
                        <Typography
                            variant={'subtitle2'}
                            color={'text.secondary'}
                        >
                            Due on {new Date(group.due).toLocaleDateString()}
                        </Typography>
                        <Paper
                            variant={'outlined'}
                            sx={{
                                borderColor: "#e5e5e5",
                                alignContent: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                px: 1,
                                py: 0.25,
                                ml: 1,
                            }}
                        >
                            <Typography variant={'body2'}>
                                {group.status}
                            </Typography>
                        </Paper>
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
