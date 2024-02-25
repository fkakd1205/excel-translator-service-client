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
    grid-template-columns: 6fr 1fr;
`;

export const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    padding:15px;

    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

export const DataText = styled.div`
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

export const BodyContainer = styled.div`
    padding: 5px;
    max-height: 400px;
    overflow: auto;
    background-color: #c1c7d7;
    overflow-x: hidden;
`;

export const CreateHeaderInfo = styled.div`
    display: grid;
    grid-template-columns: 90% 5%;
    column-gap: 10px;
    padding: 3px 10px;
    text-align: center;
    align-items: center;
`;

export const CreateContainer = styled.div`
    background-color: #e8ecf7;
    height: 40vh;
    overflow: auto;
    padding: 10px;
    border-radius: 5px;
`;

export const CreateBtn = styled.button`
    background: var(--main-color);
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

export const DataInputEl = styled.input`
    border: none;
    width: 90%;
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

export const IndexChangeBtn = styled.div`
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