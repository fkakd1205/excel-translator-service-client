import styled from "styled-components";

export const Container = styled.div`
    margin-bottom: 30px;
`;

export const BoardTitle = styled.div`
    font-size: large;
    color: rgba(000, 102, 153, 0.9);
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    padding: 10px;

    @media only screen and (max-width: 992px){
        grid-template-columns: 1fr;
        row-gap: 10px;
    }
    
    @media only screen and (max-width:576px){
        font-size: 16px;
    }

    @media only screen and (max-width:320px){
        font-size: 14px;
    }
`;

export const DataOptionBox = styled.span`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;

    @media only screen and (max-width: 992px) {
        padding: 1% 0%;
    }
`;

export const BoardContainer = styled.div`
    background-color: white;
    border-radius: 5px;
    font-size: 14px;
    overflow: auto;
    box-shadow: 1px 1px 15px #a9b3d599;

    & .fixed-header {
        position: sticky;
        top: -1px;
        background: #d5dae9;
        z-index:10;
        padding: 2px;
        font-size: 16px;

        @media only screen and (max-width:576px){
            font-size: 12px;
        }
    }

    & .large-cell {
        width: 300px;
    }

    & .xlarge-cell {
        width: 500px;
    }

    @media only screen and (max-width:576px){
        font-size: 12px;
    }
`;

export const HeaderTh = styled.th`
    vertical-align: middle !important;
    text-align: center;
    width: 150px;
    border-right: 1px solid #ffffff;
`;

export const StoreBtn = styled.button`
    padding: 2%;
    background: rgb(179 199 219);
    color: white;
    font-size: 1em;
    font-weight: 500;
    border:1px solid rgb(179 199 219);
    border-radius: 20px;
    float: right;
    grid-column-start: 2;

    @media only screen and (max-width: 992px){
        display: inline-block;
        padding: 4px;
        grid-column-start: 1;
        grid-column-end: 3;
    }

    @media only screen and (max-width:576px ){
        padding: 0;
    }

    &:hover{
        cursor: pointer;
        transition: 0.2s;
        transform: scale(1.05);
        background: rgb(160 180 200);
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);
    }
`;