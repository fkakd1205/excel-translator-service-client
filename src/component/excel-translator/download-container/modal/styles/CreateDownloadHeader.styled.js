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
    position: relative;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px 16px 10px 16px;
    height: auto;
    background-color: #e8ecf7;

    & .arrow-img {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export const DataInputEl = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid white;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 10px;
`;

export const DownloadDataGroup = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    .label-el {
        width: 100px;
    }

    .input-el {
        width: 70%;
    }
`;

export const DownloadInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: white;
    padding: 20px;
    width: 100%;
    border-radius: 10px;
`;

export const DeleteBtn = styled.div`
    position: absolute;
    top: -10px;
    right: -10px;

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
        background-color: var(--default-red-color);
        border: 1px solid var(--default-red-color);
        border-radius: 50%;
        width: 30px;
        height: 30px;
    }
`;

export const DataGroup = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    padding: 5px;

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
`;

export const ArrowSpan = styled.div`
    @media only screen and (max-width:992px){
        transform: rotate(90deg);
    }
`;

export const FormInput = styled.div`
    background-color: white;
    width: 100%;
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

export const DataContainer = styled.div`
    height: 60vh;
    overflow: auto;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
`;