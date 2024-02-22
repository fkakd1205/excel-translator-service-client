import styled from "styled-components";

export const Container = styled.div`
`;

export const ItemContainer = styled.div`
`;

export const ItemWrapper = styled.div`
    background:white;
    border-radius: 5px;
`;

export const ItemHeaderWrapper = styled.div`
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

export const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    padding:15px;

    @media only screen and (max-width:425px){
        padding: 15px 0;
        font-size: 1rem;
    }
`;

export const BodyContainer = styled.div`
    padding: 10px;
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #c1c7d7;
`;

export const DataWrapper = styled.div`
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

export const DataInputEl = styled.input`
    border: none;
    padding: 10px;
    border-bottom: 1px solid #ced4da;
    &:focus{
        outline: none;
        border: 1px solid #4662B4;
        background: white;
    }
`;

export const CustomDataGroup = styled.div`
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

export const UploadDataGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 7fr;
    text-align: center;
    align-items: center;

    & .add-cell-btn {
        grid-column: span 3;
    }
`;

export const DownloadDataGroup = styled.div`
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

    @media only screen and (max-width:576px){
        grid-template-columns: 100%;
    }
`;

export const DownloadInfo = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
`;

export const DeleteBox = styled.div`
    text-align: right;
    width: 100%;
`;

export const DeleteBtn = styled.span`
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

export const DataGroup = styled.div`
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
        place-content: center;
        /* padding: 0 10%; */
    }

    @media only screen and (max-width:576px){
        grid-template-columns: 100%;
    }
`;

export const ArrowSpan = styled.div`
    @media only screen and (max-width:992px){
        transform: rotate(90deg);
    }
`;

export const FormInput = styled.div`
    color: black;
    display: flex;
    background-color: white;
    vertical-align: middle;
`;

export const CreateBtn = styled.button`
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

export const DataContainer = styled.div`
    height: 60vh;
    overflow: auto;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
`;