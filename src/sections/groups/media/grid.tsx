import 'react'
import {Box, Button, Card, Grid, ImageList, ImageListItem, Skeleton, Stack, Typography} from "@mui/material";
import {FC} from "react";
import {Group, GroupMediaItem} from "../../../types/group";
import {useCollection} from "../../../hooks/firebase/useCollection";

interface GroupMediaGridProps {
    group: Group;
}
export const GroupMediaGrid:FC<GroupMediaGridProps> = (props) => {
    const {group} = props;
    const {documents: mediaItems, isPending, error} = useCollection('groups/' + group.id + '/media', [], []);

    return (
        <Card
            sx={{
                p: 3
            }}
        >
            <Stack
                direction={'row'}
                alignItems={'start'}
                justifyContent={'space-between'}
            >
                <Typography
                    variant={'h6'}
                >
                    Media
                </Typography>
                <Button
                    variant={'contained'}
                >
                    Upload
                </Button>
            </Stack>

            {mediaItems && <Grid container sx={{mt: 2}}>
                {(mediaItems as GroupMediaItem[]).map((item: GroupMediaItem) => (
                    <Grid item key={item.id} xs={4} sm={3} md={2} lg={2}>
                        <Box
                            width={'100%'}
                            sx={{
                                position: 'relative',
                                paddingBottom: '100%',
                                overflow: 'hidden',
                                aspectRatio: 1,
                            }}
                        >
                            <img
                                style={{
                                    borderRadius: 6,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    padding: 1,
                                }}
                                width={'100%'}
                                height={'100%'}
                                src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                loading="lazy"
                            />
                        </Box>

                    </Grid>
                ))}
            </Grid>}

            {isPending && <Grid container sx={{mt: 2}}>
                {(Array.from({length: 8})).map((_,i) => (
                    <Grid item key={i} xs={4} sm={3} md={2} lg={2}>
                        <Box
                            width={'100%'}
                            sx={{
                                position: 'relative',
                                paddingBottom: '100%',
                                overflow: 'hidden',
                                aspectRatio: 1,
                            }}
                        >
                            <Skeleton
                                variant={'rectangular'}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    m: 0.5,
                                }}
                                height={'100%'}
                            />
                        </Box>

                    </Grid>
                ))}
            </Grid>}
        </Card>
    )
}
