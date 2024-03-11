import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import GptService from "../services/GptService";

const SelectGptModels = ({ transferGptModelToParent }) => {
    const [gptModels, setGptModels] = React.useState([]);
    const [selectedGptModel, setSelectedGptModel] = useState('');

    const handleChange = (event) => {
        setSelectedGptModel(event.target.value);
        transferGptModelToParent(selectedGptModel);
    };


    useEffect(() => {
        GptService.getGptModels().then(models => {
            setGptModels(models);
            setSelectedGptModel(models[0]);
        });
    }, []);

    return (
        <Box sx={{ minWidth: 120}}>
            <FormControl title="GptModel">
                <Select
                    title="GptModel"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedGptModel}
                    label="GptModel"
                    onChange={handleChange}
                >
                    {gptModels?.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default SelectGptModels;