import styled from "styled-components";
import AddTaskIcon from '@mui/icons-material/AddTask';

const Container = styled.div`
    background-color: #e8ecf7;
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
    grid-template-columns: 1fr 5fr;
    padding: 2%;
    background-color: white;
    border-radius: 5px;

    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

const BodyContainer = styled.div`
    padding: 10px;
    max-height: 400px;
    overflow: auto;
`;

const HeaderInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    padding: 3px 10px;
    text-align: center;
    align-items: center;
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
                        {props.uploadedExcelDataHeader[0]?.uploadedData.details?.map((data, idx) => {
                            return (
                                <HeaderInfo key={'upload_header_detail_idx' + idx} className="input-group mb-3">
                                    <DataText><span>{idx+1}.</span> <span>{data.colData}</span></DataText>
                                </HeaderInfo>
                            )
                        })}
                    </BodyContainer>
                </form>
            </Container>
        </>
    )
}

export default CreateTranslatorUploadHeaderDetailComponent;