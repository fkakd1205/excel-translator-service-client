import styled from "styled-components";

export const Container = styled.div`
    .modal-header {
        background:white;
        border-radius: 5px;
        border-bottom: 1px solid #5961c788;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding:15px;
    }
`;

export const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;

    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

export const DataText = styled.div`
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    padding: 5px 10px;
    background-color: white;
    border-radius: 30px !important;
    overflow: hidden;

    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

export const BodyContainer = styled.div`
    padding: 5px;
    max-height: 500px;
    overflow: auto;
    background-color: #c1c7d7;
    overflow-x: hidden;
`;

export const CreateHeaderInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    border: 1px solid #fff;
    padding: 10px;
    width: 80%;
    border-bottom: 1px solid #ced4da;

    &:focus{
        outline: none;
        border: 1px solid #4662B4;
        background: white;
    }
`;

export const CustomDataGroup = styled.div`
    text-align: center;
    padding: 10px;

    .add-button {

        &:hover{
            transform: scale(1.1);
            cursor: pointer;
        }
    }
`;

export const DeleteBtn = styled.div`
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

    .button-el {
        border: none;
        background-color: #fff;
    }
`;

export const IndexChangeBtn = styled.div`
    &:hover{
        cursor: pointer;
        color: #7f9df3ee;
    }

    &:active{
        transition: 0s;
        color: #6286ff;
    }
`;