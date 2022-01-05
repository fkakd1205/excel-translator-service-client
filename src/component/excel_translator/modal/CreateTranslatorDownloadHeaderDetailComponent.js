import React, { useEffect, useReducer, useState } from 'react';
import styled from "styled-components";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox } from '@mui/material';

const Container = styled.div`
`;

const ItemContainer = styled.div`
`;

const ItemWrapper = styled.div`
    background:white;
    border-radius: 5px;
`;

const ItemHeaderWrapper = styled.div`
    border-bottom: 1px solid #5961c788;
    padding:10px;
    overflow: auto;
    display: grid;
    grid-template-columns: 6fr 1fr;
    
    & .ref-stock-btn-active {
        background-color: #4682B4;
        color: white;
    }
`;

const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    padding:15px;
    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

const BodyContainer = styled.div`
    padding: 10px;
    max-height: 450px;
    overflow: auto;
`;

const DataWrapper = styled.div`
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 16px;
    height: auto;
    background-color: #e8ecf7;

    & .arrow-img {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const DataInputEl = styled.input`
    /* font-size: 1.2rem; */
    border: none;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #ced4da;
    &:focus{
        outline: none;
        border: 1px solid #4662B4;
        background: white;
    }
`;

const CustomDataGroup = styled.div`
    text-align: center;
    width: 100%;
    padding: 10px;

    &:hover{
        transform: scale(1.1);
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);

        color: #8e90e3;
    }
`;

const SubmitBtn = styled.button`
    border: none;
    border-radius: 50%;
    background-color: #c7cee3ee;
    margin: 10px 70px;
`;

const UploadDataGroup = styled.div`
    padding: 10px;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr 7fr;
    text-align: center;
    align-items: center;

    & .add-cell-btn {
        grid-column: span 3;
    }
`;

const DownloadDataGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 10px;
    text-align: left;
    align-items: center;
`;

const DeleteBtn = styled.div`
    color: #ff7979;
    float: right;

    &:hover{
        transform: scale(1.1);
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);

        color: #ffbaba;
    }
`;

const DataGroup = styled.div`
    display: grid;
    grid-template-columns: 40% 10% 45%;
    padding: 5px;
    place-content: space-evenly center;
    text-align: center;
    align-items: center;
`;

const ArrowSpan = styled.div`
    height: 100%;
`;

const FormInput = styled.div`
    color: black;
    display: flex;
    background-color: white;
    vertical-align: middle;
`;

const CreateTranslatorDownloadHeaderDetailComponent = (props) => {
    
    let downloadHeaderDetailList = props.downloadHeaderDetailList?.map(detail => {
        let data = props.selectedHeaderTitle?.uploadHeaderDetail.details.filter(r => detail.targetCellNumber === r.cellNumber)[0];
        
        if(data) {
            return {
                ...detail,
                refUploadHeaderName: data.headerName
            }
        }else{
            return detail
        }
    });

    return (
        <>
            <Container>
                <form onSubmit={(e) => props.downloadExcelFormControl().createDownloadExcelHeaderDetail(e)}>
                    <ItemContainer>
                        <ItemWrapper>
                            <ItemHeaderWrapper>
                                <GroupTitle>다운로드 엑셀 유형 등록</GroupTitle>
                                <SubmitBtn type="submit"><AddTaskIcon /></SubmitBtn>
                            </ItemHeaderWrapper>
                        </ItemWrapper>
                    </ItemContainer>
                        <BodyContainer>
                            {downloadHeaderDetailList?.map((data, idx) => {
                                return (
                                    <React.Fragment key={data.id}>
                                        <DataWrapper>
                                            <DeleteBtn><CancelIcon type="button" sx={{ fontSize: 33 }} onClick={(e) => props.downloadExcelFormControl().deleteCell(e, data.id)} /></DeleteBtn>
                                            <DataGroup>
                                                <UploadDataGroup>
                                                    <div>{idx + 1}.</div>
                                                    <FormInput>
                                                        <div style={{ width: '100%' }}>
                                                            <Box sx={{ display: 'flex' }}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="header-select-id">Title</InputLabel>
                                                                    <Select
                                                                        labelId="header-select-id"
                                                                        id="header-select"
                                                                        label="header-selector"
                                                                        value={data.refUploadHeaderName || ''}
                                                                    >
                                                                        {props.selectedHeaderTitle?.uploadHeaderDetail.details.map((data2, idx2) => {
                                                                            return (
                                                                                <MenuItem key={'excel_translator_download_title' + idx2} value={data2.headerName}
                                                                                    onClick={(e) => props.downloadExcelFormControl().selectedUploadHeaderName(e, data.id, data2)}
                                                                                >{data2.headerName}</MenuItem>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FormInput>
                                                </UploadDataGroup>
                                                <ArrowSpan className="arrow-img"><ArrowForwardIosIcon /></ArrowSpan>
                                                <div>
                                                    <DownloadDataGroup>
                                                        <div>설정 헤더명 : </div>
                                                        <DataInputEl type="text" name='headerName' placeholder='다운로드 엑셀 항목명' onChange={(e) => props.onChangeInputValue(e, data.id)} value={data.headerName} required></DataInputEl>
                                                    </DownloadDataGroup>
                                                    <DownloadDataGroup>
                                                        <div>고정값 여부 : </div>
                                                        <div>
                                                        <Checkbox
                                                            onClick={(e) => props.downloadExcelFormControl().checkOne(e, data.id)}
                                                            checked={props.downloadExcelFormControl().isChecked(data.id)}
                                                        />
                                                        </div>
                                                    </DownloadDataGroup>
                                                    <DownloadDataGroup>
                                                        <div>고정값 : </div>
                                                        <DataInputEl type="text" name='fixedValue' placeholder='엑셀 고정 값' onChange={(e) => props.onChangeInputValue(e, data.id)} disabled={!props.downloadExcelFormControl().isChecked(data.id)} value={data.fixedValue}></DataInputEl>
                                                    </DownloadDataGroup>
                                                </div>
                                            </DataGroup>
                                        </DataWrapper>
                                    </React.Fragment>
                                )
                            })}
                            <CustomDataGroup>
                                <AddCircleOutlineIcon type="button" sx={{ fontSize: 30 }}
                                    onClick={(e) => props.downloadExcelFormControl().addCell(e)}
                                />
                            </CustomDataGroup>
                        </BodyContainer>
                </form>
            </Container>
        </>
    )
}

export default CreateTranslatorDownloadHeaderDetailComponent;