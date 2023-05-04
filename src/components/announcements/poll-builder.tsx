import 'react'
import {FC, useEffect, useState} from "react";
import {Poll, PollOption} from "../../types/poll";
import {Box, Divider, IconButton, Paper, TextField, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {CheckBoxOutlineBlank} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {v4 as uuidv4} from "uuid";

interface PollBuilderProps {
    setPoll: (poll: Poll) => void;
    error: string | null;
}
export const PollBuilder: FC<PollBuilderProps> = (props) => {
    const {setPoll, error} = props;
    const [question, setQuestion] = useState<string>("");
    const [newOption, setNewOption] = useState<string>("");
    const [options, setOptions] = useState<PollOption[]>([]);

    useEffect(() => {
        setPoll({
            id: "",
            text: question,
            options: options,
            votes: 0,
        });
    }, [question, options]);

    const handleAddOption = (option: string) => {
        if(option === "") return;
        const newOption = {
            id: uuidv4(),
            text: option,
            voterIDs: [],
        }
        setOptions([...options, newOption]);
        setNewOption("");
    }

    const handleChangeOption = (e: any, id: string) => {
        const newOptions = options.map(option => {
            if(option.id === id) {
                return {
                    ...option,
                    text: e.target.value,
                }
            }
            return option;
        });
        setOptions(newOptions);
    }

    const handleRemoveOption = (id: string) => {
        const newOptions = options.filter(option => option.id !== id);
        setOptions(newOptions);
    }

    return (
        <Paper variant={'outlined'} sx={{borderColor: "#e5e5e5", p: 2}}>
            <TextField
                // error={!!(formik.touched.text && formik.errors.text)}
                fullWidth
                // helperText={formik.touched.text && formik.errors.text}
                label="Ask a question..."
                name="text"
                // onBlur={formik.handleBlur}
                onChange={e => setQuestion(e.target.value)}
                value={question}
            />

            <Divider sx={{my: 2, borderColor: "#e5e5e5"}}/>

            {
                options.map((option, index) => (
                    <TextField
                        key={index}
                        // error={!!(formik.touched.text && formik.errors.text)}
                        fullWidth
                        // helperText={formik.touched.text && formik.errors.text}
                        placeholder={"Add option..."}
                        // label="Add option"
                        name="text"
                        // onBlur={formik.handleBlur}
                        sx={{mb: 1}}
                        InputLabelProps={{
                            style: { display: 'none' },
                        }}
                        inputProps={{
                            style: { paddingTop: '16px', paddingBottom: '16px', fontSize: '14px' },
                        }}
                        InputProps={{
                            startAdornment: (
                                <>
                                    <CheckBoxOutlineBlank fontSize={"small"} sx={{color: 'grey', mr: 1}}/>
                                </>
                            ),
                            endAdornment: (
                                <IconButton size={"small"} onClick={() => handleRemoveOption(option.id)}>
                                    <CloseIcon fontSize={"small"} sx={{color: 'grey'}}/>
                                </IconButton>
                            )
                        }}
                        onChange={e => handleChangeOption(e, option.id)}
                        value={option.text}
                    />
                ))
            }
            <TextField
                // error={!!(formik.touched.text && formik.errors.text)}
                fullWidth
                // helperText={formik.touched.text && formik.errors.text}
                placeholder={"Add option..."}
                // label="Add option"
                name="text"
                // onBlur={formik.handleBlur}
                InputLabelProps={{
                    style: { display: 'none' },
                }}
                inputProps={{
                    style: { paddingTop: '16px', paddingBottom: '16px', fontSize: '14px' },
                }}
                InputProps={{
                    startAdornment: (
                        <>
                            <IconButton size={"small"} onClick={() => handleAddOption(newOption)}>
                                <AddIcon fontSize={"small"} sx={{color: 'grey', mr: 1}}/>
                            </IconButton>

                        </>
                    ),
                }}
                onChange={e => setNewOption(e.target.value)}
                value={newOption}
            />
            {error && <Typography variant={'caption'} color={"error"} sx={{mt: 1}}>{error}</Typography>}
        </Paper>
    )
}
