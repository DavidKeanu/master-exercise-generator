import React, {useState} from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select,} from '@mui/material';

const ExperienceSelector = ({onExperienceChange, experience}) => {
    const [selectedValue, setSelectedValue] = useState(experience);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        onExperienceChange(newValue);
    };

    return (
        <Box style={{
            minWidth: '100px',
            minHeight: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Erfahrung</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedValue}
                    label="Erfahrung"
                    onChange={handleChange}
                >
                    <MenuItem value={0}>Keine Erfahrung</MenuItem>
                    <MenuItem value={1}>Anfänger</MenuItem>
                    <MenuItem value={2}>Grundkenntnisse</MenuItem>
                    <MenuItem value={3}>Fortgeschrittene Kenntnisse</MenuItem>
                    <MenuItem value={4}>Experte</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
};

export default ExperienceSelector;
