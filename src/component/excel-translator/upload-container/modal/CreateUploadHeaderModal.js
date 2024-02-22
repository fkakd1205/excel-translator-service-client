import AddTaskIcon from '@mui/icons-material/AddTask';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BodyContainer, Container, CreateBtn, CreateContainer, CreateHeaderInfo, DataText, GroupTitle, IndexChangeBtn, ItemContainer, ItemHeaderWrapper, ItemWrapper, DataInputEl, DeleteBox, DeleteBtn, CustomDataGroup } from "./styles/CreateUploadHeader.styled";

export default function CreateUploadHeaderModal(props) {
    return (
        <>
            <Container>
                <form onSubmit={(e) => props.handleCreateUploadHeader(e)}>
                    <ItemContainer>
                        <ItemWrapper>
                            <ItemHeaderWrapper>
                                <GroupTitle>엑셀 양식 저장</GroupTitle>
                                <CreateBtn type='submit'><AddTaskIcon /></CreateBtn>
                            </ItemHeaderWrapper>
                        </ItemWrapper>
                    </ItemContainer>
                    <BodyContainer>
                        <CreateContainer>
                            {props.createUploadHeaderDetailState?.uploadedData.details?.map((data, idx) => {
                                return (
                                    <CreateHeaderInfo key={'create_header_detail_idx' + idx} className="input-group mb-3">
                                        <DataText>
                                            <div>
                                                <IndexChangeBtn onClick={(e) => props.handleMoveCellUp(e, data.id)}>
                                                    <ExpandLessIcon />
                                                </IndexChangeBtn>
                                                <IndexChangeBtn onClick={(e) => props.handleMoveCellDown(e, data.id)}>
                                                    <ExpandMoreIcon />
                                                </IndexChangeBtn>
                                            </div>
                                            <span>{idx + 1}.</span>
                                            <DataInputEl type="text" name='headerName' placeholder='업로드 엑셀 항목명' onChange={(e) => props.onChangeDetailInputValue(e, data.id)} value={data.headerName || data.colData || ''} required></DataInputEl>
                                        </DataText>
                                        <DeleteBox>
                                            <DeleteBtn>
                                                <CancelIcon type="button" sx={{ fontSize: 33 }}
                                                    onClick={(e) => props.handleRemoveCell(e, data.id)}
                                                />
                                            </DeleteBtn>
                                        </DeleteBox>
                                    </CreateHeaderInfo>
                                )
                            })}
                        </CreateContainer>
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
