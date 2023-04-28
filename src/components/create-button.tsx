import 'react'
import {Button, SvgIcon} from "@mui/material";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {usePopover} from "../hooks/use-popover";
import {NotificationsPopover} from "../layouts/dashboard/notifications-button/notifications-popover";
import { CreateContentPopover } from './create-popover';

export const CreateButton = () => {
    const popover = usePopover<HTMLButtonElement>();

    return (
        <>
            <Button
                startIcon={(
                    <SvgIcon>
                        <PlusIcon/>
                    </SvgIcon>
                )}
                variant="contained"
                ref={popover.anchorRef}
                onClick={popover.handleOpen}
            >
                Create
            </Button>
            <CreateContentPopover
                anchorEl={popover.anchorRef.current}
                onClose={popover.handleClose}
                open={popover.open}
            />
        </>
    )
}
