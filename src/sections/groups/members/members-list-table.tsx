import type {ChangeEvent, FC, MouseEvent} from "react";
import numeral from "numeral";
import PropTypes from "prop-types";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Divider,
    IconButton,
    Link, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper,
    Stack,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {Scrollbar} from "../../../components/scrollbar";
import {GroupMember} from "../../../types/group-member";
import {getInitials} from "../../../utils/get-initials";
import React from "react";
import {Cloud, ContentCopy, ContentCut, ContentPaste} from "@mui/icons-material";
import {ChangeMemberRoleButton} from "../../../components/groups/members/change-member-role-button";

interface MembersListTableProps {
    count?: number;
    items?: GroupMember[];
    onDeselectAll?: () => void;
    onDeselectOne?: (customerId: string) => void;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onSelectAll?: () => void;
    onSelectOne?: (customerId: string) => void;
    page?: number;
    rowsPerPage?: number;
    selected?: string[];
}

export const MembersListTable: FC<MembersListTableProps> = (props) => {
    const {
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => {
        },
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        page = 0,
        rowsPerPage = 0,
        selected = []
    } = props;

    const selectedSome = (selected.length > 0) && (selected.length < items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);
    const enableBulkActions = selected.length > 0;

    return (
        <Box sx={{position: "relative"}}>
            {enableBulkActions && (
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        alignItems: "center",
                        backgroundColor: (theme) => theme.palette.mode === "dark"
                            ? "neutral.800"
                            : "neutral.50",
                        display: enableBulkActions ? "flex" : "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        px: 2,
                        py: 0.5,
                        zIndex: 10
                    }}
                >
                    <Checkbox
                        checked={selectedAll}
                        indeterminate={selectedSome}
                        onChange={(event) => {
                            if (event.target.checked) {
                                onSelectAll?.();
                            } else {
                                onDeselectAll?.();
                            }
                        }}
                    />
                    <Button
                        color="inherit"
                        size="small"
                    >
                        Delete
                    </Button>
                    <Button
                        color="inherit"
                        size="small"
                    >
                        Edit
                    </Button>
                </Stack>
            )}
            <Scrollbar>
                <Table sx={{minWidth: 700}}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAll}
                                    indeterminate={selectedSome}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            onSelectAll?.();
                                        } else {
                                            onDeselectAll?.();
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                Name
                            </TableCell>
                            <TableCell>
                                Grade
                            </TableCell>
                            <TableCell>
                                Role
                            </TableCell>
                            <TableCell align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((member: GroupMember) => {
                            const isSelected = selected.includes(member.id);

                            return (
                                <TableRow
                                    hover
                                    key={member.id}
                                    selected={isSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                                if (event.target.checked) {
                                                    onSelectOne?.(member.id);
                                                } else {
                                                    onDeselectOne?.(member.id);
                                                }
                                            }}
                                            value={isSelected}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={2}
                                        >
                                            <Avatar
                                                src={member.imageURL}
                                                sx={{
                                                    height: 42,
                                                    width: 42
                                                }}
                                            >
                                                {getInitials(`${member.firstName} ${member.lastName}`)}
                                            </Avatar>
                                            <div>
                                                <Link
                                                    color="inherit"
                                                    // component={RouterLink}
                                                    // href={paths.dashboard.customers.details}
                                                    variant="subtitle2"
                                                >
                                                    {`${member.firstName} ${member.lastName}`}
                                                </Link>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="body2"
                                                >
                                                    {member.email}
                                                </Typography>
                                            </div>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {member.grade}
                                    </TableCell>
                                    <TableCell>
                                        <Paper
                                            variant={"outlined"}
                                            sx={{
                                                alignContent: "end",
                                                justifyContent: "end",
                                                borderColor: "#e5e5e5",
                                                display: "inline-block",
                                                alignItems: "end",
                                                px: 1.1,
                                                py: 0.1,
                                            }}>
                                            <Typography
                                                variant={"caption"}
                                            >
                                                {member.role}
                                            </Typography>
                                        </Paper>
                                    </TableCell>
                                    {/*<TableCell>*/}
                                    {/*  <Typography variant="subtitle2">*/}
                                    {/*    {totalSpent}*/}
                                    {/*  </Typography>*/}
                                    {/*</TableCell>*/}
                                    <TableCell align="right">
                                        <ChangeMemberRoleButton/>
                                        <IconButton
                                            // component={RouterLink}
                                            // href={paths.dashboard.customers.details}
                                        >
                                            <SvgIcon>
                                                <ArrowRightIcon/>
                                            </SvgIcon>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Box>
    );
};

MembersListTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onDeselectAll: PropTypes.func,
    onDeselectOne: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectOne: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array
};
