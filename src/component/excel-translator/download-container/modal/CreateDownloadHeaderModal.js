import React from 'react';
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
import { Container, ItemContainer, ItemWrapper, ItemHeaderWrapper, GroupTitle, BodyContainer, DataWrapper, DataInputEl, CustomDataGroup, UploadDataGroup, DownloadDataGroup, DownloadInfo, DeleteBox, DeleteBtn, DataGroup, ArrowSpan, FormInput, CreateBtn, DataContainer } from './styles/CreateDownloadHeader.styled'

export default function CreateDownloadHeaderModal(props) {

    // 다운로드 엑셀 헤더의 targetCellNumber에 대응하는 업로드 엑셀의 헤더명을 찾는다.
    const getUploadHeaderName = (targetCellNumber) => {
        let result = props.updateDownloadHeaderForm?.uploadHeaderDetail?.details.filter(r => r.cellNumber === targetCellNumber)[0];
        return result?.cellNumber ?? -1;
    }

    return (
        <>
            <Container>
                <form onSubmit={(e) => props.handleCreateDownloadHeader(e)}>
                    <div className='modal-header'>
                        <GroupTitle>다운로드 엑셀 양식</GroupTitle>
                        <CreateBtn type='submit'><AddTaskIcon /></CreateBtn>
                    </div>
                    <BodyContainer>
                        <DataContainer>
                            {props.updateDownloadHeaderForm?.downloadHeaderDetail?.details.map((downloadHeader, idx) => {
                                let isChecked = props.handleIsChecked(downloadHeader.id)
                                
                                return (
                                    <React.Fragment key={downloadHeader.id}>
                                        <DataWrapper>
                                            <DeleteBtn>
                                                <button type='button' className='button-el' onClick={(e) => props.handleRemoveCell(e, downloadHeader.id)}>
                                                    <img src="./assets/icons/delete_ffffff.svg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
                                                </button>
                                            </DeleteBtn>
                                            <DataGroup>
                                                <UploadDataGroup>
                                                    <div>{idx + 1}.</div>
                                                    <FormInput>
                                                        <div style={{ width: '100%' }}>
                                                            <Box sx={{ display: 'flex' }}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="header-select-id" size="small">Title</InputLabel>
                                                                    <Select
                                                                        labelId="header-select-id"
                                                                        id="header-select"
                                                                        label="header-selector"
                                                                        value={isChecked || downloadHeader.targetCellNumber === -1 ? '고정값' : getUploadHeaderName(downloadHeader.targetCellNumber)}
                                                                        sx={{ height: 40 }}
                                                                        onChange={(e) => props.onChangeSelectedHeaderField(e, downloadHeader.id)}
                                                                        disabled={isChecked}
                                                                    >
                                                                        {props.updateDownloadHeaderForm?.uploadHeaderDetail?.details.map((headerTitle, idx2) => {
                                                                            return (
                                                                                <MenuItem key={'excel_translator_upload_header_name' + idx2} value={parseInt(headerTitle.cellNumber)}
                                                                                >{headerTitle.headerName}</MenuItem>
                                                                            )
                                                                        })}
                                                                        <MenuItem value={'고정값'} hidden>고정값</MenuItem>
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
                                                        <DataInputEl type="text" name='headerName' placeholder='다운로드 엑셀 항목명' onChange={(e) => props.onChangeHeaderFieldValue(e, downloadHeader.id)} value={downloadHeader.headerName} required></DataInputEl>
                                                    </DownloadDataGroup>
                                                    <DownloadDataGroup>
                                                        <div>고정값 여부</div>
                                                        <div>
                                                            <Checkbox
                                                                onClick={(e) => props.handleCheckOne(e, downloadHeader.id)}
                                                                checked={isChecked}
                                                            />
                                                        </div>
                                                    </DownloadDataGroup>
                                                    <DownloadDataGroup>
                                                        <div>고정값</div>
                                                        <DataInputEl type="text" name='fixedValue' placeholder='엑셀 고정 값' onChange={(e) => props.onChangeHeaderFieldValue(e, downloadHeader.id)} disabled={!props.handleIsChecked(downloadHeader.id)} value={downloadHeader.fixedValue}></DataInputEl>
                                                    </DownloadDataGroup>
                                                </DownloadInfo>
                                            </DataGroup>
                                        </DataWrapper>
                                    </React.Fragment>
                                );
                            })}
                        </DataContainer>
                        <CustomDataGroup>
                            <AddCircleOutlineIcon type="button" sx={{ fontSize: 30 }}
                                onClick={(e) => props.handleAddCell(e)}
                            />
                        </CustomDataGroup>
                    </BodyContainer>
                </form>
            </Container>
        </>
    )
}
