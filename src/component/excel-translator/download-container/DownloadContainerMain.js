import { useState, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import CreateDownloadHeaderModal from "./modal/CreateDownloadHeaderModal";
import ExcelTranslatorCommonModal from "../../modal/CommonModal";
import DownloadContainerBody from "./DownloadContainerBody";
import { useLocation } from "react-router-dom";

class DownloadHeaderDetail {
    constructor() {
        this.id = uuidv4();
        this.headerName = '';
        this.targetCellNumber = -1;
        this.fixedValue = '';
        this.uploadHeaderId = null;
    }

    toJSON() {
        return {
            id: this.id,
            headerName: this.headerName,
            targetCellNumber: this.targetCellNumber,
            fixedValue: this.fixedValue,
            uploadHeaderId: this.uploadheaderId
        }
    }
}

const initialUpdateDownloadHeaderForm = null;

const updateDownloadHeaderFormReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DOWNLOAD_HEADER_DETAIL_DATA':
            return {
                ...state,
                downloadHeaderDetail: {
                    ...state.downloadHeaderDetail,
                    details: action.payload
                }
            }
        case 'ADD_DATA':
            return {
                ...state,
                downloadHeaderDetail: {
                    ...state.downloadHeaderDetail,
                    details: state.downloadHeaderDetail.details.concat(new DownloadHeaderDetail().toJSON())
                }
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

export default function DownloadContainerMain(props) {
    const location = useLocation();
    const query = queryString.parse(location.search)

    const [createHeaderModalOpen, setCreateHeaderModalOpen] = useState(false);
    const [fixedValueCheckList, setFixedValueCheckList] = useState([]);

    const [updateDownloadHeaderForm, dispatchUpdateDownloadHeaderForm] = useReducer(updateDownloadHeaderFormReducer, initialUpdateDownloadHeaderForm);
    const [selectedHeader, setSelectedHeader] = useState(null);

    useEffect(() => {
        function initHeaderTitleState() {
            let headerId = query.headerId;
            let headers = props.excelTranslatorHeaderList.find(r => r.id === headerId);
            setSelectedHeader(headers)
        }

        if (!props.excelTranslatorHeaderList) {
            return;
        }

        if(!query.headerId) {
            setSelectedHeader(null);
            return;
        }

        initHeaderTitleState();
    }, [query.headerId, props.excelTranslatorHeaderList]);

    const onCreateHeaderModalOpen = (e) => {
        e.preventDefault();

        if (!selectedHeader) {
            alert('헤더 형식을 먼저 선택해주세요.');
            return;
        } else if (!(selectedHeader.uploadHeaderDetail.details.length > 0)) {
            alert('업로드 엑셀 양식을 먼저 설정해주세요.');
            return;
        }

        dispatchUpdateDownloadHeaderForm({
            type: 'INIT_DATA',
            payload: { ...selectedHeader }
        });

        setFixedValueCheckList(selectedHeader.downloadHeaderDetail.details.map(r => {
            if (r.targetCellNumber === -1) {
                return r.id;
            }
        }));

        if (!(selectedHeader.downloadHeaderDetail.details.length > 0)) {
            dispatchUpdateDownloadHeaderForm({
                type: 'INIT_DATA',
                payload: {
                    ...selectedHeader,
                    downloadHeaderDetail: {
                        details: [new DownloadHeaderDetail().toJSON()]
                    }
                }
            });
        }

        setCreateHeaderModalOpen(true);
    }

    const onCreateHeaderModalClose = () => {
        setCreateHeaderModalOpen(false);
    }

    const handleAddCell = (e) => {
        e.preventDefault();

        dispatchUpdateDownloadHeaderForm({
            type: 'ADD_DATA'
        });
    }

    const handleRemoveCell = (e, downloadHeaderId) => {
        e.preventDefault();

        if(updateDownloadHeaderForm.downloadHeaderDetail.details.length > 1) {
            let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.filter(r=> r.id !== downloadHeaderId);
            
            dispatchUpdateDownloadHeaderForm({
                type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
                payload: newDetails
            });
        }else{
            alert('삭제할 수 없습니다.');
        }
    }

    const handleCreateDownloadHeader = async (e) => {
        e.preventDefault();

        await props.handleCreateDownloadForm(updateDownloadHeaderForm);
        
        setSelectedHeader([...updateDownloadHeaderForm])
        onCreateHeaderModalClose();
    }

    const onChangeSelectedHeaderField = (e, downloadHeaderId) => {
        e.preventDefault();

        let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.map(r => {
            if(r.id === downloadHeaderId){
                let uploadHeaderId = updateDownloadHeaderForm.uploadHeaderDetail.details.filter(uploadHeader => uploadHeader.cellNumber === e.target.value)[0].id;

                return {
                    ...r,
                    targetCellNumber : parseInt(e.target.value),
                    uploadHeaderId : uploadHeaderId
                }
            }else{
                return {
                    ...r
                }
            }
        });

        dispatchUpdateDownloadHeaderForm({
            type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
            payload: newDetails
        })
    }

    const handleIsChecked = (downloadHeaderId) => {
        return fixedValueCheckList.includes(downloadHeaderId);
    }

    const handleCheckOne = (e, downloadHeaderId) => {
        if (e.target.checked) {
            setFixedValueCheckList(fixedValueCheckList.concat(downloadHeaderId));

            // 체크하면 targetCellNumber을 -1으로 변경
            let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.map(r=>{
                if(r.id === downloadHeaderId){
                    return {
                        ...r,
                        targetCellNumber: parseInt(-1)
                    }
                }else{
                    return {
                        ...r
                    }
                }
            });

            dispatchUpdateDownloadHeaderForm({
                type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
                payload: newDetails
            })
        } else {
            setFixedValueCheckList(fixedValueCheckList.filter(r => r !== downloadHeaderId));

            // 체크 해제하면 fixedValue를 빈 값으로 변경
            let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.map(r=>{
                if(r.id === downloadHeaderId){
                    return {
                        ...r,
                        fixedValue: "",
                        targetCellNumber: parseInt(-1)
                    }
                }else{
                    return {
                        ...r
                    }
                }
            });

            dispatchUpdateDownloadHeaderForm({
                type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
                payload: newDetails
            })
        }
    }

    const onChangeHeaderFieldValue = (e, downloadHeaderId) => {
        e.preventDefault();

        let newDetails = updateDownloadHeaderForm?.downloadHeaderDetail.details.map(r => {
            if(r.id === downloadHeaderId){
                return {
                    ...r,
                    [e.target.name] : e.target.value
                }
            }else{
                return {
                    ...r
                }
            }
        });

        dispatchUpdateDownloadHeaderForm({
            type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
            payload: newDetails
        })
    }

    return (
        <>
            <DownloadContainerBody
                createHeaderModalOpen={createHeaderModalOpen}
                selectedHeader={selectedHeader}
                updateDownloadHeaderForm={updateDownloadHeaderForm}

                onCreateHeaderModalOpen={onCreateHeaderModalOpen}
            />

            {/* Create Download Header Modal */}
            <ExcelTranslatorCommonModal
                open={createHeaderModalOpen}
                onClose={() => onCreateHeaderModalClose()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <CreateDownloadHeaderModal
                    updateDownloadHeaderForm={updateDownloadHeaderForm}

                    handleAddCell={handleAddCell}
                    handleRemoveCell={handleRemoveCell}
                    handleCreateDownloadHeader={handleCreateDownloadHeader}
                    onChangeSelectedHeaderField={onChangeSelectedHeaderField}
                    handleIsChecked={handleIsChecked}
                    handleCheckOne={handleCheckOne}
                    onChangeHeaderFieldValue={onChangeHeaderFieldValue}
                ></CreateDownloadHeaderModal>
            </ExcelTranslatorCommonModal>
        </>
    )
}
