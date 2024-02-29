import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Container, FormInput, TitleControlBox, TitleControlBtn, TitleSelector, FromGroup, Form, ControlLabel, Input, ControlBtn } from "./styles/Body.styled";

export default function ControlBarBody(props) {
    return (
        <>
            <Container>
                <TitleSelector>
                    <FormInput>
                        <div style={{ width: '100%' }}>
                            <Box sx={{ display: 'flex' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="storage-title-select-id">엑셀 형식 선택</InputLabel>
                                    <Select
                                        labelId="storage-title-select-id"
                                        id="storage-title-select"
                                        value={props.selectedHeader?.id || ''}
                                        label="storage-title-selector"
                                        onChange={(e) => props.handleChangeSelectedHeader(e)}
                                        defaultValue=''
                                    >
                                        {props.excelTranslatorHeaderList?.map((data, idx) => {
                                            return (
                                                <MenuItem key={'excel_translator_title' + idx} value={data.id}>
                                                    {data.uploadHeaderTitle + ' > ' + data.downloadHeaderTitle + ' (' + data.rowStartNumber + ')'}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>
                        </div>
                    </FormInput>
                    <TitleControlBox>
                        <TitleControlBtn type="button" onClick={() => props.onCreateHeaderModalOpen()}>
                            <img src="/assets/icons/add_ffffff.svg" />
                        </TitleControlBtn>
                        <TitleControlBtn type="button" onClick={() => props.onModifyHeaderModalOpen()}>
                            <img src="/assets/icons/edit_ffffff.svg" />
                        </TitleControlBtn>
                        <TitleControlBtn type="button" onClick={(e) => props.handleDeleteTranslatorForm(e)}>
                            <img src="/assets/icons/delete_ffffff.svg" />
                        </TitleControlBtn>
                    </TitleControlBox>
                </TitleSelector>
                <FromGroup>
                    <div className='button-box'>
                        <ControlLabel htmlFor="upload-file-input">Upload</ControlLabel>
                        <Input id="upload-file-input" type="file" accept=".xls,.xlsx" onClick={(e) => e.target.value = ''} onChange={(e) => props.handleUploadExcelFile(e)} />
                    </div>
                    <div className='button-box' onClick={(e) => props.handleDownloadTranslatedFile(e)}>
                        <ControlBtn type="button">Download</ControlBtn>
                    </div>
                </FromGroup>
            </Container>
        </>
    )
}
