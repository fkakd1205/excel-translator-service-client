import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import styled from "styled-components";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import CreateTranslatorHeaderTitleComponent from "./modal/CreateTranslatorHeaderTitleComponent";
import ExcelTranslatorCommonModal from "./modal/ExcelTranslatorCommonModal";
import ModifyTranslatorHeaderTitleComponent from "./modal/ModifyTranslatorHeaderTitleComponent";

const Container = styled.div`
`;

const TitleSelector = styled.div`
    display: grid;
    grid-template-columns: 50% auto;
    padding: 20px 0px;
    text-align: center;
    align-items: center;

    @media only screen and (max-width: 992px) {
        padding: 10px;
        grid-template-columns: 100%;
        row-gap: 20px;
        place-content: center;
    }
`;

const FormInput = styled.div`
    color: black;
    display: flex;
    vertical-align: middle;

    @media only screen and (max-width: 992px) {
        font-size: 10px;
        grid-row: end;
    }
`;

const TitleControlBtn = styled.button`
    background: #989fb7;
    color:white;
    border:1px solid #989fb7;
    border-radius: 3px;
    margin-left: 10px;
    padding: 10px;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    @media only screen and (max-width: 992px) {
        padding: 6px;
    }
`;

const DataContainer = styled.div`
`;

const TranslatorBtnBox = styled.div`
    padding: 0 3%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    text-align: center;
    align-items: center;

    @media only screen and (max-width: 992px){
        grid-template-columns: 100%;
    }
`;

const Form = styled.form`
    margin: 10px;

    @media only screen and (max-width: 992px){
        margin: 0 auto;
        width: 100%;
    }
`;

const FromGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
    text-align: center;
    align-items: center;


    @media only screen and (max-width: 992px){
        grid-template-columns: none;
        grid-template-rows: repeat(1, 1fr);
    }
`;

const ControlLabel = styled.label`
    font-size: 1rem;
    display: inline-block;
    margin: 4px;
    width: 100%;
    padding: 3% 0%;
    color: white;
    text-align: center;
    vertical-align: middle;
    background-color: #a9b3d5;
    border-radius: 3px;
    transition: 0.15s linear;
    font-weight: 600;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    @media only screen and (max-width:992px){
        padding: 1.5% 0%;
    }

    @media only screen and (max-width:768px){
        font-size: 14px;
    }

    @media only screen and (max-width:576px){
        font-size: 12px;
    }
`;

const ControlBtn = styled.button`
    font-size: 1rem;
    width: 100%;
    padding: 3% 0%;
    margin: 4px;
    color: white;
    vertical-align: middle;
    background-color: #a9b3d5;
    border-radius: 3px;
    border: none;
    transition: 0.15s linear;
    font-weight: 600;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    @media only screen and (max-width:992px){
        padding: 1.5% 0%;
    }

    @media only screen and (max-width:768px){
        font-size: 14px;
    }

    @media only screen and (max-width:576px){
        font-size: 12px;
    }
`;

const Input = styled.input`
    font-size: 20px;
    width: 100%;
    display: none;
`;

const TitleControlBox = styled.div`
    display: flex;

    @media only screen and (max-width: 992px) {
        justify-content: flex-end;
    }
`;

const DeleteBtn = styled.div`
    width: auto;
    float: right;
