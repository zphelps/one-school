import React from 'react';
import { Avatar, Box, Card, Paper, Skeleton, Stack, styled } from '@mui/material';

const HoverGrowthCard = styled(Card)`
  transition: transform 0.3s;
  padding-bottom: 10px;
  &:hover {
    transform: scale(1.025);
  }
`;

const GroupCardSkeleton = () => {
    return (
        <HoverGrowthCard>
            <Skeleton variant="rectangular" width={'100%'} height={'120px'} />
            <Box
                sx={{
                    pt: 2,
                    px: 2,
                    pb: 1,
                }}
            >
                <Skeleton variant="circular" width={75} height={75} style={{ marginTop: '-70px', marginBottom: '16px' }} />
                <Skeleton width="60%" height={24} />
                <Skeleton width="50%" height={20} style={{ marginTop: '8px', marginBottom: '16px' }} />
                <Stack direction={'row'} spacing={1} sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{borderRadius: '6px'}} />
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{borderRadius: '6px'}}/>
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{borderRadius: '6px'}}/>
                </Stack>
            </Box>
        </HoverGrowthCard>
    );
};

export default GroupCardSkeleton;
