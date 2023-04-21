import 'react'
import React, {FC, useEffect, useState} from "react";
import {
    Box,
    Button, Divider, InputAdornment,
    Paper,
    Stack,
    SvgIcon,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {Users02} from "@untitled-ui/icons-react";
import {InfoOutlined, Numbers} from "@mui/icons-material";

enum AttendanceType {
    RSVP = "RSVP",
    TICKET = "Ticket",
    NONE = "None",
}

interface ManageAttendanceFormProps {
    setAttendance: (attendance: any) => void
}

export const ManageAttendanceForm: FC<ManageAttendanceFormProps> = (props) => {
    const {setAttendance} = props
    const [attendanceType, setAttendanceType] = useState<AttendanceType>(AttendanceType.NONE)
    const [showGuestList, setShowGuestList] = useState<boolean>(true)
    const [ticketName, setTicketName] = useState<string>("")
    const [ticketNameError, setTicketNameError] = useState<boolean>(true)
    const [ticketDescription, setTicketDescription] = useState<string>()
    const [limitTickets, setLimitTickets] = useState<boolean>(false)
    const [ticketLimit, setTicketLimit] = useState<number>(50)
    const [ticketLimitError, setTicketLimitError] = useState<boolean>(false)
    const [ticketPrice, setTicketPrice] = useState()
    const [ticketPriceError, setTicketPriceError] = useState<boolean>(false)
    const [serviceFee, setServiceFee] = useState<number>(0)
    const [totalPrice, setTotalPrice] = useState<number>(0)

    useEffect(() => {
        if(!ticketPrice) {
            setServiceFee(0)
            setTotalPrice(0)
            return
        }
        const fee = parseFloat(ticketPrice) * 0.029 + 0.3;
        setServiceFee(fee)
        setTotalPrice(parseFloat(ticketPrice) + fee)
    }, [ticketPrice, serviceFee])

    useEffect(() => {
        if(attendanceType === AttendanceType.NONE
            || (attendanceType === AttendanceType.TICKET && (ticketNameError || ticketLimitError || ticketPriceError))) {
            setAttendance(null);
            return;
        } else {
            if(attendanceType === AttendanceType.RSVP) {
                setAttendance({
                    ticket: null,
                    RSVP: {
                        attending: [],
                        maybe: [],
                        notAttending: [],
                        showGuestList,
                    },
                })
                return;
            } else {
                const ticket = {
                    name: ticketName,
                    description: ticketDescription ? ticketDescription : null,
                    limit: limitTickets ? ticketLimit : null,
                    price: totalPrice,
                    sold: 0,
                }
                setAttendance({
                    ticket,
                    RSVP: null,
                })
                return;
            }
        }
    }, [
        attendanceType,
        showGuestList,
        ticketName,
        ticketDescription,
        limitTickets,
        ticketLimit,
        ticketPrice,
        serviceFee,
        totalPrice
    ])

    const validateTicketName = (name: string) => {
        return name.length > 0;
    }

    const validatePrice = (price: string) => {
        const regex = /^\d+(\.\d{0,2})?$/;
        return regex.test(price);
    };

    const validateTicketLimit = (limit: string) => {
        const regex = /^\d+$/;
        return regex.test(limit);
    }

    return (
        <Box
            sx={{
                mt: 2,
                mb: 0.75,
            }}
        >
            <Stack direction={{sm: 'column', md: 'row'}} spacing={{md: 1.5}} rowGap={1.5}>
                <Button
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        p: 2,
                        color: attendanceType === AttendanceType.RSVP ? 'primary.main' : 'text.primary',
                        borderColor: attendanceType === AttendanceType.RSVP ? 'primary.main' : '#e5e5e5',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                            borderColor: '#e5e5e5',
                        },
                    }}
                    onClick={() => setAttendanceType(AttendanceType.RSVP)}
                    variant={'outlined'}
                >
                    <Typography
                        variant={'subtitle1'}
                        textAlign={'center'}
                    >
                        Collect RSVPs
                    </Typography>
                </Button>
                <Button
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        p: 2,
                        color: attendanceType === AttendanceType.TICKET ? 'primary.main' : 'text.primary',
                        borderColor: attendanceType === AttendanceType.TICKET ? 'primary.main' : '#e5e5e5',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                            borderColor: '#e5e5e5',
                        },
                    }}
                    onClick={() => setAttendanceType(AttendanceType.TICKET)}
                    variant={'outlined'}
                >
                    <Typography
                        variant={'subtitle1'}
                        textAlign={'center'}
                    >
                        Sell Tickets
                    </Typography>
                </Button>
            </Stack>

            {attendanceType === AttendanceType.RSVP && (
                <Box
                    sx={{
                        mt: 1.5,
                    }}
                >
                    <Stack direction={'row'}>
                        <SvgIcon  sx={{mr: 2}} fontSize={'small'}>
                            <InfoOutlined sx={{color:'text.secondary'}} fontSize={'small'}/>
                        </SvgIcon>
                        <Typography
                            variant={'body2'}
                            color={'text.secondary'}
                        >
                            NOTE: Only members will be able to RSVP to your event. If you would like to
                            open your event to the public, you can make this a public event.
                        </Typography>
                    </Stack>
                    <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        sx={{mt: 2}}
                    >
                        <Stack direction={'row'}>
                            <SvgIcon>
                                <Users02/>
                            </SvgIcon>
                            <Typography sx={{pl: 2}}>Show guest list</Typography>
                        </Stack>
                        <Switch
                            checked={showGuestList}
                            onChange={() => setShowGuestList(!showGuestList)}
                        />
                    </Stack>

                </Box>
            )}

            {attendanceType === AttendanceType.TICKET && (
                <Box
                    sx={{
                        mt: 1.5,
                    }}
                >
                    <Stack direction={'row'}>
                        <SvgIcon  sx={{mr: 2}} fontSize={'small'}>
                            <InfoOutlined sx={{color:'text.secondary'}} fontSize={'small'}/>
                        </SvgIcon>
                        <Typography
                            variant={'body2'}
                            color={'text.secondary'}
                        >
                            NOTE: Only members will be able to buy tickets to your event. If you would like to
                            open your event to the public, you can make this a public event.
                        </Typography>
                    </Stack>
                    <Divider sx={{mt: 2, mb: 2, borderColor: '#e5e5e5'}}/>
                    <TextField
                        required
                        fullWidth
                        error={ticketNameError}
                        helperText={ticketNameError ? "Ticket name is required" : ""}
                        label="Ticket Name"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (validateTicketName(value)) {
                                setTicketNameError(false);
                            } else {
                                setTicketNameError(true);
                            }
                            setTicketName(value);
                        }}
                        value={ticketName}
                        sx={{mb: 1.5}}
                    />
                    <TextField
                        fullWidth
                        label="Ticket Description"
                        onChange={(e) => setTicketDescription(e.target.value)}
                        value={ticketDescription}
                        multiline
                        rows={2}
                    />
                    <Divider sx={{mt: 2, mb: 2, borderColor: '#e5e5e5'}}/>
                    <TextField
                        required
                        fullWidth
                        error={ticketPriceError}
                        helperText={ticketPriceError ? "Invalid price format" : ""}
                        type={'number'}
                        placeholder={'0.00'}
                        inputMode={'decimal'}
                        value={ticketPrice ?? '0'}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (validatePrice(value)) {
                                setTicketPriceError(false);
                            } else {
                                setTicketPriceError(true);
                            }
                            // @ts-ignore
                            setTicketPrice(value);
                        }}
                        InputProps={{
                            inputProps: {
                                pattern: '^\\d*(\\.\\d{0,2})?$', // Allow up to 2 decimal places
                                step: 0.01 // Increment by 0.01 (2 decimal places)
                            },
                            startAdornment: (
                                <InputAdornment position="start">$</InputAdornment>
                            ),
                        }}
                        label="Price"
                    />
                    <Divider sx={{mt: 2, mb: 2, borderColor: '#e5e5e5'}}/>
                    <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        sx={{mt: 2}}
                    >
                        <Stack direction={'row'}>
                            <SvgIcon fontSize={'small'}>
                                <Numbers/>
                            </SvgIcon>
                            <Typography sx={{pl: 2}} variant={'subtitle2'}>Limit number of available tickets</Typography>
                        </Stack>
                        <Switch
                            checked={limitTickets}
                            onChange={() => setLimitTickets(!limitTickets)}
                        />
                    </Stack>
                    {limitTickets && <TextField
                        required
                        fullWidth
                        error={ticketLimitError}
                        helperText={ticketLimitError ? "Invalid quantity" : ""}
                        inputMode={'numeric'}
                        type={'number'}
                        value={ticketLimit ?? '0'}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (validateTicketLimit(value)) {
                                setTicketLimitError(false);
                            } else {
                                setTicketLimitError(true);
                            }
                            // @ts-ignore
                            setTicketLimit(value);
                        }}
                        label="Quantity available"
                        sx={{mt: 1}}
                    />}
                    <Divider sx={{mt: 2, mb: 2, borderColor: '#e5e5e5'}}/>

                    <Paper
                        variant={'outlined'}
                        sx={{
                            borderColor: '#e5e5e5',
                            p: 2
                        }}
                    >
                        <Stack
                            sx={{mb: 2}}
                        >
                            <Typography
                                variant={'subtitle2'}
                                sx={{mb: 0.5}}
                            >
                                What The Buyer Pays
                            </Typography>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography
                                    variant={'body2'}
                                    fontWeight={'light'}
                                >
                                    Ticket Price
                                </Typography>
                                <Typography
                                    variant={'body2'}
                                >
                                    {ticketPrice ? `\$${parseFloat(ticketPrice).toFixed(2)}` : '$0.00'}
                                </Typography>
                            </Stack>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography
                                    variant={'body2'}
                                    fontWeight={'light'}
                                >
                                    Service Fee
                                </Typography>
                                <Typography
                                    variant={'body2'}
                                >
                                    {serviceFee ? `\$${serviceFee.toFixed(2)}` : '$0.00'}
                                </Typography>
                            </Stack>
                            <Divider sx={{mt: 1, mb: 1, borderColor: '#e5e5e5'}}/>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography
                                    variant={'body2'}
                                >
                                    Total buyer pays
                                </Typography>
                                <Typography
                                    variant={'body2'}
                                >
                                    {ticketPrice ? `\$${(parseFloat(ticketPrice) + serviceFee).toFixed(2)}` : '$0.00'}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack>
                            <Typography
                                variant={'subtitle2'}
                                sx={{mb: 0.5}}
                            >
                                What You Get Paid
                            </Typography>
                            <Stack direction={'row'} justifyContent={'space-between'}>
                                <Typography
                                    variant={'body2'}
                                    fontWeight={'light'}
                                >
                                    Ticket Revenue
                                </Typography>
                                <Typography
                                    variant={'body2'}
                                >
                                    {ticketPrice ? `\$${parseFloat(ticketPrice).toFixed(2)}` : '$0.00'}
                                </Typography>
                            </Stack>
                        </Stack>

                    </Paper>
                </Box>
            )}
        </Box>
    )
}