`;

class ExcelTranslatorHeader {
    constructor() {
        this.id = uuidv4();
        this.uploadHeaderTitle = '';
        this.downloadHeaderTitle = '';
        this.uploadHeaderDetail = {
            details: []
        };
        this.downloadHeaderDetail = {
            details: []
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
const initialSelectedHeaderTitleState = null;

const excelTitleInfoReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DATA':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const selectedHeaderTitleStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const ExcelTranslatorControlBar = (props) => {
    let pathname = props.location.pathname;
    let params = queryString.parse(props.location.search);

    const [excelTitleInfo, dispatchExcelTitleInfo] = useReducer(excelTitleInfoReducer, initialExcelTitle);
    const [selectedHeaderTitleState, dispatchSelectedHeaderTitleState] = useReducer(selectedHeaderTitleStateReducer, initialSelectedHeaderTitleState);
    const [createTranslatorHeaderTitleModalOpen, setCreateTranslatorHeaderTitleModalOpen] = useState(false);
    const [modifyTranslatorHeaderTitleModalOpen, setModifyTranslatorHeaderTitleModalOpen] = useState(false);

    // Get Excel Translator Header Detail
    useEffect(() => {
        function initHeaderTitleState() {
            if (!props.excelTranslatorHeaderList) {
                return;
            }
            
            if(!params.headerId) {
                dispatchSelectedHeaderTitleState({
                    type: 'CLEAR'
                })
                return;
            }

            let headerId = params.headerId;
            let headerTitleState = props.excelTranslatorHeaderList?.filter(r => r.id === headerId)[0];

            dispatchSelectedHeaderTitleState({
                type: 'INIT_DATA',
                payload: headerTitleState
            });
        }
        initHeaderTitleState();
    }, [params.headerId, props.excelTranslatorHeaderList]);


    const onCreateTranslatorHeaderTitleModalOpen = () => {
        setCreateTranslatorHeaderTitleModalOpen(true);
        dispatchExcelTitleInfo({
            type: 'CLEAR'
        })
    }

    const onCreateUploadExcelHeaderModalClose = () => {
        setCreateTranslatorHeaderTitleModalOpen(false);
    }

    const onModifyTranslatorHeaderTitleModalOpen = () => {
        if(!selectedHeaderTitleState){
            alert('엑셀 형식을 먼저 선택해주세요.');
            return;
        }

        setModifyTranslatorHeaderTitleModalOpen(true);

        dispatchExcelTitleInfo({
            type: 'INIT_DATA',
            payload: {
                downloadHeaderTitle: selectedHeaderTitleState.downloadHeaderTitle,
                uploadHeaderTitle: selectedHeaderTitleState.uploadHeaderTitle,
                rowStartNumber: selectedHeaderTitleState.rowStartNumber
            }
        });
    }

    const onModifyUploadExcelHeaderModalClose = () => {
        setModifyTranslatorHeaderTitleModalOpen(false);
    }

    const onChangeInputValue = (e) => {
        dispatchExcelTitleInfo({
            type: 'SET_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        });
    }

    const excelTranslatorHeaderControl = () => {
        return {
            submit: async function (e) {
                e.preventDefault();

                // 엑셀 타이틀 정보 설정 (업로드 타이틀, 다운로드 타이틀, 데이터 시작 행)
                let excelHeader = new ExcelTranslatorHeader().toJSON();
                excelHeader = {
                    ...excelHeader,
                    uploadHeaderTitle: excelTitleInfo.uploadHeaderTitle,
                    downloadHeaderTitle: excelTitleInfo.downloadHeaderTitle,
                    rowStartNumber: excelTitleInfo.rowStartNumber
                }
                
                await props.createTranslatorHeaderTitleControl(excelHeader);
                
                // 새로 생성된 타이틀 형식이 선택되도록 설정.
                props.history.replace({
                    pathname: pathname,
                    search: `?${queryString.stringify({
                        ...params,
                        headerId: excelHeader.id
                    })}`
                })

                onCreateUploadExcelHeaderModalClose();
            },
            modify: async function (e) {
                e.preventDefault();

                // 엑셀 타이틀 정보 설정 (업로드 타이틀, 다운로드 타이틀, 데이터 시작 행)
                let excelHeader = new ExcelTranslatorHeader().toJSON();
                excelHeader = {
                    ...excelHeader,
                    id: selectedHeaderTitleState.id,
                    uploadHeaderTitle: excelTitleInfo.uploadHeaderTitle,
                    downloadHeaderTitle: excelTitleInfo.downloadHeaderTitle,
                    rowStartNumber: excelTitleInfo.rowStartNumber
                }

                await props.modifyTranslatorHeaderTitleControl(excelHeader);
                onModifyUploadExcelHeaderModalClose();
            },
            selectHeaderTitle: function (e) {
                e.preventDefault();

                let selectedHeader = props.excelTranslatorHeaderList.filter(r => r.id === e.target.value)[0];

                props.history.replace({
                    pathname: pathname,
                    search: `?${queryString.stringify({
                        ...params,
                        headerId: selectedHeader.id
                    })}`
                })
            },
            delete: async function (e) {
                e.preventDefault();

                if(!selectedHeaderTitleState) {
                    alert('삭제하려는 엑셀 형식을 먼저 선택해주세요.');
                    return;
                }

                await props.deleteTranslatorHeaderTitleControl(selectedHeaderTitleState.id);

                props.history.replace({
                    pathname: pathname
                })
            }
        }
    }

    const excelFileControl = () => {
        return {
            uploadExcel: function () {
                return {
                    uploadExcelFile: async function (e) {
                        e.preventDefault();

                        // 헤더 타이틀을 선택하지 않은 경우
                        if (!selectedHeaderTitleState) {
                            alert('헤더 형식을 먼저 선택해주세요.');
                            return;
                        }

                        // 파일을 선택하지 않은 경우
                        if (e.target.files.length === 0) return;

                        let addFiles = e.target.files;

                        var uploadedFormData = new FormData();
                        uploadedFormData.append('file', addFiles[0]);
                        uploadedFormData.append(
                            "dto",
                            new Blob([JSON.stringify(selectedHeaderTitleState)], { type: "application/json" })
                        );

                        props.loadingControl().open();
                        await props.uploadExcelFileControl(uploadedFormData);
                        props.loadingControl().close();
                    }
                }
            },
            downloadExcel: function () {
                return {
                    downloadTranslatedExcelFile: async function (e) {
                        e.preventDefault();

                        if(!props.uploadedExcelData) {
                            alert('엑셀 파일을 먼저 업로드 해주세요.');
                            return;
                        }else if(!(selectedHeaderTitleState.uploadHeaderDetail.details.length > 0)) {
                            alert('업로드 엑셀 양식을 설정해주세요.');
                            return;
                        }else if(!(selectedHeaderTitleState.downloadHeaderDetail.details.length > 0)) {
                            alert('다운로드 엑셀 양식을 설정해주세요.');
                            return;
                        }

                        props.loadingControl().open();
                        await props.downloadTranslatedExcelFileControl(selectedHeaderTitleState.downloadHeaderDetail.details);
                        props.loadingControl().close();
                    }
                }
            }
        }
    }

    return (
        <>
            <Container>
                <DataContainer>
                    <TranslatorBtnBox>
                        <TitleSelector>
                            <FormInput>
                                <div style={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="storage-title-select-id">엑셀 형식 선택</InputLabel>
                                            <Select
                                                labelId="storage-title-select-id"
                                                id="storage-title-select"
                                                value={selectedHeaderTitleState?.id || ''}
                                                label="storage-title-selector"
                                                onChange={(e) => excelTranslatorHeaderControl().selectHeaderTitle(e)}
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
                                <TitleControlBtn type="button" onClick={() => onCreateTranslatorHeaderTitleModalOpen()}><AddIcon /></TitleControlBtn>
                                <TitleControlBtn type="button" onClick={() => onModifyTranslatorHeaderTitleModalOpen()}><EditIcon /></TitleControlBtn>
                                <TitleControlBtn type="button" onClick={(e) => excelTranslatorHeaderControl().delete(e)}><ClearIcon /></TitleControlBtn>
                            </TitleControlBox>
                        </TitleSelector>
                        <FromGroup>
                            <Form>
                                <ControlLabel htmlFor="upload-file-input">Upload</ControlLabel>
                                <Input id="upload-file-input" type="file" accept=".xls,.xlsx" onClick={(e) => e.target.value = ''} onChange={(e) => excelFileControl().uploadExcel().uploadExcelFile(e)} />
                            </Form>
                            <Form onSubmit={(e) => excelFileControl().downloadExcel().downloadTranslatedExcelFile(e)}>
                                <ControlBtn type="submit">Download</ControlBtn>
                            </Form>
                        </FromGroup>
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

            {/* Modify Header Title Modal */}
            <ExcelTranslatorCommonModal
                open={modifyTranslatorHeaderTitleModalOpen}
                onClose={() => onModifyUploadExcelHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <ModifyTranslatorHeaderTitleComponent
                    excelTitleInfo={excelTitleInfo}

                    onChangeInputValue={onChangeInputValue}
                    excelTranslatorHeaderControl={excelTranslatorHeaderControl}
                ></ModifyTranslatorHeaderTitleComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}

export default withRouter(ExcelTranslatorControlBar);