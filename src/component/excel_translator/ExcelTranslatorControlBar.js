import { useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import styled from "styled-components";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import CreateTranslatorHeaderTitleComponent from "./modal/CreateTranslatorHeaderTitleComponent";
import ExcelTranslatorCommonModal from "./modal/ExcelTranslatorCommonModal";

const Container = styled.div`
`;

const TitleSelector = styled.div`
    display: grid;
    /* grid-template-columns: 15% 20% 5%; */
    grid-template-columns: 90% 10%;
    grid-template-rows: 1fr;
    padding: 20px 0px;
    text-align: center;
    align-items: center;
`;

const FormInput = styled.div`
    color: black;
    display: flex;
    /* background-color: white; */
    vertical-align: middle;
`;

const StorageControlBtn = styled.button`
    background: #a2a9c1;
    color:white;
    border:1px solid #a2a9c1;
    border-radius: 3px;
    margin-left: 10px;
    padding: 10px;

    @media only screen and (max-width:576px ){
        padding: 0;
    }

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }
`;

const DataContainer = styled.div`
    background-color: #f2f5ff;
`;

const TranslatorBtnBox = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    text-align: center;
    align-items: center;
    background-color: #f2f5ff;
    /* padding: 10px; */
`;

const Form = styled.form`
    margin: 10px;
    float: right;

    @media only screen and (max-width:576px){
        width: 100%;
    }
`;

const ControlLabel = styled.label`
    font-size: 1rem;
    width: 90%;
    padding: 14px;
    margin: 4px;
    color: #444;
    text-align: center;
    vertical-align: middle;
    background-color: #fdfdfd;
    border-radius: 3px;
    transition: opacity 0.1s linear;
    font-weight: 500;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    @media only screen and (max-width:768px){
        font-size: 14px;
        width: 100%;
    }

    @media only screen and (max-width:576px){
        width: 100%;
        font-size: 12px;
    }
`;

const ControlBtn = styled.button`
    font-size: 1rem;
    width: 90%;
    padding: 14px;
    margin: 4px;
    color: #444;
    vertical-align: middle;
    background-color: #fdfdfd;
    border-radius: 3px;
    border: none;
    transition: opacity 0.1s linear;
    font-weight: 500;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    @media only screen and (max-width:768px){
        font-size: 14px;
        width: 100%;
    }

    @media only screen and (max-width:576px){
        width: 100%;
        font-size: 12px;
    }
`;

const Input = styled.input`
    font-size: 20px;
    width: 100%;
    display: none;
`;

class ExcelTranslatorHeader {
    constructor() {
        this.id = uuidv4();
        this.uploadHeaderTitle = '';
        this.downloadHeaderTitle = '';
        this.uploadHeaderDetail = {
            details : []
        };
        this.downloadHeaderDetail = {
            details : []
        };
        this.rowStartNumber = 0;
    }

    toJSON() {
        return {
            id: this.id,
            uploadHeaderTitle: this.uploadHeaderTitle,
            downloadHeaderTitle: this.downloadHeaderTitle,
            uploadHeaderDetail: this.uploadHeaderDetail,
            downloadHeaderDetail: this.downloadHeaderDetail,
            rowStartNumber: this.rowStartNumber
        }
    }
}

const initialExcelTitle = null;

const excelTitleInfoReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DATA':
            return {
                ...state,
                [action.payload.name] : action.payload.value
            }
        case 'CLEAR':
            return null;
        default: return {...state}
    }
}

const ExcelTranslatorControlBar = (props) => {
    const [excelTitleInfo, dispatchExcelTitleInfo] = useReducer(excelTitleInfoReducer, initialExcelTitle);
    const [createTranslatorHeaderTitleModalOpen, setCreateTranslatorHeaderTitleModalOpen] = useState(false);
    const [selectedHeaderTitle, setSelectedHeaderTitle] = useState(null);

    const onCreateTranslatorHeaderTitleModalOpen = () => {
        setCreateTranslatorHeaderTitleModalOpen(true);
        // setExcelTranslatorTitle(new ExcelTranslatorHeader().toJSON());
    }

    const onCreateUploadExcelHeaderModalClose = () => {
        setCreateTranslatorHeaderTitleModalOpen(false);
    }

    const onChangeInputValue = (e) => {
        dispatchExcelTitleInfo({
            type: 'SET_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        })
    }

    const excelTranslatorHeaderControl = () => {
        return {
            submit: async function (e) {
                e.preventDefault();

                // 엑셀 타이틀 정보 설정 (업로드 타이틀, 다운로드 타이틀, 데이터 시작 행)
                let excelHeader = new ExcelTranslatorHeader().toJSON();
                excelHeader.uploadHeaderTitle = excelTitleInfo.uploadHeaderTitle;
                excelHeader.downloadHeaderTitle = excelTitleInfo.downloadHeaderTitle;
                excelHeader.rowStartNumber = excelTitleInfo.rowStartNumber;

                await props.createTranslatorHeaderTitleControl(excelHeader);
                onCreateUploadExcelHeaderModalClose();
            },
            selectHeaderTitle: function (e, selectedTitle) {
                e.preventDefault();

                // uploadedExcelData를 null로 변경
                props.resetUploadExcelFileControl();
                setSelectedHeaderTitle(props.excelTranslatorHeaderList.filter(r => r.id === selectedTitle.id)[0]);
            },
        }
    }

    const excelFileControl = () => {
        return {
            uploadExcel: function () {
                return {
                    uploadExcelFile: async function (e) {
                        e.preventDefault();
        
                        // 헤더 타이틀을 선택하지 않은 경우
                        if(!selectedHeaderTitle) {
                            alert('헤더 형식을 먼저 선택해주세요.');
                            return;
                        }
        
                        // 파일을 선택하지 않은 경우
                        if(e.target.files.length === 0) return;
        
                        let addFiles = e.target.files;
        
                        var uploadedFormData = new FormData();
                        uploadedFormData.append('file', addFiles[0]);
                        uploadedFormData.append(
                            "dto",
                            new Blob([JSON.stringify(selectedHeaderTitle)], { type: "application/json" })
                        );
        
                        await props.uploadExcelFileControl(uploadedFormData);
                    }
                }
            },
            downloadExcel: function () {
                return {
                    downloadTranslatedExcelFile: async function (e) {
                        e.preventDefault();

                        await props.downloadTranslatedExcelFileControl(selectedHeaderTitle.downloadHeaderDetail.details);
                    }
                }
            },
        }
    }

    return (
        <>
            <Container>
                <DataContainer>
                    <TranslatorBtnBox>
                        <Form>
                            <ControlLabel htmlFor="upload-file-input">엑셀 파일 업로드</ControlLabel>
                            <Input id="upload-file-input" type="file" accept=".xls,.xlsx" onClick={(e) => e.target.value = ''} onChange={(e) => excelFileControl().uploadExcel().uploadExcelFile(e)}/>
                        </Form>
                        <Form  onSubmit={(e) => excelFileControl().downloadExcel().downloadTranslatedExcelFile(e)}>
                            <ControlBtn type="submit">발주서 다운로드</ControlBtn>
                        </Form>
                        <TitleSelector>
                            <FormInput>
                                <div style={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="storage-title-select-id">엑셀 형식 선택</InputLabel>
                                            <Select
                                                labelId="storage-title-select-id"
                                                id="storage-title-select"
                                                value={selectedHeaderTitle?.uploadHeaderTitle + ' > ' + selectedHeaderTitle?.downloadHeaderTitle || ''}
                                                label="storage-title-selector"
                                                defaultValue=''
                                            >
                                                {props.excelTranslatorHeaderList?.map((data, idx) => {
                                                    return (
                                                        <MenuItem key={'excel_translator_title' + idx} 
                                                            value={data.uploadHeaderTitle + ' > ' + data.downloadHeaderTitle} 
                                                            onClick={(e) => excelTranslatorHeaderControl().selectHeaderTitle(e, data)}>
                                                                {data.uploadHeaderTitle + ' > ' + data.downloadHeaderTitle}
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </div>
                            </FormInput>
                            <div>
                                <StorageControlBtn type="button" onClick={() => onCreateTranslatorHeaderTitleModalOpen()}><AddIcon /></StorageControlBtn>
                            </div>
                        </TitleSelector>
                    </TranslatorBtnBox>
                </DataContainer>
            </Container>

            {/* Create Header Title Modal */}
            <ExcelTranslatorCommonModal
                open={createTranslatorHeaderTitleModalOpen}
                onClose={() => onCreateUploadExcelHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <CreateTranslatorHeaderTitleComponent
                    excelTitleInfo={excelTitleInfo}

                    onChangeInputValue={onChangeInputValue}
                    excelTranslatorHeaderControl={excelTranslatorHeaderControl}
                ></CreateTranslatorHeaderTitleComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}

export default ExcelTranslatorControlBar;