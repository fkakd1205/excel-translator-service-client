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

const SubmitBtn = styled.button`
    border: none;
    border-radius: 50%;
    background-color: #c7cee3ee;
    margin: 10px;
`;

const HeaderInfo = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    padding: 3px 10px;
    text-align: center;
    align-items: center;
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
                                <SubmitBtn type='submit'><AddTaskIcon /></SubmitBtn>
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