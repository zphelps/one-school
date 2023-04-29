import 'react'
import {Card, FormControl, InputAdornment, InputBase, InputLabel, MenuItem, Select, Stack, SvgIcon, TextField} from "@mui/material";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";

export const PostsSearch = () => {
    return (
        <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{pb: 3}}
        >
            <Card
                sx={{p:2}}
            >
                <FormControl>
                    <Select
                        value={10}
                        disableUnderline
                        variant="standard"
                        sx={{
                            border: 'none',
                        }}
                        // onChange={handleChange}
                    >
                        <MenuItem value={10}>All</MenuItem>
                        <MenuItem value={20}>Panther Robotics</MenuItem>
                        <MenuItem value={30}>Boys Soccer</MenuItem>
                        <MenuItem value={30}>Boys Tennis</MenuItem>
                    </Select>
                </FormControl>
            </Card>
            <Card
                component="form"
                // onSubmit={handleQueryChange}
                sx={{flexGrow: 1, p:2}}
            >
                <InputBase
                    defaultValue=""
                    fullWidth
                    // inputProps={{ref: queryRef}}
                    name="paymentNumber"
                    placeholder="Search posts"
                    startAdornment={(
                        <InputAdornment position="start">
                            <SvgIcon>
                                <SearchMdIcon/>
                            </SvgIcon>
                        </InputAdornment>
                    )}
                />
            </Card>

        </Stack>
    )
}
