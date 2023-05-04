import {Box, Card, Divider, Skeleton, Stack} from "@mui/material";


export const PostCardSkeleton = () => {
    return (
        <Card sx={{ mb: 2, py: 3, px: 0.5 }}>
            <Stack direction="row" spacing={1.5} sx={{ mx: 2, width: '100%' }}>
                <Skeleton variant="circular" width={'40px'} height={'40px'} sx={{aspectRatio: 1}} />
                <Stack>
                    <Skeleton variant="text" height={20} sx={{width: {xs: "150px", sm: "200px"}}}/>
                    <Skeleton variant="text" width="100px" height={15} />
                </Stack>
            </Stack>
            <Skeleton variant="text" width="90%" height={20} sx={{ mx: 2, my: 1 }} />
            <Skeleton variant="rectangular"  height={200} sx={{ mx: 2, my: 1, borderRadius: '10px' }} />
            <Stack direction="row" justifyContent="space-around" sx={{ mt: 1.5, mx: 1.5 }} spacing={1}>
                <Skeleton variant="rectangular" width="30%" height={30} sx={{borderRadius: '8px'}} />
                <Skeleton variant="rectangular" width="30%" height={30} sx={{borderRadius: '8px'}} />
                <Skeleton variant="rectangular" width="30%" height={30} sx={{borderRadius: '8px'}} />
            </Stack>
            {/*<Divider sx={{ mt: 1.5, mb: 0.5 }} />*/}
            {/*<Box sx={{ pb: 1 }}>*/}
            {/*    /!* Replace this with the PostCommentCardSkeleton component once you create it *!/*/}
            {/*    <Skeleton variant="rectangular" height={60} />*/}
            {/*</Box>*/}
        </Card>
    );
};
