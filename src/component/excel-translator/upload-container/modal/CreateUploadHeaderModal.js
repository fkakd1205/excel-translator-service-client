import AddTaskIcon from '@mui/icons-material/AddTask';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BodyContainer, Container, CreateBtn, CreateContainer, CreateHeaderInfo, DataText, GroupTitle, IndexChangeBtn, DataInputEl, DeleteBtn, CustomDataGroup } from "./styles/CreateUploadHeader.styled";

export default function CreateUploadHeaderModal(props) {
    return (
        <>
            <Container>
                <form onSubmit={(e) => props.handleUpdateUploadHeader(e)}>
                    <div className='modal-header'>
                        <GroupTitle>업로드 엑셀 양식</GroupTitle>
                        <CreateBtn type='submit'><AddTaskIcon /></CreateBtn>
                    </div>
                    <BodyContainer>
                        <CreateContainer>
                            {props.headerDetails?.map((data, idx) => {
                                return (
                                    <CreateHeaderInfo key={'create_header_detail_idx' + idx} className="input-group mb-3">
                                        <DataText>
                                            <div style={{ width: '50px', textAlign: 'center' }}>
                                                <IndexChangeBtn onClick={(e) => props.handleMoveCellUp(e, data.id)}>
                                                    <ExpandLessIcon />
                                                </IndexChangeBtn>
                                                <IndexChangeBtn onClick={(e) => props.handleMoveCellDown(e, data.id)}>
                                                    <ExpandMoreIcon />
                                                </IndexChangeBtn>
                                            </div>
                                            <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                                <div>{idx + 1}.</div>
                                                <DataInputEl type="text" name='headerName' placeholder='업로드 엑셀 항목명' onChange={(e) => props.onChangeDetailInputValue(e, data.id)} value={data.headerName || data.colData || ''} required></DataInputEl>
                                            </div>
                                            <DeleteBtn>
                                                <button type='button' className='button-el' onClick={(e) => props.handleRemoveCell(e, data.id)}>
                                                    <img src="./assets/icons/delete_f76868.svg" />
                                                </button>
                                            </DeleteBtn>
                                        </DataText>
                                    </CreateHeaderInfo>
                                )
                            })}
                        </CreateContainer>
                        <CustomDataGroup>
                            <div className='add-button'>
                                <AddCircleOutlineIcon type="button" sx={{ fontSize: 30 }}
                                    onClick={(e) => props.handleAddCell(e)}
                                />
                            </div>
                        </CustomDataGroup>
                    </BodyContainer>
                </form>
            </Container>
        </>
    )
}
