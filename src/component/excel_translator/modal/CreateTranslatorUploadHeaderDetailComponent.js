import styled from "styled-components";
import AddTaskIcon from '@mui/icons-material/AddTask';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    grid-template-columns: 6fr 1fr;
`;

const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    padding:15px;

    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

const DataText = styled.div`
    font-size: 1rem;
    font-weight: 500;
    display: grid;
    grid-template-columns: 1fr 1fr 5fr;
    padding: 2%;
    background-color: white;
    border-radius: 30px;
    align-items: center;

    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

const BodyContainer = styled.div`
    padding: 5px;
    max-height: 400px;
    overflow: auto;
    background-color: #c1c7d7;
    overflow-x: hidden;
`;

const CreateHeaderInfo = styled.div`
    display: grid;
    grid-template-columns: 90% 5%;
    column-gap: 10px;
    padding: 3px 10px;
    text-align: center;
    align-items: center;
`;

const CreateContainer = styled.div`
    background-color: #e8ecf7;
    height: 40vh;
    overflow: auto;
    padding: 10px;
    border-radius: 5px;
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

const DataInputEl = styled.input`
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

const IndexChangeBtn = styled.div`
    &:hover{
        transform: scale(1.2);
        cursor: pointer;
        color: #7f9df3ee;
    }

    &:active{
        transition: 0s;
        transform: scale(1.2);
        color: #6286ff;
    }
`;

const CreateTranslatorUploadHeaderDetailComponent = (props) => {
    return (
        <>
            <Container>
                <form onSubmit={(e) => props.storeUploadExcelFormControl(e)}>
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
                                                <IndexChangeBtn onClick={(e) => props.moveHeaderFormUp(e, data.id)}>
                                                    <ExpandLessIcon />
                                                </IndexChangeBtn>
                                                <IndexChangeBtn onClick={(e) => props.moveHeaderFormDown(e, data.id)}>
                                                    <ExpandMoreIcon />
                                                </IndexChangeBtn>
                                            </div>
                                            <span>{idx + 1}.</span>
                                            <DataInputEl type="text" name='headerName' placeholder='업로드 엑셀 항목명' onChange={(e) => props.onChangeUploadHeaderDetail(e, data.id)} value={data.headerName || data.colData || ''} required></DataInputEl>
                                        </DataText>
                                        <DeleteBox>
                                            <DeleteBtn>
                                                <CancelIcon type="button" sx={{ fontSize: 33 }}
                                                    onClick={(e) => props.uploadHeaderFormDeleteCell(e, data.id)}
                                                />
                                            </DeleteBtn>
                                        </DeleteBox>
                                    </CreateHeaderInfo>
                                )
                            })}
                        </CreateContainer>
                        <CustomDataGroup>
                            <AddCircleOutlineIcon type="button" sx={{ fontSize: 30 }}
                                onClick={(e) => props.uploadHeaderFormAddCell(e)}
                            />
                        </CustomDataGroup>
                    </BodyContainer>
                </form>
            </Container>
        </>
    )
}

export default CreateTranslatorUploadHeaderDetailComponent;