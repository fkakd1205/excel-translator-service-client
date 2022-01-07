import React from 'react';
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
    align-items: center;
    padding:10px;
    overflow: auto;
    display: grid;
    grid-template-columns: 90% 10%;

    @media only screen and (max-width:425px){
        grid-template-columns: 80% 10%;
    }
`;

const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    padding:15px;

    @media only screen and (max-width:425px){
        padding: 15px 0;
        font-size: 1rem;
    }
`;

const BodyContainer = styled.div`
    padding: 10px;
    max-height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
`;

const DataWrapper = styled.div`
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px 16px 30px 16px;
    height: auto;
    background-color: #e8ecf7;

    & .arrow-img {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const DataInputEl = styled.input`
    border: none;
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

const UploadDataGroup = styled.div`
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
    margin: 10px 0px;

    @media only screen and (max-width:992px){
        grid-template-columns: 1fr;
        place-content: center;
    }
`;

const DownloadInfo = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;

`;

const DeleteBox = styled.div`
    text-align: right;
    width: 100%;
`;

const DeleteBtn = styled.span`
    color: #ff7979;
    margin-bottom: 5px;

    &:hover{
        transform: scale(1.1);
        cursor: pointer;
        color: #ffbaba;

    }

    &:active{
        transition: 0s;
        transform: scale(1.05);

        color: #ffbaba;
    }
`;

const DataGroup = styled.div`
    display: grid;
    grid-template-columns: 40% 7% 50%;
    padding: 5px;
    text-align: center;
    align-items: center;

    .icon-must {
        position: relative;
        margin-left: 5px;
        width: 6px;
        height: 6px;
        display: inline-block;
        background-color: #ff545c;
        border-radius: 50%;
        vertical-align: middle;
    }

    @media only screen and (max-width:992px){
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 10px;
    }
`;

const ArrowSpan = styled.div`
    @media only screen and (max-width:992px){
        transform: rotate(90deg);
    }
`;

const FormInput = styled.div`
    color: black;
    display: flex;
    background-color: white;
    vertical-align: middle;
`;

const CreateBtn = styled.button`
    background: #aab3cdee;
    border:none;
    margin: 0 auto;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: 0.4s;

    & .button-img{
        width:32px;
        filter: invert(100%) sepia(1%) saturate(3%) hue-rotate(90deg) brightness(113%) contrast(89%);
    }

    &:hover{
        transform: scale(1.1);
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);
        background: #c7cee3ee;
    }
`;

const CreateTranslatorDownloadHeaderDetailComponent = (props) => {
    // downloadHeaderDetailList의 targetCellNumber를 추적해 업로드 엑셀의 헤더명을 찾는다.
    let downloadHeaderDetailList = props.downloadHeaderDetailList?.map(detail => {
        let data = props.modifyHeaderTitle?.uploadHeaderDetail.details.filter(r => detail.targetCellNumber === r.cellNumber)[0];
        
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
                                <CreateBtn type='submit'><AddTaskIcon /></CreateBtn>
                            </ItemHeaderWrapper>
                        </ItemWrapper>
                    </ItemContainer>
                    <BodyContainer>
                        {downloadHeaderDetailList?.map((data, idx) => {
                            return (
                                <React.Fragment key={data.id}>
                                    <DataWrapper>
                                        <DeleteBox>
                                            <DeleteBtn><CancelIcon type="button" sx={{ fontSize: 33 }} onClick={(e) => props.downloadExcelFormControl().deleteCell(e, data.id)} /></DeleteBtn>
                                        </DeleteBox>
                                        <DataGroup>
                                            <UploadDataGroup>
                                                <div>{idx + 1}.</div>
                                                <FormInput>
                                                    <div style={{ width: '100%' }}>
                                                        <Box sx={{ display: 'flex'}}>
                                                        <FormControl fullWidth>
                                                            <InputLabel id="header-select-id" size="small">Title</InputLabel>
                                                            <Select
                                                                labelId="header-select-id"
                                                                id="header-select"
                                                                label="header-selector"
                                                                value={data.refUploadHeaderName || ''}
                                                                sx={{ height: 40 }}
                                                            >
                                                                {props.modifyHeaderTitle?.uploadHeaderDetail.details.map((headerTitle, idx2) => {
                                                                    return (
                                                                        <MenuItem key={'excel_translator_download_title' + idx2} value={headerTitle.headerName}
                                                                            onClick={(e) => props.downloadExcelFormControl().selectedUploadHeaderName(e, data.id, headerTitle)}
                                                                        >{headerTitle.headerName}</MenuItem>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </FormControl>
                                                        </Box>
                                                    </div>
                                                </FormInput>
                                            </UploadDataGroup>
                                            <ArrowSpan className="arrow-img"><ArrowForwardIosIcon /></ArrowSpan>
                                            <DownloadInfo>
                                                <DownloadDataGroup>
                                                    <div>설정 헤더명<i className="icon-must" aria-label="필수항목"></i></div>
                                                    <DataInputEl type="text" name='headerName' placeholder='다운로드 엑셀 항목명' onChange={(e) => props.onChangeInputValue(e, data.id)} value={data.headerName} required></DataInputEl>
                                                </DownloadDataGroup>
                                                <DownloadDataGroup>
                                                    <div>고정값 여부</div>
                                                    <div>
                                                        <Checkbox
                                                            onClick={(e) => props.downloadExcelFormControl().checkOne(e, data.id)}
                                                            checked={props.downloadExcelFormControl().isChecked(data.id)}
                                                        />
                                                    </div>
                                                </DownloadDataGroup>
                                                <DownloadDataGroup>
                                                    <div>고정값</div>
                                                    <DataInputEl type="text" name='fixedValue' placeholder='엑셀 고정 값' onChange={(e) => props.onChangeInputValue(e, data.id)} disabled={!props.downloadExcelFormControl().isChecked(data.id)} value={data.fixedValue}></DataInputEl>
                                                </DownloadDataGroup>
                                            </DownloadInfo>
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